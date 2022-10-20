import type { Temtem } from '../../ts';
import './TemtemAvatar.sass'
export interface Props {
  temtem: Temtem
}

export default function (props: Props) {
  const { temtem } = props
  return <div className={"temtem-avatar"}>
    <img src={temtem.portraitWikiUrl} alt={temtem.name} className="avatar" />
    <div className="name">{temtem.name}</div>
  </div>
}
