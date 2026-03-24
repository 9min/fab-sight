import { DrilldownPanel } from "@/components/drilldown/DrilldownPanel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnomalyToggle } from "@/components/ui/AnomalyToggle";
import { ChamberSelector } from "@/components/ui/ChamberSelector";
import { CompareToggle } from "@/components/ui/CompareToggle";
import { EquipmentSelector } from "@/components/ui/EquipmentSelector";
import { LotSelector } from "@/components/ui/LotSelector";
import { SensorCheckboxGroup } from "@/components/ui/SensorCheckbox";
import { SpecLimitToggle } from "@/components/ui/SpecLimitToggle";
import { WaferCompareToggle } from "@/components/ui/WaferCompareToggle";
import { WaferSelector } from "@/components/ui/WaferSelector";
import { XAxisModeToggle } from "@/components/ui/XAxisModeToggle";
import { getSensorsForProcess } from "@/constants/sensorConfig";
import { useProcessData } from "@/hooks/useProcessData";
import { queryClient } from "@/lib/queryClient";
import { MOCK_RECIPES } from "@/mocks/recipes";
import { DashboardPage } from "@/pages/DashboardPage";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";

function AppContent() {
	const selectedLotId = useDashboardStore((s) => s.selectedLotId);
	const { data: lotData } = useProcessData(selectedLotId);

	const sensorsMeta = useMemo(() => {
		if (!lotData) return [];
		const recipe = MOCK_RECIPES.find((r) => r.recipeId === lotData.recipeId);
		if (!recipe) return [];
		return getSensorsForProcess(recipe.processType);
	}, [lotData]);

	return (
		<DashboardLayout
			navControls={
				<>
					<EquipmentSelector />
					<ChamberSelector />
					<LotSelector />
					<WaferSelector />
					<CompareToggle />
				</>
			}
			sidebarContent={
				<>
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
			}
			chartArea={<DashboardPage />}
			drilldownArea={<DrilldownPanel sensorsMeta={sensorsMeta} />}
		/>
	);
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AppContent />
		</QueryClientProvider>
	);
}
