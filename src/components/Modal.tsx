"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FunctionComponent } from "react";

import useModalStore from "@src/client/hooks/useModalStore";

const Modal: FunctionComponent<{
	children: React.ReactNode;
}> = ({ children }) => {
	const open = useModalStore((state) => state.open);
	const setOpen = useModalStore((state) => state.setOpen);

	return (
		<Dialog open={open} onClose={setOpen} className="relative z-10">
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>

			<div className="fixed inset-0 z-10 flex items-center justify-center p-4">
				<DialogPanel
					as="div"
					transition
					className="relative w-full max-w-screen-xl max-h-[95vh] p-6 bg-white shadow-xl rounded-2xl  sm:h-full sm:max-h-screen-xl overflow-y-auto"
				>
					<div className="h-full">{children}</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

export default Modal;
