package cert

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"time"
)

type Manager struct {
	CA    *CA
	Store Provider
}

type CA struct {
	Certificate *x509.Certificate
	PrivateKey  *rsa.PrivateKey
}

type Provider interface {
	GetCertificate(vin string) (*tls.Certificate, error)
	SaveCertificate(identifier string, certificate tls.Certificate) error
	SaveCA(*CA) error
	GetCA() (*CA, error)
}

func NewManager(ds Provider) (*Manager, error) {
	var ca *CA
	var err error
	// TODO: support dummy provider
	if ds != nil {
		ca, err = ds.GetCA()
		if err != nil {
			return nil, err
		}
	}

	if ca == nil {
		ca, err = newCA()
		if err != nil {
			return nil, err
		}

		if ds != nil {
			ds.SaveCA(ca)
		}
	}

	certManager := Manager{
		CA:    ca,
		Store: ds,
	}

	fmt.Printf("Certificate Authority (configure fleet-telemetry server with this)\n\n%s", certManager.CaToPem())

	return &certManager, nil
}

func (cm *Manager) IssueCertificate(commonName string) (*tls.Certificate, error) {
	if cm.Store != nil {
		existingCert, _ := cm.Store.GetCertificate(commonName)
		if existingCert != nil {
			return existingCert, nil
		}
	}

	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}

	template := x509.Certificate{
		SerialNumber: big.NewInt(time.Now().Unix()),
		Subject: pkix.Name{
			CommonName:   commonName,
			Organization: []string{"phantom-fleet"},
		},
		NotBefore:             time.Now(),
		NotAfter:              time.Now().AddDate(1, 0, 0),
		KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth},
		BasicConstraintsValid: true,
	}

	certBytes, err := x509.CreateCertificate(rand.Reader, &template, cm.CA.Certificate, &privateKey.PublicKey, cm.CA.PrivateKey)
	if err != nil {
		return nil, err
	}

	cert, err := x509.ParseCertificate(certBytes)
	if err != nil {
		return nil, err
	}

	tlsCert := tls.Certificate{PrivateKey: privateKey, Certificate: [][]byte{cert.Raw}}

	if cm.Store != nil {
		cm.Store.SaveCertificate(commonName, tlsCert)
	}

	return &tlsCert, nil
}

func (cm *Manager) CaToPem() string {
	return string(pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: cm.CA.Certificate.Raw}))
}

func newCA() (*CA, error) {
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}

	template := x509.Certificate{
		SerialNumber: big.NewInt(time.Now().Unix()),
		Subject: pkix.Name{
			Organization: []string{"phantom-fleet"},
			// fleet-telemetry requires this common name
			CommonName: "TeslaMotors",
		},
		IsCA:                  true,
		KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageCertSign | x509.KeyUsageKeyEncipherment,
		BasicConstraintsValid: true,
		NotBefore:             time.Now(),
		NotAfter:              time.Now().AddDate(1, 0, 0),
	}
	// Create a certificate based on the template
	certBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &privateKey.PublicKey, privateKey)
	if err != nil {
		return nil, err
	}

	cert, err := x509.ParseCertificate(certBytes)
	if err != nil {
		return nil, err
	}

	return &CA{
		PrivateKey:  privateKey,
		Certificate: cert,
	}, nil
}
