import * as math from 'mathjs';

export interface Point {
    x: number;
    y: number;
}

export interface EvaluationResult {
    points: Point[];
    startPoint: Point;
    endPoint: Point;
    intersectionPoints: Point[];
    error?: string;
}

/**
 * Binary search (bisection method) to find the root of f(x) - targetY = 0
 * within the interval [left, right]
 */
function binarySearchRoot(
    compiled: math.EvalFunction,
    left: number,
    right: number,
    targetY: number,
    tolerance: number = 1e-6,
    maxIterations: number = 50
): number | null {
    let a = left;
    let b = right;

    try {
        let fa = compiled.evaluate({ x: a }) - targetY;
        let fb = compiled.evaluate({ x: b }) - targetY;

        // Check if we have a sign change
        if (fa * fb > 0) {
            return null; // No root in this interval
        }

        for (let i = 0; i < maxIterations; i++) {
            const mid = (a + b) / 2;
            const fmid = compiled.evaluate({ x: mid }) - targetY;

            // Check if we found the root within tolerance
            if (Math.abs(fmid) < tolerance || Math.abs(b - a) < tolerance) {
                return mid;

            }

            // Decide which half to continue with
            if (fa * fmid < 0) {
                b = mid;
                fb = fmid;
            } else {
                a = mid;
                fa = fmid;
            }
        }

        // Return the midpoint after max iterations
        return (a + b) / 2;
    } catch (e) {
        return null;
    }
}

export const evaluateFunction = (
    expression: string,
    start: number,
    end: number,
    targetY?: number
): EvaluationResult => {
    try {
        const compiled = math.compile(expression);
        const points: Point[] = [];
        const step = (end - start) / 50; // 50 points for good balance of smoothness and performance

        let intersectionPoints: Point[] = [];

        // Generate points
        for (let x = start; x <= end; x += step) {
            // Avoid floating point errors in x
            const cleanX = Math.round(x * 1000) / 1000;
            try {
                const y = compiled.evaluate({ x: cleanX });
                if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
                    points.push({ x: cleanX, y });
                }
            } catch (e) {
                // Ignore points where evaluation fails (e.g., division by zero)
            }
        }

        // Ensure start and end are included exactly
        const startY = compiled.evaluate({ x: start });
        const endY = compiled.evaluate({ x: end });

        // Find intersections if targetY is provided using binary search (bisection method)
        if (targetY !== undefined) {
            // Scan for sign changes in f(x) - targetY
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];

                const diff1 = p1.y - targetY;
                const diff2 = p2.y - targetY;

                // Check for sign change (or exact hit)
                if (diff1 * diff2 <= 0) {
                    // Use binary search to find the precise intersection point
                    const intersectX = binarySearchRoot(compiled, p1.x, p2.x, targetY);
                    if (intersectX !== null) {
                        intersectionPoints.push({ x: intersectX, y: targetY });
                    }
                }
            }
        }

        return {
            points,
            startPoint: { x: start, y: startY },
            endPoint: { x: end, y: endY },
            intersectionPoints,
        };
    } catch (error) {
        return {
            points: [],
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 0 },
            intersectionPoints: [],
            error: error instanceof Error ? error.message : 'Invalid function',
        };
    }
};
