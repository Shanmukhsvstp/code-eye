import './../globals.css';
import styles from './dashboard.module.css'

export default function Dashboard() {
    return (
        <>
            <div>
                <div>
                    <p className={styles.showcaseText}>
                        A unified platform to understand and explain programming in a better way for universities.
                    </p>
                </div>
                <div>
                    <md-filled-button style={{ padding: 15 }} has-icon="">
                        New Room
                        <svg slot="icon" viewBox="0 0 24 24">
                            <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </md-filled-button>
                    <md-outlined-text-field
                        placeholder="Enter a code to join"
                        inputmode="" type="text" autocomplete=""
                        style={{ color: 'white' }}>
                        <svg slot="leading-icon" viewBox="0 0 24 24" fill="none">
                            <rect
                                x="3"
                                y="6"
                                width="18"
                                height="12"
                                rx="2"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <circle cx="7" cy="10" r="1" fill="currentColor" />
                            <circle cx="11" cy="10" r="1" fill="currentColor" />
                            <circle cx="15" cy="10" r="1" fill="currentColor" />
                            <rect x="7" y="13" width="10" height="2" rx="1" fill="currentColor" />
                        </svg>
                    </md-outlined-text-field>
                </div>
            </div>
        </>
    );
}