const TEMP_MIN = -40;
const TEMP_MAX = 70;

const climate = {
  title: 'Climate',
  items: [
    {
      title: 'Interior Temperature',
      type: 'slider',
      data: {
        min: TEMP_MIN,
        max: TEMP_MAX,
        // vehicle reports temperature in Celsius
        // TODO: add support for Fahrenheit in this UI
        unit: '°C',
        step: 1,
      },
      defaultValue: 21,
      field: 'InsideTemp',
      fieldType: 'floatValue',
    },
    {
      title: 'Outside Temperature',
      type: 'slider',
      data: {
        min: TEMP_MIN,
        max: TEMP_MAX,
        unit: '°C',
        step: 1,
      },
      defaultValue: 21,
      field: 'OutsideTemp',
      fieldType: 'floatValue',
    },

    {
      title: 'Auto Seat Climate Left',
      type: 'button-group',
      data: {
        items: [
          { title: 'Off', value: 'false' },
          { title: 'On', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'AutoSeatClimateLeft',
      fieldType: 'stringValue',
    },
    {
      title: 'Auto Seat Climate Right',
      type: 'button-group',
      data: {
        items: [
          { title: 'Off', value: 'false' },
          { title: 'On', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'AutoSeatClimateRight',
      fieldType: 'stringValue',
    },
  ],
};

export default climate;
