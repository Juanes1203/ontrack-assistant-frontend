import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ClassAnalysis } from '@/types/classAnalysis';

export interface PDFExportData {
  className: string;
  teacher: string;
  date: string;
  transcript: string;
  classAnalysis: ClassAnalysis;
}

export class PDFService {
  static async generateClassReport(data: PDFExportData): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Configuración de estilos
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Función helper para agregar texto con wrap
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false, color: string = '#000000') => {
      doc.setFontSize(fontSize);
      doc.setTextColor(color);
      if (isBold) {
        doc.setFont(undefined, 'bold');
      } else {
        doc.setFont(undefined, 'normal');
      }
      
      const lines = doc.splitTextToSize(text, contentWidth);
      if (yPosition + (lines.length * fontSize * 0.4) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.4 + 5;
    };

    // Función helper para agregar sección
    const addSection = (title: string, content: string) => {
      addText(title, 14, true, '#2563eb');
      addText(content, 11, false, '#374151');
      yPosition += 10;
    };

    // Función helper para agregar lista
    const addList = (title: string, items: string[]) => {
      addText(title, 12, true, '#2563eb');
      items.forEach((item, index) => {
        addText(`• ${item}`, 10, false, '#374151');
      });
      yPosition += 5;
    };

    // Función helper para agregar criterio de evaluación
    const addCriterio = (title: string, criterio: any) => {
      addText(title, 12, true, '#7c3aed');
      addText(`Nivel: ${criterio.nivel}`, 10, true, '#059669');
      
      if (criterio.evidencias && criterio.evidencias.length > 0) {
        addText('Evidencias:', 10, true, '#374151');
        criterio.evidencias.forEach((evidencia: string) => {
          addText(`  - ${evidencia}`, 9, false, '#6b7280');
        });
      }
      
      if (criterio.recomendaciones && criterio.recomendaciones.length > 0) {
        addText('Recomendaciones:', 10, true, '#374151');
        criterio.recomendaciones.forEach((recomendacion: string) => {
          addText(`  - ${recomendacion}`, 9, false, '#6b7280');
        });
      }
      yPosition += 5;
    };

    // Página 1: Portada
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    addText('MENTORAI', 24, true, '#ffffff');
    yPosition += 5;
    addText('Reporte de Análisis de Clase', 16, false, '#ffffff');
    yPosition += 20;
    
    addText(`Clase: ${data.className}`, 14, true);
    addText(`Profesor: ${data.teacher}`, 12, false);
    addText(`Fecha: ${data.date}`, 12, false);
    addText(`Duración: ${data.classAnalysis.resumen.duracion}`, 12, false);
    
    yPosition += 20;
    addText('Este reporte contiene un análisis completo de la sesión de clase,', 10, false, '#6b7280');
    addText('incluyendo transcripción, criterios de evaluación ECDF, momentos clave', 10, false, '#6b7280');
    addText('y recomendaciones para la mejora del proceso educativo.', 10, false, '#6b7280');

    // Página 2: Resumen
    doc.addPage();
    yPosition = margin;
    
    addText('RESUMEN DE LA CLASE', 16, true, '#2563eb');
    yPosition += 10;
    
    addSection('Tema', data.classAnalysis.resumen.tema);
    addSection('Objetivos', data.classAnalysis.resumen.objetivos);
    
    addText('Participantes:', 12, true, '#2563eb');
    addText('Profesores:', 10, true, '#374151');
    data.classAnalysis.resumen.participantes.profesores.forEach(profesor => {
      addText(`  • ${profesor}`, 10, false, '#6b7280');
    });
    addText('Estudiantes:', 10, true, '#374151');
    data.classAnalysis.resumen.participantes.estudiantes.forEach(estudiante => {
      addText(`  • ${estudiante}`, 10, false, '#6b7280');
    });

    // Página 3: Criterios ECDF
    doc.addPage();
    yPosition = margin;
    
    addText('CRITERIOS DE EVALUACIÓN ECDF', 16, true, '#2563eb');
    yPosition += 15;

    // Contexto de Práctica
    addText('CONTEXTO DE PRÁCTICA', 14, true, '#7c3aed');
    yPosition += 5;
    addCriterio('Comprensión del Contexto', data.classAnalysis.criterios_evaluacion.contexto_practica.comprension_contexto);
    addCriterio('Flexibilidad de Práctica', data.classAnalysis.criterios_evaluacion.contexto_practica.flexibilidad_practica);
    addCriterio('Vinculación con Familias', data.classAnalysis.criterios_evaluacion.contexto_practica.vinculacion_familias);

    // Reflexión y Planeación
    doc.addPage();
    yPosition = margin;
    addText('REFLEXIÓN Y PLANEACIÓN', 14, true, '#7c3aed');
    yPosition += 5;
    addCriterio('Propósitos Claros', data.classAnalysis.criterios_evaluacion.reflexion_planeacion.propositos_claros);
    addCriterio('Articulación de Contenidos', data.classAnalysis.criterios_evaluacion.reflexion_planeacion.articulacion_contenidos);
    addCriterio('Organización del Conocimiento', data.classAnalysis.criterios_evaluacion.reflexion_planeacion.organizacion_conocimiento);

    // Praxis Pedagógica
    doc.addPage();
    yPosition = margin;
    addText('PRAXIS PEDAGÓGICA', 14, true, '#7c3aed');
    yPosition += 5;
    addCriterio('Comunicación Docente-Estudiantes', data.classAnalysis.criterios_evaluacion.praxis_pedagogica.comunicacion_docente_estudiantes);
    addCriterio('Estrategias de Participación', data.classAnalysis.criterios_evaluacion.praxis_pedagogica.estrategias_participacion);
    addCriterio('Interés de Estudiantes', data.classAnalysis.criterios_evaluacion.praxis_pedagogica.interes_estudiantes);

    // Ambiente de Aula
    doc.addPage();
    yPosition = margin;
    addText('AMBIENTE DE AULA', 14, true, '#7c3aed');
    yPosition += 5;
    addCriterio('Clima de Respeto', data.classAnalysis.criterios_evaluacion.ambiente_aula.clima_respeto);
    addCriterio('Toma de Decisiones', data.classAnalysis.criterios_evaluacion.ambiente_aula.toma_decisiones);
    addCriterio('Estructura y Organización', data.classAnalysis.criterios_evaluacion.ambiente_aula.estructura_organizacion);

    // Página: Momentos Clave
    doc.addPage();
    yPosition = margin;
    
    addText('MOMENTOS CLAVE', 16, true, '#2563eb');
    yPosition += 10;
    
    data.classAnalysis.momentos_clave.forEach((momento, index) => {
      addText(`${index + 1}. ${momento.tiempo} - ${momento.tipo}`, 12, true, '#059669');
      addText(`Participante: ${momento.participante}`, 10, false, '#6b7280');
      addText(`Descripción: ${momento.descripcion}`, 10, false, '#374151');
      addText(`Impacto: ${momento.impacto}`, 10, false, '#374151');
      yPosition += 5;
    });

    // Página: Participación
    doc.addPage();
    yPosition = margin;
    
    addText('ANÁLISIS DE PARTICIPACIÓN', 16, true, '#2563eb');
    yPosition += 10;
    
    addSection('Nivel de Participación', data.classAnalysis.participacion_estudiantes.nivel_participacion);
    
    addList('Tipos de Interacción', data.classAnalysis.participacion_estudiantes.tipos_interaccion);
    addList('Momentos Destacados', data.classAnalysis.participacion_estudiantes.momentos_destacados);
    
    addText('Distribución de Participación:', 12, true, '#2563eb');
    addText(`Profesores: ${data.classAnalysis.participacion_estudiantes.distribucion_participacion.profesores.tiempo_total} (${data.classAnalysis.participacion_estudiantes.distribucion_participacion.profesores.intervenciones} intervenciones)`, 10, false, '#374151');
    addText(`Estudiantes: ${data.classAnalysis.participacion_estudiantes.distribucion_participacion.estudiantes.tiempo_total} (${data.classAnalysis.participacion_estudiantes.distribucion_participacion.estudiantes.intervenciones} intervenciones)`, 10, false, '#374151');

    // Página: Áreas de Mejora
    doc.addPage();
    yPosition = margin;
    
    addText('ÁREAS DE MEJORA', 16, true, '#2563eb');
    yPosition += 10;
    
    addList('Fortalezas', data.classAnalysis.areas_mejora.fortalezas);
    addList('Oportunidades', data.classAnalysis.areas_mejora.oportunidades);
    addList('Recomendaciones Generales', data.classAnalysis.areas_mejora.recomendaciones_generales);

    // Página: Transcripción
    doc.addPage();
    yPosition = margin;
    
    addText('TRANSCRIPCIÓN COMPLETA', 16, true, '#2563eb');
    yPosition += 10;
    
    // Dividir la transcripción en páginas si es muy larga
    const transcriptLines = doc.splitTextToSize(data.transcript, contentWidth);
    let currentPage = 0;
    
    for (let i = 0; i < transcriptLines.length; i++) {
      if (yPosition + 5 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
        currentPage++;
      }
      doc.setFontSize(9);
      doc.setTextColor('#374151');
      doc.text(transcriptLines[i], margin, yPosition);
      yPosition += 4;
    }

    // Guardar el PDF
    const fileName = `Reporte_Clase_${data.className.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }

  static async generatePDFFromElement(element: HTMLElement, fileName: string = 'report.pdf'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Error al generar el PDF');
    }
  }
} 