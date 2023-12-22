package file_test

const (
	messageJson = `
		[
			{
				"txid": "1",
				"topic": "V",
				"vin": "TESLA000000000001",
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
				"vin": "TESLA000000000001",
				"device_type": "vehicle_device",
				"createdAt": 2,
				"messageId": "id2",
				"data": [{ "key": "VehicleName", "value": { "stringValue": "New Name" } }]
			}
		]
	`
)
