import type { TemtemType } from "../../ts/entities/temtem";
import Crystal from "../../assets/images/types/64px-Crystal.webp"
import Wind from "../../assets/images/types/64px-Wind.webp"
import Digital from "../../assets/images/types/64px-Digital.webp"
import Earth from "../../assets/images/types/64px-Earth.webp"
import Electric from "../../assets/images/types/64px-Electric.webp"
import Fire from "../../assets/images/types/64px-Fire.webp"
import Melee from "../../assets/images/types/64px-Melee.webp"
import Mental from "../../assets/images/types/64px-Mental.webp"
import Nature from "../../assets/images/types/64px-Nature.webp"
import Neutral from "../../assets/images/types/64px-Neutral.webp"
import Toxic from "../../assets/images/types/64px-Toxic.webp"
import Water from "../../assets/images/types/64px-Water.webp"

const matching = {
  Crystal,
  Wind,
  Digital,
  Earth,
  Electric,
  Fire,
  Melee,
  Mental,
  Nature,
  Neutral,
  Toxic,
  Water,
}

function Type(props: { type: TemtemType, className?: string }) {
  return <img className={props.className} src={matching[props.type]}></img>
}

export default Type