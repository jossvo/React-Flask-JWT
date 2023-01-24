const apiUrl = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			login: async (email,password)=>{
				const resp = await fetch(apiUrl+"/api/login", {
					method:'POST',
					headers:{
						"Content-Type":"application/json"
					},
					body:JSON.stringify({email,password})
				})
				if(!resp.ok){
					return resp.statusText
				}
				const data = await resp.json()
				setStore({
					accessToken:data.access_token,
					refreshToken: data.refresh_token
				})
				localStorage.setItem("accessToken",data.access_token)
				localStorage.setItem("refreshToken",data.refresh_token)
				return "ok"
			},
			getAutorizationHeader:()=>{
				let temp = getStore()
				console.log(temp.accessToken)
				return {"Authorization":"Bearer " + temp.accessToken}
				// let token = localStorage.getItem("accessToken")
				// console.log(token)
				// return {"Authorization":"Bearer " + token}
			},
			loadTokens:()=>{
				let accessToken = localStorage.getItem("accessToken")
				let refreshToken = localStorage.getItem("refreshToken")
				setStore({accessToken,refreshToken})

			},
			logout:async ()=>{
				// localStorage.removeItem("accessToken")
				// localStorage.removeItem("refreshToken")
				// let store = getStore()
				// console.log(localStorage.getItem("accessToken"))
				console.log({...getActions().getAutorizationHeader()})
				if(!getStore().accessToken)return;
				const resp = await fetch(apiUrl+"/api/logout",{
					method: 'POST',
					headers: {
						...getActions().getAutorizationHeader()
					}
				})
				if(!resp.ok){
					console.error(resp.statusText)
					return false
				}
				localStorage.removeItem("accessToken")
				localStorage.removeItem("refreshToken")
				setStore({accessToken:null,refreshToken:null})
				return "ok"
			},
			getProfile: async()=>{
				const resp = await fetch(apiUrl+"/api/userinfo",{
					headers:{
						//"Authorization":"Bearer " + localStorage.getItem("accessToken")
						...getActions().getAutorizationHeader()
					}
				})
				if(!resp.ok){
					console.error(resp.statusText)
				}
				let data = await resp.json()
				return data
			},
			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
