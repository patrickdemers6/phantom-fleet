package constants

type contextKey string

const (
	DeviceManager = contextKey("DM")
	CertManager   = contextKey("CM")
	DataStore     = contextKey("DS")
)
