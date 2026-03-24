import type { ParameterTableRow } from "@/utils/drilldownUtils";

interface ParameterTableProps {
	rows: ParameterTableRow[];
}

export function ParameterTable({ rows }: ParameterTableProps) {
	return (
		<table className="w-full text-sm">
			<thead>
				<tr className="border-b border-slate-700 text-left text-slate-400">
					<th className="px-3 py-2 font-medium">센서</th>
					<th className="px-3 py-2 font-medium">값</th>
					<th className="px-3 py-2 font-medium">단위</th>
					<th className="px-3 py-2 font-medium">상태</th>
				</tr>
			</thead>
			<tbody>
				{rows.map((row) => (
					<tr key={row.sensor} className="border-b border-slate-700/50">
						<td className="px-3 py-2">
							<span className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full" style={{ backgroundColor: row.color }} />
								<span className="text-slate-200">{row.label}</span>
							</span>
						</td>
						<td className="px-3 py-2 font-mono text-slate-100">{row.value}</td>
						<td className="px-3 py-2 text-slate-400">{row.unit}</td>
						<td className="px-3 py-2">
							{row.status === "anomaly" ? (
								<span className="rounded bg-red-900/50 px-2 py-0.5 text-xs text-red-400">이상</span>
							) : (
								<span className="rounded bg-green-900/50 px-2 py-0.5 text-xs text-green-400">
									정상
								</span>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
