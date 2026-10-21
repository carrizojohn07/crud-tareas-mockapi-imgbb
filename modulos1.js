const API_URL = 'https://6a8cc02563f113bab0b86d95.mockapi.io/tarea';

function agregarTarea(nuevaTarea) {
    const url = new URL(API_URL);
    
    return fetch(url, {
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(nuevaTarea)
    }).then(res => {
        if (!res.ok) {
            return false;
        }
        return res.json().then(() => true);
    }).catch(error => {
        return false;
    });
}

function plantillaTarea(t) {
    return `
        <div class="tarea">
            <div class="info">
                <p><strong>Tarea:</strong> ${t.tarea}</p>
                <p><strong>Fecha:</strong> ${t.fecha}</p>
                <p><strong>Descripcion:</strong> ${t.descripcion}</p>
                <p><strong>Ubicacion:</strong> ${t.ubicacion}</p>
                <p><strong>Numero de tarea:</strong> ${t.id}</p>
            </div>
            <div class="botones">
                <button class="boton-modificar" onclick="cargarFormModificar('${t.id}')">Modificar</button>
                <button class="boton-eliminar" onclick="eliminarTarea('${t.id}')">Eliminar</button>
            </div>
        </div>
    `;
}

function mostrarTareas(tareasParam = null) {
    const cont = document.querySelector('#listadoTareas');
    cont.innerHTML = "";

    if (Array.isArray(tareasParam)) {
        if (tareasParam.length === 0) {
            cont.innerHTML = "<p>No se encontraron tareas con esos filtros</p>";
            return;
        }
        cont.innerHTML = tareasParam.map(plantillaTarea).join('');
        return;
    }

    const url = new URL(API_URL);
    
    fetch(url, {
        method: 'GET',
        headers: {'content-type':'application/json'},
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(tareas => {
        if (!Array.isArray(tareas) || tareas.length === 0) {
            cont.innerHTML = "<p>No hay tareas registradas</p>";
            return;
        }
        
        cont.innerHTML = tareas.map(plantillaTarea).join('');
    }).catch(error => {
        cont.innerHTML = "<p>Error al cargar las tareas</p>";
    });
}

function buscarTareas(tareaBuscada, fechaBuscada, idBuscado, ubicacionBuscada) {
    const url = new URL(API_URL);

    const coincide = (valor, buscado) => {
        if (!buscado) return true;
        return String(valor ?? '').toLowerCase().includes(String(buscado).trim().toLowerCase());
    };

    return fetch(url, {
        method: 'GET',
        headers: {'content-type':'application/json'},
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(tareas => {
        if (!Array.isArray(tareas)) {
            return [];
        }

        return tareas.filter(t => {
            if (!coincide(t.tarea, tareaBuscada)) return false;
            if (!coincide(t.ubicacion, ubicacionBuscada)) return false;
            if (fechaBuscada && t.fecha !== fechaBuscada) return false;
            if (idBuscado && String(t.id) !== String(idBuscado).trim()) return false;
            return true;
        });
    }).catch(error => {
        return [];
    });
}

function cargarFormModificar(id) {
    const url = new URL(`${API_URL}/${id}`);
    
    fetch(url, {
        method: 'GET',
        headers: {'content-type':'application/json'},
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(tareaObj => {
        const form = document.querySelector("#form-modificar");
        form.querySelector("#titulo-modificar").textContent = `Modificar tarea: ${tareaObj.tarea}`;
        
        form.clave.value = tareaObj.id;
        form.tarea.value = tareaObj.tarea;
        form.fecha.value = tareaObj.fecha;
        form.descripcion.value = tareaObj.descripcion;
        form.ubicacion.value = tareaObj.ubicacion;
        
        form.style.display = "block";
    }).catch(error => {});
}

function modificarTarea(datos) {
    const url = new URL(`${API_URL}/${datos.clave}`);
    
    return fetch(url, {
        method: 'PUT',
        headers: {'content-type':'application/json'},
        body: JSON.stringify({
            tarea: datos.tarea,
            fecha: datos.fecha,
            descripcion: datos.descripcion,
            ubicacion: datos.ubicacion
        })
    }).then(res => {
        if (!res.ok) {
            return false;
        }
        return res.json().then(() => true);
    }).catch(error => {
        return false;
    });
}

function eliminarTarea(id) {
    if (confirm("¿Está seguro de que desea eliminar este registro?")) {
        const url = new URL(`${API_URL}/${id}`);
        
        fetch(url, {
            method: 'DELETE',
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(() => {
            mostrarTareas();
        }).catch(error => {});
    }
}