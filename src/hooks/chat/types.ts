import { Message } from "../../pages/types";
import { UserData } from "../profile/types";

export type SendChatPayload = {
	channelId: string;
	message: Message;
};

export type JoinGroupPayload = {
	user: UserData;
	channelId: string;
};

export type CreateChannelPayload = {
	name: string;
	description: string;
	user: UserData;
};
