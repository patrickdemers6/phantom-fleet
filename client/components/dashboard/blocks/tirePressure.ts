const tirePressure = {
  title: 'Tire Pressure',
  items: [
    {
      type: 'vehicle-text-input',
      fields: ['TpmsPressureLF', 'TpmsPressureRF', 'TpmsPressureLR', 'TpmsPressureRR'],
      fieldType: 'intValue',
      defaultValue: 42,
      data: {
        unit: 'psi',
        formType: 'number',
      },
    },
  ],
};

export default tirePressure;
