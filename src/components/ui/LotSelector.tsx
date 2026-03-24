import { MOCK_LOT_SUMMARIES_V3 } from "@/mocks/mockLotsV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ChangeEvent } from "react";
import { useCallback, useMemo } from "react";

export function LotSelector() {
	const selectedEquipmentId = useDashboardStore((s) => s.selectedEquipmentId);
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const setSelectedLot = useDashboardStore((s) => s.setSelectedLot);

	const filteredLots = useMemo(() => {
		let lots = MOCK_LOT_SUMMARIES_V3.filter((s) => !s.isGoldenLot);
		if (selectedChamberId) {
			lots = lots.filter((s) => s.chamberId === selectedChamberId);
		} else if (selectedEquipmentId) {
			lots = lots.filter((s) => s.equipmentId === selectedEquipmentId);
		}
		return lots;
	}, [selectedEquipmentId, selectedChamberId]);

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
			{filteredLots.map((summary) => (
				<option key={summary.lotId} value={summary.lotId}>
					{summary.lotId} ({summary.recipeName})
				</option>
			))}
		</select>
	);
}
