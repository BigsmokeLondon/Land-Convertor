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

  // Transform data for charting (Comparing Legal vs Traditional Marla)
  const chartData = data.map((d, i) => ({
    name: `Entry ${i + 1}`,
    'Legal Marla': parseFloat(d.legalMarla.toFixed(2)),
    'Trad Marla': parseFloat(d.tradMarla.toFixed(2))
  }));

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Unit Comparison</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Legal Marla" fill="#1976D2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Trad Marla" fill="#F57F17" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Notice how the Traditional Marla (orange) value appears higher for the same plot size compared to the Legal Marla (blue). This is the source of many land disputes.
        </p>
      </div>
    </div>
  );
}
