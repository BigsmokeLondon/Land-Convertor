import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { translations } from '../locales';

export const generatePDF = (areaSqFt: number, regionalName: string, regionalArea: number, points: {lat: number, lng: number}[], isUrdu: boolean) => {
  const t = isUrdu ? translations.ur : translations.en;
  const doc = new jsPDF();
  
  // Header Box
  doc.setFillColor(46, 125, 50); // Brand Green
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Official Land Survey Report", 14, 20);
  
  // Reset text for body
  doc.setTextColor(0, 0, 0);
  
  // Form Details (Area, City, Town)
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Date: ________________________", 14, 45);
  doc.text("Surveyor Name: ________________________", 100, 45);
  
  doc.text("Survey Location (Area/Town/City): _________________________________________________", 14, 55);
  doc.text("Plot Reference/Khasra No: _________________________________________________________", 14, 65);

  // Measurement Results Box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(245, 245, 245);
  doc.rect(14, 75, 182, 25, 'FD');
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Measurement Results:", 18, 83);
  
  doc.setFontSize(14);
  doc.setTextColor(46, 125, 50);
  doc.text(`Total Area: ${areaSqFt.toFixed(2)} Sq Ft`, 18, 93);
  doc.text(`Converted: ${regionalArea.toFixed(4)} Marla (${regionalName})`, 100, 93);

  // Coordinates Table
  doc.setTextColor(0, 0, 0);
  const tableData = points.map((p, i) => [`P${i + 1}`, p.lat.toFixed(6), p.lng.toFixed(6)]);
  
  autoTable(doc, {
    startY: 110,
    head: [['Boundary Point', 'Latitude (North)', 'Longitude (East)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 14, right: 14 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 110;
  
  // Legal notice bounds
  doc.setFontSize(10);
  doc.setTextColor(200, 0, 0); // red warn
  doc.setFont("helvetica", "italic");
  const splitText = doc.splitTextToSize(t.legalAlert, 180);
  doc.text(splitText, 14, finalY + 15);

  // Footer - M.A. Industries
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Software developed and brought to you by M.A. Industries Inc. © " + new Date().getFullYear(), 14, pageHeight - 10);

  doc.save('Land_Survey_Report.pdf');
}

export const generateConverterPDF = (results: any) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(46, 125, 50);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Land Conversion Report", 14, 20);

  // Date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 38);

  // Results Table
  const tableData = [
    ['Square Feet', results.sqft.toFixed(2), '—'],
    ['Marla (Punjab Legal 225)', results.legalMarla.toFixed(4), 'Punjab Revenue Act'],
    ['Kanal (Punjab Legal)', results.legalKanal.toFixed(4), 'Punjab Revenue Act'],
    ['Marla (Lahore LDA 250)', results.ldaMarla.toFixed(4), 'Lahore Development Authority'],
    ['Kanal (Lahore LDA)', results.ldaKanal.toFixed(4), 'Lahore Development Authority'],
    ['Marla (Traditional 272)', results.tradMarla.toFixed(4), 'KPK / Rural Reference'],
    ['Kanal (KPK Ref)', results.kpkKanal.toFixed(4), 'KPK / Rural Reference'],
    ['Sq. Karam', results.karam.toFixed(4), 'Traditional Karam Unit'],
  ];

  autoTable(doc, {
    startY: 48,
    head: [['Unit', 'Value', 'Standard / Jurisdiction']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [46, 125, 50], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 48;

  // Legal Warning
  doc.setFontSize(9);
  doc.setTextColor(180, 0, 0);
  doc.setFont("helvetica", "italic");
  doc.text("DISCLAIMER: This report is for reference only. Always verify with official revenue records.", 14, finalY + 14);

  // Footer
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Software developed and brought to you by M.A. Industries Inc. © " + new Date().getFullYear(), 14, pageHeight - 10);

  doc.save('Conversion_Report.pdf');
};

export const generateKML = (points: {lat: number, lng: number}[]) => {
  if (points.length < 3) return;
  
  // Close the polygon
  const kmlPoints = [...points, points[0]];
  const coordinates = kmlPoints.map(p => `${p.lng},${p.lat},0`).join('\n              ');

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
}
