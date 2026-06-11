"use client";

import { useEffect, useState } from "react";
import {
  login,
  register,
  requestPasswordOtp,
  resetPasswordWithOtp,
  sendTwoFactorCode,
  verifyPasswordOtp,
  verifyTwoFactorCode,
  type AuthSuccess,
  type TwoFactorChallenge,
  type TwoFactorMethod,
} from "@/lib/auth-api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (auth: AuthSuccess) => void;
  initialMode?: "login" | "signup";
}

type AuthMode = "login" | "signup" | "forgot" | "two-factor";
type ForgotStep = "email" | "otp" | "password" | "success";

const authInputClass =
  "appearance-none bg-surface-container-high bg-clip-padding border-0 ring-1 ring-inset ring-surface-variant rounded-lg p-3 text-body-md focus:outline-none focus:ring-primary transition-colors text-on-surface-variant [-webkit-text-fill-color:var(--color-on-surface-variant)] autofill:bg-clip-padding autofill:shadow-[0_0_0_1000px_var(--color-surface-container-high)_inset] autofill:[-webkit-text-fill-color:var(--color-on-surface-variant)]";

const methodLabels: Record<string, string> = {
  TOTP: "Authenticator app",
  EMAIL_OTP: "Email code",
  SMS_OTP: "SMS code",
};

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [twoFactor, setTwoFactor] = useState<TwoFactorChallenge | null>(null);
  const [twoFactorType, setTwoFactorType] = useState<TwoFactorMethod>("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const complete = (auth: AuthSuccess) => {
    onSuccess?.(auth);
    onClose();
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setForgotStep("email");
    setOtp("");
    setConfirmPassword("");
    setTwoFactor(null);
    setTwoFactorType("");
    setStatus("");
    setError("");
  };

  const handleError = (caught: unknown) => {
    setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        if (!acceptTerms) throw new Error("Please accept the Terms of Use and Privacy Policy.");
        complete(await register({ username, email, password, acceptTerms }));
        return;
      }

      if (mode === "login") {
        const result = await login({ email, password });
        if ("kind" in result) {
          const firstMethod = result.methods[0] ?? "";
          setTwoFactor(result);
          setTwoFactorType(firstMethod);
          setMode("two-factor");
          setStatus(firstMethod ? "Choose a method, then enter your verification code." : "");
          return;
        }
        complete(result);
        return;
      }

      if (mode === "two-factor" && twoFactor) {
        complete(
          await verifyTwoFactorCode({
            challengeId: twoFactor.challengeId,
            type: twoFactorType,
            code: otp,
          }),
        );
        return;
      }

      if (mode === "forgot") {
        if (forgotStep === "email") {
          await requestPasswordOtp(email);
          setForgotStep("otp");
          setStatus(`We sent a verification code to ${email}.`);
          return;
        }
        if (forgotStep === "otp") {
          await verifyPasswordOtp({ email, code: otp });
          setForgotStep("password");
          return;
        }
        if (forgotStep === "password") {
          if (password !== confirmPassword) throw new Error("Passwords do not match.");
          await resetPasswordWithOtp({ email, code: otp, password });
          setForgotStep("success");
        }
      }
    } catch (caught) {
      handleError(caught);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendTwoFactorCode = async () => {
    if (!twoFactor || !twoFactorType) return;
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      await sendTwoFactorCode({ challengeId: twoFactor.challengeId, type: twoFactorType });
      setStatus("Verification code sent.");
    } catch (caught) {
      handleError(caught);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendPasswordOtp = async () => {
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      await requestPasswordOtp(email);
      setStatus("A new verification code has been sent.");
    } catch (caught) {
      handleError(caught);
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    mode === "login"
      ? "Sign In"
      : mode === "signup"
        ? "Join Gamelog"
        : mode === "two-factor"
          ? "Two-Factor Check"
          : forgotStep === "email"
            ? "Reset Password"
            : forgotStep === "otp"
              ? "Verify OTP"
              : forgotStep === "password"
                ? "New Password"
                : "Success!";

  const description =
    mode === "login"
      ? "Welcome back to the community."
      : mode === "signup"
        ? "Create an email and password account."
        : mode === "two-factor"
          ? "Enter the code from one of your enabled methods."
          : forgotStep === "email"
            ? "Enter your email to receive a verification code."
            : forgotStep === "otp"
              ? `We've sent a 6-digit code to ${email || "your email"}.`
              : forgotStep === "password"
                ? "Choose a strong password for your account."
                : "Your password has been reset successfully.";

  const submitLabel =
    mode === "login"
      ? "Sign In"
      : mode === "signup"
        ? "Create Account"
        : mode === "two-factor"
          ? "Verify Code"
          : forgotStep === "email"
            ? "Send OTP"
            : forgotStep === "otp"
              ? "Verify Code"
              : forgotStep === "password"
                ? "Reset Password"
                : "Back to Sign In";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-[440px] max-h-[calc(100vh-2rem)] overflow-y-auto bg-surface-container border border-surface-variant rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-white transition-colors"
          aria-label="Close authentication dialog"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="font-display text-headline-md text-white font-bold tracking-tight">{title}</h2>
            <p className="text-body-md text-on-surface-variant mt-1">{description}</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Username</label>
                <input
                  type="text"
                  className={authInputClass}
                  placeholder="Choose a username"
                  value={username}
                  minLength={3}
                  maxLength={32}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            {(mode === "login" || mode === "signup" || (mode === "forgot" && forgotStep === "email")) && (
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Email Address</label>
                <input
                  type="email"
                  className={authInputClass}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {(mode === "two-factor" || (mode === "forgot" && forgotStep === "otp")) && (
              <div className="flex flex-col gap-2">
                {mode === "two-factor" && twoFactor && (
                  <div className="flex flex-col gap-2">
                    <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Method</label>
                    <select
                      className={authInputClass}
                      value={twoFactorType}
                      onChange={(e) => setTwoFactorType(e.target.value)}
                      required
                    >
                      {twoFactor.methods.map((method) => (
                        <option key={method} value={method}>
                          {methodLabels[method] ?? method}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleSendTwoFactorCode}
                      disabled={isSubmitting || twoFactorType === "TOTP"}
                      className="text-label-sm text-primary hover:underline text-left disabled:cursor-not-allowed disabled:text-on-surface-variant"
                    >
                      {twoFactorType === "TOTP" ? "Use your authenticator app code." : "Send code"}
                    </button>
                  </div>
                )}

                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={authInputClass}
                  placeholder="000000"
                  maxLength={8}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {mode === "forgot" && (
                  <button
                    type="button"
                    onClick={handleResendPasswordOtp}
                    disabled={isSubmitting}
                    className="text-label-sm text-primary hover:underline text-left mt-1 disabled:cursor-not-allowed disabled:text-on-surface-variant"
                  >
                    Resend code?
                  </button>
                )}
              </div>
            )}

            {(mode === "login" || mode === "signup" || (mode === "forgot" && forgotStep === "password")) && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">
                    {mode === "forgot" ? "New Password" : "Password"}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-label-sm text-primary hover:underline transition-all"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className={authInputClass}
                  placeholder="Password"
                  value={password}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {mode === "forgot" && forgotStep === "password" && (
              <div className="flex flex-col gap-2">
                <label className="text-label-md font-bold tracking-widest uppercase text-on-surface-variant">Confirm Password</label>
                <input
                  type="password"
                  className={authInputClass}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  minLength={8}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {mode === "forgot" && forgotStep === "success" && (
              <div className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-6 text-center">
                <span className="material-symbols-outlined text-primary text-5xl mb-2">check_circle</span>
                <p className="text-body-md text-on-surface">You can now sign in with your new password.</p>
              </div>
            )}

            {mode === "signup" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Google", "Apple"].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      disabled
                      className="rounded-lg border border-surface-variant px-4 py-3 text-label-md uppercase tracking-widest text-on-surface-variant opacity-70 cursor-not-allowed"
                    >
                      {provider} Soon
                    </button>
                  ))}
                </div>
                <div className="flex items-start gap-3 mt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 accent-primary"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="text-label-sm text-on-surface-variant leading-tight">
                    I am at least 16 years old and I accept the{" "}
                    <span className="text-primary hover:underline cursor-pointer">Terms of Use</span> and{" "}
                    <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
                  </label>
                </div>
              </>
            )}

            {(error || status) && (
              <p
                className={`rounded-lg border px-4 py-3 text-body-md ${
                  error
                    ? "border-error/50 bg-error/10 text-error"
                    : "border-primary/40 bg-primary/10 text-primary"
                }`}
                role={error ? "alert" : "status"}
              >
                {error || status}
              </p>
            )}

            <button
              type={mode === "forgot" && forgotStep === "success" ? "button" : "submit"}
              onClick={mode === "forgot" && forgotStep === "success" ? () => switchMode("login") : undefined}
              disabled={isSubmitting}
              className="bg-primary text-[#00210b] w-full py-4 rounded-lg font-bold tracking-[0.15em] hover:bg-primary-container transition-all shadow-lg active:scale-95 uppercase text-label-md mt-4 disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting ? "Please wait..." : submitLabel}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-surface-variant text-center">
            <p className="text-body-md text-on-surface-variant">
              {mode === "login" && "No account yet?"}
              {mode === "signup" && "Already have an account?"}
              {(mode === "forgot" || mode === "two-factor") && "Need a different route?"}
              <button
                type="button"
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="ml-2 text-white font-bold hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
              >
                {mode === "login" && "Create one here"}
                {mode === "signup" && "Sign in instead"}
                {(mode === "forgot" || mode === "two-factor") && "Back to sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
