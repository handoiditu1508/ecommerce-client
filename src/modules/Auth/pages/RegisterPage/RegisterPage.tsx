import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const [step, setStep] = useState<RegisterStep>(RegisterStep.SendPreConfirmEmail);
  const [registerState, registerDispatch] = useRegisterReducer();

  const handleSendPreConfirmEmailSuccess = () => {
    setStep(RegisterStep.VerifyEmail);
  };

  const handleRegisterSuccess = () => {
    const urlSearchParam = new URLSearchParams(location.search);
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
