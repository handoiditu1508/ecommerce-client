import CONFIG from "@/configs";
import Box from "@mui/material/Box";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => void;
  disabled?: boolean;
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
};

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityServicesScript(): Promise<void> {
  googleScriptPromise ??= new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();

      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services script"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

// Renders Google's own branded sign-in button (required by Google's branding guidelines)
// and forwards the resulting ID token credential to the caller for verification server-side.
function GoogleSignInButton({ onCredential, disabled = false, size = "large", text = "signin_with" }: GoogleSignInButtonProps) {
  const { i18n } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  useEffect(() => {
    let cancelled = false;

    loadGoogleIdentityServicesScript().then(() => {
      const container = containerRef.current;
      if (cancelled || !container || !window.google) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: (response) => onCredentialRef.current(response.credential),
      });

      // clear before rendering to avoid stacking duplicate buttons on re-run (e.g. React StrictMode)
      container.innerHTML = "";

      window.google.accounts.id.renderButton(container, {
        type: "standard",
        theme: "outline",
        size,
        text,
        width: Math.round(container.getBoundingClientRect().width) || 300,
        locale: i18n.language,
      });
    })
      .catch(() => {
      // Google script failed to load (e.g. blocked or offline); leave the container empty.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, text]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 1,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        "& > div": { width: "100% !important" },
      }}
    />
  );
}

export default GoogleSignInButton;
