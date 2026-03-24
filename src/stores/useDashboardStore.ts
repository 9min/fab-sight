import type { SensorType } from "@/types/process";
import { create } from "zustand";

interface DashboardState {
	selectedLotId: string | null;
	selectedWaferId: string | null;
	selectedSensors: SensorType[];
	isCompareMode: boolean;
	showAnomalyOverlay: boolean;
	dateRange: { start: string; end: string } | null;
	selectedTimestamp: string | null;

	setSelectedLot: (lotId: string, waferId: string) => void;
	setSelectedSensors: (sensors: SensorType[]) => void;
	toggleCompareMode: () => void;
	toggleAnomalyOverlay: () => void;
	setDateRange: (range: { start: string; end: string } | null) => void;
	setSelectedTimestamp: (timestamp: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
	selectedLotId: null,
	selectedWaferId: null,
	selectedSensors: ["temperature", "pressure", "rfPower"],
	isCompareMode: false,
	showAnomalyOverlay: true,
	dateRange: null,
	selectedTimestamp: null,

	setSelectedLot: (lotId, waferId) => set({ selectedLotId: lotId, selectedWaferId: waferId }),
	setSelectedSensors: (sensors) => set({ selectedSensors: sensors }),
	toggleCompareMode: () => set((state) => ({ isCompareMode: !state.isCompareMode })),
	toggleAnomalyOverlay: () => set((state) => ({ showAnomalyOverlay: !state.showAnomalyOverlay })),
	setDateRange: (range) => set({ dateRange: range }),
	setSelectedTimestamp: (timestamp) => set({ selectedTimestamp: timestamp }),
}));
