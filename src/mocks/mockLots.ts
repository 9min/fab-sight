import type { LotData } from "@/types/process";
import { generateLotData } from "./generateProcessData";

/** 드롭다운용 Lot 요약 정보 */
export interface LotSummary {
	lotId: string;
	waferId: string;
	recipeName: string;
}

const LOT_CONFIGS = [
	{
		lotId: "LOT-GOLDEN-001",
		waferId: "WF-G01",
		recipeName: "CVD-STANDARD",
		anomalyRatio: 0.02,
	},
	{
		lotId: "LOT-20240301-A",
		waferId: "WF-A01",
		recipeName: "CVD-STANDARD",
		anomalyRatio: 0.08,
	},
	{
		lotId: "LOT-20240301-B",
		waferId: "WF-B03",
		recipeName: "ETCH-DEEP",
		anomalyRatio: 0.12,
	},
	{
		lotId: "LOT-20240302-A",
		waferId: "WF-A05",
		recipeName: "CVD-HIGHTEMP",
		anomalyRatio: 0.15,
	},
] as const;

const POINT_COUNT = 10000;

/** 미리 생성된 Mock Lot 데이터 */
export const MOCK_LOTS: LotData[] = LOT_CONFIGS.map((config) =>
	generateLotData({
		lotId: config.lotId,
		waferId: config.waferId,
		recipeName: config.recipeName,
		pointCount: POINT_COUNT,
		anomalyRatio: config.anomalyRatio,
	}),
);

/** 드롭다운용 Lot 요약 목록 */
export const MOCK_LOT_SUMMARIES: LotSummary[] = MOCK_LOTS.map((lot) => ({
	lotId: lot.lotId,
	waferId: lot.waferId,
	recipeName: lot.recipeName,
}));
