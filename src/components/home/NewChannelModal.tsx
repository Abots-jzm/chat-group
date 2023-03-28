import React, { useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import useCreateNewChannel from "../../hooks/chat/useCreateNewChannel";
import { UserData } from "../../hooks/profile/types";

const element = document.getElementById("overlay")!;

type Props = {
	user?: UserData;
	closeModal: () => void;
};

function NewChannelModal({ closeModal, user }: Props) {
	const [enteredName, setEnteredName] = useState("");
	const [enteredDescription, setEnteredDescription] = useState("");
	const { mutate: createNewChannel, isLoading } = useCreateNewChannel();

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		closeModal();
		if (user) createNewChannel({ description: enteredDescription, name: enteredName, user });
	}

	return createPortal(
		<Overlay onClick={closeModal}>
			<Modal onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
				<div className="heading">New channel</div>
				<input
					type="text"
					name="name"
					placeholder="Channel name"
					onChange={(e) => setEnteredName(e.target.value)}
					required
				/>
				<textarea
					name="description"
					id="description"
					placeholder="Channel Description"
					onChange={(e) => setEnteredDescription(e.target.value)}
					required
				/>
				<p>Note: Any channels created will be visible to ALL users</p>
				<button type="submit">Save {isLoading && <Spinner />}</button>
			</Modal>
		</Overlay>,
		element
	);
}

export default NewChannelModal;

const spinner = keyframes`
   100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	border-left: 2px solid white;
	animation: ${spinner} 0.7s linear infinite;
`;

const Modal = styled.form`
	color: #f2f2f2;
	background-color: #120f13;
	padding: 3rem 4rem;
	border-radius: 24px;
	width: min(90%, 65rem);
	display: flex;
	flex-direction: column;
	gap: 2.6rem;

	button {
		padding: 0.7rem 3rem;
		background-color: #2f80ed;
		border-radius: 8px;
		align-self: flex-end;
		color: #f2f2f2;
		display: flex;
		gap: 1rem;
	}

	input,
	textarea {
		padding: 1.1rem 1.5rem;
		border-radius: 8px;
		border: none;
		color: #bdbdbd;
		width: 100%;
		background-color: #3c393f;
		resize: none;

		&::placeholder {
			color: #828282;
		}
	}

	p {
		color: #828282;
		font-size: 1.4rem;
	}

	textarea {
		font: inherit;
		height: 11.5rem;
	}

	.heading {
		text-transform: uppercase;
		font-size: 1.8rem;
		font-weight: 700;
	}
`;

const Overlay = styled.div`
	position: fixed;
	inset: 0;
	background-color: rgba(18, 15, 19, 0.5);
	display: grid;
	place-items: center;
	z-index: 100;
`;
