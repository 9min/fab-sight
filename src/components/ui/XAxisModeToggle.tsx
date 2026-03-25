import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useDashboardStore } from "@/stores/useDashboardStore";

const X_AXIS_OPTIONS = [
	{ value: "wallClock" as const, label: "시각" },
	{ value: "elapsed" as const, label: "경과 시간" },
];

export function XAxisModeToggle() {
	const xAxisMode = useDashboardStore((s) => s.xAxisMode);
	const setXAxisMode = useDashboardStore((s) => s.setXAxisMode);

	return (
		<SegmentedControl
			value={xAxisMode}
			onChange={setXAxisMode}
			options={X_AXIS_OPTIONS}
			ariaLabel="X축 모드"
		/>
	);
}
