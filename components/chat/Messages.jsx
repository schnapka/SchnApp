import { useLayoutEffect, useRef, useState } from "react";
import Message from "./Message";
import { useEffect } from "react";

const Messages = ({ roomMessages }) => {
  const endOfMessagesRef = useRef(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [nowDateTime, setNowDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNowDateTime(new Date()); // Aktualizace s novým datumem a časem
    }, 30000); // Interval nastaven na 30 sekund

    return () => clearInterval(intervalId); // Vyčištění intervalu při odmontování komponenty
  }, []);

  useLayoutEffect(() => {
    if (roomMessages.length) {
      const scrollBehavior = firstLoad ? "auto" : "smooth";
      endOfMessagesRef.current?.scrollIntoView({ behavior: scrollBehavior });
      if (firstLoad) setFirstLoad(false);
    }
  }, [roomMessages]);

  return (
    <div className="chat relative flex-1 flex flex-col pl-10 pr-2 scrollbar-dark">
      <div className="flex flex-col py-10">
        {roomMessages?.map((message) => (
          <Message key={message.id} message={message} nowDateTime={nowDateTime} />
        ))}
        <div className="endOfMessages" ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default Messages;
