import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingChild(): React.ReactNode {
	throw new Error("테스트 에러");
}

function NormalChild() {
	return <p>정상 렌더링</p>;
}

describe("ErrorBoundary", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("에러 발생 시 fallback UI를 렌더링한다", () => {
		render(
			<ErrorBoundary>
				<ThrowingChild />
			</ErrorBoundary>,
		);
		expect(screen.getByText("예기치 않은 오류가 발생했습니다")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
	});

	it("정상 시 children을 렌더링한다", () => {
		render(
			<ErrorBoundary>
				<NormalChild />
			</ErrorBoundary>,
		);
		expect(screen.getByText("정상 렌더링")).toBeInTheDocument();
	});

	it("다시 시도 클릭 시 리셋된다", async () => {
		let shouldThrow = true;

		function ConditionalChild() {
			if (shouldThrow) throw new Error("조건부 에러");
			return <p>복구 성공</p>;
		}

		render(
			<ErrorBoundary>
				<ConditionalChild />
			</ErrorBoundary>,
		);

		expect(screen.getByText("예기치 않은 오류가 발생했습니다")).toBeInTheDocument();

		shouldThrow = false;
		const user = userEvent.setup();
		await user.click(screen.getByRole("button", { name: "다시 시도" }));

		expect(screen.getByText("복구 성공")).toBeInTheDocument();
	});
});
