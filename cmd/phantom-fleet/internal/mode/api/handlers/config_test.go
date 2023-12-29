package handlers_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/pkg/constants"
	"phantom-fleet/pkg/telemetry"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/ginkgo/extensions/table"
	. "github.com/onsi/gomega"
)

var _ = Describe("/config", func() {
	var (
		s  *httptest.Server
		cm *telemetry.Manager
	)

	BeforeEach(func() {
		ctx := context.Background()
		cm = telemetry.NewManager(nil, "localhost", 8080)
		s = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx = r.Context()
			ctx = context.WithValue(ctx, constants.ContextManager, cm)
			handlers.ConfigHandler(w, r.WithContext(ctx))
		}))
	})

	AfterEach(func() {
		s.Close()
	})

	DescribeTable("config updates", func(json string, expectedStatus int, expectedHost string, expectedPort int) {
		res, err := http.Post(s.URL, "application/json", strings.NewReader(json))
		Expect(err).To(BeNil())
		Expect(res.StatusCode).To(Equal(expectedStatus))
		Expect(cm.Host).To(Equal(expectedHost))
		Expect(cm.Port).To(Equal(expectedPort))
	},
		Entry("valid config", "{ \"host\": \"updated\", \"port\": 3000 }", http.StatusOK, "updated", 3000),
		Entry("invalid json", "{ \"host\": updated, \"port\": 3000 }", http.StatusBadRequest, "localhost", 8080),
		Entry("missing host", "{ \"port\": 3000 }", http.StatusOK, "localhost", 3000),
		Entry("missing port", "{ \"host\": \"updated\" }", http.StatusOK, "updated", 8080),
		Entry("invalid port", "{ \"port\": -1 }", http.StatusBadRequest, "localhost", 8080),
	)
})
