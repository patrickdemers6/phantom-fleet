package data

import "fmt"

const (
	JsonMessageArray = `
		[
			{
				"txid": "1",
				"topic": "V",
				"vin": "device-1",
				"device_type": "vehicle_device",
				"createdAt": 1,
				"messageId": "id1",
				"data": [
					{ "key": "VehicleName", "value": { "stringValue": "Original Name" } }
				]
			},
			{
				"txid": "2",
				"topic": "V",
				"vin": "device-1",
				"device_type": "vehicle_device",
				"createdAt": 2,
				"messageId": "id2",
				"data": [{ "key": "VehicleName", "value": { "stringValue": "New Name" } }]
			}
		]
	`
	JsonMessageObject = `
		{
			"txid": "1",
			"topic": "V",
			"vin": "device-1",
			"device_type": "vehicle_device",
			"createdAt": 1,
			"messageId": "id1",
			"data": [
				{ "key": "VehicleName", "value": { "stringValue": "Original Name" } }
			]
		}
	`
)

var (
	JsonMessageObjectWithCerts = fmt.Sprintf(`
		{
			"txid": "1",
			"topic": "V",
			"vin": "device-1",
			"device_type": "vehicle_device",
			"createdAt": 1,
			"messageId": "id1",
			"data": [
				{ "key": "VehicleName", "value": { "stringValue": "Original Name" } }
			],
			"cert": "%s",
			"key": "%s"
		}`, VehicleDevice1Cert, VehicleDevice1Key)

	JsonMessageObjectWithInvalidCerts = fmt.Sprintf(`
		{
			"txid": "1",
			"topic": "V",
			"vin": "device-1",
			"device_type": "vehicle_device",
			"createdAt": 1,
			"messageId": "id1",
			"data": [
				{ "key": "VehicleName", "value": { "stringValue": "Original Name" } }
			],
			"cert": "%s",
			"key": "%s"
		}`, "invalid cert", VehicleDevice1Key)
)
