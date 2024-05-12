package mocks

import (
	"github.com/stretchr/testify/mock"
	message "phantom-fleet/pkg/msg"
)

// Vehicle is a mock implementation of the device.Device interface
type Vehicle struct {
	mock.Mock
	Vin string
	Messages []*message.Message
}

type Device interface {
	GetIdentifier() string
	Publish(msg *message.Message) error
	Shutdown()
}

func (v *Vehicle) GetIdentifier() string {
	return v.Vin
}

func (v *Vehicle) Publish(msg *message.Message) {
	v.Called(msg)
	v.Messages = append(v.Messages, msg)
}

func (v *Vehicle) Shutdown() {
	// do nothing
	v.Called()
}

func (v *Vehicle) Errors() []error {
	v.Called()
	return nil
}
