import AuthGuard from "@/components/auth/AuthGuard";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatInterface />
    </AuthGuard>
  );
}
