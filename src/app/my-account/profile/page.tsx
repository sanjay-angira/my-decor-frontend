"use client";

import { ProfileSettingsForm } from "@/components/account/ProfileSettingsForm";
import { useSelector } from "react-redux";
import type { RootState } from "@/services/redux";

export default function ProfileSettingsPage() {
  const user = useSelector((state: RootState) => state.userAuth.user);
  if (!user) return null;

  return <ProfileSettingsForm key={user.id} user={user} />;
}
