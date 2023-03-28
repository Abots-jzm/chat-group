export type UpdateProfilePayload = {
	photo?: File;
	dispayName: string;
	uid: string;
	firstTime: boolean;
};

export type UserData = {
	displayName: string;
	photoURL?: string;
};
