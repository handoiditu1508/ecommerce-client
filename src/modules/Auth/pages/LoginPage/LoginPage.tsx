import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";

const VerifyOtpModal = React.lazy(() => import("./VerifyOtpModal"));

// step 1 enter email and password: show email/username input and password input
// step 2 confirm otp: hide email/username input and password input
// step 3 success
enum LoginStep {
  Login,
  VerifyOtp
}

function LoginPage() {
  const navigate = useNavigate();
  const location2 = useLocation();
  const [step, setStep] = useState<LoginStep>(LoginStep.Login);

  const handleLogin2fa = () => {
    setStep(LoginStep.VerifyOtp);
  };

  const handleLoginSuccess = () => {
    const urlSearchParam = new URLSearchParams(location2.search);
    const returnUrl = urlSearchParam.get("returnUrl") || urlSearchParam.get("returnurl");

    if (returnUrl) {
      if (returnUrl.startsWith("http")) {
        window.location.href = returnUrl;
      } else {
        navigate(returnUrl);
      }
    } else {
      navigate("/");
    }
  };

  const handleReturnToLogin: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    setStep(LoginStep.Login);
  };

  return (step === LoginStep.Login)
    ? <LoginModal onLogin2fa={handleLogin2fa} onLoginSuccess={handleLoginSuccess} />
    : (
      <Suspense>
        <VerifyOtpModal onLoginSuccess={handleLoginSuccess} onReturnToLogin={handleReturnToLogin} />
      </Suspense>
    );
}

export default LoginPage;
