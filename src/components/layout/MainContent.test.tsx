import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MainContent } from "./MainContent";

describe("MainContent", () => {
	it("main 요소로 렌더링된다", () => {
		render(<MainContent chartArea={<div>차트</div>} drilldownArea={<div>드릴다운</div>} />);
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("차트 영역과 드릴다운 영역을 렌더링한다", () => {
		render(
			<MainContent chartArea={<div>차트 영역</div>} drilldownArea={<div>드릴다운 영역</div>} />,
		);
		expect(screen.getByText("차트 영역")).toBeInTheDocument();
		expect(screen.getByText("드릴다운 영역")).toBeInTheDocument();
	});
});
