const windowDropdown = {
  type: 'dropdown',
  fieldType: 'stringValue',
  defaultValue: 'Closed',
  data: {
    renderer: 'dropdown',
    menuItems: [
      { name: 'Closed', shortName: 'C', value: 'Closed' },
      { name: 'Opened', shortName: 'O', value: 'Opened' },
      { name: 'Partial', shortName: 'P', value: 'PartiallyOpen' },
    ],
  },
};

const window = {
  title: 'Windows',
  items: [
    {
      type: 'vehicle',
      fieldType: 'stringValue',
      defaultValue: 'Closed',
      data: {
        positional: {
          driverFront: { field: 'FdWindow', ...windowDropdown },
          driverRear: { field: 'FpWindow', ...windowDropdown },
          passengerFront: { field: 'RdWindow', ...windowDropdown },
          passengerRear: { field: 'RpWindow', ...windowDropdown },
        },
      },
    },
  ],
};

export default window;
