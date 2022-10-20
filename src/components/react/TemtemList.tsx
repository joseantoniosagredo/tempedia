import { useMemo, useState } from "react";
import type { Temtem } from "../../ts"
import TemtemAvatar from "./TemtemAvatar";
import './temtemList.sass'
type Props = {
  temtems: Temtem[]
}
export default function TemtemList(props: Props) {
  const [filter, setFilter] = useState('');
  const { temtems } = props

  const temtemFiltered = useMemo(() => temtems.filter(t => (new RegExp(filter, 'i')).test(t.name)), [filter, temtems])

  return <div className="temtem-list">
    <input onChange={e => setFilter(e.target.value)} value={filter}></input>
    <div className="container">
      {temtemFiltered.map(temtem => <TemtemAvatar temtem={temtem} />)}
    </div>
  </div>
}