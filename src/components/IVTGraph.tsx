"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceDot,
    Label,
} from 'recharts';
import { Point } from '@/utils/math';

interface IVTGraphProps {
    data: Point[];
    startPoint: Point;
    endPoint: Point;
    targetY: number;
    intersections: Point[];
}

const IVTGraph: React.FC<IVTGraphProps> = ({
    data,
    startPoint,
    endPoint,
    targetY,
    intersections,
}) => {
    // Calculate domain to add some padding
    const allY = [...data.map((p) => p.y), targetY];
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const padding = (maxY - minY) * 0.1 || 1;

    return (
        <div className="w-full h-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="x"
                        type="number"
                        domain={['auto', 'auto']}
                        tick={{ fill: '#64748b' }}
                        allowDataOverflow={false}
                        stroke="#94a3b8"
                    >
                        <Label value="x" offset={-10} position="insideBottomRight" fill="#64748b" />
                    </XAxis>
                    <YAxis
                        domain={[minY - padding, maxY + padding]}
                        tick={{ fill: '#64748b' }}
                        stroke="#94a3b8"
                    >
                        <Label value="f(x)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} fill="#64748b" />
                    </YAxis>
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [value.toFixed(3), 'f(x)']}
                        labelFormatter={(label: number) => `x: ${label.toFixed(3)}`}
                    />

                    {/* The Function Curve */}
                    <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={false}
                        animationDuration={500}
                    />

                    {/* Target Value Line (k) */}
                    <ReferenceLine y={targetY} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2}>
                        <Label value={`k = ${targetY}`} position="insideTopRight" fill="#ef4444" />
                    </ReferenceLine>

                    {/* Start Point (a, f(a)) */}
                    <ReferenceDot
                        x={startPoint.x}
                        y={startPoint.y}
                        r={6}
                        fill="#10b981"
                        stroke="#fff"
                        strokeWidth={2}
                    />

                    {/* End Point (b, f(b)) */}
                    <ReferenceDot
                        x={endPoint.x}
                        y={endPoint.y}
                        r={6}
                        fill="#10b981"
                        stroke="#fff"
                        strokeWidth={2}
                    />

                    {/* Intersection Points (c, k) */}
                    {intersections.map((point, index) => (
                        <ReferenceDot
                            key={index}
                            x={point.x}
                            y={point.y}
                            r={6}
                            fill="#f59e0b"
                            stroke="#fff"
                            strokeWidth={2}
                        >
                            <Label value={`c ≈ ${point.x.toFixed(2)}`} position="top" offset={10} fill="#f59e0b" fontSize={12} />
                        </ReferenceDot>
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IVTGraph;
