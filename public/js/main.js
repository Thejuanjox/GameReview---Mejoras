const contenedor = document.getElementById('contenedor-juegos');

const cargarJuegos = async () => {
    try {
        const respuesta = await fetch('/api/juegos');
        const juegos = await respuesta.json();
        
        contenedor.innerHTML = '';
        
        if (juegos.length === 0) {
            contenedor.innerHTML = '<div class="col-12 text-center"><p>No hay reseñas publicadas aun.</p></div>';
            return;
        }

        juegos.forEach(juego => {
            const fecha = juego.fecha_lanzamiento.split('T')[0];
            

            const valorGuardado = localStorage.getItem(`rating_juego_${juego.id}`) || 0;

            let estrellasHTML = `<span class="ms-2 fs-5" style="cursor: pointer;" title="Califica tu experiencia">`;
            for (let i = 1; i <= 5; i++) {
            
                const colorEstrella = i <= valorGuardado ? 'text-warning' : 'text-secondary';

                estrellasHTML += `<span class="estrella ${colorEstrella}" data-id="${juego.id}" data-valor="${i}">★</span>`;
            }
            estrellasHTML += `</span>`;

            contenedor.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 bg-secondary bg-opacity-25 border-secondary shadow">
                        <img src="${juego.imagen_url}" class="card-img-top" alt="Portada" style="height: 240px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title fw-bold text-white">${juego.titulo}</h5>
                            <span class="badge bg-primary mb-2">${juego.genero}</span>
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge bg-warning text-dark fw-bold">Puntuacion: ${juego.calificacion}</span>
                                ${estrellasHTML}
                            </div>
                            <p class="card-text text-light mt-2">${juego.resena}</p>
                            <small class="text-muted">Lanzamiento: ${fecha}</small>
                        </div>
                    </div>
                </div>
            `;
        });

        document.querySelectorAll('.estrella').forEach(estrellaClickeada => {
            estrellaClickeada.addEventListener('click', (e) => {
                const idJuego = e.target.getAttribute('data-id');
                const valorSeleccionado = e.target.getAttribute('data-valor');
                
                localStorage.setItem(`rating_juego_${idJuego}`, valorSeleccionado);

                document.querySelectorAll(`.estrella[data-id="${idJuego}"]`).forEach(estrella => {
                    if (estrella.getAttribute('data-valor') <= valorSeleccionado) {
                        estrella.classList.remove('text-secondary');
                        estrella.classList.add('text-warning'); 
                    } else {
                        estrella.classList.remove('text-warning');
                        estrella.classList.add('text-secondary'); 
                    }
                });
            });
        });

    } catch (error) {
        contenedor.innerHTML = '<div class="col-12 text-center text-danger"><p>Error al cargar los juegos.</p></div>';
    }
};

cargarJuegos();