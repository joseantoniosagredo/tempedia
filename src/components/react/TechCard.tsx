import type { Technique } from "../../ts"
import "./TechCard.sass"

type Props = {
  tech: Technique
}
export default function TechCard(props: Props) {
  const { tech } = props
  const backgroundColorClass = `background-color-${tech.type.toLowerCase()}`

  return <div className={"tech-card surface-2"}>
    <div className="tech-card-header">
      {tech.name}
    </div>
    <div className="tech-card-color-wrapper">
      {Array.from(new Array(tech.hold)).map((_, i) =>
        <span key={i} className={"hold-line " + backgroundColorClass}></span>
      )}
    </div>
  </div>
}
