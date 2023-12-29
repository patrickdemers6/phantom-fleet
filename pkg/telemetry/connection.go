package telemetry

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"time"

	"phantom-fleet/config"
	message "phantom-fleet/pkg/msg"

	"github.com/golang/protobuf/proto"
	"github.com/gorilla/websocket"
	"github.com/teslamotors/fleet-telemetry/messages/tesla"
)

// Connection represents a connection to remote server.
type Connection interface {
	Publish(msg *message.Message) error
	Shutdown()
}

type WebSocketConn interface {
	WriteMessage(messageType int, data []byte) error
	Close() error
}

// MTLS represents an mTLS connection to a fleet-telemetry server.
type MTLS struct {
	conn WebSocketConn
}

func NewMTLSWithMockConn(conn WebSocketConn) *MTLS {
	return &MTLS{
		conn: conn,
	}
}

// NewConnection creates a connection to a fleet-telemetry server.
func NewConnection(c *config.Config) (Connection, error) {
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

	return &MTLS{
		conn: conn,
	}, nil
}

// Shutdown closes the connection to the server.
func (mtls *MTLS) Shutdown() {
	_ = mtls.conn.Close()
}

// Publish sends telemetry data to the server.
func (mtls *MTLS) Publish(msg *message.Message) error {
	b, err := proto.Marshal(msg.Payload())
	if err != nil {
		return fmt.Errorf("failed to marshal payload")
	}

	return mtls.conn.WriteMessage(websocket.BinaryMessage, tesla.FlatbuffersStreamToBytes([]byte(fmt.Sprintf("%s.%s", msg.DeviceType, msg.VIN)), []byte(msg.Topic), []byte(msg.TxID), b, 1, []byte(msg.MessageID), []byte(msg.DeviceType), []byte(msg.VIN), uint64(time.Now().UnixMilli())))
}
