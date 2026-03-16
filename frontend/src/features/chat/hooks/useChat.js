import { useState, useCallback } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content) => {
    const userMessage = { id: Date.now(), role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Socket-based message sending will be handled by SocketContext
      // This is a placeholder for direct API fallback
      return userMessage;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, setMessages, isLoading, sendMessage, clearMessages };
}
