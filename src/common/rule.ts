import CONFIG from "@/configs";

export type PasswordValidatonResult = {
  minLength: boolean;
  special: boolean;
  lower: boolean;
  upper: boolean;
  number: boolean;
};

export const validatePassword = (password?: string | null): PasswordValidatonResult => {
  const result: PasswordValidatonResult = {
    minLength: false,
    special: false,
    lower: false,
    upper: false,
    number: false,
  };

  if (!password) {
    return result;
  }

  if (password.length >= CONFIG.PASSWORD_MIN_LENGTH) {
    result.minLength = true;
  }

  if (/[^a-z0-9]/i.test(password)) {
    result.special = true;
  }

  if (/[a-z]/.test(password)) {
    result.lower = true;
  }

  if (/[A-Z]/.test(password)) {
    result.upper = true;
  }

  if (/[0-9]/.test(password)) {
    result.number = true;
  }

  return result;
};
