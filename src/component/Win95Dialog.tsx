import type { ReactNode } from "react";

// fenêtre Win95 intégrée à la page (barre de titre bleue + ✕), partagée par les
// panneaux Favorites et About
const Win95Dialog = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    <div className="win95-window mb-4">
      <div className="win95-titlebar flex items-center justify-between px-2 py-1">
        <span className="font-bold text-sm truncate">{title}</span>
        <button
          type="button"
          className="win95-titlebar-btn w-5 h-5 text-xs cursor-pointer"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="p-2 flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default Win95Dialog;
