import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
	it("메시지를 표시한다", () => {
		render(<EmptyState message="Lot을 선택해주세요" />);
		expect(screen.getByText("Lot을 선택해주세요")).toBeInTheDocument();
	});
});
