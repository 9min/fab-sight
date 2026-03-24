import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CompareToggle } from "./CompareToggle";

describe("CompareToggle", () => {
	beforeEach(() => {
		useDashboardStore.setState({ isCompareMode: false });
	});

	it("버튼이 렌더링된다", () => {
		render(<CompareToggle />);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("Golden Lot 비교 텍스트가 표시된다", () => {
		render(<CompareToggle />);
		expect(screen.getByText("Golden Lot 비교")).toBeInTheDocument();
	});

	it("초기 상태에서 비활성 스타일이다", () => {
		render(<CompareToggle />);
		const button = screen.getByRole("button");
		expect(button.getAttribute("aria-pressed")).toBe("false");
	});

	it("클릭 시 toggleCompareMode가 호출된다", async () => {
		const user = userEvent.setup();
		render(<CompareToggle />);

		await user.click(screen.getByRole("button"));

		const state = useDashboardStore.getState();
		expect(state.isCompareMode).toBe(true);
	});

	it("isCompareMode가 true이면 활성 스타일이다", () => {
		useDashboardStore.setState({ isCompareMode: true });
		render(<CompareToggle />);
		const button = screen.getByRole("button");
		expect(button.getAttribute("aria-pressed")).toBe("true");
	});
});
