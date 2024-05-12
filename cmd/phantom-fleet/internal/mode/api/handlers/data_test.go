package handlers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"phantom-fleet/cmd/phantom-fleet/internal/mode/api/handlers"
	"phantom-fleet/pkg/constants"

	message "phantom-fleet/pkg/msg"
	"phantom-fleet/test"
	"phantom-fleet/test/helpers"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("/data", func() {
	var (
		s             *httptest.Server
		env *test.Environment
	)

	BeforeEach(func() {
		ctx := context.Background()
		env = test.BaseEnvironment()
		s = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx = r.Context()
			ctx = context.WithValue(ctx, constants.DeviceManager, env.DeviceManager)
			ctx = context.WithValue(ctx, constants.DataStore, env.DataStore)
			ctx = context.WithValue(ctx, constants.CertManager, env.CertManager)
			handlers.DataHandler(w, r.WithContext(ctx))
		}))
	})

	Describe("GET", func() {
		It("fetches data from data store", func() {
			res, err := http.Get(s.URL)
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(http.StatusOK))
			Expect(helpers.ReadBody(res)).To(Equal("{\"VIN\":[{\"key\":\"Soc\",\"value\":{\"stringValue\":\"10\"}}]}"))
		})
	})

	Describe("POST", func() {
		var msg *message.Message
		BeforeEach(func() {
			odometer := float32(32.0)
			msg = &message.Message{
				VIN: "VIN",
				Data: []message.Data{{ Key: "Odometer", Value: message.Value{FloatValue: &odometer }}},
			}
		})
		It("returns 412 when vehicle does not exist", func() {
			msg.VIN = "OTHERVIN"
			payload, err := json.Marshal(msg)
			Expect(err).ToNot(HaveOccurred())
			res, err := http.Post(s.URL, "application/json", bytes.NewReader(payload))
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(http.StatusPreconditionFailed))
		})

		It("writes data to data store", func() {
			payload, err := json.Marshal(msg)
			Expect(err).ToNot(HaveOccurred())
			res, err := http.Post(s.URL, "application/json", bytes.NewReader(payload))
			Expect(err).To(BeNil())
			Expect(res.StatusCode).To(Equal(http.StatusOK))
			Expect(env.DataStore.DeviceConfig[msg.VIN].Data).To(HaveLen(1))
			Expect(env.DataStore.DeviceConfig[msg.VIN].Data[0].Key).To(Equal("Odometer"))
		})
	})
})
