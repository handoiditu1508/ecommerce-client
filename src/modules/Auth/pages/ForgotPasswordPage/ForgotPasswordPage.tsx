// step 1 enter email: show email input
// step 2 confirm otp: disable email input and show otp input
// step 3 enter new password: hide otp input and show password and repassword input
// step 4 success

import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useState } from "react";
import UsernameOrEmailModal from "./UsernameOrEmailModal";

const VerifyOtpModal = React.lazy(() => import("./VerifyOtpModal"));
const ResetPasswordModal = React.lazy(() => import("./ResetPasswordModal"));
const SuccessModal = React.lazy(() => import("./SuccessModal"));

enum ForgotPasswordStep {
  UsernameOrEmail,
  VerifyOtp,
  ResetPassword,
  Success
}

function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.UsernameOrEmail);

  const handleSendUsernameEmailSuccess = () => {
    setStep(ForgotPasswordStep.VerifyOtp);
  };

  const handleVerifyOtpSuccess = () => {
    setStep(ForgotPasswordStep.ResetPassword);
  };

  const handleChangeEmail: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    setStep(ForgotPasswordStep.UsernameOrEmail);
  };

  const handleResetPasswordSuccess = () => {
    setStep(ForgotPasswordStep.Success);
  };

  switch (step) {
    case ForgotPasswordStep.UsernameOrEmail:
      return <UsernameOrEmailModal onSuccess={handleSendUsernameEmailSuccess} />;
    case ForgotPasswordStep.VerifyOtp:
      return (
        <Suspense>
          <VerifyOtpModal onSuccess={handleVerifyOtpSuccess} onChangeEmail={handleChangeEmail} />
        </Suspense>
      );
    case ForgotPasswordStep.ResetPassword:
      return (
        <Suspense>
          <ResetPasswordModal onSuccess={handleResetPasswordSuccess} />
        </Suspense>
      );
    case ForgotPasswordStep.Success:
      return (
        <Suspense>
          <SuccessModal />
        </Suspense>
      );
  }
}

export default ForgotPasswordPage;
