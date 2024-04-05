type solType = {
    id: number,
    answer: string,
    question: string,
    img_path: string
}
export default function fetchSolution(
    qId: number /* Question ID (1-based) */,
    userSelection: string /* The selection made by the user */,
    fn: (ans: string) => void
): void {
    // Hardcoded URL for now
    const solURL = String.raw`http://localhost:8080/getans`

    // Fetch the solution from the server
    const reqURL = solURL + "?Id=" + qId.toString() + "&Ans=" + userSelection
    fetch(reqURL)
        .then((response: Response) => response.json())
        .then((data: solType) => fn(data.answer))
}