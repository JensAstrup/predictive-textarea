import { stringHash } from '@/utils/hash'


describe('stringHash', () => {
  it('should return h-0 for an empty string', () => {
    const result = stringHash('')
    expect(result).toBe('h-0')
  })

  it('should return a deterministic hash for a given string', () => {
    const input = 'test string'
    const result = stringHash(input)

    // The hash should be consistent
    expect(result).toBe(stringHash(input))

    // The hash should start with h- and contain only valid base36 characters
    expect(result).toMatch(/^h-[0-9a-z]+$/)
  })

  it('should return different hashes for different strings', () => {
    const result1 = stringHash('string1')
    const result2 = stringHash('string2')

    expect(result1).not.toBe(result2)
  })

  it('should handle special characters correctly', () => {
    const specialString = '!@#$%^&*()_+'
    const result = stringHash(specialString)

    // Should be deterministic even with special characters
    expect(result).toBe(stringHash(specialString))
    expect(result).toMatch(/^h-[0-9a-z]+$/)
  })

  it('should handle unicode characters correctly', () => {
    const unicodeString = '😊🌟🚀'
    const result = stringHash(unicodeString)

    // Should be deterministic even with unicode
    expect(result).toBe(stringHash(unicodeString))
    expect(result).toMatch(/^h-[0-9a-z]+$/)
  })

  it('should use absolute value for negative hash results', () => {
    // Mock Math.abs to verify it's called
    const originalMathAbs = Math.abs
    const mockMathAbs = jest.fn().mockImplementation(x => originalMathAbs(x))
    Math.abs = mockMathAbs

    stringHash('test negative hash')

    expect(mockMathAbs).toHaveBeenCalled()

    // Restore original Math.abs
    Math.abs = originalMathAbs
  })
})
