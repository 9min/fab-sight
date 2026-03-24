import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { XAxisModeToggle } from "./XAxisModeToggle";

describe("XAxisModeToggle", () => {
	beforeEach(() => {
		useDashboardStore.setState({ xAxisMode: "wallClock" });
	});

	it("두 개의 버튼이 렌더링된다", () => {
		render(<XAxisModeToggle />);
		expect(screen.getByLabelText("Wall Clock 모드")).toBeInTheDocument();
		expect(screen.getByLabelText("Elapsed Time 모드")).toBeInTheDocument();
	});

	it("기본 모드는 wallClock이다", () => {
		render(<XAxisModeToggle />);
		expect(useDashboardStore.getState().xAxisMode).toBe("wallClock");
	});

	it("경과 시간 버튼 클릭 시 elapsed로 변경된다", async () => {
		const user = userEvent.setup();
		render(<XAxisModeToggle />);

		await user.click(screen.getByLabelText("Elapsed Time 모드"));
		expect(useDashboardStore.getState().xAxisMode).toBe("elapsed");
	});

	it("시각 버튼 클릭 시 wallClock으로 돌아온다", async () => {
		useDashboardStore.setState({ xAxisMode: "elapsed" });
		const user = userEvent.setup();
		render(<XAxisModeToggle />);

		await user.click(screen.getByLabelText("Wall Clock 모드"));
		expect(useDashboardStore.getState().xAxisMode).toBe("wallClock");
	});
});
