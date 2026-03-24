import { MOCK_LOTS } from "@/mocks/mockLots";
import type { LotData } from "@/types/process";

/** lotId로 공정 데이터를 조회한다 (현재 Mock, v1.0에서 Supabase로 교체) */
export function getLotData(lotId: string): LotData | undefined {
	return MOCK_LOTS.find((lot) => lot.lotId === lotId);
}
