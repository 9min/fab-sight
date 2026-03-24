import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ChamberSelector } from "./ChamberSelector";

describe("ChamberSelector", () => {
	beforeEach(() => {
		useDashboardStore.setState({
			selectedEquipmentId: null,
			selectedChamberId: null,
			selectedLotId: null,
		});
	});

	it("select 요소가 렌더링된다", () => {
		render(<ChamberSelector />);
		expect(screen.getByLabelText("챔버 선택")).toBeInTheDocument();
	});

	it("장비가 선택되지 않으면 비활성화된다", () => {
		render(<ChamberSelector />);
		const select = screen.getByLabelText("챔버 선택") as HTMLSelectElement;
		expect(select.disabled).toBe(true);
	});

	it("장비 선택 시 해당 장비의 챔버가 표시된다", () => {
		useDashboardStore.setState({ selectedEquipmentId: "equip-cvd-01" });
		render(<ChamberSelector />);
		expect(screen.getByText("Chamber A")).toBeInTheDocument();
		expect(screen.getByText("Chamber B")).toBeInTheDocument();
		expect(screen.getByText("Chamber C")).toBeInTheDocument();
	});

	it("챔버 선택 시 스토어가 업데이트된다", async () => {
		useDashboardStore.setState({ selectedEquipmentId: "equip-cvd-01" });
		const user = userEvent.setup();
		render(<ChamberSelector />);

		await user.selectOptions(screen.getByLabelText("챔버 선택"), "cvd01-ch-a");
		expect(useDashboardStore.getState().selectedChamberId).toBe("cvd01-ch-a");
	});
});
