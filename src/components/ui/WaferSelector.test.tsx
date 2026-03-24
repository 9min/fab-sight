import { useDashboardStore } from "@/stores/useDashboardStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { WaferSelector } from "./WaferSelector";

function renderWithProviders() {
	const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
	return render(
		<QueryClientProvider client={queryClient}>
			<WaferSelector />
		</QueryClientProvider>,
	);
}

describe("WaferSelector", () => {
	beforeEach(() => {
		useDashboardStore.setState({
			selectedLotId: "LOT-20240301-A",
			selectedWaferId: null,
		});
	});

	it("select 요소가 렌더링된다", () => {
		renderWithProviders();
		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("Wafer 선택 시 스토어가 업데이트된다", async () => {
		const user = userEvent.setup();
		renderWithProviders();

		// TanStack Query 비동기 로딩 대기
		const select = await screen.findByRole("combobox");
		// 옵션이 로딩될 때까지 대기
		await screen.findByText(/WF-01/);
		await user.selectOptions(select, "WF-01");

		expect(useDashboardStore.getState().selectedWaferId).toBe("WF-01");
	});

	it("Lot이 없으면 비활성화된다", () => {
		useDashboardStore.setState({ selectedLotId: null });
		renderWithProviders();

		const select = screen.getByRole("combobox") as HTMLSelectElement;
		expect(select.disabled).toBe(true);
	});

	it("aria-label이 설정되어 있다", () => {
		renderWithProviders();
		expect(screen.getByLabelText("Wafer 선택")).toBeInTheDocument();
	});
});
