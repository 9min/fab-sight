import { useDashboardStore } from "@/stores/useDashboardStore";

export function SpecLimitToggle() {
	const showSpecLimits = useDashboardStore((s) => s.showSpecLimits);
	const toggleSpecLimits = useDashboardStore((s) => s.toggleSpecLimits);

	return (
		<button
			type="button"
			onClick={toggleSpecLimits}
			className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
				showSpecLimits
					? "bg-blue-500/20 text-blue-400"
					: "bg-slate-700 text-slate-400 hover:text-slate-300"
			}`}
			aria-label="Spec Limit 표시"
		>
			<span className={`h-2 w-2 rounded-full ${showSpecLimits ? "bg-blue-400" : "bg-slate-500"}`} />
			Spec Limit
		</button>
	);
}
