dev:
	docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d
	
dev-build:
	docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build

staging:
	docker-compose -f docker-compose.yaml -f docker-compose.staging.yaml up -d --build

prod:
	docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build
