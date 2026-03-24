import { MOCK_LOT_SUMMARIES_V3 } from "@/mocks/mockLotsV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { LotSelector } from "./LotSelector";

const nonGoldenSummaries = MOCK_LOT_SUMMARIES_V3.filter((s) => !s.isGoldenLot);

describe("LotSelector", () => {
	beforeEach(() => {
		useDashboardStore.setState({ selectedLotId: null, selectedWaferId: null });
	});

	it("select 요소가 렌더링된다", () => {
		render(<LotSelector />);
		expect(screen.getByRole("combobox")).toBeInTheDocument();
	});

	it("Golden Lot을 제외한 Lot 옵션이 표시된다", () => {
		render(<LotSelector />);
		const options = screen.getAllByRole("option");
		// placeholder + non-golden lots
		expect(options).toHaveLength(nonGoldenSummaries.length + 1);
	});

	it("Lot 선택 시 스토어가 업데이트된다", async () => {
		const user = userEvent.setup();
		render(<LotSelector />);

		const select = screen.getByRole("combobox");
		await user.selectOptions(select, nonGoldenSummaries[0].lotId);

		const state = useDashboardStore.getState();
		expect(state.selectedLotId).toBe(nonGoldenSummaries[0].lotId);
	});

	it("스토어에 선택된 Lot이 있으면 해당 값이 선택된다", () => {
		useDashboardStore.setState({ selectedLotId: nonGoldenSummaries[1].lotId });

		render(<LotSelector />);
		const select = screen.getByRole("combobox") as HTMLSelectElement;
		expect(select.value).toBe(nonGoldenSummaries[1].lotId);
	});
});
