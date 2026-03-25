import type { ReactNode } from "react";

interface ToggleButtonBaseProps {
	isActive: boolean;
	onClick: () => void;
	label: string;
	children?: ReactNode;
}

interface SwitchToggleProps extends ToggleButtonBaseProps {
	variant: "switch";
}

interface PillToggleProps extends ToggleButtonBaseProps {
	variant: "pill";
}

type ToggleButtonProps = SwitchToggleProps | PillToggleProps;

/** 공통 토글 프리미티브. switch(iOS 스타일 온/오프) 또는 pill(인디케이터 닷 버튼) 변형 지원. */
export function ToggleButton({ variant, isActive, onClick, label, children }: ToggleButtonProps) {
	if (variant === "switch") {
		return (
			<div className="flex items-center justify-between">
				<span className="flex items-center gap-1 text-sm text-slate-300">
					{label}
					{children}
				</span>
				<button
					type="button"
					role="switch"
					aria-checked={isActive}
					onClick={onClick}
					className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
						isActive ? "bg-blue-500" : "bg-slate-600"
					}`}
				>
					<span
						className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
							isActive ? "translate-x-5" : "translate-x-0"
						}`}
					/>
				</button>
			</div>
		);
	}

	// variant === "pill"
	return (
		<button
			type="button"
			aria-pressed={isActive}
			onClick={onClick}
			className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
				isActive
					? "bg-blue-500/20 text-blue-400"
					: "bg-slate-700 text-slate-400 hover:text-slate-300"
			}`}
		>
			<span
				data-testid="indicator-dot"
				className={`h-2 w-2 rounded-full ${isActive ? "bg-blue-400" : "bg-slate-500"}`}
			/>
			<span className="flex items-center gap-1">
				{label}
				{children}
			</span>
		</button>
	);
}
