import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { paths } from "../App";
import BlanckPicture from "../assets/blank-profile-picture.png";
import useGetUserProfile from "../hooks/profile/useGetUserProfile";
import useUpdateUserProfile from "../hooks/profile/useUpdateUserProfile";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authActions } from "../store/slices/authSlice";

function Profile() {
	const [currentPhoto, setCurrentPhoto] = useState<File>();
	const [enteredName, setEnteredName] = useState("");
	const { data } = useGetUserProfile();
	const [isEditing, setIsEditing] = useState(!data);
	const navigate = useNavigate();
	const uid = useAppSelector((state) => state.auth.uid);
	const dispatch = useAppDispatch();

	const { mutate: updateProfile, isLoading } = useUpdateUserProfile();

	function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (!e.currentTarget.files) return;

		setCurrentPhoto(e.currentTarget.files[0]);
	}

	function getPhotoSrc(): string {
		if (currentPhoto) return URL.createObjectURL(currentPhoto);
		if (data) return data.photoURL;
		else return BlanckPicture;
	}

	function onSave(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!uid) {
			dispatch(authActions.logout());
			return;
		}

		updateProfile(
			{ photo: currentPhoto, dispayName: enteredName, uid },
			{
				onSuccess() {
					if (!data) navigate(paths.HOME, { replace: true });
					else setIsEditing(false);
				},
			}
		);
	}

	return (
		<Container backIsShown={!!data}>
			<div>
				{data && (
					<Back to={paths.HOME}>
						<IoIosArrowBack /> Back
					</Back>
				)}
				<Heading>Profile {!isEditing && <div onClick={() => setIsEditing(true)}>Edit</div>}</Heading>
				<Picture>
					<div>
						<img src={getPhotoSrc()} alt="blank picture" />
					</div>
					{isEditing && (
						<>
							<label htmlFor="photo">CHANGE PHOTO (optional)</label>
							<input type="file" name="photo" id="photo" onChange={onPhotoChange} accept="image/*" />
						</>
					)}
				</Picture>
				<Form onSubmit={onSave}>
					<div>
						<label htmlFor="displayName">Display Name</label>
						{!isEditing && <div className="display">{data?.displayName}</div>}
						{isEditing && (
							<input
								type="text"
								name="displayName"
								id="dispayName"
								placeholder="Enter display name"
								onChange={(e) => setEnteredName(e.target.value)}
								required
							/>
						)}
					</div>
					{isEditing && (
						<button type="submit">
							save
							{isLoading && <Spinner />}
						</button>
					)}
				</Form>
			</div>
		</Container>
	);
}

export default Profile;

const spinner = keyframes`
   100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	border-left: 2px solid white;
	animation: ${spinner} 0.7s linear infinite;
`;

const Back = styled(Link)`
	color: #2d9cdb;
	font-size: 1.8rem;
	display: flex;
	align-items: center;
	gap: 1.4rem;
	position: absolute;
	left: 0;
	top: -4rem;
	cursor: pointer;
	text-decoration: none;
`;

const Form = styled.form`
	margin-top: 2.5rem;
	display: flex;
	flex-direction: column;
	gap: 2.4rem;

	label {
		margin-bottom: 0.8rem;
		display: block;
	}

	input {
		padding: 0.8rem;
		border-radius: 0.8rem;
		border: none;
		color: #bdbdbd;
		width: 100%;
		background-color: #3c393f;

		&::placeholder {
			color: #828282;
		}
	}

	.display {
		color: #828282;
	}

	button {
		background: #2f80ed;
		border-radius: 8px;
		padding: 0.8rem 2.4rem;
		color: white;
		align-self: flex-end;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.8rem;
	}
`;

const Picture = styled.div`
	margin-top: 3rem;
	display: flex;
	gap: 3rem;
	align-items: center;

	label {
		background-color: transparent;
		color: #828282;
		cursor: pointer;
	}

	input {
		display: none;
	}

	& > div {
		height: 12rem;
		width: 12rem;
		border-radius: 1rem;
		overflow: hidden;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
`;

const Heading = styled.div`
	font-size: 2.4rem;
	display: flex;
	justify-content: space-between;
	align-items: center;

	div {
		padding: 0.8rem 2.4rem;
		border: 1px solid #828282;
		color: #828282;
		font-size: 1.6rem;
		border-radius: 8px;
		cursor: pointer;
	}
`;

interface IContainer {
	backIsShown: boolean;
}

const Container = styled.div<IContainer>`
	display: grid;
	place-items: center;
	width: 100vw;
	height: 100vh;
	background-color: #252329;
	color: #e0e0e0;

	& > div {
		padding: 3rem 5.8rem;
		border-radius: 1.2rem;
		box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.2);
		width: min(47.3rem, 100%);
		position: relative;
	}

	@media only screen and (max-width: 473px) {
		place-items: start;
		padding-top: ${(props) => (props.backIsShown ? "10vh" : "5vh")};

		& > div {
			box-shadow: none;
			padding: 2rem;
		}
	}
`;
