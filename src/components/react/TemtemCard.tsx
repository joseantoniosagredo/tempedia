import type { Temtem } from "../../ts"
import './TemtemCard.sass'
type Props = {
  temtem: Temtem
}
export default function TemtemCard(props: Props) {
  const { temtem } = props
  console.log(temtem)
  return <div className="temtem-card">
    <div className="image-wrapper left">
      <img src={temtem.wikiRenderStaticUrl} alt={temtem.name} />
    </div>
    <div className="right">

      <div className="name">{temtem.name}</div>
    </div>
  </div>
}