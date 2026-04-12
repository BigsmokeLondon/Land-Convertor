import ExcelJS from 'exceljs';

export async function exportToExcel(data: any[]) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Conversions');

  // Add Columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 5 },
    { header: 'Square Feet', key: 'sqft', width: 15 },
    { header: 'Marla (Legal)', key: 'legalMarla', width: 15 },
    { header: 'Kanal (Legal)', key: 'legalKanal', width: 15 },
    { header: 'Marla (Trad)', key: 'tradMarla', width: 15 },
    { header: 'Kanal (KPK)', key: 'kpkKanal', width: 15 },
  ];

  // Style Header Row
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2E7D32' } // Patwari Green
  };

  // Add Data
  data.forEach((row, i) => {
    worksheet.addRow({
      id: i + 1,
      sqft: row.sqft,
      legalMarla: row.legalMarla,
      legalKanal: row.legalKanal,
      tradMarla: row.tradMarla,
      kpkKanal: row.kpkKanal
    });
  });

  // Generate File
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  // Download automatically
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Land_Conversions.xlsx';
  anchor.click();
  window.URL.revokeObjectURL(url);
}
