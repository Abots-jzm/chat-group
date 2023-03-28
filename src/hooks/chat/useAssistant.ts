import { useMutation } from "@tanstack/react-query";
import openai from "../../api/openai";

async function askAssistant(payload: string) {
	return await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: "You are a helpful assistant" },
			{ role: "user", content: payload },
		],
	});
}

function useAssistant() {
	return useMutation(askAssistant);
}

export default useAssistant;
