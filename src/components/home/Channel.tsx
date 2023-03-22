import React from "react";
import styled from "styled-components";
import { truncateTxt } from "../../util";

type Props = {
	name: string;
};

function Channel({ name }: Props) {
	function getIcon() {
		const splitted = name.split(" ");
		if (splitted.length === 1) return splitted[0].charAt(0);

		return splitted[0].charAt(0) + splitted[1].charAt(0);
	}

	return (
		<Container>
			<Icon>{getIcon()}</Icon>
			<Name>{truncateTxt(name, 15)}</Name>
		</Container>
	);
}

export default Channel;

const Name = styled.div`
	color: #bdbdbd;
	font-size: 1.8rem;
	font-weight: 700;
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
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 1.2rem;
	text-transform: uppercase;
`;
