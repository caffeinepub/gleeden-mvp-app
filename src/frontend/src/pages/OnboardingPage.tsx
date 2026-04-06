import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Check, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import AppHeader from "../components/AppHeader";
import { useAppStore } from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
}

const STEPS = ["Basic Info", "About You", "Photo", "Privacy"];

export default function OnboardingPage({ navigate }: Props) {
  const { dispatch } = useAppStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "female" as "male" | "female" | "non-binary",
    location: "",
    relationshipStatus: "Married",
    bio: "",
    photoUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
  });

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const newProfile = {
        id: `profile-${Date.now()}`,
        principal: "new-user",
        name: form.name || "Anonymous",
        age: Number.parseInt(form.age) || 30,
        gender: form.gender,
        location: form.location || "Unknown",
        relationshipStatus: form.relationshipStatus,
        bio: form.bio || "New member.",
        photoUrl: form.photoUrl,
        privacyBlurPhoto: form.privacyBlurPhoto,
        privacyHideFromDiscover: form.privacyHideFromDiscover,
        isAdmin: false,
        isBanned: false,
        createdAt: Date.now(),
      };
      dispatch({ type: "CREATE_PROFILE", payload: newProfile });
      dispatch({ type: "SET_CURRENT_USER", payload: newProfile.id });
      navigate("discover");
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigate("landing");
  };

  const canProceed = () => {
    if (step === 0)
      return form.name.trim().length > 0 && form.age.trim().length > 0;
    return true;
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="onboarding.page"
    >
      <AppHeader currentPage="landing" navigate={navigate} />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i < step
                      ? "gradient-rose text-foreground"
                      : i === step
                        ? "gradient-wine-rose text-white"
                        : "bg-surface-2 text-muted-foreground border border-white/10"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-12 mx-1 transition-all ${i < step ? "bg-rose" : "bg-white/10"}`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="bg-surface-2 rounded-3xl p-8 border border-white/5 card-shadow"
            >
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Who are you?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your basic details to get started.
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs mb-1.5 block">
                      First Name *
                    </Label>
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your first name"
                      className="bg-surface-3 border-white/10 text-foreground"
                      data-ocid="onboarding.input"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs mb-1.5 block">
                      Age *
                    </Label>
                    <Input
                      type="number"
                      value={form.age}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, age: e.target.value }))
                      }
                      placeholder="Your age"
                      min="18"
                      max="99"
                      className="bg-surface-3 border-white/10 text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs mb-1.5 block">
                      Gender
                    </Label>
                    <div className="flex gap-2">
                      {(["female", "male", "non-binary"] as const).map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setForm((p) => ({ ...p, gender: g }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                            form.gender === g
                              ? "gradient-wine text-foreground border-rose/30"
                              : "bg-surface-3 text-muted-foreground border-white/10 hover:border-white/20"
                          }`}
                          data-ocid="onboarding.radio"
                        >
                          {g === "non-binary"
                            ? "Non-binary"
                            : g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs mb-1.5 block">
                      Location
                    </Label>
                    <Input
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      placeholder="City, Country"
                      className="bg-surface-3 border-white/10 text-foreground"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs mb-1.5 block">
                      Relationship Status
                    </Label>
                    <div className="flex gap-2">
                      {["Married", "Attached", "Committed"].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() =>
                            setForm((p) => ({ ...p, relationshipStatus: s }))
                          }
                          className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                            form.relationshipStatus === s
                              ? "gradient-wine text-foreground border-rose/30"
                              : "bg-surface-3 text-muted-foreground border-white/10 hover:border-white/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Tell your story
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      A compelling bio increases your matches by 3x.
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs mb-1.5 block">
                      Bio
                    </Label>
                    <Textarea
                      value={form.bio}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, bio: e.target.value }))
                      }
                      placeholder="What makes you uniquely you? What are you seeking?"
                      rows={5}
                      className="bg-surface-3 border-white/10 text-foreground resize-none"
                      data-ocid="onboarding.textarea"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {form.bio.length}/300 characters
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Add a photo
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Profiles with photos get 10x more attention.
                    </p>
                  </div>
                  <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-rose/30">
                    <img
                      src={form.photoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <label
                      className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                      data-ocid="onboarding.upload_button"
                    >
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setForm((p) => ({ ...p, photoUrl: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/15 bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                    onClick={handleNext}
                  >
                    Skip for now
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Your privacy
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Choose how visible you want to be.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface-3 rounded-xl border border-white/5">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Blur my photo
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Others see a blurred version
                        </p>
                      </div>
                      <Switch
                        checked={form.privacyBlurPhoto}
                        onCheckedChange={(val) =>
                          setForm((p) => ({ ...p, privacyBlurPhoto: val }))
                        }
                        data-ocid="onboarding.switch"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-surface-3 rounded-xl border border-white/5">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Hide from discovery
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Only matched users can find you
                        </p>
                      </div>
                      <Switch
                        checked={form.privacyHideFromDiscover}
                        onCheckedChange={(val) =>
                          setForm((p) => ({
                            ...p,
                            privacyHideFromDiscover: val,
                          }))
                        }
                        data-ocid="onboarding.toggle"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-white/15 bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
              data-ocid="onboarding.cancel_button"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {step === 0 ? "Back" : "Previous"}
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 gradient-wine-rose text-white border-0 disabled:opacity-50"
              data-ocid="onboarding.submit_button"
            >
              {step === STEPS.length - 1 ? (
                <>
                  <Heart className="w-4 h-4 mr-2 fill-white" />
                  Complete Profile
                </>
              ) : (
                <>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
