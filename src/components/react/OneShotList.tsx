import { useMemo } from "react"
import type { Technique, Temtem } from "../../ts"
import type { TechniquesEntity } from "../../ts/entities/temtem"
import { calculateStat, damage } from "../../utils/temtemFunctions"
import TemtemAvatar from "./TemtemAvatar"
import "./OneShotList.sass"
type Props = {
  temtem: Temtem,
  temtemList: Temtem[]
}

function getTechType(tech: Technique | TechniquesEntity): 'atk' | 'spatk' {
  return (tech as Technique).class === "Physical" ? 'atk' : 'spatk'
}
export default function OneShotList(props: Props) {
  const { temtem, temtemList } = props
  const onShotTems = useMemo(() => temtemList
    .map(tem => {
      const countTech = temtem.techniques?.find(tech => damage(temtem.stats[getTechType(tech)], tem.stats[getTechType(tech)], tech.damage ?? 0) > calculateStat(tem, 'hp'))
      return { ...tem, countTech }
    })
    .filter(e => e.countTech)
    , [temtem, temtemList])
  return <div className="on-shot-list">
    {onShotTems.map(t => <div className="wrapper">
      <TemtemAvatar temtem={t} />
      <p>{t.countTech?.name}</p>
    </div>
    )}
  </div>
}