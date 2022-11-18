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
  return <header className="header">
    <div className="titles">
      <div className="title">Tempedia</div>
      <a href="/"><div className="title">home</div></a>
      <a href='/analytics'><div className="title">Analytics</div></a>
    </div>
    <Burguer open={open} className="burguer-header" onClick={OpenBurger} />
  </header>
}
export default Header