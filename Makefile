.PHONY: build

DOCKER_BUILDKIT=1
IMAGE_NAME=open-zhy/freshbooks-mock

TAG_SHORT=$(shell git describe --tags --abbrev=0)

image:
	docker build -t $(IMAGE_NAME) .

deploy:
	docker push $(IMAGE_NAME)

test:
	npm run test