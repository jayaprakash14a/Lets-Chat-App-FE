
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {

  const messageRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<string[]>(["hi there"]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log("Connection established");
      newSocket.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }));
    }

    newSocket.onmessage = (event: MessageEvent) => {

      const parsedmessage = JSON.parse(event.data);
      setMessages(prev => [...prev, parsedmessage.payload.message as string]);

    }

    wsRef.current = newSocket;

    return () => {
      newSocket.close();
    }

  }, [])

  function sendMessage() {

    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    const response = JSON.stringify({
      type: "chat",
      payload: {
        message: messageRef.current?.value
      }
    })
    ws.send(response);

    messageRef.current!.value = ""; //clear input
  }

  return (
    <div className='h-screen bg-black text-white flex justify-center'>
      <div className='w-2/3 min-w-max my-[8px] flex flex-col items-center'>
        <div className='font-bold w-fit p-[2px] mb-[8px]'>Room</div>

        <div className='h-[90vh] w-full'>
          {messages.map((msg, idx) => <div key={idx} className='w-fit px-[8px] py-[4px] my-[4px] rounded-md bg-gray-500 text-amber-50'>
            {msg}
          </div>)}
        </div>

        <div className='h-[10vh] w-full flex flex-row items-center gap-[4px]'>
          <input
            ref={messageRef}
            type="text"
            className='w-80 border border-gray-500 rounded-md w-full h-full text-sm text-wrap'
            onKeyDown={(e) => {
              e.key === 'Enter' && sendMessage()
            }}
          />
          <button onClick={sendMessage} className='w-20 bg-purple-500 h-fit p-[2px] rounded-md'>
            Send
          </button>
        </div>

      </div>

    </div>
  )
}

export default App
