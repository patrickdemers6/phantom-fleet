import ApplicationProvider, { useApp } from '@/context/ApplicationProvider';
import { InitialState } from '@/context/types';

function BlockWhileLoading({ children }: { children: React.ReactNode }) {
  const { isLoading } = useApp();
  return isLoading ? null : children;
}

const wrapContext = (
  children: React.ReactNode,
  saveData: (fleetData: any, serverData: any) => Promise<void> = () => Promise.resolve(),
  state: Partial<InitialState> = {},
) => {
  const defaultState = {
    fleetData: {},
    serverData: { host: '', port: '' },
    loading: false,
  };
  const loadData = async () => ({ ...defaultState, ...state });

  return (
    <ApplicationProvider
      contextProvider="mock"
      dataStore={{ loadData, saveData }}
    >
      <BlockWhileLoading>{children}</BlockWhileLoading>
    </ApplicationProvider>
  );
};

export default wrapContext;
