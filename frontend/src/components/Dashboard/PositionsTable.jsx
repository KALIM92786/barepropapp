import React from 'react';

const PositionsTable = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-center py-4">No open positions</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
          <tr>
            <th className="px-4 py-3">Symbol</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Volume</th>
            <th className="px-4 py-3">Open Price</th>
            <th className="px-4 py-3">Current</th>
            <th className="px-4 py-3 text-right">Profit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((pos) => (
            <tr key={pos.id} className="border-b border-slate-700 hover:bg-slate-700/30">
              <td className="px-4 py-3 font-medium text-white">{pos.ticker}</td>
              <td className={`px-4 py-3 ${pos.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                {pos.side.toUpperCase()}
              </td>
              <td className="px-4 py-3">{pos.volume}</td>
              <td className="px-4 py-3">{pos.open_price}</td>
              <td className="px-4 py-3">{pos.current_price || '-'}</td>
              <td className={`px-4 py-3 text-right font-bold ${pos.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pos.profit?.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsTable;