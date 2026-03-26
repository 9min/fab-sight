import type { ProcessResult, R2RAdjustment } from "@/types/fab";

/**
 * CVD-01 Chamber A R2R 조정값 (온도 기준)
 * Run #1~4: 안정 (작은 조정), Run #5~7: drift 감지 → 보정 증가, Run #8~10: 수렴
 */
export const MOCK_R2R_ADJUSTMENTS: R2RAdjustment[] = [
	// Run #1 (Golden) — 기준, 조정 없음
	{
		runNumber: 1,
		lotId: "LOT-GOLDEN-001",
		sensorKey: "temperature",
		targetSetpoint: 400.0,
		actualMean: 400.2,
		adjustment: 0,
	},
	{
		runNumber: 1,
		lotId: "LOT-GOLDEN-001",
		sensorKey: "pressure",
		targetSetpoint: 3.5,
		actualMean: 3.51,
		adjustment: 0,
	},
	// Run #2 — 미세 조정
	{
		runNumber: 2,
		lotId: "LOT-20240301-A",
		sensorKey: "temperature",
		targetSetpoint: 400.0,
		actualMean: 400.3,
		adjustment: -0.3,
	},
	{
		runNumber: 2,
		lotId: "LOT-20240301-A",
		sensorKey: "pressure",
		targetSetpoint: 3.5,
		actualMean: 3.52,
		adjustment: -0.02,
	},
	// Run #3
	{
		runNumber: 3,
		lotId: "LOT-20240301-B",
		sensorKey: "temperature",
		targetSetpoint: 399.7,
		actualMean: 400.1,
		adjustment: -0.4,
	},
	{
		runNumber: 3,
		lotId: "LOT-20240301-B",
		sensorKey: "pressure",
		targetSetpoint: 3.48,
		actualMean: 3.5,
		adjustment: -0.02,
	},
	// Run #4
	{
		runNumber: 4,
		lotId: "LOT-20240301-C",
		sensorKey: "temperature",
		targetSetpoint: 399.3,
		actualMean: 399.8,
		adjustment: -0.5,
	},
	{
		runNumber: 4,
		lotId: "LOT-20240301-C",
		sensorKey: "pressure",
		targetSetpoint: 3.46,
		actualMean: 3.49,
		adjustment: -0.03,
	},
	// Run #5 — drift 시작
	{
		runNumber: 5,
		lotId: "LOT-20240302-A",
		sensorKey: "temperature",
		targetSetpoint: 398.8,
		actualMean: 401.5,
		adjustment: -2.7,
	},
	{
		runNumber: 5,
		lotId: "LOT-20240302-A",
		sensorKey: "pressure",
		targetSetpoint: 3.43,
		actualMean: 3.55,
		adjustment: -0.12,
	},
	// Run #6 — drift 심화
	{
		runNumber: 6,
		lotId: "LOT-20240302-B",
		sensorKey: "temperature",
		targetSetpoint: 396.1,
		actualMean: 402.8,
		adjustment: -6.7,
	},
	{
		runNumber: 6,
		lotId: "LOT-20240302-B",
		sensorKey: "pressure",
		targetSetpoint: 3.31,
		actualMean: 3.6,
		adjustment: -0.29,
	},
	// Run #7 — drift 정점
	{
		runNumber: 7,
		lotId: "LOT-20240302-C",
		sensorKey: "temperature",
		targetSetpoint: 389.4,
		actualMean: 403.5,
		adjustment: -14.1,
	},
	{
		runNumber: 7,
		lotId: "LOT-20240302-C",
		sensorKey: "pressure",
		targetSetpoint: 3.02,
		actualMean: 3.62,
		adjustment: -0.6,
	},
	// Run #8 — R2R 보정 적용, 수렴 시작
	{
		runNumber: 8,
		lotId: "LOT-20240303-A",
		sensorKey: "temperature",
		targetSetpoint: 385.0,
		actualMean: 401.2,
		adjustment: -1.2,
	},
	{
		runNumber: 8,
		lotId: "LOT-20240303-A",
		sensorKey: "pressure",
		targetSetpoint: 3.4,
		actualMean: 3.54,
		adjustment: -0.14,
	},
	// Run #9 — 수렴 중
	{
		runNumber: 9,
		lotId: "LOT-20240303-B",
		sensorKey: "temperature",
		targetSetpoint: 399.0,
		actualMean: 400.5,
		adjustment: -0.5,
	},
	{
		runNumber: 9,
		lotId: "LOT-20240303-B",
		sensorKey: "pressure",
		targetSetpoint: 3.46,
		actualMean: 3.52,
		adjustment: -0.06,
	},
	// Run #10 — 안정 복귀
	{
		runNumber: 10,
		lotId: "LOT-20240303-C",
		sensorKey: "temperature",
		targetSetpoint: 399.5,
		actualMean: 400.1,
		adjustment: -0.1,
	},
	{
		runNumber: 10,
		lotId: "LOT-20240303-C",
		sensorKey: "pressure",
		targetSetpoint: 3.48,
		actualMean: 3.5,
		adjustment: -0.02,
	},
];

/**
 * CVD-01 Chamber A 공정 결과 메트릭
 * drift 구간(Run #5~7)에서 막두께 증가, 균일도 저하
 */
export const MOCK_PROCESS_RESULTS: ProcessResult[] = [
	{ lotId: "LOT-GOLDEN-001", runNumber: 1, filmThickness: 1000, uniformity: 98.5, defectCount: 2 },
	{ lotId: "LOT-20240301-A", runNumber: 2, filmThickness: 1003, uniformity: 98.2, defectCount: 3 },
	{ lotId: "LOT-20240301-B", runNumber: 3, filmThickness: 998, uniformity: 97.8, defectCount: 2 },
	{ lotId: "LOT-20240301-C", runNumber: 4, filmThickness: 1005, uniformity: 97.5, defectCount: 4 },
	{ lotId: "LOT-20240302-A", runNumber: 5, filmThickness: 1018, uniformity: 96.1, defectCount: 7 },
	{ lotId: "LOT-20240302-B", runNumber: 6, filmThickness: 1032, uniformity: 94.8, defectCount: 12 },
	{ lotId: "LOT-20240302-C", runNumber: 7, filmThickness: 1041, uniformity: 93.5, defectCount: 18 },
	{ lotId: "LOT-20240303-A", runNumber: 8, filmThickness: 1022, uniformity: 95.2, defectCount: 9 },
	{ lotId: "LOT-20240303-B", runNumber: 9, filmThickness: 1008, uniformity: 97.1, defectCount: 5 },
	{ lotId: "LOT-20240303-C", runNumber: 10, filmThickness: 1002, uniformity: 98.0, defectCount: 3 },
];
