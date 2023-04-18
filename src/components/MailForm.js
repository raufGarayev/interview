import React, {useState} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object().shape({
  thread: Yup.string().required('Thread name is required'),
  sender: Yup.string().required('Sender is required'),
  to: Yup.array().of(Yup.string().email("Invalid email format")).required("At least one recipient is required"),
  startDate: Yup.date().required('Start date is required'),
  customerName: Yup.string().required('Customer name is required'),
  subject: Yup.string().required('Subject is required'),
});

const initialValues = {
  thread: '',
  sender: 'John Doe',
  to: [],
  startDate: null,
  customerName: '',
  subject: '',
  message: '',
};

const TemplateSelect = ({ field }) => (
  <select {...field}>
    <option value="">Select a template</option>
    <option value="template1">Template 1</option>
    <option value="template2">Template 2</option>
    <option value="template3">Template 3</option>
  </select>
);

const SenderInput = ({ field, form }) => (
  <input type="text" {...field} disabled={true} value={form.initialValues.sender} />
);



const CustomDatePicker = ({ field, form }) => (
  <DatePicker
    selected={field.value}
    onChange={(date) => form.setFieldValue(field.name, date)}
    minDate={new Date()}
    {...field}
  />
);



const EmailForm = () => {
  const [tags, setTags] = useState([]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newTag = e.target.value.trim();
      if (tags.indexOf(newTag) === -1) {
        setTags([...tags, newTag]);
      }
      e.target.value = "";
    } else if (e.key === "Backspace" && !e.target.value) {
      setTags(tags.slice(0, -1));
    }
  };
  return (
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(false);
    }}
  >
    {({ isSubmitting, errors, touched }) => (
      <Form className='form'>
        <div className='form-top'>
            <div>
                <label htmlFor="thread">Thread name</label>
                <Field type="text" name="thread" />
                {errors.thread && touched.thread && <div>{errors.thread}</div>}
            </div>

            <div>
                <label htmlFor="template">Template:</label>
                <Field name="template" component={TemplateSelect} />
            </div>
        </div>

        <div className="form-sender-receiver">
            <div>
                <label htmlFor="sender">From</label>
                <Field name="sender" component={SenderInput} />
                {errors.sender && touched.sender && <div>{errors.sender}</div>}
            </div>
            <div className='form-receiver'>
              <label htmlFor="to">To</label>
              <Field type="text" name="to" />
              {errors.to && touched.to && <div>{errors.to}</div>}
              <div className="form-receiver">
                <button>Choose all</button>
                <span>Customers</span>
                <div className="form-receiver-customers"></div>
                <span>Receivers</span>
                <div className="form-receiver-receivers"></div>
              </div>
            </div>
        </div>
        <div className="form-customer-date">
            <div>
                <label htmlFor="customerName">If Customer name is empty</label>
                <Field type="text" name="customerName" />
                {errors.customerName && touched.customerName && <div>{errors.customerName}</div>}
            </div>
            <div>
                <label htmlFor="startDate">Start Sending</label>
                <Field name="startDate" component={CustomDatePicker} />
                {errors.startDate && touched.startDate && <div>{errors.startDate}</div>}
            </div>
        </div>

        <div className='form-subject'>
            <label htmlFor="subject">Subject</label>
            <Field type="text" name="subject" />
            {errors.subject && touched.subject && <div>{errors.subject}</div>}
        </div>

        <div className='form-message'>
            <label htmlFor="message">Message:</label>
            <Field component="textarea" name="message" />
        </div>

        <button type="submit" id='submit' disabled={isSubmitting}>
            Submit
        </button>
    </Form>
    )}
    </Formik>
  )
}

export default EmailForm;
