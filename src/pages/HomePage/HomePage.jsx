import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to Contacts Book</h1>
      <p className={styles.description}>
        Manage your contacts easily and securely with our application.
      </p>
    </div>
  );
}
