export type statsType = {
    numAttempts: number,
    numCorrect: number
}

export default function requestStatistics(qId: number /* Question ID (1-based) */, fn: (sT: statsType) => void) {
    // Hardcoded URL for now
    const reqURL = String.raw`http://localhost:8080/reqstat`

    fetch(reqURL + "?Id=" + qId.toString())
        .then((response: Response) => response.json())
        .then((data: statsType) => fn(data))
}