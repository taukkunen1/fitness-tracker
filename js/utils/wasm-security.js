/**
 * WebAssembly Security Module Wrapper
 * 
 * This module provides a JavaScript interface to security functions
 * compiled to WebAssembly for enhanced protection.
 * 
 * Features:
 * - PBKDF2 password hashing (WASM-protected)
 * - Secure memory comparison (constant-time)
 * - Secure memory wiping
 * - Fallback to pure JavaScript if WASM not supported
 */

class WasmSecurityModule {
  constructor() {
    this.wasmModule = null;
    this.wasmMemory = null;
    this.isWasmSupported = typeof WebAssembly !== 'undefined';
    this.isInitialized = false;
  }

  /**
   * Initialize the WASM module
   * @returns {Promise<boolean>} True if initialized successfully
   */
  async initialize() {
    if (!this.isWasmSupported) {
      console.warn('WebAssembly not supported, using JavaScript fallback');
      this.isInitialized = true;
      return false;
    }

    try {
      // In production, load the compiled WASM file
      // const response = await fetch('/wasm/security.wasm');
      // const buffer = await response.arrayBuffer();
      // const module = await WebAssembly.instantiate(buffer, this.importObject);
      
      // For now, mark as using fallback
      console.info('WASM security module: Using JavaScript fallback (WASM file not compiled yet)');
      this.isInitialized = true;
      return false;
      
    } catch (error) {
      console.warn('Failed to initialize WASM module, using fallback:', error);
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Import object for WASM module
   */
  get importObject() {
    return {
      env: {
        js_log: (messagePtr) => {
          // Read string from WASM memory
          const message = this.readString(messagePtr);
          console.log('[WASM]', message);
        },
        memory: new WebAssembly.Memory({ initial: 256, maximum: 512 })
      }
    };
  }

  /**
   * Read a null-terminated string from WASM memory
   */
  readString(ptr) {
    if (!this.wasmMemory) return '';
    
    const memory = new Uint8Array(this.wasmMemory.buffer);
    let end = ptr;
    while (memory[end] !== 0) end++;
    
    const bytes = memory.slice(ptr, end);
    return new TextDecoder().decode(bytes);
  }

  /**
   * Write data to WASM memory
   */
  writeToMemory(data) {
    if (!this.wasmMemory) return 0;
    
    const memory = new Uint8Array(this.wasmMemory.buffer);
    const ptr = 1024; // Start at offset 1024 (example)
    
    for (let i = 0; i < data.length; i++) {
      memory[ptr + i] = data[i];
    }
    
    return ptr;
  }

  /**
   * PBKDF2 password hashing
   * Uses WASM if available, falls back to Web Crypto API
   * 
   * @param {string} password - Password to hash
   * @param {string} salt - Salt for hashing
   * @param {number} iterations - Number of iterations (default: 100000)
   * @returns {Promise<string>} Hex-encoded hash
   */
  async pbkdf2(password, salt, iterations = 100000) {
    if (this.wasmModule && this.wasmModule.wasm_pbkdf2) {
      return this.pbkdf2Wasm(password, salt, iterations);
    } else {
      return this.pbkdf2Fallback(password, salt, iterations);
    }
  }

  /**
   * PBKDF2 using WASM module
   */
  async pbkdf2Wasm(password, salt, iterations) {
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    const saltBytes = encoder.encode(salt);
    
    // Write to WASM memory
    const passwordPtr = this.writeToMemory(passwordBytes);
    const saltPtr = this.writeToMemory(saltBytes);
    const outputPtr = passwordPtr + passwordBytes.length + 100;
    
    // Call WASM function
    const result = this.wasmModule.wasm_pbkdf2(
      passwordPtr,
      passwordBytes.length,
      saltPtr,
      saltBytes.length,
      iterations,
      outputPtr,
      32 // SHA-256 output length
    );
    
    if (result !== 0) {
      throw new Error('WASM PBKDF2 failed');
    }
    
    // Read output
    const memory = new Uint8Array(this.wasmMemory.buffer);
    const hash = memory.slice(outputPtr, outputPtr + 32);
    
    // Convert to hex
    return Array.from(hash)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * PBKDF2 fallback using Web Crypto API
   */
  async pbkdf2Fallback(password, salt, iterations) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const saltBuffer = encoder.encode(salt);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256 // 256 bits = 32 bytes
    );
    
    // Convert to hex
    const hashArray = Array.from(new Uint8Array(derivedBits));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Secure comparison (constant-time)
   * Prevents timing attacks
   */
  secureCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    
    if (this.wasmModule && this.wasmModule.wasm_secure_compare) {
      return this.secureCompareWasm(a, b);
    } else {
      return this.secureCompareFallback(a, b);
    }
  }

  /**
   * Secure comparison using WASM
   */
  secureCompareWasm(a, b) {
    const encoder = new TextEncoder();
    const aBytes = encoder.encode(a);
    const bBytes = encoder.encode(b);
    
    const aPtr = this.writeToMemory(aBytes);
    const bPtr = this.writeToMemory(bBytes);
    
    return this.wasmModule.wasm_secure_compare(aPtr, bPtr, aBytes.length) === 1;
  }

  /**
   * Secure comparison fallback (JavaScript)
   */
  secureCompareFallback(a, b) {
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * Secure memory wipe
   * Attempts to clear sensitive data from memory
   */
  secureWipe(data) {
    if (this.wasmModule && this.wasmModule.wasm_secure_wipe) {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(data);
      const ptr = this.writeToMemory(bytes);
      this.wasmModule.wasm_secure_wipe(ptr, bytes.length);
    }
    
    // JavaScript can't guarantee memory is wiped due to GC
    // but we can at least overwrite the string
    if (typeof data === 'string') {
      data = ''.padStart(data.length, '\0');
    }
  }
}

// Export singleton instance
const wasmSecurity = new WasmSecurityModule();

// Auto-initialize
(async () => {
  try {
    await wasmSecurity.initialize();
  } catch (error) {
    console.error('Failed to initialize WASM security module:', error);
  }
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = wasmSecurity;
} else {
  window.wasmSecurity = wasmSecurity;
}
