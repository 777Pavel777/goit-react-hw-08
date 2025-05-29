import ContactForm from '../../components/ContactForm/ContactForm';
import SearchBox from '../../components/SearchBox/SearchBox';
import ContactList from '../../components/ContactList/ContactList';
import styles from './ContactsPage.module.css';

export default function ContactsPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Contacts</h2>
      <ContactForm />
      <SearchBox />
      <ContactList />
    </div>
  );
}
