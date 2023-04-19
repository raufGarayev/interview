import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Campaigns.sass'

const Campaigns = () => {
  return (
    <section className='campaigns'>
        <header>
            <nav>
                <div className="campaigns-nav-head">
                    <h1>Campaigns</h1>
                    <p>You can communicate with your customers directly from this section</p>
                </div>
                <div className="campaigns-nav-nthread">
                    <Link to={'/mail'}><Button variant='success'>New Thread</Button></Link>
                </div>
            </nav>
        </header>
        <div className="campaigns-main">
            <div className="campaigns-main-top">
                <input type="text" />
            </div>
            <div className="campaigns-main-list">
                
            </div>
        </div>
    </section>
  )
}

export default Campaigns