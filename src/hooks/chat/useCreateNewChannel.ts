import { useMutation } from "@tanstack/react-query";
import { db } from "../../api/firebase";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { CreateChannelPayload } from "./types";

async function createChannel(payload: CreateChannelPayload) {
	const id = Date.now().toString(36) + Math.random().toString(36).substring(2);

	const membersPromise = updateDoc(doc(db, "default/members"), {
		[id]: [payload.user],
	});

	const chatPromise = setDoc(doc(db, "chat/" + id), {
		messages: [],
	});

	const infoPromise = updateDoc(doc(db, "default/info"), {
		channels: arrayUnion({ name: payload.name, description: payload.description, id }),
	});

	await Promise.all([membersPromise, chatPromise, infoPromise]);
}

function useCreateNewChannel() {
	return useMutation(createChannel);
}

export default useCreateNewChannel;
