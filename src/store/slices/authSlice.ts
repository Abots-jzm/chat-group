import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import storage from "../../util/storage";

type InitialState = {
	uid: string | null;
};

const initialState: InitialState = {
	uid: storage.get("uid"),
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<string>) {
			storage.set("uid", action.payload);
			state.uid = action.payload;
		},
		logout(state) {
			storage.remove("uid");
			state.uid = null;
		},
	},
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
