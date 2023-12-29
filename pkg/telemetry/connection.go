package telemetry

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"time"

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

// MTLS represents an mTLS connection to a fleet-telemetry server.
type MTLS struct {
	conn *websocket.Conn
}

// NewConnection creates a connection to a fleet-telemetry server.
func NewConnection(host string, port int, cert tls.Certificate) (Connection, error) {
	dialer := &websocket.Dialer{HandshakeTimeout: 1 * time.Second,
		TLSClientConfig: &tls.Config{
			RootCAs:            nil,
			Certificates:       []tls.Certificate{cert},
			InsecureSkipVerify: true,
		}}
	conn, _, err := dialer.Dial(fmt.Sprintf("wss://%s:%d", host, port), http.Header{})
	if err != nil {
		return nil, err
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
