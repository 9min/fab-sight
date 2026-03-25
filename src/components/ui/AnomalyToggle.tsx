import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useCallback } from "react";

export function AnomalyToggle() {
	const showAnomalyOverlay = useDashboardStore((s) => s.showAnomalyOverlay);
	const toggleAnomalyOverlay = useDashboardStore((s) => s.toggleAnomalyOverlay);

	const handleClick = useCallback(() => {
		toggleAnomalyOverlay();
	}, [toggleAnomalyOverlay]);

	return (
		<ToggleButton
			variant="switch"
			isActive={showAnomalyOverlay}
			onClick={handleClick}
			label="이상 탐지 표시"
		>
			<InfoTooltip termId="anomaly" />
		</ToggleButton>
	);
}
