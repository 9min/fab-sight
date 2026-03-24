import type { ParameterTableRow } from "@/utils/drilldownUtils";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParameterTable } from "./ParameterTable";

const mockRows: ParameterTableRow[] = [
	{ sensor: "temperature", label: "Temperature", value: 550, unit: "°C", status: "normal" },
	{ sensor: "pressure", label: "Pressure", value: 8.5, unit: "Torr", status: "anomaly" },
	{ sensor: "rfPower", label: "RF Power", value: 1500, unit: "W", status: "normal" },
];

describe("ParameterTable", () => {
	it("테이블이 렌더링된다", () => {
		render(<ParameterTable rows={mockRows} />);
		expect(screen.getByRole("table")).toBeInTheDocument();
	});

	it("모든 센서 라벨이 표시된다", () => {
		render(<ParameterTable rows={mockRows} />);
		expect(screen.getByText("Temperature")).toBeInTheDocument();
		expect(screen.getByText("Pressure")).toBeInTheDocument();
		expect(screen.getByText("RF Power")).toBeInTheDocument();
	});

	it("센서 값이 표시된다", () => {
		render(<ParameterTable rows={mockRows} />);
		expect(screen.getByText("550")).toBeInTheDocument();
		expect(screen.getByText("8.5")).toBeInTheDocument();
		expect(screen.getByText("1500")).toBeInTheDocument();
	});

	it("단위가 표시된다", () => {
		render(<ParameterTable rows={mockRows} />);
		expect(screen.getByText("°C")).toBeInTheDocument();
		expect(screen.getByText("Torr")).toBeInTheDocument();
		expect(screen.getByText("W")).toBeInTheDocument();
	});

	it("정상 상태는 정상으로 표시된다", () => {
		render(<ParameterTable rows={mockRows} />);
		const normalBadges = screen.getAllByText("정상");
		expect(normalBadges.length).toBe(2);
	});

	it("이상 상태는 이상으로 표시된다", () => {
		render(<ParameterTable rows={mockRows} />);
		expect(screen.getByText("이상")).toBeInTheDocument();
	});

	it("빈 데이터 시 빈 테이블이 렌더링된다", () => {
		render(<ParameterTable rows={[]} />);
		expect(screen.getByRole("table")).toBeInTheDocument();
	});
});
