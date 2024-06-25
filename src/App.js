import "./App.css";
import { Avatar, Teacher } from "teacher-ai";
import { useEffect, useRef, useState } from "react";

function subscribe(teacherRef, setMessages) {
  //subscribe to text responses from the agent
  teacherRef.current.socketManager.subscribeToEvents((message) => {
    console.log("message: ", message);
    setMessages((prev) => [...prev, message]);
  });

  const microphones = teacherRef.current.microphoneManager.getMicrophones();
  console.log("List of available microphones", microphones);

  //subscribe to mic responses, it may be used to determine if user's mic is working correctly
  teacherRef.current.microphoneManager.subscribeToEvents((event) => {
    console.log("Mic event", event.volume);
  });

  teacherRef.current.audioManager.subscribeToEvents((event) => {
    // console.log("events", event);
  });
}

function Home() {
  // let iid = undefined;
  const [messages, setMessages] = useState([]); // [message, setMessage
  const teacherRef = useRef(null);
  //session token should be created with eigenchat API
  const token = "";
  //agent ID should be created with eigenchat API
  const AGENT_ID = "";

  //agent ID to test reconnection
  const AGENT_ID_2 = "";

  useEffect(() => {
    if (!teacherRef.current) {
      (async () => {
        //creating teacher agent
        teacherRef.current = new Teacher(token, AGENT_ID);

        //subscribe to agent's messages
        subscribe(teacherRef, setMessages);
      })();
    }
  }, []);

  const ref = useRef("idle");
  return (
    <main>
      <h1
        className={"start"}
        onClick={() => {
          teacherRef.current?.start();
        }}
      >
        Start
      </h1>
      {/*Buttons to directly control animations*/}
      <button
        onClick={() => {
          ref.current = "hello";
        }}
      >
        Hello
      </button>
      <button
        onClick={() => {
          ref.current = "thumbsUP";
        }}
      >
        Thumbs up
      </button>
      <button
        onClick={() => {
          ref.current = "surprised";
        }}
      >
        Surprised
      </button>
      <button
        onClick={() => {
          ref.current = "laugh";
        }}
      >
        Laugh
      </button>
      {/*change agentId without stopping sessions*/}
      <button
        onClick={async () => {
          //close socket connection
          teacherRef.current?.socketManager.close();
          //mute audio
          teacherRef.current?.audioManager.setVolume(0);

          // create new teacher object using another agent ID
          teacherRef.current = new Teacher(token, AGENT_ID_2);

          //subscribe to messages again
          subscribe(teacherRef, setMessages);
          await teacherRef.current?.start();
        }}
      >
        Reconnect
      </button>
      {/* <Avatar fps params={{ x: 0, y: -2, z: -0 }} teacher={teacherRef.current} /> */}
      <div className={"avatar"}>
        <Avatar controlRef={ref} teacher={teacherRef.current} />
      </div>
    </main>
  );
}

function App() {
  return <Home />;
}

export default App;
