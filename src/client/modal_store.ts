"use client";

import { create } from "zustand";
import { combine } from "zustand/middleware";

const modal_store = create(
	combine(
		{
			open: false,
		},
		(set) => ({
			setOpen: (value: boolean) => {
				set({ open: value });
			},
		}),
	),
);

export default modal_store;
