package device

import message "phantom-fleet/pkg/msg"

type Device interface {
	GetIdentifier() string
	// Publish is fire and forget
	Publish(msg *message.Message)
	Shutdown()
	Errors() []error
}
