import { Theme } from "../session_store";
import useSessionStore from "./useSessionStore";

export function useTheme(): Theme | undefined {
	const { user, media } = useSessionStore((state) => state.darkmode);

	return user ?? media;
}

export function useDarkMode(): boolean {
	const theme = useTheme();

	return theme === Theme.DARK;
}
