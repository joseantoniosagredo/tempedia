import type { Temtem } from "../../ts"
import type { RecursiveKeyOf } from "../../ts/recursiveKeyOf"
import { getFieldFromString } from "../../utils/objectUtils"
import './TemtemCard.sass'
type Props = {
  temtem: Temtem
}

const stats: { field: RecursiveKeyOf<Temtem>, label: string }[] = [
  { field: "stats.hp", label: "HP" },
  { field: "stats.sta", label: "Stamina" },
  { field: "stats.atk", label: "Atack" },
  { field: "stats.spatk", label: "Sp Atack" },
  { field: "stats.spd", label: "Speed" },
  { field: "stats.def", label: "Defense" },
  { field: "stats.spdef", label: "Sp Defense" },
  { field: "stats.total", label: "Total" },
]
export default function TemtemCard(props: Props) {
  const { temtem } = props
  return <div className="temtem-card">
    <div className="image-wrapper left">
      <img src={temtem.wikiRenderStaticUrl} alt={temtem.name} />
    </div>
    <div className="right">

      <div className="name">{temtem.name}</div>
      <table className="stats">
        {stats.map(s => <tr>
          <th>{s.label}</th>
          <td>{getFieldFromString(temtem, s.field)}</td>
        </tr>)}
      </table>
    </div>
  </div>
}