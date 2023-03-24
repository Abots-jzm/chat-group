import React from "react";
import styled from "styled-components";

function ChatItem() {
	return (
		<Container>
			<Photo>
				<img src={"https://wallpapers.com/images/hd/cool-profile-picture-ld8f4n1qemczkrig.jpg"} alt="avatar" />
			</Photo>
			<Right>
				<div className="name">Neille Francis</div>
				<div className="time">yesterday at 2:29 AM</div>
				<div className="message">
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia, sed porro. Possimus eum illo eligendi
					aliquam quia accusamus debitis harum temporibus vel dolore, cum maxime in dolores? Suscipit, dolore
					voluptatum.
				</div>
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
