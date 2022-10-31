import { useCallback, useState } from 'react'
import Burguer from './Burguer';
import './Header.sass'
const CLASS_NAME = 'open-header'
function Header() {
  const [open, setOpen] = useState(false);
  const OpenBurger = useCallback(() => {
    const body = document.getElementById("body-wrapper")
    if (open) body?.classList.remove('open-header')
    else body?.classList.add('open-header')
    setOpen(!open)
  }, [open, setOpen])
  return <header onClick={OpenBurger} className="header">
    <div className="title">Tempedia</div>
    <Burguer open={open} className="burguer-header"/>
  </header>
}
export default Header