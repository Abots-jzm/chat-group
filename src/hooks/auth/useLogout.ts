import { useAppDispatch } from "./../../store/hooks";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "../../api/firebase";
import { authActions } from "../../store/slices/authSlice";

async function Logout() {
	return await signOut(auth);
}

function useLogout() {
	const dispatch = useAppDispatch();

	return useMutation(Logout, {
		onSuccess() {
			dispatch(authActions.logout());
		},
	});
}

export default useLogout;
