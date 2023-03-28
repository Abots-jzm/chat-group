export type Channel = {
	description: string;
	id: string;
	name: string;
};

export const AssistantChannel: Channel = {
	name: "AI Assistant",
	description: "This is your personal AI Assistant. Only you has access to the chats here",
	id: "assitant",
};
