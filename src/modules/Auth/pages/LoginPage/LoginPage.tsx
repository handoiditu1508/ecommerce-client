import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginModal from "./LoginModal";
import useLoginReducer from "./useLoginReducer";

const Login2faModal = React.lazy(() => import("./Login2faModal"));

// step 1 enter email and password: show email/username input and password input
// step 2 confirm otp: hide email/username input and password input
// step 3 success
enum LoginStep {
  Login,
  Login2fa
}

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<LoginStep>(LoginStep.Login);
  const [loginState, loginDispatch] = useLoginReducer();

  const handleLogin2fa = () => {
    setStep(LoginStep.Login2fa);
  };

  const handleLoginSuccess = () => {
    const returnUrl = searchParams.get("returnUrl") || searchParams.get("returnurl");

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
    ? <LoginModal loginState={loginState} loginDispatch={loginDispatch} onLogin2fa={handleLogin2fa} onSuccess={handleLoginSuccess} />
    : (
      <Suspense>
        <Login2faModal loginState={loginState} loginDispatch={loginDispatch} onSuccess={handleLoginSuccess} onReturnToLogin={handleReturnToLogin} />
      </Suspense>
    );
}

export default LoginPage;
