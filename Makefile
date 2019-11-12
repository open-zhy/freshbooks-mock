.PHONY: build

DOCKER_BUILDKIT=1
IMAGE_NAME=open-zhy/freshbooks-mock

TAG_SHORT=$(shell git describe --tags --abbrev=0)

image:
	docker build -t $(IMAGE_NAME) -f Dockerfile .

deploy:
	docker tag $(IMAGE_NAME) $(IMAGE_NAME):$(TAG_SHORT)
	docker push $(IMAGE_NAME):$(TAG_SHORT)

test:
	npm run test