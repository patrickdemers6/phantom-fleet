package mode

import (
	"fmt"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api"
	"phantom-fleet/cmd/phantom-fleet/internal/mode/file"
	"phantom-fleet/config"
)

// Executor runs a given mode
type Executor interface {
	Run(config *config.Config) error
}

// Run executes a run mode
func Run(mode string, c *config.Config) error {
	switch c.Mode {
	case "file":
		return file.Run(c)
	case "api":
		return api.Run(c)
	default:
		return fmt.Errorf("invalid mode: %s", mode)
	}
}
