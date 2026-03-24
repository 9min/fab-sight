import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
	it("FabSight 제목이 렌더링된다", () => {
		render(<App />);
		expect(screen.getByText("FabSight")).toBeInTheDocument();
	});

	it("대시보드 레이아웃이 렌더링된다", () => {
		render(<App />);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByRole("complementary")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
	});
});
