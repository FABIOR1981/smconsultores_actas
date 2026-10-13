const EJEMPLO = {
            fecha: "05/10/2026",
            titulo: "Acta de Reunión",
            consultoria: "SM Consultores",
            proceso: "Operaciones",
            elabora: "Lic. Shalon Morales",
            temas: [
                "Monitoreo del proceso de elaboración del packing vs. pedido,",
                "Revisión y seguimiento de los registros de desvíos, identificando tendencias, causas recurrentes y oportunidades de mejora.",
                "Capacitación en herramientas de análisis de causas, aplicando Diagrama de Ishikawa y 5 Porqués para la identificación de causas raíz y definición de acciones correctivas."
            ],
            pendientes: [
                "Orden y limpieza del área de Depósito, aplicando criterios de organización, seguridad y eficiencia.",
                "Relevamiento y actualización de los registros bromatológicos, asegurando su vigencia, trazabilidad y correcta gestión documental."
            ],
            acciones: [
                "Diseño y revisión del proceso de packing y preparación de pedidos.",
                "Identificación de puntos de control críticos y oportunidades de mejora.",
                "Revisión de los KPI actuales y definición de nuevos indicadores de gestión.",
                "Estandarización de criterios de trabajo y controles.",
                "Identificación de acciones orientadas a mejorar la eficiencia, trazabilidad y calidad operativa."
            ]
        };
        let actaData = JSON.parse(JSON.stringify(EJEMPLO));

        const ETIQUETAS = {
            temas: ["Temas", "Tratados"],
            pendientes: ["Pendientes a", "realizar"],
            acciones: ["Acciones", "acordadas", "próximo", "encuentro"]
        };

        function resetDefaults() {
            actaData = JSON.parse(JSON.stringify(EJEMPLO));
            document.getElementById('input-fecha').value = actaData.fecha;
            document.getElementById('input-titulo').value = actaData.titulo;
            document.getElementById('input-consultoria').value = actaData.consultoria;
            document.getElementById('input-proceso').value = actaData.proceso;
            document.getElementById('input-elabora').value = actaData.elabora;
            renderEditors();
            updatePreview();
        }

        function renderEditors() {
            renderListEditor('temas', actaData.temas);
            renderListEditor('pendientes', actaData.pendientes);
            renderListEditor('acciones', actaData.acciones);
        }

        function renderListEditor(category, items) {
            const container = document.getElementById(`editor-${category}`);
            container.innerHTML = '';
            items.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'flex items-start gap-2';
                div.innerHTML = `
                    <textarea rows="3" oninput="updateItem('${category}', ${index}, this.value)" class="w-full px-3 py-2 text-sm leading-snug rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y">${escapeHtml(item)}</textarea>
                    <button onclick="removeItem('${category}', ${index})" class="text-slate-400 hover:text-rose-600 p-2 transition" title="Eliminar ítem">
                        <i class="fa-solid fa-trash-can text-xs"></i>
                    </button>`;
                container.appendChild(div);
            });
        }

        function addItem(category) { actaData[category].push("Nuevo punto descriptivo..."); renderEditors(); updatePreview(); }
        function removeItem(category, index) { actaData[category].splice(index, 1); renderEditors(); updatePreview(); }
        function updateItem(category, index, value) { actaData[category][index] = value; updatePreview(); }

        function updatePreview() {
            actaData.fecha = document.getElementById('input-fecha').value;
            actaData.titulo = document.getElementById('input-titulo').value;
            actaData.consultoria = document.getElementById('input-consultoria').value;
            actaData.proceso = document.getElementById('input-proceso').value;
            actaData.elabora = document.getElementById('input-elabora').value;

            document.getElementById('prev-fecha').innerText = actaData.fecha;
            document.getElementById('prev-titulo').innerText = actaData.titulo;
            document.getElementById('prev-consultoria').innerText = actaData.consultoria;
            document.getElementById('prev-proceso').innerText = actaData.proceso;
            document.getElementById('prev-elabora').innerText = actaData.elabora;

            renderPreviewList('prev-list-temas', actaData.temas);
            renderPreviewList('prev-list-pendientes', actaData.pendientes);
            renderPreviewList('prev-list-acciones', actaData.acciones);
            posicionarDecoraciones();
            ajustarVistaPrevia();
        }

        function renderPreviewList(elementId, items) {
            const ul = document.getElementById(elementId);
            ul.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
        }

        function escapeHtml(t) {
            return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
        }


        // ===== Adornos: cada uno puede reemplazarse por un PNG propio =====
        const DECO = {
            titulo:     { nombre: 'Garabato del título (detrás de "Reunión")', caja: { x: 918, y: 150,  w: 178 }, sel: null,      y0: 0,    g: 'deco-titulo' },
            temas:      { nombre: 'Óvalo de "Temas Tratados"',                caja: { x: 110, y: 513,  w: 310 }, sel: '.sec-1', y0: 527,  g: 'deco-1' },
            pendientes: { nombre: 'Flecha de "Pendientes a realizar"',        caja: { x: 342, y: 1047, w: 152 }, sel: '.sec-2', y0: 996,  g: 'deco-2' },
            acciones:   { nombre: 'Subrayado de "Acciones acordadas"',        caja: { x: 214, y: 1530, w: 200 }, sel: '.sec-3', y0: 1393, g: 'deco-3' }
        };
        const DECO_SRC = {
            titulo: 'img/garabato_1.png',
            temas: 'img/garabato_2.png',
            pendientes: 'img/garabato_3.png',
            acciones: 'img/garabato_4.png'
        };
        const decoEstado = {};
        Object.keys(DECO).forEach(k => decoEstado[k] = { src: DECO_SRC[k], dx: 0, dy: 0, esc: 100 });

        // Los adornos acompañan a su sección aunque cambie la cantidad de texto
        function posicionarDecoraciones() {
            const acta = document.getElementById('acta-preview');
            Object.entries(DECO).forEach(([k, d]) => {
                let y = 0;
                if (d.sel) {
                    let el = document.querySelector(d.sel + ' ul'), pos = 0;
                    while (el && el !== acta) { pos += el.offsetTop; el = el.offsetParent; }
                    y = pos - d.y0;
                }
                const g = document.getElementById(d.g);
                g.setAttribute('transform', `translate(0 ${y})`);
                const img = document.getElementById('img-deco-' + k);
                const e = decoEstado[k];
                if (e.src) {
                    if (img.getAttribute('src') !== e.src) img.src = e.src;
                    img.style.display = 'block';
                    img.style.left = (d.caja.x + e.dx) + 'px';
                    img.style.top = (d.caja.y + e.dy + y) + 'px';
                    // Ancho y alto explícitos (calculados con las proporciones del PNG): así el PDF no depende de cómo cada navegador resuelva "height:auto"
                    const w = d.caja.w * e.esc / 100;
                    img.style.width = w + 'px';
                    img.style.height = img.naturalWidth ? (w * img.naturalHeight / img.naturalWidth) + 'px' : 'auto';
                    g.style.display = 'none';
                } else {
                    img.style.display = 'none';
                    g.style.display = '';
                }
            });
        }

        function renderAdornos() {
            const c = document.getElementById('editor-adornos');
            c.innerHTML = '';
            Object.entries(DECO).forEach(([k, d]) => {
                const e = decoEstado[k];
                const sl = (campo, etiqueta, min, max) => `
                    <label class="block text-[11px] text-slate-500 mt-1">${etiqueta}: <span id="val-${k}-${campo}">${e[campo]}</span>
                        <input type="range" min="${min}" max="${max}" value="${e[campo]}" oninput="ajustarAdorno('${k}','${campo}',this.value)" class="w-full accent-amber-500">
                    </label>`;
                const div = document.createElement('div');
                div.className = 'p-3 rounded-lg border border-slate-200 bg-slate-50';
                div.innerHTML = `
                    <div class="text-xs font-bold text-slate-700 mb-2">${d.nombre}</div>
                    <input type="file" accept="image/png,image/svg+xml,image/*" onchange="cargarAdorno('${k}', this)" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100">
                    ${e.src ? `<details class="mt-2"><summary class="text-xs font-semibold text-amber-700 cursor-pointer">Ajustar posición y tamaño</summary>` + sl('dx', 'Mover horizontal (px)', -300, 300) + sl('dy', 'Mover vertical (px)', -300, 300) + sl('esc', 'Tamaño (%)', 20, 300) + `
                    <button onclick="quitarAdorno('${k}')" class="mt-2 text-xs text-rose-600 hover:text-rose-700 font-semibold"><i class="fa-solid fa-rotate-left"></i> Restaurar adorno original</button></details>` : ''}`;
                c.appendChild(div);
            });
        }

        function cargarAdorno(k, input) {
            const f = input.files && input.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = ev => { decoEstado[k] = { src: ev.target.result, dx: 0, dy: 0, esc: 100 }; renderAdornos(); posicionarDecoraciones(); };
            r.readAsDataURL(f);
        }
        function ajustarAdorno(k, campo, valor) {
            decoEstado[k][campo] = Number(valor);
            document.getElementById(`val-${k}-${campo}`).textContent = valor;
            posicionarDecoraciones();
        }
        function quitarAdorno(k) {
            decoEstado[k] = { src: DECO_SRC[k], dx: 0, dy: 0, esc: 100 };
            renderAdornos(); posicionarDecoraciones();
        }

        // Escala la hoja A4 para que entre completa en el panel de vista previa
        function ajustarVistaPrevia() {
            const caja = document.getElementById('caja-preview');
            const esc = document.getElementById('escala');
            const acta = document.getElementById('acta-preview');
            esc.style.transform = 'none';
            const anchoHoja = esc.offsetWidth;
            const s = Math.min(1.6, caja.clientWidth / anchoHoja);
            esc.style.transform = `scale(${s})`;
            esc.style.marginLeft = Math.max(0, (caja.clientWidth - anchoHoja * s) / 2) + 'px';
            caja.style.height = (acta.offsetHeight * s) + 'px';
        }
        window.addEventListener('resize', ajustarVistaPrevia);

        function cambiarLogo(input) {
            const f = input.files && input.files[0];
            if (!f) return;
            const r = new FileReader();
            r.onload = e => { const img = document.getElementById('prev-logo'); img.onload = ajustarVistaPrevia; img.src = e.target.result; };
            r.readAsDataURL(f);
        }

        async function exportToPDF(btn) {
            const original = btn.innerHTML;
            btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generando PDF...`;
            btn.disabled = true;
            let host, parche;
            try {
                await document.fonts.ready;
                // Esperar a que los adornos y el logo estén cargados antes de medir y dibujar
                await Promise.all([...document.querySelectorAll('#acta-preview img')].filter(i => i.getAttribute('src')).map(i => i.decode().catch(() => {})));
                posicionarDecoraciones();
                // Evita que los estilos globales (Tailwind) desplacen el texto al dibujar el PDF
                parche = document.createElement('style');
                parche.textContent = 'img, svg { display: inline !important; vertical-align: baseline !important; }';
                document.head.appendChild(parche);
                // Copia de la hoja a tamaño real (1545 px), fuera de pantalla y sin escala
                host = document.createElement('div');
                host.style.cssText = 'position:fixed;left:-20000px;top:0;width:1545px;background:#fff;';
                const copia = document.getElementById('acta-preview').cloneNode(true);
                copia.removeAttribute('id');
                host.appendChild(copia);
                document.body.appendChild(host);
                const canvas = await html2canvas(copia, {
                    scale: 2, backgroundColor: '#ffffff', useCORS: true, width: 1545, windowWidth: 1545, scrollX: 0, scrollY: 0,
                    // Mismo parche en el documento clonado
                    onclone: doc => { const e = doc.createElement('style'); e.textContent = 'img, svg { display: inline !important; vertical-align: baseline !important; }'; doc.head.appendChild(e); }
                });
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
                const altoPagina = Math.round(canvas.width * 297 / 210);
                const paginas = Math.max(1, Math.ceil((canvas.height - 6) / altoPagina));
                for (let i = 0; i < paginas; i++) {
                    const c = document.createElement('canvas');
                    c.width = canvas.width; c.height = altoPagina;
                    const ctx = c.getContext('2d');
                    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
                    ctx.drawImage(canvas, 0, i * altoPagina, canvas.width, altoPagina, 0, 0, c.width, altoPagina);
                    if (i > 0) pdf.addPage();
                    pdf.addImage(c.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297);
                }
                pdf.save(`Acta_Reunion_${actaData.fecha.replace(/\//g, '-')}.pdf`);
            } catch (err) {
                console.error(err);
                alert('Error al generar el PDF.');
            } finally {
                if (host && host.parentNode) host.parentNode.removeChild(host);
                if (parche && parche.parentNode) parche.parentNode.removeChild(parche);
                btn.innerHTML = original; btn.disabled = false;
            }
        }

        function dataUrlABytes(u) {
            const b = atob(u.split(',')[1]);
            const a = new Uint8Array(b.length);
            for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
            return a;
        }

        // Word: misma estructura de dos columnas que la imagen (el garabato amarillo solo existe en el PDF)
        // Devuelve los bytes de una imagen, venga embebida (data:) o desde un archivo (img/logo_marley.png)
        async function bytesDeImagen(img) {
            const src = img.src;
            if (src.startsWith('data:')) return dataUrlABytes(src);
            try { const r = await fetch(src); if (r.ok) return new Uint8Array(await r.arrayBuffer()); } catch (e) { /* sigue */ }
            try {
                const c = document.createElement('canvas');
                c.width = img.naturalWidth; c.height = img.naturalHeight;
                c.getContext('2d').drawImage(img, 0, 0);
                return dataUrlABytes(c.toDataURL('image/png'));
            } catch (e) { return null; }
        }

        // Carga un script externo bajo demanda (respaldo si el CDN principal falla)
        function cargarScript(url) {
            return new Promise((ok, mal) => {
                const s = document.createElement('script');
                s.src = url; s.onload = ok; s.onerror = () => mal(new Error('No se pudo cargar ' + url));
                document.head.appendChild(s);
            });
        }

        function descargarBlob(blob, nombre) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = nombre;
            document.body.appendChild(a); a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1500);
        }

        async function exportToDocx() {
            if (!window.docx) { try { await cargarScript('https://unpkg.com/docx@7.8.2/build/index.js'); } catch (e) { console.error(e); } }
            if (!window.docx) { alert('No se pudo cargar la librería para generar el Word. Revisá tu conexión e intentá de nuevo.'); return; }
            const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ImageRun, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, TextWrappingType, LineRuleType } = window.docx;
            const F = "Montserrat";
            const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
            const sinBordes = { top: none, bottom: none, left: none, right: none };
            const tablaBordes = { ...sinBordes, insideHorizontal: none, insideVertical: none };

            const logo = document.getElementById('prev-logo');
            const ratio = (logo.naturalHeight / logo.naturalWidth) || 1;
            const logoW = 118;
            const logoBytes = await bytesDeImagen(logo);

            // Garabatos: imágenes flotantes detrás del texto, ancladas al título o a la etiqueta de cada sección
            const EMU_PX = 7560000 / 1545;            // 1 px de la hoja (1545 px = 210 mm) en EMU
            const PX_WORD = (210 / 25.4 * 96) / 1545;  // 1 px de la hoja en px de Word (96 dpi)
            // xCelda: borde izquierdo de la celda donde está anclado (Word 2013+ mide la posición desde la celda)
            async function adornoWord(clave, yAncla, xCelda) {
                const e = decoEstado[clave], d = DECO[clave];
                if (!e.src) return null;
                const img = document.getElementById('img-deco-' + clave);
                const bytes = await bytesDeImagen(img);
                if (!bytes || !img.naturalWidth) return null;
                const w = d.caja.w * e.esc / 100;
                return new ImageRun({
                    data: bytes,
                    transformation: { width: Math.round(w * PX_WORD), height: Math.round(w * img.naturalHeight / img.naturalWidth * PX_WORD) },
                    floating: {
                        horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: Math.round((d.caja.x + e.dx - xCelda) * EMU_PX) },
                        verticalPosition: { relative: VerticalPositionRelativeFrom.PARAGRAPH, offset: Math.round((d.caja.y + e.dy - yAncla) * EMU_PX) },
                        behindDocument: true,
                        allowOverlap: true,
                        layoutInCell: false,
                        wrap: { type: TextWrappingType.NONE }
                    }
                });
            }
            const XCELDA_ETIQUETA = 155, XCELDA_TITULO = 527;
            const adornos = {
                titulo: await adornoWord('titulo', 182, XCELDA_TITULO),
                temas: await adornoWord('temas', 528, XCELDA_ETIQUETA),
                pendientes: await adornoWord('pendientes', 1012, XCELDA_ETIQUETA),
                acciones: await adornoWord('acciones', 1362, XCELDA_ETIQUETA)
            };

            const cabecera = new Table({
                width: { size: 9411, type: WidthType.DXA },
                columnWidths: [2865, 6546],
                borders: tablaBordes,
                rows: [new TableRow({ children: [
                    new TableCell({ width: { size: 2865, type: WidthType.DXA }, borders: sinBordes, children: [
                        new Paragraph({ children: logoBytes ? [ new ImageRun({ data: logoBytes, transformation: { width: logoW, height: Math.round(logoW * ratio) } }) ] : [ new TextRun('') ] })
                    ]}),
                    new TableCell({ width: { size: 6546, type: WidthType.DXA }, borders: sinBordes, margins: { top: 120, marginUnitType: WidthType.DXA }, children: [
                        new Paragraph({ spacing: { after: 200 }, children: [ ...(adornos.titulo ? [adornos.titulo] : []), new TextRun({ text: actaData.titulo, bold: true, font: F, size: 54 }) ] }),
                        new Paragraph({ spacing: { after: 40 }, children: [ new TextRun({ text: `Fecha: ${actaData.fecha}`, font: F, size: 24 }) ] }),
                        new Paragraph({ spacing: { after: 40 }, children: [ new TextRun({ text: `Consultoría: ${actaData.consultoria}`, font: F, size: 24 }) ] }),
                        new Paragraph({ children: [ new TextRun({ text: `Proceso: ${actaData.proceso}`, font: F, size: 24 }) ] })
                    ]})
                ]})]
            });

            function filaSeccion(clave) {
                const lineas = ETIQUETAS[clave];
                const etiqueta = new Paragraph({
                    spacing: { line: 350, lineRule: LineRuleType.EXACT },
                    children: [ ...(adornos[clave] ? [adornos[clave]] : []), ...lineas.map((t, i) => new TextRun({ text: t, bold: true, font: F, size: 24, break: i === 0 ? 0 : 1 })) ]
                });
                const viñetas = actaData[clave].map((t, i) => new Paragraph({
                    bullet: { level: 0 },
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { before: 0, after: 0, line: 350, lineRule: LineRuleType.EXACT },
                    children: [ new TextRun({ text: t, font: F, size: 24, color: "1C1C1C" }) ]
                }));
                return new TableRow({ children: [
                    new TableCell({ width: { size: 3085, type: WidthType.DXA }, borders: sinBordes, margins: { top: 480, marginUnitType: WidthType.DXA }, children: [etiqueta] }),
                    new TableCell({ width: { size: 6326, type: WidthType.DXA }, borders: sinBordes, margins: { top: 480, marginUnitType: WidthType.DXA }, children: viñetas.length ? viñetas : [new Paragraph("")] })
                ]});
            }

            const secciones = new Table({
                width: { size: 9411, type: WidthType.DXA },
                columnWidths: [3085, 6326],
                borders: tablaBordes,
                rows: [filaSeccion('temas'), filaSeccion('pendientes'), filaSeccion('acciones')]
            });

            const pie = new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 600 },
                children: [ new TextRun({ text: `Elabora: ${actaData.elabora}`, font: "Open Sans", size: 22, color: "8C8C8C" }) ]
            });

            const doc = new Document({
                sections: [{
                    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 800, right: 1300, bottom: 800, left: 1195 } } },
                    children: [cabecera, secciones, pie]
                }]
            });

            try {
                const blob = await Packer.toBlob(doc);
                descargarBlob(blob, `Acta_Reunion_${actaData.fecha.replace(/\//g, '-')}.docx`);
            } catch (error) {
                console.error(error);
                alert("Error al generar el documento Word.");
            }
        }

        window.onload = function () {
            document.querySelectorAll('.acta-deco-img').forEach(i => i.addEventListener('load', posicionarDecoraciones));
            renderEditors();
            renderAdornos();
            updatePreview();
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { posicionarDecoraciones(); ajustarVistaPrevia(); });
        };
