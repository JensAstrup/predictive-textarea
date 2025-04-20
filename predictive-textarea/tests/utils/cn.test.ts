import { cn } from '@/utils/cn'


describe('cn utility', () => {
  it('should join multiple strings with spaces', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should filter out falsy values', () => {
    const result = cn('class1', false, null, undefined, 'class2', '', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('should return an empty string when no classes are provided', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('should return an empty string when only falsy values are provided', () => {
    const result = cn(false, null, undefined, '')
    expect(result).toBe('')
  })
})
