package config_test

const (
	completeConfig = `{
		"mode": "file",
			"file": {
				"path": "test_config.json",
				"delay": 10,
				"server": {
					"host": "app",
					"port": 4443,
					"tls_directory": "anything"
				}
			},
			"api": {
				"port": 3000,
				"server": {
					"host": "app",
					"port": 4443
				}
			}
		}
	}`

	noModeConfig = `{
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 3000
		}
	}`

	negativeDelay = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": -1,
			"server": {
				"host": "app",
				"port": 4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 3000
		}
	}`

	invalidMode = `{
		"mode": "invalid-mode",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 3000
		}
	}`

	missingTlsDirectory = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443,
				"tls_directory": ""
			}
		},
		"api": {
			"port": 3000
		}
	}`

	negativeFileServerPort = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": -4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 3000
		}
	}`

	zeroServerPort = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 0,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 3000
		}
	}`

	missingHost = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "",
				"port": 4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 3000
		}
	}`

	zeroApiPort = `{
		"mode": "api",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": 0
		}
	}`

	negativeApiPort = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443,
				"tls_directory": "anything"
			}
		},
		"api": {
			"port": -3000
		}
	}`
)
