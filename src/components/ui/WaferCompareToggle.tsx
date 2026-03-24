import { useDashboardStore } from "@/stores/useDashboardStore";

export function WaferCompareToggle() {
	const isWaferCompareMode = useDashboardStore((s) => s.isWaferCompareMode);
	const toggleWaferCompareMode = useDashboardStore((s) => s.toggleWaferCompareMode);

	return (
		<button
			type="button"
			onClick={toggleWaferCompareMode}
			className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
				isWaferCompareMode
					? "bg-blue-500/20 text-blue-400"
					: "bg-slate-700 text-slate-400 hover:text-slate-300"
			}`}
			aria-label="W2W 비교"
		>
			<span
				className={`h-2 w-2 rounded-full ${isWaferCompareMode ? "bg-blue-400" : "bg-slate-500"}`}
			/>
			W2W 비교
		</button>
	);
}
