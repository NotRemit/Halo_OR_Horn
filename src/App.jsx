import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { useEffect } from 'react';


function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Welcome, seeker of truth and destiny! To begin your journey, simply greet me, and I shall unveil the path that determines whether you belong to the realm of Halo or Horn.");
  const [chatHistory, setChatHistory] = useState([]);
  const [responseCount, setResponseCount] = useState(0);
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    const dismissState = localStorage.getItem("dismiss_triggered");
    const LastMessage = localStorage.getItem("last_message") || "";
    
    if (LastMessage) {
      setAnswer(LastMessage);
    }

    if (dismissState === "true") {
      setShowButton(false);
    } else {
      setShowButton(true);
    }

  }, []);

  async function generateResponse() {
    // document.getElementById("textbox").focus();
    if (!question.trim()) return;

    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: question }] }
    ];

    setAnswer("Your fate is being decided....");

    if (responseCount >= 15) {
      setAnswer("You belong to Horn and you are a Joker.");
      setShowButton(false);
      localStorage.setItem("dismissState", "ture");
      localStorage.setItem("last_message", "You belong to Horn and you are a Joker.")
      return;
    }

    const response = await axios({
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      method: "post",
      data: {
        systemInstruction: {
          role: "user",
          parts: [
            {
              "text": "The is a God like character who differentiats people in two halfs, Horn or Halo. The bot will present the user with five very tricky situational questions one by one which are difficult to answer, each designed to analyze their moral inclinations. These questions will describe realistic dilemmas, requiring the user to answer freely rather than choosing from multiple options. The bot will then analyze the responses, assigning a hidden moral score—positive values pushing towards Halo(Angel) and negative values towards Horn(Evil). After all five questions are answered, the bot will determine the user’s alignment: Halo for those who demonstrate kindness, selflessness, and honesty, and Horn for those who exhibit cunning, ambition, or selfishness. To enhance engagement, the bot will also assign a famous character matching their personality. Users categorized as Halo may be compared to Superman, Gandalf, or Obi-Wan Kenobi or more such characters, known for their justice, wisdom, and honor, while those in Horn may resemble Loki, the Joker, or Light Yagami or more such characters, symbolizing mischief, chaos, or power-driven ambition. The bot will asign different characters from across the globe. The result will be presented in the following format: YourAlignment: \"Halo/Horn\" CharacterMatch: \"Character Name\" Analysis: \"A short paragraph explaining how their responses align with the assigned category and character\". This makes the experience interactive, personalized, and thought-provoking, encouraging users to reflect on their moral compass in an engaging way. The bot will always say DISMISS after it gives the result of the alignment."
            }
          ]
        },
        contents: [
          ...updatedHistory
        ],
      },
    });
    const botReply = response['data']['candidates'][0]['content']['parts'][0]['text'];
    setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text'])
    setChatHistory([...updatedHistory, { role: "model", parts: [{ text: botReply }] }])
    setQuestion("");
    setResponseCount(responseCount + 1);

    const words = botReply.trim().split(/\s+/);  // Split by whitespace
    const lastWord = words[words.length - 1];

    
    console.log("Last Word:", lastWord);
    
    if (lastWord.toUpperCase() === "DISMISS") {
      localStorage.setItem("last_message", botReply);
      setShowButton(false);
      localStorage.setItem("dismiss_triggered", "true");
    } else {
      setShowButton(true);
      localStorage.setItem("dissmiss_triggered", "false");
    }
  }


  return (
    <>
      <h1 className='top'>CHOOSE YOUR SIDE</h1>
      <h1><span className='left'>HALO</span> OR <span className='right'>HORN</span></h1>
      <div className='Textbox'>
        <p>{answer}</p>
      </div>
      <div className="form-control">
        { showButton && <textarea className='textArea' id='textbox'
          placeholder="Type something intelligent"
          class="input input-alt"
          value={question} onChange={(e) => setQuestion(e.target.value)}}
        ></textarea>}
        <span className="input-border input-border-alt"></span>
      </div>
      {showButton && <button onClick={generateResponse}>Submit</button>}
      <a href="https://www.linkedin.com/in/remit-patra/" className='remit' target='blank'>Made by: Remit Patra</a>
    </>
  )
}

export default App
