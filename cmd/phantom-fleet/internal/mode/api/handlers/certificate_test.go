package handlers_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
	message "phantom-fleet/pkg/msg"
	"phantom-fleet/test/helpers"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

// TODO: actually write tests
var _ = Describe("/certificate", func() {
	Context("GET", func() {
		var (
			s             *httptest.Server
			deviceManager *device.Manager
			dataStore     database.Datastore
			certManager   *cert.Manager
		)

		BeforeEach(func() {
			ctx := context.Background()
			deviceManager = device.NewManager()
			dataStore = &mocks.Database{
				DeviceConfig: map[string]*database.DeviceConfig{
					"vin": {Vin: "vin", Data: []message.Data{{Key: "test"}}},
				},
			}
			var err error
			certManager, err = cert.NewManager(dataStore)
			Expect(err).ToNot(HaveOccurred())
			s = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				ctx = r.Context()
				ctx = context.WithValue(ctx, constants.CertManager, certManager)
				ctx = context.WithValue(ctx, constants.DeviceManager, deviceManager)
				ctx = context.WithValue(ctx, constants.DataStore, dataStore)
				handlers.GetCertificate(w, r.WithContext(ctx))
			}))
		})

		It("fetches data from data store", func() {
			res, err := http.Get(s.URL)
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(http.StatusOK))
			cert := &handlers.CertificateResponse{}
			helpers.ReadJsonBody(res, cert)
			Expect(cert.CA).To(Equal(certManager.CaToPem()))
		})

		It("fetches data from data store", func() {
			res, err := http.Get(s.URL)
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(http.StatusOK))
			cert := &handlers.CertificateResponse{}
			helpers.ReadJsonBody(res, cert)
			Expect(cert.CA).To(Equal(certManager.CaToPem()))
		})
	})
})
