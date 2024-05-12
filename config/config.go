package config

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/spf13/afero"
)

// Config defines the phantom-fleet configuration.
type Config struct {
	Mode     string          `json:"mode"`
	File     *FileModeConfig `json:"file,omitempty"`
	Fs       afero.Fs
}

// FileModeConfig defines the configuration for the file source.
type FileModeConfig struct {
	Path   string       `json:"path"`
	Delay  int          `json:"delay"`
	Server ServerConfig `json:"server"`
}

// ServerConfig represents the fleet-telemetry server.
type ServerConfig struct {
	Host         string `json:"host,omitempty"`
	Port         int    `json:"port,omitempty"`
}

// LoadConfig reads the configuration.
func LoadConfig(fs afero.Fs) (*Config, error) {
	var configFile, messagePath string
	var delay int
	flag.StringVar(&configFile, "config", "", "Path to the config file")
	flag.StringVar(&messagePath, "message", "", "Name of message file or path to message file")
	flag.IntVar(&delay, "delay", -1, "Delay between messages")
	flag.Parse()

	if configFile == "" {
		if envConfigFile := os.Getenv("CONFIG_FILE"); envConfigFile != "" {
			configFile = envConfigFile
		}
	}

	if configFile == "" {
		configFile = "config.json"
	}

	file, err := fs.Open(configFile)
	if err != nil {
		return nil, fmt.Errorf("failed to open config file: %v", err)
	}
	defer file.Close()

	var config Config
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&config)
	if err != nil {
		return nil, fmt.Errorf("failed to decode config: %v", err)
	}

	if config.File != nil && delay != -1 {
		config.File.Delay = delay
	}

	err = processArgs(&config)
	if err != nil {
		return nil, err
	}

	err = config.Validate()
	if err != nil {
		return nil, err
	}
	config.Fs = fs
	return &config, nil
}

func processArgs(config *Config) error {
	args := flag.Args()
	if len(args) > 2 {
		return fmt.Errorf("too many arguments")
	}
	if len(args) > 0 {
		config.Mode = args[0]
		if config.Mode == "file" {
			if len(args) == 2 {
				if config.File == nil {
					config.File = &FileModeConfig{}
				}
				if strings.HasSuffix(args[1], ".json") {
					config.File.Path = args[1]
				} else {
					config.File.Path = fmt.Sprintf("./messages/%s.json", args[1])
				}
			} else {
				return fmt.Errorf("expected message name or path to message file")
			}
		}
	} else if config.Mode == "" {
		config.Mode = "api"
	}
	return nil
}

func (c *Config) Validate() error {
	if c.Mode != "file" && c.Mode != "api" {
		return fmt.Errorf("invalid mode, expected 'api' or 'file'")
	}
	if c.File != nil {
		if c.File.Server.Port == 0 {
			return fmt.Errorf("server port is required")
		}
		if c.File.Server.Port < 0 {
			return fmt.Errorf("server port must be positive")
		}
		if c.File.Server.Host == "" {
			return fmt.Errorf("host is required")
		}
		if c.File.Delay < 0 {
			return fmt.Errorf("delay must be positive")
		}
	}
	return nil
}
