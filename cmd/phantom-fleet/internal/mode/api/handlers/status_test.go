package handlers_test

import (
	"io"
	"net/http"
	"net/http/httptest"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("/status", func() {
	var (
		s *httptest.Server
	)

	BeforeEach(func() {
		s = httptest.NewServer(http.HandlerFunc(handlers.StatusHandler))
	})

	AfterEach(func() {
		s.Close()
	})

	It("returns OK", func() {
		res, err := http.Get(s.URL)
		Expect(err).To(BeNil())
		Expect(res.StatusCode).To(Equal(http.StatusOK))
		body := make([]byte, res.ContentLength)
		_, err = io.ReadFull(res.Body, body)
		Expect(err).To(BeNil())
		Expect(string(body)).To(Equal("OK"))
	})
})
