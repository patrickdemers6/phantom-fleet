'use client';

import {
  Alert,
  AlertColor,
  Snackbar,
  SnackbarCloseReason,
} from '@mui/material';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

interface SnackbarContextProps {
  openSnackbar: (message: string, severity: AlertColor) => void;
  closeSnackbar: (
    e: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined,
);

interface SnackbarProviderProps {
  children: ReactNode;
}

type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
};

const closedSnackbar: SnackbarState = {
  open: false,
  message: '',
  severity: 'success',
};

export function SnackbarProvider({ children }: SnackbarProviderProps) {
  const [snackbar, setSnackbar] = useState<SnackbarState>(closedSnackbar);

  const openSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = (
    _: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') return;
    setSnackbar(closedSnackbar);
  };

  return (
    <SnackbarContext.Provider
      value={useMemo(() => ({ openSnackbar, closeSnackbar }), [])}
    >
      {children}
      <Snackbar
        autoHideDuration={4000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbar.open}
        onClose={closeSnackbar}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export const useSnackbar = (): SnackbarContextProps => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
