package handlers_test

import (
	"context"
	"fmt"
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

	const (
		beforePort = 8080
		afterPort  = 3000
		beforeHost = "before"
		afterHost  = "after"
	)

	BeforeEach(func() {
		handlers.ValidateServerConfig = func(host string, port int) (bool, string) {
			return true, ""
		}
		ctx := context.Background()
		cm = telemetry.NewManager(nil, beforeHost, beforePort)
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
		Entry("valid config", fmt.Sprintf("{ \"host\": \"%s\", \"port\": %d }", afterHost, afterPort), http.StatusOK, afterHost, afterPort),
		Entry("invalid json", "{ \"host\": before, \"port\": 8080 }", http.StatusBadRequest, beforeHost, beforePort),
		Entry("missing host", fmt.Sprintf("{ \"port\": %d }", afterPort), http.StatusOK, beforeHost, afterPort),
		Entry("missing port", fmt.Sprintf("{ \"host\": \"%s\" }", afterHost), http.StatusOK, afterHost, beforePort),
		Entry("invalid port", "{ \"port\": -1 }", http.StatusBadRequest, beforeHost, beforePort),
	)
})
