import { getLotData } from "@/services/processDataService";
import type { LotData } from "@/types/process";
import { useQuery } from "@tanstack/react-query";

/** 선택된 Lot의 공정 데이터를 조회하는 훅 */
export function useProcessData(lotId: string | null) {
	return useQuery<LotData | undefined>({
		queryKey: ["processData", lotId],
		queryFn: () => {
			if (!lotId) return undefined;
			return getLotData(lotId);
		},
		enabled: lotId !== null,
	});
}
