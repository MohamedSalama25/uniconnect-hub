import * as signalR from "@microsoft/signalr";

type MessageCallback = (message: any) => void;
const accessTokenFactory=JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user?.token;
class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private messageReceivedCallback?: MessageCallback;
  private messageSentCallback?: MessageCallback;
  

  constructor() {
    const baseUrl = localStorage.getItem("baseUrl") ||import.meta.env.VITE_API_BASE_URL;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/chatHub`, {
        accessTokenFactory: () => accessTokenFactory || ""
      })
      .withAutomaticReconnect()
      .build();

    // استقبال رسالة
    this.connection.on("ReceiveMessage", (message) => {
      console.log("Message received:", message);
      this.messageReceivedCallback?.(message);
    });

    // تأكيد الإرسال
    this.connection.on("MessageSent", (message) => {
      console.log("Message sent:", message);
      this.messageSentCallback?.(message);
    });
  }

  // 🚀 بدء الاتصال
  async start() {
    if (!this.connection) return;

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await this.connection.start();
      console.log("Connected to SignalR Hub");
    } catch (err) {
      console.error("SignalR connection error:", err);
      setTimeout(() => this.start(), 5000);
    }
  }

  // 🛑 إيقاف الاتصال
  async stop() {
    await this.connection?.stop();
  }

  // ✉️ إرسال رسالة
  async sendMessage(receiverId: string, content: string) {
    if (!this.connection) return;

    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn("SignalR not connected. Attempting to connect...");
      try {
        await this.start();
      } catch (err) {
        console.error("Failed to connect before sending message:", err);
        return;
      }
    }

    if (this.connection.state === signalR.HubConnectionState.Connected) {
        await this.connection.invoke("SendMessage", receiverId, content);
    }
  }

  // 🔔 Events
  onMessageReceived(callback: MessageCallback) {
    this.messageReceivedCallback = callback;
  }

  onMessageSent(callback: MessageCallback) {
    this.messageSentCallback = callback;
  }
}

export const signalRService = new SignalRService();
