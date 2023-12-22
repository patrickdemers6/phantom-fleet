package telemetry

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"time"

	"phantom-fleet/config"
	"phantom-fleet/pkg/msg"

	"github.com/golang/protobuf/proto"
	"github.com/gorilla/websocket"
	"github.com/teslamotors/fleet-telemetry/messages/tesla"
)

// Connection represents a fleet telemetry server connecton.
type Connection struct {
	conn *websocket.Conn
}

// NewConnection creates a connection to a fleet-telemetry server.
func NewConnection(c *config.Config) (*Connection, error) {
	cert, err := tls.LoadX509KeyPair(c.Server.TLS.ServerCert, c.Server.TLS.ServerKey)
	if err != nil {
		panic(err)
	}
	dialer := &websocket.Dialer{HandshakeTimeout: 1 * time.Second,
		TLSClientConfig: &tls.Config{
			RootCAs:            nil,
			Certificates:       []tls.Certificate{cert},
			InsecureSkipVerify: true,
		}}
	conn, _, err := dialer.Dial(fmt.Sprintf("wss://%s:%d", c.Server.Host, c.Server.Port), http.Header{})
	if err != nil {
		panic(err)
	}

	return &Connection{
		conn: conn,
	}, nil
}

// Shutdown closes the connection to the server.
func (s *Connection) Shutdown() {
	_ = s.conn.Close()
}

// Publish sends telemetry data to the server.
func (s *Connection) Publish(msg *message.Message) error {
	b, err := proto.Marshal(msg.Payload())
	if err != nil {
		return fmt.Errorf("failed to marshal payload")
	}

	return s.conn.WriteMessage(websocket.BinaryMessage, tesla.FlatbuffersStreamToBytes([]byte(fmt.Sprintf("%s.%s", msg.DeviceType, msg.VIN)), []byte(msg.Topic), []byte(msg.TxID), b, 1, []byte(msg.MessageID), []byte(msg.DeviceType), []byte(msg.VIN), uint64(time.Now().UnixMilli())))
}
