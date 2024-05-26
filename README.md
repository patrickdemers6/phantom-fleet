# Phantom Fleet

Validate, develop, and EleVate your Tesla Fleet Telemetry Server integration with Phantom Fleet!

Are you integrating with Tesla's fleet-telemetry server but don't have a fleet of Tesla vehicles at your disposal? Fear not! Phantom Fleet allows you to develop and validate your use case without the need for a real Tesla on hand.

# Getting Started

Phantom Fleet takes messages from input sources and sends the messages to a fleet-telemetry server. These messages simulate data that would be received from a real vehicle.

At present, two source are supported:

- **File**: A JSON file with an array of messages. See an example in [messages/change-vehicle-name.json](messages/change-vehicle-name.json)
- **API**: Messages can be sent through an exposed REST API. [More details](API.md)

The steps below will assume you're running phantom-fleet using Docker compose.

## API Configuration

API mode allows you to use the phantom-fleet frontend to manipulate the virtual vehicles. Your `config.json` file only needs to have `{"mode": "api"}` in it.

To stay consistent with Fleet API, you must configure vehicles using an API endpoint identical to Tesla's endpoint.

Configure your first vehicle:
```shell
curl --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $TESLA_API_TOKEN" \
  --data '{
    "vins": [
      "vin1",
    ],
    "config": {
      "hostname": "test-telemetry.com",
      "ca": "-----BEGIN CERTIFICATE-----\ncert\n-----END CERTIFICATE-----\n",
      "fields": {
        "Soc": {
          "interval_seconds": 10
        }
      },
      "port": 4443
    }
  }' \
  'http://localhost:8080/api/1/vehicles/fleet_telemetry_config'
```

Now, open the phantom-fleet frontend. Typically, available at [http://localhost:8080](http://localhost:8080).

Follow the instructions presented and begin sending data.

> Note: the frontend does not expose all possible fleet-telemetry fields and error messages need some work. Contributors always welcome!

## File Mode Configuration

File mode requires you specify your fleet-telemetry server's details, in `config.json`. For examples of message files, see the `messages` folder.

```json
{
   "mode": "file",
   "file": {
      "path": "./messages/change-vehicle-name.json",
      "delay": 1,
      "server": {
         "host": "your-domain.com",
         "port": 4443,
      }
   }
}
```

### Fleet Telemetry

Below is a basic configuration to use when running fleet-telemetry. This enables the simple logger which prints messages to the stdout. Ensure the tls setup here references the same certs as the `phantom-fleet` configuration file.

The only phantom-fleet specific configuration setting `tls.ca_file`. When you start phantom-fleet, it outputs a CA. This certificate is needed by your fleet-telemetry server to trust the certificates from fake vehicles.

```json
{
  "host": "0.0.0.0",
  "port": 4443,
  "log_level": "info",
  "json_log_enable": true,
  "namespace": "tesla_telemetry",
  "records": {
    "V": ["logger"]
  },
  "tls": {
    "ca_file": "./path/to/ca/from/phantom-fleet",
    "server_cert": "./path/to/your/cert",
    "server_key": "./path/to/your/key"
  }
}
```

# Roadmap

This project is in its early stages and may be unstable.

If you are interested in contributing, please see our [contributor's guide](./CONTRIBUTING.md).

**Short-term goals**:

- Support more fields through the UI.
- General UI improvements.
