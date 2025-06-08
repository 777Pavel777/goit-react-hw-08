import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addContact } from '../../redux/contacts/operations';
import { toast } from 'react-hot-toast';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    number: Yup.string()
      .matches(
        /^\d{3}-\d{3}-\d{4}$/,
        'Phone number must be in format 123-456-7890'
      )
      .required('Phone number is required'),
  });

  return (
    <Formik
      initialValues={{ name: '', number: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        dispatch(addContact(values))
          .unwrap()
          .then(() => {
            toast.success('Contact added successfully!');
            resetForm();
          })
          .catch(() => {
            toast.error('Failed to add contact.');
          });
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.inputGroup}>
            <Field
              type="text"
              name="name"
              placeholder="Name"
              className={styles.input}
              aria-label="Contact name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.error}
            />
          </div>
          <div className={styles.inputGroup}>
            <Field
              type="tel"
              name="number"
              placeholder="123-456-7890"
              className={styles.input}
              aria-label="Contact phone number"
            />
            <ErrorMessage
              name="number"
              component="div"
              className={styles.error}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.addButton}
            aria-label="Add contact"
          >
            <svg
              className={styles.addIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Add Contact
          </button>
        </Form>
      )}
    </Formik>
  );
}
