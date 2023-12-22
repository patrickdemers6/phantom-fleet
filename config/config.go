package config

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/spf13/afero"
)

// FileSource defines the configuration for the file source.
type FileSource struct {
	Path  string `json:"path"`
	Delay int    `json:"delay"`
}

// APIConfig defines the configuration for the API source.
type APIConfig struct {
	Port int `json:"port"`
}

// Source defines configs for each data source possible.
type Source struct {
	File *FileSource `json:"file,omitempty"`
	API  *APIConfig  `json:"api,omitempty"`
}

// Config defines the phantom-fleet configuration.
type Config struct {
	Server   ServerConfig `json:"server"`
	Source   Source       `json:"source"`
	Provider string       `json:"provider"`
	Mode     string       `json:"mode"`
	Fs       afero.Fs
}

// ServerConfig represents the server configuration.
type ServerConfig struct {
	Host string    `json:"host,omitempty"`
	Port int       `json:"port,omitempty"`
	TLS  TLSServer `json:"tls,omitempty"`
}

// TLSServer represents the TLS configuration for the server.
type TLSServer struct {
	ServerCert string `json:"server_cert,omitempty"`
	ServerKey  string `json:"server_key,omitempty"`
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
		configFile = "./config.json"
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

	if config.Source.File != nil && delay != -1 {
		config.Source.File.Delay = delay
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
				if config.Source.File == nil {
					config.Source.File = &FileSource{}
				}
				if strings.HasSuffix(args[1], ".json") {
					config.Source.File.Path = args[1]
				} else {
					config.Source.File.Path = fmt.Sprintf("./messages/%s.json", args[1])
				}
			} else {
				return fmt.Errorf("expected message name or path to message file")
			}
		} else if config.Mode == "api" {
			if config.Source.API == nil {
				config.Source.API = &APIConfig{
					Port: 8080,
				}
			}
		}
	} else if config.Mode == "" {
		config.Mode = "api"
	}
	return nil
}

func (c *Config) Validate() error {
	if c.Server.TLS.ServerCert == "" {
		return fmt.Errorf("server cert is required")
	}
	if c.Server.TLS.ServerKey == "" {
		return fmt.Errorf("server key is required")
	}
	if c.Server.Port == 0 {
		return fmt.Errorf("server port is required")
	}
	if c.Server.Port < 0 {
		return fmt.Errorf("server port must be positive")
	}
	if c.Server.Host == "" {
		return fmt.Errorf("host is required")
	}
	if c.Source.File != nil && c.Source.File.Delay < 0 {
		return fmt.Errorf("delay must be positive")
	}
	if c.Source.API != nil && c.Source.API.Port == 0 {
		return fmt.Errorf("api port is required")
	}
	if c.Source.API != nil && c.Source.API.Port < 0 {
		return fmt.Errorf("api port must be positive")
	}
	if c.Mode != "api" && c.Mode != "file" {
		return fmt.Errorf("invalid mode, expected 'api' or 'file'")
	}
	return nil
}
