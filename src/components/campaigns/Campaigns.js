import React, {useState, useEffect} from 'react'
import ModalWindow from '../modal/Modal'
import { Link} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {saveMail } from '../../redux/slices/mailsSlice'
import { closeModal, openModal } from '../../redux/slices/modalSlice'
import { Button, Table } from 'react-bootstrap'
import {AiOutlineSearch} from 'react-icons/ai'
import debounce from 'lodash/debounce';
import './Campaigns.sass'

const Campaigns = () => {
    const [emails, setEmails] = useState([])
    const [displayedEmails, setDisplayedEmails] = useState([])
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedEmail, setSelectedEmail] = useState(null)
    useEffect(() => {
        setEmails(JSON.parse(localStorage.getItem('mails')) || [])
    }, [])

    useEffect(() => {
        setDisplayedEmails(emails.filter(email => {
            const searchRegex = new RegExp(searchQuery, 'i');
            return searchRegex.test(email.name);
        }))
    }, [emails, searchQuery])

    const handleViewEdit = email => {
        dispatch(saveMail({
            id: email.id,
            name: email.name,
            template: email.template,
            from: email.from,
            date: email.date,
            cname: email.cname,
            content: email.content,
            subject: email.subject,
            receivers: email.receivers,
            type: email.type,
            sent: email.sent
        }))
    }

    const debouncedSearch = debounce(setSearchQuery, 500);
    const handleSearch = e => {
        const newValue = e.target.value;
        debouncedSearch(newValue);
    }

    const handleDelete = email => {
        dispatch(openModal())
        setSelectedEmail(email)
    }

    const handleDeleteConfirm = _ => {
        const updEmails = emails.filter(email => email.id !== selectedEmail.id)
        localStorage.setItem('mails', JSON.stringify(updEmails))
        setEmails(updEmails)
        dispatch(closeModal())
    }

    const handleCancel = _ => {
        dispatch(closeModal())
    }

  return (
    <section className='campaigns'>
        <div className="campaigns-main">
            <div className="campaigns-main-top">
                <div className="campaigns-main-top-inner">
                    <input type="text" placeholder='Search' onChange={(e) => handleSearch(e)} />
                    <AiOutlineSearch className='search-icon'/>
                </div>
            </div>
            <div className="campaigns-main-list">
            <Table className="bg-white">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedEmails.slice().reverse().map((email, i) => {
                        return (
                            <tr>
                                <td>{i+1}</td>
                                <td>{email.name ? email.name : 'No name'}</td>
                                <td>{email.type === 'email' ? 'Email' : 'SMS'}</td>
                                <td>{isNaN(new Date(email.date).getTime()) ? "Not selected" : new Date(email.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                                <td>
                                    <Link to={`/mail/${email.id}`}>
                                        <Button 
                                            onClick={() => handleViewEdit(email)} 
                                            variant={"warning"} 
                                            className='text-white'>
                                            {email.sent ? 'VIEW' : 'EDIT'}
                                        </Button>
                                    </Link>
                                    <Button onClick={() => handleDelete(email)} variant="danger">DELETE</Button>
                                </td>
                            </tr>
                        )
                    })}
                    
                </tbody>
            </Table>

            </div>
        </div>
        <ModalWindow message = {"Are you sure you want to delete this email?"} confirm={handleDeleteConfirm} cancel={handleCancel} confirmButton="Delete" cancelButton="Cancel" />
    </section>
  )
}

export default Campaigns