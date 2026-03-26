import type { ProcessResult } from "@/types/process";

/** 공정별 결과 판정 기준 */
interface ResultSpec {
	filmThicknessMax: number;
	uniformityMin: number;
	defectCountMax: number;
	filmThicknessLabel: string;
	filmThicknessUnit: string;
}

const CVD_SPEC: ResultSpec = {
	filmThicknessMax: 1020,
	uniformityMin: 95,
	defectCountMax: 10,
	filmThicknessLabel: "막두께",
	filmThicknessUnit: "Å",
};

const ETCH_SPEC: ResultSpec = {
	filmThicknessMax: 160,
	uniformityMin: 95,
	defectCountMax: 10,
	filmThicknessLabel: "식각 깊이",
	filmThicknessUnit: "nm",
};

/** filmThickness 값 범위로 공정 타입을 추론한다 (CVD ~1000Å vs Etch ~150nm) */
function inferSpec(results: ProcessResult[]): ResultSpec {
	if (results.length === 0) return CVD_SPEC;
	const avgThickness = results.reduce((sum, r) => sum + r.filmThickness, 0) / results.length;
	return avgThickness > 500 ? CVD_SPEC : ETCH_SPEC;
}

interface ProcessResultTableProps {
	results: ProcessResult[];
}

/** 공정 결과 메트릭 테이블 */
export function ProcessResultTable({ results }: ProcessResultTableProps) {
	const sorted = [...results].sort((a, b) => a.runNumber - b.runNumber);
	const spec = inferSpec(results);

	return (
		<div className="overflow-auto">
			<table className="w-full text-left text-xs">
				<thead>
					<tr className="border-b border-slate-700 text-slate-400">
						<th className="px-2 py-1.5">Run</th>
						<th className="px-2 py-1.5">
							{spec.filmThicknessLabel} ({spec.filmThicknessUnit})
						</th>
						<th className="px-2 py-1.5">균일도 (%)</th>
						<th className="px-2 py-1.5">결함</th>
						<th className="px-2 py-1.5">상태</th>
					</tr>
				</thead>
				<tbody>
					{sorted.map((r) => {
						const isWarning =
							r.filmThickness > spec.filmThicknessMax ||
							r.uniformity < spec.uniformityMin ||
							r.defectCount > spec.defectCountMax;
						return (
							<tr key={r.lotId} className="border-b border-slate-800 hover:bg-slate-800/50">
								<td className="px-2 py-1.5 font-mono text-slate-300">#{r.runNumber}</td>
								<td className="px-2 py-1.5 font-mono text-slate-300">{r.filmThickness}</td>
								<td className="px-2 py-1.5 font-mono text-slate-300">{r.uniformity.toFixed(1)}</td>
								<td className="px-2 py-1.5 font-mono text-slate-300">{r.defectCount}</td>
								<td className="px-2 py-1.5">
									{isWarning ? (
										<span className="rounded bg-red-500/20 px-1.5 py-0.5 text-red-400">이상</span>
									) : (
										<span className="rounded bg-green-500/20 px-1.5 py-0.5 text-green-400">
											정상
										</span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
