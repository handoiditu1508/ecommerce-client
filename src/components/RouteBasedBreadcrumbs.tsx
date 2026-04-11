import { CrumbData, RouteHandleObject } from "@/routes/models";
import Breadcrumbs, { BreadcrumbsProps } from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import { UIMatch, useMatches } from "react-router-dom";
import CustomLink from "./CustomLink";

function RouteBasedBreadcrumbs(props: Omit<BreadcrumbsProps, "children">) {
  const matches = useMatches() as UIMatch<any, RouteHandleObject>[];
  const currentMatch = matches[matches.length - 1];

  if (currentMatch.handle && currentMatch.handle.hideBreadcrumbs) {
    return null;
  }

  const crumbs: CrumbData[] = matches
    .filter((match) => match.handle && match.handle.crumb)
    .map((match) => (typeof match.handle.crumb === "function"
      ? match.handle.crumb!(match.loaderData)
      : match.handle.crumb!));

  return (
    <Breadcrumbs aria-label="breadcrumb" maxItems={5} {...props}>
      {crumbs.map((crumb, index, array) => {
        const isLast = index === array.length - 1;

        return (crumb.to === undefined)
          ? (
            <Typography
              key={index}
              color={isLast ? "textPrimary" : "inherit"}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                "*": {
                  fontSize: "inherit",
                },
              }}>
              {crumb.icon}
              {crumb.label}
            </Typography>
          )
          : (
            <CustomLink
              key={index}
              to={crumb.to}
              underline="hover"
              color={isLast ? "textPrimary" : "inherit"}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                "*": {
                  fontSize: "inherit",
                },
              }}>
              {crumb.icon}
              {crumb.label}
            </CustomLink>
          );
      })}
    </Breadcrumbs>
  );
}

export default RouteBasedBreadcrumbs;
