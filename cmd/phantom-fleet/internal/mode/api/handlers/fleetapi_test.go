package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/database"

	"phantom-fleet/test"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("fleetapi routes", func() {
	var (
		s   *httptest.Server
		env *test.Environment
	)

	Describe("/api/1/fleet_telemetry_config", func() {
		BeforeEach(func() {
			ctx := context.Background()
			env = test.BaseEnvironment()
			s = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ctx = r.Context()
				ctx = context.WithValue(ctx, constants.DeviceManager, env.DeviceManager)
				ctx = context.WithValue(ctx, constants.DataStore, env.DataStore)
				ctx = context.WithValue(ctx, constants.CertManager, env.CertManager)
				handlers.SetFleetTelemetryConfigHandler(w, r.WithContext(ctx))
			}))
		})

		Describe("POST", func() {
			var body *handlers.SetFleetTelemetryBody
			host := "new-host.com"
			BeforeEach(func() {
				body = &handlers.SetFleetTelemetryBody{
					Vins: []string{"VIN"},
					Config: database.FleetTelemetryConfig{
						Hostname: host,
						Port:     443,
						CA:       env.CertManager.CaToPem(),
					},
				}
			})

			It("sets fleet telemetry configuration", func() {
				payload, err := json.Marshal(body)
				Expect(err).ToNot(HaveOccurred())
				res, err := http.Post(s.URL, "application/json", bytes.NewReader(payload))
				Expect(err).ToNot(HaveOccurred())
				Expect(res.StatusCode).To(Equal(http.StatusOK))
				Expect(env.DataStore.DeviceConfig["VIN"].Config.Hostname).To(Equal(host))
			})

			It("creates new vehicle", func() {
				body.Vins = []string{"nonexistent"}
				payload, err := json.Marshal(body)
				Expect(err).ToNot(HaveOccurred())
				res, err := http.Post(s.URL, "application/json", bytes.NewReader(payload))
				Expect(err).ToNot(HaveOccurred())
				Expect(res.StatusCode).To(Equal(http.StatusOK))

				Expect(env.DataStore.GetAllVehicles()).To(HaveLen(2))
			})
		})
	})

	Describe("/api/1/vehicles/<vin>/fleet_telemetry_config", func() {
		BeforeEach(func() {
			ctx := context.Background()
			env = test.BaseEnvironment()
			s = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ctx = r.Context()
				ctx = context.WithValue(ctx, constants.DeviceManager, env.DeviceManager)
				ctx = context.WithValue(ctx, constants.DataStore, env.DataStore)
				ctx = context.WithValue(ctx, constants.CertManager, env.CertManager)
				r.SetPathValue("vin", "VIN")
				handlers.FleetTelemetryVehicleHandler(w, r.WithContext(ctx))
			}))
		})

		Describe("DELETE", func() {
			It("deletes specified vin", func() {
				Expect(env.DataStore.GetAllVehicles()).To(HaveLen(1))
				req, err := http.NewRequest(http.MethodDelete, s.URL, nil)
				Expect(err).ToNot(HaveOccurred())
				res, err := http.DefaultClient.Do(req)
				Expect(err).ToNot(HaveOccurred())
				Expect(res.StatusCode).To(Equal(200))
				Expect(env.DataStore.GetAllVehicles()).To(HaveLen(0))
				Expect(env.DeviceManager.Get("vin")).To(BeNil())
			})
		})
	})
})
