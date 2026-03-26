import { MenuIcon } from "@/components/icons";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ReactNode } from "react";
import { useCallback } from "react";

interface TopNavProps {
	children?: ReactNode;
}

export function TopNav({ children }: TopNavProps) {
	const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);

	const handleMenuClick = useCallback(() => {
		toggleSidebar();
	}, [toggleSidebar]);

	return (
		<nav className="flex h-14 items-center border-b border-slate-700 bg-slate-900 px-4 lg:px-6">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={handleMenuClick}
					aria-label="사이드바 토글"
					className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-100 lg:hidden"
				>
					<MenuIcon className="h-5 w-5" />
				</button>
				<h1 className="text-lg font-semibold text-slate-100">FabSight</h1>
				<span className="hidden text-xs text-slate-500 sm:inline">AI 공정 분석 대시보드</span>
			</div>
			<div className="mx-4 hidden border-l border-slate-700 pl-4 sm:block">
				<ViewModeToggle />
			</div>
			<div className="ml-auto flex items-center gap-2 overflow-x-auto lg:gap-3">{children}</div>
		</nav>
	);
}
