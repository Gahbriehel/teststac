import { JSX, ReactNode, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  display: boolean;
  close: () => void;
  title?: string | JSX.Element;
  children: ReactNode;
}

export function Modal({
  display,
  close,
  title,
  children,
}: ModalProps): JSX.Element | null {
  useEffect(() => {
    if (display) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [display]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && display) {
        close();
      }
    };

    if (display) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [display, close]);

  return (
    <AnimatePresence>
      {display && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "tween", duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl max-w-[675px] w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-lg">
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              )}
              <button
                onClick={close}
                className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 -m-1 rounded-lg"
              >
                <IoMdClose className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
