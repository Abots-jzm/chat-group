import { Timestamp } from "firebase/firestore";

export const MONTH_NAMES = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export type Message = {
	displayName: string;
	time: Timestamp;
	message: string;
	photoURL?: string;
};
