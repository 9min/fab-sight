import { useDashboardStore } from "@/stores/useDashboardStore";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
	beforeEach(() => {
		useDashboardStore.setState({ isSidebarOpen: false });
	});

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

	it("모바일에서 닫힌 상태일 때 -translate-x-full 클래스가 존재한다", () => {
		render(<Sidebar />);
		const aside = screen.getByRole("complementary");
		expect(aside.className).toContain("-translate-x-full");
	});

	it("열린 상태일 때 translate-x-0 클래스가 존재한다", () => {
		useDashboardStore.setState({ isSidebarOpen: true });
		render(<Sidebar />);
		const aside = screen.getByRole("complementary");
		expect(aside.className).toContain("translate-x-0");
	});
});
