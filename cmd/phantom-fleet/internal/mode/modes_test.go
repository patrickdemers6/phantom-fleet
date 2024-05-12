package mode_test

import (
	"phantom-fleet/cmd/phantom-fleet/internal/mode"
	"phantom-fleet/config"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Modes", func() {
	It("errors on invalid mode", func() {
		err := mode.Run("invalid", &config.Config{})
		Expect(err).To(MatchError("invalid mode: invalid"))
	})
})
