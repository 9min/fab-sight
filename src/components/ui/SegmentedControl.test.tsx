import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

const OPTIONS = [
	{ value: "a", label: "옵션A" },
	{ value: "b", label: "옵션B" },
	{ value: "c", label: "옵션C" },
];

describe("SegmentedControl", () => {
	it("옵션 수만큼 라디오가 렌더링된다", () => {
		render(
			<SegmentedControl
				value="a"
				onChange={vi.fn()}
				options={OPTIONS}
				ariaLabel="테스트 세그먼트"
			/>,
		);
		const radios = screen.getAllByRole("radio");
		expect(radios).toHaveLength(3);
	});

	it("현재 값에 해당하는 라디오가 checked이다", () => {
		render(
			<SegmentedControl
				value="b"
				onChange={vi.fn()}
				options={OPTIONS}
				ariaLabel="테스트 세그먼트"
			/>,
		);
		const checkedRadio = screen.getByRole("radio", { name: "옵션B" });
		expect(checkedRadio).toBeChecked();
	});

	it("다른 옵션 클릭 시 onChange가 해당 값으로 호출된다", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<SegmentedControl
				value="a"
				onChange={onChange}
				options={OPTIONS}
				ariaLabel="테스트 세그먼트"
			/>,
		);
		await user.click(screen.getByRole("radio", { name: "옵션C" }));
		expect(onChange).toHaveBeenCalledWith("c");
	});

	it("radiogroup role이 존재한다", () => {
		render(
			<SegmentedControl
				value="a"
				onChange={vi.fn()}
				options={OPTIONS}
				ariaLabel="테스트 세그먼트"
			/>,
		);
		expect(screen.getByRole("radiogroup")).toBeInTheDocument();
	});
});
