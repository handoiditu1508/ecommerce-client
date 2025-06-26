import { NavLink, NavLinkProps, useLocation } from "react-router-dom";

export default function QueryNavLink({ to, ...props }: NavLinkProps) {
  const location = useLocation();
  const query = to.toString().includes("?") ? location.search.replace("?", "&") : location.search;

  return <NavLink to={to.toString() + query} {...props} />;
}
