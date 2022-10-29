import { useLayoutEffect, useRef } from 'react'
import type { Temtem } from '../../ts/index.js'
// @ts-ignore: Unreachable code error TO IMPROVE
import { drawRadialGraph } from './d3RadialGraph.js'
type Props = {
  temtem: Temtem
  className?: string
}
export default function RadialGraph(props: Props) {
  const { temtem } = props
  const ref = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    console.log(ref.current)
    drawRadialGraph(ref.current, [temtem.stats], {
      keys: ['hp', 'sta', 'atk', 'spatk', 'spd', 'def', 'spdef'],
      size: { width: 200, height: 200 }
    })
  }, [temtem])

  return <svg className={props.className} ref={ref}>

  </svg>
}