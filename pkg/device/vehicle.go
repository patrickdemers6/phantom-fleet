package device

import (
	"crypto/tls"
	"fmt"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/connection"
	"phantom-fleet/pkg/database"
	message "phantom-fleet/pkg/msg"
)

const (
	MaxVehicleErrors = 10
)

type Vehicle struct {
	Certificate   tls.Certificate
	Connection    telemetry.Connection
	Configuration database.FleetTelemetryConfig
	Vin           string
	errors []error
}

func NewVehicle(vin string, config database.FleetTelemetryConfig, certManager *cert.Manager) (*Vehicle, error) {
	cert, err := certManager.IssueCertificate(vin)
	if err != nil {
		return nil, err
	}

	connection, _ := telemetry.NewConnection(config.Hostname, config.Port, config.CA, *cert)

	return &Vehicle{
		Certificate:   *cert,
		Connection:    connection,
		Configuration: config,
		Vin:           vin,
		errors: make([]error, 0),
	}, nil
}

func (v *Vehicle) Connect() bool {
	connection, err := telemetry.NewConnection(v.Configuration.Hostname, v.Configuration.Port, v.Configuration.CA, v.Certificate)
	if err != nil {
		v.handleError(err)
		return false
	}

	v.Connection = connection
	return true
}

func (v *Vehicle) Publish(msg *message.Message) {
	if v.Connection == nil {
		if !v.Connect() {
			return // connecting failed, cannot publish
		}
	}

	err := v.Connection.Publish(msg)
	if err != nil {
		v.handleError(err)
	}
}

func (v *Vehicle) handleError(err error) {
	errors := v.errors
	fmt.Println(err)
	if len(errors) == MaxVehicleErrors {
		errors = errors[1:]
	}

	v.errors = append(errors, err)
}

func (v *Vehicle) Shutdown() {
	if v.Connection != nil {
		v.Connection.Shutdown()
	}
}

func (v *Vehicle) GetIdentifier() string {
	return v.Vin
}

func (v *Vehicle) Errors() []error {
	return v.errors
}
