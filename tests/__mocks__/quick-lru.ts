class MockQuickLRU<K, V> extends Map<K, V> {
  private readonly maxSize: number
  private readonly keyOrder: K[]

  constructor(options: { maxSize: number }) {
    super()
    this.maxSize = options.maxSize
    this.keyOrder = []
  }

  get(key: K): V | undefined {
    const value = super.get(key)
    if (value !== undefined) {
      // Move key to end of order (most recently used)
      const index = this.keyOrder.indexOf(key)
      if (index > -1) {
        this.keyOrder.splice(index, 1)
      }
      this.keyOrder.push(key)
    }
    return value
  }

  set(key: K, value: V): this {
    if (this.size >= this.maxSize && !this.has(key)) {
      // Remove least recently used item
      const lruKey = this.keyOrder[0]
      this.delete(lruKey)
      this.keyOrder.shift()
    }

    // Add or update key in order
    const index = this.keyOrder.indexOf(key)
    if (index > -1) {
      this.keyOrder.splice(index, 1)
    }
    this.keyOrder.push(key)

    return super.set(key, value)
  }

  delete(key: K): boolean {
    const index = this.keyOrder.indexOf(key)
    if (index > -1) {
      this.keyOrder.splice(index, 1)
    }
    return super.delete(key)
  }

  clear(): void {
    this.keyOrder.length = 0
    super.clear()
  }
}

export default MockQuickLRU 
