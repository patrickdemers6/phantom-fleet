package api

import (
	"context"
	"fmt"
	"net/http"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/config"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/telemetry"
)

// Run executes api mode
func Run(config *config.Config) error {
	mux := http.NewServeMux()

	registerHandlers(mux)

	manager := telemetry.NewManager(config, config.API.Server.Host, config.API.Server.Port)
	muxWithMiddleware := contextMiddleware(mux, manager)

	return http.ListenAndServe(fmt.Sprintf(":%d", config.API.Port), muxWithMiddleware)
}

func contextMiddleware(mux *http.ServeMux, conn *telemetry.Manager) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), constants.ContextManager, conn)
		mux.ServeHTTP(w, r.WithContext(ctx))
	})
}

func registerHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/data", handlers.SendDataHandler)
	mux.HandleFunc("/config", handlers.ConfigHandler)
	mux.HandleFunc("/status", handlers.StatusHandler)
}
