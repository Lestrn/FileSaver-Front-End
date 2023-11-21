import styles from './page.module.css'

export default function Home() {
  return (
    <main className="container">
      <div className={styles.wrapper}>
        <div className={styles.intro}>
          <h1>Welcome to Your File Storage Platform</h1>
          <p className={styles.description}>
            Explore a secure and user-friendly file storage and exchange platform.
            Register for an account, confirm your email, and start enjoying the features.
          </p>
        </div>

        <div className={styles.features}>
          <h2>Key Features</h2>
          <ul>
            <li>Account registration with email confirmation</li>
            <li>Add other users to your friends list</li>
            <li>Simple messenger for communication with friends</li>
            <li>File storage and exchange with friends</li>
          </ul>
        </div>

        <div className={styles.implementation}>
          <h2>Implementation</h2>
          <p>
            The back-end is powered by ASP.NET Web API, providing a robust and secure foundation.
            The front-end is built using React, offering a dynamic and responsive user interface.
          </p>
        </div>
      </div>
    </main>
  );
}
