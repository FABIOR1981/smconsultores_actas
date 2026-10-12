document.addEventListener('DOMContentLoaded', () => {
    // Mapeo de elementos de entrada con la vista previa
    const bindings = [
        { input: 'inputTitulo', prev: 'prevTitulo' },
        { input: 'inputSubtitulo', prev: 'prevSubtitulo' },
        { input: 'inputIntro', prev: 'prevIntro' },
        { input: 'inputTel', prev: 'prevTel' },
        { input: 'inputEmail', prev: 'prevEmail' },
        { input: 'inputUbicacion', prev: 'prevUbicacion' }
    ];

    bindings.forEach(item => {
        const inputEl = document.getElementById(item.input);
        const prevEl = document.getElementById(item.prev);
        if (inputEl && prevEl) {
            inputEl.addEventListener('input', () => {
                prevEl.textContent = inputEl.value;
            });
        }
    });

    // Sincronización especial para la lista de temas separados por comas
    const inputTemas = document.getElementById('inputTemas');
    const prevTemasLista = document.getElementById('prevTemasLista');

    if (inputTemas && prevTemasLista) {
        inputTemas.addEventListener('input', () => {
            const temas = inputTemas.value.split(',');
            prevTemasLista.innerHTML = '';
            temas.forEach(tema => {
                const li = document.createElement('li');
                li.textContent = tema.trim();
                if (li.textContent !== '') {
                    prevTemasLista.appendChild(li);
                }
            });
        });
    }

    // Funcionalidad de exportación a PDF
    document.getElementById('btnPdf').addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const page = document.getElementById('page1');
        
        try {
            const canvas = await html2canvas(page, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('folleto_profesional.pdf');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Ocurrió un error al generar el PDF.');
        }
    });

    // Funcionalidad básica de exportación a Word (.docx)
    document.getElementById('btnWord').addEventListener('click', async () => {
        const { Document, Packer, Paragraph, HeadingLevel, TextRun } = window.docx;

        const titulo = document.getElementById('inputTitulo').value;
        const subtitulo = document.getElementById('inputSubtitulo').value;
        const intro = document.getElementById('inputIntro').value;
        const tel = document.getElementById('inputTel').value;
        const email = document.getElementById('inputEmail').value;
        const ubicacion = document.getElementById('inputUbicacion').value;

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: titulo,
                        heading: HeadingLevel.TITLE,
                    }),
                    new Paragraph({
                        text: subtitulo,
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: "",
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: "Descripción / Introducción:", bold: true })],
                    }),
                    new Paragraph({
                        text: intro,
                    }),
                    new Paragraph({
                        text: "",
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Contacto: ", bold: true }),
                            new TextRun(`Tel: ${tel} | Email: ${email} | Ubicación: ${ubicacion}`)
                        ],
                    }),
                ],
            }],
        });

        try {
            const blob = await Packer.toBlob(doc);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'folleto_profesional.docx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al generar Word:', error);
            alert('Ocurrió un error al generar el documento de Word.');
        }
    });
});