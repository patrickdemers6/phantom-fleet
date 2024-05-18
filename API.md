# API

API mode allows for sending data to the fleet-telemetry server through a REST API.

Example `config.json`:

```json
{
  "mode": "api"
}
```

## Endpoints

### GET /api/1/status
Returns OK when server is running.

### GET /api/1/certificate_authority
Returns the CA to configure your fleet-telemetry server to use.

### GET /api/1/data
Get data for all vehicles.

### POST /api/1/data
Send a message to the fleet-telemetry server. Expects a message as JSON body.

Include `key` and `cert` in the JSON payload of first message for a vehicle. They are used when establishing an mTLS connection. The certificates should match the `vin` specified in the request body. It is recommended to always include key/cert for simplicity.

**Example Body**

```json
{
  "txid": "2",
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
