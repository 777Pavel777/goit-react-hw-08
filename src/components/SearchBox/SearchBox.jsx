import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { setNameFilter } from '../../redux/filters/slice';
import styles from './SearchBox.module.css';

export default function SearchBox() {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    filter: Yup.string().trim().min(1, 'Search term must not be empty'),
  });

  return (
    <Formik
      initialValues={{ filter: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        dispatch(setNameFilter(values.filter.trim()));
      }}
    >
      {({ values, handleChange }) => (
        <Form className={styles.searchBox}>
          <div className={styles.inputGroup}>
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <Field
              type="text"
              name="filter"
              placeholder="Search contacts..."
              className={styles.input}
              aria-label="Search contacts by name or number"
              onChange={(e) => {
                handleChange(e);
                dispatch(setNameFilter(e.target.value.trim()));
              }}
              value={values.filter}
            />
            <ErrorMessage
              name="filter"
              component="div"
              className={styles.error}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
