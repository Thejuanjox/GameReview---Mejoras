const tbody = document.getElementById('cuerpo-tabla');
const plantilla = document.getElementById('plantilla-fila');
const inputId = document.getElementById('juego-id');
const inputTitulo = document.getElementById('input-titulo');
const inputGenero = document.getElementById('input-genero');
const inputCalificacion = document.getElementById('input-calificacion');
const inputFecha = document.getElementById('input-fecha');
const inputImagen = document.getElementById('input-imagen');
const inputResena = document.getElementById('input-resena');
const tituloForm = document.getElementById('titulo-form');
const selectGenero = document.getElementById('input-genero');
const tbodyGeneros = document.getElementById('cuerpo-tabla-generos');
const inputIdGenero = document.getElementById('input-id-genero');
const inputNombreGenero = document.getElementById('input-nombre-genero');

const btnGuardarGenero = document.getElementById('btn-guardar-genero');
const btnGuardar = document.getElementById('btn-guardar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnLogout = document.getElementById('btn-logout');

const cargarDatos = async () => {
    try {
        const respuesta = await fetch('/api/juegos');
        const juegos = await respuesta.json();
        tbody.innerHTML = '';

        if (juegos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay registros</td></tr>';
            return;
        }

        juegos.forEach(juego => {
            const clon = plantilla.content.cloneNode(true);
            const fecha = juego.fecha_lanzamiento.split('T')[0];
            
            clon.querySelector('.col-id').textContent = juego.id;
            clon.querySelector('.col-titulo').textContent = juego.titulo;
            clon.querySelector('.col-genero').textContent = juego.genero;
            clon.querySelector('.col-nota').textContent = juego.calificacion;
            clon.querySelector('.col-fecha').textContent = fecha;

            clon.querySelector('.btn-editar').addEventListener('click', () => {
                inputId.value = juego.id;
                inputTitulo.value = juego.titulo;
                inputGenero.value = juego.genero;
                inputCalificacion.value = juego.calificacion;
                inputFecha.value = fecha;
                inputImagen.value = ''; 
                inputResena.value = juego.resena;
                tituloForm.textContent = 'Editar juego';
            });

            clon.querySelector('.btn-eliminar').addEventListener('click', async () => {
                const confirmacion = confirm('Estas seguro de que deseas eliminar esta reseña?');
                if (confirmacion) {
                    const res = await fetch(`/api/juegos/${juego.id}`, { method: 'DELETE' });
                    if (res.ok) cargarDatos();
                }
            });

            tbody.appendChild(clon);
        });
    } catch (err) {}
};

btnGuardar.addEventListener('click', async () => {
    const id = inputId.value;
    const titulo = inputTitulo.value.trim();
    const genero = inputGenero.value;
    const calificacion = inputCalificacion.value;
    const fecha_lanzamiento = inputFecha.value;
    const resena = inputResena.value.trim();
    const archivo_imagen = inputImagen.files[0];

    if (!titulo || !genero || !calificacion || !fecha_lanzamiento || !resena) {
        alert('Por favor, completa todos los campos de texto.');
        return;
    }
    const valorPuntuacion = parseFloat(calificacion);
    if (isNaN(valorPuntuacion) || valorPuntuacion < 1 || valorPuntuacion > 10) {
        alert('La puntuacion debe ser obligatoriamente un numero entre 1 y 10.');
        return;
    }

    if (!id && !archivo_imagen) {
        alert('Debes seleccionar una imagen de portada.');
        return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('genero', genero);
    formData.append('calificacion', calificacion);
    formData.append('fecha_lanzamiento', fecha_lanzamiento);
    formData.append('resena', resena);
    
    if (archivo_imagen) {
        formData.append('imagen', archivo_imagen);
    }

    let res;
    if (id) {
        res = await fetch(`/api/juegos/${id}`, { method: 'PUT', body: formData });
    } else {
        res = await fetch('/api/juegos', { method: 'POST', body: formData });
    }

    if (res.ok) {
        cargarDatos();
        
        inputId.value = '';
        inputTitulo.value = '';
        inputGenero.value = '';
        inputCalificacion.value = '';
        inputFecha.value = '';
        inputResena.value = '';
        inputImagen.value = ''; 
        tituloForm.textContent = 'Registrar juego'; 
    } else {
        alert('Ocurrio un error al guardar el registro.');
    }
});

const cargarGeneros = async () => {
    try {
        const res = await fetch('/api/generos');
        const generos = await res.json();
        
        tbodyGeneros.innerHTML = '';
        selectGenero.innerHTML = '<option value="">Seleccione un genero...</option>';

        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.nombre;
            option.textContent = genero.nombre;
            selectGenero.appendChild(option);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${genero.id}</td>
                <td class="fw-bold">${genero.nombre}</td>
                <td class="text-end">
                    <button class="btn btn-warning btn-sm me-2 btn-editar-genero" data-id="${genero.id}" data-nombre="${genero.nombre}">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar-genero" data-id="${genero.id}">Eliminar</button>
                </td>
            `;
            tbodyGeneros.appendChild(tr);
        });

        document.querySelectorAll('.btn-editar-genero').forEach(btn => {
            btn.addEventListener('click', (e) => {
                inputIdGenero.value = e.target.dataset.id;
                inputNombreGenero.value = e.target.dataset.nombre;
                btnGuardarGenero.textContent = 'Actualizar genero';
            });
        });

        document.querySelectorAll('.btn-eliminar-genero').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Estas seguro de eliminar este genero?')) {
                    const res = await fetch(`/api/generos/${e.target.dataset.id}`, { method: 'DELETE' });
                    if (res.ok) cargarGeneros();
                }
            });
        });
    } catch (err) { console.error(err); }
};

btnGuardarGenero.addEventListener('click', async () => {
    const id = inputIdGenero.value;
    const nombre = inputNombreGenero.value.trim();

    if (!nombre) {
        alert('El nombre del genero es obligatorio.');
        return;
    }

    const body = JSON.stringify({ nombre });
    const headers = { 'Content-Type': 'application/json' };
    
    let res;
    if (id) {
        res = await fetch(`/api/generos/${id}`, { method: 'PUT', headers, body });
    } else {
        res = await fetch('/api/generos', { method: 'POST', headers, body });
    }

    if (res.ok) {
        inputIdGenero.value = '';
        inputNombreGenero.value = '';
        btnGuardarGenero.textContent = 'Guardar genero';
        cargarGeneros();
    } else {
        alert('Ocurrio un error al guardar el genero.');
    }
});

cargarGeneros();

btnCancelar.addEventListener('click', () => {
    inputId.value = '';
    inputTitulo.value = '';
    inputGenero.value = '';
    inputCalificacion.value = '';
    inputFecha.value = '';
    inputImagen.value = '';
    inputResena.value = '';
    tituloForm.textContent = 'Registrar juego';
});

btnLogout.addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
});

cargarDatos();