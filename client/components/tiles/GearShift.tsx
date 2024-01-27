'use client';

import {
  Grid, Menu, MenuItem, Tooltip,
} from '@mui/material';
import { useRef, useState } from 'react';
import { KeyData } from '@/context/types';
import SingleCharacterButton from '../SingleCharacterButton';
import TileWrapper from './TileWrapper';
import { useApp } from '../../context/ApplicationProvider';

type Gear = {
  name: string;
  shortName?: string;
  value: number;
};

const primaryGears = [
  { name: 'Park', shortName: 'P', value: 2 },
  { name: 'Reverse', shortName: 'R', value: 3 },
  { name: 'Drive', shortName: 'D', value: 4 },
  { name: 'More', shortName: '+', value: -1 },
];

const secondaryGears = [
  { name: 'Neutral', value: 5 },
  { name: 'Unknown', value: 0 },
  { name: 'Invalid', value: 1 },
  { name: 'SNA', value: 6 },
];

function GearShift({ vin }: { vin: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchor = useRef(null);
  const fleet = useApp();
  const vehicleData = fleet?.fleetData[vin]?.data as KeyData;

  if (!vehicleData.Gear) return null;
  const selected = vehicleData.Gear?.intValue;

  let selectedIndex = primaryGears.findIndex((gear) => gear.value === selected);
  if (selectedIndex === -1) selectedIndex = 3;

  const closeMenu = () => setMenuOpen(false);

  const onClick = (gear: Gear) => {
    if (gear.name === 'More') {
      setMenuOpen(true);
      return;
    }

    closeMenu();
    fleet?.setIntData(vin, 'Gear', gear.value);
  };

  return (
    <TileWrapper title="Gear Shift">
      <Grid container>
        {primaryGears.map((gear, i) => (
          <Grid item xs={3} key={gear.name} sx={{ textAlign: 'center' }}>
            <Tooltip title={gear.name}>
              <div ref={gear.name === 'More' ? menuAnchor : null}>
                <SingleCharacterButton
                  onClick={() => onClick(gear)}
                  variant={i === selectedIndex ? 'contained' : 'text'}
                  character={gear.shortName}
                />
              </div>
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <Menu
        open={menuOpen}
        onClose={closeMenu}
        anchorEl={menuAnchor.current}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
      >
        {secondaryGears.map((gear) => (
          <MenuItem
            key={gear.name}
            onClick={() => onClick(gear)}
            selected={gear.value === selected}
          >
            {gear.name}
          </MenuItem>
        ))}
      </Menu>
    </TileWrapper>
  );
}

export default GearShift;
