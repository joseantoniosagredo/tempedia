import { useCallback, useMemo, useState } from "react";
import type { Temtem } from "../../ts"
import type { RecursiveKeyOf } from "../../ts/recursiveKeyOf";
import type { Operation } from "./QueryInputs";
import QueryInputs from "./QueryInputs";
import TemtemAvatar from "./TemtemAvatar";
import TemtemCard from "./TemtemCard";
import './TemtemList.sass'
import { calculate, MathOperator } from "./TemtemList.utils";
type Props = {
  temtems: Temtem[]
}
const numberFields: RecursiveKeyOf<Temtem>[] = [
  "stats.hp",
  "stats.atk",
  "stats.def",
  "stats.spatk",
  "stats.spd",
  "stats.spdef",
  "stats.sta",
  "stats.total",
];
export default function TemtemList(props: Props) {

  const { temtems } = props
  const [operation, setOperation] = useState<Operation>([numberFields[0], MathOperator.mult, 1]);
  const [selected, setSelected] = useState(0);
  const temtemFiltered = useMemo(() => {
    var filtered = temtems
    filtered.sort((a, b) => calculate(b, operation) - calculate(a, operation))
    return filtered
  }, [operation, temtems])
  const handleChangeQuery = useCallback((operation: Operation) => {
    setOperation(operation)
    setSelected(0)
  }, [setSelected, setOperation])
  return <div className="temtem-list">
    <div>
      <QueryInputs operation={operation} onChange={handleChangeQuery} fields={{}}></QueryInputs>
    </div>
    <div className="main">
      <TemtemCard temtem={temtemFiltered[selected]}></TemtemCard>
    </div>
    <div className="container">
      {temtemFiltered.map((temtem, index) =>
        <TemtemAvatar onClick={() => setSelected(index)} temtem={temtem} key={temtem.number} selected={index === selected} />
      )}
    </div>
  </div>
}