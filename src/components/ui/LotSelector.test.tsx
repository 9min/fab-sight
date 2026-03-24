import { MOCK_LOT_SUMMARIES } from "@/mocks/mockLots";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { LotSelector } from "./LotSelector";

describe("LotSelector", () => {
	beforeEach(() => {
		useDashboardStore.setState({
			selectedLotId: null,
			selectedWaferId: null,
		});
	});

	it("select 요소가 렌더링된다", () => {
		render(<LotSelector />);
		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("모든 Lot 옵션이 표시된다", () => {
		render(<LotSelector />);
		const options = screen.getAllByRole("option");
		// placeholder + lot 수
		expect(options).toHaveLength(MOCK_LOT_SUMMARIES.length + 1);
	});

	it("Lot 선택 시 스토어가 업데이트된다", async () => {
		const user = userEvent.setup();
		render(<LotSelector />);

		const select = screen.getByRole("combobox");
		await user.selectOptions(select, MOCK_LOT_SUMMARIES[0].lotId);

		const state = useDashboardStore.getState();
		expect(state.selectedLotId).toBe(MOCK_LOT_SUMMARIES[0].lotId);
		expect(state.selectedWaferId).toBe(MOCK_LOT_SUMMARIES[0].waferId);
	});

	it("스토어에 선택된 Lot이 있으면 해당 값이 선택된다", () => {
		useDashboardStore.setState({
			selectedLotId: MOCK_LOT_SUMMARIES[1].lotId,
			selectedWaferId: MOCK_LOT_SUMMARIES[1].waferId,
		});

		render(<LotSelector />);
		const select = screen.getByRole("combobox") as HTMLSelectElement;
		expect(select.value).toBe(MOCK_LOT_SUMMARIES[1].lotId);
	});
});
