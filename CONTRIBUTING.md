# Contributing to Phantom Fleet

Thank you for your interest in contributing to Phantom Fleet!
All contributions are welcome, including bug reports, bug fixes, new features, and documentation improvements.
Before working on any significant changes, please open an issue to discuss your proposed changes and ensure they align with the project's direction to avoid any unnecessary work.

## Local Setup

### Frontend

To run the frontend for development, run these commands:

```sh
cd client
npm install
npm run dev
```

If developing just the frontend, you can start the backend and database using `docker compose up`. Otherwise, follow the instructions below.

### Backend

To run the backend, you can simply:
```sh
go run cmd/phantom-fleet/main.go
```

Optionally, you can pass `--config <config file path>`.
Whenever you make changes to the backend, stop the server and re-run the above command.

You will also need to start the database. This can be done by running:
```sh
docker run -p 27017:27017 -d mongo
```

Then, be sure to set `MONGO_URI=mongo://localhost:27017` when running the backend.

## Contribution Process

1. Open an issue to discuss your proposed changes and ensure they align with the project's direction to avoid any unnecessary work.
2. Perform the development work. Please include test coverage for all changes.
3. Make any documentation updates.
4. Perform a self-review of your code changes.
5. Submit a pull request.
6. Work with maintainers to resolve any feedback.
7. Once approved, your changes will be merged into the main branch 🎉
