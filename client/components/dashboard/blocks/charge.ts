const chargeStates: FieldOption[] = [
  { name: 'Disconnected', shortName: 'Disconnected', value: 1 },
  {
    name: 'Charging',
    shortName: 'Charging',
    value: 4,
    items: [
      {
        title: 'Amps',
        type: 'slider',
        data: {
          min: 0,
          max: 1000,
          unit: 'A',
        },
        defaultValue: 28,
        fields: ['ChargeAmps'],
        fieldType: 'intValue',
      },
    ],
  },
  { name: 'Complete', shortName: 'Complete', value: 5 },
  { name: 'Starting', shortName: 'Starting', value: 3 },
  { name: 'Stopped', shortName: 'Stopped', value: 6 },
  { name: 'No Power', shortName: 'No Power', value: 2 },
  { name: 'Unknown', shortName: 'Unknown', value: 0 },
];

const charge = {
  title: 'Charge State',
  items: [
    {
      type: 'dropdown',
      data: {
        menuItems: chargeStates,
      },
      fields: ['ChargeState'],
      fieldType: 'chargeState',
      defaultValue: 0,
    },
  ],
};

export default charge;
