// Importamos React y el hook useState
import React, { useState } from "react";

// Importamos los componentes hijos que conforman nuestra aplicación
import EmployeeForm from "./components/EmployeeForm"; // Formulario para crear/editar empleados
import EmployeeList from "./components/EmployeeList"; // Listado de empleados
import './App.css'; // Estilos globales opcionales
import Login from "./components/Login"; //login

/**
 * Componente principal: App
 * -------------------------
 * Este componente orquesta toda la aplicación de Gestión de Empleados.
 * Se encarga de manejar el estado compartido entre EmployeeForm y EmployeeList.
 *
 * Funcionalidades:
 *  - Permite seleccionar un empleado para editarlo.
 *  - Limpia el formulario después de guardar.
 *  - Renderiza el formulario y la lista de empleados.
 */
function App() {
  // -------------------- ESTADO PRINCIPAL --------------------
  // selectedEmployee almacena el empleado que se está editando actualmente.
  // Si es null, el formulario se usa para crear un nuevo empleado.
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [logged, setLogged] = useState(() => {
  const token = localStorage.getItem("token");
  return Boolean(token);
});


  // -------------------- FUNCIÓN: EDITAR --------------------
  /**
   * handleEdit se ejecuta cuando el usuario hace clic en "Editar" desde EmployeeList.
   * Recibe un objeto empleado y lo almacena en el estado selectedEmployee.
   * Esto hace que EmployeeForm cargue sus datos para editar.
   */
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
  };

  // -------------------- FUNCIÓN: GUARDAR COMPLETADO --------------------
  /**
   * handleSaveComplete se ejecuta cuando el formulario termina de guardar o actualizar
   * un empleado correctamente. Limpia el estado selectedEmployee para resetear el formulario.
   */
  const handleSaveComplete = () => {
    setSelectedEmployee(null);
  };

  // -------------------- RENDERIZADO --------------------
  // Estructura visual principal de la aplicación.
  if (!logged) {
  return (
    <div style={{ margin: "20px" }}>
      <h1>Gestión de Empleados - Login</h1>
      <Login onLoginSuccess={() => setLogged(true)} />
    </div>
  );
}

  return (
    <div style={{ margin: "20px" }}>
      {/* Título de la aplicación */}
      <h1>Gestión de Empleados</h1>

      {/* Formulario de creación/edición */}
      <EmployeeForm
        employeeToEdit={selectedEmployee}       // Prop: empleado actual a editar
        onSaveComplete={handleSaveComplete}     // Prop: callback al guardar
      />

      <hr /> {/* Separador visual */}

      {/* Lista de empleados */}
      <EmployeeList
        onEdit={handleEdit}                     // Prop: función que se ejecuta al editar
      />
    </div>
  );
}

// Exportamos el componente para que sea usado en index.js
export default App;