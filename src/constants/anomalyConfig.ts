import type { AnomalyType } from "@/types/fab";

/** 이상 유형별 마커 설정 */
export interface AnomalyMarker {
	symbol: string;
	color: string;
	label: string;
}

/** 이상 유형별 마커 매핑 (design-guide.md 기준) */
export const ANOMALY_MARKERS: Record<AnomalyType, AnomalyMarker> = {
	drift: { symbol: "triangle", color: "#F59E0B", label: "Drift" },
	spike: { symbol: "pin", color: "#DC2626", label: "Spike" },
	shift: { symbol: "rect", color: "#8B5CF6", label: "Shift" },
	oscillation: { symbol: "diamond", color: "#06B6D4", label: "Oscillation" },
	out_of_range: { symbol: "circle", color: "#DC2626", label: "Out-of-Range" },
	pattern: { symbol: "arrow", color: "#6366F1", label: "Pattern" },
};
