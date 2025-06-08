import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register } from '../../redux/auth/operations';
import { toast } from 'react-hot-toast';
import styles from './RegistrationForm.module.css';

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters')
      .matches(
        /^[A-Za-z][A-Za-z\s]*$/,
        'Name must start with a letter and contain only letters and spaces'
      )
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a valid email')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  });

  return (
    <Formik
      initialValues={{ name: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        dispatch(register(values))
          .unwrap()
          .then(() => {
            toast.success(
              'Registration successful! Redirecting to contacts...'
            );
            resetForm();
            navigate('/contacts', { replace: true });
          })
          .catch((error) => {
            let errorMessage = 'Registration failed. Please try again.';
            if (error.message?.toLowerCase().includes('email')) {
              errorMessage = 'This email is already registered or invalid.';
            } else if (error.message?.toLowerCase().includes('password')) {
              errorMessage = 'Password does not meet requirements.';
            } else if (error.message?.toLowerCase().includes('name')) {
              errorMessage = 'Name is invalid.';
            } else if (error.message) {
              errorMessage = error.message;
            } else if (error.details) {
              errorMessage = JSON.stringify(error.details);
            }
            toast.error(errorMessage);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          {isSubmitting && <div className={styles.loader}>Registering...</div>}
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
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
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
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
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
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
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </Form>
      )}
    </Formik>
  );
}
