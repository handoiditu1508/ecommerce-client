import { distinct } from "@/common/array";
import CONFIG from "@/configs";
import useAppSelector from "@/hooks/useAppSelector";
import Policy, { ADMIN_POLICY_EXCLUSION } from "@/models/Policy";
import { authSelectors } from "@/redux/slices/authSlice";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, Outlet, UIMatch, useLocation, useMatches } from "react-router-dom";
import { RouteHandleObject } from "./models";

function AuthorizationLayout() {
  const matches = useMatches() as UIMatch<unknown, RouteHandleObject | undefined>[];
  const location = useLocation();
  const requiredPolicies: Policy[] = distinct(matches.flatMap((match) => match.handle?.policies ?? CONFIG.EMPTY_ARRAY));
  const isLoginRequired = matches.some((match) => match.handle?.requireAuth);
  const isProtectedRoute = isLoginRequired || requiredPolicies.length > 0;
  const isSignedIn = useAppSelector(authSelectors.signedIn);
  const userPolicies = useAppSelector(authSelectors.policies);
  const loading = useAppSelector(authSelectors.loading);

  // public page
  if (!isProtectedRoute) {
    return <Outlet />;
  }

  // auth state is loading
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // page require login
  if (!isSignedIn) {
    const returnUrl = encodeURIComponent(location.pathname + location.search + location.hash);

    return <Navigate to={`/login?returnUrl=${returnUrl}`} state={{ from: location }} replace />;
  }

  // page require specific permission
  const hasAdminPolicy = userPolicies.includes(Policy.Admin);
  const hasRequiredPolicies = requiredPolicies.every((policy) =>
    userPolicies.includes(policy)
    || (hasAdminPolicy && !ADMIN_POLICY_EXCLUSION.includes(policy)));

  if (!hasRequiredPolicies) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default AuthorizationLayout;
