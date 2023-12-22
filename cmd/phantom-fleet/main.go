package main

import (
	"log"

	"phantom-fleet/cmd/phantom-fleet/internal/mode"
	"phantom-fleet/config"
	"phantom-fleet/pkg/telemetry"

	"github.com/spf13/afero"
)

func main() {
	fs := afero.NewOsFs()
	config, err := config.LoadConfig(fs)
	if err != nil {
		log.Fatalf("error loading configuration: %s", err)
	}

	conn, err := telemetry.NewConnection(config)
	if err != nil {
		log.Fatalf("error creating connection to server: %s", err)
	}
	defer conn.Shutdown()

	if err := mode.Run(conn, config); err != nil {
		log.Fatalf("error running mode %s: %s", config.Mode, err)
	}
}
