# ==============================================================================
# RoomIA — Project Automation Makefile
# ==============================================================================

.PHONY: help dev-web dev-api dev-workers build-web docker-build docker-up docker-down docker-logs clean

# Default Target
help:
	@echo "🏠 RoomIA Commands:"
	@echo "  make dev-web       - Run frontend web dev server (http://localhost:3000)"
	@echo "  make dev-api       - Run backend API server (http://localhost:4000)"
	@echo "  make dev-workers   - Run background worker service"
	@echo "  make build-web     - Compile production build for web frontend"
	@echo "  make docker-build  - Build Docker containers for all services"
	@echo "  make docker-up     - Start all Docker containers (web, api, workers)"
	@echo "  make docker-down   - Stop all running Docker containers"
	@echo "  make docker-logs   - Stream live logs from Docker containers"
	@echo "  make clean         - Clean build output directories"

# Local Development Commands
dev-web:
	cd apps/web && npm run dev

dev-api:
	cd apps/api && npm run dev

dev-workers:
	cd apps/workers && npm run dev

build-web:
	cd apps/web && npm run build

# Docker Automation Commands
docker-build:
	docker compose -f infra/docker/docker-compose.yml build

docker-up:
	docker compose -f infra/docker/docker-compose.yml up -d

docker-down:
	docker compose -f infra/docker/docker-compose.yml down

docker-logs:
	docker compose -f infra/docker/docker-compose.yml logs -f

# Maintenance Commands
clean:
	rm -rf apps/web/dist
