import type { ReactNode } from "react";
import { MainContent } from "./MainContent";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";

interface DashboardLayoutProps {
	navControls?: ReactNode;
	sidebarContent?: ReactNode;
	chartArea: ReactNode;
	drilldownArea: ReactNode;
}

export function DashboardLayout({
	navControls,
	sidebarContent,
	chartArea,
	drilldownArea,
}: DashboardLayoutProps) {
	return (
		<div className="flex h-screen flex-col bg-slate-900 text-slate-100">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
			>
				본문으로 건너뛰기
			</a>
			<TopNav>{navControls}</TopNav>
			<div className="flex flex-1 overflow-hidden">
				<Sidebar>{sidebarContent}</Sidebar>
				<MainContent chartArea={chartArea} drilldownArea={drilldownArea} />
			</div>
		</div>
	);
}
