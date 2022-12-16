import type { Temtem } from '../../ts';
import './TemtemAvatar.sass'
export interface Props {
  temtem: Temtem
  onClick?: () => any
  selected?: boolean
}

export default function (props: Props) {
  const { temtem } = props
  return <div className={"temtem-avatar" + (props.selected ? ' selected' : '')} onClick={props.onClick}>
    <img src={temtem.portraitWikiUrl} alt={temtem.name} className="avatar" />
    <div className="name">#{temtem.number} {temtem.name}</div>
  </div>
}
