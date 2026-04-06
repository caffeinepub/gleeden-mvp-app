import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";
import FilterSidebar from "../components/FilterSidebar";
import ProfileCard from "../components/ProfileCard";
import { getDiscoverQueue, getProfile, useAppStore } from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
}

export default function DiscoverPage({ navigate }: Props) {
  const { state, dispatch } = useAppStore();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const [cardIndex, setCardIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

  const queue = getDiscoverQueue(state, currentUserId);
  const visibleProfiles = queue.slice(cardIndex);
  const currentProfile = visibleProfiles[0] ?? null;
  const previewProfiles = visibleProfiles.slice(1, 3);

  const handleLike = (targetId: string) => {
    if (isAnimating) return;
    setAnimDir("right");
    setIsAnimating(true);

    dispatch({
      type: "LIKE_PROFILE",
      payload: { likerId: currentUserId, targetId },
    });

    const theirLikes = state.likes[targetId] || [];
    const isMatch = theirLikes.includes(currentUserId);

    if (isMatch) {
      const matchedProfile = getProfile(state, targetId);
      const match = {
        id: `match-${Date.now()}`,
        user1Id: currentUserId,
        user2Id: targetId,
        createdAt: Date.now(),
      };
      dispatch({ type: "ADD_MATCH", payload: match });
      toast.success(
        `✨ It's a Match! You and ${matchedProfile?.name} like each other!`,
        {
          duration: 5000,
          description: "Go to Matches to start chatting",
        },
      );
    } else {
      dispatch({ type: "SET_DISCOVER_INDEX", payload: state.discoverIndex });
      setTimeout(() => {
        setCardIndex((prev) => prev + 1);
        setIsAnimating(false);
        setAnimDir(null);
      }, 350);
      return;
    }

    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
      setIsAnimating(false);
      setAnimDir(null);
    }, 350);
  };

  const handlePass = (targetId: string) => {
    if (isAnimating) return;
    setAnimDir("left");
    setIsAnimating(true);
    dispatch({
      type: "PASS_PROFILE",
      payload: { userId: currentUserId, targetId },
    });
    setTimeout(() => {
      setCardIndex((prev) => prev + 1);
      setIsAnimating(false);
      setAnimDir(null);
    }, 350);
  };

  const handlePrev = () => {
    if (cardIndex > 0) setCardIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentProfile) {
      handlePass(currentProfile.id);
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="discover.page"
    >
      <AppHeader currentPage="discover" navigate={navigate} />

      {/* Hero title */}
      <div className="text-center pt-8 pb-6 px-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
          Discover New Connections
        </h1>
        <p className="text-muted-foreground text-base">
          Discreet dating app for discreet members
        </p>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 pb-32">
        <div className="flex gap-4 items-start justify-center">
          {/* Filter sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Left arrow */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={cardIndex === 0}
            className="hidden lg:flex items-center justify-center w-10 h-10 mt-24 rounded-full bg-surface-2 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            data-ocid="discover.pagination_prev"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards area */}
          <div className="flex-1 max-w-md flex flex-col items-center">
            {currentProfile ? (
              <div className="relative w-full" style={{ height: "520px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProfile.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x:
                        animDir === "right"
                          ? 120
                          : animDir === "left"
                            ? -120
                            : 0,
                      scale: 0.9,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <ProfileCard
                      profile={currentProfile}
                      onLike={handleLike}
                      onPass={handlePass}
                      featured
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center h-[520px] bg-surface-2 rounded-3xl border border-white/5 card-shadow text-center p-8"
                data-ocid="discover.empty_state"
              >
                <div className="w-16 h-16 rounded-full gradient-wine flex items-center justify-center mb-4">
                  <span className="text-2xl">💫</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  You've seen everyone!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Come back later as new members join, or adjust your filters.
                </p>
              </div>
            )}
          </div>

          {/* Preview cards (right) */}
          <div className="hidden lg:flex flex-col gap-3 w-44 flex-shrink-0 mt-4">
            {previewProfiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative h-52 rounded-2xl overflow-hidden cursor-pointer border border-white/8"
                style={{ opacity: 1 - i * 0.15 }}
              >
                <img
                  src={profile.photoUrl}
                  alt="Preview"
                  className="w-full h-full object-cover blur-photo"
                />
                <div className="absolute inset-0 gradient-card-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs text-white/80">
                      +{queue.length - cardIndex - 1} more
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!currentProfile}
            className="hidden lg:flex items-center justify-center w-10 h-10 mt-24 rounded-full bg-surface-2 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-surface-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            data-ocid="discover.pagination_next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mt-6">
          <FilterSidebar />
        </div>
      </main>

      <BottomNav currentPage="discover" navigate={navigate} />
    </div>
  );
}
