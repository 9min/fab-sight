import { useDashboardStore } from "@/stores/useDashboardStore";
import { MOCK_SENSORS_META } from "@/test/helpers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SensorCheckboxGroup } from "./SensorCheckbox";

describe("SensorCheckboxGroup", () => {
	beforeEach(() => {
		useDashboardStore.setState({
			selectedSensors: ["temperature", "pressure", "rfPower"],
		});
	});

	it("sensorsMeta 수만큼 체크박스가 렌더링된다", () => {
		render(<SensorCheckboxGroup sensorsMeta={MOCK_SENSORS_META} />);
		const checkboxes = screen.getAllByRole("checkbox");
		expect(checkboxes).toHaveLength(3);
	});

	it("기본적으로 모두 체크되어 있다", () => {
		render(<SensorCheckboxGroup sensorsMeta={MOCK_SENSORS_META} />);
		const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
		for (const cb of checkboxes) {
			expect(cb.checked).toBe(true);
		}
	});

	it("센서 라벨이 표시된다", () => {
		render(<SensorCheckboxGroup sensorsMeta={MOCK_SENSORS_META} />);
		expect(screen.getByText("Temperature")).toBeInTheDocument();
		expect(screen.getByText("Pressure")).toBeInTheDocument();
		expect(screen.getByText("RF Power")).toBeInTheDocument();
	});

	it("체크박스 해제 시 스토어에서 해당 센서가 제거된다", async () => {
		const user = userEvent.setup();
		render(<SensorCheckboxGroup sensorsMeta={MOCK_SENSORS_META} />);

		const tempCheckbox = screen.getByLabelText("Temperature");
		await user.click(tempCheckbox);

		const state = useDashboardStore.getState();
		expect(state.selectedSensors).not.toContain("temperature");
		expect(state.selectedSensors).toContain("pressure");
		expect(state.selectedSensors).toContain("rfPower");
	});

	it("체크박스 재선택 시 스토어에 센서가 추가된다", async () => {
		useDashboardStore.setState({ selectedSensors: ["pressure", "rfPower"] });
		const user = userEvent.setup();
		render(<SensorCheckboxGroup sensorsMeta={MOCK_SENSORS_META} />);

		const tempCheckbox = screen.getByLabelText("Temperature");
		await user.click(tempCheckbox);

		const state = useDashboardStore.getState();
		expect(state.selectedSensors).toContain("temperature");
	});
});
