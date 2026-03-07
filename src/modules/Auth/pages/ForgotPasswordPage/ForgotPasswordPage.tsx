// step 1 enter email: show email input
// step 2 show message telling user confirmation email has been sent
// user click the link in email and redirect to step 3
// step 3 enter new password: show password and repassword input
// step 4 success

import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useState } from "react";
import SendEmailModal from "./SendEmailModal";
import useForgotPasswordReducer from "./useForgotPasswordReducer";

const VerifyOtpModal = React.lazy(() => import("./VerifyOtpModal"));
const ResetPasswordModal = React.lazy(() => import("./ResetPasswordModal"));
const SuccessModal = React.lazy(() => import("./SuccessModal"));

enum ForgotPasswordStep {
  SendEmail,
  VerifyOtp,
  ResetPassword,
  Success
}

function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.SendEmail);
  const [forgotPasswordState, forgotPasswordDispatch] = useForgotPasswordReducer();

  const handleSendUsernameEmailSuccess = () => {
    setStep(ForgotPasswordStep.VerifyOtp);
  };

  const handleChangeEmail: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    setStep(ForgotPasswordStep.SendEmail);
  };

  const handleResetPasswordSuccess = () => {
    setStep(ForgotPasswordStep.Success);
  };

  switch (step) {
    case ForgotPasswordStep.SendEmail:
      return <SendEmailModal forgotPasswordState={forgotPasswordState} forgotPasswordDispatch={forgotPasswordDispatch} onSuccess={handleSendUsernameEmailSuccess} />;
    case ForgotPasswordStep.VerifyOtp:
      return (
        <Suspense>
          <VerifyOtpModal forgotPasswordState={forgotPasswordState} forgotPasswordDispatch={forgotPasswordDispatch} onChangeEmail={handleChangeEmail} />
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
