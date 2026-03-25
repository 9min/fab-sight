interface SegmentedOption<T extends string> {
	value: T;
	label: string;
}

interface SegmentedControlProps<T extends string> {
	value: T;
	onChange: (value: T) => void;
	options: SegmentedOption<T>[];
	ariaLabel: string;
}

/** 다중 옵션 세그먼트 토글. radiogroup 시맨틱을 사용한다. */
export function SegmentedControl<T extends string>({
	value,
	onChange,
	options,
	ariaLabel,
}: SegmentedControlProps<T>) {
	return (
		<div role="radiogroup" aria-label={ariaLabel} className="flex rounded border border-slate-600">
			{options.map((option, idx) => {
				const isSelected = value === option.value;
				return (
					<label
						key={option.value}
						className={`cursor-pointer px-3 py-1 text-xs transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-slate-900 ${
							idx > 0 ? "border-l border-slate-600" : ""
						} ${
							isSelected ? "bg-blue-500/20 text-blue-400" : "text-slate-400 hover:text-slate-300"
						}`}
					>
						<input
							type="radio"
							name={ariaLabel}
							value={option.value}
							checked={isSelected}
							onChange={() => onChange(option.value)}
							className="sr-only"
							aria-label={option.label}
						/>
						{option.label}
					</label>
				);
			})}
		</div>
	);
}
