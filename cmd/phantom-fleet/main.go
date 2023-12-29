package main

import (
	"log"

	"phantom-fleet/cmd/phantom-fleet/internal/mode"
	"phantom-fleet/config"

	"github.com/spf13/afero"
)

func main() {
	fs := afero.NewOsFs()
	config, err := config.LoadConfig(fs)
	if err != nil {
		log.Fatalf("error loading configuration: %s", err)
	}

	if err := mode.Run(config.Mode, config); err != nil {
		log.Fatalf("error running mode %s: %s", config.Mode, err)
	}
}
