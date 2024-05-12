package test

import (
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
	message "phantom-fleet/pkg/msg"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/gomega"
)

type Environment struct {
	CertManager *cert.Manager
	DataStore *mocks.Database
	DeviceManager *device.Manager
}

const (
	DefaultVin = "VIN"
	DefaultHost = "test.com"
	DefaultPort = 4443
)

func BaseEnvironment() *Environment {
	dm := device.NewManager()
	db := mocks.NewDatabase()
	cm, err := cert.NewManager(nil)
	Expect(err).ToNot(HaveOccurred())

	env := &Environment{
		DataStore: db,
		DeviceManager: dm,
		CertManager: cm,
	}
	env.AddVehicle(DefaultVin)

	return env
}

func (e *Environment) AddVehicle(vin string) {
	vehicle := device.Vehicle{
		Vin: vin,
		Configuration: database.FleetTelemetryConfig{
			Hostname: vin,
			Port:     DefaultPort,
			CA:       e.CertManager.CaToPem(),
			Fields:   map[string]database.Field{"Soc": {
				IntervalSeconds: 30,
			}},
		},
	}
	soc := "10"
	e.DataStore.DeviceConfig[vin] = &database.DeviceConfig{
		Vin: vin,
		Config: database.FleetTelemetryConfig{Hostname: DefaultHost, Port: DefaultPort},
		Data: []message.Data{{Key: "Soc", Value: message.Value{StringValue: &soc} }},
	}
	e.DeviceManager.Add(&vehicle)
}