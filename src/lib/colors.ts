import curriedLighten from "polished/lib/color/lighten";

const Colors = {
	primaryColor: "#25292e",
	secondaryColor: "#FFFFFF",
	white: "#FFF",
	tintColor: "#5090ea",
	grey: "#DBDBDB",
	darkerGray: "#788796",
	textColor: "rgb(86, 90, 105)",
	transparentGrey: "#b7caed55",
	semiTransparentGrey: "#b7caedbb",
	transparentGrey2: "#a7b7d455",
	transparentDarkGrey: "rgba(0, 0, 0, 0.7)",
	transparentPrimaryColorSuper: "#25292e44",
	transparentPrimaryColorSuperDuper: "#25292e10",

	semiTransparentPrimaryColor: "#25292eCC",

	transparentPrimaryColor: "#25292e99",
	transparentWhiteSuper: "#FFFFFF44",

	transparentWhite: "#FFFFFF99",
	semiTransparentWhite: "#FFFFFFCC",
	transparentLightGrey: "#c9d9f255",
	transparentLightGrey2: "#c9d9f299",
	transparentDarkGrey2: "rgba(0, 0, 0, 0.2)",
	orange: "#ee7752",
	blue: "#0066ff",
	etherscanBlue: "#21325b",
	red: "#FF4040",
	purple: "#8A2BE2",
	darkRed: "#8a3434",
	green: "#00C781",
	transparentGreen: "#00C78199",
	transparentYellow: "#F3BE1E44",
	transparentRed: "#FF404044",

	darkGreen: "#22a879",
	beige: "#EDEAE5",
	mainGold: "rgb(246,168,0)",
	mainBlue: "rgb(54,134,255)",
	mainBlueTransparent: "rgba(80, 144, 234, 0.20)",
	mainBlueTransparentNoAlpha: "rgb(192, 215, 247)",
	mainBlueSemiTransparent: "rgba(80, 144, 234, 0.60)",
	mainGreenSemiTransparent: "#00C78188",
	mainRedText: "rgb(255, 104, 114)",
	mainRedTransparent: "rgba(255, 104, 114, 0.20)",
	mainRedSemiTransparent: "rgba(255, 104, 114, 0.50)",
	transparent: "rgba(0,0,0,0)",
	mainBlueText: "#5090ea",
	mainRed: "rgb(255,64,64)",
	gradientRed: "#FF6871",
	gradientRedTransparent: "#FF687188",
	gradientRedLight: "#ffe8ea",
	gradientGold: "#F3BE1E",
	gradientPink: "#e856d0",
	pink: "#E644CB",
	pinkGradient: "linear-gradient(-45deg, #E644CB 0%, #FFFFFF 300%)",

	chartbg: "#8a3434",
	chargbg0: "rgba(0, 0, 0, 0.3)",
	gradient: `linear-gradient(128.17deg, #FF6871 -14.78%, #F3BE1E 110.05%)`,
	gradientTransparent: `linear-gradient(128.17deg, #FF6871BB -14.78%, #F3BE1EBB 110.05%)`,
	gradient2: `linear-gradient(128.17deg, #5090ea -14.78%, #00C781 110.05%)`,
	gradient2Transparent: `linear-gradient(128.17deg, rgb(80, 144, 234, .5) -14.78%, #00C78188 110.05%)`,
	gradient3: "linear-gradient(-45deg, #e856d0 -35%, #FF6871 100%)",
	gradient3Transparent: "linear-gradient(-90deg, #e856d088 0%, #FF687188 100%)",
	gradient4Transparent: "linear-gradient(90deg,  rgba(0, 0, 0, 0.1) 0%, rgb(80, 144, 234, .1) 100%)",

	gradientRadialTransparent: "radial-gradient(50% 50% at 50% 50%, rgb(80, 144, 234, .1) 0%, rgba(80, 144, 234, .34) 100%)",
	gradientRadialPurpleTransparent: "radial-gradient(50% 50% at 50% 50%, rgb(80, 144, 234, .1) 0%, rgb(80, 144, 234, .5) 100%)",
	gradient4: "rgb(86, 90, 105)",
	background: "white",
	shadowmainPink: "#b347a1",
	shadowmainBlue: "#255aa8",
	shadowGrey: "#788796",
	shadowLightGrey: "rgba(0, 0, 0, 0.1)",
} as const;

export const gradify = (col: string) => {
	// console.log(
	//     `radial-gradient(50% 50% at 50% 50%, ${curriedLighten(0.01)(col)} 0%, ${curriedLighten(
	//         0.01,
	//     )(col)} 100%)'`,
	// );
	return `linear-gradient(128.17deg, ${curriedLighten(0.01)(col)}-14.78%, ${curriedLighten(0.01)(
		col,
	)} 0%, ${curriedLighten(0.01)(col)} 110.05%)'`;
};

export default Colors;
// #ee7752, #e73c7e, #23a6d5, #23d5ab
