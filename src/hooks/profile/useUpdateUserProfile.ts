import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db, storage } from "../../api/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

type Payload = {
	photo?: File;
	dispayName: string;
	uid: string;
};

async function updateProfile(payload: Payload) {
	let url;
	if (payload.photo) {
		const imagesRef = ref(storage, payload.uid);
		const snapShot = await uploadBytes(imagesRef, payload.photo);
		url = await getDownloadURL(snapShot.ref);
	}
	return await setDoc(
		doc(db, "users", payload.uid),
		{ photoURL: url, displayName: payload.dispayName },
		{ merge: true }
	);
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
