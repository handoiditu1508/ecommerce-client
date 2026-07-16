import Avatar, { AvatarProps } from "@mui/material/Avatar";
import React from "react";

const stringToColor = (value: string): string => {
  let hash = 0;
  let i;

  for (i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const getFirstLettersFromName = (name: string) => {
  const names = name.split(" ");
  const firstLetter = names[0] ? names[0][0] : "";
  const secondLetter = names[1] ? names[1][0] : "";

  return firstLetter + secondLetter;
};

function LetterAvatar({ children, style, ...props }: AvatarProps) {
  const color = typeof children === "string" ? stringToColor(children) : undefined;
  const transformedChildren: React.ReactNode = typeof children === "string" ? getFirstLettersFromName(children) : children;

  return (
    <Avatar
      style={{
        backgroundColor: color,
        ...style,
      }}
      {...props}
    >
      {transformedChildren}
    </Avatar>
  );
}

export default LetterAvatar;
