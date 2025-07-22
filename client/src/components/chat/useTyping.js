import { useState, useCallback } from 'react';
import { WS_EVENTS } from './useSocket';

const useTyping = emit => {
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      emit(WS_EVENTS.ADD_TYPING);
    }
  }, [isTyping, emit]);

  const stopTyping = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      emit(WS_EVENTS.REMOVE_TYPING);
    }
  }, [isTyping, emit]);

  const handleTyping = useCallback(
    e => {
      e.target.value.trim() ? startTyping() : stopTyping();
    },
    [startTyping, stopTyping]
  );

  return { handleTyping, stopTyping };
};

export default useTyping;
