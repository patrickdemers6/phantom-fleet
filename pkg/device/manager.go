package device

// Manager manages connections to a fleet-telemetry server
type Manager struct {
	Devices map[string]Device
}

// NewManager creates a new connection manager
func NewManager() *Manager {
	return &Manager{
		Devices: make(map[string]Device),
	}
}

// Get returns a connection by name
func (m *Manager) Get(identifier string) Device {
	return m.Devices[identifier]
}

// Add adds a new device to the manager
func (m *Manager) Add(device Device) {
	identifier := device.GetIdentifier()
	existing := m.Get(identifier)
	if existing != nil {
		existing.Shutdown()
	}

	m.Devices[identifier] = device
}

// Delete shuts down the connection and removes it from the manager
func (m *Manager) Delete(identifier string) {
	if m.Devices[identifier] != nil {
		m.Devices[identifier].Shutdown()
		delete(m.Devices, identifier)
	}
}

// Reset shuts down all connections and removes them from the manager
func (m *Manager) Reset() {
	for _, d := range m.Devices {
		d.Shutdown()
	}
	m.Devices = make(map[string]Device)
}
