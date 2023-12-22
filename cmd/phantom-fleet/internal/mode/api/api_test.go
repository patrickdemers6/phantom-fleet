package api_test

import (
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"phantom-fleet/cmd/phantom-fleet/internal/mode/api"
)

var _ = Describe("API Mode", func() {
	It("errors with not implemented", func() {
		err := api.Run(nil, nil)
		Expect(err).To(MatchError("not implemented"))
	})
})
