import axios from "axios"
import setAuthToken from "../utils/setAuthToken"
import jwt_decode from "jwt-decode"

import {
	GET_ERRORS,
	SET_CURRENT_USER,
	USER_LOADER
} from "./types";

// Register User
export const registerUser = (userData, history) => dispatch => {
	axios
		.post("api/user/register", userData)
		.then(res => history.push("/login")) //redirect to login on successful register
		.catch(err => 
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
}

// Login - get user token
export const loginUser = userData => dispatch => {
	axios
		.post("/api/users/login", userData)
		.then(res => {
			// save to localstorage

			const { token } = res.data
			//set token to localStorage
			localStorage.setItem("jwtToken", token);
			//set token to Auth header
			setAuthToken(token)
			//decode token to get user data
			const decoded = jwt_decode(token);
			// set current user
			dispatch(setCurrentUser(decoded))
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
}

// Set logging in user
export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
};

// User loading
export const setUserLoading = () => {
	return {
		type: USER_LOADER
	}
}

// User logout
export const logoutUser = () => dispatch => {
	// Remove token from local storage
	localStorage.removeItem("jwtToken")
	// Remove auth header from future requests
	setAuthToken(false)
	// Set current user to empty object {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));
}