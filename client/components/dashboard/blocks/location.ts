const location = {
  title: 'Location and Movement',
  items: [
    {
      title: 'Latitude',
      type: 'text-input',
      field: 'LocationLatitude',
      fieldType: 'floatValue',
      defaultValue: 37.7937,
      data: {
        formType: 'number',
        unit: '° N',
      },
    },
    {
      title: 'Longitude',
      type: 'text-input',
      field: 'LocationLongitude',
      fieldType: 'floatValue',
      defaultValue: 122.3965,
      data: {
        formType: 'number',
        unit: '° W',
      },
    },
    {
      title: 'Speed',
      type: 'slider',
      data: {
        min: 0,
        max: 120,
        unit: 'mph',
        step: 5,
      },
      defaultValue: 28,
      field: 'VehicleSpeed',
      fieldType: 'floatValue',
    },
  ],
};

export default location;
