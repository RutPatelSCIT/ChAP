import { Bot, UserCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "./ChatInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

type MessageProps = {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
};

export default function ChatMessage({ message, onSuggestionClick }: MessageProps) {
  const isUser = message.sender === "user";

  if (message.isSuggestion) {
     return (
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Here's a suggestion to get you started:</p>
            <Button
                variant="outline"
                className="font-code h-auto whitespace-normal text-left justify-start"
                onClick={() => onSuggestionClick(message.text)}
            >
                {message.text}
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3",
        isUser && "flex-row-reverse"
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarFallback className={cn(isUser ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground")}>
          {isUser ? <UserCircle className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 text-sm shadow-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
}
