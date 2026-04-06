import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Heart, Lock, MessageCircle, Shield } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAppStore } from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
}

const HERO_PROFILES = [
  {
    name: "Sophie",
    age: 35,
    location: "Berlin",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  },
  {
    name: "Marc",
    age: 44,
    location: "London",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Elena",
    age: 36,
    location: "Rome",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

const FEATURES = [
  {
    icon: Lock,
    title: "Complete Discretion",
    desc: "Your privacy is paramount. Blur your photo, hide your profile — total control over your visibility.",
  },
  {
    icon: Heart,
    title: "Mutual Matches Only",
    desc: "Messages only unlock when both hearts align. No unwanted contact, ever.",
  },
  {
    icon: MessageCircle,
    title: "Private Messaging",
    desc: "Encrypted conversations accessible only between matched members.",
  },
  {
    icon: Shield,
    title: "Safe Community",
    desc: "Active moderation and reporting tools keep our community respectful and secure.",
  },
];

export default function LandingPage({ navigate }: Props) {
  const { login, isLoggingIn } = useInternetIdentity();
  const { dispatch } = useAppStore();

  const handleDemoMode = () => {
    dispatch({ type: "SET_CURRENT_USER", payload: "profile-isabelle" });
    navigate("discover");
  };

  const handleJoin = () => {
    login();
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Top nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-wine-rose flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display text-2xl text-rose font-semibold tracking-wide">
              Discreet
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Safety"].map((item) => (
              <button
                type="button"
                key={item}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleJoin}
              disabled={isLoggingIn}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="gradient-wine-rose text-white border-0 hover:opacity-90 transition-opacity"
              onClick={handleDemoMode}
              data-ocid="landing.primary_button"
            >
              Join Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, oklch(0.32 0.12 15 / 0.12) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wine/20 border border-rose/20 text-rose text-xs font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
                Discreet connections for attached adults
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Where discretion
                <span className="block font-display italic text-rose">
                  meets desire.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg">
                A private space for married and attached individuals to seek
                meaningful connections beyond their current relationship — with
                full control over your privacy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="gradient-wine-rose text-white border-0 hover:opacity-90 transition-opacity text-base px-8 h-12"
                  onClick={handleDemoMode}
                  data-ocid="landing.primary_button"
                >
                  <Heart className="w-4 h-4 mr-2 fill-white" />
                  Start Exploring
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/15 bg-transparent text-foreground hover:bg-white/5 text-base px-8 h-12"
                  onClick={handleJoin}
                  disabled={isLoggingIn}
                  data-ocid="landing.secondary_button"
                >
                  {isLoggingIn ? "Connecting..." : "Login with Identity"}
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Demo mode — explore without an account
              </p>
            </motion.div>

            {/* Right: Profile cards mosaic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block h-[520px]"
            >
              {HERO_PROFILES.map((profile, i) => (
                <div
                  key={profile.name}
                  className="absolute rounded-2xl overflow-hidden card-shadow"
                  style={{
                    width: i === 1 ? "200px" : "180px",
                    height: i === 1 ? "280px" : "240px",
                    top: i === 0 ? "30px" : i === 1 ? "100px" : "200px",
                    left: i === 0 ? "20px" : i === 1 ? "160px" : "320px",
                    zIndex: i === 1 ? 3 : 2,
                    border:
                      i === 1
                        ? "1px solid oklch(0.75 0.08 15 / 0.5)"
                        : "1px solid oklch(1 0 0 / 0.08)",
                  }}
                >
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    style={
                      i === 2
                        ? { filter: "blur(8px)", transform: "scale(1.1)" }
                        : {}
                    }
                  />
                  <div className="absolute inset-0 gradient-card-overlay" />
                  <div className="absolute bottom-3 left-3">
                    <p className="font-semibold text-sm text-white">
                      {profile.name}, {profile.age}
                    </p>
                    <p className="text-xs text-white/70">{profile.location}</p>
                  </div>
                  {i === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-2">
                        <EyeOff className="w-4 h-4 text-white/80" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Designed for privacy, built for connection
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every feature crafted with your discretion in mind.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-surface-2 rounded-2xl p-6 border border-white/5 card-shadow"
              >
                <div className="w-10 h-10 rounded-xl gradient-wine flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-rose" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "2M+", label: "Members worldwide" },
              { value: "98%", label: "Privacy satisfaction" },
              { value: "150+", label: "Countries" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-4xl font-bold text-rose mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to rediscover
              <span className="font-display italic text-rose"> yourself?</span>
            </h2>
            <Button
              size="lg"
              className="gradient-wine-rose text-white border-0 hover:opacity-90 transition-opacity text-base px-12 h-14"
              onClick={handleDemoMode}
              data-ocid="landing.cta_button"
            >
              Begin Your Journey
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose fill-rose" />
            <span className="font-display text-rose">Discreet</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            {["About", "Safety", "Privacy", "Terms", "Contact"].map((item) => (
              <button
                type="button"
                key={item}
                className="hover:text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
