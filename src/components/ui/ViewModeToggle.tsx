import { type ActiveView, useDashboardStore } from "@/stores/useDashboardStore";
import { SegmentedControl } from "./SegmentedControl";

const VIEW_OPTIONS: { value: ActiveView; label: string }[] = [
	{ value: "timeSeries", label: "시계열 분석" },
	{ value: "lotTrend", label: "Lot 트렌딩" },
];

export function ViewModeToggle() {
	const activeView = useDashboardStore((s) => s.activeView);
	const setActiveView = useDashboardStore((s) => s.setActiveView);

	return (
		<SegmentedControl
			value={activeView}
			onChange={setActiveView}
			options={VIEW_OPTIONS}
			ariaLabel="분석 뷰 모드"
		/>
	);
}
