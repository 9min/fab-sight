import { InfoIcon } from "@/components/icons";
import { getGlossaryTerm } from "@/constants/glossary";
import { useGlossaryStore } from "@/stores/useGlossaryStore";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const POPOVER_WIDTH = 240;
const POPOVER_GAP = 8;

interface InfoTooltipProps {
	termId: string;
}

interface PopoverPosition {
	top: number;
	left: number;
}

function calcPopoverPosition(iconRect: DOMRect): PopoverPosition {
	const spaceRight = window.innerWidth - iconRect.right;
	const spaceLeft = iconRect.left;
	const spaceBelow = window.innerHeight - iconRect.bottom;

	// 오른쪽에 충분한 공간이 있으면 오른쪽으로
	if (spaceRight >= POPOVER_WIDTH + POPOVER_GAP) {
		return {
			top: iconRect.top + iconRect.height / 2,
			left: iconRect.right + POPOVER_GAP,
		};
	}

	// 왼쪽에 충분한 공간이 있으면 왼쪽으로
	if (spaceLeft >= POPOVER_WIDTH + POPOVER_GAP) {
		return {
			top: iconRect.top + iconRect.height / 2,
			left: iconRect.left - POPOVER_WIDTH - POPOVER_GAP,
		};
	}

	// 아래쪽으로 (좌우 중앙 정렬, 화면 안에 clamp)
	const centeredLeft = iconRect.left + iconRect.width / 2 - POPOVER_WIDTH / 2;
	const clampedLeft = Math.max(8, Math.min(centeredLeft, window.innerWidth - POPOVER_WIDTH - 8));

	if (spaceBelow >= 120) {
		return {
			top: iconRect.bottom + POPOVER_GAP,
			left: clampedLeft,
		};
	}

	// 위쪽으로
	return {
		top: iconRect.top - POPOVER_GAP,
		left: clampedLeft,
	};
}

export const InfoTooltip = memo(function InfoTooltip({ termId }: InfoTooltipProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [popoverPos, setPopoverPos] = useState<PopoverPosition>({ top: 0, left: 0 });
	const iconRef = useRef<HTMLSpanElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const openDrawerWithTerm = useGlossaryStore((s) => s.openDrawerWithTerm);

	const term = getGlossaryTerm(termId);

	const handleToggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		setIsOpen((prev) => !prev);
	}, []);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.stopPropagation();
			e.preventDefault();
			setIsOpen((prev) => !prev);
		}
	}, []);

	const handleDetailClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			e.preventDefault();
			setIsOpen(false);
			openDrawerWithTerm(termId);
		},
		[termId, openDrawerWithTerm],
	);

	// 위치 계산
	useEffect(() => {
		if (!isOpen || !iconRef.current) return;
		const iconRect = iconRef.current.getBoundingClientRect();
		const pos = calcPopoverPosition(iconRect);
		setPopoverPos(pos);
	}, [isOpen]);

	// 외부 클릭 + ESC 닫기
	useEffect(() => {
		if (!isOpen) return;

		function handleClickOutside(e: MouseEvent) {
			const target = e.target as Node;
			if (
				iconRef.current &&
				!iconRef.current.contains(target) &&
				popoverRef.current &&
				!popoverRef.current.contains(target)
			) {
				setIsOpen(false);
			}
		}

		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen]);

	if (!term) return null;

	return (
		<>
			<span
				ref={iconRef}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				aria-label={`${term.term} 설명 보기`}
				className="inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-600 hover:text-slate-300"
			>
				<InfoIcon className="h-3.5 w-3.5" />
			</span>
			{isOpen &&
				createPortal(
					<div
						ref={popoverRef}
						role="tooltip"
						style={{
							position: "fixed",
							top: popoverPos.top,
							left: popoverPos.left,
							width: POPOVER_WIDTH,
						}}
						className="z-50 rounded-lg bg-slate-700 p-3 text-sm shadow-lg"
					>
						<div className="mb-1 font-medium text-slate-100">{term.term}</div>
						<p className="text-slate-300">{term.shortDescription}</p>
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: 팝오버 내 보조 액션 */}
						<span
							onClick={handleDetailClick}
							className="mt-2 block cursor-pointer text-xs text-blue-400 transition-colors hover:text-blue-300"
						>
							자세히 보기
						</span>
					</div>,
					document.body,
				)}
		</>
	);
});
