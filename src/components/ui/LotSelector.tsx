import { MOCK_LOT_SUMMARIES_V3 } from "@/mocks/mockLotsV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ChangeEvent } from "react";
import { useCallback } from "react";

export function LotSelector() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const setSelectedLot = useDashboardStore((s) => s.setSelectedLot);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			const lotId = e.target.value;
			if (lotId) {
				setSelectedLot(lotId);
			}
		},
		[setSelectedLot],
	);

	return (
		<select
			value={selectedLotId ?? ""}
			onChange={handleChange}
			className="rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
			aria-label="Lot 선택"
		>
			<option value="" disabled>
				Lot 선택...
			</option>
			{MOCK_LOT_SUMMARIES_V3.filter((s) => !s.isGoldenLot).map((summary) => (
				<option key={summary.lotId} value={summary.lotId}>
					{summary.lotId} ({summary.recipeName})
				</option>
			))}
		</select>
	);
}
