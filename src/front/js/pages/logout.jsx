import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate} from "react-router-dom";

import { Context } from "../store/appContext";

export const Logout = () => {
  const { store, actions } = useContext(Context);
  const [message, setMessage] = useState("Cerrando sesión");
  const navigate = useNavigate()
  useEffect(() => {
    actions
      .logout()
      .then((resp) =>{
        setMessage(
          resp ? "Sesión cerrada correctamente" : "Error en cierre de sesión"
        )
        navigate("/")
        }
      );
  }, []);

  return (
    <div className="container">
      <h1>Cierre de sesión</h1>
      <p>{message}</p>
    </div>
  );
};
