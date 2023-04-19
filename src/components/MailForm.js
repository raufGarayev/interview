import React, {useState, useRef, useEffect} from 'react'
import {AiOutlineClose} from 'react-icons/ai'
import {FiCheck} from 'react-icons/fi'
import {BsChatDots} from 'react-icons/bs'
import Datetime from 'react-datetime';
import './MailForm.sass'
import "react-datetime/css/react-datetime.css";

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
  const dropdownRef = useRef(null);
  const [receivers, setReceivers] = useState([])
  const [inputValues, setInputValues] = useState([])
  const [recValue, setRecValue] = useState('')
  const [toggleDrop, setToggleDrop] = useState(false)
  const [content, setContent] = useState('')
  const [date, setDate] = useState('Select date')

  function onChange(newDate) {
    setDate(newDate);
  }

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
    let con = Math.ceil(content.length / 156)
    return con
  }
  

  function handleInputChange(event) {
    setRecValue(event.target.value);
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const emailExists = customers.some(customer => customer.email === recValue);
      if (!emailExists) {
        setReceivers([...receivers, {name: "Not customer", email: recValue}]);
        setInputValues([...inputValues, {name: "Not customer", email: recValue}])
      }
      setRecValue('');
    } else if (event.key === "Backspace" && recValue !== '') {
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

  return (
    <div className='mail-form'>
      <div className="mail-form-main">
        <p>Email thread</p>
        <div className="hr"></div>
        <form>
          <div className="mail-form-main-top">
            <div>
              <label htmlFor="tname">Thread name</label>
              <input type="text" name="tname" />
            </div>
            <div>
              <label htmlFor="template">Template</label>
              <select name="template">
                <option value="">Select feedback template</option>
                <option value="template1">Template1</option>
              </select>
            </div>
          </div>
          <div className="mail-form-main-client">
            <div>
              <label htmlFor="from">From</label>
              <input type="text" name="from" disabled value="Qmeter" />
            </div>
            <div id='receiver'>
              <label htmlFor="to">To</label>
              <div onClick={showDrp} className='to-container' ref={dropdownRef}>
                {recInput()}
                <input 
                  id='to' 
                  type="text" 
                  name="to" 
                  value={recValue}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown} />
              </div>
              <div className={toggleDrop ? "dropdown activedrp" : "dropdown"} ref={dropdownRef} >
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
              <input type="text" name="cname" />
            </div>
            <div className='date'>
              <label htmlFor="cname">Start sending</label>
              <Datetime
                value={date}
                onChange={(value) => setDate(value)}
                input
                dateFormat="DD-MM-YYYY"
                timeFormat="HH-mm"
                locale='en'
              />
            </div>
          </div>
          <div className="mail-form-main-subject">
            <div>
              <label htmlFor="subject">Subject</label>
              <input type="text" name="subject" />
            </div>
          </div>
          <div className="hr"></div>
          <div className="mail-form-main-textarea">
            <label htmlFor="message">Content</label>
            <textarea name="message" cols="30" rows="10" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
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
    </div>
  )
}

export default MailForm