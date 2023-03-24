import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const element = document.getElementById("overlay")!;

type Props = {
	closeModal: () => void;
};

function NewChannelModal({ closeModal }: Props) {
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		closeModal();
	}

	return ReactDOM.createPortal(
		<Overlay onClick={closeModal}>
			<Modal onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
				<div className="heading">New channel</div>
				<input type="text" name="name" placeholder="Channel name" />
				<textarea name="description" id="description" placeholder="Channel Description" />
				<button type="submit">Save</button>
			</Modal>
		</Overlay>,
		element
	);
}

export default NewChannelModal;

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
	}

	input,
	textarea {
		padding: 1.1rem 1.5rem;
		border-radius: 8px;
		border: none;
		color: #bdbdbd;
		width: 100%;
		background-color: #3c393f;

		&::placeholder {
			color: #828282;
		}
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
