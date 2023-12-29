package telemetry_test

import (
	"crypto/tls"

	"phantom-fleet/config"
	"phantom-fleet/pkg/telemetry"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Connection Manager", func() {
	var (
		manager *telemetry.Manager
		c       *config.Config
	)

	BeforeEach(func() {
		c = &config.Config{}
		manager = telemetry.NewManager(c, "localhost", 8080)
	})

	It("gets connection after set", func() {
		conn := &mocks.Connection{}
		manager.Set("device-1", conn)
		Expect(manager.Get("device-1")).To(Equal(conn))
	})

	It("creates connection", func() {
		conn := &mocks.Connection{}
		callCount := 0
		manager.CreateConnectionFn = func(host string, port int, cert tls.Certificate) (telemetry.Connection, error) {
			callCount++
			return conn, nil
		}
		manager.Create("device-1", tls.Certificate{})
		Expect(callCount).To(Equal(1))
		Expect(manager.Get("device-1")).To(Equal(conn))
	})

	It("shutsdown all open connections", func() {
		conn := &mocks.Connection{}
		manager.Set("device-1", conn)
		conn.On("Shutdown").Return(nil)

		manager.Reset()
		Expect(manager.Get("device-1")).To(BeNil())
		Expect(conn.AssertNumberOfCalls(GinkgoT(), "Shutdown", 1))
	})

	It("removes connection", func() {
		conn := &mocks.Connection{}
		manager.Set("device-1", conn)
		conn.On("Shutdown").Return(nil)

		manager.Delete("device-1")
		Expect(manager.Get("device-1")).To(BeNil())
		Expect(conn.AssertNumberOfCalls(GinkgoT(), "Shutdown", 1))
	})
})
