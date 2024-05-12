package database

import (
	"context"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"phantom-fleet/pkg/cert"
	message "phantom-fleet/pkg/msg"
)

type Mongo struct {
	client *mongo.Client
}

const (
	MONGO_DB          = "phantom_fleet"
	DEVICE_COLLECTION = "devices"
	CERT_COLLECTION   = "certs"
)

type MongoCert struct {
	Identifier  string `json:"identifier,omitempty" bson:"identifier,omitempty"`
	Certificate []byte `json:"certificate,omitempty" bson:"certificate,omitempty"`
	PrivateKey  []byte `json:"private_key,omitempty" bson:"private_key,omitempty"`
}

func NewMongoClient() (Datastore, error) {
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("Set your 'MONGO_URI' environment variable. " +
			"See: " +
			"www.mongodb.com/docs/drivers/go/current/usage-examples/#environment-variable")
	}
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	return &Mongo{client: client}, nil
}
func (m *Mongo) SetConfiguration(vin string, config FleetTelemetryConfig) error {
	_, err := m.client.Database(MONGO_DB).Collection(DEVICE_COLLECTION).UpdateOne(context.Background(), bson.M{"vin": vin}, bson.D{{"$set", DeviceConfig{Vin: vin, Config: config}}}, options.Update().SetUpsert(true))
	if err != nil {
		return err
	}
	return nil
}

func (m *Mongo) SetConfigurations(vins []string, config FleetTelemetryConfig) error {
	s, err := m.client.StartSession()
	if err != nil {
		return err
	}
	defer s.EndSession(context.Background())

	_, err = s.WithTransaction(context.Background(), func(ctx mongo.SessionContext) (interface{}, error) {
		for _, vin := range vins {
			err := m.SetConfiguration(vin, config)
			if err != nil {
				return nil, err
			}
		}
		return nil, nil
	})

	return err
}

func (m *Mongo) SetVehicleData(vin string, data []message.Data) error {
	_, err := m.client.Database(MONGO_DB).Collection(DEVICE_COLLECTION).UpdateOne(context.Background(), bson.M{"vin": vin}, bson.D{{"$set", bson.M{"data": data}}})
	if err != nil {
		return err
	}
	return nil
}

func (m *Mongo) getDevice(filter interface{}) (*DeviceConfig, error) {
	result := m.client.Database(MONGO_DB).Collection(DEVICE_COLLECTION).FindOne(context.Background(), filter)
	if result.Err() != nil {
		return nil, result.Err()
	}
	var cert DeviceConfig
	result.Decode(&cert)
	return &cert, nil
}

func (m *Mongo) getDevices(filter interface{}) ([]DeviceConfig, error) {
	result, err := m.client.Database(MONGO_DB).Collection(DEVICE_COLLECTION).Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}

	devices := make([]DeviceConfig, 0)
	for result.Next(context.TODO()) {
		var device DeviceConfig
		if err := result.Decode(&device); err != nil {
			return nil, err
		}
		devices = append(devices, device)
	}

	return devices, nil
}

func (m *Mongo) getCertificate(filter interface{}) (*MongoCert, error) {
	result := m.client.Database(MONGO_DB).Collection(CERT_COLLECTION).FindOne(context.Background(), filter)
	if result.Err() != nil {
		return nil, result.Err()
	}
	raw, err := result.Raw()
	if err != nil {
		return nil, err
	}
	var cert MongoCert
	err = bson.Unmarshal(raw, &cert)
	return &cert, err
}

func (m *Mongo) GetCertificate(identifier string) (*tls.Certificate, error) {
	dbCert, err := m.getCertificate(bson.M{"identifier": identifier})
	if err != nil {
		return nil, err
	}

	cert, err := DeserializeCertificate(dbCert.Certificate, dbCert.PrivateKey)
	if err != nil {
		return nil, err
	}

	return &cert, nil
}

func (m *Mongo) SaveCertificate(identifier string, certificate tls.Certificate) error {
	certBytes, err := SerializeCertificate(certificate)
	if err != nil {
		return err
	}
	privateKey, err := SerializePrivateKey(certificate.PrivateKey.(*rsa.PrivateKey))

	_, err = m.client.Database(MONGO_DB).Collection(CERT_COLLECTION).InsertOne(context.Background(), bson.M{"identifier": identifier, "private_key": privateKey, "certificate": certBytes})
	return err
}

func (m *Mongo) SaveCA(ca *cert.CA) error {
	privateKeyPem, err := SerializePrivateKey(ca.PrivateKey)
	if err != nil {
		return err
	}
	certBytes := ca.Certificate.Raw
	_, err = m.client.Database(MONGO_DB).Collection(CERT_COLLECTION).InsertOne(context.Background(), bson.M{"identifier": "ROOT_CA", "private_key": privateKeyPem, "certificate": certBytes})
	return err
}

func (m *Mongo) GetCA() (*cert.CA, error) {
	dbCert, err := m.getCertificate(bson.M{"identifier": "ROOT_CA"})
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	privateKey, err := DeserializePrivateKey(dbCert.PrivateKey)
	if err != nil {
		return nil, err
	}

	return &cert.CA{
		Certificate: &x509.Certificate{
			Raw: dbCert.Certificate,
		},
		PrivateKey: privateKey,
	}, nil
}

func (m *Mongo) GetAllVehicles() ([]DeviceConfig, error) {
	return m.getDevices(bson.M{})
}

func (m *Mongo) DeleteVehicle(vin string) error {
	_, err := m.client.Database(MONGO_DB).Collection(DEVICE_COLLECTION).DeleteOne(context.Background(), bson.M{"vin": vin})
	return err
}

func SerializeCertificate(cert tls.Certificate) ([]byte, error) {
	if len(cert.Certificate) == 0 {
		return nil, errors.New("no certificate found in tls.Certificate")
	}

	pemData := pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: cert.Certificate[0]})
	return pemData, nil
}

// DeserializeCertificate deserializes a tls.Certificate from PEM format
func DeserializeCertificate(data []byte, key []byte) (tls.Certificate, error) {
	pemBlock, _ := pem.Decode(data)
	if pemBlock == nil {
		return tls.Certificate{}, errors.New("failed to decode PEM block containing certificate")
	}

	certificate, err := tls.X509KeyPair(data, key)
	if err != nil {
		return tls.Certificate{}, fmt.Errorf("failed to parse X.509 certificate: %v", err)
	}

	return certificate, nil
}

// SerializePrivateKey serializes a private key to PEM format
func SerializePrivateKey(key *rsa.PrivateKey) ([]byte, error) {
	keyBytes := x509.MarshalPKCS1PrivateKey(key)
	pemData := pem.EncodeToMemory(&pem.Block{Type: "RSA PRIVATE KEY", Bytes: keyBytes})
	return pemData, nil
}

// DeserializePrivateKey deserializes a private key from PEM format
func DeserializePrivateKey(data []byte) (*rsa.PrivateKey, error) {
	pemBlock, _ := pem.Decode(data)
	if pemBlock == nil {
		return nil, errors.New("failed to decode PEM block containing private key")
	}

	key, err := x509.ParsePKCS1PrivateKey(pemBlock.Bytes)
	if err != nil {
		return nil, fmt.Errorf("failed to parse RSA private key: %v", err)
	}

	return key, nil
}
