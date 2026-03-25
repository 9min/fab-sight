import type { Recipe } from "@/types/process";
import type { XAxisMode } from "@/utils/downsample";
import type { SeriesOption } from "echarts";

/** 레시피 스텝 경계 수직선 오버레이를 생성한다 */
export function buildRecipeStepOverlay(
	recipe: Recipe | undefined,
	xAxisMode: XAxisMode,
	waferStartTime?: string,
): SeriesOption[] {
	if (!recipe) return [];

	const boundaries: { x: number; label: string }[] = [];
	let elapsed = 0;
	const startMs = waferStartTime ? new Date(waferStartTime).getTime() : 0;

	for (const step of recipe.steps) {
		if (elapsed > 0) {
			boundaries.push({
				x: xAxisMode === "elapsed" ? elapsed : startMs + elapsed * 1000,
				label: step.name,
			});
		}
		elapsed += step.durationSec;
	}

	if (boundaries.length === 0) return [];

	return [
		{
			type: "line",
			name: "스텝 경계",
			data: [],
			markLine: {
				silent: true,
				symbol: "none",
				lineStyle: { color: "rgba(148, 163, 184, 0.3)", type: "dashed", width: 1 },
				label: {
					show: true,
					position: "insideStartTop",
					color: "#94A3B8",
					fontSize: 10,
					formatter: (params: { name?: string }) => params.name ?? "",
				},
				data: boundaries.map((b) => ({
					xAxis: b.x,
					name: b.label,
				})),
			},
		} satisfies SeriesOption,
	];
}
