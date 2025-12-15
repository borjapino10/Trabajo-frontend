import React, { useEffect, useState } from "react";

/**
 * EmployeeForm
 * Props:
 *  - employeeToEdit: objeto con empleado para editar (o null)
 *  - onSaveComplete: callback que notifica a App para recargar la lista
 *
 * Usa campos: name, position, office, salary (estos son los campos que tu frontend original usó).
 * Si tu modelo de empleados usa otros nombres, ajusta las keys aquí.
 */
export default function EmployeeForm({ employeeToEdit = null, onSaveComplete }) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [office, setOffice] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = "http://localhost:3000/api/empleados";

  // Sincronizar campos cuando se selecciona un empleado para editar
  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name || "");
      setPosition(employeeToEdit.position || "");
      setOffice(employeeToEdit.office || "");
      setSalary(employeeToEdit.salary || "");
    } else {
      setName("");
      setPosition("");
      setOffice("");
      setSalary("");
    }
  }, [employeeToEdit]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { name, position, office, salary };
      const method = employeeToEdit ? "PUT" : "POST";
      const url = employeeToEdit ? `${API_BASE}/${employeeToEdit._id}` : API_BASE;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        // Manejo simple: muestra error y no continúa
        const msg = data.error || data.msg || "Error al guardar empleado";
        alert(msg);
        setLoading(false);
        return;
      }

      alert(employeeToEdit ? `Empleado actualizado` : `Empleado creado`);
      onSaveComplete && onSaveComplete();
      // limpiar formulario si fue creación
      if (!employeeToEdit) {
        setName("");
        setPosition("");
        setOffice("");
        setSalary("");
      }
    } catch (err) {
      console.error("Error saving employee:", err);
      alert("Error en la comunicación con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{employeeToEdit ? "Editar Empleado" : "Agregar Empleado"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            placeholder="Posición"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            placeholder="Oficina"
            value={office}
            onChange={(e) => setOffice(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="number"
            placeholder="Salario"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : employeeToEdit ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
