import { SiteConfig } from '@/app/data/config';
import { create } from 'zustand'

interface ICartStateProps {
    upSells: IUpSell[];
    totalPrice: number;
    setUpSells: (upSells: IUpSell[]) => void;
    addUpSell: (upSell: IUpSell) => void;
    removeUpSell: (upSell: IUpSell) => void;
    clearUpSells: () => void;
    calculateTotalPrice: () => number;
}

const calculatePrice = (upSells: IUpSell[]): number => {
    const upSellsTotal = upSells.reduce((total, upSell) => total + upSell.preco, 0);
    return SiteConfig.price_pack + upSellsTotal;
};

export const useStoreUpSells = create<ICartStateProps>((set, get) => ({
    upSells: [],
    totalPrice: SiteConfig.price_pack,
    setUpSells: (upSells: IUpSell[]) => {
        const totalPrice = calculatePrice(upSells);
        set({ upSells, totalPrice });
    },
    addUpSell: (upSell: IUpSell) => {
        const currentUpSells = get().upSells;
        const newUpSells = [...currentUpSells, upSell];
        const totalPrice = calculatePrice(newUpSells);
        set({ upSells: newUpSells, totalPrice });
    },
    removeUpSell: (upSell: IUpSell) => {
        const currentUpSells = get().upSells;
        const newUpSells = currentUpSells.filter((item) => item.id !== upSell.id);
        const totalPrice = calculatePrice(newUpSells);
        set({ upSells: newUpSells, totalPrice });
    },
    clearUpSells: () => {
        set({ upSells: [], totalPrice: SiteConfig.price_pack });
    },
    calculateTotalPrice: () => {
        const upSells = get().upSells;
        return calculatePrice(upSells);
    },
}))
