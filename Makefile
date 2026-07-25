# ==============================================================================
# RoomIA — Product Component Automation Interface
# ==============================================================================

.PHONY: help web-dev web-build web-start api-dev api-build api-start api-test inference-dev inference-build inference-start cron-dev cron-build cron-start all-dev all-build all-start all-stop test logs clean

help:
	@echo "🏠 RoomIA Product Commands (Organized by Component):"
	@echo ""
	@echo "  --- WEB Component (apps/web) ---"
	@echo "  make web-dev            - Run Web React frontend local dev server (http://localhost:3000)"
	@echo "  make web-build          - Compile Web frontend production bundle"
	@echo "  make web-start          - Launch Web production container"
	@echo ""
	@echo "  --- API Component (apps/api) ---"
	@echo "  make api-dev            - Run RESTful API backend local dev server (http://localhost:4000)"
	@echo "  make api-build          - Build API production image"
	@echo "  make api-start          - Launch API production container"
	@echo "  make api-test           - Run API automated test suite"
	@echo ""
	@echo "  --- INFERENCE WORKER Component (apps/workers/inference-worker) ---"
	@echo "  make inference-dev      - Run AI Vision Inference Worker locally"
	@echo "  make inference-build    - Build Inference Worker production image"
	@echo "  make inference-start    - Launch Inference Worker container"
	@echo ""
	@echo "  --- CRON WORKER Component (apps/workers/cron-worker) ---"
	@echo "  make cron-dev           - Run Scheduled Jobs Cron Worker locally"
	@echo "  make cron-build         - Build Cron Worker production image"
	@echo "  make cron-start         - Launch Cron Worker container"
	@echo ""
	@echo "  --- GLOBAL System Orchestration & Verification ---"
	@echo "  make all-dev            - Start all product parts in dev mode"
	@echo "  make all-build          - Build production artifacts for all components"
	@echo "  make all-start          - Launch full production stack"
	@echo "  make all-stop           - Stop all running product containers"
	@echo "  make test               - Run full automated test suite"
	@echo "  make logs               - Stream live logs from all running parts"
	@echo "  make clean              - Remove build artifacts"

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

api-test:
	cd apps/api && npm test

# INFERENCE WORKER Targets
inference-dev:
	cd apps/workers/inference-worker && npm run dev

inference-build:
	@if command -v docker >/dev/null 2>&1; then docker build -t roomia-inference-worker -f infra/docker/Dockerfile.inference-worker .; fi

inference-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d inference-worker; else cd apps/workers/inference-worker && npm run start; fi

# CRON WORKER Targets
cron-dev:
	cd apps/workers/cron-worker && npm run dev

cron-build:
	@if command -v docker >/dev/null 2>&1; then docker build -t roomia-cron-worker -f infra/docker/Dockerfile.cron-worker .; fi

cron-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d cron-worker; else cd apps/workers/cron-worker && npm run start; fi

# GLOBAL Orchestration & Test Targets
all-dev:
	cd apps/web && npm run dev

all-build: web-build api-build inference-build cron-build

all-start:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml up -d; fi

all-stop:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml down; fi

test: api-test web-build

logs:
	@if command -v docker >/dev/null 2>&1; then docker compose -f infra/docker/docker-compose.yml logs -f; fi

clean:
	rm -rf apps/web/dist
