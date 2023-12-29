package handlers

import (
	"encoding/json"
	"net/http"

	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/telemetry"
)

type Session struct {
	Host string `json:"host"`
	Port int    `json:"port"`
}

// ConfigHandler sets the configuration for the telemetry manager.
// Expects a POST request with JSON body containing `host` and `port`.
// Connections to previous server are disconnected and all new requests
// are routed to newly configured server.
func ConfigHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	b := make([]byte, r.ContentLength)
	r.Body.Read(b)
	r.Body.Close()

	var session *Session
	err := json.Unmarshal(b, &session)
	if err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	if session.Port < 0 {
		http.Error(w, "invalid port", http.StatusBadRequest)
		return
	}

	manager := r.Context().Value(constants.ContextManager).(*telemetry.Manager)

	if session.Host != "" {
		manager.Host = session.Host
	}
	if session.Port != 0 {
		manager.Port = session.Port
	}

	manager.Reset()
}
