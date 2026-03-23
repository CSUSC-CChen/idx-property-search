# Variables for easy editing
BACKEND_DIR = backend
FRONTEND_DIR = frontend

.PHONY: install start stop clean

# 1. Install dependencies for both projects
install:
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install

# 2. Start both services simultaneously
# We run the backend in the background (&) so the terminal stays open for the frontend
start:
	@echo "Launching the full stack..."
	(cd $(BACKEND_DIR) && npm start) & (cd $(FRONTEND_DIR) && npm start)

# 3. Stop all running node processes (useful if things get stuck)
stop:
	@echo "Killing all node processes..."
	killall node || true

# 4. Clean up (like 'make clean' in C++)
clean:
	rm -rf $(BACKEND_DIR)/node_modules
	rm -rf $(FRONTEND_DIR)/node_modules