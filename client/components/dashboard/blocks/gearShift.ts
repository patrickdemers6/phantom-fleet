const primary: FieldOption[] = [
  { name: 'Park', shortName: 'P', value: 2 },
  { name: 'Reverse', shortName: 'R', value: 3 },
  { name: 'Drive', shortName: 'D', value: 4 },
];

const secondary: FieldOption[] = [
  { name: 'Neutral', shortName: 'N', value: 5 },
  { name: 'Unknown', shortName: 'U', value: 0 },
  { name: 'Invalid', shortName: 'I', value: 1 },
  { name: 'SNA', shortName: 'S', value: 6 },
];

const gearShift = {
  title: 'Gear Shift',
  items: [
    {
      type: 'circleselect',
      data: {
        primary, secondary,
      },
      fields: ['Gear'],
      fieldType: 'shiftState',
      defaultValue: 0,
    },
  ],
};

export default gearShift;
