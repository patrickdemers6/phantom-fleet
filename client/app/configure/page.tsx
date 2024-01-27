'use client';

import { setConfig } from '@/api/config';
import AppBar from '@/components/AppBar/AppBar';
import { useApp } from '@/context/ApplicationProvider';
import { useSnackbar } from '@/components/SnackbarContext';
import { FLEET } from '@/constants/paths';
import {
  Box,
  Button,
  Grid,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEventHandler, useRef, useState } from 'react';
import Link from 'next/link';

const validateFormInput = (host?: string, port?: string) => {
  const helpText = { host: '', port: '' };
  let isValid = true;
  if (host?.trim() === '') {
    helpText.host = 'Host cannot be empty';
    isValid = false;
  }
  if (port?.trim() === '') {
    helpText.port = 'Port cannot be empty';
    isValid = false;
  } else if (port?.match(/^\d+$/) === null) {
    helpText.port = 'Port must be a number';
    isValid = false;
  }

  return { isValid, helpText };
};

export default function ConfigurePage() {
  const { server, isLoading, configureServer } = useApp();
  const [helpText, setHelpText] = useState({
    host: '',
    port: '',
  });
  const hostRef = useRef<HTMLInputElement>(null);
  const portRef = useRef<HTMLInputElement>(null);
  const snackbar = useSnackbar();
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const host = hostRef.current?.value as string;
    const port = portRef.current?.value as string;
    const validation = validateFormInput(host, port);
    if (!validation.isValid) {
      setHelpText(validation.helpText);
      return;
    }

    const { valid, reason } = await setConfig(host, Number.parseInt(port, 10));
    if (!valid) {
      snackbar.openSnackbar(
        `Unable to connect to fleet-telemetry server: ${reason}`,
        'error',
      );
    } else {
      snackbar.openSnackbar('Connection successful', 'success');
      configureServer(host, port);
      router.push(FLEET);
    }
  };

  return (
    <AppBar>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} sm={6} textAlign="right">
          <Image
            src="/fleet.jpeg"
            alt="fleet"
            width="400"
            height="400"
            style={{ borderRadius: 15 }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4">Welcome to Phantom Fleet</Typography>
          <Typography variant="body1">
            To get started, enter your fleet-telemetry server information.
          </Typography>
          <Box
            sx={{ mt: 1, maxWidth: 300 }}
            onSubmit={handleSubmit}
            component="form"
          >
            {isLoading ? (
              <>
                <Skeleton>
                  <TextField variant="outlined" margin="normal" fullWidth />
                </Skeleton>
                <Skeleton>
                  <TextField variant="outlined" margin="normal" fullWidth />
                </Skeleton>
              </>
            ) : (
              <>
                <TextField
                  error={helpText.host !== ''}
                  helperText={helpText.host}
                  label="Host"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  inputRef={hostRef}
                  defaultValue={server?.host}
                />
                <TextField
                  error={helpText.port !== ''}
                  helperText={helpText.port}
                  label="Port"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  inputRef={portRef}
                  defaultValue={server?.port}
                />
              </>
            )}
            <Button variant="contained" type="submit" sx={{ mt: 3, mb: 2 }}>
              Validate Connection
            </Button>
            <Typography>
              <Link style={{ color: 'grey' }} href={FLEET}>
                Skip connection setup
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </AppBar>
  );
}
