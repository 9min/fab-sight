import type { SensorMeta } from "@/types/process";
import type { RadarDataItem } from "@/utils/drilldownUtils";
import ReactECharts from "echarts-for-react";
import { memo, useMemo } from "react";
import { buildRadarOption } from "./buildRadarOption";

interface RadarChartProps {
	data: RadarDataItem[];
	sensorsMeta: SensorMeta[];
}

export const RadarChart = memo(function RadarChart({ data, sensorsMeta }: RadarChartProps) {
	const option = useMemo(() => buildRadarOption(data, sensorsMeta), [data, sensorsMeta]);

	return (
		<div role="img" aria-label="센서 값 방사형 차트" style={{ height: "100%", width: "100%" }}>
			<ReactECharts
				option={option}
				style={{ height: "100%", width: "100%" }}
				opts={{ renderer: "canvas" }}
				notMerge={true}
			/>
		</div>
	);
});
