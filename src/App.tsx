import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export enum paths {
	SIGNUP = "/signup",
	LOGIN = "/login",
	HOME = "/",
}

function App() {
	return (
		<Routes>
			<Route path={paths.SIGNUP} element={<Signup />} />
			<Route path={paths.LOGIN} element={<Login />} />
			<Route element={<RequireAuth />}>
				<Route path="/" element={<Home />} />
			</Route>
		</Routes>
	);
}

export default App;
