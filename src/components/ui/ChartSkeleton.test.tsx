import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChartSkeleton } from "./ChartSkeleton";

describe("ChartSkeleton", () => {
	it("animate-pulse 클래스가 적용된다", () => {
		const { container } = render(<ChartSkeleton />);
		const skeleton = container.firstElementChild;
		expect(skeleton?.className).toContain("animate-pulse");
	});
});
