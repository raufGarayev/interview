import React from 'react'
import {useParams, Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { clearMail } from '../../redux/slices/mailsSlice'
import {Button} from 'react-bootstrap'

const HeaderButton = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const handleNewMail = _ => {
        dispatch(clearMail())
    }
  return (
    <>
        {id ? <Link to='/'>Back</Link> : <Link to={'/mail/0'}><Button onClick={handleNewMail} variant='success'>New Thread</Button></Link>}
    </>
  )
}

export default HeaderButton