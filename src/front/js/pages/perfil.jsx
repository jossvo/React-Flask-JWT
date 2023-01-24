import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Context } from "../store/appContext";

export const Perfil = () => {
	const { store, actions } = useContext(Context);
	const [userInfo, setUserInfo]=useState()

	const navigate = useNavigate()

	useEffect(()=>{
		if(!store.accessToken){
			navigate("/")
			return;
		}
		actions.getProfile().then(data=>{
			console.log(data)
			setUserInfo(data)
		})
		//console.log(userInfo)
	},[store.accessToken])

	return (
		<div className="container">
			<h1>{}</h1>
			<ul className="list-group"></ul>
			<br />
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>
	);
};
