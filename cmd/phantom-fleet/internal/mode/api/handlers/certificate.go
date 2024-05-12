package handlers

import (
	"encoding/json"
	"net/http"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/constants"
)

type CertificateResponse struct {
	CA string `json:"ca"`
}

func GetCertificate(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		handleCors(w, r, "GET")
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	certManager := r.Context().Value(constants.CertManager).(*cert.Manager)

	data, err := json.Marshal(CertificateResponse{CA: certManager.CaToPem() })
	if err != nil {
		http.Error(w, "error marshaling json", http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
