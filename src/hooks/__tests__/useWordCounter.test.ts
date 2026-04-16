import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWordCounter } from '@/hooks/useWordCounter';

describe('useWordCounter', () => {
  it('returns zero counts for empty text', () => {
    const { result } = renderHook(() => useWordCounter());
    expect(result.current.wordDetails.total).toBe(0);
    expect(result.current.wordDetails.arabic).toBe(0);
    expect(result.current.wordDetails.english).toBe(0);
  });

  it('counts Arabic words correctly', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('مرحبا بالعالم العربي');
    });
    expect(result.current.wordDetails.arabic).toBe(3);
    expect(result.current.wordDetails.total).toBe(3);
  });

  it('counts English words correctly', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('Hello world test');
    });
    expect(result.current.wordDetails.english).toBe(3);
    expect(result.current.wordDetails.total).toBe(3);
  });

  it('counts mixed Arabic and English', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('مرحبا Hello عالم world');
    });
    expect(result.current.wordDetails.arabic).toBe(2);
    expect(result.current.wordDetails.english).toBe(2);
    expect(result.current.wordDetails.total).toBe(4);
  });

  it('counts numbers as separate words', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('test 123 456');
    });
    expect(result.current.wordDetails.english).toBe(1);
    expect(result.current.wordDetails.numbers).toBe(2);
    expect(result.current.wordDetails.total).toBe(3);
  });

  it('clearAll resets everything', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('some text');
    });
    expect(result.current.wordDetails.total).toBeGreaterThan(0);

    act(() => {
      result.current.clearAll();
    });
    expect(result.current.text).toBe('');
    expect(result.current.wordDetails.total).toBe(0);
  });

  it('handleFileContent replaces text input', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('manual text');
    });
    expect(result.current.text).toBe('manual text');

    act(() => {
      result.current.handleFileContent('file content here', 'test.txt');
    });
    expect(result.current.text).toBe('');
    expect(result.current.fileContent).toBe('file content here');
  });

  it('handles whitespace-only input as zero', () => {
    const { result } = renderHook(() => useWordCounter());
    act(() => {
      result.current.handleTextChange('   \n\t  ');
    });
    expect(result.current.wordDetails.total).toBe(0);
  });
});
