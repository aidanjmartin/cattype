import React from 'react';

interface Props {
  data: number[];
  width?: number;
  height?: number;
}

export const WpmChart: React.FC<Props> = ({ data, width = 500, height = 150 }) => {
  if (data.length < 2) return null;

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxWpm = Math.max(...data, 10);
  const minWpm = 0;

  const xScale = (i: number) => (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => chartH - ((v - minWpm) / (maxWpm - minWpm)) * chartH;

  const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ');
  const areaD = `${pathD} L ${xScale(data.length - 1)} ${chartH} L ${xScale(0)} ${chartH} Z`;

  // Grid lines
  const gridLines = 4;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) =>
    Math.round((maxWpm / gridLines) * i)
  );

  return (
    <svg width={width} height={height} className="wpm-chart w-full" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7a8b8" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#f7a8b8" stopOpacity="0"/>
        </linearGradient>
      </defs>

      <g transform={`translate(${padding.left}, ${padding.top})`}>
        {/* Grid lines */}
        {gridValues.map((v, i) => (
          <g key={i}>
            <line
              x1={0} y1={yScale(v)}
              x2={chartW} y2={yScale(v)}
              stroke="#4a4e69" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4"
            />
            <text
              x={-8} y={yScale(v) + 4}
              fontSize="10" fill="#4a4e69" textAnchor="end"
            >
              {v}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {data.map((_, i) => (
          i % Math.max(1, Math.floor(data.length / 6)) === 0 && (
            <text
              key={i}
              x={xScale(i)} y={chartH + 18}
              fontSize="10" fill="#4a4e69" textAnchor="middle"
            >
              {i + 1}s
            </text>
          )
        ))}

        {/* Area fill */}
        <path d={areaD} fill="url(#chartGrad)"/>

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#f7a8b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((v, i) => (
          <circle
            key={i}
            cx={xScale(i)} cy={yScale(v)}
            r="3" fill="#f7a8b8"
          />
        ))}
      </g>
    </svg>
  );
};
