'use client';

import {
  Card, CardContent, Grid, Typography,
} from '@mui/material';

type TileWrapperProps = {
  children: React.ReactNode;
  title: string;
};

function TileWrapper({ children, title }: TileWrapperProps) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ pb: 2 }}>{title}</Typography>
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default TileWrapper;
