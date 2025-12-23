
import React from 'react';
import { SkillScores } from '../types';

interface RadarChartProps {
  scores: SkillScores;
  t: any;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores, t }) => {
  const size = 300;
  const center = size / 2;
  const radius = center * 0.7;
  const sides = 5;

  const getPoints = (values: number[], scale = 1) => {
    return values.map((val, i) => {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      const r = (val / 100) * radius * scale;
      return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
    });
  };

  // Fixed: use t prop instead of missing T import
  const labels = [t.radarNetwork, t.radarCrypto, t.radarProgramming, t.radarAI, t.radarAppSec];
  const values = [scores.network, scores.crypto, scores.programming, scores.ai, scores.appSec];

  const gridPoints = [1, 0.75, 0.5, 0.25].map(scale => 
    getPoints([100, 100, 100, 100, 100], scale).map(p => p.join(',')).join(' ')
  );

  const dataPoints = getPoints(values).map(p => p.join(',')).join(' ');

  return (
    <div className="relative flex items-center justify-center p-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grids */}
        {gridPoints.map((gp, i) => (
          <polygon key={i} points={gp} className="fill-none stroke-slate-200 dark:stroke-white/10 stroke-1" />
        ))}
        
        {/* Axes */}
        {getPoints([100, 100, 100, 100, 100]).map((p, i) => (
          <line key={i} x1={center} y1={center} x2={p[0]} y2={p[1]} className="stroke-slate-200 dark:stroke-white/10 stroke-1" />
        ))}

        {/* Data Shape */}
        <polygon 
          points={dataPoints} 
          className="fill-cyan-500/30 stroke-cyan-500 stroke-2" 
        />

        {/* Labels */}
        {getPoints([115, 115, 115, 115, 115]).map((p, i) => {
          const isLeft = p[0] < center;
          const isTop = p[1] < center;
          return (
            <text 
              key={i} 
              x={p[0]} 
              y={p[1]} 
              textAnchor={isLeft ? 'end' : 'start'} 
              dominantBaseline={isTop ? 'auto' : 'hanging'}
              className="text-[10px] font-black uppercase tracking-tighter fill-slate-500 dark:fill-slate-400"
            >
              {labels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;
