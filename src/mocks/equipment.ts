import type { Equipment } from "@/types/fab";

export const MOCK_EQUIPMENT: Equipment[] = [
	{
		equipmentId: "equip-cvd-01",
		name: "CVD-01",
		type: "CVD-PECVD",
		chambers: [
			{ chamberId: "cvd01-ch-a", name: "Chamber A", equipmentId: "equip-cvd-01" },
			{ chamberId: "cvd01-ch-b", name: "Chamber B", equipmentId: "equip-cvd-01" },
			{ chamberId: "cvd01-ch-c", name: "Chamber C", equipmentId: "equip-cvd-01" },
		],
	},
	{
		equipmentId: "equip-etch-01",
		name: "ETCH-01",
		type: "ETCH-DEEP",
		chambers: [
			{ chamberId: "etch01-ch-a", name: "Chamber A", equipmentId: "equip-etch-01" },
			{ chamberId: "etch01-ch-b", name: "Chamber B", equipmentId: "equip-etch-01" },
		],
	},
];
