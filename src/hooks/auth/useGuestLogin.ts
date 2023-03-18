import { useAppDispatch } from "./../../store/hooks";
import { signInAnonymously } from "firebase/auth";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../../api/firebase";
import { authActions } from "../../store/slices/authSlice";

async function guestLogin() {
	return await signInAnonymously(auth);
}

function useGuestLogin() {
	const dispatch = useAppDispatch();

	return useMutation(guestLogin, {
		onSuccess(data) {
			dispatch(authActions.login(data.user.uid));
		},
	});
}

export default useGuestLogin;
