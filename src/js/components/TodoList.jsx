import React, { useState, useEffect } from "react";
import "./TodoList.css";

const Home = () => {
    const [lista, setLista] = useState([]);
    const [tarea, setTarea] = useState("");

    const url = "https://playground.4geeks.com/todo/";

    const crearUsuario = async () => {
        try {
            const response = await fetch(url + "users/EduardoP", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) throw new Error("No se pudo crear el usuario");
            console.log("Usuario 'EduardoP' creado exitosamente");
        } catch (error) {
            console.error("Error al crear el usuario:\n", error);
        }
    };

    const muestraLista = async () => {
        try {
            const response = await fetch(url + "users/EduardoP");

            if (response.status === 404) {
                console.log("Usuario no existe, creando usuario...");
                await crearUsuario();
                return muestraLista();
            }

            if (!response.ok) throw new Error("No se pudo obtener la lista");

            const data = await response.json();
            setLista(data.todos);
        } catch (error) {
            console.error("Hubo un problema al obtener la lista de tareas:\n", error);
        }
    };

    const crearTarea = async (text) => {
        try {
            const response = await fetch(url + "todos/EduardoP", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: text, is_done: false }),
            });

            if (!response.ok) throw new Error("No se pudo crear la tarea");
            await muestraLista();
        } catch (error) {
            console.error("Hubo un error al crear la tarea:\n", error);
        }
    };

    const eliminarTarea = async (id) => {
        try {
            const response = await fetch(url + "todos/" + id, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("No se pudo eliminar la tarea");
            await muestraLista();
        } catch (error) {
            console.error(error);
        }
    };

    const eliminarLista = async () => {
        try {
            await Promise.all(
                lista.map((item) =>
                    fetch(url + "todos/" + item.id, { method: "DELETE" })
                )
            );
            setLista([]);
            console.log("Todas las tareas fueron eliminadas.");
        } catch (error) {
            console.error("Error al eliminar todas las tareas:", error);
        }
    };

    const inputText = (event) => {
        if (event.key === "Enter" && tarea.trim() !== "") {
            crearTarea(tarea.trim());
            setTarea("");
        }
    };

    useEffect(() => {
        muestraLista();
    }, []);

    return (
        <div>
            <h1 className="titulo-todo">todos</h1>
            <div className="text-center caja">
                <input
                    className="ingreso-de-texto"
                    type="text"
                    placeholder="Escribe una tarea y presiona Enter"
                    onChange={(e) => setTarea(e.target.value)}
                    value={tarea}
                    onKeyDown={inputText}
                />
                <ul className="list-unstyled texto-ingresado">
                    {lista.map((item) => (
                        <li key={item.id}>
                            {item.label}
                            <span className="borrar-tarea" onClick={() => eliminarTarea(item.id)}>❌</span>
                        </li>
                    ))}
                </ul>
                <p className="contador">{lista.length === 0 ? "No hay tareas pendientes" : `${lista.length} tarea(s) pendiente(s)`}</p>
                <button className="boton-eliminaTodos border" onClick={eliminarLista}>Eliminar todas las tareas</button>
            </div>
        </div>
    );
};

export default Home;
