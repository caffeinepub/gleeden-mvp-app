import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";
import { getMatchPartner, getMatches, useAppStore } from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
  onSelectMatch: (matchId: string) => void;
}

export default function MatchesPage({ navigate, onSelectMatch }: Props) {
  const { state } = useAppStore();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const matches = getMatches(state, currentUserId);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="matches.page"
    >
      <AppHeader currentPage="matches" navigate={navigate} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Your Matches
            </h1>
            <p className="text-muted-foreground">
              {matches.length > 0
                ? `${matches.length} mutual connection${matches.length !== 1 ? "s" : ""}`
                : "No matches yet — keep discovering!"}
            </p>
          </div>

          {matches.length === 0 ? (
            <div className="text-center py-20" data-ocid="matches.empty_state">
              <div className="w-20 h-20 rounded-full gradient-wine mx-auto flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-rose" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No matches yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Start liking profiles to find your mutual connections.
              </p>
              <Button
                onClick={() => navigate("discover")}
                className="gradient-wine-rose text-white border-0"
                data-ocid="matches.primary_button"
              >
                Discover Profiles
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {matches.map((match, i) => {
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
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-surface-2 rounded-2xl p-4 border border-white/5 card-shadow flex items-center gap-4 cursor-pointer hover:border-rose/30 transition-all"
                    onClick={() => onSelectMatch(match.id)}
                    data-ocid={`matches.item.${i + 1}`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-16 h-16 rounded-full overflow-hidden border-2"
                        style={{
                          borderColor:
                            unread > 0
                              ? "oklch(0.75 0.08 15)"
                              : "oklch(1 0 0 / 0.1)",
                        }}
                      >
                        <img
                          src={
                            partner.privacyBlurPhoto
                              ? undefined
                              : partner.photoUrl
                          }
                          alt={partner.name}
                          className={`w-full h-full object-cover ${partner.privacyBlurPhoto ? "blur-photo" : ""}`}
                        />
                        {partner.privacyBlurPhoto && (
                          <div className="absolute inset-0 flex items-center justify-center bg-surface-3">
                            <Avatar className="w-16 h-16">
                              <AvatarFallback className="bg-wine text-foreground text-lg">
                                {partner.name[0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                      </div>
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-rose text-white text-xs flex items-center justify-center font-bold">
                          {unread}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">
                          {partner.name}, {partner.age}
                        </h3>
                        {lastMsg && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(lastMsg.timestamp).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {partner.location}
                      </p>
                      {lastMsg && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {lastMsg.senderId === currentUserId ? "You: " : ""}
                          {lastMsg.content}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-shrink-0 text-rose hover:bg-rose/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMatch(match.id);
                      }}
                      data-ocid={`matches.secondary_button.${i + 1}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav currentPage="matches" navigate={navigate} />
    </div>
  );
}
