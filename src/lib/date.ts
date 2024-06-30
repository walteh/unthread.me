const getUnix = () => {
	const now = new Date();
	return Math.floor(now.getTime() / 1000);
};

export default { getUnix };
