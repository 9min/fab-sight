import { create } from "zustand";

interface GlossaryState {
	isDrawerOpen: boolean;
	searchQuery: string;
	highlightTermId: string | null;

	openDrawer: () => void;
	closeDrawer: () => void;
	toggleDrawer: () => void;
	setSearchQuery: (query: string) => void;
	setHighlightTermId: (id: string | null) => void;
	openDrawerWithTerm: (termId: string) => void;
}

export const useGlossaryStore = create<GlossaryState>((set) => ({
	isDrawerOpen: false,
	searchQuery: "",
	highlightTermId: null,

	openDrawer: () => set({ isDrawerOpen: true }),
	closeDrawer: () => set({ isDrawerOpen: false, searchQuery: "", highlightTermId: null }),
	toggleDrawer: () =>
		set((state) => ({
			isDrawerOpen: !state.isDrawerOpen,
			...(!state.isDrawerOpen ? {} : { searchQuery: "", highlightTermId: null }),
		})),
	setSearchQuery: (query) => set({ searchQuery: query }),
	setHighlightTermId: (id) => set({ highlightTermId: id }),
	openDrawerWithTerm: (termId) =>
		set({ isDrawerOpen: true, searchQuery: "", highlightTermId: termId }),
}));
