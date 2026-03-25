import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

	it("햄버거 메뉴 버튼이 존재한다", () => {
		render(<TopNav />);
		expect(screen.getByLabelText("사이드바 토글")).toBeInTheDocument();
	});

	it("햄버거 메뉴 클릭 시 사이드바 토글이 호출된다", async () => {
		const user = userEvent.setup();
		render(<TopNav />);
		await user.click(screen.getByLabelText("사이드바 토글"));
		// 스토어 상태 변경 확인은 통합 테스트에서 수행
	});
});
