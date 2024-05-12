package file

import (
	"fmt"
	"phantom-fleet/config"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
	message "phantom-fleet/pkg/msg"
	"time"
)

var (
	NewManager = device.NewManager
)

// Run executes file mode
func Run(config *config.Config) error {
	msgs, err := message.LoadFromJson(config.File.Path, config.Fs)
	if err != nil {
		return fmt.Errorf("error reading json message file: %w", err)
	} else if len(msgs) == 0 {
		return nil
	}

	deviceManager := device.NewManager()
	dataStore, err := database.NewMongoClient()
	if err != nil {
		return err
	}
	certManager, err := cert.NewManager(dataStore)
	if err != nil {
		return err
	}

	ca := certManager.CaToPem()

	return sendMessages(deviceManager, msgs, config.File, ca, certManager)
}

func sendMessages(manager *device.Manager, messages []*message.Message, config *config.FileModeConfig, ca string, certManager *cert.Manager) error {
	for i, m := range messages {
		conn := manager.Get(m.VIN)
		if conn == nil {
			var err error
			conn, err = device.NewVehicle(m.VIN, database.FleetTelemetryConfig{Hostname: config.Server.Host, Port: config.Server.Port, CA: ca}, certManager)
			if err != nil {
				return err
			}
		}

		conn.Publish(m)
		if i != len(messages)-1 {
			time.Sleep(time.Duration(config.Delay) * time.Second)
		}
	}
	return nil
}
