
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c89b3c", // Gold color for highlights
    },
    background: {
      default: "#111827", // Dark blue-gray
      paper: "#1f2937", // Slightly lighter dark blue-gray
    },
    text: {
      primary: "#f0e6d2", // Light beige for text
      secondary: "#a3a3a3",
    },
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
        fontSize: "1.75rem",
        fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          color: "#111827",
        }
      },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#374151',
                    },
                    '&:hover fieldset': {
                        borderColor: '#c89b3c',
                    },
                },
            },
        },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 400;
          src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Pretendard';
          font-style: normal;
          font-weight: 700;
          src: url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/web/static/woff2/Pretendard-Bold.woff2') format('woff2');
        }
        body {
          background-color: #111827;
        }
      `,
    },
  },
});

export default theme;
