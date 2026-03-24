import { MOCK_EQUIPMENT } from "@/mocks/equipment";
import { MOCK_LOTS_V3 } from "@/mocks/mockLotsV3";
import type { Equipment, LotDataV3, WaferRun } from "@/types/fab";

/** lotId로 공정 데이터를 조회한다 (v0.3) */
export function getLotDataV3(lotId: string): LotDataV3 | undefined {
	return MOCK_LOTS_V3.find((lot) => lot.lotId === lotId);
}

/** lotId와 waferId로 Wafer 데이터를 조회한다 */
export function getWaferData(lotId: string, waferId: string): WaferRun | undefined {
	const lot = getLotDataV3(lotId);
	if (!lot) return undefined;
	return lot.wafers.find((w) => w.waferId === waferId);
}

/** Golden Lot 데이터를 조회한다 (v0.3) */
export function getGoldenLotDataV3(): LotDataV3 | undefined {
	return MOCK_LOTS_V3.find((lot) => lot.isGoldenLot);
}

/** 장비 목록을 반환한다 */
export function getEquipmentList(): Equipment[] {
	return MOCK_EQUIPMENT;
}

/** 챔버 기준으로 Lot 목록을 필터링한다 */
export function getLotsByChamber(chamberId: string): LotDataV3[] {
	return MOCK_LOTS_V3.filter((lot) => lot.chamberId === chamberId);
}
