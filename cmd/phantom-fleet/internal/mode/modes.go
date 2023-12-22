package mode

import (
	"fmt"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api"
	"phantom-fleet/cmd/phantom-fleet/internal/mode/file"
	"phantom-fleet/config"
	"phantom-fleet/pkg/telemetry"
)

// Executor runs a given mode
type Executor interface {
	Run(conn telemetry.Connection, config *config.Config) error
}

// Run executes a run mode based on config.Mode
func Run(conn telemetry.Connection, config *config.Config) error {
	switch config.Mode {
	case "file":
		return file.Run(conn, config)
	case "api":
		return api.Run(conn, config)
	default:
		return fmt.Errorf("invalid mode: %s", config.Mode)
	}
}
