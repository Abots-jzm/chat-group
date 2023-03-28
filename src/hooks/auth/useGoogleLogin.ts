import { useAppDispatch } from "./../../store/hooks";
import { signInWithPopup } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../../api/firebase";
import { authActions } from "../../store/slices/authSlice";
import { googleAuthProvider } from "./types";

async function googleLogin() {
	return await signInWithPopup(auth, googleAuthProvider);
}

function useGoogleLogin() {
	const dispatch = useAppDispatch();

	return useMutation(googleLogin, {
		onSuccess(data) {
			dispatch(authActions.login(data.user.uid));
		},
	});
}

export default useGoogleLogin;
