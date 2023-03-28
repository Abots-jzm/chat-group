import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { paths } from "../App";
import Layout from "../components/auth/Layout";
import useSignup from "../hooks/auth/useSignup";

function Signup() {
	const [enteredEmail, setEnteredEmail] = useState("");
	const [enteredPassword, setEnteredPassword] = useState("");

	const [errorMessage, setErrorMessage] = useState("");
	const [errorMessageIsShown, setErrorMessageIsShown] = useState(false);
	const { mutate: signup, isLoading } = useSignup();

	const navigate = useNavigate();

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		if (enteredPassword.length < 6) {
			setErrorMessage("Password should be at least 6 characters");
			setErrorMessageIsShown(true);
			return;
		}

		e.preventDefault();
		signup(
			{
				email: enteredEmail,
				password: enteredPassword,
			},
			{
				onSuccess() {
					navigate(paths.PROFILE, { replace: true });
				},
				onError(err: any) {
					if (err?.message === "Firebase: Error (auth/email-already-in-use).") {
						setErrorMessage("Email Already exists");
						setErrorMessageIsShown(true);
					} else {
						setErrorMessage("An unexpected error occured");
						setErrorMessageIsShown(true);
					}
				},
			}
		);
	}

	return (
		<Layout
			enteredEmail={enteredEmail}
			enteredPassword={enteredPassword}
			errorMessage={errorMessage}
			errorMessageIsShown={errorMessageIsShown}
			isLoading={isLoading}
			handleSubmit={handleSubmit}
			onEmailChange={(e) => setEnteredEmail(e.target.value)}
			onPasswordChange={(e) => setEnteredPassword(e.target.value)}
		/>
	);
}

export default Signup;
