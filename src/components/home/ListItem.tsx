import React from "react";
import styled from "styled-components";
import { truncateTxt } from "../../util";
import BlankPicture from "../../assets/blank-profile-picture.png";

type Props = {
	name: string;
	mode: "channel" | "member";
	imageURL?: string;
	onClick?: () => void;
};

function ListItem({ name, onClick, mode, imageURL }: Props) {
	function getIcon() {
		const splitted = name.split(" ");
		if (splitted.length === 1) return splitted[0].charAt(0);

		return splitted[0].charAt(0) + splitted[1].charAt(0);
	}

	return (
		<Container onClick={onClick}>
			<Icon>
				{mode === "channel" && getIcon()}
				{mode === "member" && <img src={imageURL || BlankPicture} alt={name} />}
			</Icon>
			<Name mode={mode}>{truncateTxt(name, 15)}</Name>
		</Container>
	);
}

export default ListItem;

interface IMode {
	mode: "channel" | "member";
}

const Name = styled.div<IMode>`
	color: ${(props) => (props.mode === "channel" ? "#bdbdbd" : "#828282")};
	font-size: 1.8rem;
	font-weight: 700;
	text-transform: ${(props) => (props.mode === "channel" ? "uppercase" : "none")};
`;

const Icon = styled.div`
	display: grid;
	place-items: center;
	height: 4.2rem;
	width: 4.2rem;
	background-color: #252329;
	color: white;
	border-radius: 8px;
	font-weight: 600;
	text-transform: uppercase;
	overflow: hidden;

	img {
		width: 4.2rem;
		height: 4.2rem;
		object-fit: cover;
		object-position: center;
	}
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 1.2rem;
	cursor: ${(props) => (props.onClick ? "pointer" : "default")};
`;
