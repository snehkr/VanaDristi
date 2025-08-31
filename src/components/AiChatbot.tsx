import { useState, useEffect, useRef } from "react";
import { useApi } from "@/api/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Bot, User, Loader2 } from "lucide-react";
import type { ChatMessage } from "@/types";

interface AiChatbotProps {
  plantId: string;
}

const AiChatbot = ({ plantId }: AiChatbotProps): React.ReactElement => {
  const { useGetAiAnalysis, usePostChatMessage } = useApi();
  const { data: initialAnalysis, isLoading: isLoadingAnalysis } =
    useGetAiAnalysis(plantId);
  const chatMutation = usePostChatMessage();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialAnalysis?.ai_result) {
      setMessages([
        {
          type: "ai",
          text: `*Diagnosis:* ${initialAnalysis.ai_result.diagnosis}. ${initialAnalysis.ai_result.notes}`,
        },
      ]);
    } else if (!isLoadingAnalysis && initialAnalysis === null) {
      setMessages([
        {
          type: "ai",
          text: `Hello! I couldn't find a recent analysis, but I'm ready to help. How is your plant doing today?`,
        },
      ]);
    }
  }, [initialAnalysis, isLoadingAnalysis]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    chatMutation.mutate(
      { plant_id: plantId, question: input },
      {
        onSuccess: (data) => {
          const aiMessage: ChatMessage = { type: "ai", text: data.response };
          setMessages((prev) => [...prev, aiMessage]);
        },
        onError: () => {
          const errorMessage: ChatMessage = {
            type: "ai",
            text: "Sorry, I couldn't process that. Please try again.",
          };
          setMessages((prev) => [...prev, errorMessage]);
        },
      }
    );
  };

  return (
    <Card className="flex flex-col h-full max-h-[720px]">
      <CardHeader>
        <CardTitle>AI Plant Doctor</CardTitle>
        <CardDescription>
          Ask me anything about your plant's health.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto pr-2 space-y-4">
        {isLoadingAnalysis ? (
          <Skeleton className="h-12 w-3/4" />
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.type === "user" ? "justify-end" : ""
              }`}
            >
              {msg.type === "ai" && (
                <Bot className="w-8 h-8 text-green-700 flex-shrink-0 bg-green-100/80 p-1.5 rounded-full" />
              )}
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  msg.type === "user"
                    ? "bg-green-700 text-white"
                    : "bg-stone-100"
                }`}
              >
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(
                      /\*(.*?)\*/g,
                      "<strong>$1</strong>"
                    ),
                  }}
                />
              </div>
              {msg.type === "user" && (
                <User className="w-8 h-8 text-green-700 flex-shrink-0 bg-stone-200 p-1.5 rounded-full" />
              )}
            </div>
          ))
        )}
        {chatMutation.isPending && (
          <div className="flex items-start gap-3">
            <Bot className="w-8 h-8 text-green-700 flex-shrink-0 bg-green-100/80 p-1.5 rounded-full" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Why are the leaves yellow?"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && handleSend()
            }
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={chatMutation.isPending}
            size="icon"
          >
            {chatMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AiChatbot;
