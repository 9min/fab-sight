import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useCallback } from "react";

export function CompareToggle() {
	const isCompareMode = useDashboardStore((s) => s.isCompareMode);
	const toggleCompareMode = useDashboardStore((s) => s.toggleCompareMode);

	const handleClick = useCallback(() => {
		toggleCompareMode();
	}, [toggleCompareMode]);

	return (
		<ToggleButton
			variant="pill"
			isActive={isCompareMode}
			onClick={handleClick}
			label="Golden Lot 비교"
		>
			<InfoTooltip termId="goldenLot" />
		</ToggleButton>
	);
}
