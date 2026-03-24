import { useProcessData } from "@/hooks/useProcessData";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ChangeEvent } from "react";
import { useCallback } from "react";

export function WaferSelector() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const selectedWaferId = useDashboardStore((s) => s.selectedWaferId);
	const setSelectedWafer = useDashboardStore((s) => s.setSelectedWafer);
	const { data: lotData } = useProcessData(selectedLotId);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setSelectedWafer(e.target.value || null);
		},
		[setSelectedWafer],
	);

	const wafers = lotData?.wafers ?? [];

	return (
		<select
			value={selectedWaferId ?? ""}
			onChange={handleChange}
			disabled={wafers.length === 0}
			className="rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none disabled:opacity-50"
			aria-label="Wafer 선택"
		>
			<option value="" disabled>
				Wafer 선택...
			</option>
			{wafers.map((wafer) => (
				<option key={wafer.waferId} value={wafer.waferId}>
					Slot {wafer.slotNumber} ({wafer.waferId})
				</option>
			))}
		</select>
	);
}
