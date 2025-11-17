# Makefile for WebAssembly Security Module
# Requires Emscripten SDK (emsdk)

# Compiler and flags
CC = emcc
CFLAGS = -O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 --no-entry
DEBUG_FLAGS = -O0 -g -s ASSERTIONS=1

# Files
SOURCE = security.c
OUTPUT = security.wasm
OUTPUT_JS = security.js

# Exported functions
EXPORTS = -s EXPORTED_FUNCTIONS='["_wasm_pbkdf2","_wasm_secure_compare","_wasm_secure_wipe","_wasm_generate_salt"]'
RUNTIME = -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]'

# Default target
all: $(OUTPUT)

# Production build (optimized)
$(OUTPUT): $(SOURCE)
	@echo "Building WebAssembly module (production)..."
	$(CC) $(SOURCE) -o $(OUTPUT) $(CFLAGS) $(EXPORTS) $(RUNTIME)
	@echo "Build complete: $(OUTPUT)"
	@ls -lh $(OUTPUT)

# Development build (with debug symbols)
debug: $(SOURCE)
	@echo "Building WebAssembly module (debug)..."
	$(CC) $(SOURCE) -o $(OUTPUT) $(DEBUG_FLAGS) $(EXPORTS) $(RUNTIME)
	@echo "Debug build complete: $(OUTPUT)"
	@ls -lh $(OUTPUT)

# Optimized build with wasm-opt (requires binaryen)
optimized: $(OUTPUT)
	@echo "Optimizing with wasm-opt..."
	wasm-opt $(OUTPUT) -O3 -o $(OUTPUT)
	@echo "Optimization complete"
	@ls -lh $(OUTPUT)

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	rm -f $(OUTPUT) $(OUTPUT_JS) *.wasm.map a.out*
	@echo "Clean complete"

# Help
help:
	@echo "WebAssembly Security Module Build"
	@echo ""
	@echo "Targets:"
	@echo "  make          - Build production WASM module"
	@echo "  make debug    - Build with debug symbols"
	@echo "  make optimized - Build and optimize with wasm-opt"
	@echo "  make clean    - Remove build artifacts"
	@echo "  make help     - Show this help"
	@echo ""
	@echo "Requirements:"
	@echo "  - Emscripten SDK (emsdk) installed and activated"
	@echo "  - Optional: Binaryen (wasm-opt) for optimization"

# Check if emcc is available
check:
	@echo "Checking for Emscripten..."
	@which emcc > /dev/null && echo "✓ emcc found" || echo "✗ emcc not found - install Emscripten SDK"
	@which wasm-opt > /dev/null && echo "✓ wasm-opt found" || echo "✗ wasm-opt not found (optional)"

.PHONY: all debug optimized clean help check
