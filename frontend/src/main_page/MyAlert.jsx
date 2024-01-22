import React, { useEffect } from 'react';

export default function MyAlert({ open, setOpen, severity, message, t }) {
  
  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 4000); 
    }
    return () => clearTimeout(timer); 
  }, [open, setOpen]);

  return (
    <>
      {open && (
      <div class="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50">
        <div class="bg-slate-800 text-slate-50 text-sm p-3 md:rounded shadow-lg flex justify-between">
          <div class="text-slate-500 inline-flex">
          {
            severity === "error" ? (
              <span class="font-medium text-red-400">
                {message}
              </span>
            ) : 
            severity === "success" ? (
              <span class="font-medium text-emerald-400">
                {message}
              </span>
            ) : 
            severity === "warning" ? (
              <span class="font-medium text-yellow-400">
                {message}
              </span>
            ) : (
              <span class="font-medium text-slate-400">
                {message}
              </span>
            )
          }
          </div>
          <button class="text-slate-500 hover:text-slate-400 pl-2 ml-3 border-l border-gray-700" onClick={() => { setOpen(false); }}>
            <span class="sr-only">
              Close
            </span>
            <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16">
              <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z">
              </path>
            </svg>
          </button>
        </div>
      </div>
      )}
    </>
  );
}
