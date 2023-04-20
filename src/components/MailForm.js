import React, {useState, useRef, useEffect} from 'react'
import {AiOutlineClose} from 'react-icons/ai'
import {FiCheck} from 'react-icons/fi'
import {BsChatDots} from 'react-icons/bs'
import Datetime from 'react-datetime';
import './MailForm.sass'
import "react-datetime/css/react-datetime.css";
import ModalWindow from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../redux/slices/modalSlice';
import { saveMail } from '../redux/slices/mailsSlice';
import {Link, useNavigate} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';


const customers = [
  {
    name: "Rauf Garayev",
    email: "rauf@mail.com"
  },
  {
    name: "Adam Adams",
    email: "adam@mail.com"
  }
]

const MailForm = () => {
  const navigate = useNavigate()
  const mail = useSelector(state => state.mail)
  const dispatch = useDispatch()
  const dropdownRef = useRef(null);
  const [receivers, setReceivers] = useState([])
  const [inputValues, setInputValues] = useState(mail.receivers)
  const [toggleDrop, setToggleDrop] = useState(false)
  const [formValues, setFormValues] = useState({
    id: mail.id,
    tname: mail.name,
    template: mail.template,
    from: mail.from,
    to: mail.to,
    cname: mail.cname,
    date: mail.date,
    subject: mail.subject,
    content: mail.content,
  })

  const cus = () => {
    return customers.map(c => {
      const hasEmail = inputValues.some(iv => iv.email === c.email);
      return (
        <span onClick={() => setInputValues([...inputValues, {name: c.name, email: c.email}])}>
          {c.name}:{c.email}
          {hasEmail && <small><FiCheck /></small>}
        </span>
      )
    })
  }
  

  const rec = () => {
    return receivers.map(c => (
      <span>{c.name}:{c.email} <small><FiCheck /></small></span>
    ))
  }

  const recInput = () => {
    return inputValues.map((r, index) => (
      <div className='test'>
        <p>{r.name}:{r.email}</p> 
        <AiOutlineClose className='del-icon' onClick={() => handleDelInput(index)} />
      </div>
    ));
  }
  
  const emailCount = _ => {
    let con
    if(formValues.content !== '') {
      con = Math.ceil([formValues.content].length / 156)
    }
    else {
      con = 0
    }
    return con
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleDateChange = (e) => {
    console.log(e._d)
    setFormValues((prevState) => ({
      ...prevState,
      date: e._d}))
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const emailExists = customers.some(customer => customer.email === formValues.to);
      if (!emailExists) {
        setReceivers([...receivers, {name: "Not customer", email: formValues.to}]);
        setInputValues([...inputValues, {name: "Not customer", email: formValues.to}])
      }
      setFormValues({...formValues, to: ''})
    } else if (event.key === "Backspace" && formValues.to === '') {
      setReceivers(receivers.slice(0, receivers.length - 1));
      setInputValues(inputValues.slice(0, inputValues.length - 1));
    }
  }

  const handleDelInput = (index) => {
    let updatedInputValues = [...inputValues];
    updatedInputValues.splice(index, 1);
    setInputValues(updatedInputValues);
    updatedInputValues = [...receivers]
    updatedInputValues.splice(index, 1)
    setReceivers(updatedInputValues)
  }
  

  const showDrp = () => {
    setToggleDrop(!toggleDrop)
  }

  const addAllCustomers = () => {
    const emails = inputValues.map(iv => iv.email);
    const newCustomers = customers.filter(c => !emails.includes(c.email));
    setInputValues([...inputValues, ...newCustomers]);
  }
  
  

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleDrop]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && toggleDrop) {
      setToggleDrop(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(openModal())
    dispatch(saveMail({
      ...mail,
      id: formValues.id || uuidv4(),
      name: formValues.tname,
      template: formValues.template,
      cname: formValues.cname,
      receivers: inputValues,
      date: formValues.date,
      subject: formValues.subject,
      content: formValues.content,
    }))
  }

  const handleSend = () => {
    dispatch(closeModal())
    saveToDB(true);
    navigate('/')
  };

  const handleCancel = () => {
    dispatch(closeModal())
    saveToDB(false)
  }
  
  const saveToDB = (prop) => {
    const emails = JSON.parse(localStorage.getItem('mails')) || [];
    const index = emails.findIndex((item) => item.id === mail.id);
    const updatedEmails = [...emails];
    
    if (index === -1) {
      updatedEmails.push({
        id: mail.id,
        name: mail.name,
        template: mail.template,
        from: mail.from,
        receivers: mail.receivers,
        cname: mail.cname,
        date: mail.date,
        subject: mail.subject,
        content: mail.content,
        sent: prop
      });
    } else {
      updatedEmails[index] = {
        ...updatedEmails[index],
        name: mail.name,
        template: mail.template,
        from: mail.from,
        receivers: mail.receivers,
        cname: mail.cname,
        date: mail.date,
        subject: mail.subject,
        content: mail.content,
        sent: prop
      };
    }
    
    localStorage.setItem('mails', JSON.stringify(updatedEmails));
  };

  return (
    <div className='mail-form'>
      <div className="mail-form-main">
        <p>Email thread</p>
        <div className="hr"></div>
        <form onSubmit={handleSubmit}>
          <div className="mail-form-main-top">
            <div>
              <label htmlFor="tname">Thread name</label>
              <input type="text" name="tname" value={formValues.tname} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="template">Template</label>
              <div className="select-wrapper">
                <select name="template" value={formValues.template} onChange={handleInputChange}>
                  <option value="">Select feedback template</option>
                  <option value="template1">Template1</option>
                </select>
              </div>
              
            </div>
          </div>
          <div className="mail-form-main-client">
            <div>
              <label htmlFor="from">From</label>
              <input type="text" name="from" disabled value={formValues.from} onChange={handleInputChange} />
            </div>
            <div id='receiver'>
              <label htmlFor="to">To</label>
              <div onClick={showDrp} className={toggleDrop ? 'to-container blur' : 'to-container'} ref={dropdownRef}>
                {recInput()}
                <input 
                  id='to' 
                  type="text" 
                  name="to" 
                  value={formValues.to}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown} />
              </div>
              <div className={toggleDrop ? "mydropdown activedrp" : "mydropdown"} ref={dropdownRef} >
                <span onClick={addAllCustomers} className='all'>Choose all</span>
                <span id="customers">Customers</span>
                <div className="customers">{cus()}</div>
                <span id='receivers'>Receivers</span>
                <div className="receivers">{rec()}</div>
              </div>
            </div>
          </div>
          <div className="mail-form-main-mid">
            <div className='cus-name'>
              <label htmlFor="cname">If Customer name is empty</label>
              <input type="text" name="cname" value={formValues.cname} onChange={handleInputChange} />
            </div>
            <div className='date'>
              <label htmlFor="date">Start sending</label>
              <Datetime
                value={formValues.date}
                onChange={(value) => handleDateChange(value)}
                input
                dateFormat="DD-MM-YYYY"
                timeFormat="HH:mm"
                locale='en'
                closeOnSelect
                inputProps={{name: 'date'}}
              />
            </div>
          </div>
          <div className="mail-form-main-subject">
            <div>
              <label htmlFor="subject">Subject</label>
              <input type="text" name="subject" value={formValues.subject} onChange={handleInputChange} />
            </div>
          </div>
          <div className="hr"></div>
          <div className="mail-form-main-textarea">
            <label htmlFor="content">Content</label>
            <textarea name="content" cols="30" rows="10" value={formValues.content} onChange={handleInputChange}></textarea>
          </div>
          <div className="hrl"></div>
          <button id='submit' type="submit">Send</button>
        </form>
      </div>
      <div className="mail-form-stats">
        <div className="mail-form-stats-head">
          <p>Sending Info</p>
        </div>
        <span><BsChatDots className='send-icon' /></span>
        <span className='email-count'>{emailCount()}</span>
        <p>Total email count</p>
        <div className="mail-form-stats-main">
          <div className="mail-form-stats-main-customers">
            <span>Customer count</span>
            <span>{inputValues.length}</span>
          </div>
          <div className="mail-form-stats-main-feedback">
            <span>Feedback balance</span>
            <span>9985</span>
          </div>
        </div>
      </div>
      <ModalWindow message="Are you sure you want to send this email?" confirm={handleSend} cancel={handleCancel} confirmButton="Send" cancelButton="Cancel" />
    </div>
  )
}

export default MailForm