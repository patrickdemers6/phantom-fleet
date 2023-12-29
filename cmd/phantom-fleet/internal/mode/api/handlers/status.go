package handlers

import (
	"net/http"
)

// StatusHandler returns OK when server is running
func StatusHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
