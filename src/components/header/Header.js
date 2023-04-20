import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import './Header.sass'
import HeaderButton from './HeaderButton'

const Header = () => {
    const [paramId, setParamId] = useState()

    useEffect(() => {
        const {id} = useParams
        setParamId({id})
        console.log(id)
    }, [])

  return (
    <header>
            <nav>
                <div className="campaigns-nav-head">
                    <h1>Campaigns</h1>
                    <p>You can communicate with your customers directly from this section</p>
                </div>
                <div className="campaigns-nav-nthread">
                    <HeaderButton props />
                </div>
            </nav>
        </header>
  )
}

export default Header