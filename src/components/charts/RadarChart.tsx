import type { RadarDataItem } from "@/utils/drilldownUtils";
import ReactECharts from "echarts-for-react";
import { memo, useMemo } from "react";
import { buildRadarOption } from "./buildRadarOption";

interface RadarChartProps {
	data: RadarDataItem[];
}

export const RadarChart = memo(function RadarChart({ data }: RadarChartProps) {
	const option = useMemo(() => buildRadarOption(data), [data]);

	return (
		<ReactECharts
			option={option}
			style={{ height: "100%", width: "100%" }}
			opts={{ renderer: "canvas" }}
			notMerge={true}
		/>
	);
});
