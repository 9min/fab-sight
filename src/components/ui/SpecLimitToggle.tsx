import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useDashboardStore } from "@/stores/useDashboardStore";

export function SpecLimitToggle() {
	const showSpecLimits = useDashboardStore((s) => s.showSpecLimits);
	const toggleSpecLimits = useDashboardStore((s) => s.toggleSpecLimits);

	return (
		<ToggleButton
			variant="pill"
			isActive={showSpecLimits}
			onClick={toggleSpecLimits}
			label="Spec Limit"
		>
			<InfoTooltip termId="specLimit" />
		</ToggleButton>
	);
}
