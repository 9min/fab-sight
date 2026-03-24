import type {
	AnomalyType,
	ProcessDataPointV3,
	Recipe,
	RecipeStep,
	SensorMeta,
	WaferRun,
} from "@/types/fab";

interface GenerateOptions {
	recipe: Recipe;
	sensorsMeta: SensorMeta[];
	waferCount: number;
	anomalyRatio: number;
	waferVariation: number;
}

const ANOMALY_TYPES: AnomalyType[] = ["drift", "spike", "shift", "oscillation", "out_of_range"];
const THERMAL_TAU = 30;
const FAST_TAU = 10;

function getNoiseSigma(key: string, targetValue: number): number {
	if (key.includes("temperature") || key.includes("Temperature")) return 0.5;
	if (key === "pressure") return Math.max(0.02, Math.abs(targetValue) * 0.005);
	if (key.includes("Power") || key.includes("power")) return 3;
	if (key.includes("Reflected") || key.includes("reflected")) return 1;
	if (key.includes("flow") || key.includes("Flow"))
		return Math.max(1, Math.abs(targetValue) * 0.005);
	if (key === "spacing") return 0.5;
	if (key === "dcBias") return 2;
	return Math.max(0.1, Math.abs(targetValue) * 0.01);
}

function gaussianNoise(sigma: number): number {
	const u1 = Math.random();
	const u2 = Math.random();
	return sigma * Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
}

function round(value: number, decimals: number): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}

function generateAnomalyRegions(
	totalPoints: number,
	anomalyRatio: number,
): Map<number, AnomalyType> {
	const anomalyMap = new Map<number, AnomalyType>();
	const totalAnomalies = Math.floor(totalPoints * anomalyRatio);
	if (totalAnomalies === 0) return anomalyMap;

	const clusterCount = Math.max(1, Math.floor(totalAnomalies / 15));
	const pointsPerCluster = Math.ceil(totalAnomalies / clusterCount);

	for (let c = 0; c < clusterCount; c++) {
		const anomalyType = ANOMALY_TYPES[c % ANOMALY_TYPES.length];
		const startIdx = Math.floor(Math.random() * (totalPoints - pointsPerCluster - 1)) + 1;
		for (let i = 0; i < pointsPerCluster; i++) {
			const idx = startIdx + i;
			if (idx < totalPoints) {
				anomalyMap.set(idx, anomalyType);
			}
		}
	}
	return anomalyMap;
}

/** 단일 센서값을 스텝 target 방향으로 전이시킨다 */
function updateSensorValue(
	currentValue: number,
	target: number,
	key: string,
	waferBias: number,
	anomalyType: AnomalyType | undefined,
): number {
	const tau = key.includes("emperature") ? THERMAL_TAU : FAST_TAU;
	let value = currentValue + (target - currentValue) * (1 / tau);

	const sigma = getNoiseSigma(key, target);
	value += gaussianNoise(sigma);

	if (waferBias !== 0 && target !== 0) {
		value *= 1 + waferBias * 0.1;
	}

	if (anomalyType === "spike") {
		value += gaussianNoise(sigma * 8);
	} else if (anomalyType === "drift") {
		value += sigma * 2;
	} else if (anomalyType === "shift") {
		value += sigma * 5;
	}

	return value;
}

/** 온도-압력 상관관계를 적용한다 */
function applyTempPressureCorrelation(
	currentValues: Record<string, number>,
	sensorKeys: string[],
	prevTemp: number,
): void {
	const newTemp = currentValues.temperature ?? currentValues.escTemperature ?? 0;
	const tempDelta = newTemp - prevTemp;
	if (sensorKeys.includes("pressure") && Math.abs(tempDelta) > 0.01) {
		currentValues.pressure += 0.002 * tempDelta;
	}
}

/** 단일 데이터 포인트를 생성한다 */
function createDataPoint(
	step: RecipeStep,
	sensorKeys: string[],
	currentValues: Record<string, number>,
	waferBias: number,
	elapsedSec: number,
	waferStartTime: number,
	anomalyType: AnomalyType | undefined,
): ProcessDataPointV3 {
	const isAnomaly = anomalyType !== undefined;
	const prevTemp = currentValues.temperature ?? currentValues.escTemperature ?? 0;

	for (const key of sensorKeys) {
		const target = step.targetParams[key] ?? 0;
		currentValues[key] = updateSensorValue(currentValues[key], target, key, waferBias, anomalyType);
	}

	applyTempPressureCorrelation(currentValues, sensorKeys, prevTemp);

	const sensors: Record<string, number> = {};
	for (const key of sensorKeys) {
		sensors[key] = round(currentValues[key], 3);
	}

	const anomalyScore = isAnomaly
		? round(0.5 + Math.random() * 0.5, 3)
		: round(Math.random() * 0.3, 3);

	return {
		timestamp: new Date(waferStartTime + elapsedSec * 1000).toISOString(),
		elapsedSec,
		stepId: step.stepId,
		sensors,
		isAnomaly,
		anomalyScore,
		anomalyType: isAnomaly ? anomalyType : undefined,
	};
}

/** 단일 Wafer의 공정 데이터를 생성한다 */
function generateSingleWaferData(
	recipe: Recipe,
	sensorKeys: string[],
	waferBias: number,
	waferStartTime: number,
	anomalyMap: Map<number, AnomalyType>,
): ProcessDataPointV3[] {
	const currentValues: Record<string, number> = {};
	for (const key of sensorKeys) {
		currentValues[key] = recipe.steps[0].targetParams[key] ?? 0;
	}

	const data: ProcessDataPointV3[] = [];
	let elapsedSec = 0;

	for (const step of recipe.steps) {
		for (let t = 0; t < step.durationSec; t++) {
			const anomalyType = anomalyMap.get(elapsedSec);
			data.push(
				createDataPoint(
					step,
					sensorKeys,
					currentValues,
					waferBias,
					elapsedSec,
					waferStartTime,
					anomalyType,
				),
			);
			elapsedSec++;
		}
	}

	return data;
}

/** 레시피 스텝 기반 Wafer 공정 데이터를 생성한다 */
export function generateWaferRuns(options: GenerateOptions): WaferRun[] {
	const { recipe, sensorsMeta, waferCount, anomalyRatio, waferVariation } = options;
	const sensorKeys = sensorsMeta.map((s) => s.key);
	const totalDuration = recipe.steps.reduce((sum, s) => sum + s.durationSec, 0);
	const baseStartTime = Date.now() - totalDuration * 1000;

	const wafers: WaferRun[] = [];

	for (let w = 0; w < waferCount; w++) {
		const waferBias = waferVariation > 0 ? (Math.random() * 2 - 1) * waferVariation : 0;
		const waferStartTime = baseStartTime + w * (totalDuration + 60) * 1000;
		const anomalyMap = generateAnomalyRegions(totalDuration, anomalyRatio);

		const data = generateSingleWaferData(recipe, sensorKeys, waferBias, waferStartTime, anomalyMap);

		wafers.push({
			waferId: `WF-${String(w + 1).padStart(2, "0")}`,
			slotNumber: w + 1,
			startTime: data[0].timestamp,
			endTime: data[data.length - 1].timestamp,
			data,
		});
	}

	return wafers;
}
