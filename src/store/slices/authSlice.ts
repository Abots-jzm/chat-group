import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction";

type InitialState = {
	uid: string | null;
};

const initialState: InitialState = {
	uid: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<string>) {
			state.uid = action.payload;
		},
		logout(state) {
			state.uid = null;
		},
	},
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
