import React, { useState } from "react";
import Div100vh from "react-div-100vh";
import { IoMdMenu } from "react-icons/io";
import styled from "styled-components";
import SideBar from "../components/home/SideBar";
import { IoMdSend } from "react-icons/io";
import ChatItem from "../components/home/ChatItem";

function Home() {
	const [sideBarisOpen, setSideBarisOpen] = useState(false);
	const [logoutModalOpen, setLogoutModalOpen] = useState(false);

	function sendMessage(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
	}

	return (
		<Container onClick={() => setLogoutModalOpen(false)}>
			<SideBar
				logoutModalOpen={logoutModalOpen}
				setLogoutModalOpen={setLogoutModalOpen}
				isOpen={sideBarisOpen}
				closeSideBar={() => setSideBarisOpen(false)}
			/>
			<ChatsContainer>
				<Top>
					<div className="menu" onClick={() => setSideBarisOpen(true)}>
						<IoMdMenu />
					</div>
					<div>front-end developers</div>
				</Top>
				<Middle>
					<ChatItem />
					<ChatItem />
					<ChatItem />
					<ChatItem />
				</Middle>
				<Bottom onSubmit={sendMessage}>
					<input type="text" placeholder="Type a message here" />
					<button type="submit">
						<IoMdSend />
					</button>
				</Bottom>
			</ChatsContainer>
		</Container>
	);
}

export default Home;

const Middle = styled.div`
	margin-top: 2rem;
	overflow: auto;
	flex: 1;
	padding: 0 7rem;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: 3.8rem;

	@media only screen and (max-width: 900px) {
		padding: 0 1.5rem;
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
