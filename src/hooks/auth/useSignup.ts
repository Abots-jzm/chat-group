import { useAppDispatch } from "./../../store/hooks";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../api/firebase";
import { authActions } from "../../store/slices/authSlice";

type EmailAndPassword = {
	email: string;
	password: string;
};

async function signup(payload: EmailAndPassword) {
	return await createUserWithEmailAndPassword(auth, payload.email, payload.password);
}

function useSignup() {
	const dispatch = useAppDispatch();

	return useMutation(signup, {
		onSuccess(data) {
			dispatch(authActions.login(data.user.uid));
		},
	});
}

export default useSignup;
