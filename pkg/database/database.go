package database

import (
	"crypto/tls"
	"phantom-fleet/pkg/cert"
	message "phantom-fleet/pkg/msg"
)

type Field struct {
	IntervalSeconds int `json:"interval_seconds"`
}

type FleetTelemetryConfig struct {
	Hostname   string           `json:"hostname"`
	Port       int              `json:"port"`
	CA         string           `json:"ca"`
	Fields     map[string]Field `json:"fields"`
	AlertTypes []string         `json:"alert_types"`
	Expiration int              `json:"expiration"`
}

type Datastore interface {
	SetConfiguration(vin string, config FleetTelemetryConfig) error
	SetConfigurations(vins []string, config FleetTelemetryConfig) error
	SaveCertificate(identifier string, certificate tls.Certificate) error
	GetCertificate(vin string) (*tls.Certificate, error)
	SaveCA(*cert.CA) error
	GetCA() (*cert.CA, error)
	GetAllVehicles() ([]DeviceConfig, error)
	SetVehicleData(vin string, data []message.Data) error
	DeleteVehicle(vin string) error
}

type DeviceConfig struct {
	Vin    string               `json:"vin" bson:"vin"`
	Config FleetTelemetryConfig `json:"config" bson:"config"`
	Data   []message.Data       `json:"data" bson:"data"`
}
