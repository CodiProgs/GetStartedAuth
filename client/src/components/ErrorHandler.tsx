"use client"

import React, { useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

function ErrorHandler({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  useEffect(() => {
    const listenUnexpectedError = () => {
      setShow(true);
      setErrorMessage("The website encountered an unexpected error. Please try again later.")
    };
    const listenUnauthenticatedError = () => {
      setShow(true);
      setErrorMessage("You are not authorized.")
    };
    if (show) {
      if (timeoutId === null) {
        setTimeoutId(setTimeout(() => {
          setShow(false);
        }, 4000))
      }

      if (hover) {
        clearTimeout(timeoutId!)
      } else if (timeoutId !== null) {
        setTimeoutId(setTimeout(() => {
          setShow(false);
        }, 2000))
      }
    }

    window.addEventListener("UnexpectedError", listenUnexpectedError);
    window.addEventListener("UnauthenticatedError", listenUnauthenticatedError);
    return () => {
      window.removeEventListener("UnexpectedError", listenUnexpectedError)
      window.removeEventListener("UnauthenticatedError", listenUnauthenticatedError)
    };
  }, [setHover, hover, show, setShow]);
  return (
    <>
      {children}
      {show && (
        <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className='fixed bg-bg_soft text-center top-[30px] left-0 right-0 mx-auto max-w-[300px] w-full px-[30px] py-[20px] h-max min-h-[100px] border border-blueColor z-50 flex items-center flex-col gap-4 rounded-lg'>
          <button className='group absolute right-5 top-5 p-1' onClick={() => setShow(!show)}>
            <IoCloseOutline size={20} className="stroke-[#999999] group-hover:stroke-blueColor" />
          </button>
          <p>{errorMessage}</p>
          <button onClick={() => setShow(!show)}>ОК</button>
        </div>
      )}
    </>
  );
}

export default ErrorHandler;