import type { ReactNode } from "react";

interface TopNavProps {
	children?: ReactNode;
}

export function TopNav({ children }: TopNavProps) {
	return (
		<nav className="flex h-14 items-center justify-between border-b border-slate-700 bg-slate-900 px-6">
			<div className="flex items-center gap-3">
				<h1 className="text-lg font-semibold text-slate-100">FabSight</h1>
				<span className="text-xs text-slate-500">AI 공정 분석 대시보드</span>
			</div>
			<div className="flex items-center gap-4">{children}</div>
		</nav>
	);
}
