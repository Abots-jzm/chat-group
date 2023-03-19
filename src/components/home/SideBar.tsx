import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { paths } from "../../App";
import useLogout from "../../hooks/auth/useLogout";
import { IoMdAdd, IoMdClose } from "react-icons/io";

type Props = {
	isOpen: boolean;
	closeSideBar: () => void;
};

function SideBar({ isOpen, closeSideBar }: Props) {
	const { mutate: logout } = useLogout();

	return (
		<Container isOpen={isOpen}>
			{isOpen && (
				<Close onClick={closeSideBar}>
					<IoMdClose />
				</Close>
			)}
			<Top>
				<div>Channels</div>
				<div className="icon">
					<IoMdAdd />
				</div>
			</Top>
			<div onClick={() => logout()}>Logout</div>
			<Link to={paths.PROFILE}>profile</Link>
		</Container>
	);
}

export default SideBar;

const Close = styled.div`
	width: 3.8rem;
	height: 3.8rem;
	background: #120f13;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 12px;
	color: white;
	position: absolute;
	top: 1rem;
	right: -4.5rem;
	font-size: 2.4rem;
	cursor: pointer;
	display: none;

	@media only screen and (max-width: 900px) {
		display: grid;
		place-items: center;
	}
`;

const Top = styled.div`
	text-transform: uppercase;
	font-weight: 700;
	padding: 1.35rem 2.5rem;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	font-size: 1.8rem;
	display: flex;
	align-items: center;
	justify-content: space-between;

	.icon {
		font-size: 2.4rem;
		display: grid;
		place-items: center;
		cursor: pointer;
		background-color: #252329;
		border-radius: 8px;
		height: 3.2rem;
		width: 3.2rem;
		color: #f2f2f2;
	}
`;

interface IContainer {
	isOpen: boolean;
}

const Container = styled.div<IContainer>`
	flex-basis: 32.4rem;
	background-color: #120f13;

	@media only screen and (max-width: 900px) {
		position: fixed;
		left: 0;
		top: 0;
		width: 32.4rem;
		height: 100%;
		transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
		transition: transform 0.5s;
	}
`;
