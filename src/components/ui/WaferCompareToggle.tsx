import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { useDashboardStore } from "@/stores/useDashboardStore";

export function WaferCompareToggle() {
	const isWaferCompareMode = useDashboardStore((s) => s.isWaferCompareMode);
	const toggleWaferCompareMode = useDashboardStore((s) => s.toggleWaferCompareMode);

	return (
		<ToggleButton
			variant="pill"
			isActive={isWaferCompareMode}
			onClick={toggleWaferCompareMode}
			label="W2W 비교"
		>
			<InfoTooltip termId="w2wCompare" />
		</ToggleButton>
	);
}
