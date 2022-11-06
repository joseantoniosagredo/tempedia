import type { Temtem } from "../../ts"
import type { Stats } from "../../ts/entities/temtem"
import { getFieldFromString } from "../../utils/objectUtils"
import { calculateStat } from "../../utils/temtemFunctions"
import RadialGraph from "../d3/RadialGraph"
import './TemtemCard.sass'
import Type from "./TemtemType"
type Props = {
  temtem: Temtem
}

const stats: { field: keyof Stats, label: string }[] = [
  { field: "hp", label: "HP" },
  { field: "sta", label: "Stamina" },
  { field: "atk", label: "Atack" },
  { field: "spatk", label: "Sp Atack" },
  { field: "spd", label: "Speed" },
  { field: "def", label: "Defense" },
  { field: "spdef", label: "Sp Defense" },
  { field: "total", label: "Total" },
]
export default function TemtemCard(props: Props) {
  const { temtem } = props
  return <div className="temtem-card surface-2">
    <div className="image-wrapper left">
      <div className="bottom-img">
        <div className="types">
          {temtem.types?.map(type => <Type className="type" type={type}></Type>)}
        </div>
        <div className="name">{temtem.name}</div>
      </div>
      <img src={temtem.wikiRenderStaticUrl} alt={temtem.name} />
    </div>
    <div className="right">

      <div className="info">
        <table className="stats">
          <thead>
            <tr>
              <th>stat</th>
              <th>value</th>
              <th>base</th>
              <th>TV</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => <tr>
              <th>{s.label}</th>
              <td>{calculateStat(temtem, s.field)}</td>
              <td>{getFieldFromString(temtem, 'stats.' + s.field as any)}</td>
              <td>{getFieldFromString(temtem, 'trainStats.' + s.field as any)}</td>
            </tr>)}
          </tbody>
        </table>
        <RadialGraph className="radial-graph" temtem={temtem} />
      </div>
    </div>
  </div>
}