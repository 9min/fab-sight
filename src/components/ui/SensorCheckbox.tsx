import { useDashboardStore } from "@/stores/useDashboardStore";
import type { SensorMeta } from "@/types/process";
import { useCallback } from "react";

interface SensorCheckboxGroupProps {
	sensorsMeta: SensorMeta[];
}

export function SensorCheckboxGroup({ sensorsMeta }: SensorCheckboxGroupProps) {
	const selectedSensors = useDashboardStore((s) => s.selectedSensors);
	const setSelectedSensors = useDashboardStore((s) => s.setSelectedSensors);

	const handleToggle = useCallback(
		(sensorKey: string) => {
			if (selectedSensors.includes(sensorKey)) {
				setSelectedSensors(selectedSensors.filter((s) => s !== sensorKey));
			} else {
				setSelectedSensors([...selectedSensors, sensorKey]);
			}
		},
		[selectedSensors, setSelectedSensors],
	);

	return (
		<div className="flex flex-col gap-2">
			{sensorsMeta.map((meta) => {
				const checked = selectedSensors.includes(meta.key);
				return (
					<label
						key={meta.key}
						className="flex cursor-pointer items-center gap-2 text-sm text-slate-300"
					>
						<input
							type="checkbox"
							checked={checked}
							onChange={() => handleToggle(meta.key)}
							className="sr-only"
							aria-label={meta.label}
						/>
						<span
							className={`flex h-4 w-4 items-center justify-center rounded border ${
								checked ? "border-transparent" : "border-slate-500"
							}`}
							style={{ backgroundColor: checked ? meta.color : "transparent" }}
						>
							{checked && (
								<svg
									className="h-3 w-3 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={3}
									aria-hidden="true"
								>
									<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
								</svg>
							)}
						</span>
						<span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
						<span>{meta.label}</span>
					</label>
				);
			})}
		</div>
	);
}
