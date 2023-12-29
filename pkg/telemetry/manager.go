package telemetry

import (
	"crypto/tls"
	"phantom-fleet/config"
)

// Manager manages connections to a fleet-telemetry server
type Manager struct {
	connections        map[string]Connection
	config             *config.Config
	Host               string
	Port               int
	CreateConnectionFn func(host string, port int, cert tls.Certificate) (Connection, error)
}

// NewManager creates a new connection manager
func NewManager(c *config.Config, host string, port int) *Manager {
	return &Manager{
		connections:        make(map[string]Connection),
		config:             c,
		Host:               host,
		Port:               port,
		CreateConnectionFn: NewConnection,
	}
}

// Get returns a connection by name
func (m *Manager) Get(name string) Connection {
	return m.connections[name]
}

// Create creates a new connection and adds it to the manager
func (m *Manager) Create(name string, cert tls.Certificate) (Connection, error) {
	existing := m.Get(name)
	if existing != nil {
		existing.Shutdown()
	}

	c, err := m.CreateConnectionFn(m.Host, m.Port, cert)
	if err != nil {
		return nil, err
	}

	m.connections[name] = c

	return c, nil
}

// Set adds a connection to the manager
func (m *Manager) Set(name string, c Connection) {
	m.connections[name] = c
}

// Delete shuts down the connection and removes it from the manager
func (m *Manager) Delete(name string) {
	if m.connections[name] != nil {
		m.connections[name].Shutdown()
		delete(m.connections, name)
	}
}

// Reset shuts down all connections and removes them from the manager
func (m *Manager) Reset() {
	for _, c := range m.connections {
		c.Shutdown()
	}
	m.connections = make(map[string]Connection)
}
