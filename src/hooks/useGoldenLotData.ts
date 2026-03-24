import { getGoldenLotData } from "@/services/processDataService";
import type { LotData } from "@/types/process";
import { useQuery } from "@tanstack/react-query";

/** Golden Lot 데이터를 조회하는 훅 (enabled가 true일 때만 조회) */
export function useGoldenLotData(enabled: boolean) {
	return useQuery<LotData | undefined>({
		queryKey: ["goldenLotData"],
		queryFn: () => getGoldenLotData(),
		enabled,
	});
}
