package handlers_test

import (
	"context"
	"crypto/tls"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/telemetry"
	"phantom-fleet/test/data"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/ginkgo/extensions/table"
	. "github.com/onsi/gomega"
)

var _ = Describe("/data", func() {
	var (
		s    *httptest.Server
		cm   *telemetry.Manager
		conn *mocks.Connection
	)

	BeforeEach(func() {
		ctx := context.Background()
		cm = telemetry.NewManager(nil, "localhost", 8080)
		s = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx = r.Context()
			ctx = context.WithValue(ctx, constants.ContextManager, cm)
			handlers.SendDataHandler(w, r.WithContext(ctx))
		}))
	})

	AfterEach(func() {
		s.Close()
	})

	Context("when an existing connection exists", func() {
		BeforeEach(func() {
			conn = &mocks.Connection{}
			conn.On("Publish").Return(nil)
			cm.Set("device-1", conn)
		})

		It("publishes data", func() {
			res, err := http.Post(s.URL, "application/json", strings.NewReader(data.JsonMessageObjectWithCerts))
			Expect(err).To(BeNil())
			body := make([]byte, res.ContentLength)
			_, err = io.ReadFull(res.Body, body)
			Expect(err).To(BeNil())
			Expect(string(body)).To(Equal("OK"))

			Expect(conn.AssertNumberOfCalls(GinkgoT(), "Publish", 1))
			Expect(res.StatusCode).To(Equal(http.StatusOK))
		})
	})

	Context("when an existing connection does not exist", func() {
		BeforeEach(func() {
			conn = &mocks.Connection{}
			conn.On("Publish").Return(nil)
		})

		It("creates connection and produces with valid certs", func() {
			cm.CreateConnectionFn = func(host string, port int, cert tls.Certificate) (telemetry.Connection, error) {
				return conn, nil
			}

			res, err := http.Post(s.URL, "application/json", strings.NewReader(data.JsonMessageObjectWithCerts))
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(http.StatusOK))
			Expect(conn.AssertNumberOfCalls(GinkgoT(), "Publish", 1))
		})

		DescribeTable("error statuses", func(json string, expectedStatus int, errMsg string) {
			res, err := http.Post(s.URL, "application/json", strings.NewReader(json))
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(expectedStatus))
			body := make([]byte, res.ContentLength)
			_, err = io.ReadFull(res.Body, body)
			Expect(err).To(BeNil())
			Expect(string(body)).To(ContainSubstring(errMsg))
		},
			Entry("cert/key missing in message", data.JsonMessageObject, http.StatusBadRequest, "cert and key required on first request to a device"),
			Entry("invalid cert/key pair", data.JsonMessageObjectWithInvalidCerts, http.StatusBadRequest, "cert/key pair invalid format"))
	})
})
