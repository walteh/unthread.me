export type TimePeriodLabel = "last7days" | "last30days" | "last90days" | `${string} ${number}`;

export interface TimePeriod {
	label: TimePeriodLabel;
	start_date: Date;
	end_date: Date;
}
