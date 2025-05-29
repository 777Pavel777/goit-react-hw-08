import { NavLink } from 'react-router-dom';
import styles from './AuthNav.module.css';

export default function AuthNav() {
  return (
    <div className={styles.authNav}>
      <NavLink
        to="/register"
        className={styles.link}
        activeClassName={styles.active}
      >
        Register
      </NavLink>
      <NavLink
        to="/login"
        className={styles.link}
        activeClassName={styles.active}
      >
        Login
      </NavLink>
    </div>
  );
}
