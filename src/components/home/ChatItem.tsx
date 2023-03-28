import { Timestamp } from "firebase/firestore";
import React from "react";
import styled from "styled-components";
import BlankPicture from "../../assets/blank-profile-picture.png";

type Props = {
	image?: string;
	name: string;
	time: Timestamp;
	children: React.ReactNode;
};

function ChatItem({ image, name, time, children }: Props) {
	function formatDate(timestamp: Timestamp): string {
		const date = new Date(timestamp.toDate());
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);

		if (seconds < 60) {
			return "Just now";
		} else if (seconds < 60 * 60) {
			const minutes = Math.floor(seconds / 60);
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else if (seconds < 60 * 60 * 24) {
			const hours = Math.floor(seconds / (60 * 60));
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (date.getFullYear() === now.getFullYear()) {
			const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
			const day = date.toLocaleDateString(undefined, options);
			const time = date.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });
			if (seconds < 60 * 60 * 24 * 2) {
				return `Yesterday at ${time}`;
			} else {
				return `${day} at ${time}`;
			}
		} else {
			const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
			const day = date.toLocaleDateString(undefined, options);
			const time = date.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });
			return `${day} at ${time}`;
		}
	}

	return (
		<Container>
			<Photo>
				<img src={image || BlankPicture} alt="avatar" />
			</Photo>
			<Right>
				<div className="name">{name}</div>
				<div className="time">{formatDate(time)}</div>
				<div className="message">{children}</div>
			</Right>
		</Container>
	);
}

export default ChatItem;

const Right = styled.div`
	color: #828282;
	font-size: 1.8rem;

	.name {
		display: inline-block;
		font-weight: 700;
		margin-right: 2rem;
	}

	.time {
		display: inline-block;
		font-size: 1.4rem;
		font-weight: 500;
	}

	.message {
		display: block;
		color: #e0e0e0;
		margin-top: 0.8rem;
	}
`;

const Photo = styled.div`
	overflow: hidden;
	border-radius: 7px;
	height: 4.2rem;
	width: 4.2rem;
	flex-shrink: 0;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
`;

const Container = styled.div`
	display: flex;
	gap: 2.8rem;

	@media only screen and (max-width: 900px) {
		gap: 1.7rem;
	}
`;
