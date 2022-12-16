import { useCallback, useMemo, useState } from "react";
import type { Temtem } from "../../ts"
import type { RecursiveKeyOf } from "../../ts/recursiveKeyOf";
import CounterList from "./CounterList";
import OneShotList from "./OneShotList";
import type { Operation } from "./QueryInputs";
import QueryInputs from "./QueryInputs";
import TemtemAvatar from "./TemtemAvatar";
import TemtemCard from "./TemtemCard";
import './TemtemList.sass'
import { calculate } from "./TemtemList.utils";
type Props = {
  temtems: Temtem[]
}
const numberFields: RecursiveKeyOf<Temtem>[] = [
  "number",
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
  const [operation, setOperation] = useState<Operation>('stats.hp');
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState('');

  const temtemFiltered = useMemo(() => {
    var filtered = temtems
    if (search) filtered = filtered.filter(temtem => temtem.name.toLowerCase().includes(search.toLowerCase()))
    if (operation) filtered.sort((a, b) => calculate(b, operation) - calculate(a, operation))
    return filtered
  }, [operation, temtems, search])

  const temtemSelected = useMemo<Temtem | undefined>(() => temtemFiltered[selected], [selected, temtemFiltered])

  const handleChangeQuery = useCallback((operation: Operation) => {
    setOperation(operation)
    setSelected(0)
  }, [setSelected, setOperation])

  const handleClear = useCallback(() => {
    setOperation('number')
    setSearch('')
  }, [setOperation, setSearch])

  return <div className="temtem-list">
    <div className="header-filter">
      <div className="subtitle">filter</div>
      <div className="top">
        <input value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={handleClear}>Clear</button>
      </div>
      <div className="subtitle">sort</div>
      <div className="bottom">
        <QueryInputs operation={operation} onChange={handleChangeQuery} fields={{}}></QueryInputs>
      </div>
    </div>
    <div className="main">
      {temtemSelected && <TemtemCard temtem={temtemSelected}></TemtemCard>}
    </div>
    <div className="surface-2">
      {temtemSelected && <OneShotList temtemList={temtems} temtem={temtemSelected} />}
    </div>
    <div className="surface-2">
      {temtemSelected && <CounterList temtemList={temtems} temtem={temtemSelected} />}
    </div>
    <div className="container">
      {temtemFiltered.map((temtem, index) =>
        <TemtemAvatar onClick={() => setSelected(index)} temtem={temtem} key={temtem.number} selected={index === selected} />
      )}
    </div>
  </div>
}