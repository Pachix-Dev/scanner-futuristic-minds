import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useScanner = create(
    persist(
        (set) => ({
            action: '',
            lastRecord: {},

            setAction: (action) => set({ action }),
            setLastRecord: (lastRecord) => set({lastRecord})
        }),
        {
            name: 'scanner',
        }
    )
);
export default useScanner;
