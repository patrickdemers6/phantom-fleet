package api

import (
	"context"
	"fmt"
	"net/http"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
	"time"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/pkg/constants"
)

// Run executes api mode
func Run() error {
	time.Sleep(1 * time.Second)
	mux := http.NewServeMux()

	registerHandlers(mux)

	mongo, err := database.NewMongoClient()
	if err != nil {
		panic(err)
	}

	deviceManager := device.NewManager()

	certManager, err := cert.NewManager(mongo)
	if err != nil {
		panic(err)
	}

	vehicles, err := mongo.GetAllVehicles()
	if err != nil {
		panic(err)
	}

	for _, vehicle := range vehicles {
		newVehicle, err := device.NewVehicle(vehicle.Vin, vehicle.Config, certManager)
		if err != nil {

			return err
		}
		deviceManager.Add(newVehicle)
	}

	muxWithMiddleware := contextMiddleware(mux, deviceManager, mongo, certManager)
	return http.ListenAndServe(fmt.Sprintf(":%d", 8080), muxWithMiddleware)
}

func contextMiddleware(mux *http.ServeMux, dm *device.Manager, ds database.Datastore, cm *cert.Manager) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		ctx := context.WithValue(r.Context(), constants.DeviceManager, dm)
		ctx = context.WithValue(ctx, constants.DataStore, ds)
		ctx = context.WithValue(ctx, constants.CertManager, cm)
		mux.ServeHTTP(w, r.WithContext(ctx))
	})
}

func registerHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/api/1/data", handlers.DataHandler)
	mux.HandleFunc("/api/1/status", handlers.StatusHandler)
	mux.HandleFunc("/api/1/certificate_authority", handlers.GetCertificate)
	// fleet_telemetry_config endpoints are identical to Fleet API
	mux.HandleFunc("/api/1/vehicles/fleet_telemetry_config", handlers.SetFleetTelemetryConfigHandler)
	mux.HandleFunc("/api/1/vehicles/{vin}/fleet_telemetry_config", handlers.FleetTelemetryVehicleHandler)
}
