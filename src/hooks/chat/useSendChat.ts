import { useMutation } from "@tanstack/react-query";
import { db } from "../../api/firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Message } from "../../pages/Home";

export type SendChatPayload = {
	channelId: string;
	message: Message;
};

async function sendChant(payload: SendChatPayload) {
	return await updateDoc(doc(db, "chat/" + payload.channelId), {
		messages: arrayUnion(payload.message),
	});
}

function useSendChat() {
	return useMutation(sendChant);
}

export default useSendChat;
