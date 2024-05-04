const tirePressure = {
  title: 'Tire Pressure',
  items: [
    {
      title: 'Value',
      type: 'vehicle',
      data: {
        positional: {
          driverFront: {
            type: 'text-input',
            field: 'TpmsPressureLF',
            fieldType: 'floatValue',
            defaultValue: 42,
            data: {
              renderer: 'text-input',
              unit: 'psi',
            },
          },
          driverRear: {
            type: 'text-input',
            field: 'TpmsPressureRl',
            fieldType: 'floatValue',
            defaultValue: 42,
            data: {
              renderer: 'text-input',
              unit: 'psi',
            },
          },
          passengerFront: {
            type: 'text-input',
            field: 'TpmsPressureRr',
            fieldType: 'floatValue',
            defaultValue: 42,
            data: {
              renderer: 'text-input',
              unit: 'psi',
            },
          },
          passengerRear: {
            type: 'text-input',
            field: 'TpmsPressureRr',
            fieldType: 'floatValue',
            defaultValue: 42,
            data: {
              renderer: 'text-input',
              unit: 'psi',
            },
          },
        },
      },
    },
    {
      title: 'Last Updated',
      type: 'vehicle',
      data: {
        positional: {
          driverFront: {
            type: 'date-time',
            field: 'TpmsLastSeenPressureTimeLf',
            fieldType: 'stringValue',
            defaultValue: 'Apr 20, 2024 12:00:00 AM',
            data: {
              type: 'date-time',
            },
          },
          driverRear: {
            type: 'date-time',
            field: 'TpmsLastSeenPressureTimeLr',
            fieldType: 'stringValue',
            defaultValue: 'Apr 20, 2024 12:00:00 AM',
            data: {
              renderer: 'text-input',
            },
          },
          passengerFront: {
            type: 'date-time',
            field: 'TpmsLastSeenPressureTimeRf',
            fieldType: 'stringValue',
            defaultValue: 'Apr 20, 2024 12:00:00 AM',
            data: {
              renderer: 'text-input',
            },
          },
          passengerRear: {
            type: 'date-time',
            field: 'TpmsLastSeenPressureTimeRr',
            fieldType: 'stringValue',
            defaultValue: 'Apr 20, 2024 12:00:00 AM',
            data: {
              renderer: 'text-input',
            },
          },
        },
      },
    },
  ],
};

export default tirePressure;
