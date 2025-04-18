import { isCaretAtLineEnd } from '@/utils/is-caret-at-line-end';

describe('isCaretAtLineEnd', () => {
  let mockSelection: Partial<Selection>;
  let focusNode: Node;
  
  beforeEach(() => {
    focusNode = document.createTextNode('This is a text');
    
    mockSelection = {
      focusNode,
      focusOffset: 14
    };
  });
  
  it('should return true when caret is at the end of line with no next sibling', () => {
    mockSelection.focusNode = document.createTextNode('This is a text');
    mockSelection.focusOffset = 14; // At the end of the text
    
    const result = isCaretAtLineEnd(mockSelection as Selection);
    
    expect(result).toBe(true);
  });
  
  it('should return true when caret is at the end of line with empty next sibling', () => {
    const nextSibling = document.createTextNode('');
    Object.defineProperty(focusNode, 'nextSibling', {
      value: nextSibling,
      writable: true
    });
    
    const result = isCaretAtLineEnd(mockSelection as Selection);
    
    expect(result).toBe(true);
  });
  
  it('should return true when caret is at the end of line with whitespace-only next sibling', () => {
    const nextSibling = document.createTextNode('   ');
    Object.defineProperty(focusNode, 'nextSibling', {
      value: nextSibling,
      writable: true
    });
    
    const result = isCaretAtLineEnd(mockSelection as Selection);
    
    expect(result).toBe(true);
  });
  
  it('should return false when caret is not at the end of line', () => {
    mockSelection.focusOffset = 5; // Middle of the text
    
    const result = isCaretAtLineEnd(mockSelection as Selection);
    
    expect(result).toBe(false);
  });
  
  it('should return false when next sibling has non-whitespace content', () => {
    mockSelection.focusOffset = 14; // End of the text
    const nextSibling = document.createTextNode('Next line text');
    Object.defineProperty(focusNode, 'nextSibling', {
      value: nextSibling,
      writable: true
    });
    
    const result = isCaretAtLineEnd(mockSelection as Selection);
    
    expect(result).toBe(false);
  });
  
  it('should return false when focusNode is null', () => {
    mockSelection.focusNode = null;
    
    const result = isCaretAtLineEnd(mockSelection as Selection);
    
    expect(result).toBe(false);
  });
}); 
