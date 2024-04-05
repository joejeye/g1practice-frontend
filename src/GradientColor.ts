export default function gradientColor(passRate: number /* Pass rate in percentage */): string {
    // Calculate the color based on the pass rate
    const hue = (passRate * 1.2).toFixed(0)
    const color = `hsl(${hue}, 100%, 50%)`
    return color
}