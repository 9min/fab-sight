import { useDashboardStore } from "@/stores/useDashboardStore";
import { useCallback } from "react";

export function AnomalyToggle() {
	const showAnomalyOverlay = useDashboardStore((s) => s.showAnomalyOverlay);
	const toggleAnomalyOverlay = useDashboardStore((s) => s.toggleAnomalyOverlay);

	const handleClick = useCallback(() => {
		toggleAnomalyOverlay();
	}, [toggleAnomalyOverlay]);

	return (
		<div className="flex items-center justify-between">
			<span className="text-sm text-slate-300">이상 탐지 표시</span>
			<button
				type="button"
				role="switch"
				aria-checked={showAnomalyOverlay}
				onClick={handleClick}
				className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
					showAnomalyOverlay ? "bg-blue-500" : "bg-slate-600"
				}`}
			>
				<span
					className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
						showAnomalyOverlay ? "translate-x-4" : "translate-x-0"
					}`}
				/>
			</button>
		</div>
	);
}
