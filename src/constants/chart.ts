/** 이상 탐지 임계값 (높음) */
export const ANOMALY_THRESHOLD_HIGH = 0.8;

/** 이상 탐지 임계값 (중간) */
export const ANOMALY_THRESHOLD_MEDIUM = 0.5;

/** 신뢰 구간 밴드 색상 (green-500, 10% 투명도) */
export const CONFIDENCE_BAND_COLOR = "rgba(34, 197, 94, 0.1)";

/** 높은 이상치 색상 (red-600) */
export const ANOMALY_HIGH_COLOR = "#DC2626";

/** 중간 이상치 색상 (amber-500) */
export const ANOMALY_MEDIUM_COLOR = "#F59E0B";

/** Golden Lot 선 색상 (gray-500) */
export const GOLDEN_LOT_COLOR = "#6B7280";

/** Golden Lot 선 스타일 */
export const GOLDEN_LOT_LINE_STYLE = "dashed" as const;

/** 차트 다운샘플링 임계치 (이 이상이면 LTTB 적용) */
export const DOWNSAMPLE_THRESHOLD = 5000;

/** 다운샘플링 목표 포인트 수 */
export const DOWNSAMPLE_TARGET = 2000;
