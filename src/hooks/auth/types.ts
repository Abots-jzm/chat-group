import { GoogleAuthProvider } from "firebase/auth";

export const googleAuthProvider = new GoogleAuthProvider();

export type EmailAndPassword = {
	email: string;
	password: string;
};
