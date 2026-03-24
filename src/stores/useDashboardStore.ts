import { create } from "zustand";

export type XAxisMode = "wallClock" | "elapsed";

interface DashboardState {
	selectedEquipmentId: string | null;
	selectedChamberId: string | null;
	selectedLotId: string | null;
	selectedWaferId: string | null;
	selectedSensors: string[];
	isCompareMode: boolean;
	isWaferCompareMode: boolean;
	showAnomalyOverlay: boolean;
	showSpecLimits: boolean;
	xAxisMode: XAxisMode;
	selectedTimestamp: string | null;

	setSelectedEquipment: (equipmentId: string | null) => void;
	setSelectedChamber: (chamberId: string | null) => void;
	setSelectedLot: (lotId: string) => void;
	setSelectedWafer: (waferId: string | null) => void;
	setSelectedSensors: (sensors: string[]) => void;
	toggleCompareMode: () => void;
	toggleWaferCompareMode: () => void;
	toggleAnomalyOverlay: () => void;
	toggleSpecLimits: () => void;
	setXAxisMode: (mode: XAxisMode) => void;
	setSelectedTimestamp: (timestamp: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
	selectedEquipmentId: null,
	selectedChamberId: null,
	selectedLotId: null,
	selectedWaferId: null,
	selectedSensors: ["temperature", "pressure", "rfPower"],
	isCompareMode: false,
	isWaferCompareMode: false,
	showAnomalyOverlay: true,
	showSpecLimits: false,
	xAxisMode: "wallClock",
	selectedTimestamp: null,

	setSelectedEquipment: (equipmentId) =>
		set({
			selectedEquipmentId: equipmentId,
			selectedChamberId: null,
			selectedLotId: null,
			selectedWaferId: null,
		}),
	setSelectedChamber: (chamberId) =>
		set({ selectedChamberId: chamberId, selectedLotId: null, selectedWaferId: null }),
	setSelectedLot: (lotId) =>
		set({ selectedLotId: lotId, selectedWaferId: null, selectedTimestamp: null }),
	setSelectedWafer: (waferId) => set({ selectedWaferId: waferId, selectedTimestamp: null }),
	setSelectedSensors: (sensors) => set({ selectedSensors: sensors }),
	toggleCompareMode: () => set((state) => ({ isCompareMode: !state.isCompareMode })),
	toggleWaferCompareMode: () => set((state) => ({ isWaferCompareMode: !state.isWaferCompareMode })),
	toggleAnomalyOverlay: () => set((state) => ({ showAnomalyOverlay: !state.showAnomalyOverlay })),
	toggleSpecLimits: () => set((state) => ({ showSpecLimits: !state.showSpecLimits })),
	setXAxisMode: (mode) => set({ xAxisMode: mode }),
	setSelectedTimestamp: (timestamp) => set({ selectedTimestamp: timestamp }),
}));
