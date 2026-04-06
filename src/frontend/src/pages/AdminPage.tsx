import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Flag,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import AppHeader from "../components/AppHeader";
import BottomNav from "../components/BottomNav";
import { getProfile, useAppStore } from "../store/appStore";

interface Props {
  navigate: (page: Page) => void;
}

export default function AdminPage({ navigate }: Props) {
  const { state, dispatch } = useAppStore();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const currentProfile = getProfile(state, currentUserId);

  if (!currentProfile?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            You don't have admin privileges.
          </p>
          <Button
            onClick={() => navigate("discover")}
            className="gradient-wine-rose text-white border-0"
          >
            Go to Discover
          </Button>
        </div>
      </div>
    );
  }

  const handleBanUser = (userId: string, ban: boolean) => {
    dispatch({ type: "BAN_USER", payload: { userId, banned: ban } });
    toast.success(ban ? "User banned" : "User unbanned");
  };

  const handleResolveReport = (reportId: string) => {
    dispatch({ type: "RESOLVE_REPORT", payload: reportId });
    toast.success("Report resolved");
  };

  const regularProfiles = state.profiles.filter((p) => !p.isAdmin);
  const pendingReports = state.reports.filter((r) => !r.resolved);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="admin.page"
    >
      <AppHeader currentPage="admin" navigate={navigate} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-wine flex items-center justify-center">
              <Shield className="w-5 h-5 text-rose" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage users and content
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Total Users",
                value: regularProfiles.length,
                icon: Users,
              },
              {
                label: "Pending Reports",
                value: pendingReports.length,
                icon: Flag,
              },
              {
                label: "Banned Users",
                value: regularProfiles.filter((p) => p.isBanned).length,
                icon: Ban,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-2 rounded-2xl p-4 border border-white/5 card-shadow"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-5 h-5 text-rose" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="users" data-ocid="admin.tab">
            <TabsList className="bg-surface-2 border border-white/5 mb-6">
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-wine data-[state=active]:text-foreground"
                data-ocid="admin.tab"
              >
                <Users className="w-4 h-4 mr-2" />
                Users ({regularProfiles.length})
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-wine data-[state=active]:text-foreground"
                data-ocid="admin.tab"
              >
                <Flag className="w-4 h-4 mr-2" />
                Reports ({pendingReports.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <div className="space-y-3" data-ocid="admin.table">
                {regularProfiles.map((profile, i) => (
                  <div
                    key={profile.id}
                    className="bg-surface-2 rounded-2xl p-4 border border-white/5 card-shadow flex items-center gap-4"
                    data-ocid={`admin.item.${i + 1}`}
                  >
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={profile.photoUrl} />
                      <AvatarFallback className="bg-wine text-foreground">
                        {profile.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">
                          {profile.name}, {profile.age}
                        </p>
                        {profile.isBanned && (
                          <Badge variant="destructive" className="text-xs">
                            Banned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {profile.location} · {profile.gender} ·{" "}
                        {profile.relationshipStatus}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Joined{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant={profile.isBanned ? "outline" : "destructive"}
                      className={
                        profile.isBanned
                          ? "border-rose/30 text-rose hover:bg-rose/10"
                          : "bg-destructive/20 text-destructive hover:bg-destructive/30 border-destructive/30"
                      }
                      onClick={() =>
                        handleBanUser(profile.id, !profile.isBanned)
                      }
                      data-ocid={`admin.delete_button.${i + 1}`}
                    >
                      {profile.isBanned ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Unban
                        </>
                      ) : (
                        <>
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          Ban
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="space-y-3" data-ocid="admin.list">
                {state.reports.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin.empty_state"
                  >
                    No reports filed.
                  </div>
                ) : (
                  state.reports.map((report, i) => {
                    const reporter = getProfile(state, report.reporterId);
                    const target = getProfile(state, report.targetId);
                    return (
                      <div
                        key={report.id}
                        className={`bg-surface-2 rounded-2xl p-4 border card-shadow ${
                          report.resolved
                            ? "border-white/5 opacity-60"
                            : "border-orange-500/20"
                        }`}
                        data-ocid={`admin.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle
                              className={`w-5 h-5 mt-0.5 ${report.resolved ? "text-muted-foreground" : "text-orange-400"}`}
                            />
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {report.reason}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-foreground">
                                  {reporter?.name}
                                </span>{" "}
                                reported{" "}
                                <span className="text-foreground">
                                  {target?.name}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  report.createdAt,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {!report.resolved ? (
                            <Button
                              size="sm"
                              className="gradient-rose text-foreground border-0 flex-shrink-0"
                              onClick={() => handleResolveReport(report.id)}
                              data-ocid={`admin.confirm_button.${i + 1}`}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Resolve
                            </Button>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-400 border-0 flex-shrink-0">
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BottomNav currentPage="admin" navigate={navigate} />
    </div>
  );
}
