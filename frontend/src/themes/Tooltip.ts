import { cssVar, defineStyle, defineStyleConfig } from "@chakra-ui/react";

// export the component theme
export const tooltipTheme = defineStyleConfig({
  baseStyle: defineStyle({
    fontSize: "md",
    fontWeight: "medium",
    background: "gray.500",
    color: "gray.50",
    borderRadius: "md",
    [cssVar("popper-arrow-bg").variable]: "gray.500",
  }),
  variants: {
    red: defineStyle({
      background: "red.500",
      [cssVar("popper-arrow-bg").variable]: "red.500",
      color: "gray.50",
      shadow: 0,
    }),
  },
});
