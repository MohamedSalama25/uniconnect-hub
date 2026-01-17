import { useEffect, useState } from "react";
import { signalRService } from "../services/signalr.service";

export type ChatMessage = {
  senderId: string;
  content: string;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // بدء الاتصال
    signalRService.start();

    // استقبال رسالة
    signalRService.onMessageReceived((message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      signalRService.stop();
    };
  }, []);

  const sendMessage = (receiverId: string, content: string) => {
    signalRService.sendMessage(receiverId, content);
  };

  return {
    messages,
    sendMessage
  };
}
