import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function VizTab({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <h2 className="text-xl font-bold text-gray-500 mb-2">No Data Available</h2>
        <p className="text-gray-400">Please convert some values in the Converter tab to see visualizations.</p>
      </div>
    );
  }

  // Transform data for charting (Comparing Legal vs LDA vs Traditional Marla)
  const chartData = data.map((d, i) => ({
    name: `Entry ${i + 1}`,
    'Legal (225)': parseFloat(d.legalMarla?.toFixed(2) ?? '0'),
    'LDA (250)': parseFloat(d.ldaMarla?.toFixed(2) ?? '0'),
    'Trad (272)': parseFloat(d.tradMarla?.toFixed(2) ?? '0'),
  }));

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Marla Standard Comparison</h2>
        <p className="text-xs text-gray-500 text-center mb-6">Same plot measured under 3 different regional standards</p>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Legal (225)" fill="#1976D2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="LDA (250)" fill="#00897B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Trad (272)" fill="#F57F17" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
            <div className="font-black text-blue-700">225 sq ft</div>
            <div className="text-blue-600">Punjab Legal</div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-2">
            <div className="font-black text-teal-700">250 sq ft</div>
            <div className="text-teal-600">Lahore LDA</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="font-black text-yellow-700">272 sq ft</div>
            <div className="text-yellow-600">Traditional</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          The same plot gives a meaningfully different Marla count under each standard — always verify which standard is being used in any agreement.
        </p>
      </div>
    </div>
  );
}
