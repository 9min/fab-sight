import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { AnomalyToggle } from "./AnomalyToggle";

describe("AnomalyToggle", () => {
	beforeEach(() => {
		useDashboardStore.setState({ showAnomalyOverlay: true });
	});

	it("토글이 렌더링된다", () => {
		render(<AnomalyToggle />);
		expect(screen.getByRole("switch")).toBeInTheDocument();
	});

	it("기본적으로 켜져 있다", () => {
		render(<AnomalyToggle />);
		const toggle = screen.getByRole("switch");
		expect(toggle.getAttribute("aria-checked")).toBe("true");
	});

	it("클릭하면 토글 상태가 변경된다", async () => {
		const user = userEvent.setup();
		render(<AnomalyToggle />);

		const toggle = screen.getByRole("switch");
		await user.click(toggle);

		const state = useDashboardStore.getState();
		expect(state.showAnomalyOverlay).toBe(false);
	});

	it("라벨이 표시된다", () => {
		render(<AnomalyToggle />);
		expect(screen.getByText("이상 탐지 표시")).toBeInTheDocument();
	});
});
