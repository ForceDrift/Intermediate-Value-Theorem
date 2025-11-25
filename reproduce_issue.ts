
import { evaluateFunction } from './src/utils/math';

const testCases = [
    { expr: 'x^2', start: -2, end: 2 },
    { expr: 'sqrt(x)', start: -1, end: 1 }, // Might return Complex
    { expr: '1/0', start: 0, end: 1 }, // Infinity
    { expr: 'sin(x)', start: 0, end: Math.PI },
];

testCases.forEach(({ expr, start, end }) => {
    console.log(`Testing: f(x) = ${expr}, [${start}, ${end}]`);
    const result = evaluateFunction(expr, start, end);
    console.log('Start Point Y:', result.startPoint.y, 'Type:', typeof result.startPoint.y);
    console.log('End Point Y:', result.endPoint.y, 'Type:', typeof result.endPoint.y);

    if (typeof result.startPoint.y !== 'number') {
        console.error('FAIL: Start point Y is not a number');
    }
    try {
        (result.startPoint.y as any).toFixed(3);
    } catch (e) {
        console.error('FAIL: toFixed threw error:', e);
    }
    console.log('---');
});
