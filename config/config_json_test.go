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
			}
		}
	}`

	noModeConfig = `{
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443
			}
		}
	}`

	negativeDelay = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": -1,
			"server": {
				"host": "app",
				"port": 4443
			}
		}
	}`

	invalidMode = `{
		"mode": "invalid-mode",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443
			}
		}
	}`

	negativeFileServerPort = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": -4443
			}
		}
	}`

	zeroServerPort = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 0
			}
		}
	}`

	missingHost = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "",
				"port": 4443
			}
		}
	}`

	zeroApiPort = `{
		"mode": "api",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443
			}
		}
	}`

	negativeApiPort = `{
		"mode": "file",
		"file": {
			"path": "test_config.json",
			"delay": 10,
			"server": {
				"host": "app",
				"port": 4443
			}
		}
	}`
)
