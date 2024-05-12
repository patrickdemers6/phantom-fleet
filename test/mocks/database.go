package mocks

import (
	"crypto/tls"
	"github.com/stretchr/testify/mock"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/database"
	message "phantom-fleet/pkg/msg"
)

type Database struct {
	mock.Mock
	DeviceConfig map[string]*database.DeviceConfig
	Certificates map[string]*tls.Certificate
	CA *cert.CA
}

func NewDatabase() *Database {
	return &Database{
		DeviceConfig: make(map[string]*database.DeviceConfig),
	}
}

type MongoCert struct {
	Identifier  string `json:"identifier,omitempty" bson:"identifier,omitempty"`
	Certificate []byte `json:"certificate,omitempty" bson:"certificate,omitempty"`
	PrivateKey  []byte `json:"private_key,omitempty" bson:"private_key,omitempty"`
}

func (m *Database) SetConfiguration(vin string, config database.FleetTelemetryConfig) error {
	if m.DeviceConfig[vin] != nil {
		m.DeviceConfig[vin].Config = config
	} else {
		m.DeviceConfig[vin] = &database.DeviceConfig{
			Config: config,
			Vin: vin,
			Data: make([]message.Data, 0),
		}
	}

	return nil
}

func (m *Database) SetConfigurations(vins []string, config database.FleetTelemetryConfig) error {
	for _, vin := range vins {
		if err := m.SetConfiguration(vin, config); err != nil {
			return err
		}
	}
	return nil
}

func (m *Database) SetVehicleData(vin string, data []message.Data) error {
	m.DeviceConfig[vin].Data = data
	return nil
}

func (m *Database) GetCertificate(identifier string) (*tls.Certificate, error) {
	return m.Certificates[identifier], nil
}

func (m *Database) SaveCertificate(identifier string, certificate tls.Certificate) error {
	m.Certificates[identifier] = &certificate
	return nil
}

func (m *Database) SaveCA(ca *cert.CA) error {
	m.CA = ca
	return nil
}

func (m *Database) GetCA() (*cert.CA, error) {
	return m.CA, nil
}

func (m *Database) GetAllVehicles() ([]database.DeviceConfig, error) {
	data := make([]database.DeviceConfig, 0)
	for _, config := range m.DeviceConfig {
		data = append(data, *config)
	}
	return data, nil
}

func (m *Database) DeleteVehicle(vin string) error {
	delete(m.DeviceConfig, vin)
	return nil
}
