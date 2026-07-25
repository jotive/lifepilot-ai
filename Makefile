# ==============================================================================
# RoomIA — Product Component Automation Interface
# ==============================================================================

.PHONY: help web-dev web-build web-start api-dev api-build api-start workers-dev workers-build workers-start all-dev all-build all-start all-stop logs clean

# Default Help Target
help:
	@echo "🏠 RoomIA Product Commands (Organized by Component):"
	@echo ""
	@echo "  --- WEB Component (apps/web) ---"
	@echo "  make web-dev         - Run Web frontend local dev server (http://localhost:3000)"
	@echo "  make web-build       - Compile Web frontend production bundle"
	@echo "  make web-start       - Launch Web production container"
	@echo ""
	@echo "  --- API Component (apps/api) ---"
	@echo "  make api-dev         - Run API backend local dev server (http://localhost:4000)"
	@echo "  make api-build       - Build API production image"
	@echo "  make api-start       - Launch API production container"
	@echo ""
	@echo "  --- WORKERS Component (apps/workers) ---"
	@echo "  make workers-dev     - Run Workers background process locally"
	@echo "  make workers-build   - Build Workers production image"
	@echo "  make workers-start   - Launch Workers container"
	@echo ""
	@echo "  --- GLOBAL System Orchestration ---"
	@echo "  make all-dev         - Start all product parts in dev mode"
	@echo "  make all-build       - Build production artifacts for all components"
	@echo "  make all-start       - Launch full production stack"
	@echo "  make all-stop        - Stop all running product containers"
	@echo "  make logs            - Stream live logs from all running parts"
	@echo "  make clean           - Remove build artifacts"

# WEB Component Targets
web-dev:
	cd apps/web && npm run dev

web-build:
	cd apps/web && npm run build

web-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d web; else cd apps/web && npm run dev; fi

# API Component Targets
api-dev:
	cd apps/api && npm run dev

api-build:
	@if command -v docker >/dev/null 2>&1; then docker build -t roomia-api -f apps/api/Dockerfile apps/api; fi

api-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d api; else cd apps/api && npm run start; fi

# WORKERS Component Targets
workers-dev:
	cd apps/workers && npm run dev

workers-build:
	@if command -v docker >/dev/null 2>&1; then docker build -t roomia-workers -f apps/workers/Dockerfile apps/workers; fi

workers-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d workers; else cd apps/workers && npm run start; fi

# GLOBAL System Orchestration Targets
all-dev:
	cd apps/web && npm run dev

all-build: web-build api-build workers-build

all-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d; fi

all-stop:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml down; fi

logs:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml logs -f; fi

clean:
	rm -rf apps/web/dist
