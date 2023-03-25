import { useMutation } from "@tanstack/react-query";
import { db } from "../../api/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { UserData } from "../profile/useGetUserProfile";

type Payload = {
	user: UserData;
	channelId: string;
};

async function joinGroup(payload: Payload) {
	return await updateDoc(doc(db, "default/members"), {
		[payload.channelId]: arrayUnion(payload.user),
	});
}

function useJoinGroup() {
	return useMutation(joinGroup);
}

export default useJoinGroup;
