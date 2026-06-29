import type { ReactNode } from "react";
import styles from "../shared-ui.module.scss";

export function Modal({ children, title }: { children: ReactNode; title: string }) {
  return (
    <div className={styles.modalBackdrop} role="presentation">
      <section className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        {children}
      </section>
    </div>
  );
}
