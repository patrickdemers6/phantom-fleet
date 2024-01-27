import LocalStorage from '@/context/localStorage';

const sampleData = {
  fleetData: { vin: { data: {}, key: 'key', cert: 'cert' } },
  serverData: { host: 'host', port: 'port' },
};

describe('localStorage context', () => {
  describe('loadData', () => {
    it('loads existing data from localStorage', async () => {
      localStorage.setItem('appData', JSON.stringify(sampleData));
      expect(await LocalStorage.loadData()).toStrictEqual(sampleData);
    });

    it('returns default data if no data in localStorage', async () => {
      expect(await LocalStorage.loadData()).toStrictEqual({
        fleetData: {},
        serverData: { host: '', port: '' },
      });
    });
  });

  describe('saveData', () => {
    it('saves data to localStorage', async () => {
      await LocalStorage.saveData(sampleData.fleetData, sampleData.serverData);
      const fromLocalStorage = localStorage.getItem('appData');
      expect(fromLocalStorage).not.toBeNull();
      expect(JSON.parse(fromLocalStorage || '')).toStrictEqual(sampleData);
    });
  });
});
