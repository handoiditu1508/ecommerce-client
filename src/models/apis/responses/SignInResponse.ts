import User from "@/models/entities/User";

type SignInResponse = {
  expirationTime: string;
  user: User;
};

export default SignInResponse;
