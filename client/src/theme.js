// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // manually adjusted
    10: "#f6f6f6", // manually adjusted
    50: "#f0f0f0", // manually adjusted
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000", // manually adjusted
  },
  primary: {
    // blue
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45", // manually adjusted
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  secondary: {
    // yellow
    50: "#f0f0f0", // manually adjusted
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
  // New green color for light mode
  green: {
    50: "#f7fbf0",
    100: "#eef7e1",
    200: "#ddefc3",
    300: "#cbe7a5",
    400: "#b9df87",
    500: "#b2dd4b", // Main green color
    600: "#8fb13c",
    700: "#6c852d",
    800: "#49591e",
    900: "#262d0f",
  },
};

// Light mode tokens - manually defined for proper green/white theme
export const tokensLight = {
  grey: {
    0: "#000000", // black
    10: "#141414", // dark grey
    50: "#292929", // dark grey
    100: "#3d3d3d",
    200: "#525252",
    300: "#666666",
    400: "#858585",
    500: "#a3a3a3",
    600: "#c2c2c2",
    700: "#e0e0e0",
    800: "#f0f0f0",
    900: "#f6f6f6",
    1000: "#ffffff", // white
  },
  primary: {
    // green for light mode
    100: "#262d0f",
    200: "#49591e",
    300: "#6c852d",
    400: "#8fb13c",
    500: "#b2dd4b", // Main green color
    600: "#b9df87",
    700: "#cbe7a5",
    800: "#ddefc3",
    900: "#eef7e1",
  },
  secondary: {
    // Black and dark colors for text in light mode
    50: "#000000", // black
    100: "#000000", // black for main text
    200: "#141414", // very dark grey
    300: "#292929", // dark grey
    400: "#3d3d3d", // medium dark grey
    500: "#525252", // medium grey
    600: "#666666", // medium grey
    700: "#858585", // light grey
    800: "#a3a3a3", // light grey
    900: "#c2c2c2", // very light grey
  },
  green: {
    50: "#f7fbf0",
    100: "#eef7e1",
    200: "#ddefc3",
    300: "#cbe7a5",
    400: "#b9df87",
    500: "#b2dd4b", // Main green color
    600: "#8fb13c",
    700: "#6c852d",
    800: "#49591e",
    900: "#262d0f",
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode - keep as is
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.primary[600],
              alt: tokensDark.primary[500],
            },
          }
        : {
            // palette values for light mode - updated with green and white
            primary: {
              ...tokensLight.primary,
              main: tokensLight.primary[500], // #b2dd4b
              light: tokensLight.primary[600],
              dark: tokensLight.primary[400],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensLight.secondary[100], // black for main text
              light: tokensLight.secondary[300], // dark grey for secondary text
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensLight.grey[500],
            },
            background: {
              default: tokensLight.grey[1000], // white
              alt: tokensLight.grey[900], // very light grey
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
