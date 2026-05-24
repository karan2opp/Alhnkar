// src/utils/showToast.js
import toast from 'react-hot-toast';

// Base Tailwind classes for all toasts (right side, 2-3 sec)
const baseClasses = "border-l-4 bg-[var(--color-surface)] text-[var(--color-text)] shadow-lg rounded-lg font-[var(--font-serif)] py-3 px-4 min-w-[280px] max-w-md";

// Success toast classes (gold accent)
const successClasses = `${baseClasses} border-[var(--color-primary)]`;

// Error toast classes (red accent)
const errorClasses = `${baseClasses} border-[var(--color-accent)]`;

export const showToast = {
  /**
   * Show a success toast (gold theme)
   * @param {string} message - Message to display
   * @param {string} title - Optional title (default: "Success")
   * @param {number} duration - Duration in ms (default: 2500)
   */
  success: (message, title = "Success", duration = 2500) => {
    return toast.success(
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">✨</span>
        <div className="flex-1">
          <p className="font-semibold" style={{ color: 'var(--color-primary, #c5a059)' }}>
            {title}
          </p>
          <p className="text-sm opacity-80 mt-0.5">{message}</p>
        </div>
      </div>,
      {
        className: successClasses,
        duration,
        position: "top-right",
      }
    );
  },

  /**
   * Show an error toast (red theme)
   * @param {string} message - Error message to display
   * @param {string} title - Optional title (default: "Error")
   * @param {number} duration - Duration in ms (default: 3000)
   */
  error: (message, title = "Error", duration = 3000) => {
    return toast.error(
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">⚠️</span>
        <div className="flex-1">
          <p className="font-semibold" style={{ color: 'var(--color-accent, #8b0000)' }}>
            {title}
          </p>
          <p className="text-sm opacity-80 mt-0.5">{message}</p>
        </div>
      </div>,
      {
        className: errorClasses,
        duration,
        position: "top-right",
      }
    );
  },

  /**
   * Show a simple info toast (muted theme)
   * @param {string} message - Message to display
   * @param {number} duration - Duration in ms (default: 2000)
   */
  info: (message, duration = 2000) => {
    return toast(
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">ℹ️</span>
        <p className="text-sm">{message}</p>
      </div>,
      {
        className: `${baseClasses} border-[var(--color-muted)]`,
        duration,
        position: "top-right",
      }
    );
  },
};