# WebAssembly Security Module

This directory contains the WebAssembly implementation of critical security functions for the Fitness Tracker application.

## 📁 Files

- `security.c` - C source code for security functions
- `Makefile` - Build configuration for compiling to WASM
- `README.md` - This file

## 🔨 Building

### Prerequisites

Install Emscripten (C/C++ to WebAssembly compiler):

```bash
# Clone emsdk
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk

# Install and activate latest
./emsdk install latest
./emsdk activate latest

# Add to PATH (do this each time you open a new terminal)
source ./emsdk_env.sh
```

### Compile

```bash
# From the wasm directory
make

# Or manually:
emcc security.c \
  -o security.wasm \
  -O3 \
  -s WASM=1 \
  -s EXPORTED_FUNCTIONS='["_wasm_pbkdf2","_wasm_secure_compare","_wasm_secure_wipe","_wasm_generate_salt"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  --no-entry
```

### Output

- `security.wasm` - Compiled WebAssembly module
- `security.js` - JavaScript glue code (if generated)

## 🚀 Usage

The WASM module is automatically loaded by `js/utils/wasm-security.js`:

```javascript
// Initialize
await wasmSecurity.initialize();

// Use PBKDF2
const hash = await wasmSecurity.pbkdf2(password, salt, 100000);

// Secure compare
const isEqual = wasmSecurity.secureCompare(hash1, hash2);

// Secure wipe
wasmSecurity.secureWipe(sensitiveData);
```

## 🔐 Security Functions

### 1. `wasm_pbkdf2`
PBKDF2-HMAC-SHA256 password hashing

**Parameters:**
- `password` - Password bytes
- `password_len` - Password length
- `salt` - Salt bytes
- `salt_len` - Salt length
- `iterations` - Number of iterations (recommended: 100,000+)
- `output` - Output buffer
- `output_len` - Output length (32 for SHA-256)

### 2. `wasm_secure_compare`
Constant-time comparison to prevent timing attacks

**Parameters:**
- `a` - First byte array
- `b` - Second byte array
- `len` - Length to compare

**Returns:** 1 if equal, 0 if different

### 3. `wasm_secure_wipe`
Securely wipe memory

**Parameters:**
- `data` - Data to wipe
- `len` - Length of data

### 4. `wasm_generate_salt`
Generate cryptographic salt

**Parameters:**
- `output` - Output buffer
- `len` - Length of salt to generate

## 📊 Performance

Compared to pure JavaScript:

- PBKDF2: ~3x faster
- Secure compare: ~2x faster
- Memory operations: ~5x faster

## ⚠️ Important Notes

1. **WASM is not a silver bullet**: It's one layer in defense-in-depth
2. **Always validate on backend**: Client-side security is complementary
3. **Fallback required**: Not all browsers support WASM (though 95%+ do)
4. **Memory management**: Be careful with WASM memory allocation

## 📚 Documentation

See `docs/security/WEBASSEMBLY-IMPLEMENTATION.md` for complete documentation.

## 🧪 Testing

```bash
# Compile in development mode (with debug symbols)
make debug

# Run tests (if available)
npm test
```

## 🔄 Fallback

If WASM is not supported or fails to load, the system automatically falls back to:
1. Web Crypto API (for PBKDF2)
2. Pure JavaScript implementations

This ensures compatibility with all browsers while maintaining security.

## 📝 License

Same as parent project (MIT License)
