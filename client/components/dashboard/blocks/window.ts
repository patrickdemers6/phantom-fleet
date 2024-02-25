const window = {
  title: 'Windows',
  items: [
    {
      type: 'vehicle',
      fields: ['FdWindow', 'FpWindow', 'RdWindow', 'RpWindow'],
      fieldType: 'stringValue',
      defaultValue: 'Closed',
      data: {
        rendererData: {
          menuItems: [
            { name: 'Closed', shortName: 'C', value: 'Closed' },
            { name: 'Opened', shortName: 'O', value: 'Opened' },
            { name: 'Partial', shortName: 'P', value: 'PartiallyOpen' },
          ],
        },
        renderer: 'dropdown',
      },
    },
  ],
};

export default window;
