import type { ReactNode } from "react";

interface SidebarProps {
	children?: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
	return (
		<aside className="flex w-[280px] shrink-0 flex-col gap-6 overflow-y-auto border-r border-slate-700 bg-slate-800 p-4">
			{children}
		</aside>
	);
}
