import { useEffect, useMemo, useRef, useState } from "react"
import useObservableSize from "../../hooks/useObservableSize"
import type { Temtem } from "../../ts"
import { getMyWeakTemtemLinks } from "../../utils/temtemFunctions"
import d3LinkSimulation from "./d3LinksSimulation"

type Props = {
  temtems: Temtem[],
}
export default function (props: Props) {
  const { temtems } = props
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  // State
  const [selected, setSelected] = useState(0);

  // computed
  const selectedTemTem = useMemo(() => temtems.find(e => e.number === selected), [temtems, selected])
  const links = useMemo(() => {
    if (!selectedTemTem) return []
    const links1 = getMyWeakTemtemLinks(selectedTemTem, temtems).map(e => ({ ...e, deep: 0 }))
    const links2 = links1.map(({ target }) => getMyWeakTemtemLinks(target, temtems)).flat().map(e => ({ ...e, deep: 1 }))
    console.log(links1, links2)
    return links1.concat(links2).map(({ source, target, deep }) => ({ source: source.number, target: target.number, deep }))
  }, [temtems, selectedTemTem])

  // Hooks
  const size = useObservableSize(wrapperRef)
  useEffect(() => {
    d3LinkSimulation(svgRef.current, temtems, links, selected, (e: any, d: Temtem) => setSelected(d.number), size)
  }, [temtems, setSelected, selected, links, size])

  return <div ref={wrapperRef} className="svg-wrapper">
    <svg ref={svgRef}></svg>
  </div>
}