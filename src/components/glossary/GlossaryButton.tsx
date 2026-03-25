import { QuestionIcon } from "@/components/icons";
import { useGlossaryStore } from "@/stores/useGlossaryStore";
import { useCallback } from "react";

export function GlossaryButton() {
	const toggleDrawer = useGlossaryStore((s) => s.toggleDrawer);

	const handleClick = useCallback(() => {
		toggleDrawer();
	}, [toggleDrawer]);

	return (
		<button
			type="button"
			onClick={handleClick}
			aria-label="용어사전"
			className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600 hover:text-slate-100"
		>
			<QuestionIcon className="h-4 w-4" />
		</button>
	);
}
