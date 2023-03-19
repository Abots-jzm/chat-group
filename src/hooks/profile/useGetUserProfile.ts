import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../api/firebase";
import { paths } from "../../App";
import { useAppSelector } from "../../store/hooks";

async function getUserProfile(userId: string) {
	return await getDoc(doc(db, "users/" + userId));
}

function useGetUserProfile(enabled?: boolean, nextPath?: string) {
	const userId = useAppSelector((state) => state.auth.uid);
	const navigate = useNavigate();

	return useQuery(["user-profile"], () => getUserProfile(userId!), {
		enabled: enabled ?? true,
		refetchOnWindowFocus: false,
		select: (data) => data.data(),
		onSuccess(data) {
			if (enabled === undefined) return;

			if (!data) navigate(paths.PROFILE, { replace: true });
			else navigate(nextPath || paths.HOME, { replace: true });
		},
	});
}

export default useGetUserProfile;
