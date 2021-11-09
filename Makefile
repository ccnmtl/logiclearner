APP=logiclearner

all: jenkins js-typecheck cypress-test
.PHONY: all

include *.mk

webpack: $(JS_SENTINAL)
	npm run dev
.PHONY: webpack

js-typecheck: $(JS_SENTINAL)
	npm run typecheck
.PHONY: js-typecheck

js-build: $(JS_SENTINAL)
	rm -rf media/build/*
	npm run build:prod
.PHONY: js-build

cypress-run: $(JS_SENTINAL)
	npm run cypress:run
.PHONY: cypress-run

cypress-open: $(JS_SENTINAL)
	npm run cypress:open
.PHONY: cypress-open

cypress-test: js-build
	npm run cypress:test
.PHONY: cypress-test

dev:
	trap 'kill 0' EXIT; make runserver & make webpack
.PHONY: dev
