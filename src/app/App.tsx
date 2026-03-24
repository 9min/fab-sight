import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnomalyToggle } from "@/components/ui/AnomalyToggle";
import { LotSelector } from "@/components/ui/LotSelector";
import { SensorCheckboxGroup } from "@/components/ui/SensorCheckbox";
import { queryClient } from "@/lib/queryClient";
import { DashboardPage } from "@/pages/DashboardPage";
import { QueryClientProvider } from "@tanstack/react-query";

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<DashboardLayout
				navControls={<LotSelector />}
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
				drilldownArea={
					<div className="flex h-full items-center justify-center">
						<p className="text-sm text-slate-500">
							차트에서 타임스탬프를 클릭하면 상세 정보를 확인할 수 있습니다
						</p>
					</div>
				}
			/>
		</QueryClientProvider>
	);
}
