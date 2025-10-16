import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterEmailModal from "./RegisterEmailModal";

const VerifyOtpModal = React.lazy(() => import("./VerifyOtpModal"));
const AdditionalInfoModal = React.lazy(() => import("./AdditionalInfoModal"));

// step 1 enter email: show only email input
// step 2 confirm otp: disable email input and show otp input
// step 3 additional info: hide otp input and show other inputs like password, name, phone number, username
// step 4 success
enum RegisterStep {
  RegisterEmail,
  VerifyOtp,
  AdditionalInfo
}

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<RegisterStep>(RegisterStep.RegisterEmail);

  const handleRegisterEmailSuccess = () => {
    setStep(RegisterStep.VerifyOtp);
  };

  const handleVerifyOtpSuccess = () => {
    setStep(RegisterStep.AdditionalInfo);
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
    setStep(RegisterStep.RegisterEmail);
  };

  switch (step) {
    case RegisterStep.RegisterEmail:
      return <RegisterEmailModal onSuccess={handleRegisterEmailSuccess} />;
    case RegisterStep.VerifyOtp:
      return (
        <Suspense>
          <VerifyOtpModal onSuccess={handleVerifyOtpSuccess} onChangeEmail={handleChangeEmail} />
        </Suspense>
      );
    case RegisterStep.AdditionalInfo:
      return (
        <Suspense>
          <AdditionalInfoModal onSuccess={handleRegisterSuccess} onChangeEmail={handleChangeEmail} />
        </Suspense>
      );
  }
}

export default RegisterPage;
