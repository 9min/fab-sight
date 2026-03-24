import { useDashboardStore } from "@/stores/useDashboardStore";
import { useCallback } from "react";

export function CompareToggle() {
	const isCompareMode = useDashboardStore((s) => s.isCompareMode);
	const toggleCompareMode = useDashboardStore((s) => s.toggleCompareMode);

	const handleClick = useCallback(() => {
		toggleCompareMode();
	}, [toggleCompareMode]);

	return (
		<button
			type="button"
			aria-pressed={isCompareMode}
			onClick={handleClick}
			className={`rounded px-3 py-1.5 text-sm transition-colors ${
				isCompareMode
					? "bg-slate-600 text-slate-100"
					: "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
			}`}
		>
			Golden Lot 비교
		</button>
	);
}
