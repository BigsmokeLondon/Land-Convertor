import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { translations } from '../locales';

export const generatePDF = (
  areaSqFt: number, 
  regionalName: string, 
  regionalArea: number, 
  points: any, 
  isUrdu: boolean,
  mapImage?: string, // base64
  metadata?: { surveyorName?: string, location?: string, clientName?: string, notes?: string }
) => {
  try {
    const t = isUrdu ? translations.ur : translations.en;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width || 210;
    const pageHeight = doc.internal.pageSize.height || 297;
    
    // Flatten if points is a 2D array of rings
    const flatPoints = (Array.isArray(points[0])) ? points.flat() : points;
    if (!flatPoints || flatPoints.length === 0) {
      alert("No points found to export.");
      return;
    }

    // Helper: Header & Branding
    const drawHeader = (doc: jsPDF, title: string) => {
      doc.setFillColor(27, 94, 32); // Deep Professional Green
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("LAND CONVERTER PRO", 14, 18);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("OFFICIAL MEASUREMENT CERTIFICATE", 14, 25);
      
      doc.setFontSize(16);
      doc.text(title, pageWidth - 14, 22, { align: 'right' });
    };

    // Helper: Footer
    const drawFooter = (doc: jsPDF) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text("Software developed by M.A. Industries Inc. | © " + new Date().getFullYear(), 14, pageHeight - 12);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
      }
    };

    // --- PAGE 1: OVERVIEW ---
    drawHeader(doc, "Survey Summary");
    
    // Metadata Section
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REPORT DETAILS", 14, 50);
    doc.setLineWidth(0.5);
    doc.setDrawColor(27, 94, 32);
    doc.line(14, 52, 50, 52);

    doc.setFont("helvetica", "normal");
    const labelX = 14;
    const valX = 60;
    let currentY = 60;

    const addMetaRow = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, labelX, currentY);
      doc.setFont("helvetica", "normal");
      doc.text(value || "Not Specified", valX, currentY);
      currentY += 8;
    };

    addMetaRow("Date:", new Date().toLocaleDateString('en-GB'));
    addMetaRow("Surveyor Name:", metadata?.surveyorName || "____________________");
    addMetaRow("Client Property:", metadata?.clientName || "____________________");
    addMetaRow("Survey Location:", metadata?.location || "____________________");

    // Summary Box
    doc.setFillColor(245, 248, 245);
    doc.setDrawColor(200, 210, 200);
    doc.roundedRect(14, 95, pageWidth - 28, 35, 3, 3, 'FD');

    doc.setFontSize(12);
    doc.setTextColor(27, 94, 32);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL MEASURED AREA", 20, 105);

    doc.setFontSize(22);
    doc.text(`${areaSqFt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SQ FT`, 20, 118);
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`≈ ${regionalArea.toFixed(2)} Marla (${regionalName})`, pageWidth - 25, 118, { align: 'right' });

    // Map Image
    if (mapImage) {
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.text("SITE PLAN / MAP VIEW", 14, 145);
      
      try {
        // High quality map placement
        const mapWidth = pageWidth - 28;
        const mapHeight = 100;
        doc.setDrawColor(200, 200, 200);
        doc.rect(14, 148, mapWidth, mapHeight);
        doc.addImage(mapImage, 'PNG', 14, 148, mapWidth, mapHeight);
      } catch (e) {
        console.warn("Map image embedding failed", e);
      }
    }

    // --- PAGE 2: TECHNICAL DATA ---
    doc.addPage();
    
    const tableData = flatPoints.map((p: any, i: number) => [
      `P${i + 1}`, 
      (p.lat || 0).toFixed(8), 
      (p.lng || 0).toFixed(8)
    ]);
    
    autoTable(doc, {
      startY: 55,
      head: [['Point ID', 'Latitude (North)', 'Longitude (East)']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [27, 94, 32], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [248, 250, 248] },
      margin: { left: 14, right: 14, top: 45, bottom: 25 },
      didDrawPage: (data) => {
        drawHeader(doc, "Technical Data");
        
        // Label for the table on the first page it appears
        if (data.pageNumber === 1) { // This is actually page 2 of the doc
           // but AutoTable treats its first page as 1
        }
        doc.setFontSize(10);
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "bold");
        doc.text("BOUNDARY COORDINATES", 14, 50);
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 55;

    // Legal & Certification
    // Ensure we are on the last page of the table
    doc.setPage(doc.internal.getNumberOfPages());
    
    if (finalY + 60 > pageHeight) {
      doc.addPage();
      drawHeader(doc, "Technical Data");
    }
    
    const currentFinalY = (doc as any).lastAutoTable.finalY || 55;
    const certY = Math.max(currentFinalY + 20, 70);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATION & VERIFICATION", 14, certY);
    doc.setLineWidth(0.2);
    doc.line(14, certY + 2, 50, certY + 2);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("I hereby certify that the measurements shown hereon were performed under my direct supervision and are accurate to the best of my professional knowledge based on GPS data provided by this software.", 14, certY + 10, { maxWidth: 100 });

    // Signature Line
    doc.line(130, certY + 30, 190, certY + 30);
    doc.setFontSize(8);
    doc.text("Authorized Signature/Stamp", 160, certY + 35, { align: 'center' });
    doc.text(`Issued: ${new Date().toLocaleString()}`, 160, certY + 40, { align: 'center' });

    // Legal Warning Bottom
    doc.setTextColor(180, 0, 0);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    const splitText = doc.splitTextToSize("DISCLAIMER: " + t.legalAlert, pageWidth - 28);
    doc.text(splitText, 14, pageHeight - 35);

    drawFooter(doc);

    doc.save(`Survey_Report_${new Date().getTime()}.pdf`);

  } catch (err: any) {
    console.error("PDF Export failed:", err);
    alert("Official Report PDF failed: " + err.message);
  }
}

export const generateConverterPDF = (results: any) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width || 210;
    const pageHeight = doc.internal.pageSize.height || 297;
    if (!results) throw new Error("No data results found to export.");

    // Header
    doc.setFillColor(27, 94, 32);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("LAND CONVERTER PRO", 14, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("UNITS CONVERSION REPORT", 14, 25);
    doc.setFontSize(16);
    doc.text("Manual Conversion", pageWidth - 14, 22, { align: 'right' });

    // Date
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}`, 14, 50);

    // Results Table
    const tableData = [
      ['Square Feet (Base)', `${(results.sqft || 0).toLocaleString()} Sq Ft`, '—'],
      ['Marla (Punjab Legal 225)', (results.legalMarla || 0).toFixed(3), 'Punjab Revenue Act'],
      ['Kanal (Punjab Legal)', (results.legalKanal || 0).toFixed(3), 'Punjab Revenue Act'],
      ['Marla (Lahore LDA 250)', (results.ldaMarla || 0).toFixed(3), 'Lahore Dev Authority'],
      ['Kanal (Lahore LDA)', (results.ldaKanal || 0).toFixed(3), 'Lahore Dev Authority'],
      ['Marla (Traditional 272.25)', (results.tradMarla || 0).toFixed(3), 'KPK / Rural Reference'],
      ['Kanal (KPK Ref)', (results.kpkKanal || 0).toFixed(3), 'KPK / Rural Reference'],
      ['Sq. Karam', (results.karam || 0).toFixed(2), 'Traditional Karam Unit'],
    ];

    autoTable(doc, {
      startY: 58,
      head: [['Unit / Standard', 'Calculated Value', 'Standard Reference']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [27, 94, 32], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 252, 248] },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 58;

    // Disclaimer
    doc.setFontSize(9);
    doc.setTextColor(180, 0, 0);
    doc.setFont("helvetica", "italic");
    const disclaimer = "DISCLAIMER: This conversion report is for reference only. While every effort is made for accuracy, please verify with official government revenue records for legal transactions.";
    const splitDisclaimer = doc.splitTextToSize(disclaimer, pageWidth - 28);
    doc.text(splitDisclaimer, 14, finalY + 15);

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("Software developed by M.A. Industries Inc. | Land Converter Pro v2.4", 14, pageHeight - 12);

    doc.save(`Conversion_Report_${new Date().getTime()}.pdf`);

  } catch (err: any) {
    console.error("Converter PDF failed:", err);
    alert("Conversion PDF Export failed: " + err.message);
  }
};

export const generateKML = (points: any) => {
  try {
    // Flatten if points is a 2D array of rings
    const flatPoints = (Array.isArray(points[0])) ? points.flat() : points;
    
    if (!flatPoints || flatPoints.length < 3) {
      alert("Require at least 3 points for KML boundary export.");
      return;
    }
    
    // Close the polygon
    const kmlPoints = [...flatPoints, flatPoints[0]];
    const coordinates = kmlPoints.map((p: any) => `${p.lng || 0},${p.lat || 0},0`).join('\n              ');

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Land Survey Polygon</name>
    <Placemark>
      <name>Survey Area</name>
      <Style>
        <LineStyle>
          <color>ff0000ff</color>
          <width>2</width>
        </LineStyle>
        <PolyStyle>
          <color>7f0000ff</color>
        </PolyStyle>
      </Style>
      <Polygon>
        <tessellate>1</tessellate>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${coordinates}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Land_Survey.kml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err: any) {
    console.error("KML Export failed:", err);
    alert("KML Export failed: " + err.message);
  }
}

export const generateCSV = (rings: {lat: number, lng: number}[][]) => {
  try {
    const allPoints = rings.flat();
    if (allPoints.length === 0) {
      alert("No points to export.");
      return;
    }
    
    const headers = "Point,Latitude,Longitude\n";
    const rows = allPoints.map((p, i) => `P${i + 1},${p.lat},${p.lng}`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Survey_Points.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err: any) {
    console.error("CSV Export failed:", err);
    alert("CSV Export failed: " + err.message);
  }
};
