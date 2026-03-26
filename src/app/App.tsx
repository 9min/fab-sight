import { DrilldownPanel } from "@/components/drilldown/DrilldownPanel";
import { GlossaryButton } from "@/components/glossary/GlossaryButton";
import { GlossaryDrawer } from "@/components/glossary/GlossaryDrawer";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { R2RAdjustmentPanel } from "@/components/r2r/R2RAdjustmentPanel";
import { AnomalyToggle } from "@/components/ui/AnomalyToggle";
import { ChamberSelector } from "@/components/ui/ChamberSelector";
import { CompareToggle } from "@/components/ui/CompareToggle";
import { EquipmentSelector } from "@/components/ui/EquipmentSelector";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LotSelector } from "@/components/ui/LotSelector";
import { SensorCheckboxGroup } from "@/components/ui/SensorCheckbox";
import { SpecLimitToggle } from "@/components/ui/SpecLimitToggle";
import { ViewModeToggle } from "@/components/ui/ViewModeToggle";
import { WaferCompareToggle } from "@/components/ui/WaferCompareToggle";
import { WaferSelector } from "@/components/ui/WaferSelector";
import { XAxisModeToggle } from "@/components/ui/XAxisModeToggle";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { useProcessData } from "@/hooks/useProcessData";
import { queryClient } from "@/lib/queryClient";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { DashboardPage } from "@/pages/DashboardPage";
import { LotTrendPage } from "@/pages/LotTrendPage";
import { getProcessResults, getR2RAdjustments } from "@/services/processDataServiceV3";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

function AppContent() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const selectedChamberId = useDashboardStore((s) => s.selectedChamberId);
	const activeView = useDashboardStore((s) => s.activeView);
	const trendSensorKey = useDashboardStore((s) => s.trendSensorKey);
	const { data: lotData } = useProcessData(selectedLotId);

	const r2rAdjustments = useMemo(
		() => (selectedChamberId ? getR2RAdjustments(selectedChamberId) : []),
		[selectedChamberId],
	);
	const processResults = useMemo(
		() => (selectedChamberId ? getProcessResults(selectedChamberId) : []),
		[selectedChamberId],
	);

	const sensorsMeta = useMemo(() => {
		if (!lotData) return [];
		const recipe = MOCK_RECIPES.find((r) => r.recipeId === lotData.recipeId);
		if (!recipe) return [];
		return getSensorsForProcess(recipe.processType);
	}, [lotData]);

	const isTimeSeries = activeView === "timeSeries";

	return (
		<>
			<DashboardLayout
				navControls={
					<>
						<EquipmentSelector />
						<ChamberSelector />
						{isTimeSeries && (
							<>
								<LotSelector />
								<WaferSelector />
								<CompareToggle />
							</>
						)}
						<GlossaryButton />
					</>
				}
				sidebarContent={
					isTimeSeries ? (
						<>
							<div className="mb-4 sm:hidden">
								<ViewModeToggle />
							</div>
							<div>
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									센서 선택
								</h2>
								<SensorCheckboxGroup sensorsMeta={sensorsMeta} />
							</div>
							<div className="border-t border-slate-700 pt-4">
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									AI 이상 탐지
								</h2>
								<AnomalyToggle />
							</div>
							<div className="border-t border-slate-700 pt-4">
								<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
									차트 옵션
								</h2>
								<div className="flex flex-col gap-2">
									<SpecLimitToggle />
									<WaferCompareToggle />
									<XAxisModeToggle />
								</div>
							</div>
						</>
					) : (
						<div>
							<div className="mb-4 sm:hidden">
								<ViewModeToggle />
							</div>
							<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
								R2R 트렌딩 설정
							</h2>
							<p className="text-xs text-slate-500">
								장비/챔버를 선택하면 해당 챔버의 연속 Run 트렌드를 확인할 수 있습니다.
							</p>
						</div>
					)
				}
				chartArea={isTimeSeries ? <DashboardPage /> : <LotTrendPage />}
				drilldownArea={
					isTimeSeries ? (
						<DrilldownPanel sensorsMeta={sensorsMeta} />
					) : (
						<R2RAdjustmentPanel
							adjustments={r2rAdjustments}
							processResults={processResults}
							sensorKey={trendSensorKey}
							sensorsMeta={sensorsMeta}
						/>
					)
				}
			/>
			<GlossaryDrawer />
		</>
	);
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ErrorBoundary>
				<AppContent />
			</ErrorBoundary>
		</QueryClientProvider>
	);
}
