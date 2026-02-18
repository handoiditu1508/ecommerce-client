import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SendPreConfirmEmailModal from "./SendPreConfirmEmailModal";
import useRegisterReducer from "./useRegisterReducer";

const VerifyEmailModal = React.lazy(() => import("./VerifyEmailModal"));
const RegisterModal = React.lazy(() => import("./RegisterModal"));

// step 1 enter email: show only email input
// step 2 show message telling user confirmation email has been sent
// user click the link in email and redirect to step 3
// step 3 additional info: show other inputs like password, name, phone number, username
// step 4 success
enum RegisterStep {
  SendPreConfirmEmail,
  VerifyEmail,
  Register
}

function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<RegisterStep>(RegisterStep.SendPreConfirmEmail);
  const [registerState, registerDispatch] = useRegisterReducer();

  // handle when user click the link in email and redirect to step 3
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      registerDispatch({
        type: "SET_EMAIL",
        payload: email,
      });

      const expiredTimeMiliseconds = parseInt(searchParams.get("expiredTime")!);
      const token = searchParams.get("token");

      if (token && !isNaN(expiredTimeMiliseconds) && expiredTimeMiliseconds > Date.now()) {
        registerDispatch({
          type: "SET_TOKEN",
          payload: token,
        });
        setStep(RegisterStep.Register);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSendPreConfirmEmailSuccess = () => {
    setStep(RegisterStep.VerifyEmail);
  };

  const handleRegisterSuccess = () => {
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

  const handleChangeEmail: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    setStep(RegisterStep.SendPreConfirmEmail);
  };

  switch (step) {
    case RegisterStep.SendPreConfirmEmail:
      return <SendPreConfirmEmailModal registerState={registerState} registerDispatch={registerDispatch} onSuccess={handleSendPreConfirmEmailSuccess} />;
    case RegisterStep.VerifyEmail:
      return (
        <Suspense>
          <VerifyEmailModal registerState={registerState} registerDispatch={registerDispatch} onChangeEmail={handleChangeEmail} />
        </Suspense>
      );
    case RegisterStep.Register:
      return (
        <Suspense>
          <RegisterModal onSuccess={handleRegisterSuccess} onChangeEmail={handleChangeEmail} />
        </Suspense>
      );
  }
}

export default RegisterPage;
