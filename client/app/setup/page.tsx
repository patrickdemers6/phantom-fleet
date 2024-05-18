'use client';

import AppBar from '@/components/AppBar/AppBar';
import { useApp } from '@/context/ApplicationProvider';
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Skeleton,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  useEffect, useState,
} from 'react';
import Methods from '@/api/methods';
import { CopyBlock, dracula } from 'react-code-blocks';
import { fleetTelemetryConfig } from '@/constants/code_snippets';
import SendConfiguration from '@/components/setup/SendConfiguration';

const STEP_COUNT = 3;
enum FleetConfiguredState {
  NOT_CONFIGURED,
  ALREADY_CONFIGURED,
  JUST_CONFIGURED,
}

export default function GuidedSetupPage() {
  const [ca, setCa] = useState(null);
  const [step, setStep] = useState(0);
  const { fleetData } = useApp();
  const router = useRouter();
  const [snackbar, setSnackbar] = useState<{ severity:AlertColor | undefined, message: string } | null>(null);
  const [fleetConfiguredState, setFleetConfiguredState] = useState<FleetConfiguredState>(FleetConfiguredState.NOT_CONFIGURED);
  const vehiclesConfiguredCount = Object.keys(fleetData || {}).length;

  useEffect(() => {
    (async () => {
      const response = await Methods.get('/certificate_authority');
      const { ca: certAuthorityResponse } = await response.json();
      setCa(certAuthorityResponse);
    })();
  }, []);

  useEffect(() => {
    if (Object.keys(fleetData).length === 0) {
      setFleetConfiguredState(FleetConfiguredState.NOT_CONFIGURED);
    } else if (step !== 2) {
      setFleetConfiguredState(FleetConfiguredState.ALREADY_CONFIGURED);
    } else if (fleetConfiguredState !== FleetConfiguredState.ALREADY_CONFIGURED) {
      setSnackbar({ severity: 'success', message: 'Configuration received. Redirecting to your fleet 🎉' });
      setTimeout(() => {
        router.push('/fleet');
      }, 2000);
    }
  }, [fleetData, step]);

  const previousStep = () => {
    setStep((s) => s - 1);
  };
  const nextStep = () => {
    setStep((s) => s + 1);
  };

  return (
    <AppBar>
      <Snackbar open={snackbar !== null} autoHideDuration={3000} onClose={() => setSnackbar(null)}>
        <Alert
          onClose={() => setSnackbar(null)}
          severity={snackbar?.severity}
          variant="filled"
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
      <Box sx={{
        maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', paddingTop: 4, paddingBottom: 4,
      }}
      >
        <Typography variant="h4" align="center">Guided Setup</Typography>
        <Typography variant="body1" align="center">
          Get started in three easy steps
        </Typography>
        <Stepper activeStep={step} sx={{ paddingBottom: 3, paddingTop: 3 }}>
          <Step completed={step > 0}>
            <StepLabel>Create CA file</StepLabel>
          </Step>
          <Step completed={step > 1}>
            <StepLabel>Update config file</StepLabel>
          </Step>
          <Step>
            <StepLabel>Configure a vehicle</StepLabel>
          </Step>
        </Stepper>
        <Box>
          {
              step === 0 && (
              <Box>
                <Typography sx={{ paddingBottom: 2 }}>
                  Store this certificate in a file your fleet-telemetry server has access to.
                </Typography>
                {ca ? (
                  <Box sx={{
                    maxHeight: 300,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    overflowY: 'scroll',
                    backgroundColor: '#e9e9e9',
                    borderRadius: 4,
                    width: 'fit-content',
                  }}
                  >
                    <CopyBlock
                      text={ca}
                      theme={dracula}
                      wrapLongLines
                      customStyle={{
                        paddingLeft: 24,
                        paddingRight: 24,
                        paddingTop: 16,
                        paddingBottom: 16,
                      } as any}
                      language="text"
                    />
                  </Box>
                ) : <Skeleton variant="rectangular" height={300} />}
              </Box>
              )
            }
          {
              step === 1 && (
              <Box>
                In your server&apos;s config.json, set tls.ca_file to this certificate&apos;s path. Below is a basic configuration file.
                <CopyBlock
                  text={fleetTelemetryConfig.text}
                  theme={dracula}
                  wrapLongLines
                  customStyle={{
                    paddingLeft: 24,
                    paddingTop: 16,
                    paddingBottom: 16,
                  } as any}
                  language={fleetTelemetryConfig.codeSnippetLanguage}
                />
                <Alert severity="warning" sx={{ marginTop: 2 }}>
                  Streaming from legitimate vehicles will not work while this CA is configured.
                  Remember to remove `tls.ca_file` when you are connecting to real vehicles.
                </Alert>
              </Box>
              )
            }
          {
              step === 2 && (
              <Box>
                {fleetConfiguredState === FleetConfiguredState.ALREADY_CONFIGURED && (
                <Alert severity="success" sx={{ marginBottom: 2 }}>
                  {vehiclesConfiguredCount}
                  {' '}
                  vehicle
                  {vehiclesConfiguredCount === 1 ? '' : 's'}
                  {' '}
                  already configured. Sending a new configuration will update existing vehicles or create new ones.
                </Alert>
                )}
                <SendConfiguration />
                  {fleetConfiguredState !== FleetConfiguredState.ALREADY_CONFIGURED && (
                  <Alert severity="info" sx={{ marginTop: 2 }}>
                    This page will redirect automatically once a configuration is received.
                  </Alert>
                  )}
              </Box>
              )
            }
          <Box sx={{ paddingTop: 4, display: 'flex', justifyContent: 'right' }}>
            {step !== 0 && <Button sx={{ marginRight: 3 }} onClick={previousStep}>Previous</Button>}
            {step !== STEP_COUNT - 1 && <Button variant="contained" onClick={nextStep}>Next</Button>}
            {step === STEP_COUNT - 1 && fleetConfiguredState === FleetConfiguredState.ALREADY_CONFIGURED && (
              <Button href="/fleet" variant="contained" onClick={nextStep}>My Fleet</Button>
            )}
          </Box>
        </Box>
      </Box>
    </AppBar>
  );
}
