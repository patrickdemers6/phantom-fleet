package mocks

import (
	message "phantom-fleet/pkg/msg"

	"github.com/stretchr/testify/mock"
)

// Connection is a mock implementation of the telemetry.Connection interface
type Connection struct {
	mock.Mock
}

// Publish is a mock implementation of the telemetry.Connection.Publish method
func (c *Connection) Publish(msg *message.Message) error {
	args := c.Called()
	return args.Error(0)
}

// Shutdown is a mock implementation of the telemetry.Connection.Shutdown method
func (c *Connection) Shutdown() {
	c.Called()
}
