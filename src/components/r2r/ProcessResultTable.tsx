import type { ProcessResult } from "@/types/process";

interface ProcessResultTableProps {
	results: ProcessResult[];
}

/** 공정 결과 메트릭 테이블 */
export function ProcessResultTable({ results }: ProcessResultTableProps) {
	const sorted = [...results].sort((a, b) => a.runNumber - b.runNumber);

	return (
		<div className="overflow-auto">
			<table className="w-full text-left text-xs">
				<thead>
					<tr className="border-b border-slate-700 text-slate-400">
						<th className="px-2 py-1.5">Run</th>
						<th className="px-2 py-1.5">막두께 (Å)</th>
						<th className="px-2 py-1.5">균일도 (%)</th>
						<th className="px-2 py-1.5">결함</th>
						<th className="px-2 py-1.5">상태</th>
					</tr>
				</thead>
				<tbody>
					{sorted.map((r) => {
						const isWarning = r.filmThickness > 1020 || r.uniformity < 95 || r.defectCount > 10;
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
