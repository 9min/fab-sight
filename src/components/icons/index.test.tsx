import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CloseIcon, InfoIcon, MenuIcon, QuestionIcon } from "./index";

describe("아이콘 컴포넌트", () => {
	it("InfoIcon이 SVG로 렌더링된다", () => {
		render(<InfoIcon data-testid="info-icon" />);
		const svg = screen.getByTestId("info-icon");
		expect(svg.tagName.toLowerCase()).toBe("svg");
		expect(svg.getAttribute("aria-hidden")).toBe("true");
	});

	it("CloseIcon이 SVG로 렌더링된다", () => {
		render(<CloseIcon data-testid="close-icon" />);
		const svg = screen.getByTestId("close-icon");
		expect(svg.tagName.toLowerCase()).toBe("svg");
		expect(svg.getAttribute("aria-hidden")).toBe("true");
	});

	it("QuestionIcon이 SVG로 렌더링된다", () => {
		render(<QuestionIcon data-testid="question-icon" />);
		const svg = screen.getByTestId("question-icon");
		expect(svg.tagName.toLowerCase()).toBe("svg");
		expect(svg.getAttribute("aria-hidden")).toBe("true");
	});

	it("MenuIcon이 SVG로 렌더링된다", () => {
		render(<MenuIcon data-testid="menu-icon" />);
		const svg = screen.getByTestId("menu-icon");
		expect(svg.tagName.toLowerCase()).toBe("svg");
		expect(svg.getAttribute("aria-hidden")).toBe("true");
	});

	it("className prop이 전달된다", () => {
		render(<InfoIcon data-testid="icon" className="h-5 w-5 text-red-500" />);
		const svg = screen.getByTestId("icon");
		expect(svg.getAttribute("class")).toContain("h-5 w-5 text-red-500");
	});
});
