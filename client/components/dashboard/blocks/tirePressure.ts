const tirePressure = {
  title: 'Tire Pressure',
  items: [
    {
      type: 'vehicle',
      fields: ['TpmsPressureLF', 'TpmsPressureRF', 'TpmsPressureLR', 'TpmsPressureRR'],
      fieldType: 'floatValue',
      defaultValue: 42,
      data: {
        rendererData: {
          unit: 'psi',
          formType: 'number',
        },
        renderer: 'text-input',
      },
    },
  ],
};

export default tirePressure;
