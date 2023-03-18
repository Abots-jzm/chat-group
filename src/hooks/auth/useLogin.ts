import { useAppDispatch } from "./../../store/hooks";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../api/firebase";
import { authActions } from "../../store/slices/authSlice";

type EmailAndPassword = {
	email: string;
	password: string;
};

async function login(payload: EmailAndPassword) {
	return await signInWithEmailAndPassword(auth, payload.email, payload.password);
}

function useLogin() {
	const dispatch = useAppDispatch();

	return useMutation(login, {
		onSuccess(data) {
			dispatch(authActions.login(data.user.uid));
		},
	});
}

export default useLogin;
