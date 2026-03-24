import type { ReactNode } from "react";

interface MainContentProps {
	chartArea: ReactNode;
	drilldownArea: ReactNode;
}

export function MainContent({ chartArea, drilldownArea }: MainContentProps) {
	return (
		<main className="flex flex-1 flex-col overflow-hidden">
			<div className="flex-[6] overflow-hidden">{chartArea}</div>
			<div className="flex-[4] overflow-hidden border-t border-slate-700">{drilldownArea}</div>
		</main>
	);
}
