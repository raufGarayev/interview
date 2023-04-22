import React, {useState, useRef, useEffect} from 'react'
import {AiOutlineClose} from 'react-icons/ai'
import {FiCheck} from 'react-icons/fi'
import {BsChatDots} from 'react-icons/bs'
import Datetime from 'react-datetime';
import './MailForm.sass'
import "react-datetime/css/react-datetime.css";
import ModalWindow from '../modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { openModal, closeModal } from '../../redux/slices/modalSlice';
import { clearMail, saveMail, saveMailToDB } from '../../redux/slices/mailsSlice';
import {Link, useNavigate, useParams} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import { clearUrlId, setUrlId } from '../../redux/slices/urlSlice';
import { Button } from 'react-bootstrap';
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const [recError, setRecError] = useState(null)
  const [toggleDrop, setToggleDrop] = useState(false)
  const schema = yup.object().shape({
    tname: yup.string().required('Thread name is required'),
    template: yup.string(),
    date: yup.date().required("Enter valid date"),
    to: yup.string().email(),
    subject: yup.string().required('Subject is required'),
    content: yup.string().required('Content is required'),
  });

  const form = useForm({
    defaultValues: {
      id: mail.id,
      tname: mail.name,
      template: mail.template,
      from: mail.from,
      cname: mail.cname,
      date: mail.date,
      subject: mail.subject,
      content: mail.content,
    },
    resolver: yupResolver(schema),
  });

  const { register, handleSubmit, formState, getValues, watch, setValue } = form;
  const { errors } = formState;

  const {id} = useParams()
  
  useEffect(() => {
    dispatch(setUrlId({
      urlId: id
    }))
  }, [id, dispatch])

  useEffect(() => {
    return () => {
      dispatch(clearUrlId())
    };
  }, [dispatch])

  const handleDrafting = _ => {
    const formValues = getValues();
    if((formValues.tname !== '' || inputValues.length > 0 || formValues.subject !== '' || formValues.content !== '') && !mail.sent) {
      dispatch(saveMail({
        ...mail,
        id: formValues.id || mail.id || uuidv4(),
        name: formValues.tname,
        template: formValues.template,
        cname: formValues.cname,
        receivers: inputValues,
        date: formValues.date,
        subject: formValues.subject,
        content: formValues.content,
      }))
      dispatch(saveMailToDB(false))
    }
    dispatch(clearMail())
  }

  const printCustomers = () => {
    return customers.map(c => {
      const hasEmail = inputValues?.some(iv => iv.email === c.email);
      return (
        <span onClick={() => {
          setInputValues([...inputValues, {name: c.name, email: c.email}])
          setRecError(null)
        }}>
          {c.name}:{c.email}
          {hasEmail && <small><FiCheck /></small>}
        </span>
      )
    })
  }
  

  const printReceivers = () => {
    return receivers.map(c => (
      <span>{c.name}:{c.email} <small><FiCheck /></small></span>
    ))
  }

  const receiversInput = () => {
    return inputValues?.map((r, index) => (
      <div className='test' key={index}>
        <p>{r.name}:{r.email}</p> 
        {!mail.sent && <AiOutlineClose className='del-icon' onClick={() => handleDelInput(index)} />}
      </div>
    ));
  }
  
  const emailCount = _ => {
    const content = watch('content')
    let con = 0
    if(Number(content?.length)) {
      con = Math.ceil(content?.length / 156)
    }
    return con
  }

  const handleDateChange = (e) => {
    setValue("date", e._d)
  } 

  function handleInputKeyDown(event) {
    setRecError(null)
    const formValues = getValues()
    if (event.key === "Enter") {
      event.preventDefault();
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(String(formValues.to).toLowerCase())) {
        const customerExists = customers.find((c) => c.email === formValues.to);
        if (!customerExists) {
          setReceivers([
            ...receivers,
            { name: "Not customer", email: formValues.to },
          ]);
          setInputValues([
            ...inputValues,
            { name: "Not customer", email: formValues.to },
          ]);
          setRecError(null)
        } else {
          
            setInputValues([ ...inputValues, { name: customerExists.name, email: customerExists.email }]);
        }
        form.reset({to: ''})
      } else {
        setRecError("Invalid email")
      }
    } else if (event.key === "Backspace" && event.target.value === "") {
      setReceivers(receivers.slice(0, receivers?.length - 1));
      setInputValues(inputValues.slice(0, inputValues?.length - 1));
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
    if(!mail.sent) {
      setToggleDrop(!toggleDrop)
    }
  }

  const addAllCustomers = () => {
    const emails = inputValues.map(iv => iv.email);
    const newCustomers = customers.filter(c => !emails.includes(c.email));
    setInputValues([...inputValues, ...newCustomers]);
    setRecError(null)
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

  const onSubmit = e => {
    if(inputValues.length > 0) {
      const formValues = getValues();
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
    } else {
      setRecError("Required")
    }
  }

  const handleSend = () => {
    dispatch(closeModal())
    dispatch(saveMailToDB(true))
    dispatch(clearMail())
    navigate('/')
  };

  const handleCancel = () => {
    dispatch(closeModal())
    dispatch(saveMailToDB(false))
  }

  return (
    <div className='mail-form'>
      <Link to={'/'}><Button onClick={handleDrafting} className='nav-btn'>Back</Button></Link>
      <div className="mail-form-main">
        <p>{mail.type === 'email' ? 'Email thread' : 'SMS thread'}</p>
        <div className="hr"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mail-form-main-top">
            <div>
              <label htmlFor="tname" className="required">Thread name </label>
              <input type="text" id='tname' disabled={mail.sent} {...register("tname")} />
              <p className="error">{errors.tname?.message}</p>
            </div>
            <div>
              <label htmlFor="template">Template</label>
              <div className="select-wrapper">
                <select {...register("template")} disabled={mail.sent}>
                  <option value="">Select feedback template</option>
                  <option value="template1">Template1</option>
                </select>
              </div>
              
            </div>
          </div>
          <div className="mail-form-main-client">
            <div>
              <label htmlFor="from">From</label>
              <input type="text" {...register("from")} disabled />
            </div>
            <div id='receiver'>
              <label htmlFor="to" className="required">To </label>
              <div onClick={showDrp} className={toggleDrop ? 'to-container blur' : 'to-container'} ref={dropdownRef}>
                {receiversInput()}
                <input 
                  id='to' 
                  type="email" 
                  {...register("to")}
                  disabled={mail.sent}
                  onKeyDown={handleInputKeyDown} />
              </div>
              {recError && <p className="error">{recError}</p>}
              <div className={toggleDrop ? "mydropdown activedrp" : "mydropdown"} ref={dropdownRef} >
                <span onClick={addAllCustomers} className='all'>Choose all</span>
                <span id="customers">Customers</span>
                <div className="customers">{printCustomers()}</div>
                <span id='receivers'>Receivers</span>
                <div className="receivers">{printReceivers()}</div>
              </div>
            </div>
          </div>
          <div className="mail-form-main-mid">
            <div className='cus-name'>
              <label htmlFor="cname">If Customer name is empty</label>
              <input type="text" {...register("cname")} disabled={mail.sent} />
            </div>
            <div className='date'>
              <label htmlFor="date" className="required">Start sending </label>
              <Datetime
                value={ isNaN(new Date(mail.date).getTime()) ? "Select date" : new Date(mail.date).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }).replace('/', '-').replace('/', '-')}
                onChange={(value) => handleDateChange(value)}
                input
                dateFormat="DD-MM-YYYY"
                timeFormat="HH:mm"
                locale='en'
                closeOnSelect
                inputProps={{name: 'date', disabled: mail.sent}}
              />
              <p className="error">{errors.date?.message}</p>
            </div>
          </div>
          <div className="mail-form-main-subject">
            <div>
              <label htmlFor="subject">Subject</label>
              <input type="text" {...register("subject")} disabled={mail.sent}/>
            </div>
          </div>
          <div className="hr"></div>
          <div className="mail-form-main-textarea">
            <label htmlFor="content">Content</label>
            <textarea cols="30" rows="10" {...register("content")} disabled={mail.sent}></textarea>
            <p className="error">{errors.content?.message}</p>
          </div>
          <div className="hrl"></div>
          <button id='submit'>Send</button>
        </form>
      </div>
      <div className="mail-form-stats">
        <div className="mail-form-stats-head">
          <p>Sending Info</p>
        </div>
        <span><BsChatDots className='send-icon' /></span>
        <span className='email-count'>{emailCount()}</span>
        <p>Total {mail.type === 'email' ? 'email' : 'sms'} count</p>
        <div className="mail-form-stats-main">
          <div className="mail-form-stats-main-customers">
            <span>Customer count</span>
            <span>{inputValues?.length || 0}</span>
          </div>
          {mail.type === 'sms' && (
            <div className="mail-form-stats-main-smsbal">
              <span>SMS balance</span>
              <span>1</span>
            </div>
          )}
          <div className="mail-form-stats-main-feedback">
            <span>Feedback balance</span>
            <span>9985</span>
          </div>
          {mail.type === 'sms' && (
            <div className="mail-form-stats-main-price">
              <span>Total price</span>
              <span>0</span>
            </div>
          )}
        </div>
      </div>
      <ModalWindow message="Are you sure you want to send this email?" confirm={handleSend} cancel={handleCancel} confirmButton="Send" cancelButton="Cancel" />
    </div>
  )
}

export default MailForm