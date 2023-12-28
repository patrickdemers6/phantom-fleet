package file_test

import (
	"os"
	"time"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/spf13/afero"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/file"
	"phantom-fleet/config"
	"phantom-fleet/test/mocks"
)

var _ = Describe("File Mode", func() {
	var (
		fs afero.Fs
	)

	BeforeEach(func() {
		fs = afero.NewMemMapFs()
	})

	It("publishes proper number of messages", func() {
		err := afero.WriteFile(fs, "messages.json", []byte(messageJson), os.ModePerm)
		Expect(err).To(BeNil())

		config := &config.Config{
			Source: config.Source{
				File: &config.FileSource{
					Path: "messages.json",
				},
			},
			Fs: fs,
		}

		mockConn := new(mocks.Connection)
		mockConn.On("Publish").Return(nil)

		err = file.Run(mockConn, config)
		Expect(err).To(BeNil())

		mockConn.AssertNumberOfCalls(GinkgoT(), "Publish", 2)
	})

	It("publishes messages with proper delay", func() {
		err := afero.WriteFile(fs, "messages.json", []byte(messageJson), os.ModePerm)
		Expect(err).To(BeNil())

		config := &config.Config{
			Source: config.Source{
				File: &config.FileSource{
					Path:  "messages.json",
					Delay: 2,
				},
			},
			Fs: fs,
		}

		mockConn := new(mocks.Connection)
		mockConn.On("Publish").Return(nil)

		startTime := time.Now()
		err = file.Run(mockConn, config)
		endTime := time.Now()

		Expect(err).To(BeNil())
		Expect(endTime.Sub(startTime)).To(BeNumerically(">=", 2*time.Second))
	})
})
