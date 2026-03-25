import { useDashboardStore } from "@/stores/useDashboardStore";
import type { ReactNode } from "react";
import { useCallback } from "react";

interface SidebarProps {
	children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
	const isSidebarOpen = useDashboardStore((s) => s.isSidebarOpen);
	const toggleSidebar = useDashboardStore((s) => s.toggleSidebar);

	const handleOverlayClick = useCallback(() => {
		toggleSidebar();
	}, [toggleSidebar]);

	return (
		<>
			{/* 모바일 오버레이 배경 */}
			{isSidebarOpen && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: 오버레이는 장식 요소이며 ESC 키 핸들러 불필요
				<div
					className="fixed inset-0 z-20 bg-black/30 lg:hidden"
					onClick={handleOverlayClick}
					aria-hidden="true"
				/>
			)}

			<aside
				className={`fixed top-14 bottom-0 z-30 flex w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-slate-700 bg-slate-800 p-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				{children}
			</aside>
		</>
	);
}
