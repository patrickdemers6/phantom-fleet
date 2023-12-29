package message_test

import (
	"os"

	message "phantom-fleet/pkg/msg"
	"phantom-fleet/test/data"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
	"github.com/spf13/afero"
)

var _ = Describe("Message", func() {
	var (
		fs afero.Fs
	)

	BeforeEach(func() {
		fs = afero.NewMemMapFs()
	})

	Describe("LoadConfig", func() {
		It("loads message", func() {
			err := afero.WriteFile(fs, "messages.json", []byte(data.JsonMessageArray), os.ModePerm)
			Expect(err).To(BeNil())

			msgs, err := message.LoadFromJson("messages.json", fs)
			Expect(err).To(BeNil())

			Expect(msgs).To(HaveLen(2))
			Expect(msgs[0].TxID).To(Equal("1"))
			Expect(msgs[1].TxID).To(Equal("2"))
		})
		It("errors on nonexistent file", func() {
			_, err := message.LoadFromJson("messages.json", fs)
			Expect(err).To(HaveOccurred())
		})
	})
})
