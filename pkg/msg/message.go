package message

import (
	"encoding/json"
	"time"

	"github.com/spf13/afero"
	"github.com/teslamotors/fleet-telemetry/protos"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// Value stores the type-dependent value of a field.
// Only one of the fields should be set.
type Value struct {
	StringValue   *string               `json:"stringValue,omitempty"`
	FloatValue    *float32              `json:"floatValue,omitempty"`
	DoubleValue   *float64              `json:"doubleValue,omitempty"`
	IntValue      *int32                `json:"intValue,omitempty"`
	LongValue     *int64                `json:"longValue,omitempty"`
	BooleanValue  *bool                 `json:"booleanValue,omitempty"`
	LocationValue *protos.LocationValue `json:"locationValue,omitempty"`
}

// Data stores the custom fields included in a message.
type Data struct {
	Key   string `json:"key"`
	Value Value  `json:"value"`
}

// Message stores data for a single message to fleet telemetry server.
type Message struct {
	TxID       string `json:"txid"`
	Topic      string `json:"topic"`
	VIN        string `json:"vin"`
	DeviceType string `json:"device_type"`
	CreatedAt  int64  `json:"createdAt"`
	MessageID  string `json:"messageId"`
	Data       []Data `json:"data"`
	Cert       string `json:"cert,omitempty"`
	Key        string `json:"key,omitempty"`
}

func LoadFromJson(path string, fs afero.Fs) ([]*Message, error) {
	file, err := afero.ReadFile(fs, path)
	if err != nil {
		return nil, err
	}

	var messages []*Message
	err = json.Unmarshal(file, &messages)
	if err != nil {
		return nil, err
	}

	return messages, nil
}

func (m *Message) Payload() *protos.Payload {
	datum := make([]*protos.Datum, 0)
	for _, d := range m.Data {
		datum = append(datum, makeDatum(d.Key, d.Value))
	}
	return &protos.Payload{
		CreatedAt: timestamppb.New(time.UnixMilli(m.CreatedAt)),
		Vin:       m.VIN,
		Data:      datum,
	}
}

func makeDatum(fieldName string, fieldValue Value) *protos.Datum {
	return &protos.Datum{
		Key:   protos.Field(protos.Field_value[fieldName]),
		Value: getDatumValue(fieldValue),
	}
}

func getDatumValue(v Value) *protos.Value {
	switch {
	case v.StringValue != nil:
		return &protos.Value{
			Value: &protos.Value_StringValue{StringValue: *v.StringValue},
		}
	case v.FloatValue != nil:
		return &protos.Value{
			Value: &protos.Value_FloatValue{FloatValue: *v.FloatValue},
		}
	case v.IntValue != nil:
		return &protos.Value{
			Value: &protos.Value_IntValue{IntValue: *v.IntValue},
		}
	case v.LongValue != nil:
		return &protos.Value{
			Value: &protos.Value_LongValue{LongValue: *v.LongValue},
		}
	case v.DoubleValue != nil:
		return &protos.Value{
			Value: &protos.Value_DoubleValue{DoubleValue: *v.DoubleValue},
		}
	case v.BooleanValue != nil:
		return &protos.Value{
			Value: &protos.Value_BooleanValue{BooleanValue: *v.BooleanValue},
		}
	case v.LocationValue != nil:
		return &protos.Value{
			Value: &protos.Value_LocationValue{LocationValue: &protos.LocationValue{
				Latitude:  v.LocationValue.Latitude,
				Longitude: v.LocationValue.Longitude,
			}},
		}
	}
	return nil
}
