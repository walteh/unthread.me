const ThreadsButton = ({ username, className = "" }: { username: string; className: string }) => {
	return (
		<button
			onClick={() => {
				window.open("https://threads.net/@walt_eh", "_blank");
			}}
			style={{ fontSize: "0.6rem" }}
			className={
				" shadow-sm inline-flex items-center gap-x-1.5 rounded-full bg-black dark:bg-white dark:text-black px-2 py-1 text-xs font-medium text-white font-rounded  hover:scale-115 transform transition duration-200 ease-in-out " +
				className
			}
		>
			by <img width={10} className="-mr-1 dark:hidden" src={"./threads-logo-white.svg"}></img>
			<img width={10} className="-mr-1  hidden dark:block" src={"./threads-logo-black.svg"}></img> {username}
		</button>
	);
};

export default ThreadsButton;
