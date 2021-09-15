STAGING_URL=https://logiclearner.stage.ctl.columbia.edu/
PROD_URL=https://logiclearner.ctl.columbia.edu/
STAGING_BUCKET=logiclearner.stage.ctl.columbia.edu
PROD_BUCKET=logiclearner.ctl.columbia.edu
INTERMEDIATE_STEPS ?= echo nothing
NODE_MODULES ?= ./node_modules
DIST ?= dist
JS_SENTINAL ?= $(NODE_MODULES)/sentinal

include *.mk

.DEFAULT_GOAL = install

$(JS_SENTINAL): package.json
	rm -rf $(NODE_MODULES)
	npm install
	touch $(JS_SENTINAL)

install:
	touch package.json 
	make $(JS_SENTINAL)

clean:
	rm -rf $(NODE_MODULES) $(DIST) $(DATA_SENTINAL)

.PHONY: clean install
