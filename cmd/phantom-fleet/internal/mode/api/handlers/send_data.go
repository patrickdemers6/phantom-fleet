package handlers

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"

	"phantom-fleet/pkg/constants"
	message "phantom-fleet/pkg/msg"
	"phantom-fleet/pkg/telemetry"
)

var (
	OK = []byte("OK")
)

// SendDataHandler sends data to the telemetry server
func SendDataHandler(w http.ResponseWriter, r *http.Request) {
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

	var message *message.Message
	err := json.Unmarshal(b, &message)
	if err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	manager := r.Context().Value(constants.ContextManager).(*telemetry.Manager)

	conn := getConnection(manager, message, w)
	if conn == nil {
		return
	}

	err = conn.Publish(message)
	if err != nil {
		http.Error(w, "error publishing to telemetry server", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(OK)
}

func getConnection(manager *telemetry.Manager, message *message.Message, w http.ResponseWriter) telemetry.Connection {
	conn := manager.Get(message.VIN)
	if conn == nil {
		if message.Cert == "" || message.Key == "" {
			http.Error(w, "cert and key required on first request to a device", http.StatusBadRequest)
			return nil
		}
		tls, err := tls.X509KeyPair([]byte(message.Cert), []byte(message.Key))
		if err != nil {
			http.Error(w, "cert/key pair invalid format", http.StatusBadRequest)
			return nil
		}
		conn, err = manager.Create(message.VIN, tls)
		if err != nil {
			fmt.Println(err)
			http.Error(w, "error connecting to telemetry server", http.StatusBadGateway)
			return nil
		}
	}
	return conn
}
