import { getEquipmentList } from "@/services/processDataService";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ChangeEvent } from "react";
import { useCallback, useMemo } from "react";

const equipmentList = getEquipmentList();

export function ChamberSelector() {
	const selectedEquipmentId = useDashboardStore((s) => s.selectedEquipmentId);
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const setSelectedChamber = useDashboardStore((s) => s.setSelectedChamber);

	const chambers = useMemo(() => {
		if (!selectedEquipmentId) return [];
		const equip = equipmentList.find((e) => e.equipmentId === selectedEquipmentId);
		return equip?.chambers ?? [];
	}, [selectedEquipmentId]);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setSelectedChamber(e.target.value || null);
		},
		[setSelectedChamber],
	);

	return (
		<select
			value={selectedChamberId ?? ""}
			onChange={handleChange}
			disabled={chambers.length === 0}
			className="rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none disabled:opacity-50"
			aria-label="챔버 선택"
		>
			<option value="">전체 챔버</option>
			{chambers.map((ch) => (
				<option key={ch.chamberId} value={ch.chamberId}>
					{ch.name}
				</option>
			))}
		</select>
	);
}
