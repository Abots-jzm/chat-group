import React, { useState } from "react";
import Div100vh from "react-div-100vh";
import { IoMdMenu } from "react-icons/io";
import styled from "styled-components";
import SideBar from "../components/home/SideBar";

function Home() {
	const [sideBarisOpen, setSideBarisOpen] = useState(false);

	return (
		<Container>
			<SideBar isOpen={sideBarisOpen} closeSideBar={() => setSideBarisOpen(false)} />
			<ChatsContainer>
				<Top>
					<div className="menu" onClick={() => setSideBarisOpen(true)}>
						<IoMdMenu />
					</div>
					<div>front-end developers</div>
				</Top>
			</ChatsContainer>
		</Container>
	);
}

export default Home;

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
`;

const Container = styled(Div100vh)`
	background-color: #252329;
	color: #e0e0e0;
	display: flex;
`;
