import React, { useEffect, useRef, useState } from "react";
import Div100vh from "react-div-100vh";
import { IoMdMenu } from "react-icons/io";
import styled, { keyframes } from "styled-components";
import SideBar from "../components/home/SideBar";
import { IoMdSend } from "react-icons/io";
import ChatItem from "../components/home/ChatItem";
import DateDivider from "../components/home/DateDivider";
import { useParams } from "react-router-dom";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../api/firebase";
import useSendChat from "../hooks/chat/useSendChat";
import useGetUserProfile from "../hooks/profile/useGetUserProfile";
import useAssistant from "../hooks/chat/useAssistant";
import GPTLogo from "../assets/ChatGPT_Logo_PNG1.png";
import { Channel } from "../components/home/types";
import { SendChatPayload } from "../hooks/chat/types";
import { Message, MONTH_NAMES } from "./types";

function Home() {
	const { channelId } = useParams();

	const [sideBarisOpen, setSideBarisOpen] = useState(false);
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<Message[]>();
	const [assistantMessages, setAssistantMessages] = useState<Message[]>([]);
	const [isAssistantChannel, setIsAssistantChannel] = useState(false);
	const [enteredMessage, setEnteredMessage] = useState("");
	const [activeChannel, setActiveChannel] = useState<Channel>();

	const { mutate: sendChat } = useSendChat();
	const { data: userData } = useGetUserProfile();
	const { mutate: askAssistant, isLoading: AILoading } = useAssistant();

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (ref.current) ref.current.scrollTop = ref.current?.scrollHeight;
	}, [messages]);

	useEffect(() => {
		if (!channelId) return;

		if (channelId === "assistant") {
			setIsAssistantChannel(true);
			return;
		}

		setIsAssistantChannel(false);
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

		if (isAssistantChannel) {
			const newUserMessage: Message = {
				displayName: userData.displayName,
				message: enteredMessage,
				time: Timestamp.fromDate(new Date()),
			};
			if (userData.photoURL) newUserMessage.photoURL = userData.photoURL;
			setAssistantMessages((prev) => [...prev, newUserMessage]);
			askAssistant(enteredMessage, {
				onSuccess(data) {
					const newAssistantMessage: Message = {
						displayName: "AI Assistant",
						time: Timestamp.fromDate(new Date()),
						message: data.data.choices[0].message?.content || "An error occurred",
						photoURL: GPTLogo,
					};
					setAssistantMessages((prev) => [...prev, newAssistantMessage]);
				},
				onError() {
					const newAssistantMessage: Message = {
						displayName: "AI Assistant",
						time: Timestamp.fromDate(new Date()),
						message: "An error occurred",
						photoURL: GPTLogo,
					};
					setAssistantMessages((prev) => [...prev, newAssistantMessage]);
				},
			});
			setEnteredMessage("");
			return;
		}

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
				{isAssistantChannel && (
					<Middle ref={ref}>
						{assistantMessages.map((message, i) => (
							<ChatItem name={message.displayName} time={message.time} image={message.photoURL} key={i}>
								{message.message}
							</ChatItem>
						))}
						{AILoading && (
							<ChatItem name="AI Assistant" image={GPTLogo} time={Timestamp.fromDate(new Date())}>
								<AILoadingSpinner>
									<div className="inner one" />
									<div className="inner two" />
									<div className="inner three" />
								</AILoadingSpinner>
							</ChatItem>
						)}
					</Middle>
				)}
				{isLoading && !isAssistantChannel && (
					<LoadingContainer>
						<Spinner />
					</LoadingContainer>
				)}
				{!isLoading && !isAssistantChannel && <Middle ref={ref}>{getChatContent()}</Middle>}
				<Bottom onSubmit={sendMessage}>
					<input
						type="text"
						placeholder="Type a message here"
						onChange={(e) => setEnteredMessage(e.target.value)}
						value={enteredMessage}
						required
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

const rotateOne = keyframes`
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
}`;

const rotateTwo = keyframes`
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
`;

const rotateThree = keyframes`
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
`;

const AILoadingSpinner = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	perspective: 800px;

	.inner {
		position: absolute;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.inner.one {
		left: 0%;
		top: 0%;
		animation: ${rotateOne} 1s linear infinite;
		border-bottom: 3px solid #efeffa;
	}

	.inner.two {
		right: 0%;
		top: 0%;
		animation: ${rotateTwo} 1s linear infinite;
		border-right: 3px solid #efeffa;
	}

	.inner.three {
		right: 0%;
		bottom: 0%;
		animation: ${rotateThree} 1s linear infinite;
		border-top: 3px solid #efeffa;
	}
`;

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
