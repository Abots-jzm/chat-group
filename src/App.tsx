import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";

export enum paths {
	SIGNUP = "/signup",
	LOGIN = "/login",
	HOME = "/:channelId",
	PROFILE = "/profile",
	WELCOME = "/NeOBDclT0wL9jASynx0D",
}

function App() {
	return (
		<Routes>
			<Route path={paths.SIGNUP} element={<Signup />} />
			<Route path={paths.LOGIN} element={<Login />} />
			<Route element={<RequireAuth />}>
				<Route path="/" element={<Navigate to={paths.WELCOME} />} />
				<Route path={paths.HOME} element={<Home />} />
				<Route path={paths.PROFILE} element={<Profile />} />
			</Route>
		</Routes>
	);
}

export default App;
