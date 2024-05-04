const security = {
  title: 'Security',
  items: [
    {
      title: 'Door Locks',
      type: 'button-group',
      data: {
        items: [
          { title: 'Unlocked', value: 'false' },
          { title: 'Locked', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'Locked',
      fieldType: 'stringValue',
    },
    {
      title: 'Sentry Mode',
      type: 'button-group',
      data: {
        items: [
          { title: 'Off', value: 'false' },
          { title: 'On', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'SentryMode',
      fieldType: 'stringValue',
    },
    {
      title: 'Guest Mode',
      type: 'button-group',
      data: {
        items: [
          { title: 'Off', value: 'false' },
          { title: 'On', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'GuestModeEnabled',
      fieldType: 'stringValue',
    },
    {
      title: 'Pin to Drive',
      type: 'button-group',
      data: {
        items: [
          { title: 'Off', value: 'false' },
          { title: 'On', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'PinToDriveEnabled',
      fieldType: 'stringValue',
    },
    {
      title: 'Guest Mode Mobile Access',
      type: 'button-group',
      data: {
        items: [
          { title: 'Off', value: 'false' },
          { title: 'On', value: 'true' },
        ],
      },
      defaultValue: 'false',
      field: 'GuestModeMobileAccessState',
      fieldType: 'stringValue',
    },
    {
      title: 'Phone Key and Key Fob Count',
      type: 'slider',
      data: {
        min: 0,
        max: 20,
      },
      defaultValue: 0,
      field: 'PairedPhoneKeyAndKeyFobQty',
      fieldType: 'intValue',
    },
  ],
};

export default security;
