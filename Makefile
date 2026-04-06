# -- Configuration --------------------------------------------
SHELL       := /bin/bash
BUILD_D     := build
BUILD_LOG   := $(BUILD_D)/$(shell date +%F-%H-%M-%S).log
IMG_NAME    := theboweryst
CTN_NAME    := theboweryst-showcase
PORT        := 3000
VOL_DB      := $(BUILD_D)/database
VOL_SYNC    := $(BUILD_D)/sync-html
VOL_POSTS   := $(BUILD_D)/posts

# -- Targets --------------------------------------------------
.PHONY: help build test run stop clean logs dev

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; \
		    { printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

build: ## Build image with podman and save logs and archive in build dir
	@mkdir -p $(BUILD_D)
	@echo "Building $(IMG_NAME), logs → $(BUILD_LOG)"
	@if podman image exists $(IMG_NAME); then \
	    podman image rm $(IMG_NAME); \
	fi
	set -o pipefail && \
		podman build --layers=false \
	    	-t $(IMG_NAME) -f Containerfile . 2>&1 \
	    	| tee $(BUILD_LOG) && \
		podman save -o $(BUILD_D)/$(IMG_NAME).tar $(IMG_NAME)

test: ## Run Nextjs tests
	npm run test

run: ## Setup and run container.
	@if ! podman image exists $(IMG_NAME); then \
	    echo "Image $(IMG_NAME) not found, run 'make build' first"; \
	    exit 1; \
	fi
	@mkdir -p $(VOL_DB) $(VOL_SYNC) $(VOL_POSTS)
	podman unshare chown -R 1001:1001 $(VOL_DB) $(VOL_POSTS)
	podman run -d \
		--name $(CTN_NAME) \
		-p $(PORT):$(PORT) \
		--replace \
		-v $(CURDIR)/$(VOL_DB):/app/database:Z \
		-v $(CURDIR)/$(VOL_SYNC):/app/sync-html:Z \
		-v $(CURDIR)/$(VOL_POSTS):/app/data/posts:Z \
		$(IMG_NAME)
	@echo "✅ Site Available on http://localhost:$(PORT)"
	@cp src/scripts/sync/*.html $(VOL_SYNC)/ 2>/dev/null || true
	podman exec $(CTN_NAME) node scripts/sync/syncInstagram

stop: ## Stop and remove container
	@if podman ps -q --filter name=$(CTN_NAME) \
	    --filter status=running | grep -q .; then \
	    podman stop $(CTN_NAME); \
	fi
	@if podman container exists $(CTN_NAME); then \
	    podman rm $(CTN_NAME); \
	fi

logs: ## Print log container
	podman logs -f $(CTN_NAME)

clean: stop ## Remove image, build artifacts and volumes
	@rm -f $(BUILD_D)/$(IMG_NAME).tar $(BUILD_D)/*.log
	@for d in $(VOL_DB) $(VOL_POSTS); do \
	    [ -d "$$d" ] && podman unshare rm -rf "$$d" || true; \
	done
	@[ -d "$(VOL_SYNC)" ] && rm -rf "$(VOL_SYNC)" || true
	@if podman image exists $(IMG_NAME); then \
	    podman rmi $(IMG_NAME); \
	fi

dev: ## Run de dev env
	npm run dev

.DEFAULT_GOAL := help
