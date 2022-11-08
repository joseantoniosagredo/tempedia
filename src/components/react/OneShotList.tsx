import { useMemo, useState } from "react"
import type { Technique, Temtem } from "../../ts"
import type { Stats, TechniquesEntity } from "../../ts/entities/temtem"
import { calculateStat, damage, getMultiply, getMultiplyArray, isLastEvolution, oneShotTemtems } from "../../utils/temtemFunctions"
import TemtemAvatar from "./TemtemAvatar"
import "./OneShotList.sass"
import TechCard from "./TechCard"
type Props = {
  temtem: Temtem,
  temtemList: Temtem[]
}

export default function OneShotList(props: Props) {
  const { temtem, temtemList } = props
  const [hold, setHold] = useState(false);
  const [fullHP, setFullHP] = useState(false);
  const [lastEvolution, setLastEvolution] = useState(true);

  const onShotTems = useMemo(() => {
    var stats: Partial<Stats> = {}
    if (fullHP) stats.hp = 500
    var result = oneShotTemtems(temtem, temtemList, {}, stats)
    if (hold) result = result.filter(t => t.countTech?.hold === 0)
    if (lastEvolution) result = result.filter(t => isLastEvolution(t))
    return result
  }, [temtem, temtemList, lastEvolution, hold, fullHP])


  return <div className="on-shot-list">
    <div className="one-shot-header">
      Temtem oneshot:
    </div>
    <div>
      <div className="filter-header">Filter</div>
      <div className="input-wrapper">
        <label>
          Hold:
          <input checked={hold} onChange={e => setHold(e.target.checked)} type='checkbox' />
        </label>
        <label>
          Full HP:
          <input checked={fullHP} onChange={e => setFullHP(e.target.checked)} type='checkbox' />
        </label>
        <label>
          Last evolution:
          <input checked={lastEvolution} onChange={e => setLastEvolution(e.target.checked)} type='checkbox' />
        </label>
      </div>
    </div>
    <div className="one-shot-temtem-wrapper">
      {onShotTems.map(t => <div className="wrapper" key={t.number}>
        <TemtemAvatar temtem={t} />
        {t.countTech && <TechCard tech={t.countTech} />}
      </div>
      )}
    </div>

  </div>
}