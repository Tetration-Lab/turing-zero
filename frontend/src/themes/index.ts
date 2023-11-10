import { extendTheme } from "@chakra-ui/react";
import { cardTheme } from "./Card";
import { buttonTheme } from "./Button";
import { tooltipTheme } from "./Tooltip";
import { skeletonTheme } from "./Skeleton";
import { codeTheme } from "./Code";

const breakpoints = {
  base: "0em",
  sm: "30em",
  md: "60em",
  lg: "90em",
  xl: "120em",
};

const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: "light",
  },
  fontSizes: {
    xs: "0.625rem",
    sm: "0.812rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.562rem",
    "2xl": "1.938rem",
    "3xl": "2.438rem",
    "4xl": "3.062rem",
  },
  colors: {
    // Default is 400, Hover is 500
    accent_purple: {
      50: "#FAEEFF",
      100: "#F1C9FF",
      200: "#E7A4FF",
      300: "#DC7EFE",
      400: "#C654EF",
      500: "#A73DCD",
      600: "#892AAB",
      700: "#6C1B89",
      800: "#4F0E67",
      900: "#340645",
    },
    accent_blue: {
      50: "#EEF2FF",
      100: "#C7D5FF",
      200: "#A0B8FF",
      300: "#799AFF",
      400: "#4F78F4",
      500: "#3A60D2",
      600: "#294AB0",
      700: "#1A378E",
      800: "#0F266C",
      900: "#07184A",
    },
    primary: {
      900: "#a62630",
      800: "#bc2a36",
      700: "#d12f3b",
      600: "#d6434e",
      500: "#db5762",
      400: "#e06c75",
      300: "#e58188",
      200: "#ea959c",
      100: "#eeaab0",
      50: "#f3bfc3",
      accent: "#d6434e",
    },
    gray: {
      25: "#FCFCFD",
      50: "#f9f9fb",
      75: "#7875951A",
      100: "#e6ecf6",
      200: "#cfd9ed",
      300: "#a3b0ca",
      350: "#8aa0cb",
      400: "#727d96",
      500: "#2b303f",
      550: "#21252f",
      600: "#1b1e27",
      700: "#11141c",
      800: "#0c0d16",
      900: "#05060e",
      1000: "#344054",
      bginput: "#2b303f",
    },
    background: {
      primary: "#0B0C0D",
      secondary: "#343A3F",
    },
    header: {
      400: "#F8F9FA",
      500: "#E0E0E0",
    },
    body: {
      primary: "#F8F9FA",
      secondary: "#BDBDBD",
      LightPrimary: "#616161",
      LightSecondary: "#9E9E9E",
    },
    error: "#ed455c",
    success: "#46ada7",
    warning: "#f6925a",
  },

  components: {
    Tooltip: tooltipTheme,
    Card: cardTheme,
    Button: buttonTheme,
    Skeleton: skeletonTheme,
    Code: codeTheme,
  },

  fonts: {
    heading: "Inconsolata",
    body: "Inconsolata",
  },

  breakpoints,

  styles: {
    global: (_props: any) => ({
      body: {
        height: "100dvh",
        overflowX: "hidden",
        lineHeight: "base",
        backgroundPosition: "0 -10vh",
        backgroundRepeat: "no-repeat",
        justifyContent: "center",
        backgroundSize: "cover",
      },
    }),
  },
});

export default theme;
