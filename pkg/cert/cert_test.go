package cert_test

import (
	"crypto/x509"
	"phantom-fleet/pkg/cert"
	"time"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

var _ = Describe("Certificate Manager", func() {
	It("creates CA with expected properties", func() {
		m, err := cert.NewManager(nil)
		Expect(err).ToNot(HaveOccurred())

		// TeslaMotors required for fleet-telemetry to accept cert
		Expect(m.CA.Certificate.Issuer.CommonName).To(Equal("TeslaMotors"))
		Expect(m.CA.Certificate.IsCA).To(BeTrue())
		Expect(m.CA.Certificate.NotBefore.Unix()).To(BeNumerically("~", time.Now().Unix(), 2))
	})

	It("issues certificate using CA", func() {
		m, err := cert.NewManager(nil)
		Expect(err).ToNot(HaveOccurred())
		childCert, err := m.IssueCertificate("vin")
		Expect(err).ToNot(HaveOccurred())
		x509Cert, err := x509.ParseCertificate(childCert.Certificate[0])
		Expect(err).ToNot(HaveOccurred())
		
		pool := x509.NewCertPool()
		pool.AddCert(m.CA.Certificate)
		chains, err := x509Cert.Verify(x509.VerifyOptions{
			Roots: pool,
			KeyUsages: []x509.ExtKeyUsage{x509.ExtKeyUsageClientAuth},
		})
		Expect(err).ToNot(HaveOccurred())
		Expect(chains).To(HaveLen(1))
	})
})
