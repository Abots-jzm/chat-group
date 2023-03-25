import React from "react";
import styled from "styled-components";

type Props = {
	image: string;
	name: string;
	time: string;
	children: React.ReactNode;
};

function ChatItem({ image, name, time, children }: Props) {
	return (
		<Container>
			<Photo>
				<img src={image} alt="avatar" />
			</Photo>
			<Right>
				<div className="name">{name}</div>
				<div className="time">{time}</div>
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
