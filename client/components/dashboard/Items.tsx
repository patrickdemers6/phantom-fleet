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
  const { fields, fieldType } = props.item;

  const handleChange = (fieldName: string, value: unknown) => {
    const setFunctionName = `set${fieldType
      .charAt(0)
      .toUpperCase()}${fieldType.slice(1)}` as keyof typeof app;
    const changeFn = app[setFunctionName];
    if (!changeFn) {
      return;
    }
    // @ts-ignore next-line
    changeFn(props.vin, fieldName, value);
  };

  let internalFieldType = fieldType;
  if (fieldType === 'floatValue') internalFieldType = 'floatValueInternal';
  // @ts-ignore next-line
  const fieldValues = fields.map((field) => (field === null ? null : app.fleetData[props.vin]?.data?.[field]?.[internalFieldType]));

  useEffect(() => {
    fields.forEach((fieldName, i) => {
      if (typeof fieldValues[i] === 'undefined') {
        handleChange(fieldName, props.item.defaultValue);
      }
    });
  }, []);

  if (fieldValues.some((f) => typeof f === 'undefined')) return null;

  return (
    <GenericRenderer
      type={props.item.type}
      vin={props.vin}
      data={props.item.data}
      title={props.item.title}
      values={fieldValues}
      handleChangeFns={fields.map((field) => (value: unknown) => handleChange(field, value))}
      // prevent import cycle
      RenderSubItems={Items}
      GenericRenderer={GenericRenderer}
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
      <div style={{ paddingBottom: i === arr.length - 1 ? 0 : 16 }}>
        <Item key={item.fields[0]} vin={props.vin} item={item} />
      </div>
    ))}
  </Box>
);

export default Items;
