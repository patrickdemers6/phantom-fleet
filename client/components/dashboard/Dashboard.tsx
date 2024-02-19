import { Vin } from '@/context/types';
import {
  Card, CardContent, Grid, Typography,
} from '@mui/material';
import Items from './Items';
import blocks from './blocks';

type DashboardProps = {
  vin: Vin;
};

// TODO: make blocks shown configurable
const allBlocks = [
  blocks.gearShift,
  blocks.charge,
  blocks.tirePressure,
];

const Dashboard = (props: DashboardProps) => allBlocks.map((block) => (
  <TileWrapper title={block.title} key={block.title}>
    <Items vin={props.vin} items={block.items as TileItem[]} />
  </TileWrapper>
));

type TileWrapperProps = {
  children: React.ReactNode;
  title: string;
};

const TileWrapper = ({ children, title }: TileWrapperProps) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ pb: 2 }}>{title}</Typography>
        {children}
      </CardContent>
    </Card>
  </Grid>
);

export default Dashboard;
