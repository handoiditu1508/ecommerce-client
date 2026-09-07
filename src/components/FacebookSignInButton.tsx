import CONFIG from "@/configs";
import FacebookIcon from "@mui/icons-material/FacebookOutlined";
import Button from "@mui/material/Button";
import { useState } from "react";

type FacebookSignInButtonProps = {
  onCredential: (accessToken: string, email?: string) => void;
  disabled?: boolean;
};

let facebookSdkPromise: Promise<void> | null = null;

function loadFacebookSdk(appId: string): Promise<void> {
  facebookSdkPromise ??= new Promise((resolve, reject) => {
    if (window.FB) {
      resolve();

      return;
    }

    window.fbAsyncInit = () => {
      window.FB!.init({ appId, cookie: false, xfbml: false, version: "v21.0" });
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Facebook SDK script"));
    document.body.appendChild(script);
  });

  return facebookSdkPromise;
}

// Facebook's classic Login for Web JS SDK only yields an opaque access token, not an email —
// a follow-up /me call is needed to read the email for the 2FA "username" prefill; the server
// independently re-derives everything from the access token regardless.
function FacebookSignInButton({ onCredential, disabled = false }: FacebookSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await loadFacebookSdk(CONFIG.FACEBOOK_APP_ID);

      window.FB!.login((response) => {
        const accessToken = response.authResponse?.accessToken;
        if (!accessToken) {
          setLoading(false);

          return;
        }

        window.FB!.api<{ email?: string; }>("/me", { fields: "email" }, (profile) => {
          onCredential(accessToken, profile.email);
          setLoading(false);
        });
      }, { scope: "email" });
    } catch {
      setLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      disabled={disabled || loading}
      startIcon={<FacebookIcon sx={{ color: "#1877F2" }} />}
      onClick={handleClick}
    >
      Facebook
    </Button>
  );
}

export default FacebookSignInButton;
