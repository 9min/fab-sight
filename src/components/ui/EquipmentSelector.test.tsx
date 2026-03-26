import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { EquipmentSelector } from "./EquipmentSelector";

describe("EquipmentSelector", () => {
	beforeEach(() => {
		useDashboardStore.setState({
			selectedEquipmentId: null,
			selectedChamberId: null,
			selectedLotId: null,
			selectedWaferId: null,
		});
	});

	it("select 요소가 렌더링된다", () => {
		render(<EquipmentSelector />);
		expect(screen.getByLabelText("장비 선택")).toBeInTheDocument();
	});

	it("전체 장비 옵션이 포함된다", () => {
		render(<EquipmentSelector />);
		expect(screen.getByText("전체 장비")).toBeInTheDocument();
		expect(screen.getByText(/CVD-01/)).toBeInTheDocument();
		expect(screen.getByText(/ETCH-01/)).toBeInTheDocument();
	});

	it("장비 선택 시 스토어가 업데이트된다", async () => {
		const user = userEvent.setup();
		render(<EquipmentSelector />);

		await user.selectOptions(screen.getByLabelText("장비 선택"), "equip-cvd-01");
		expect(useDashboardStore.getState().selectedEquipmentId).toBe("equip-cvd-01");
	});

	it("장비 선택 시 첫 번째 챔버가 자동 선택되고 Lot/Wafer는 리셋된다", async () => {
		useDashboardStore.setState({
			selectedChamberId: "ch-old",
			selectedLotId: "lot-old",
			selectedWaferId: "wf-old",
		});
		const user = userEvent.setup();
		render(<EquipmentSelector />);

		await user.selectOptions(screen.getByLabelText("장비 선택"), "equip-cvd-01");

		const state = useDashboardStore.getState();
		expect(state.selectedChamberId).toBe("cvd01-ch-a");
		expect(state.selectedLotId).toBeNull();
		expect(state.selectedWaferId).toBeNull();
	});
});
