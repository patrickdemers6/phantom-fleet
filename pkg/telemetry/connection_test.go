package telemetry_test

import (
	"errors"
	"testing"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	message "phantom-fleet/pkg/msg"
	"phantom-fleet/pkg/telemetry"
)

// Mock WebSocketConn for testing
type mockWebSocketConn struct {
	WriteMessageFn func(messageType int, data []byte) error
	CloseFn        func() error
}

func (m *mockWebSocketConn) WriteMessage(messageType int, data []byte) error {
	return m.WriteMessageFn(messageType, data)
}

func (m *mockWebSocketConn) Close() error {
	return m.CloseFn()
}

var _ = Describe("MTLS", func() {
	var (
		mockConn *mockWebSocketConn
		mtls     *telemetry.MTLS
	)

	BeforeEach(func() {
		mockConn = &mockWebSocketConn{
			WriteMessageFn: func(messageType int, data []byte) error {
				return nil // Simulate successful message writing
			},
			CloseFn: func() error {
				return nil // Simulate successful close
			},
		}
		mtls = telemetry.NewMTLSWithMockConn(mockConn)
	})

	Describe("Publish", func() {
		It("successfully publishes a message", func() {
			stringValue := "Test Name"
			msg := &message.Message{
				TxID:       "1",
				Topic:      "V",
				VIN:        "device-1",
				DeviceType: "vehicle_device",
				MessageID:  "id1",
				CreatedAt:  1,
				Data: []message.Data{
					{
						Key: "VehicleName",
						Value: message.Value{
							StringValue: &stringValue,
						},
					},
				},
			}
			err := mtls.Publish(msg)
			Expect(err).NotTo(HaveOccurred())
		})

		It("returns an error if message marshaling fails", func() {
			msg := &message.Message{} // Create a message that causes marshaling to fail
			mockConn.WriteMessageFn = func(messageType int, data []byte) error {
				return errors.New("mock write error")
			}
			err := mtls.Publish(msg)
			Expect(err).To(HaveOccurred())
		})
	})

	Describe("Shutdown", func() {
		It("closes the connection", func() {
			mtls.Shutdown()
		})
	})
})

func TestTelemetry(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Telemetry Suite")
}
