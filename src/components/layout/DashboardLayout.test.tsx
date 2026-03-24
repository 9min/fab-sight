import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardLayout } from "./DashboardLayout";

describe("DashboardLayout", () => {
	it("네비게이션, 사이드바, 메인 영역이 모두 렌더링된다", () => {
		render(
			<DashboardLayout
				navControls={<span>네비 컨트롤</span>}
				sidebarContent={<span>사이드바 컨텐츠</span>}
				chartArea={<span>차트</span>}
				drilldownArea={<span>드릴다운</span>}
			/>,
		);
		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByRole("complementary")).toBeInTheDocument();
		expect(screen.getByRole("main")).toBeInTheDocument();
	});

	it("각 영역에 전달된 콘텐츠가 렌더링된다", () => {
		render(
			<DashboardLayout
				navControls={<span>네비 컨트롤</span>}
				sidebarContent={<span>사이드바 컨텐츠</span>}
				chartArea={<span>차트</span>}
				drilldownArea={<span>드릴다운</span>}
			/>,
		);
		expect(screen.getByText("네비 컨트롤")).toBeInTheDocument();
		expect(screen.getByText("사이드바 컨텐츠")).toBeInTheDocument();
		expect(screen.getByText("차트")).toBeInTheDocument();
		expect(screen.getByText("드릴다운")).toBeInTheDocument();
	});
});
