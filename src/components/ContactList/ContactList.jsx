import { useSelector, useDispatch } from 'react-redux';
import { deleteContact } from '../../redux/contacts/operations';
import { selectFilteredContacts } from '../../redux/contacts/selectors';
import { toast } from 'react-hot-toast';
import styles from './ContactList.module.css';

export default function ContactList() {
  const contacts = useSelector(selectFilteredContacts);
  const dispatch = useDispatch();

  const handleDelete = (id, name) => {
    toast(
      (t) => (
        <div className={styles.modal}>
          <p>Are you sure you want to delete {name}?</p>
          <div className={styles.modalButtons}>
            <button
              className={styles.confirmButton}
              onClick={() => {
                dispatch(deleteContact(id)).then(() => {
                  toast.success('Contact deleted successfully!');
                });
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Contacts List</h1>
      <ul className={styles.list}>
        <li className={`${styles.item} ${styles.header}`}>
          <span className={styles.column}>Name</span>
          <span className={styles.column}>Phone Number</span>
          <span className={styles.column}>Action</span>
        </li>
        {contacts.map(({ id, name, number }) => (
          <li key={id} className={styles.item}>
            <span className={styles.column}>{name}</span>
            <span className={styles.column}>{number}</span>
            <span className={styles.column}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
