"use client";

import { useState, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { customerAuthService } from "@/services/customerAuthService";
import type { AppDispatch } from "@/services/redux";
import { setAuthenticatedUser, type StoreUser } from "@/services/redux/slices/userAuthSlice";

function responseError(message: string | undefined, fallback: string) {
  return message?.trim() || fallback;
}

export function ProfileSettingsForm({ user }: { user: StoreUser }) {
  const dispatch = useDispatch<AppDispatch>();
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [emailOtp, setEmailOtp] = useState("");
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user.phoneNumber) {
      setError("Your verified phone number is unavailable. Please sign in again.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.completeProfile({
        phoneNumber: user.phoneNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });

      if (!response.success) {
        setError(responseError(response.message, "Profile settings could not be saved."));
        return;
      }

      if (response.data?.profileCompleted && response.data.user) {
        dispatch(setAuthenticatedUser(customerAuthService.mapUser(response.data.user)));
        setNotice("Your profile settings have been saved.");
        return;
      }

      if (response.data?.nextStep === "email_otp") {
        setVerifyingEmail(true);
        setNotice(response.message || "Enter the verification code sent to your email.");
        return;
      }

      setError(response.message || "Profile settings could not be saved.");
    } catch (requestError) {
      setError(
        responseError(
          requestError instanceof Error ? requestError.message : undefined,
          "Profile settings could not be saved.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user.phoneNumber) {
      setError("Your verified phone number is unavailable. Please sign in again.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.verifyEmailOtp(
        user.phoneNumber,
        emailOtp.trim(),
      );
      if (!response.success) {
        setError(responseError(response.message, "Email verification failed."));
        return;
      }
      if (!response.data?.profileCompleted || !response.data.user) {
        setError(response.message || "Your profile is still incomplete.");
        return;
      }

      dispatch(setAuthenticatedUser(customerAuthService.mapUser(response.data.user)));
      setVerifyingEmail(false);
      setEmailOtp("");
      setNotice("Your email and profile settings have been updated.");
    } catch (requestError) {
      setError(
        responseError(
          requestError instanceof Error ? requestError.message : undefined,
          "Email verification failed.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  async function resendEmailCode() {
    if (!user.phoneNumber) {
      setError("Your verified phone number is unavailable. Please sign in again.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.resendEmailOtp(user.phoneNumber);
      if (!response.success) {
        setError(responseError(response.message, "Could not resend the email code."));
        return;
      }
      setNotice(response.message || "A new verification code has been sent.");
    } catch (requestError) {
      setError(
        responseError(
          requestError instanceof Error ? requestError.message : undefined,
          "Could not resend the email code.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Profile settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the contact details associated with your account.
      </p>

      {error && (
        <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-5 rounded-lg bg-brand-soft px-4 py-3 text-sm text-foreground" role="status">
          {notice}
        </p>
      )}

      {verifyingEmail ? (
        <form className="mt-6 grid max-w-md gap-4" onSubmit={verifyEmail}>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground">
            Verification code
            <input
              autoComplete="one-time-code"
              inputMode="numeric"
              required
              value={emailOtp}
              onChange={(event) => setEmailOtp(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="button button-brand" disabled={busy}>
              {busy ? "Verifying…" : "Verify email"}
            </button>
            <button
              type="button"
              className="button button-brand-outline"
              disabled={busy}
              onClick={() => void resendEmailCode()}
            >
              Resend code
            </button>
            <button
              type="button"
              className="button button-brand-outline"
              disabled={busy}
              onClick={() => {
                setVerifyingEmail(false);
                setEmailOtp("");
                setNotice("");
              }}
            >
              Back to profile
            </button>
          </div>
        </form>
      ) : (
        <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={saveProfile}>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground">
            First name
            <input
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground">
            Last name
            <input
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground">
            Email address
            <input
              autoComplete="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-foreground">
            Verified phone number
            <input
              autoComplete="tel"
              readOnly
              value={user.phoneNumber ?? ""}
              className="rounded-lg border border-border bg-secondary px-3 py-2.5 font-normal text-muted-foreground outline-none"
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="button button-brand" disabled={busy}>
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
