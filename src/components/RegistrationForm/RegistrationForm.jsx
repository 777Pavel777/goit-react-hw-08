import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../../redux/auth/operations';
import styles from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        dispatch(register(values));
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
              aria-label="Name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className={styles.error}
            />
          </div>
          <div className={styles.inputGroup}>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className={styles.input}
              aria-label="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.error}
            />
          </div>
          <div className={styles.inputGroup}>
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              aria-label="Password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
            aria-label="Register"
          >
            <svg
              className={styles.submitIcon}
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
            Register
          </button>
        </Form>
      )}
    </Formik>
  );
}
