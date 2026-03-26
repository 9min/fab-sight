import { MOCK_EQUIPMENT } from "@/mocks/equipment";
import { create } from "zustand";

export type XAxisMode = "wallClock" | "elapsed";
export type ActiveView = "timeSeries" | "lotTrend";

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
	activeView: ActiveView;
	/** Lot 트렌딩 뷰에서 분석할 단일 센서 */
	trendSensorKey: string;
	/** Lot 트렌딩 뷰에서 분석할 레시피 스텝 ID */
	trendStepId: string | null;
	isSidebarOpen: boolean;

	setActiveView: (view: ActiveView) => void;
	setTrendSensorKey: (key: string) => void;
	setTrendStepId: (stepId: string | null) => void;
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
	toggleSidebar: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
	selectedEquipmentId: "equip-cvd-01",
	selectedChamberId: "cvd01-ch-a",
	selectedLotId: null,
	selectedWaferId: null,
	selectedSensors: ["temperature", "pressure", "rfPower"],
	isCompareMode: false,
	isWaferCompareMode: false,
	showAnomalyOverlay: true,
	showSpecLimits: false,
	xAxisMode: "wallClock",
	selectedTimestamp: null,
	activeView: "timeSeries",
	trendSensorKey: "temperature",
	trendStepId: null,
	isSidebarOpen: false,

	setActiveView: (view) => set({ activeView: view }),
	setTrendSensorKey: (key) => set({ trendSensorKey: key }),
	setTrendStepId: (stepId) => set({ trendStepId: stepId }),
	setSelectedEquipment: (equipmentId) => {
		const equip = MOCK_EQUIPMENT.find((e) => e.equipmentId === equipmentId);
		const firstChamberId = equip?.chambers[0]?.chamberId ?? null;
		set({
			selectedEquipmentId: equipmentId,
			selectedChamberId: firstChamberId,
			selectedLotId: null,
			selectedWaferId: null,
		});
	},
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
	toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
