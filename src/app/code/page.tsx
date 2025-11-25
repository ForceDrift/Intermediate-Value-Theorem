import React from 'react';

export default function CodePage() {
  const pseudoCode = `
FUNCTION Find_Root_IVT(f, a, b, tolerance):
    // f: The continuous function
    // a, b: The endpoints of the interval [a, b]
    // tolerance: The desired precision for the root

    IF NOT IS_CONTINUOUS(f, a, b):
        PRINT "Error: Function must be continuous on the interval [a, b]."
        RETURN NULL

    IF SIGN(f(a)) == SIGN(f(b)):
        PRINT "Error: f(a) and f(b) must have opposite signs for a root to be guaranteed."
        RETURN NULL

    WHILE (b - a) > tolerance:
        mid = (a + b) / 2
        IF f(mid) == 0:
            RETURN mid // Found the exact root
        ELSE IF SIGN(f(mid)) == SIGN(f(a)):
            a = mid // Root is in the right half
        ELSE:
            b = mid // Root is in the left half

    RETURN (a + b) / 2 // Return the approximate root
`;

  const cpp = '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 p-8 font-mono text-sm text-slate-900">
      <h1 className="text-2xl font-bold mb-4">Pseudo Code</h1>
      <pre className="bg-white/80 backdrop-blur-sm p-4 rounded shadow-sm overflow-x-auto inline-block mx-auto">
        <code>{pseudoCode}</code>
      </pre>
    </main>
  );
}
