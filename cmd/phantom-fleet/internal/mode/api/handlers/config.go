package handlers

import (
	"crypto/tls"
	"encoding/json"
	"net/http"
	"strings"

	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/telemetry"
)

var (
	ValidateServerConfig = isValidServerConfig
)

type Session struct {
	Host string `json:"host"`
	Port int    `json:"port"`
}

type Response struct {
	Valid  bool   `json:"valid"`
	Reason string `json:"reason"`
}

// ConfigHandler sets the configuration for the telemetry manager.
// Expects a POST request with JSON body containing `host` and `port`.
// Connections to previous server are disconnected and all new requests
// are routed to newly configured server.
func ConfigHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		handleCors(w, r)
		return
	}
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
	manager.Reset()

	host := manager.Host
	if session.Host != "" {
		host = session.Host
	}

	port := manager.Port
	if session.Port != 0 {
		port = session.Port
	}

	valid, msg := ValidateServerConfig(host, port)
	if valid {
		manager.Host = host
		manager.Port = port
		json.NewEncoder(w).Encode(&Response{Valid: true})
		return
	}
	json.NewEncoder(w).Encode(&Response{Valid: false, Reason: msg})
}

func isValidServerConfig(host string, port int) (bool, string) {
	// connecting with no certificate should fail with bad certificate error
	conn, err := telemetry.NewConnection(host, port, tls.Certificate{})
	if err != nil {
		return strings.Contains(err.Error(), "bad certificate"), err.Error()
	}

	conn.Shutdown()
	return true, ""
}
