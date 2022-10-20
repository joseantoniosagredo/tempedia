import { useCallback, useMemo, useState } from "react";
import type { Temtem } from "../../ts"
import { getFieldFromString } from "../../utils/objectUtils";
import TemtemAvatar from "./TemtemAvatar";
import './temtemList.sass'
import { comparator, fields, OperatorType } from "./TemtemList.utils";
type Props = {
  temtems: Temtem[]
}
export default function TemtemList(props: Props) {
  const [filter, setFilter] = useState('');
  const [field, setField] = useState('name');
  const [operator, setOperator] = useState(OperatorType.contain);
  const { temtems } = props

  const fieldSelected = useMemo(() => fields.find(f => f.field === field), [field])
  const temtemFiltered = useMemo(() => {
    var filtered = temtems
      .filter(t => getFieldFromString(t, field as any).some(value => comparator(operator, filter, value)))
    if (fieldSelected?.comparator?.some(comp => comp === operator)) filtered = filtered.sort((a, b) => {
      const values1 = getFieldFromString(a, field as any)
      const values2 = getFieldFromString(b, field as any)
      return values1.some(v1 => values2.some(v2 => comparator(operator, v1, v2))) ? -1 : 1
    })
    return filtered
  }
    , [filter, operator, field, temtems])
  const inputType = useMemo(() => {
    switch (operator) {
      case OperatorType.greater:
      case OperatorType.less:
        return 'number'
      default:
        return 'string'
    }
  }, [operator])

  /**
   * Methods
   */
  const handleChangeField = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setField(e.target.value)
    const selected = fields.find(f => f.field === e.target.value)
    if (selected && selected.comparator) setOperator(selected.comparator[0])
  }, [setField])

  return <div className="temtem-list">
    <select onChange={handleChangeField} value={field}>
      {fields.map(field => <option value={field.field}>{field.name}</option>)}
    </select>
    <select onChange={e => setOperator(e.target.value as OperatorType)} value={operator}>
      {fieldSelected?.operator?.map(operator => <option value={operator}>{operator}</option>)}
    </select>
    <input onChange={e => setFilter(e.target.value)} value={filter} type={inputType}></input>
    <div className="container">
      {temtemFiltered.map(temtem => <TemtemAvatar temtem={temtem} />)}
    </div>
  </div>
}