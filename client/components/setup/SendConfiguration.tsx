import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { sendFleetTelemetryConfig } from '@/constants/code_snippets';
import { useEffect, useState } from 'react';
import {
  CopyBlock, dracula,
} from 'react-code-blocks';
import { useRouter } from 'next/navigation';
import { Vin } from '@/context/types';
import { useApp } from '@/context/ApplicationProvider';

type SendConfigurationProps = {
  redirect?: boolean;
};

const SendConfiguration = (props: SendConfigurationProps) => {
  const [language, setLanguage] = useState<number>(0);
  const router = useRouter();
  const { fleetData } = useApp();

  useEffect(() => {
    if (!props.redirect) return;

    const keys = Object.keys(fleetData);
    if (keys.length > 0) redirectToVehicle(keys[0]);
  }, [props.redirect, fleetData]);

  const redirectToVehicle = (vin: Vin) => {
    router.push(`/fleet/${vin}`);
  };
  return (
    <Box sx={{ marginTop: 2 }}>
      Vehicles are configured using an endpoint identical to
      {' '}
      <Link target="_blank" href="https://developer.tesla.com/docs/fleet-api#fleet_telemetry_config-create">
        Tesla&apos;s official endpoint
      </Link>
      .
      <Box sx={{ margin: 2 }}>
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Code samples</Typography>
          <FormControl sx={{ marginBottom: 1, marginTop: 2 }}>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              sx={{ marginBottom: 1 }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Language"
              value={language}
            >
              {sendFleetTelemetryConfig.map(({ name }, i) => <MenuItem value={i} onClick={() => setLanguage(i)}>{name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ backgroundColor: dracula.backgroundColor }}>
          <CopyBlock
            text={sendFleetTelemetryConfig[language].content}
            theme={dracula}
            wrapLongLines
            codeContainerStyle={{ padding: 0 }}
            customStyle={{ paddingLeft: 24, paddingTop: 16, paddingBottom: 16 } as any}
            language={sendFleetTelemetryConfig[language].codeSnippetLanguage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SendConfiguration;
