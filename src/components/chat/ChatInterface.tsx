"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bot, Loader2, LogOut, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Message from "./Message";
import { useToast } from "@/hooks/use-toast";
import { generateInitialPrompt } from "@/ai/flows/generate-initial-prompt";
import { respondToUserQuery } from "@/ai/flows/respond-to-user-query";

export type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  isSuggestion?: boolean;
};

export default function ChatInterface() {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  useEffect(() => {
    const fetchInitialPrompt = async () => {
      setMessages([{
        id: Date.now(),
        sender: 'bot',
        text: "Hello! I'm AdminBot. Ask me anything."
      }]);
      setIsLoading(true);
      try {
        const { prompt } = await generateInitialPrompt();
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: prompt,
          isSuggestion: true
        }]);
      } catch (error) {
        console.error("Failed to fetch initial prompt:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load an initial suggestion.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialPrompt();
  }, [toast]);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: query }]);
    setIsLoading(true);

    try {
      const { answer } = await respondToUserQuery({ query });
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: answer }]);
    } catch (error) {
      console.error("AI response error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Failed to get a response from the bot.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center justify-between border-b bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">AdminBot</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
          <LogOut className="h-5 w-5" />
        </Button>
      </header>
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} onSuggestionClick={handleSuggestionClick} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Bot is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>
      <footer className="border-t bg-card p-4">
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            autoComplete="off"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
