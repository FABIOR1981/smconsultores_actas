document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners en inputs estáticos
    const inputs = ['fecha', 'titulo', 'consultoria', 'proceso', 'elabora'];
    inputs.forEach(id => {
        const elemento = document.getElementById(`input-${id}`);
        if(elemento) {
            elemento.addEventListener('input', actualizarTextos);
        }
    });

    // Escalar la vista previa para que entre en la pantalla
    ajustarEscala();
    window.addEventListener('resize', ajustarEscala);

    // Cargar ítems por defecto
    agregarItem('temas', 'Revisión de flujos de trabajo.');
    agregarItem('pendientes', 'Actualizar documentación.');
    agregarItem('acciones', 'Agendar próxima reunión.');
    actualizarTextos();
});

function ajustarEscala() {
    const contenedor = document.querySelector('.panel-vista');
    const escalaEl = document.getElementById('escala');
    const anchoContenedor = contenedor.clientWidth - 40; // 40px de padding
    
    if (anchoContenedor < 1545) {
        const ratio = anchoContenedor / 1545;
        escalaEl.style.transform = `scale(${ratio})`;
    } else {
        escalaEl.style.transform = 'scale(1)';
    }
}

function actualizarTextos() {
    document.getElementById('out-fecha').innerText = document.getElementById('input-fecha').value;
    document.getElementById('out-titulo').innerText = document.getElementById('input-titulo').value;
    document.getElementById('out-consultoria').innerText = document.getElementById('input-consultoria').value;
    document.getElementById('out-proceso').innerText = document.getElementById('input-proceso').value;
    document.getElementById('out-elabora').innerText = document.getElementById('input-elabora').value;
}

function agregarItem(seccion, valorDefecto = '') {
    const editor = document.getElementById(`editor-${seccion}`);
    const div = document.createElement('div');
    div.className = 'item-lista';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = valorDefecto;
    input.className = `input-lista-${seccion}`;
    input.addEventListener('input', renderizarListas);

    const btnEliminar = document.createElement('button');
    btnEliminar.innerText = 'X';
    btnEliminar.onclick = function() {
        div.remove();
        renderizarListas();
    };

    div.appendChild(input);
    div.appendChild(btnEliminar);
    editor.appendChild(div);
    
    renderizarListas();
}

function renderizarListas() {
    const secciones = ['temas', 'pendientes', 'acciones'];
    secciones.forEach(seccion => {
        const inputs = document.querySelectorAll(`.input-lista-${seccion}`);
        const ul = document.getElementById(`out-${seccion}`);
        ul.innerHTML = '';
        
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                const li = document.createElement('li');
                li.innerText = input.value.trim();
                ul.appendChild(li);
            }
        });
    });
}

function exportarJPEG() {
    const elemento = document.getElementById('acta-preview');
    // Restaurar escala a 1 para capturar alta calidad
    const escalaEl = document.getElementById('escala');
    const transformOriginal = escalaEl.style.transform;
    escalaEl.style.transform = 'scale(1)';

    html2canvas(elemento, { scale: 1.5, useCORS: true }).then(canvas => {
        const enlace = document.createElement('a');
        enlace.download = 'Acta_Reunion.jpg';
        enlace.href = canvas.toDataURL('image/jpeg', 0.95);
        enlace.click();
        escalaEl.style.transform = transformOriginal;
    });
}

function exportarPDF() {
    const elemento = document.getElementById('acta-preview');
    const escalaEl = document.getElementById('escala');
    const transformOriginal = escalaEl.style.transform;
    escalaEl.style.transform = 'scale(1)';

    html2canvas(elemento, { scale: 1.5, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const anchoPdf = pdf.internal.pageSize.getWidth();
        const altoPdf = (canvas.height * anchoPdf) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, anchoPdf, altoPdf);
        pdf.save('Acta_Reunion.pdf');
        
        escalaEl.style.transform = transformOriginal;
    });
}