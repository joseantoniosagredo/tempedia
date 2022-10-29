import type React from "react";
import type { Temtem } from "../../ts";
import type { RecursiveKeyOf } from "../../ts/recursiveKeyOf";
import { MathOperator } from "./TemtemList.utils";
import "./QueryInputs.sass"
import { operations } from "../../utils/operationUtils";
import { isNumber } from "../../utils/validationUtils";
export type Operation = [Operation, MathOperator, Operation] | string | number
type Props = {
  operation: Operation
  onChange: (opt: Operation) => void,
  fields: any
}
const numberFields: RecursiveKeyOf<Temtem>[] = [
  "stats.atk",
  "stats.def",
  "stats.hp",
  "stats.spatk",
  "stats.spd",
  "stats.spdef",
  "stats.sta",
  "stats.total",
];

export default function QueryInputs(props: Props) {
  const { operation, onChange } = props
  const handleChange = (index: 0 | 2) => (newOper: Operation) => {
    if (!Array.isArray(operation)) return onChange(newOper)
    const copy = operation.slice() as Operation
    copy[index] = newOper
    onChange(copy)
  }
  const handleChangeOperation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!Array.isArray(operation)) return onChange(e.target.value)
    const copy = operation.slice() as Operation
    copy[1] = e.target.value as MathOperator
    onChange(copy)
  }
  const changeOperationValue = (index: 0 | 2) => () => {
    if (!Array.isArray(operation)) return onChange([numberFields[0], MathOperator.sum, numberFields[0]])
    const copy = operation.slice() as Operation
    copy[index] = (() => {
      switch (true) {
        case Array.isArray(copy[index]): return 1
        case isNumber(copy[index] as number | string): return numberFields[0]
        default: return [numberFields[0], MathOperator.sum, numberFields[0]]
      }
    })()
    onChange(copy)
  }
  if (!Array.isArray(operation))
    return <div className="query-inputs">
      <select onChange={e => handleChange(0)(e.target.value)} value={operation}>
        {numberFields.map(e => <option value={e} key={e}>{e}</option>)}
      </select>
      <button onClick={changeOperationValue(0)}>Advance</button>
    </div>
  return <div className="query-inputs">
    <div className="option-wrapper">

      {Array.isArray(operation[0])
        ? <QueryInputs operation={operation[0]} onChange={handleChange(0)} fields={props.fields} />
        : isNumber(operation[0])
          ? <input value={operation[0]} type="number" onChange={e => handleChange(0)(e.target.value)} />
          : <select onChange={e => handleChange(0)(e.target.value)} value={operation[0]}>
            {numberFields.map(e => <option value={e} key={e}>{e}</option>)}
          </select>}
      <button onClick={changeOperationValue(0)}>{Array.isArray(operation[0]) ? '-' : '+'}</button>
    </div>
    <select onChange={handleChangeOperation} value={operation[1]}>
      {operations.map(opt => <option value={opt} key={opt}>{opt}</option>)}
    </select>
    <div className="option-wrapper">
      {Array.isArray(operation[2])
        ? <QueryInputs operation={operation[2]} onChange={handleChange(2)} fields={props.fields} />
        : isNumber(operation[2])
          ? <input value={operation[2]} type="number" onChange={e => handleChange(2)(e.target.value)} />
          : <select onChange={e => handleChange(2)(e.target.value)} value={operation[2]}>
            {numberFields.map(e => <option value={e} key={e}>{e}</option>)}
          </select>}
      <button onClick={changeOperationValue(2)}>{Array.isArray(operation[0]) ? '-' : '+'}</button>
    </div>
  </div>
}