import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopNav } from "./TopNav";

describe("TopNav", () => {
	it("nav 요소로 렌더링된다", () => {
		render(<TopNav />);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
	});

	it("FabSight 타이틀을 표시한다", () => {
		render(<TopNav />);
		expect(screen.getByText("FabSight")).toBeInTheDocument();
	});

	it("children을 렌더링한다", () => {
		render(
			<TopNav>
				<span>테스트 컨트롤</span>
			</TopNav>,
		);
		expect(screen.getByText("테스트 컨트롤")).toBeInTheDocument();
	});
});
