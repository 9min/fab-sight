import { MOCK_EQUIPMENT } from "@/mocks/equipment";
import { MOCK_LOTS_V3 } from "@/mocks/mockLotsV3";
import { MOCK_PROCESS_RESULTS, MOCK_R2R_ADJUSTMENTS } from "@/mocks/r2rData";
import type { Equipment, LotDataV3, ProcessResult, R2RAdjustment, WaferRun } from "@/types/fab";

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

/** 챔버 기준으로 Lot을 runNumber 순으로 반환한다 (R2R 트렌딩용) */
export function getLotTrendByChamber(chamberId: string): LotDataV3[] {
	return getLotsByChamber(chamberId).sort((a, b) => a.runNumber - b.runNumber);
}

/** 챔버 기준 R2R 조정값을 반환한다 */
export function getR2RAdjustments(chamberId: string): R2RAdjustment[] {
	const lotIds = new Set(getLotsByChamber(chamberId).map((l) => l.lotId));
	return MOCK_R2R_ADJUSTMENTS.filter((a) => lotIds.has(a.lotId));
}

/** 챔버 기준 공정 결과 메트릭을 반환한다 */
export function getProcessResults(chamberId: string): ProcessResult[] {
	const lotIds = new Set(getLotsByChamber(chamberId).map((l) => l.lotId));
	return MOCK_PROCESS_RESULTS.filter((r) => lotIds.has(r.lotId));
}
