import {
  createContext, useContext, useMemo, useState,
} from 'react';
import { useApp } from '@/context/ApplicationProvider';
import { VehicleFormData } from './Form';
import VehicleModal from './Modal';

const noop = () => {};

type OnSubmitFn = (v: VehicleFormData) => void;

interface ModalContextProps {
  isModalOpen: boolean;
  editVehicle: (vehicleData: VehicleFormData, onSubmit?: OnSubmitFn) => void;
  newVehicle: (onSubmit?: OnSubmitFn) => void;
  closeVehicle: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

type VehicleModalProviderProps = {
  children: React.ReactNode;
};

export function VehicleModalProvider({ children }: VehicleModalProviderProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialData, setModalData] = useState<VehicleFormData | null>(null);
  const [submitFn, setSubmitFn] = useState<(v: VehicleFormData) => void>(
    () => null);
  const fleet = useApp();
  const editVehicle = (vehicleData: VehicleFormData, onSubmit?: OnSubmitFn) => {
    setModalOpen(true);
    setModalData(vehicleData);
    setSubmitFn(() => onSubmit ?? noop);
  };

  const newVehicle = (onSubmit?: OnSubmitFn) => {
    setModalOpen(true);
    setModalData(null);
    setSubmitFn(() => onSubmit ?? noop);
  };

  const closeVehicle = () => {
    setModalOpen(false);
    setModalData(null);
  };
  const onSubmit = (data: VehicleFormData) => {
    if (initialData?.vin !== data.vin) fleet.changeVin(initialData?.vin as string, data.vin);
    if (initialData?.key !== data.key) fleet.setKey(data.vin, data.key);
    if (initialData?.cert !== data.cert) fleet.setCert(data.vin, data.cert);
    submitFn(data);
    closeVehicle();
  };

  return (
    <ModalContext.Provider
      value={useMemo(
        () => ({
          isModalOpen,
          editVehicle,
          newVehicle,
          closeVehicle,
        }),
        [isModalOpen],
      )}
    >
      <VehicleModal
        open={isModalOpen}
        onClose={closeVehicle}
        onSubmit={onSubmit}
        vehicle={initialData}
      />
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
