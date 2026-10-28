document.addEventListener("DOMContentLoaded", () => {

    mostrarTareas();

    const botonAgregarTarea = document.querySelector("#boton-agregar");
    botonAgregarTarea.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector("#form-agregar").style.display = "block";
    });

    const botonBuscar = document.querySelector("#boton-buscar");
    botonBuscar.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector("#form-buscar").style.display = "block";
    });

    const botonCerrarFormAgregar = document.querySelector(".boton-cerrar-formAgregar");
    botonCerrarFormAgregar.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector("#form-agregar").style.display = "none";
    });

    const botonCerrarFormBuscar = document.querySelector(".boton-cerrar-formBuscar");
    botonCerrarFormBuscar.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector("#form-buscar").style.display = "none";
    });

    const formAgregar = document.querySelector("#form-agregar");
    formAgregar.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const archivo = formAgregar.imagen.files[0];

        subirImg(archivo).then(imageUrl => {
            if (!imageUrl) {
                alert("No se pudo subir la imagen");
                return false;
            }

            const nuevaTarea = {
                tarea: formAgregar.tarea.value,
                fecha: formAgregar.fecha.value,
                descripcion: formAgregar.descripcion.value,
                ubicacion: formAgregar.ubicacion.value,
                imagen: imageUrl
            };

            return agregarTarea(nuevaTarea);
        }).then(exito => {
            if (exito) {
                formAgregar.reset();
                formAgregar.style.display = "none";
                mostrarTareas();
            }
        });
    });

    const formBuscar = document.querySelector("#form-buscar");
    formBuscar.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const tarea = formBuscar.tarea.value || '';
        const fecha = formBuscar.fecha.value || '';
        const clave = formBuscar.clave.value || '';
        const ubicacion = formBuscar.ubicacion.value || '';
        
        buscarTareas(tarea, fecha, clave, ubicacion)
            .then(resultados => mostrarTareas(resultados));
    });

    document.querySelector("#boton-filtros").addEventListener("click", () => {
        formBuscar.reset();
        mostrarTareas();
    });

    const botonCerrarFormModif = document.querySelector(".boton-cerrar-formModif");
    botonCerrarFormModif.addEventListener("click", (event) => {
        event.preventDefault();
        document.querySelector("#form-modificar").style.display = "none";
    });

    const formModificar = document.querySelector("#form-modificar");
    formModificar.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // si eligió una imagen nueva la subimos, si no se mantiene la actual
        const archivo = formModificar.imagen.files[0];
        const subida = archivo ? subirImg(archivo) : Promise.resolve(formModificar.imagenActual.value);

        subida.then(imageUrl => {
            if (archivo && !imageUrl) {
                alert("No se pudo subir la imagen");
                return false;
            }

            const datosModificados = {
                clave: formModificar.clave.value,
                tarea: formModificar.tarea.value,
                fecha: formModificar.fecha.value,
                descripcion: formModificar.descripcion.value,
                ubicacion: formModificar.ubicacion.value,
                imagen: imageUrl
            };

            return modificarTarea(datosModificados);
        }).then(exito => {
            if (exito) {
                formModificar.reset();
                formModificar.style.display = "none";
                mostrarTareas();
            }
        });
    });

});