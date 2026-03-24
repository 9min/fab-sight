import { createMockDataPoints } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { extractSensorSeries, lttbDownsample } from "./downsample";

describe("lttbDownsample", () => {
	it("데이터 길이가 목표 이하면 원본을 그대로 반환한다", () => {
		const data = [
			{ x: 0, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 3 },
		];
		const result = lttbDownsample(data, 5);
		expect(result).toEqual(data);
	});

	it("데이터 길이가 목표와 같으면 원본을 반환한다", () => {
		const data = [
			{ x: 0, y: 1 },
			{ x: 1, y: 2 },
			{ x: 2, y: 3 },
		];
		const result = lttbDownsample(data, 3);
		expect(result).toEqual(data);
	});

	it("목표 개수로 다운샘플링한다", () => {
		const data = Array.from({ length: 100 }, (_, i) => ({
			x: i,
			y: Math.sin(i / 10) * 100,
		}));
		const result = lttbDownsample(data, 20);
		expect(result).toHaveLength(20);
	});

	it("첫 번째와 마지막 포인트를 보존한다", () => {
		const data = Array.from({ length: 100 }, (_, i) => ({
			x: i,
			y: Math.sin(i / 10) * 100,
		}));
		const result = lttbDownsample(data, 20);
		expect(result[0]).toEqual(data[0]);
		expect(result[result.length - 1]).toEqual(data[data.length - 1]);
	});

	it("빈 배열을 처리한다", () => {
		const result = lttbDownsample([], 10);
		expect(result).toEqual([]);
	});

	it("1개 포인트를 처리한다", () => {
		const data = [{ x: 0, y: 1 }];
		const result = lttbDownsample(data, 10);
		expect(result).toEqual(data);
	});

	it("2개 포인트를 처리한다", () => {
		const data = [
			{ x: 0, y: 1 },
			{ x: 1, y: 2 },
		];
		const result = lttbDownsample(data, 1);
		expect(result).toEqual(data);
	});

	it("피크 값을 보존하는 경향이 있다", () => {
		const data = Array.from({ length: 200 }, (_, i) => ({
			x: i,
			y: i === 100 ? 1000 : 10,
		}));
		const result = lttbDownsample(data, 20);
		const maxY = Math.max(...result.map((p) => p.y));
		expect(maxY).toBe(1000);
	});
});

describe("extractSensorSeries", () => {
	const mockPoints = createMockDataPoints(2);

	it("temperature 센서 시리즈를 추출한다", () => {
		const result = extractSensorSeries(mockPoints, "temperature");
		expect(result).toHaveLength(2);
		expect(result[0].y).toBe(mockPoints[0].sensors.temperature);
	});

	it("pressure 센서 시리즈를 추출한다", () => {
		const result = extractSensorSeries(mockPoints, "pressure");
		expect(result[0].y).toBe(mockPoints[0].sensors.pressure);
	});

	it("rfPower 센서 시리즈를 추출한다", () => {
		const result = extractSensorSeries(mockPoints, "rfPower");
		expect(result[0].y).toBe(mockPoints[0].sensors.rfPower);
	});

	it("wallClock 모드에서 x 값이 타임스탬프의 밀리초 값이다", () => {
		const result = extractSensorSeries(mockPoints, "temperature", "wallClock");
		expect(result[0].x).toBe(new Date(mockPoints[0].timestamp).getTime());
	});

	it("elapsed 모드에서 x 값이 elapsedSec이다", () => {
		const result = extractSensorSeries(mockPoints, "temperature", "elapsed");
		expect(result[0].x).toBe(mockPoints[0].elapsedSec);
		expect(result[1].x).toBe(mockPoints[1].elapsedSec);
	});
});
