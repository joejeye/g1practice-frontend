import React, { useEffect, useState, /*useEffect*/ } from 'react'
import './App.css'
import fetchSolution from './FetchSolution'
import requestStatistics, { statsType } from './RequestStatistics'
import gradientColor from './GradientColor'

function OneOption({ label, onChange, selected, optColors }: { label: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, selected: string, optColors: string[] }) {
    return (
        <>
            <input
                type='radio'
                value={label}
                checked={selected === label} // Make single-choice question
                onChange={onChange}
            />
            <label><span style={{ color: optColors[option2Idx(label)]}}>{label} </span></label>
        </>
    )
}

function option2Idx(opt: string): number {
    switch (opt.toLowerCase()) {
        case "a":
            return 0
        case "b":
            return 1
        case "c":
            return 2
        case "d":
            return 3
        default:
            return -1
    }
}

function Question({ QNum, fSol, selections, setSelections }: {QNum: number, fSol: (id: number, userSel: string, fn: (ans: string) => void) => void, selections: string[], setSelections: (s: string[]) => void}) {
    //const [dispPass, setDispPass] = useState<string>('N/A')
    const [dispTotal, setDispTotal] = useState<number>(0)
    const [show, setShow] = useState<boolean>(true)
    const [txtColor, setTxtColor] = useState<string>('white')
    const [optionColors, setOptionColors] = useState<string[]>(Array(4).fill("white"))
    const [passRate, setPassRate] = useState<string>("N/A") 

    const myGreen = "#7FFF00"

    function dyeOption(opt: string, color: string): void {
        const idx = option2Idx(opt)
        const newOptionColors = [...optionColors]
        newOptionColors[idx] = color
        setOptionColors(newOptionColors)
    }

    function handleAnsResponse(ans: string) {
        setShow(true) // Always show the statistics
        dyeOption(ans, myGreen)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const selectedOption = selections[QNum - 1]
        if (selectedOption === "") {
            return
        }
        fSol(QNum, selectedOption, handleAnsResponse)
        requestStatistics(QNum, handleStatsResponse)
    }

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newSelections = [...selections]
        newSelections[QNum - 1] = e.target.value
        dyeOption(e.target.value, "orange")
        setSelections(newSelections)
    }

    function handleStatsResponse(sT: statsType) {
        if (sT.numAttempts === 0) {
            return
        }
        setDispTotal(sT.numAttempts)
        const pssRt = 100 * sT.numCorrect / sT.numAttempts
        const gradColor = gradientColor(pssRt)
        setTxtColor(gradColor)
        setPassRate(pssRt.toFixed(1))
    }

    useEffect(() => {
        requestStatistics(QNum, handleStatsResponse)
    }/*, [QNum, selections]*/) // Dependency makes the visual feedback less responsive, I don't know why

    return (
        <>
        <form onSubmit={handleSubmit}>
            <p>Question {QNum}:</p>
            {
                    ["A", "B", "C", "D"].map((label) => (
                        <OneOption key={"q" + QNum + "-opt" + label} label={label} onChange={onChange} selected={selections[QNum - 1]} optColors={optionColors} />
                ))
            }
            <br></br>
            <button type="submit">Submit</button>
        </form>
            {show && (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td><span style={{ color: txtColor }}>{"Pass [%]: " + passRate}</span></td>
                                <td>{"Attempts: " + dispTotal}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

function App() {
    const NCols = 5 // Number of columns

    const NQs = 201 // Number of questions (hardcoded for now)
    const [selections, setSelections]: [string[], (s: string[]) => void] = useState<string[]>(Array(NQs).fill(""))
    const QstnArr = Array(NQs).fill(0).map(
        (_, i) => <Question key={"Q" + (i + 1).toString()} QNum={i + 1} fSol={fetchSolution} selections={selections} setSelections={setSelections} />
    ) // Array of questions
    const NRows = Math.ceil(QstnArr.length / NCols) // Number of rows
    /* Group questions into rows and columns */
    const groups: JSX.Element[][] = []
    for (let i = 0; i < NRows; i++) {
        const group: JSX.Element[] = []
        for (let j = 0; j < NCols; j++) {
            const QIdx = i * NCols + j
            if (QIdx < NQs) {
                group.push(QstnArr[QIdx])
            } else {
                group.push(<div key={"Q" + (QIdx + 1).toString()}>N/A</div>)
            }
        }
        groups.push(group)
    }

    return (
        <>
            <h1>Practice for G1</h1>
            <table>
                <tbody>
                    {
                        groups.map((g) => (
                            <tr>
                                {g.map((h) => (
                                    <td>{h}</td>
                                ))}
                            </tr>
                        ))
                    }
                </tbody>                
            </table>
        </>
    )
}

export default App
