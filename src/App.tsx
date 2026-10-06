import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import './SidebarPalette.css';

const theme = createTheme({
  palette: {
    primary: { main: '#315f9e', dark: '#254875', light: '#e4edf8' },
    secondary: { main: '#c56645', dark: '#a64b32', light: '#f7e8e1' },
    success: { main: '#4b7c52' },
    warning: { main: '#bd862d' },
    info: { main: '#527aa8' },
    error: { main: '#b8524c' },
    background: { default: '#f2f3f2', paper: '#fffefd' },
    text: { primary: '#252d38', secondary: '#697483' },
    divider: '#dfe3e8',
  },
  typography: {
    fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
    h1: { fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 500 },
    h2: { fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 500 },
    h3: { fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 500 },
    h4: { fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 500 },
    h5: { fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 500 },
    h6: { fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif", fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 4, boxShadow: 'none' } } },
    MuiPaper: { styleOverrides: { outlined: { borderColor: '#dfe3e8' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 46 } } },
  },
});

function App() {
  return <ThemeProvider theme={theme}><CssBaseline /><AppRoutes /></ThemeProvider>;
}

export default App;
