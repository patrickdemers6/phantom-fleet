# Define the target binary file name
BINARY_NAME := phantom-fleet

# Define the Go compiler
GO := go

.PHONY: install build test

install:
	@$(GO) mod download

build:
	@$(GO) build -o $(BINARY_NAME) ./cmd/phantom-fleet/main.go

test:
	@$(GO) test -v ./...
