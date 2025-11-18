import React, { useEffect, useState } from "react";

/**
 * EmployeeList
 * Props:
 *  - onEdit(employee) : callback al hacer clic en editar
 *  - reload : boolean/flag para forzar recarga desde App
 */
export default function EmployeeList({ onEdit, reload }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = "http://localhost:3000/api/empleados";

  // Obtiene el token para las rutas protegidas
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Cargar empleados
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Error fetching empleados:", data);
        setEmployees([]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("DATA RECIBIDA DESDE BACKEND:", data); // 👈 CORRECTO
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar lista al montar y cuando reload cambie
  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  // Eliminar empleado
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Error al eliminar");
        return;
      }

      alert("Empleado eliminado");
      fetchEmployees(); // Recargar lista
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error en la conexión al eliminar");
    }
  };

  return (
    <div>
      <h2>Lista de Empleados</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : employees.length === 0 ? (
        <p>No hay empleados registrados.</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Oficina</th>
              <th>Salario</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id || emp.id}>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.office}</td>
                <td>{emp.salary}</td>
                <td>
                  <button onClick={() => onEdit && onEdit(emp)}>
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(emp._id || emp.id)}
                    style={{ marginLeft: 8 }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
