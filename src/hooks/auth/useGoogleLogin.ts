import { useAppDispatch } from "./../../store/hooks";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../../api/firebase";
import { authActions } from "../../store/slices/authSlice";

const provider = new GoogleAuthProvider();

async function googleLogin() {
	return await signInWithPopup(auth, provider);
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
