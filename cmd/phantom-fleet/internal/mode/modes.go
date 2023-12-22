package mode

import (
	"fmt"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api"
	"phantom-fleet/cmd/phantom-fleet/internal/mode/file"
	"phantom-fleet/config"
	"phantom-fleet/pkg/telemetry"
)

type Executor interface {
	Run(conn *telemetry.Connection, config *config.Config) error
}

func Run(conn *telemetry.Connection, config *config.Config) error {
	switch config.Mode {
	case "file":
		return file.Run(conn, config)
	case "api":
		return api.Run(conn, config)
	default:
		return fmt.Errorf("invalid mode: %s", config.Mode)
	}
}
