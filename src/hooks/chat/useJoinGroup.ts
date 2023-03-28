import { useMutation } from "@tanstack/react-query";
import { db } from "../../api/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { JoinGroupPayload } from "./types";

async function joinGroup(payload: JoinGroupPayload) {
	return await updateDoc(doc(db, "default/members"), {
		[payload.channelId]: arrayUnion(payload.user),
	});
}

function useJoinGroup() {
	return useMutation(joinGroup);
}

export default useJoinGroup;
