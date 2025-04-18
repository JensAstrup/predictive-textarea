import { getTextUptilCaretInElement } from '@/utils/get-text-up-until-caret-in-element';

describe('getTextUptilCaretInElement', () => {
  let element: HTMLElement;
  let mockSelection: { isCollapsed: boolean; getRangeAt: jest.Mock };
  let mockRange: { cloneRange: jest.Mock; endContainer: Node; endOffset: number };
  let mockPreCaretRange: { selectNodeContents: jest.Mock; setEnd: jest.Mock; toString: jest.Mock };
  
  beforeEach(() => {
    element = document.createElement('div');
    
    mockPreCaretRange = {
      selectNodeContents: jest.fn(),
      setEnd: jest.fn(),
      toString: jest.fn().mockReturnValue('text before caret')
    };
    
    mockRange = {
      cloneRange: jest.fn().mockReturnValue(mockPreCaretRange),
      endContainer: document.createTextNode('text'),
      endOffset: 5
    };
    
    mockSelection = {
      isCollapsed: true,
      getRangeAt: jest.fn().mockReturnValue(mockRange)
    };
    
    // Mock window.getSelection
    jest.spyOn(window, 'getSelection').mockReturnValue(mockSelection as unknown as Selection);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('should return text up until the caret position', () => {
    const result = getTextUptilCaretInElement(element);
    
    expect(window.getSelection).toHaveBeenCalled();
    expect(mockSelection.getRangeAt).toHaveBeenCalledWith(0);
    expect(mockRange.cloneRange).toHaveBeenCalled();
    expect(mockPreCaretRange.selectNodeContents).toHaveBeenCalledWith(element);
    expect(mockPreCaretRange.setEnd).toHaveBeenCalledWith(mockRange.endContainer, mockRange.endOffset);
    expect(mockPreCaretRange.toString).toHaveBeenCalled();
    expect(result).toBe('text before caret');
  });
  
  it('should return empty string when selection is null', () => {
    jest.spyOn(window, 'getSelection').mockReturnValue(null);
    
    const result = getTextUptilCaretInElement(element);
    
    expect(result).toBe('');
  });
  
  it('should return empty string when selection is not collapsed', () => {
    mockSelection.isCollapsed = false;
    
    const result = getTextUptilCaretInElement(element);
    
    expect(result).toBe('');
  });
}); 
