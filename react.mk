S3CMD ?= s3cmd
S3_FLAGS ?= --acl-public --delete-removed --no-progress --no-mime-magic --guess-mime-type
INTERMEDIATE_STEPS = mkdir -p dist/images && cp src/images/favicon.png dist/images/favicon.png
DIST_CLEAN = rm -rf dist

runserver: $(JS_SENTINAL)
	-mkdir dist && mkdir dist/images
	$(INTERMEDIATE_STEPS) && \
	npm run dev

build: $(JS_SENTINAL)
	npm run build:dev && \
	$(INTERMEDIATE_STEPS)

eslint: $(JS_SENTINAL)
	npm run eslint

test: $(JS_SENTINAL) eslint
	npm run test
	npm run cypress:test

cypress:
	npm run cypress:open

watch-test: $(JS_SENTINAL)
	npm run test:watch

deploy-stage: $(JS_SENTINAL)
	$(DIST_CLEAN) && \
	npm run build:prod && \
	$(INTERMEDIATE_STEPS) && \
	$(S3CMD) $(S3_FLAGS) sync --exclude-from='.s3ignore' . s3://$(STAGING_BUCKET)/

deploy-prod: $(JS_SENTINAL)
	$(DIST_CLEAN) && \
	npm run build:prod && \
	$(INTERMEDIATE_STEPS) && \
	$(S3CMD) $(S3_FLAGS) sync --exclude-from='.s3ignore' . s3://$(PROD_BUCKET)/

.PHONY: runserver build dev eslint test cypress deploy-stage deploy-prod
