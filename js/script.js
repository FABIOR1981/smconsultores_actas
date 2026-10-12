// Sincronización en tiempo real999
const campos = ['titulo', 'fecha', 'lugar', 'participantes', 'temas', 'acuerdos', 'firma1', 'firma2'];

campos.forEach(campo => {
    const input = document.getElementById(`in-${campo}`);
    const output = document.getElementById(`out-${campo}`);
    
    input.addEventListener('input', (e) => {
        let valor = e.target.value;
        if(campo === 'fecha' && valor) {
            // Formatear fecha a DD/MM/YYYY
            const [y, m, d] = valor.split('-');
            valor = `${d}/${m}/${y}`;
        }
        output.innerText = valor || (campo.includes('firma') ? `Firma ${campo.slice(-1)}` : '_________________');
    });
});

// Poner fecha de hoy por defecto
document.getElementById('in-fecha').valueAsDate = new Date();
document.getElementById('in-fecha').dispatchEvent(new Event('input'));

// Exportar a PDF usando html2canvas y jsPDF
window.exportarPDF = function() {
    const doc = document.getElementById('document-preview');
    html2canvas(doc, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Acta_Reunion.pdf');
    });
}

// Exportar a Word (Texto plano estructurado) usando docx
window.exportarWord = function() {
    const titulo = document.getElementById('out-titulo').innerText;
    const fecha = document.getElementById('out-fecha').innerText;
    const lugar = document.getElementById('out-lugar').innerText;
    const participantes = document.getElementById('out-participantes').innerText;
    const temas = document.getElementById('out-temas').innerText;
    const acuerdos = document.getElementById('out-acuerdos').innerText;
    const firma1 = document.getElementById('out-firma1').innerText;
    const firma2 = document.getElementById('out-firma2').innerText;

    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                new docx.Paragraph({
                    text: titulo,
                    heading: docx.HeadingLevel.HEADING_1,
                    alignment: docx.AlignmentType.CENTER,
                }),
                new docx.Paragraph({ text: "" }),
                new docx.Paragraph({ text: `Fecha: ${fecha}`, bold: true }),
                new docx.Paragraph({ text: `Lugar: ${lugar}`, bold: true }),
                new docx.Paragraph({ text: `Participantes: ${participantes}`, bold: true }),
                new docx.Paragraph({ text: "" }),
                new docx.Paragraph({
                    text: "1. Temas Tratados y Desarrollo",
                    heading: docx.HeadingLevel.HEADING_2,
                }),
                new docx.Paragraph({ text: temas }),
                new docx.Paragraph({ text: "" }),
                new docx.Paragraph({
                    text: "2. Acuerdos y Compromisos",
                    heading: docx.HeadingLevel.HEADING_2,
                }),
                new docx.Paragraph({ text: acuerdos }),
                new docx.Paragraph({ text: "" }),
                new docx.Paragraph({ text: "" }),
                new docx.Paragraph({ text: "Firmas:", bold: true }),
                new docx.Paragraph({ text: `_______________________          _______________________` }),
                new docx.Paragraph({ text: `${firma1}                                 ${firma2}` })
            ],
        }]
    });

    docx.Packer.toBlob(doc).then(blob => {
        saveAs(blob, "Acta_Reunion.docx");
    });
}