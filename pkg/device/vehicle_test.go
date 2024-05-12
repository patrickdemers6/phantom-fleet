package device_test

import (
	"phantom-fleet/pkg/cert"
	"phantom-fleet/pkg/database"
	"phantom-fleet/pkg/device"
	message "phantom-fleet/pkg/msg"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Vehicle Manager", func() {
	var conn mocks.Connection
	BeforeEach(func() {
		conn = mocks.Connection{}
	})

	It("fails to establish connection to nonexistent server", func() {
		cm, err := cert.NewManager(nil)
		Expect(err).ToNot(HaveOccurred())

		vehicle := device.Vehicle{
			Configuration: database.FleetTelemetryConfig{
				Hostname: "localhost",
				Port:     9999,
				CA:       cm.CaToPem(),
				Fields:   nil,
			},
		}

		Expect(vehicle.Connect()).To(BeFalse())
		Expect(vehicle.Errors()).To(HaveLen(1))
	})

	It("publishes message to connection", func() {
		cm, err := cert.NewManager(nil)
		Expect(err).ToNot(HaveOccurred())

		vehicle := device.Vehicle{
			Configuration: database.FleetTelemetryConfig{
				Hostname: "localhost",
				Port:     9999,
				CA:       cm.CaToPem(),
				Fields:   nil,
			},
			Connection: &conn,
		}

		msg := &message.Message{MessageID: "1"}
		conn.On("Publish", msg).Return(nil)
		vehicle.Publish(msg)

		Expect(vehicle.Errors()).To(HaveLen(0))
	})

	It("calls shutdown on connection", func() {
		cm, err := cert.NewManager(nil)
		Expect(err).ToNot(HaveOccurred())

		vehicle := device.Vehicle{
			Configuration: database.FleetTelemetryConfig{
				Hostname: "localhost",
				Port:     9999,
				CA:       cm.CaToPem(),
				Fields:   nil,
			},
			Connection: &conn,
		}

		conn.On("Shutdown").Return(nil)
		vehicle.Shutdown()
		conn.AssertExpectations(GinkgoT())
	})
})
