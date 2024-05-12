package helpers

import (
	"encoding/json"
	"io"
	"net/http"

	. "github.com/onsi/gomega"
)

func ReadBody(res *http.Response) string {
	body := make([]byte, res.ContentLength)
	_, err := io.ReadFull(res.Body, body)
	Expect(err).To(BeNil())
	return string(body)
}

func ReadJsonBody(res *http.Response, v any) {
	body := make([]byte, res.ContentLength)
	_, err := io.ReadFull(res.Body, body)
	Expect(err).To(BeNil())
	err = json.Unmarshal(body, v)
	Expect(err).To(BeNil())
}
