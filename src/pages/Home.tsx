import React, { useEffect, useRef, useState } from "react";
import Div100vh from "react-div-100vh";
import { IoMdMenu } from "react-icons/io";
import styled, { keyframes } from "styled-components";
import SideBar, { Channel } from "../components/home/SideBar";
import { IoMdSend } from "react-icons/io";
import ChatItem from "../components/home/ChatItem";
import DateDivider from "../components/home/DateDivider";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../api/firebase";
import useSendChat, { SendChatPayload } from "../hooks/chat/useSendChat";
import useGetUserProfile from "../hooks/profile/useGetUserProfile";

const MONTH_NAMES = [
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

function Home() {
	const { channelId } = useParams();

	const [sideBarisOpen, setSideBarisOpen] = useState(false);
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<Message[]>();
	const [enteredMessage, setEnteredMessage] = useState("");
	const [activeChannel, setActiveChannel] = useState<Channel>();

	const { mutate: sendChat } = useSendChat();
	const { data: userData } = useGetUserProfile();

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.scrollTop = ref.current?.scrollHeight;
	}, [messages]);

	useEffect(() => {
		if (!channelId) return;

		setIsLoading(true);
		const unsubscribe = onSnapshot(doc(db, "chat/" + channelId), (doc) => {
			setMessages(doc.data()?.messages as Message[]);
			setIsLoading(false);
		});

		return () => {
			unsubscribe();
		};
	}, [channelId]);

	function sendMessage(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!channelId || !userData) return;

		const payload: SendChatPayload = {
			channelId,
			message: {
				displayName: userData.displayName,
				message: enteredMessage,
				time: Timestamp.fromDate(new Date()),
			},
		};
		if (userData.photoURL) payload.message.photoURL = userData.photoURL;

		sendChat(payload);
		setEnteredMessage("");
	}

	function getChatContent() {
		let prevDate: Date | null = null;

		return messages?.map((message, i) => {
			const curDate = message.time.toDate();
			const displayDivider = prevDate?.toDateString() !== curDate.toDateString();
			prevDate = curDate;

			return (
				<React.Fragment key={i}>
					{displayDivider && (
						<DateDivider>
							{`${MONTH_NAMES[curDate.getMonth()]} ${curDate.getDate()}, ${curDate.getFullYear()}`}
						</DateDivider>
					)}
					<ChatItem name={message.displayName} image={message.photoURL} time={message.time}>
						{message.message}
					</ChatItem>
				</React.Fragment>
			);
		});
	}

	return (
		<Container onClick={() => setLogoutModalOpen(false)}>
			<SideBar
				logoutModalOpen={logoutModalOpen}
				setLogoutModalOpen={setLogoutModalOpen}
				isOpen={sideBarisOpen}
				closeSideBar={() => setSideBarisOpen(false)}
				activeChannel={activeChannel}
				setActiveChannel={setActiveChannel}
			/>
			<ChatsContainer>
				<Top>
					<div className="menu" onClick={() => setSideBarisOpen(true)}>
						<IoMdMenu />
					</div>
					<div>{activeChannel?.name || "Welcome"}</div>
				</Top>
				{isLoading && (
					<LoadingContainer>
						<Spinner />
					</LoadingContainer>
				)}
				{!isLoading && <Middle ref={ref}>{getChatContent()}</Middle>}
				<Bottom onSubmit={sendMessage}>
					<input
						type="text"
						placeholder="Type a message here"
						onChange={(e) => setEnteredMessage(e.target.value)}
						value={enteredMessage}
					/>
					<button type="submit">
						<IoMdSend />
					</button>
				</Bottom>
			</ChatsContainer>
		</Container>
	);
}

export default Home;

const spinner = keyframes`
   100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	border-left: 2px solid white;
	animation: ${spinner} 1s linear infinite;
`;

const Middle = styled.div`
	overflow-y: auto;
	flex: 1;
	margin-top: auto;
	padding: 0 7rem;
	display: flex;
	flex-direction: column;
	gap: 3.8rem;

	& > :first-child {
		margin-top: auto;
	}

	&::-webkit-scrollbar {
		width: 5px;
	}

	&::-webkit-scrollbar-track {
		background-color: rgba(0, 0, 0, 0.1);
		border-radius: 100rem;
	}

	&::-webkit-scrollbar-thumb {
		height: 1rem;
		background: rgba(255, 255, 255, 0.6);
		border-radius: 100rem;
	}

	@media only screen and (max-width: 900px) {
		padding: 0 1.5rem;
	}
`;

const LoadingContainer = styled(Middle)`
	display: grid;
	place-items: center;
	justify-content: center;

	& > :first-child {
		margin-top: 0;
	}
`;

const Bottom = styled.form`
	padding: 4rem 7rem;
	position: relative;

	button {
		position: absolute;
		height: 3.9rem;
		width: 3.9rem;
		display: grid;
		place-items: center;
		right: 7.6rem;
		bottom: 4.75rem;
		background-color: #2d9cdb;
		border-radius: 8px;
		font-size: 2.4rem;
		color: white;
	}

	input {
		padding: 1.7rem;
		border-radius: 8px;
		border: none;
		color: #bdbdbd;
		width: 100%;
		background-color: #3c393f;
		font-size: 1.4rem;
		font-weight: 500;

		&::placeholder {
			color: #828282;
		}
	}

	@media only screen and (max-width: 900px) {
		padding: 1.5rem;

		button {
			right: 2rem;
			bottom: 2.25rem;
		}
	}
`;

const Top = styled.div`
	text-transform: uppercase;
	font-weight: 700;
	padding: 1.7rem 7rem;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	font-size: 1.8rem;
	display: flex;
	gap: 2.1rem;
	align-items: center;
	margin-bottom: 2rem;

	.menu {
		font-size: 2.4rem;
		display: none;
		cursor: pointer;
	}

	@media only screen and (max-width: 900px) {
		padding: 1.7rem 1.9rem;

		.menu {
			display: grid;
			place-items: center;
		}
	}
`;

const ChatsContainer = styled.div`
	flex: 1 1;
	display: flex;
	flex-direction: column;
`;

const Container = styled(Div100vh)`
	background-color: #252329;
	color: #e0e0e0;
	display: flex;
`;
