import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";
import {
  getMatchMessages,
  getMatchPartner,
  getMatches,
  useAppStore,
} from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
  selectedMatchId: string | null;
}

export default function MessagesPage({ navigate, selectedMatchId }: Props) {
  const { state, dispatch } = useAppStore();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const [activeMatchId, setActiveMatchId] = useState<string | null>(
    selectedMatchId,
  );
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const matches = getMatches(state, currentUserId);

  useEffect(() => {
    if (selectedMatchId) setActiveMatchId(selectedMatchId);
  }, [selectedMatchId]);

  useEffect(() => {
    if (activeMatchId) {
      dispatch({
        type: "MARK_MESSAGES_READ",
        payload: { matchId: activeMatchId },
      });
    }
  }, [activeMatchId, dispatch]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is a stable ref
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  const activeMatch =
    matches.find((m) => m.id === activeMatchId) || matches[0] || null;
  const activePartner = activeMatch
    ? getMatchPartner(state, activeMatch, currentUserId)
    : null;
  const messages = activeMatch ? getMatchMessages(state, activeMatch.id) : [];

  const handleSend = () => {
    if (!messageText.trim() || !activeMatch) return;
    const msg = {
      id: `msg-${Date.now()}`,
      matchId: activeMatch.id,
      senderId: currentUserId,
      content: messageText.trim(),
      timestamp: Date.now(),
      read: false,
    };
    dispatch({ type: "SEND_MESSAGE", payload: msg });
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="messages.page"
    >
      <AppHeader currentPage="messages" navigate={navigate} />

      <main
        className="flex-1 max-w-5xl mx-auto w-full px-4 pt-4 pb-24 flex gap-4"
        style={{ height: "calc(100vh - 80px)" }}
      >
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 hidden md:flex flex-col">
          <h2 className="text-lg font-semibold text-foreground mb-4 px-1">
            Conversations
          </h2>
          <div className="flex flex-col gap-2">
            {matches.length === 0 ? (
              <div
                className="text-center py-8 text-muted-foreground text-sm"
                data-ocid="messages.empty_state"
              >
                No matches yet. Start discovering!
              </div>
            ) : (
              matches.map((match, i) => {
                const partner = getMatchPartner(state, match, currentUserId);
                if (!partner) return null;
                const unread = state.messages.filter(
                  (m) =>
                    m.matchId === match.id &&
                    m.senderId !== currentUserId &&
                    !m.read,
                ).length;
                const lastMsg = state.messages
                  .filter((m) => m.matchId === match.id)
                  .sort((a, b) => b.timestamp - a.timestamp)[0];

                return (
                  <button
                    type="button"
                    key={match.id}
                    onClick={() => setActiveMatchId(match.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      activeMatchId === match.id
                        ? "bg-wine/20 border border-rose/30"
                        : "hover:bg-surface-2 border border-transparent"
                    }`}
                    data-ocid={`messages.item.${i + 1}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={partner.photoUrl}
                          alt={partner.name}
                          className={`w-full h-full object-cover ${
                            partner.privacyBlurPhoto ? "blur-photo" : ""
                          }`}
                        />
                      </div>
                      {unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-rose text-white text-xs flex items-center justify-center font-bold">
                          {unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {partner.name}
                      </p>
                      {lastMsg && (
                        <p className="text-xs text-muted-foreground truncate">
                          {lastMsg.senderId === currentUserId ? "You: " : ""}
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-surface-2 rounded-2xl border border-white/5 overflow-hidden">
          {activeMatch && activePartner ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => navigate("matches")}
                  className="md:hidden text-muted-foreground hover:text-foreground p-1"
                  data-ocid="messages.close_button"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={activePartner.photoUrl}
                    alt={activePartner.name}
                    className={`w-full h-full object-cover ${
                      activePartner.privacyBlurPhoto ? "blur-photo" : ""
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {activePartner.name}, {activePartner.age}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activePartner.location}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isMe = msg.senderId === currentUserId;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          {!isMe && (
                            <Avatar className="w-7 h-7 mr-2 flex-shrink-0 self-end">
                              <AvatarFallback className="bg-wine text-foreground text-xs">
                                {activePartner.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                              isMe
                                ? "gradient-wine-rose text-white rounded-br-sm"
                                : "bg-surface-3 text-foreground rounded-bl-sm"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMe ? "text-white/60" : "text-muted-foreground"
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 flex-shrink-0">
                <Input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activePartner.name}...`}
                  className="flex-1 bg-surface-3 border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-rose/50"
                  data-ocid="messages.input"
                />
                <Button
                  type="button"
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  size="icon"
                  className="gradient-wine-rose text-white border-0 disabled:opacity-50 h-10 w-10"
                  data-ocid="messages.submit_button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <div className="w-16 h-16 rounded-full gradient-wine mx-auto flex items-center justify-center mb-4">
                  <Send className="w-6 h-6 text-rose" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Select a conversation
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose a match to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav currentPage="messages" navigate={navigate} />
    </div>
  );
}
