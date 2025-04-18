import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "#DF761F",
      secondary: "#667085",
      secondary2: "#5D6B98",
      black: "#101828",
      white: "#fff",
      lightGreen: "#F9FAFB",
      navyBlue: "#1D2939",
      purple: "#DF761F",
      blue: "#DF761F",
      blue2: "#3538CD",
      lightPurple: "#F5F3F2",
      lightPurple2: "#FFF4EA",
      lightBlue: "#F5F3F2",
      lightPink: "#FDF2FA",
      pink: "#C11574",
      lightGreen2: "#F0F9FF",
      lightGreen3: "#ECFDF3",
      green: "#026AA2",
      green2: "#027A48",
      red: "red",
      gray2: "#D0D5DD",
      gray3: "#F9F9FB",
      darkGreen: "#125D56",
      grayText: "#4A5578",
      darkBlack: "#111322",
      purple2: "#DF761F",
      darkBlack2: "#2B2B2B",
    },
    borderColor: {
      transparent: "transparent",
      purple: "#DF761F",
      lightPurple: "#F5F3F2",
      primary: "#DF761F",
      red: "red",
      gray: "#EAECF0",
      darkGray: "#B9C0D4",
      gray2: "#D0D5DD",
      gray3: "#EFF1F5",
    },
    boxShadow: {
      shadow1: "0px 4px 16px 0px #0000001A",
      shadow2: "0px -1px 4px 0px #00000026 inset",
      shadow3: "0px 4px 9px 0px #2A343E21",
      shadow4: "0px 1px 2px 0px #1018280D",
    },
    backgroundImage: {
      "gradientPink-box":
        "linear-gradient(358.27deg, #FFFAFA 1.38%, #FFFFFF 96.02%)",
    },
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      laptop: "1024px",
      desktop: "1280px",
      big: "1440px",
      xBig: "1920px",
    },
    zIndex: {
      100: "100",
    },
  },
  plugins: [],
};
export default config;
