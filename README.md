# Phantom Fleet

Validate, develop, and EleVate your Tesla Fleet Telemetry Server integration with Phantom Fleet!

Are you integrating with Tesla's fleet-telemetry server but don't have a fleet of Tesla vehicles at your disposal? Fear not! Phantom Fleet allows you to develop and validate your use case without the need for a real Tesla on hand.

# Getting Started

Phantom Fleet takes messages from input sources and sends the messages to the fleet-telemetry server. These messages simulate data that would be received from a real life vehicle.

At present, only one source is supported:

- **File**: A JSON file with an array of messages. See an example in [messages/change-vehicle-name.json](messages/change-vehicle-name.json)

**Configuring a File Source**

1. Have a `fleet-telemetry` server running which you would like to send data to.
2. Create `config.json`
   - Certificates are required as fleet-telemetry requires mTLS connections. Generate test certificates in `fleet-telemetry` by running `make generate-certs`. The created `vehicle_device.CA.cert` and `vehicle_device.CA.key` files should be referenced in `config.json`.
   - A hostname is required and an IP address will fail. [See here for help on Linux](https://unix.stackexchange.com/questions/55691/how-to-add-an-ip-to-hostname-file).
3. Build phantom-fleet: run `make build`.
4. Run `./phantom-fleet`. This uses `config.json` for configuration by default. See below for customization options.

# Configuration

The configuration file has the following general format:

```json
{
  "server": {
    "host": "app",
    "port": 4443,
    "tls": {
      "server_cert": "../fleet-telemetry/test/integration/test-certs/vehicle_device.CA.cert",
      "server_key": "../fleet-telemetry/test/integration/test-certs/vehicle_device.CA.key"
    }
  },
  "mode": "file", // file or api, mode defaults to api if not set
  "source": {
    "file": {
      "path": "./messages/change-vehicle-name.json", // path to json file with messages
      "delay": 1 // time to wait between sending each message
    },
    "api": {
      // note: api not implemented yet :)
      "port": 8080
    }
  }
}
```

To set the location of the configuration file, the `--config` flag can be passed as a cli arg or the `CONFIG_FILE` environment variable can be set. The default is `config.json`.

### Fleet Telemetry

Below is a basic configuration to use when running fleet-telemetry. This enables the simple logger which prints messages to the stdout. Ensure the tls setup here references the same certs as the `phantom-fleet` configuration file.

```json
{
  "host": "app",
  "port": 4443,
  "log_level": "info",
  "json_log_enable": true,
  "namespace": "tesla_telemetry",
  "records": {
    "V": ["logger"]
  },
  "tls": {
    "ca_file": "./test-certs/vehicle_device.CA.cert",
    "server_cert": "./test-certs/vehicle_device.app.cert",
    "server_key": "./test-certs/vehicle_device.app.key"
  }
}
```

# Roadmap

This project is in its early stages and may be unstable.

**Short-term goals**:

- Improve testing
- Improve documentation for crafting messages
- Expose a REST API for sending commands
