FROM golang:1.22

WORKDIR /

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN go build -o phantom-fleet cmd/phantom-fleet/main.go

CMD ["./phantom-fleet", "-config", "/config.json"]
