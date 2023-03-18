import React, { ChangeEvent, FormEvent, useState } from "react";
import styled, { keyframes } from "styled-components";
import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { paths } from "../../App";
import { FaGoogle } from "react-icons/fa";
import useGuestLogin from "../../hooks/auth/useGuestLogin";
import useGoogleLogin from "../../hooks/auth/useGoogleLogin";

type Props = {
	enteredEmail: string;
	enteredPassword: string;
	errorMessage: string;
	errorMessageIsShown: boolean;
	isLoading: boolean;
	nextPath?: string;
	handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
	onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function Layout({
	enteredEmail,
	enteredPassword,
	errorMessage,
	errorMessageIsShown,
	isLoading,
	nextPath,
	handleSubmit,
	onEmailChange,
	onPasswordChange,
}: Props) {
	const location = useLocation();
	const navigate = useNavigate();
	const isLoginPage = location.pathname === paths.LOGIN;

	const { mutate: googleLogin, isLoading: googleIsLoading, isError: googleIsError } = useGoogleLogin();
	const [googleErrorMessage, setGoogleErrorMessage] = useState("");

	const { mutate: guestLogin, isLoading: guestIsLoading, isError: guestIsError } = useGuestLogin();
	const [guestErrorMessage, setGuestErrorMessage] = useState("");

	async function onGoogleSubmit() {
		googleLogin(undefined, {
			onSuccess() {
				navigate(nextPath || paths.HOME, { replace: true });
			},
			onError() {
				setGoogleErrorMessage("An unexpected error occured");
			},
		});
	}

	async function onGuestSubmit() {
		guestLogin(undefined, {
			onSuccess() {
				navigate(nextPath || paths.HOME, { replace: true });
			},
			onError() {
				setGuestErrorMessage("An unexpected error occured");
			},
		});
	}

	return (
		<Container>
			<div>
				<SignupText>{isLoginPage ? "Login" : "Sign up"}</SignupText>
				<Form onSubmit={handleSubmit}>
					<div>
						<p>
							<MdEmail />
						</p>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Email"
							value={enteredEmail}
							onChange={onEmailChange}
							required
						/>
					</div>
					<div>
						<p>
							<IoMdLock />
						</p>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							value={enteredPassword}
							onChange={onPasswordChange}
							required
						/>
					</div>
					<LoginBtn type="submit">
						<div>{isLoginPage ? "Login" : "Sign up"}</div>
						{isLoading && <Spinner />}
					</LoginBtn>
				</Form>
				{errorMessageIsShown && <ErrorMessage>{errorMessage}</ErrorMessage>}
				<Others>
					<div>or</div>
					<OtherBtn onClick={onGoogleSubmit}>
						<div className="icon">
							<FaGoogle />
						</div>
						<span>continue with Google</span>
						{googleIsLoading && <SpinnerGray />}
					</OtherBtn>
					{googleIsError && <ErrorMessage>{googleErrorMessage}</ErrorMessage>}
					<OtherBtn onClick={onGuestSubmit}>
						<span>continue as a guest</span>
						{guestIsLoading && <SpinnerGray />}
					</OtherBtn>
					{guestIsError && <ErrorMessage>{guestErrorMessage}</ErrorMessage>}
					<div style={{ marginTop: isLoginPage ? "3.3rem" : "0" }}>
						{isLoginPage && (
							<>
								Don't have an account yet? <LinkStyles to={paths.SIGNUP}>Register</LinkStyles>
							</>
						)}
						{!isLoginPage && (
							<>
								Already have an account? <LinkStyles to={paths.LOGIN}>Login</LinkStyles>
							</>
						)}
					</div>
				</Others>
			</div>
		</Container>
	);
}

export default Layout;

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

const SpinnerGray = styled(Spinner)`
	border-left: 1px solid #828282;
`;

const ErrorMessage = styled.div`
	font-size: 1.4rem;
	color: #ff414e;
	margin-top: 1rem;
`;

const LinkStyles = styled(Link)`
	color: #2d9cdb;
	text-decoration: none;
`;

const Others = styled.div`
	margin-top: 1.8rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #828282;
	font-size: 1.4rem;
`;

const LoginBtn = styled.button`
	padding: 0.8rem;
	background-color: #2f80ed;
	color: white;
	border-radius: 8px;
	font-weight: 700;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 2rem;
`;

const OtherBtn = styled(LoginBtn)`
	margin-top: 1.8rem;
	border: 1px solid #828282;
	color: #828282;
	background-color: transparent;
	width: 100%;
	font-weight: 400;
	position: relative;

	.icon {
		position: absolute;
		left: 2rem;
		top: 1rem;
	}
`;

const Form = styled.form`
	margin-top: 2.5rem;
	display: flex;
	flex-direction: column;
	gap: 1.8rem;

	& > div {
		position: relative;
	}

	p {
		position: absolute;
		font-size: 2rem;
		top: 0.9rem;
		left: 1.4rem;
		color: #828282;
	}

	input {
		padding: 0.8rem;
		border-radius: 0.8rem;
		border: none;
		padding-left: 4.6rem;
		color: #bdbdbd;
		width: 100%;
		background-color: #3c393f;

		&::placeholder {
			color: #828282;
		}
	}
`;

const SignupText = styled.div`
	color: #e0e0e0;
	font-size: 1.8rem;
	font-weight: 700;
`;

const Container = styled.div`
	display: grid;
	place-items: center;
	width: 100vw;
	height: 100vh;
	background-color: #252329;

	& > div {
		padding: 4.8rem 5.8rem;
		border-radius: 1.2rem;
		border: 1px solid white;
		width: min(47.3rem, 100%);
	}

	@media only screen and (max-width: 473px) {
		place-items: start;
		padding-top: 5vh;

		& > div {
			border: none;
			padding: 2rem;
		}
	}
`;
