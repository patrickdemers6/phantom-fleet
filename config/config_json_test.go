package config_test

const (
	completeConfig = `{
		"server": {
			"host": "app",
			"port": 4443,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		},
		"mode": "file",
		"source": {
			"file": {
				"path": "test_config.json",
				"delay": 10
			}
		}
	}`

	noModeConfig = `{
		"server": {
			"host": "app",
			"port": 4443,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		}
	}`

	negativeDelay = `{
		"server": {
			"host": "app",
			"port": 4443,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		},
		"mode": "file",
		"source": {
			"file": {
				"path": "test_config.json",
				"delay": -1
			}
		}
	}`

	invalidMode = `{
		"server": {
			"host": "app",
			"port": 4443,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		},
		"mode": "invalid",
		"source": {
			"file": {
				"path": "test_config.json",
				"delay": 1
			}
		}
	}`

	missingServerCert = `{
		"server": {
			"host": "app",
			"port": 4443,
			"tls": {
				"server_cert": "",
				"server_key": "anything"
			}
		}
	}`

	missingServerKey = `{
		"server": {
			"host": "app",
			"port": 4443,
			"tls": {
				"server_cert": "something",
				"server_key": ""
			}
		}
	}`

	negativePort = `{
		"server": {
			"host": "app",
			"port": -1,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		}
	}`

	zeroServerPort = `{
		"server": {
			"host": "app",
			"port": 0,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		}
	}`

	missingHost = `{
		"server": {
			"host": "",
			"port": 443,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		}
	}`

	zeroApiPort = `{
		"server": {
			"host": "app",
			"port": 1,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		},
		"mode": "api",
		"source": {
			"api": {
				"port": 0
			}
		}
	}`

	negativeApiPort = `{
		"server": {
			"host": "app",
			"port": 1,
			"tls": {
				"server_cert": "something",
				"server_key": "anything"
			}
		},
		"mode": "api",
		"source": {
			"api": {
				"port": -1
			}
		}
	}`
)
