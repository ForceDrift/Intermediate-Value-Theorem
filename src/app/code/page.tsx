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

    WHILE abs(b - a) > tolerance:
        mid = (a + b) / 2
        IF f(mid) == 0:
            RETURN mid // Found the exact root
        ELSE IF SIGN(f(mid)) == SIGN(f(a)):
            a = mid // Root is in the right half
        ELSE:
            b = mid // Root is in the left half

    RETURN (a + b) / 2 // Return the approximate root
`;

  const cpp = `#include <cmath:
#include <cstdlib>
#include <functional>
#include <iomanip>
#include <ios>
#include <iostream>

double f(double x) { return x * x - 3.0; }

double findRootBisection(double a, double b, double tolerance) {
  // check if signs are different f(a) * f(b) is negative meaning signs are
  // different
  if (f(a) * f(b) >= 0) {
    std::cerr << "Signs match or one value is zero. IVT condition not met."
              << std::endl;
    return NAN;
  }
  double c;

  while (std::abs(a - b) > tolerance) {
    
    c = (a + b) / 2.0;

    if (std::abs(f(c)) < 1e-10) {
      // Check if f(c) is super (tolerance) close to zero
      return c;

    } else if (f(a) * f(c) < 0) {
      b = c; // root is in between [a,c] so update the new right endpoint to become c
    } else {
      a = c; // root is in between [c,b] update the old left endpoint to become c
    
    }
    //The Intermediate Value Theorem states that a root must exist in any interval where the endpoints have opposite signs 

  }

  return (a + b) / 2.0;
}

int main(int argc, char *argv[]) {
  std::cout << std::fixed << std::setprecision(10)
            << findRootBisection(1.0, 2.0, 0.000000001) << std::endl;

  return 0;
}

`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 p-8 font-mono text-sm text-slate-900">
      <h1 className="text-2xl font-bold mb-4">Pseudo Code</h1>
      <pre className="bg-white/80 backdrop-blur-sm p-4 rounded shadow-sm overflow-x-auto inline-block mx-auto">
        <code>{pseudoCode}</code>
      </pre>
      <h1 className="text-2xl font-bold mb-4">C++ Code</h1>
      <pre className="bg-white/80 backdrop-blur-sm p-4 rounded shadow-sm overflow-x-auto inline-block mx-auto">
        <code>{cpp}</code>
      </pre>
    </main>
  );
}
