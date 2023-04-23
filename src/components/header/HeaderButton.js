import React from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { Dropdown, DropdownButton } from 'react-bootstrap'
import {saveMail } from '../../redux/slices/mailsSlice'

const HeaderButton = () => {
  const urlId = useSelector(state => state.url.urlId)
  const mail = useSelector(state => state.mail)
  const dispatch = useDispatch()

  const handleType = (type) => {
    if(mail.id === null) {
      dispatch(saveMail({
        ...mail,
        type: type
      }))
    }
  }


  return (
    <>
        {!urlId && (
          <DropdownButton
            key='down-centered'
            id={`dropdown-button-drop-down-centered`}
            drop='down-centered'
            title="NEW THREAD"
            bsPrefix='drp'
          >
            <Link onClick={() => handleType('email')} className='text-decoration-none drp-btn' to='/mail/0'>Email</Link>
            <Dropdown.Divider />
            <Link onClick={() => handleType('sms')} className='text-decoration-none drp-btn' to='/mail/0'>SMS</Link>
          </DropdownButton>
        )}
    </>
  )
}

export default HeaderButton