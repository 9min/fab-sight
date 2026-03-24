import { GOLDEN_LOT_ID } from "@/constants/lot";
import { MOCK_LOTS } from "@/mocks/mockLots";
import type { LotData } from "@/types/process";

/** lotId로 공정 데이터를 조회한다 (현재 Mock, v1.0에서 Supabase로 교체) */
export function getLotData(lotId: string): LotData | undefined {
	return MOCK_LOTS.find((lot) => lot.lotId === lotId);
}

/** Golden Lot 데이터를 조회한다 */
export function getGoldenLotData(): LotData | undefined {
	return getLotData(GOLDEN_LOT_ID);
}
