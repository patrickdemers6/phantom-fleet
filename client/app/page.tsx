'use client';

import {
  Box, Card, CardActionArea, CardContent, Grid, Typography,
} from '@mui/material';
import Image from 'next/image';
import AppBar from '@/components/AppBar/AppBar';
import { ElectricCar, MenuBook } from '@mui/icons-material';

export default function Home() {
  return (
    <AppBar>
      <Grid
        container
        spacing={4}
        sx={{
          mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
        }}
      >
        <Grid item xs={12} sm={4} textAlign="right">
          <Image
            src="/fleet.jpeg"
            alt="fleet"
            width={400}
            height={400}
            style={{ borderRadius: 15 }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{
            maxWidth: 900, marginLeft: 'auto', marginRight: 'auto', paddingTop: 4, paddingBottom: 4,
          }}
          >
            <Typography variant="h4" align="center">Welcome to Phantom Fleet</Typography>
            <Box sx={{
              display: 'flex', justifyContent: 'space-evenly', gap: 2, paddingY: 2,
            }}
            >
              <Card sx={{ maxWidth: 345 }} variant="outlined">
                <CardActionArea href="/setup">
                  <CardContent>
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                      <MenuBook fontSize="large" />
                    </Box>
                    <Typography align="center" gutterBottom variant="h5" component="div">
                      Guided Setup
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      First time here? Get started in three easy steps
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card sx={{ maxWidth: 345 }} variant="outlined">
                <CardActionArea href="/fleet">
                  <CardContent>
                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                      <ElectricCar fontSize="large" />
                    </Box>
                    <Typography align="center" gutterBottom variant="h5" component="div">
                      My Fleet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Already setup? Go straight to your fleet
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </AppBar>
  );
}
