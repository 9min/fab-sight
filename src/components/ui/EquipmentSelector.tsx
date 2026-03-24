import { getEquipmentList } from "@/services/processDataService";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ChangeEvent } from "react";
import { useCallback } from "react";

const equipmentList = getEquipmentList();

export function EquipmentSelector() {
	const selectedEquipmentId = useDashboardStore((s) => s.selectedEquipmentId);
	const setSelectedEquipment = useDashboardStore((s) => s.setSelectedEquipment);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLSelectElement>) => {
			setSelectedEquipment(e.target.value || null);
		},
		[setSelectedEquipment],
	);

	return (
		<select
			value={selectedEquipmentId ?? ""}
			onChange={handleChange}
			className="rounded border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
			aria-label="장비 선택"
		>
			<option value="">전체 장비</option>
			{equipmentList.map((equip) => (
				<option key={equip.equipmentId} value={equip.equipmentId}>
					{equip.name} ({equip.type})
				</option>
			))}
		</select>
	);
}
