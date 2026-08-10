import Suspense from "@/components/Suspense";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SendEmailModal from "./SendEmailModal";
import useForgotPasswordReducer from "./useForgotPasswordReducer";

const VerifyTokenModal = React.lazy(() => import("./VerifyTokenModal"));
const ResetPasswordModal = React.lazy(() => import("./ResetPasswordModal"));
const SuccessModal = React.lazy(() => import("./SuccessModal"));

// step 1 enter email: show email input
// step 2 show message telling user confirmation email has been sent
// user click the link in email and redirect to step 3
// step 3 enter new password: show password and repassword input
// step 4 success
enum ForgotPasswordStep {
  SendEmail,
  VerifyToken,
  ResetPassword,
  Success
}

function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.SendEmail);
  const [forgotPasswordState, forgotPasswordDispatch] = useForgotPasswordReducer();

  // handle when user click the link in email and redirect to step 3
  useEffect(() => {
    const userId = parseInt(searchParams.get("userId")!);
    const token = searchParams.get("token");
    if (token && !isNaN(userId)) {
      forgotPasswordDispatch({
        type: "SET_RESET_PASSWORD_COMMAND",
        payload: {
          userId,
          token,
          newPassword: "",
        },
      });

      setStep(ForgotPasswordStep.ResetPassword);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSendUsernameEmailSuccess = () => {
    setStep(ForgotPasswordStep.VerifyToken);
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
      return (
        <SendEmailModal
          forgotPasswordState={forgotPasswordState}
          forgotPasswordDispatch={forgotPasswordDispatch}
          onSuccess={handleSendUsernameEmailSuccess}
        />
      );
    case ForgotPasswordStep.VerifyToken:
      return (
        <Suspense>
          <VerifyTokenModal
            forgotPasswordState={forgotPasswordState}
            forgotPasswordDispatch={forgotPasswordDispatch}
            onChangeEmail={handleChangeEmail}
          />
        </Suspense>
      );
    case ForgotPasswordStep.ResetPassword:
      return (
        <Suspense>
          <ResetPasswordModal forgotPasswordState={forgotPasswordState} onSuccess={handleResetPasswordSuccess} />
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
