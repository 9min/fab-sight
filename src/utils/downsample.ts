import type { ProcessDataPoint, SensorType } from "@/types/process";

interface Point {
	x: number;
	y: number;
}

/**
 * Largest-Triangle-Three-Buckets (LTTB) 다운샘플링 알고리즘.
 * 시각적 형태를 보존하면서 데이터 포인트 수를 줄인다.
 */
export function lttbDownsample(data: Point[], targetCount: number): Point[] {
	if (data.length <= targetCount || data.length <= 2) {
		return data;
	}

	const sampled: Point[] = [];
	// 첫 번째 포인트는 항상 포함
	sampled.push(data[0]);

	const bucketSize = (data.length - 2) / (targetCount - 2);

	let prevSelectedIndex = 0;

	for (let i = 1; i < targetCount - 1; i++) {
		// 현재 버킷 범위
		const bucketStart = Math.floor((i - 1) * bucketSize) + 1;
		const bucketEnd = Math.min(Math.floor(i * bucketSize) + 1, data.length - 1);

		// 다음 버킷의 평균 계산
		const nextBucketStart = Math.floor(i * bucketSize) + 1;
		const nextBucketEnd = Math.min(Math.floor((i + 1) * bucketSize) + 1, data.length - 1);

		let avgX = 0;
		let avgY = 0;
		let nextBucketCount = 0;

		for (let j = nextBucketStart; j < nextBucketEnd; j++) {
			avgX += data[j].x;
			avgY += data[j].y;
			nextBucketCount++;
		}

		if (nextBucketCount > 0) {
			avgX /= nextBucketCount;
			avgY /= nextBucketCount;
		}

		// 현재 버킷에서 삼각형 면적이 최대인 포인트 선택
		const prevPoint = data[prevSelectedIndex];
		let maxArea = -1;
		let selectedIndex = bucketStart;

		for (let j = bucketStart; j < bucketEnd; j++) {
			const area = Math.abs(
				(prevPoint.x - avgX) * (data[j].y - prevPoint.y) -
					(prevPoint.x - data[j].x) * (avgY - prevPoint.y),
			);

			if (area > maxArea) {
				maxArea = area;
				selectedIndex = j;
			}
		}

		sampled.push(data[selectedIndex]);
		prevSelectedIndex = selectedIndex;
	}

	// 마지막 포인트는 항상 포함
	sampled.push(data[data.length - 1]);

	return sampled;
}

/** ProcessDataPoint 배열에서 특정 센서의 {x, y} 시리즈를 추출한다 */
export function extractSensorSeries(data: ProcessDataPoint[], sensor: SensorType): Point[] {
	return data.map((point) => ({
		x: new Date(point.timestamp).getTime(),
		y: point[sensor],
	}));
}
