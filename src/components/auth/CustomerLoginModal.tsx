"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@/components/Icon";
import { customerAuthService } from "@/services/customerAuthService";
import type { AppDispatch, RootState } from "@/services/redux";
import { setAuthOpen } from "@/services/redux/slices/modalSlice";
import { setAuthenticatedUser } from "@/services/redux/slices/userAuthSlice";

type AuthStep = "phone" | "phone-otp" | "profile" | "email-otp";

function normalizePhoneNumber(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const normalized =
    digits.length === 10
      ? `91${digits}`
      : digits.length === 11 && digits.startsWith("0")
        ? `91${digits.slice(1)}`
        : digits;
  return normalized.length >= 10 && normalized.length <= 15
    ? normalized
    : null;
}

export function CustomerLoginModal() {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.authOpen);
  const [step, setStep] = useState<AuthStep>("phone");
  const [emailOtpReturnStep, setEmailOtpReturnStep] =
    useState<AuthStep>("profile");
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) dispatch(setAuthOpen(false));
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [busy, dispatch, isOpen]);

  function closeModal() {
    if (!busy) dispatch(setAuthOpen(false));
  }

  function showResponseError(message: string | undefined, fallback: string) {
    setError(message?.trim() || fallback);
  }

  function finishLogin(response: Awaited<ReturnType<typeof customerAuthService.verifyEmailOtp>>) {
    const user = response.data?.user;
    if (!user) {
      setError("Sign in succeeded, but the account details were missing.");
      return;
    }

    dispatch(setAuthenticatedUser(customerAuthService.mapUser(user)));
    dispatch(setAuthOpen(false));
  }

  async function sendPhoneOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = normalizePhoneNumber(phoneInput);
    if (!normalizedPhone) {
      setError("Enter a valid phone number with country code.");
      return;
    }

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.sendWhatsappOtp(normalizedPhone);
      if (!response.success) {
        showResponseError(response.message, "Could not send the verification code.");
        return;
      }

      setPhoneNumber(normalizedPhone);
      setPhoneInput(normalizedPhone);
      setStep("phone-otp");
      setNotice(response.message || "A verification code has been sent to your WhatsApp.");
    } catch (requestError) {
      showResponseError(
        requestError instanceof Error ? requestError.message : undefined,
        "Could not send the verification code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyPhoneOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.verifyWhatsappOtp(
        phoneNumber,
        phoneOtp.trim(),
      );
      if (!response.success) {
        showResponseError(response.message, "The verification code was not accepted.");
        return;
      }

      if (response.data?.profileCompleted) {
        finishLogin(response);
        return;
      }

      const user = response.data?.user;
      setFirstName(user?.firstName || "");
      setLastName(user?.lastName || "");
      setEmail(user?.email || "");
      setNotice(response.message || "");
      if (response.data?.nextStep === "email_otp") {
        setEmailOtpReturnStep("phone-otp");
        setStep("email-otp");
      } else {
        setStep("profile");
      }
    } catch (requestError) {
      showResponseError(
        requestError instanceof Error ? requestError.message : undefined,
        "Could not verify the code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function completeProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.completeProfile({
        phoneNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
      });
      if (!response.success) {
        showResponseError(response.message, "Could not save your profile.");
        return;
      }

      if (response.data?.profileCompleted) {
        finishLogin(response);
        return;
      }

      setEmailOtpReturnStep("profile");
      setEmailOtp("");
      setStep("email-otp");
      setNotice(response.message || "Enter the code sent to your email.");
    } catch (requestError) {
      showResponseError(
        requestError instanceof Error ? requestError.message : undefined,
        "Could not save your profile. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyEmailOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await customerAuthService.verifyEmailOtp(
        phoneNumber,
        emailOtp.trim(),
      );
      if (!response.success) {
        showResponseError(response.message, "The email verification code was not accepted.");
        return;
      }

      if (response.data?.profileCompleted) {
        finishLogin(response);
        return;
      }

      setNotice(response.message || "Please complete the remaining profile details.");
      setStep("profile");
    } catch (requestError) {
      showResponseError(
        requestError instanceof Error ? requestError.message : undefined,
        "Could not verify the email code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response =
        step === "phone-otp"
          ? await customerAuthService.sendWhatsappOtp(phoneNumber)
          : await customerAuthService.resendEmailOtp(phoneNumber);
      if (!response.success) {
        showResponseError(response.message, "Could not resend the verification code.");
        return;
      }
      setNotice(response.message || "A new verification code has been sent.");
    } catch (requestError) {
      showResponseError(
        requestError instanceof Error ? requestError.message : undefined,
        "Could not resend the verification code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="customer-auth-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <section
        className="customer-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-auth-title"
        aria-describedby="customer-auth-description"
      >
        <button
          className="customer-auth-close"
          type="button"
          aria-label="Close sign in"
          onClick={closeModal}
          disabled={busy}
        >
          <Icon name="close" />
        </button>

        <div className="customer-auth-heading">
          <span className="customer-auth-mark"><Icon name="user" /></span>
          <p>INDIA DÉCOR</p>
          <h2 id="customer-auth-title">
            {step === "profile" ? "Complete your account" : "Welcome back"}
          </h2>
          <p id="customer-auth-description">
            {step === "phone"
              ? "Sign in or create an account with your mobile number."
              : step === "phone-otp"
                ? `Enter the WhatsApp code sent to +${phoneNumber}.`
                : step === "profile"
                  ? "Add your details to finish setting up your account."
                  : `Enter the email verification code sent to ${email}.`}
          </p>
        </div>

        {error && <p className="customer-auth-error" role="alert">{error}</p>}
        {notice && <p className="customer-auth-notice" role="status">{notice}</p>}

        {step === "phone" && (
          <form className="customer-auth-form" onSubmit={sendPhoneOtp}>
            <label>
              Mobile number
              <input
                autoFocus
                autoComplete="tel"
                inputMode="tel"
                type="tel"
                value={phoneInput}
                onChange={(event) => setPhoneInput(event.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </label>
            <button className="customer-auth-submit" type="submit" disabled={busy}>
              {busy ? "Sending code..." : "Continue"}
            </button>
            <small>We’ll send a one-time verification code on WhatsApp.</small>
          </form>
        )}

        {step === "phone-otp" && (
          <form className="customer-auth-form" onSubmit={verifyPhoneOtp}>
            <label>
              WhatsApp verification code
              <input
                autoFocus
                autoComplete="one-time-code"
                inputMode="numeric"
                type="text"
                value={phoneOtp}
                onChange={(event) => setPhoneOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                minLength={6}
                maxLength={6}
                required
              />
            </label>
            <button className="customer-auth-submit" type="submit" disabled={busy}>
              {busy ? "Verifying..." : "Verify mobile number"}
            </button>
            <button className="customer-auth-text-button" type="button" onClick={resendCode} disabled={busy}>
              Resend code
            </button>
            <button
              className="customer-auth-back"
              type="button"
              onClick={() => {
                setError("");
                setNotice("");
                setStep("phone");
              }}
              disabled={busy}
            >
              Change mobile number
            </button>
          </form>
        )}

        {step === "profile" && (
          <form className="customer-auth-form" onSubmit={completeProfile}>
            <label>
              First name
              <input
                autoFocus
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                maxLength={25}
                required
              />
            </label>
            <label>
              Last name
              <input
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                maxLength={25}
                required
              />
            </label>
            <label>
              Email address
              <input
                autoComplete="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={50}
                required
              />
            </label>
            <button className="customer-auth-submit" type="submit" disabled={busy}>
              {busy ? "Saving..." : "Continue"}
            </button>
          </form>
        )}

        {step === "email-otp" && (
          <form className="customer-auth-form" onSubmit={verifyEmailOtp}>
            <label>
              Email verification code
              <input
                autoFocus
                autoComplete="one-time-code"
                inputMode="numeric"
                type="text"
                value={emailOtp}
                onChange={(event) => setEmailOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                minLength={6}
                maxLength={6}
                required
              />
            </label>
            <button className="customer-auth-submit" type="submit" disabled={busy}>
              {busy ? "Verifying..." : "Verify email"}
            </button>
            <button className="customer-auth-text-button" type="button" onClick={resendCode} disabled={busy}>
              Resend code
            </button>
            <button
              className="customer-auth-back"
              type="button"
              onClick={() => {
                setError("");
                setNotice("");
                setStep(emailOtpReturnStep);
              }}
              disabled={busy}
            >
              Back
            </button>
          </form>
        )}
      </section>
    </div>,
    document.body,
  );
}
