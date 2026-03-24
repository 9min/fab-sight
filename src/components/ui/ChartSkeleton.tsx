export function ChartSkeleton() {
	return (
		<div className="flex h-full animate-pulse flex-col gap-4 p-6">
			<div className="h-4 w-1/3 rounded bg-slate-700" />
			<div className="flex-1 rounded bg-slate-700/50" />
			<div className="h-6 rounded bg-slate-700/30" />
		</div>
	);
}
