"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { FunctionComponent } from "react";
import { IoClose } from "react-icons/io5";

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
				className="fixed inset-0 backdrop-blur-3xl transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
			/>

			<div className="fixed inset-0 z-10 flex items-center justify-center">
				<button
					className="absolute bottom-4 right-4 p-3 rounded-full text-gray-800 z-50 hover:scale-110 transform transition duration-200 ease-in-out backdrop-blur-lg bg-red-400 bg-opacity-50 shadow-2xl"
					onClick={() => {
						setOpen(false);
					}}
				>
					<IoClose size={30} />
				</button>
				<DialogPanel transition className="relative w-full  shadow-xl h-full max-h-screen-xl overflow-y-auto  overflow-x-hidden">
					<div className="h-full p-4">{children}</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};

export default Modal;
