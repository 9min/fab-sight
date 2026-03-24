import { useDashboardStore } from "@/stores/useDashboardStore";
import { MOCK_SENSORS_META } from "@/test/helpers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DrilldownPanel } from "./DrilldownPanel";

function renderWithProviders() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<DrilldownPanel sensorsMeta={MOCK_SENSORS_META} />
		</QueryClientProvider>,
	);
}

describe("DrilldownPanel", () => {
	beforeEach(() => {
		useDashboardStore.setState({
			selectedLotId: null,
			selectedTimestamp: null,
		});
	});

	it("타임스탬프가 없으면 안내 메시지를 표시한다", () => {
		renderWithProviders();
		expect(screen.getByText(/타임스탬프를 클릭/)).toBeInTheDocument();
	});

	it("Lot이 선택되지 않으면 안내 메시지를 표시한다", () => {
		useDashboardStore.setState({
			selectedLotId: null,
			selectedTimestamp: "2024-01-01T00:00:00.000Z",
		});
		renderWithProviders();
		expect(screen.getByText(/타임스탬프를 클릭/)).toBeInTheDocument();
	});
});
