import type { GlossaryTerm } from "@/constants/glossary";
import { useGlossaryStore } from "@/stores/useGlossaryStore";
import { useCallback, useEffect, useRef, useState } from "react";

interface GlossaryCategoryProps {
	title: string;
	terms: GlossaryTerm[];
}

export function GlossaryCategory({ title, terms }: GlossaryCategoryProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const highlightTermId = useGlossaryStore((s) => s.highlightTermId);
	const setHighlightTermId = useGlossaryStore((s) => s.setHighlightTermId);
	const highlightRef = useRef<HTMLDivElement>(null);

	const toggle = useCallback(() => {
		setIsExpanded((prev) => !prev);
	}, []);

	const hasHighlightedTerm = terms.some((t) => t.id === highlightTermId);

	useEffect(() => {
		if (hasHighlightedTerm && !isExpanded) {
			setIsExpanded(true);
		}
	}, [hasHighlightedTerm, isExpanded]);

	useEffect(() => {
		if (highlightTermId && highlightRef.current) {
			highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
			const timer = setTimeout(() => {
				setHighlightTermId(null);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [highlightTermId, setHighlightTermId]);

	if (terms.length === 0) return null;

	return (
		<div>
			<button
				type="button"
				onClick={toggle}
				className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-300"
			>
				<span>
					{title} ({terms.length})
				</span>
				<span className={`transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}>
					&#9662;
				</span>
			</button>
			{isExpanded && (
				<div className="flex flex-col gap-1 pb-3">
					{terms.map((term) => {
						const isHighlighted = term.id === highlightTermId;
						return (
							<div
								key={term.id}
								ref={isHighlighted ? highlightRef : undefined}
								className={`rounded-lg p-3 transition-colors ${
									isHighlighted ? "bg-blue-500/20 ring-1 ring-blue-500/40" : "bg-slate-700/50"
								}`}
							>
								<div className="mb-1 text-sm font-medium text-slate-200">{term.term}</div>
								<p className="text-xs leading-relaxed text-slate-400">{term.fullDescription}</p>
								{term.relatedTerms && term.relatedTerms.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-1">
										{term.relatedTerms.map((relId) => (
											<span
												key={relId}
												className="rounded bg-slate-600/50 px-1.5 py-0.5 text-[10px] text-slate-400"
											>
												{relId}
											</span>
										))}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
