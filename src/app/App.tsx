import { DrilldownPanel } from "@/components/drilldown/DrilldownPanel";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnomalyToggle } from "@/components/ui/AnomalyToggle";
import { CompareToggle } from "@/components/ui/CompareToggle";
import { LotSelector } from "@/components/ui/LotSelector";
import { SensorCheckboxGroup } from "@/components/ui/SensorCheckbox";
import { queryClient } from "@/lib/queryClient";
import { DashboardPage } from "@/pages/DashboardPage";
import { QueryClientProvider } from "@tanstack/react-query";

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<DashboardLayout
				navControls={
					<>
						<LotSelector />
						<CompareToggle />
					</>
				}
				sidebarContent={
					<>
						<div>
							<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
								센서 선택
							</h2>
							<SensorCheckboxGroup />
						</div>
						<div className="border-t border-slate-700 pt-4">
							<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
								AI 이상 탐지
							</h2>
							<AnomalyToggle />
						</div>
					</>
				}
				chartArea={<DashboardPage />}
				drilldownArea={<DrilldownPanel />}
			/>
		</QueryClientProvider>
	);
}
