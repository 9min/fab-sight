import { useDashboardStore } from "@/stores/useDashboardStore";

export function XAxisModeToggle() {
	const xAxisMode = useDashboardStore((s) => s.xAxisMode);
	const setXAxisMode = useDashboardStore((s) => s.setXAxisMode);

	return (
		<div className="flex rounded border border-slate-600">
			<button
				type="button"
				onClick={() => setXAxisMode("wallClock")}
				className={`px-3 py-1 text-xs transition-colors ${
					xAxisMode === "wallClock"
						? "bg-blue-500/20 text-blue-400"
						: "text-slate-400 hover:text-slate-300"
				}`}
				aria-label="Wall Clock 모드"
			>
				시각
			</button>
			<button
				type="button"
				onClick={() => setXAxisMode("elapsed")}
				className={`border-l border-slate-600 px-3 py-1 text-xs transition-colors ${
					xAxisMode === "elapsed"
						? "bg-blue-500/20 text-blue-400"
						: "text-slate-400 hover:text-slate-300"
				}`}
				aria-label="Elapsed Time 모드"
			>
				경과 시간
			</button>
		</div>
	);
}
