import './Burguer.sass'
export default function Burguer(props:{open:Boolean, className?:string}){
  return <svg className={"burguer" + (props.open ? ' open' : '' + ' ' + props.className)} viewBox="0 0 60 60">
    <line className="line line1" x1="0" y1="10" x2="60" y2="10"/>
    <line className="line line2" x1="0" y1="30" x2="60" y2="30"/>
    <line className="line line2" x1="0" y1="30" x2="60" y2="30"/>
    <line className="line line3" x1="0" y1="50" x2="60" y2="50"/>
  </svg>
}
