import { UserData } from "./useGetUserProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db, storage } from "../../api/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";

type Payload = {
	photo?: File;
	dispayName: string;
	uid: string;
	firstTime: boolean;
};

async function updateProfile(payload: Payload) {
	let url;
	if (payload.photo) {
		const imagesRef = ref(storage, payload.uid);
		const snapShot = await uploadBytes(imagesRef, payload.photo);
		url = await getDownloadURL(snapShot.ref);
	}

	const user: UserData = { displayName: payload.dispayName };
	if (url) {
		user.photoURL = url;
	}

	if (payload.firstTime)
		await updateDoc(doc(db, "default/members"), {
			NeOBDclT0wL9jASynx0D: arrayUnion(user),
		});

	return await setDoc(doc(db, "users", payload.uid), user, { merge: true });
}

function useUpdateUserProfile() {
	const queryClient = useQueryClient();

	return useMutation(updateProfile, {
		onSuccess() {
			queryClient.invalidateQueries(["user-profile"]);
		},
	});
}

export default useUpdateUserProfile;
