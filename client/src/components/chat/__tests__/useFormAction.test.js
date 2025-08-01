import { renderHook, act } from '@testing-library/react';
import useFormActions from '../useFormAction';

describe('useFormActions', () => {
  const mockReset = jest.fn();
  const mockClearErrors = jest.fn();
  const mockEmit = jest.fn();
  const mockStopTyping = jest.fn();

  test('submits message correctly', () => {
    const { result } = renderHook(() => 
      useFormActions(mockReset, mockClearErrors, mockEmit, mockStopTyping)
    );

    act(() => {
      result.current.onSubmit({ message: 'Hello!' });
    });

    expect(mockEmit).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
  });

  test('clears chat correctly', () => {
    const { result } = renderHook(() => 
      useFormActions(mockReset, mockClearErrors, mockEmit, mockStopTyping)
    );

    act(() => {
      result.current.handleClearChat();
    });

    expect(mockReset).toHaveBeenCalled();
    expect(mockClearErrors).toHaveBeenCalled();
  });
});