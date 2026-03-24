/** Tailwind CSS 클래스 조건부 병합 유틸리티 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
	return classes.filter(Boolean).join(" ");
}
