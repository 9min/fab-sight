import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
	it("aside 요소로 렌더링된다", () => {
		render(<Sidebar />);
		expect(screen.getByRole("complementary")).toBeInTheDocument();
	});

	it("children을 렌더링한다", () => {
		render(
			<Sidebar>
				<span>필터 영역</span>
			</Sidebar>,
		);
		expect(screen.getByText("필터 영역")).toBeInTheDocument();
	});
});
