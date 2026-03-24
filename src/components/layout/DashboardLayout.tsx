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
			<TopNav>{navControls}</TopNav>
			<div className="flex flex-1 overflow-hidden">
				<Sidebar>{sidebarContent}</Sidebar>
				<MainContent chartArea={chartArea} drilldownArea={drilldownArea} />
			</div>
		</div>
	);
}
