import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Eye, EyeOff, LogOut, Save, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getProfile, useAppStore } from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
}

export default function ProfilePage({ navigate }: Props) {
  const { state, dispatch } = useAppStore();
  const { clear } = useInternetIdentity();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const profile = getProfile(state, currentUserId);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || "",
    age: profile?.age?.toString() || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    relationshipStatus: profile?.relationshipStatus || "",
    privacyBlurPhoto: profile?.privacyBlurPhoto || false,
    privacyHideFromDiscover: profile?.privacyHideFromDiscover || false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  const handleSave = () => {
    dispatch({
      type: "UPDATE_PROFILE",
      payload: {
        id: currentUserId,
        name: form.name,
        age: Number.parseInt(form.age) || profile.age,
        location: form.location,
        bio: form.bio,
        relationshipStatus: form.relationshipStatus,
        privacyBlurPhoto: form.privacyBlurPhoto,
        privacyHideFromDiscover: form.privacyHideFromDiscover,
      },
    });
    setEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleLogout = () => {
    dispatch({ type: "SET_CURRENT_USER", payload: null });
    clear();
    navigate("landing");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      dispatch({
        type: "UPDATE_PROFILE",
        payload: { id: currentUserId, photoUrl: url },
      });
      toast.success("Photo updated!");
    }
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="profile.page"
    >
      <AppHeader currentPage="profile" navigate={navigate} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile header */}
          <div className="bg-surface-2 rounded-3xl p-6 border border-white/5 card-shadow relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.75 0.08 15) 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />
            <div className="flex items-start gap-6 relative">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-rose/30">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className={`w-full h-full object-cover ${
                      profile.privacyBlurPhoto ? "blur-photo" : ""
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full gradient-wine flex items-center justify-center border-2 border-background hover:opacity-90 transition-opacity"
                  data-ocid="profile.upload_button"
                >
                  <Camera className="w-3.5 h-3.5 text-rose" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {profile.name}, {profile.age}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {profile.location}
                </p>
                <p className="text-muted-foreground text-sm">
                  {profile.relationshipStatus}
                </p>
                {profile.isAdmin && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-wine/30 text-rose text-xs">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-white/15 bg-transparent hover:bg-white/5 text-foreground"
                onClick={() => setEditing(!editing)}
                data-ocid="profile.edit_button"
              >
                {editing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </div>

          {/* Edit form */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-2 rounded-3xl p-6 border border-rose/20 card-shadow space-y-4"
              data-ocid="profile.panel"
            >
              <h2 className="font-semibold text-foreground">Edit Profile</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs mb-1">
                    Name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="bg-surface-3 border-white/10 text-foreground"
                    data-ocid="profile.input"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1">
                    Age
                  </Label>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, age: e.target.value }))
                    }
                    className="bg-surface-3 border-white/10 text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1">
                    Location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, location: e.target.value }))
                    }
                    className="bg-surface-3 border-white/10 text-foreground"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs mb-1">
                    Relationship Status
                  </Label>
                  <Input
                    value={form.relationshipStatus}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        relationshipStatus: e.target.value,
                      }))
                    }
                    className="bg-surface-3 border-white/10 text-foreground"
                  />
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs mb-1">
                  Bio
                </Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={3}
                  className="bg-surface-3 border-white/10 text-foreground resize-none"
                  data-ocid="profile.textarea"
                />
              </div>
              <Button
                type="button"
                onClick={handleSave}
                className="gradient-wine-rose text-white border-0 w-full"
                data-ocid="profile.save_button"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          )}

          {/* Bio display */}
          {!editing && (
            <div className="bg-surface-2 rounded-3xl p-6 border border-white/5 card-shadow">
              <h2 className="font-semibold text-foreground mb-3">About me</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Privacy settings */}
          <div className="bg-surface-2 rounded-3xl p-6 border border-white/5 card-shadow space-y-4">
            <h2 className="font-semibold text-foreground">Privacy Settings</h2>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                {form.privacyBlurPhoto ? (
                  <EyeOff className="w-5 h-5 text-rose mt-0.5" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground mt-0.5" />
                )}
                <div>
                  <Label className="text-foreground text-sm font-medium">
                    Blur my photo
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your photo will appear blurred to other members
                  </p>
                </div>
              </div>
              <Switch
                checked={form.privacyBlurPhoto}
                onCheckedChange={(val) => {
                  setForm((p) => ({ ...p, privacyBlurPhoto: val }));
                  dispatch({
                    type: "UPDATE_PROFILE",
                    payload: { id: currentUserId, privacyBlurPhoto: val },
                  });
                  toast.success(val ? "Photo blurred" : "Photo visible");
                }}
                data-ocid="profile.switch"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-foreground text-sm font-medium">
                    Hide from discovery
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your profile won't appear in Discover
                  </p>
                </div>
              </div>
              <Switch
                checked={form.privacyHideFromDiscover}
                onCheckedChange={(val) => {
                  setForm((p) => ({ ...p, privacyHideFromDiscover: val }));
                  dispatch({
                    type: "UPDATE_PROFILE",
                    payload: {
                      id: currentUserId,
                      privacyHideFromDiscover: val,
                    },
                  });
                  toast.success(
                    val ? "Hidden from discovery" : "Visible in discovery",
                  );
                }}
                data-ocid="profile.toggle"
              />
            </div>
          </div>

          {/* Admin panel access */}
          {profile.isAdmin && (
            <Button
              type="button"
              onClick={() => navigate("admin")}
              variant="outline"
              className="w-full border-rose/30 text-rose hover:bg-rose/10"
              data-ocid="profile.secondary_button"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          )}

          {/* Logout */}
          <Button
            type="button"
            onClick={handleLogout}
            variant="outline"
            className="w-full border-white/15 bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
            data-ocid="profile.delete_button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </main>

      <BottomNav currentPage="profile" navigate={navigate} />
    </div>
  );
}
