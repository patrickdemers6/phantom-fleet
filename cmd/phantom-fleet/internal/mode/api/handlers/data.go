package handlers

import (
	"encoding/json"
	"net/http"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
	message "phantom-fleet/pkg/msg"
)

var (
	OK = []byte("OK")
)

func DataHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		handleCors(w, r, "POST,GET")
		return
	}
	if r.Method == http.MethodPost {
		SendData(w, r)
		return
	}

	if r.Method == http.MethodGet {
		getData(w, r)
		return
	}

}

func SendData(w http.ResponseWriter, r *http.Request) {
	b := make([]byte, r.ContentLength)
	r.Body.Read(b)
	r.Body.Close()

	var message *message.Message
	err := json.Unmarshal(b, &message)
	if err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	manager := r.Context().Value(constants.DeviceManager).(*device.Manager)
	vehicle := manager.Get(message.VIN)
	if vehicle == nil {
		// we could silently fail, but if vehicle is not registered, this is likely user error
		http.Error(w, "vehicle not configured for streaming. call POST /fleet_telemetry_create to register vehicle", http.StatusPreconditionFailed)
		return
	}
	vehicle.Publish(message)

	dataStore := r.Context().Value(constants.DataStore).(database.Datastore)
	dataStore.SetVehicleData(message.VIN, message.Data)

	w.WriteHeader(http.StatusOK)
	w.Write(OK)
}

func getData(w http.ResponseWriter, r *http.Request) {
	ds := r.Context().Value(constants.DataStore).(database.Datastore)

	vehicles, err := ds.GetAllVehicles()
	if err != nil {
		panic(err)
	}

	vinToData := make(map[string][]message.Data)
	for _, vehicle := range vehicles {
		if vehicle.Data == nil {
			vinToData[vehicle.Vin] = []message.Data{}
		} else {
			vinToData[vehicle.Vin] = vehicle.Data
		}
	}
	out, err := json.Marshal(vinToData)
	if err != nil {
		http.Error(w, "error marshaling json", http.StatusInternalServerError)
	}
	w.Write(out)
}
