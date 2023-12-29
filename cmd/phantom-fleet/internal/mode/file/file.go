package file

import (
	"crypto/tls"
	"fmt"
	"path"
	"time"

	"phantom-fleet/config"
	message "phantom-fleet/pkg/msg"
	"phantom-fleet/pkg/telemetry"

	"github.com/spf13/afero"
)

var (
	NewManager = telemetry.NewManager
)

// Run executes file mode
func Run(config *config.Config) error {
	msgs, err := message.LoadFromJson(config.File.Path, config.Fs)
	if err != nil {
		return fmt.Errorf("error reading json message file: %w", err)
	} else if len(msgs) == 0 {
		return nil
	}

	manager := NewManager(config, config.File.Server.Host, config.File.Server.Port)
	return sendMessages(manager, msgs, config)
}

func newConnection(m *telemetry.Manager, c *config.Config, msg *message.Message) (telemetry.Connection, error) {
	tlsDir := c.File.Server.TlsDirectory
	certPath := path.Join(tlsDir, fmt.Sprintf("%s.%s.cert", msg.DeviceType, msg.VIN))
	keyPath := path.Join(tlsDir, fmt.Sprintf("%s.%s.key", msg.DeviceType, msg.VIN))

	certBytes, err := afero.ReadFile(c.Fs, certPath)
	if err != nil {
		return nil, err
	}
	keyBytes, err := afero.ReadFile(c.Fs, keyPath)
	if err != nil {
		return nil, err
	}

	tls, err := tls.X509KeyPair(certBytes, keyBytes)
	if err != nil {
		return nil, err
	}
	return m.Create(msg.VIN, tls)
}

func sendMessages(manager *telemetry.Manager, messages []*message.Message, config *config.Config) error {
	for i, m := range messages {
		conn := manager.Get(m.VIN)
		if conn == nil {
			var err error
			conn, err = newConnection(manager, config, m)
			if err != nil {
				return err
			}
		}

		conn.Publish(m)
		if i != len(messages)-1 {
			time.Sleep(time.Duration(config.File.Delay) * time.Second)
		}
	}
	return nil
}
