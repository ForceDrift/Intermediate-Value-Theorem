"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { evaluateFunction, EvaluationResult } from '@/utils/math';
import IVTGraph from '@/components/IVTGraph';
import { motion } from 'framer-motion';
import { Calculator, Info, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Custom hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };

  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const [functionStr, setFunctionStr] = useState('20*sin(x+3)*cos(x^2/2)');
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [targetY, setTargetY] = useState(0);

  // Debounce the inputs to prevent freezing - increased to 1 second
  const debouncedFunctionStr = useDebounce(functionStr, 1000);
  const debouncedRangeStart = useDebounce(rangeStart, 1000);
  const debouncedRangeEnd = useDebounce(rangeEnd, 1000);
  const debouncedTargetY = useDebounce(targetY, 300);

  // Memoize the result calculation with validation
  const result = useMemo(() => {
    // Only evaluate if we have valid numbers
    if (debouncedRangeStart === null || debouncedRangeEnd === null || isNaN(debouncedRangeStart) || isNaN(debouncedRangeEnd)) {
      return {
        points: [],
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 0, y: 0 },
        intersectionPoints: [],
        error: 'Please enter start and end values',
      };
    }
    return evaluateFunction(debouncedFunctionStr, debouncedRangeStart, debouncedRangeEnd, debouncedTargetY);
  }, [debouncedFunctionStr, debouncedRangeStart, debouncedRangeEnd, debouncedTargetY]);

  const isValid = result && !result.error;
  const fA = result?.startPoint.y ?? 0;
  const fB = result?.endPoint.y ?? 0;
  const isBetween = (targetY >= Math.min(fA, fB) && targetY <= Math.max(fA, fB));

  // Calculate min/max for slider dynamically
  const sliderMin = Math.floor(Math.min(fA, fB)) - 5;
  const sliderMax = Math.ceil(Math.max(fA, fB)) + 5;

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 p-4 md:p-8 font-sans text-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 py-8"
        >
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Controls Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 space-y-6"
          >
            <Card className="border-slate-200/60 shadow-xl backdrop-blur-sm bg-white/90 hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardDescription>
                  Define the function and interval to visualize.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="function">Function f(x)</Label>
                  <Input
                    id="function"
                    value={functionStr}
                    onChange={(e) => setFunctionStr(e.target.value)}
                    className="font-mono text-sm"
                    placeholder="e.g., x^2 - 4"
                  />
                  {result?.error && (
                    <p className="text-red-500 text-xs font-medium">{result.error}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Start (a)</Label>
                    <Input
                      id="start"
                      type="number"
                      step="any"
                      placeholder="e.g., -2"
                      value={rangeStart ?? ''}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        if (!isNaN(num)) {
                          setRangeStart(num);
                        } else if (e.target.value === '') {
                          setRangeStart(null);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end">End (b)</Label>
                    <Input
                      id="end"
                      type="number"
                      step="any"
                      placeholder="e.g., 2"
                      value={rangeEnd ?? ''}
                      onChange={(e) => {
                        const num = e.target.valueAsNumber;
                        if (!isNaN(num)) {
                          setRangeEnd(num);
                        } else if (e.target.value === '') {
                          setRangeEnd(null);
                        }
                      }}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Target Value (k)</Label>
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-sm">
                      {targetY}
                    </span>
                  </div>
                  <Slider
                    min={sliderMin}
                    max={sliderMax}
                    step={0.1}
                    value={[targetY]}
                    onValueChange={(vals) => setTargetY(vals[0])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Min: {sliderMin}</span>
                    <span>Max: {sliderMax}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theorem Status */}
            <Card className={`border shadow-xl backdrop-blur-sm transition-all duration-300 ${isBetween ? 'bg-emerald-50/80 border-emerald-300/60 hover:shadow-emerald-200/50' : 'bg-amber-50/80 border-amber-300/60 hover:shadow-amber-200/50'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Info className={`w-4 h-4 ${isBetween ? 'text-emerald-600' : 'text-amber-600'}`} />
                  Theorem Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div className="bg-white/50 p-2 rounded border border-slate-100">
                    <span className="text-slate-500 block text-xs">f(a)</span>
                    <span className="font-medium">{fA.toFixed(3)}</span>
                  </div>
                  <div className="bg-white/50 p-2 rounded border border-slate-100">
                    <span className="text-slate-500 block text-xs">f(b)</span>
                    <span className="font-medium">{fB.toFixed(3)}</span>
                  </div>
                </div>

                <Alert variant={isBetween ? "default" : "destructive"} className={`border-0 ${isBetween ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  { }
                  <AlertTitle className="ml-2 font-bold">{isBetween ? "Applicable" : "Not Applicable"}</AlertTitle>
                  <AlertDescription className="ml-2 text-xs opacity-90">
                    {isBetween
                      ? "k is strictly between f(a) and f(b). IVT guarantees at least one solution."
                      : "k is not between f(a) and f(b). IVT conditions are not met."}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>

          {/* Visualization Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Graph Card */}
            <Card className="border-slate-200/60 shadow-xl backdrop-blur-sm bg-white/90 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6">
                {isValid && result ? (
                  <div className="w-full h-[500px]">
                    <IVTGraph
                      data={result.points}
                      startPoint={result.startPoint}
                      endPoint={result.endPoint}
                      targetY={targetY}
                      intersections={result.intersectionPoints}
                    />
                  </div>
                ) : (
                  <div className="h-[500px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <div className="text-center">
                      <p className="text-lg font-medium">Invalid Configuration</p>
                      <p className="text-sm">Please check your function syntax and range.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Solutions Info Card - appears right under the graph */}
            {isValid && result && result.intersectionPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-indigo-200/60 shadow-xl backdrop-blur-sm bg-gradient-to-br from-white/90 to-indigo-50/30 hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                      Solutions Found
                    </CardTitle>
                    <CardDescription>
                      Binary search identified {result.intersectionPoints.length} precise {result.intersectionPoints.length === 1 ? 'solution' : 'solutions'} where f(c) = {targetY}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {result.intersectionPoints.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <span className="font-semibold text-slate-700">Solution {index + 1}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">x-coordinate:</span>
                              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                {point.x.toFixed(6)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">f(c):</span>
                              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                {point.y.toFixed(6)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Summary Statistics */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 rounded-lg border border-indigo-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-indigo-600">{result.intersectionPoints.length}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">Solutions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-violet-600">{targetY.toFixed(3)}</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">Target Value</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">[{rangeStart}, {rangeEnd}]</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">Interval</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-pink-600">±1e-6</div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide">Precision</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Explanation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border-blue-200/60 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-blue-600 font-bold text-sm mb-1 uppercase tracking-wider">1. Continuity</div>
                  <p className="text-sm text-slate-600">
                    The function <span className="font-mono bg-blue-100 px-1 rounded">f(x)</span> is continuous on the closed interval <span className="font-mono bg-blue-100 px-1 rounded">[{rangeStart}, {rangeEnd}]</span>.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50/80 to-violet-50/60 border-purple-200/60 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-purple-600 font-bold text-sm mb-1 uppercase tracking-wider">2. Intermediate</div>
                  <p className="text-sm text-slate-600">
                    The value <span className="font-mono bg-purple-100 px-1 rounded">k = {targetY}</span> lies between <span className="font-mono bg-purple-100 px-1 rounded">f({rangeStart})</span> and <span className="font-mono bg-purple-100 px-1 rounded">f({rangeEnd})</span>.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/60 border-emerald-200/60 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="text-emerald-600 font-bold text-sm mb-1 uppercase tracking-wider">3. Existence</div>
                  <p className="text-sm text-slate-600">
                    There exists at least one <span className="font-mono bg-emerald-100 px-1 rounded">c</span> such that <span className="font-mono bg-emerald-100 px-1 rounded">f(c) = {targetY}</span>.
                    {result?.intersectionPoints.length ? <span className="block mt-1 font-medium text-emerald-700">Found {result.intersectionPoints.length} solution(s).</span> : ''}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>


        </div>
      </div>
    </main>
  );
}
