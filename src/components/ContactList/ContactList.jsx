import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchContacts,
  deleteContact,
  updateContact,
} from '../../redux/contacts/operations';
import {
  selectFilteredContacts,
  selectIsLoading,
  selectError,
} from '../../redux/contacts/selectors';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './ContactList.module.css';

export default function ContactList() {
  const contacts = useSelector(selectFilteredContacts);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchContacts())
      .unwrap()
      .catch((err) => {
        toast.error(`Failed to load contacts: ${err.message}`);
      });
  }, [dispatch]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be at most 50 characters')
      .required('Name is required'),
    number: Yup.string()
      .matches(
        /^\d{3}-\d{3}-\d{4}$/,
        'Phone number must be in format 123-456-7890'
      )
      .required('Phone number is required'),
  });

  const handleDelete = (id, name) => {
    toast(
      (t) => (
        <div className={styles.modal}>
          <p>Are you sure you want to delete {name}?</p>
          <div className={styles.modalButtons}>
            <button
              className={styles.confirmButton}
              onClick={() => {
                dispatch(deleteContact(id))
                  .unwrap()
                  .then(() => {
                    toast.success('Contact deleted successfully!');
                    dispatch(fetchContacts());
                  })
                  .catch((err) => {
                    console.error('Delete error:', {
                      message: err.message,
                      status: err.status,
                      details: err.details,
                    });
                    toast.error(
                      `Failed to delete contact: ${
                        err.message || 'Unknown error'
                      }`
                    );
                  })
                  .finally(() => {
                    toast.dismiss(t.id);
                  });
              }}
            >
              Yes
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => {
                toast.dismiss(t.id);
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacts List</h1>
      {isLoading && <div className={styles.loader}>Loading contacts...</div>}
      {error && (
        <div className={styles.errorMessage}>Error: {error.message}</div>
      )}
      {!isLoading && !error && contacts.length === 0 && (
        <p className={styles.noContacts}>
          No contacts found. Add a new contact!
        </p>
      )}
      {!isLoading && !error && contacts.length > 0 && (
        <ul className={styles.list}>
          <li className={`${styles.item} ${styles.header}`}>
            <span className={styles.column}>Name</span>
            <span className={styles.column}>Phone Number</span>
            <span className={styles.column}>Actions</span>
          </li>
          {contacts.map(({ id, name, number }) => (
            <li key={id} className={styles.item}>
              {editingId === id ? (
                <Formik
                  initialValues={{ name, number }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    dispatch(updateContact({ id, ...values }))
                      .unwrap()
                      .then(() => {
                        toast.success('Contact updated successfully!');
                        setEditingId(null);
                        dispatch(fetchContacts());
                      })
                      .catch((err) => {
                        console.error('Update error:', err);
                        toast.error(`Failed to update contact: ${err.message}`);
                      })
                      .finally(() => {
                        setSubmitting(false);
                      });
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className={styles.editForm}>
                      <div className={styles.inputGroup}>
                        <Field
                          type="text"
                          name="name"
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
                          type="tel"
                          name="number"
                          className={styles.input}
                          aria-label="Phone number"
                        />
                        <ErrorMessage
                          name="number"
                          component="div"
                          className={styles.error}
                        />
                      </div>
                      <div className={styles.actionButtons}>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={styles.saveButton}
                          aria-label="Save changes"
                        >
                          <svg
                            className={styles.saveIcon}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className={styles.cancelEditButton}
                          onClick={handleCancelEdit}
                          aria-label="Cancel editing"
                        >
                          <svg
                            className={styles.cancelIcon}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <>
                  <span className={styles.column}>{name}</span>
                  <span className={styles.column}>{number}</span>
                  <span className={styles.column}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(id)}
                      title="Edit contact"
                    >
                      <svg
                        className={styles.editIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(id, name)}
                      title="Delete contact"
                    >
                      <svg
                        className={styles.deleteIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
