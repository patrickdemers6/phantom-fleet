package device_test

import (
	"phantom-fleet/pkg/device"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Connection Manager", func() {
	var (
		manager *device.Manager
	)

	BeforeEach(func() {
		manager = device.NewManager()
	})

	It("gets connection after set", func() {
		device := mocks.Vehicle{Vin: "device-1"}
		manager.Add(&device)
		Expect(manager.Get("device-1")).To(Equal(&device))
	})

	It("shutsdown all open connections", func() {
		device := mocks.Vehicle{Vin: "device-1"}
		manager.Add(&device)
		device.On("Shutdown").Return(nil)

		manager.Reset()
		Expect(manager.Get("device-1")).To(BeNil())
		Expect(device.AssertNumberOfCalls(GinkgoT(), "Shutdown", 1))
	})

	It("removes connection", func() {
		device := &mocks.Vehicle{Vin: "device-1"}
		manager.Add(device)
		device.On("Shutdown").Return(nil)

		manager.Delete("device-1")
		Expect(manager.Get("device-1")).To(BeNil())
		Expect(device.AssertNumberOfCalls(GinkgoT(), "Shutdown", 1))
	})
})
