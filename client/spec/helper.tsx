import { SnackbarProvider } from '@/components/SnackbarContext';
import ApplicationProvider, { useApp } from '@/context/ApplicationProvider';
import { FleetData } from '@/context/types';
import { Dispatch, SetStateAction } from 'react';

function BlockWhileLoading({ children }: { children: React.ReactNode }) {
  const { isLoading } = useApp();
  return isLoading ? null : children;
}

const wrapContext = (
  children: React.ReactNode,
  saveData: (fleetData: FleetData) => Promise<void> = () => Promise.resolve(),
  state: FleetData = {},
) => {
  const loadData = async (cb: Dispatch<SetStateAction<FleetData>>) => {
    cb(state);
  };

  return (
    <ApplicationProvider
      contextProvider="mock"
      dataStore={{ loadData, saveData, deleteByVin: async () => {} }}
    >
      <SnackbarProvider>
        <BlockWhileLoading>{children}</BlockWhileLoading>
      </SnackbarProvider>
    </ApplicationProvider>
  );
};

export default wrapContext;
