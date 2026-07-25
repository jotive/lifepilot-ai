# ==============================================================================
# RoomIA — Domain-Oriented Automation Interface
# ==============================================================================

.PHONY: help dev build start stop restart logs clean

# Default Target
help:
	@echo "🏠 RoomIA Domain Interface Commands:"
	@echo "  make dev      - Start local development environment"
	@echo "  make build    - Compile production artifacts & container images"
	@echo "  make start    - Launch all production services"
	@echo "  make stop     - Halt all running services"
	@echo "  make restart  - Restart all services"
	@echo "  make logs     - Stream live logs from active services"
	@echo "  make clean    - Remove build artifacts and temporary files"

# Intent-Driven Domain Targets (Technology Agnostic)
dev:
	cd apps/web && npm run dev

build:
	cd apps/web && npm run build
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml build; fi

start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d; else cd apps/web && npm run dev; fi

stop:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml down; fi

restart: stop start

logs:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml logs -f; fi

clean:
	rm -rf apps/web/dist
