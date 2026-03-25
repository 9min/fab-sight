import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { SpecLimitToggle } from "./SpecLimitToggle";

describe("SpecLimitToggle", () => {
	beforeEach(() => {
		useDashboardStore.setState({ showSpecLimits: false });
	});

	it("버튼이 렌더링된다", () => {
		render(<SpecLimitToggle />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("클릭하면 showSpecLimits가 true로 변경된다", async () => {
		const user = userEvent.setup();
		render(<SpecLimitToggle />);

		await user.click(screen.getByRole("button"));
		expect(useDashboardStore.getState().showSpecLimits).toBe(true);
	});

	it("두 번 클릭하면 다시 false로 돌아온다", async () => {
		const user = userEvent.setup();
		render(<SpecLimitToggle />);

		const btn = screen.getByRole("button");
		await user.click(btn);
		await user.click(btn);
		expect(useDashboardStore.getState().showSpecLimits).toBe(false);
	});

	it("라벨이 표시된다", () => {
		render(<SpecLimitToggle />);
		expect(screen.getByText("Spec Limit")).toBeInTheDocument();
	});
});
