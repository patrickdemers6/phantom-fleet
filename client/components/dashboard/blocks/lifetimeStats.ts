const lifetimeStats = {
  title: 'Lifetime Statistics',
  items: [
    {
      title: 'Energy Used',
      type: 'text-input',
      field: 'LifetimeEnergyUsed',
      fieldType: 'floatValue',
      defaultValue: 1024,
      data: {
        formType: 'number',
        unit: 'kWh',
      },
    }, {
      title: 'Energy Used in Drive',
      type: 'text-input',
      field: 'LifetimeEnergyUsedDrive',
      fieldType: 'floatValue',
      defaultValue: 1024,
      data: {
        formType: 'number',
        unit: 'kWh',
      },
    }, {
      title: 'Regenerative Breaking Energy Gain',
      type: 'text-input',
      field: 'LifetimeEnergyGainedRegen',
      fieldType: 'floatValue',
      defaultValue: 512,
      data: {
        formType: 'number',
        unit: 'kWh',
      },
    },
  ],
};

export default lifetimeStats;
