'use client';

import { Box } from '@mui/material';
import { Vin } from '@/context/types';
import { useEffect } from 'react';
import { useApp } from '../../context/ApplicationProvider';
import GenericRenderer from './renderers';

export type ItemProps = {
  item: TileItem;
  vin: Vin;
};

export const Item = (props: ItemProps) => {
  const app = useApp();
  const { field, fieldType } = props.item;

  const handleChange = (value: unknown) => {
    const setFunctionName = `set${fieldType
      .charAt(0)
      .toUpperCase()}${fieldType.slice(1)}` as keyof typeof app;
    const changeFn = app[setFunctionName];
    if (!changeFn) {
      return;
    }
    // @ts-ignore next-line
    changeFn(props.vin, field, value);
  };

  let internalFieldType = fieldType;
  if (fieldType === 'floatValue') internalFieldType = 'floatValueInternal';
  // @ts-ignore next-line
  const fieldValue = (app.fleetData[props.vin]?.data?.[field]?.[internalFieldType]);

  useEffect(() => {
    if (field && typeof fieldValue === 'undefined') {
      handleChange(props.item.defaultValue);
    }
  }, []);

  if (typeof fieldValue === 'undefined' && field) return null;

  return (
    <GenericRenderer
      type={props.item.type}
      vin={props.vin}
      data={props.item.data}
      title={props.item.title}
      value={fieldValue}
      onChange={handleChange}
      // prevent import cycle
      RenderSubItems={Items}
      Item={Item}
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
    {props.items.map((item, i, arr) => (
      <div style={{ paddingBottom: i === arr.length - 1 ? 0 : 16 }} key={item.field || i}>
        <Item key={item.field} vin={props.vin} item={item} />
      </div>
    ))}
  </Box>
);

export default Items;
