import { CloseIcon } from "@/components/icons";
import {
	GLOSSARY_CATEGORIES,
	GLOSSARY_CATEGORY_ORDER,
	getTermsByCategory,
	searchGlossaryTerms,
} from "@/constants/glossary";
import { useGlossaryStore } from "@/stores/useGlossaryStore";
import { useCallback, useEffect, useMemo } from "react";
import { GlossaryCategory } from "./GlossaryCategory";

export function GlossaryDrawer() {
	const isDrawerOpen = useGlossaryStore((s) => s.isDrawerOpen);
	const searchQuery = useGlossaryStore((s) => s.searchQuery);
	const closeDrawer = useGlossaryStore((s) => s.closeDrawer);
	const setSearchQuery = useGlossaryStore((s) => s.setSearchQuery);

	const handleOverlayClick = useCallback(() => {
		closeDrawer();
	}, [closeDrawer]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value);
		},
		[setSearchQuery],
	);

	useEffect(() => {
		if (!isDrawerOpen) return;

		function handleEscape(e: KeyboardEvent) {
			if (e.key === "Escape") {
				closeDrawer();
			}
		}

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isDrawerOpen, closeDrawer]);

	const isSearching = searchQuery.trim().length > 0;

	const termsByCategory = useMemo(() => getTermsByCategory(), []);

	const searchResults = useMemo(() => {
		if (!isSearching) return null;
		return searchGlossaryTerms(searchQuery);
	}, [isSearching, searchQuery]);

	return (
		<>
			{/* 배경 오버레이 */}
			{isDrawerOpen && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: 오버레이는 장식 요소이며 ESC 키 핸들러가 별도로 존재한다
				<div
					className="fixed inset-0 z-30 bg-black/20"
					onClick={handleOverlayClick}
					aria-hidden="true"
				/>
			)}

			{/* Drawer 패널 */}
			<section
				aria-label="용어사전"
				className={`fixed top-14 right-0 bottom-0 z-40 flex w-full flex-col border-l border-slate-700 bg-slate-800 shadow-xl transition-transform duration-300 sm:w-[360px] ${
					isDrawerOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* 헤더 */}
				<div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
					<h2 className="text-sm font-semibold text-slate-100">용어사전</h2>
					<button
						type="button"
						onClick={closeDrawer}
						aria-label="용어사전 닫기"
						className="flex h-6 w-6 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
					>
						<CloseIcon className="h-4 w-4" />
					</button>
				</div>

				{/* 검색 */}
				<div className="border-b border-slate-700 px-4 py-3">
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="용어 검색..."
						className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
					/>
				</div>

				{/* 용어 목록 */}
				<div className="flex-1 overflow-y-auto px-4 py-3">
					{isSearching ? (
						searchResults && searchResults.length > 0 ? (
							<GlossaryCategory title={"검색 결과"} terms={searchResults} />
						) : (
							<p className="py-8 text-center text-sm text-slate-500">검색 결과가 없습니다</p>
						)
					) : (
						<div className="flex flex-col gap-1">
							{GLOSSARY_CATEGORY_ORDER.map((categoryKey) => (
								<GlossaryCategory
									key={categoryKey}
									title={GLOSSARY_CATEGORIES[categoryKey]}
									terms={termsByCategory[categoryKey]}
								/>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
