# API

API mode allows for sending data to the fleet-telemetry server through a REST API.

## Config

To be included in the config file:

- `port`: port to expose the API on
- `server` (optional): host and port to use initially for connection to fleet-telemetry server. If not provided, call the `/config` endpoint after startup to configure host and port

```json
{
  "api": {
    "port": 8080,
    "server": {
      "host": "app",
      "port": 4443
    }
  }
}
```

## Endpoints

### GET /status
Returns OK when server is running.

### POST /config

Set the host and port of the fleet-telemetry server to connect to. This can be called at any time to update configuration. Any active connections to the previous fleet-telemetry server will be closed.

**Example Body**

```json
{
    "host": "app",
    "port": 3000 
}
```

### POST /data
Send a message to the fleet-telemetry server. Expects a message as JSON body.

Include `key` and `cert` in the JSON payload of first message for a vehicle. They are used when establishing an mTLS connection. The certificates should match the `vin` specified in the request body. It is recommended to always include key/cert for simplicity.

**Example Body**

```json
{
  "txid": "2",
  "key": "<key>",
  "cert": "<cert>",
  "topic": "V",
  "vin": "device-1",
  "device_type": "vehicle_device",
  "createdAt": 2,
  "messageId": "id2",
  "data": [
    {
      "key": "Location",
      "value": {
        "locationValue": {
          "latitude": -38.412374,
          "longitude": 124.145867
        }
      }
    }
  ]
}
```
