import { renderHook, act } from '@testing-library/react';
import useTyping from '../useTyping';

describe('useTyping', () => {
  const mockEmit = jest.fn();

  test('starts typing when input has text', () => {
    const { result } = renderHook(() => useTyping(mockEmit));

    act(() => {
      result.current.handleTyping({ target: { value: 'hello' } });
    });

    expect(mockEmit).toHaveBeenCalled();
  });

  test('stops typing when input is empty', () => {
    const { result } = renderHook(() => useTyping(mockEmit));

    act(() => {
      result.current.handleTyping({ target: { value: '' } });
    });

    expect(mockEmit).toHaveBeenCalled();
  });
});