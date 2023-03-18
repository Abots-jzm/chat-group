import React from "react";
import useLogout from "../hooks/auth/useLogout";

function Home() {
	const { mutate: logout } = useLogout();

	return <div onClick={() => logout()}>Home</div>;
}

export default Home;
