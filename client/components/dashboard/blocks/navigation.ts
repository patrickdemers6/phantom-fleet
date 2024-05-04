const navigation = {
  title: 'Navigation',
  items: [
    {
      title: 'Distance to Arrival',
      type: 'text-input',
      field: 'MilesToArrival',
      fieldType: 'floatValue',
      defaultValue: 5,
      data: {
        formType: 'number',
        unit: 'miles',
      },
    },
    {
      title: 'Time to Arrival',
      type: 'text-input',
      field: 'MinutesToArrival',
      fieldType: 'floatValue',
      defaultValue: 12,
      data: {
        formType: 'number',
        unit: 'minutes',
      },
    },
    {
      title: 'Origin',
      type: 'text-input',
      field: 'OriginLocation',
      fieldType: 'stringValue',
      defaultValue: '123 Main Street',
      data: {
        formType: 'text',
      },
    },
    {
      title: 'Destination',
      type: 'text-input',
      field: 'DestinationLocation',
      fieldType: 'stringValue',
      defaultValue: '456 Lombard Street',
      data: {
        formType: 'text',
      },
    },
  ],
};

export default navigation;
