import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";

export default function LoadingOverlay({ active, text, children }) {
  return (
    <div className="relative">
      {active && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Spinner />
            {text && <p className="mt-2 text-white">{text}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
