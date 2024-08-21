import React from 'react';
import logo from './logo.svg';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import Router from './components/Router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default' }}>
        <Router />
      </Box>
    </LocalizationProvider>
  );
}
