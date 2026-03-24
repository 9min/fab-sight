import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex min-h-screen flex-col bg-slate-900 text-slate-100">
				<header className="flex h-14 items-center border-b border-slate-700 px-6">
					<h1 className="text-lg font-semibold">FabSight</h1>
				</header>
				<main className="flex flex-1 items-center justify-center">
					<p className="text-slate-400">대시보드 준비 중...</p>
				</main>
			</div>
		</QueryClientProvider>
	);
}
