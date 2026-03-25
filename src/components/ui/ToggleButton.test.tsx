import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
	describe("variant=switch", () => {
		it("role=switch로 렌더링된다", () => {
			render(<ToggleButton variant="switch" isActive={false} onClick={vi.fn()} label="테스트" />);
			expect(screen.getByRole("switch")).toBeInTheDocument();
		});

		it("isActive=true일 때 aria-checked=true이다", () => {
			render(<ToggleButton variant="switch" isActive={true} onClick={vi.fn()} label="테스트" />);
			expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
		});

		it("isActive=false일 때 aria-checked=false이다", () => {
			render(<ToggleButton variant="switch" isActive={false} onClick={vi.fn()} label="테스트" />);
			expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
		});

		it("클릭 시 onClick이 호출된다", async () => {
			const user = userEvent.setup();
			const onClick = vi.fn();
			render(<ToggleButton variant="switch" isActive={false} onClick={onClick} label="테스트" />);
			await user.click(screen.getByRole("switch"));
			expect(onClick).toHaveBeenCalledOnce();
		});

		it("라벨이 표시된다", () => {
			render(
				<ToggleButton variant="switch" isActive={false} onClick={vi.fn()} label="이상 탐지" />,
			);
			expect(screen.getByText("이상 탐지")).toBeInTheDocument();
		});

		it("focus-visible 링이 존재한다", () => {
			render(<ToggleButton variant="switch" isActive={false} onClick={vi.fn()} label="테스트" />);
			const toggle = screen.getByRole("switch");
			expect(toggle.className).toContain("focus-visible:ring-2");
		});
	});

	describe("variant=pill", () => {
		it("role=button으로 렌더링된다", () => {
			render(<ToggleButton variant="pill" isActive={false} onClick={vi.fn()} label="테스트" />);
			expect(screen.getByRole("button")).toBeInTheDocument();
		});

		it("aria-pressed 상태를 반영한다", () => {
			render(<ToggleButton variant="pill" isActive={true} onClick={vi.fn()} label="테스트" />);
			expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
		});

		it("클릭 시 onClick이 호출된다", async () => {
			const user = userEvent.setup();
			const onClick = vi.fn();
			render(<ToggleButton variant="pill" isActive={false} onClick={onClick} label="테스트" />);
			await user.click(screen.getByRole("button"));
			expect(onClick).toHaveBeenCalledOnce();
		});

		it("라벨이 표시된다", () => {
			render(<ToggleButton variant="pill" isActive={false} onClick={vi.fn()} label="Spec Limit" />);
			expect(screen.getByText("Spec Limit")).toBeInTheDocument();
		});

		it("인디케이터 닷이 존재한다", () => {
			const { container } = render(
				<ToggleButton variant="pill" isActive={true} onClick={vi.fn()} label="테스트" />,
			);
			const dot = container.querySelector("[data-testid='indicator-dot']");
			expect(dot).toBeInTheDocument();
		});

		it("focus-visible 링이 존재한다", () => {
			render(<ToggleButton variant="pill" isActive={false} onClick={vi.fn()} label="테스트" />);
			const button = screen.getByRole("button");
			expect(button.className).toContain("focus-visible:ring-2");
		});
	});

	describe("children 슬롯", () => {
		it("children이 라벨 옆에 렌더링된다", () => {
			render(
				<ToggleButton variant="pill" isActive={false} onClick={vi.fn()} label="테스트">
					<span data-testid="extra">추가 요소</span>
				</ToggleButton>,
			);
			expect(screen.getByTestId("extra")).toBeInTheDocument();
		});
	});
});
