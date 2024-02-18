const chargeStates: FieldOption[] = [
  { name: 'Disconnected', shortName: 'Disconnected', value: 1 },
  {
    name: 'Charging',
    shortName: 'Charging',
    value: 4,
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
      field: 'chargeState',
      fieldType: 'chargeState',
      defaultValue: 0,
    },
  ],
};

export default charge;
