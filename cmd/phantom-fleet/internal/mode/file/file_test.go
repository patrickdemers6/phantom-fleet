package file_test

import (
	"os"
	"time"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/file"
	"phantom-fleet/config"
	"phantom-fleet/pkg/telemetry"
	"phantom-fleet/test/data"
	"phantom-fleet/test/mocks"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/spf13/afero"
)

var _ = Describe("File Mode", func() {
	var (
		fs afero.Fs
	)

	BeforeEach(func() {
		fs = afero.NewMemMapFs()
		err := afero.WriteFile(fs, "/certs/vehicle_device.device-1.cert", []byte(data.VehicleDevice1Cert), os.ModePerm)
		if err != nil {
			Fail(err.Error())
		}
		err = afero.WriteFile(fs, "/certs/vehicle_device.device-1.key", []byte(data.VehicleDevice1Key), os.ModePerm)
		if err != nil {
			Fail(err.Error())
		}
	})

	It("publishes proper number of messages", func() {
		err := afero.WriteFile(fs, "messages.json", []byte(messageJson), os.ModePerm)
		Expect(err).To(BeNil())

		mockConfig := &config.Config{
			File: &config.FileModeConfig{
				Path: "messages.json",
				Server: config.ServerConfig{
					TlsDirectory: "/certs",
				},
			},
			Fs: fs,
		}

		mockConn := new(mocks.Connection)
		mockConn.On("Publish").Return(nil)

		file.NewManager = func(c *config.Config, host string, port int) *telemetry.Manager {
			manager := telemetry.NewManager(mockConfig, host, port)
			manager.Set("device-1", mockConn)
			return manager
		}

		err = file.Run(mockConfig)
		Expect(err).To(BeNil())

		mockConn.AssertNumberOfCalls(GinkgoT(), "Publish", 2)
	})

	It("publishes messages with proper delay", func() {
		err := afero.WriteFile(fs, "messages.json", []byte(messageJson), os.ModePerm)
		Expect(err).To(BeNil())

		mockConfig := &config.Config{
			File: &config.FileModeConfig{
				Path:  "messages.json",
				Delay: 2,
				Server: config.ServerConfig{
					TlsDirectory: "/certs",
				},
			},
			Fs: fs,
		}

		mockConn := new(mocks.Connection)
		mockConn.On("Publish").Return(nil)

		file.NewManager = func(c *config.Config, host string, port int) *telemetry.Manager {
			manager := telemetry.NewManager(mockConfig, host, port)
			manager.Set("device-1", mockConn)
			return manager
		}

		startTime := time.Now()
		err = file.Run(mockConfig)
		endTime := time.Now()

		Expect(err).To(BeNil())
		Expect(endTime.Sub(startTime)).To(BeNumerically(">=", 2*time.Second))
	})

	It("errors when message contains invalid json", func() {
		err := afero.WriteFile(fs, "invalid.json", []byte(invalidJson), os.ModePerm)
		Expect(err).To(BeNil())

		mockConfig := &config.Config{
			File: &config.FileModeConfig{
				Path:  "invalid.json",
				Delay: 2,
				Server: config.ServerConfig{
					TlsDirectory: "/certs",
				},
			},
			Fs: fs,
		}

		mockConn := new(mocks.Connection)
		mockConn.On("Publish").Return(nil)

		file.NewManager = func(c *config.Config, host string, port int) *telemetry.Manager {
			manager := telemetry.NewManager(mockConfig, host, port)
			manager.Set("device-1", mockConn)
			return manager
		}

		err = file.Run(mockConfig)
		Expect(err).To(MatchError(ContainSubstring("error reading json message file")))
	})
})
