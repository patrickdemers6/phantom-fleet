package config_test

import (
	"flag"
	"os"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/ginkgo/extensions/table"
	. "github.com/onsi/gomega"
	"github.com/spf13/afero"

	"phantom-fleet/config"
)

var _ = Describe("Config", func() {
	var (
		fs afero.Fs
	)

	BeforeEach(func() {
		flag.CommandLine = flag.NewFlagSet("", flag.ExitOnError)
		os.Args = []string{"phantom-fleet"}
		fs = afero.NewMemMapFs()
	})

	Describe("LoadConfig", func() {
		It("loads from config.json by default", func() {
			err := afero.WriteFile(fs, "config.json", []byte(completeConfig), os.ModePerm)
			Expect(err).To(BeNil())

			c, err := config.LoadConfig(fs)

			Expect(err).To(BeNil())
			Expect(c).NotTo(BeNil())
			Expect(c.File.Path).To(Equal("test_config.json"))
			Expect(c.File.Delay).To(Equal(10))
		})

		It("overrides delay from cli arg", func() {
			os.Args = []string{"phantom-fleet", "--delay=2"}

			err := afero.WriteFile(fs, "config.json", []byte(completeConfig), os.ModePerm)
			Expect(err).To(BeNil())

			c, err := config.LoadConfig(fs)

			Expect(err).To(BeNil())
			Expect(c).NotTo(BeNil())
			Expect(c.File.Delay).To(Equal(2))
		})

		Context("mode file", func() {
			It("overrides message name from cli arg", func() {
				os.Args = []string{"phantom-fleet", "file", "test"}

				err := afero.WriteFile(fs, "config.json", []byte(completeConfig), os.ModePerm)
				Expect(err).To(BeNil())

				c, err := config.LoadConfig(fs)

				Expect(err).To(BeNil())
				Expect(c).NotTo(BeNil())
				Expect(c.File.Path).To(Equal("./messages/test.json"))
			})

			It("overrides path from cli arg", func() {
				os.Args = []string{"phantom-fleet", "file", "test-a.json"}

				err := afero.WriteFile(fs, "config.json", []byte(completeConfig), os.ModePerm)
				Expect(err).To(BeNil())

				c, err := config.LoadConfig(fs)

				Expect(err).To(BeNil())
				Expect(c).NotTo(BeNil())
				Expect(c.File.Path).To(Equal("test-a.json"))
			})

			It("errors on too many unnamed args", func() {
				os.Args = []string{"phantom-fleet", "file", "test.json", "other"}

				err := afero.WriteFile(fs, "config.json", []byte(completeConfig), os.ModePerm)
				Expect(err).To(BeNil())

				_, err = config.LoadConfig(fs)

				Expect(err).To(HaveOccurred())
			})

			It("errors on missing second arg", func() {
				os.Args = []string{"phantom-fleet", "file"}

				err := afero.WriteFile(fs, "config.json", []byte(completeConfig), os.ModePerm)
				Expect(err).To(BeNil())

				_, err = config.LoadConfig(fs)
				Expect(err).To(HaveOccurred())
			})
		})

		Context("api mode", func() {
			It("defaults to api mode", func() {
				os.Args = []string{"phantom-fleet"}

				err := afero.WriteFile(fs, "config.json", []byte(noModeConfig), os.ModePerm)
				Expect(err).To(BeNil())

				c, err := config.LoadConfig(fs)
				Expect(err).ToNot(HaveOccurred())
				Expect(c.Mode).To(Equal("api"))
			})
		})

		It("defaults to api mode", func() {
			os.Args = []string{"phantom-fleet"}

			err := afero.WriteFile(fs, "config.json", []byte(noModeConfig), os.ModePerm)
			Expect(err).To(BeNil())

			c, err := config.LoadConfig(fs)
			Expect(err).ToNot(HaveOccurred())
			Expect(c.Mode).To(Equal("api"))
		})

		DescribeTable("validations", func(fileContent, expectedErrMsg string) {
			err := afero.WriteFile(fs, "config.json", []byte(fileContent), os.ModePerm)
			Expect(err).To(BeNil())

			_, err = config.LoadConfig(fs)
			Expect(err).To(HaveOccurred())
			Expect(err).To(MatchError(Equal(expectedErrMsg)))
		},
			Entry("fail on negative delay", negativeDelay, "delay must be positive"),
			Entry("fail on invalid mode", invalidMode, "invalid mode, expected 'api' or 'file'"),
			Entry("fail on missing file mode server tls directory", missingTlsDirectory, "file mode tls directory is required"),
			Entry("fail on negative server port", negativeFileServerPort, "server port must be positive"),
			Entry("fail on zero server port", zeroServerPort, "server port is required"),
			Entry("fail on empty host", missingHost, "host is required"),
			Entry("fail on zero api port", negativeApiPort, "api port must be positive"),
			Entry("fail on zero api port", zeroApiPort, "api port is required"),
		)
	})
})
