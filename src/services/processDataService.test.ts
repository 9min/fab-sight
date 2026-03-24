import { MOCK_LOTS } from "@/mocks/mockLots";
import { describe, expect, it } from "vitest";
import { getLotData } from "./processDataService";

describe("getLotData", () => {
	it("존재하는 lotId로 조회하면 데이터를 반환한다", () => {
		const result = getLotData(MOCK_LOTS[0].lotId);
		expect(result).toBeDefined();
		expect(result?.lotId).toBe(MOCK_LOTS[0].lotId);
	});

	it("존재하지 않는 lotId로 조회하면 undefined를 반환한다", () => {
		const result = getLotData("NON-EXISTENT");
		expect(result).toBeUndefined();
	});
});
