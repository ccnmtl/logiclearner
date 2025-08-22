APP=logiclearner

all: jenkins eslint js-typecheck cypress-test jstest

.PHONY: all

include *.mk

integrationserver: $(PY_SENTINAL)
	$(MANAGE) integrationserver --noinput
.PHONY: integrationserver

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

cypress-test-travis: js-build
	npm run cypress:test-travis
.PHONY: cypress-test-travis

cypress-test: js-build
	npm run cypress:test
.PHONY: cypress-test

cypress:
	trap 'kill 0' EXIT; make integrationserver & make webpack & make cypress-open
.PHONY: cypress

dev:
	trap 'kill 0' EXIT; make runserver & make webpack
.PHONY: dev