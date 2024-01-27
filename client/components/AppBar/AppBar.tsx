'use client';

import React from 'react';

import {
  AppBar as MuiAppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';

const drawerWidth = 240;

type AppBarProps = {
  right?: React.ReactNode[];
  children: React.ReactNode;
  drawerContent?: React.ReactNode;
};

function AppBar({ right = [], drawerContent, children }: AppBarProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MuiAppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Phantom Fleet
          </Typography>
          <Box>{right}</Box>
        </Toolbar>
      </MuiAppBar>
      {drawerContent ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>{drawerContent}</Box>
        </Drawer>
      ) : null}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default AppBar;
