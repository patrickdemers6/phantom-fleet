'use client';

import { Box } from '@mui/material';
import { Vin } from '@/context/types';
import { useEffect } from 'react';
import { useApp } from '../../context/ApplicationProvider';
import GenericRenderer from './renderers';

type ItemProps = {
  item: TileItem;
  vin: Vin;
};

const Item = (props: ItemProps) => {
  const app = useApp();
  const { field, fieldType } = props.item;

  const setFunctionName = `set${fieldType
    .charAt(0)
    .toUpperCase()}${fieldType.slice(1)}` as keyof typeof app;

  const handleChange = (value: unknown) => {
    const changeFn = app[setFunctionName];
    if (!changeFn) {
      return;
    }
    // @ts-ignore next-line
    changeFn(props.vin, field, value);
  };

  // @ts-ignore next-line
  const fieldValue = app.fleetData[props.vin]?.data?.[field]?.[fieldType];
  useEffect(() => {
    if (typeof fieldValue === 'undefined') {
      handleChange(props.item.defaultValue);
    }
  }, []);

  if (typeof fieldValue === 'undefined') return null;

  return (
    <GenericRenderer
      type={props.item.type}
      vin={props.vin}
      data={props.item.data}
      value={fieldValue}
      handleChange={handleChange}
      // passing RenderSubItems prevents an import cycle
      RenderSubItems={Items}
    />
  );
};

type ItemsProps = {
  vin: Vin;
  items: TileItem[];
  secondary?: boolean;
};

const Items = (props: ItemsProps) => (
  <Box sx={props.secondary ? { paddingTop: 2 } : {}}>
    {props.items.map((item) => (
      <Item key={item.field} vin={props.vin} item={item} />
    ))}
  </Box>
);

export default Items;
