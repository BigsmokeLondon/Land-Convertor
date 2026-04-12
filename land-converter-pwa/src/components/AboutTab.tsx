export function AboutTab() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-gray-800 pb-10">
      <div className="bg-[#2E7D32] text-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">ULTIMATE PAKISTANI LAND CONVERTER</h2>
        <p className="text-green-100">Patwari/Lawyer Reference Guide • Punjab Revenue Act Compliant</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-[#1976D2] mb-3">🔷 Purpose of This Tool</h3>
        <p className="text-sm leading-relaxed text-gray-600">
          This application provides instant, court-admissible land unit conversions for Pakistani revenue officials, lawyers, and property professionals.
          It solves the critical problem of measurement confusion between the Punjab Legal Standard (225 sq ft) and Traditional builder measurements (272 sq ft).
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800">⚖️ Critical Legal Standards</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-[#E3F2FD] p-4 rounded-xl border border-blue-200">
            <h4 className="font-bold text-[#1976D2]">Punjab Legal (Revenue Act Standard)</h4>
            <p className="text-sm mt-1"><strong>1 Marla = 225 sq ft</strong></p>
            <p className="text-xs text-blue-800 mt-2">This is the ONLY standard accepted for Fard (Record of Rights), Mutations (Int انتقال), and official land registration. It is exactly 272.25 sq ft if calculated using Karam, but for practical revenue purposes, it is locked at 225 sq ft in modern urban areas.</p>
          </div>
          <div className="bg-[#FFF9C4] p-4 rounded-xl border border-yellow-300">
            <h4 className="font-bold text-[#F57F17]">Traditional Reference (KPK/Builders)</h4>
            <p className="text-sm mt-1"><strong>1 Marla = 272 sq ft</strong></p>
            <p className="text-xs text-yellow-800 mt-2">Often used in rural areas and KPK. It is NOT legally valid in Punjab's official urban records. Buying a "5 Marla" plot at 272 sq ft vs 225 sq ft yields a massive difference. Always check the deed measurement system.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-green-700 mb-3">📐 Measuring Irregular Local Plots (Triangulation)</h3>
        <p className="text-sm leading-relaxed text-gray-600 mb-4">
          Pakistani plots are rarely perfect rectangles. When measuring an irregular 5-sided or 6-sided plot on the ground, do not just average the sides (this is mathematically inaccurate and leads to litigation). Instead, divide the shape into triangles using Diagonals. This software supports Triangulation modes exactly for this reason.
        </p>
        <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg">
          <h4 className="font-bold text-sm mb-2">Example: 5-Sided Plot</h4>
          <ol className="list-decimal list-inside text-xs space-y-1 text-gray-700">
            <li>Measure all 5 outer boundary lines (Sides 1-5).</li>
            <li>Stand at Corner A and measure straight across the plot to Corner C (Diagonal 1).</li>
            <li>Stand at Corner A and measure straight to Corner D (Diagonal 2).</li>
            <li>Enter these 7 values into the <strong>Irregular 5-Sided</strong> mode in the Area Calculator tab. The app breaks it down into 3 perfect Heron's triangles dynamically.</li>
          </ol>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-indigo-700 mb-3">🧭 Shoelace (Coordinates) Method</h3>
        <p className="text-sm leading-relaxed text-gray-600">
          The Shoelace Calculator allows entering (X, Y) coordinates of plot vertices directly from a Patwari map or AutoCAD data. To use it, simply enter the coordinates in **clockwise or counter-clockwise** order. Leaving the last boxes blank on smaller shapes will automatically terminate the calculation ring correctly.
        </p>
      </div>

      <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-200">
        <h3 className="text-xl font-bold text-red-700 mb-3">⚠️ Liability Notice</h3>
        <p className="text-sm leading-relaxed text-red-900">
          This tool provides mathematical conversions only. It does NOT constitute legal advice. 
          Providing false information to a public servant (e.g., using 272 sq ft standard in a mutation) is punishable with imprisonment or fines under Section 182 PPC.
          Always verify boundaries physically with a jarib before mutating.
        </p>
      </div>
    </div>
  );
}
