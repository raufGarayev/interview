import React from 'react'

import './Header.sass'
import HeaderButton from './HeaderButton'

const Header = () => {
  return (
    <header>
            <nav>
                <div className="campaigns-nav-head">
                    <h1>Campaigns</h1>
                    <p>You can communicate with your customers directly from this section</p>
                </div>
                <div className="campaigns-nav-nthread">
                    <HeaderButton />
                </div>
            </nav>
        </header>
  )
}

export default Header