.PHONY: install build start test lint clean

# Install project dependencies
install:
	npm install

# Build the project for production
build:
	npm run build

# Start the development server
start:
	npm run dev



# Setup the project
setup: install  build
	echo "Frontend setup complete. Use 'make start' to run the development server."

