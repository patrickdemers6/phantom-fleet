package file

import (
	"fmt"
	"time"

	"phantom-fleet/config"
	message "phantom-fleet/pkg/msg"
	"phantom-fleet/pkg/telemetry"
)

// Run executes file mode
func Run(conn telemetry.Connection, config *config.Config) error {
	msgs, err := message.LoadFromJson(config.Source.File.Path, config.Fs)
	if err != nil {
		return fmt.Errorf("error reading json message file: %w", err)
	}

	sendMessages(conn, msgs, config.Source.File.Delay)

	return nil
}

func sendMessages(s telemetry.Connection, messages []*message.Message, delay int) {
	for i, m := range messages {
		s.Publish(m)
		if i != len(messages)-1 {
			time.Sleep(time.Duration(delay) * time.Second)
		}
	}
}
