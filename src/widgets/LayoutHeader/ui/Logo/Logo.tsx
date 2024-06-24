import { FC } from "react";
import { Logo as HeaderLogo } from "@/widgets/LayoutHeader/model/types";

const Logo: FC<HeaderLogo> = ({ logoName }: HeaderLogo) => {
	return (
		<div className="navbar-center">
			<a className="btn-ghost btn text-xl normal-case">{logoName}</a>
		</div>
	);
};

export default Logo;
