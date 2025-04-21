import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import fetch from 'node-fetch'

// Only execute browser-specific code if we're in a browser-like environment
const isBrowserEnvironment = typeof window !== 'undefined'

if (isBrowserEnvironment) {
  // Mock ResizeObserver which is not available in jsdom
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Mock window.matchMedia which is not available in jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock IntersectionObserver which is not available in jsdom
  global.IntersectionObserver = class IntersectionObserver {
    root = null
    rootMargin = '0px'
    thresholds = [0]

    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver

  // Mock window.crypto for UUID generation
  Object.defineProperty(window, 'crypto', {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        // Use Array.prototype methods instead of loops
        Array.from(arr).forEach((_, i) => {
          arr[i] = Math.floor(Math.random() * 256)
        })
        return arr
      },
    },
  })
}

// Add TextEncoder and TextDecoder to the global scope for tests
// These are available in browsers but not in the JSDOM test environment
global.TextEncoder = TextEncoder as typeof global.TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder
global.fetch = fetch as unknown as typeof fetch
