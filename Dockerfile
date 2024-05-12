FROM golang:1.22

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN go build -o phantom-fleet cmd/phantom-fleet/main.go

CMD ["./phantom-fleet", "--config", "/config/config.json"]
