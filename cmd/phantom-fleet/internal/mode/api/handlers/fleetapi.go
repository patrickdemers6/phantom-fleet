package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
)

type SetFleetTelemetryBody struct {
	Vins   []string                      `json:"vins"`
	Config database.FleetTelemetryConfig `json:"config"`
}

// SetFleetTelemetryConfig sets the telemetry configuration for given vehicles
func SetFleetTelemetryConfigHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		handleCors(w, r, "POST")
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	b := make([]byte, r.ContentLength)
	r.Body.Read(b)
	r.Body.Close()

	var message SetFleetTelemetryBody
	err := json.Unmarshal(b, &message)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err != nil {
		panic(err)
	}

	if err := updateDatabase(r, message); err != nil {
		http.Error(w, fmt.Sprintf("store_db_failed: %s", err), http.StatusInternalServerError)
		return
	}

	if err := updateVehicles(r, message); err != nil {
		http.Error(w, fmt.Sprintf("update_vehicles_failed: %s", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(OK)
}

func updateVehicles(r *http.Request, message SetFleetTelemetryBody) error {
	manager := r.Context().Value(constants.DeviceManager).(*device.Manager)
	certManager := r.Context().Value(constants.CertManager).(*cert.Manager)

	for _, vin := range message.Vins {
		manager.Delete(vin)
		vehicle, err := device.NewVehicle(vin, message.Config, certManager)
		if err != nil {
			return err
		}
		manager.Add(vehicle)
	}

	return nil
}

func updateDatabase(r *http.Request, message SetFleetTelemetryBody) error {
	dataStore := r.Context().Value(constants.DataStore).(database.Datastore)
	return dataStore.SetConfigurations(message.Vins, message.Config)
}

func FleetTelemetryVehicleHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		handleCors(w, r, "DELETE")
		return
	}

	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	manager := r.Context().Value(constants.DeviceManager).(*device.Manager)
	dataStore := r.Context().Value(constants.DataStore).(database.Datastore)

	vin := r.PathValue("vin")
	err := dataStore.DeleteVehicle(vin)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	manager.Delete(vin)
}
