import { useDispatch } from 'react-redux';
import { deleteContact } from '../../redux/contactsSlice';
import styles from './Contact.module.css';

function Contact({ contact }) {
  const dispatch = useDispatch();

  return (
    <li className={styles.item}>
      <div>
        <p>{contact.name}</p>
        <p>{contact.number}</p>
      </div>
      <button
        onClick={() => dispatch(deleteContact(contact.id))}
        className={styles.button}
      >
        Delete
      </button>
    </li>
  );
}

export default Contact;
