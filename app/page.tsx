'use client'
import {Alert, TextField} from "@mui/material"
import {AcUnit, ArrowCircleRightRounded, StopCircle} from "@mui/icons-material"
import {useEffect, useRef, useState} from "react"
import {chat} from "@/app/api/chat";
import clsx from "clsx";
import FormDialog from "@/components/apiKeyDialog";

export default function Home() {
  const [userInput, setUserInput] = useState<string>("")
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const [apiKey, setApiKey] = useState<string|null>(`1`)

  useEffect(() => {
    setApiKey(localStorage.getItem("openRouterKey"))
  }, []);
  return (
    <div className={"w-full m-auto md:max-w-screen-lg"}>
      <FormDialog submitCallback={apiKeySubmitHandler}/>
      {!apiKey && <Alert severity={"error"}>请提供Open Router api key.</Alert>}
      <div className={"mb-24"}>
        {chatLogs.map((chatLog, index)=> (
          <div key={index} className={"flex flex-col"}>
            <p className={"self-end m-2 p-2 rounded-2xl bg-[#f4f4f4]"}>{chatLog.question}</p>
            <div className={"flex flex-row"}>
              <AcUnit className={"mr-2"}/>
              <p>{chatLog.message}</p>
            </div>

          </div>
        ))}
      </div>
      <div className={"fixed bottom-2 w-full bg-[#f4f4f4] rounded-[30px] p-2 flex flex-row items-end md:max-w-screen-lg"}>
        <TextField id="multiline-flexible"
                   value={userInput}
                   onChange={(e) => setUserInput(e.target.value)}
                   placeholder={"Message ChatGPT"}
                   className={""}
                   multiline
                   fullWidth
                   maxRows={7}
                   sx={{border: 'none',"& fieldset": { border: 'none' },}}
        />
        {!isFetching && <button onClick={chatHandler} disabled={userInput === ""}>
          <ArrowCircleRightRounded
            className={clsx("w-[50px] h-[50px] -rotate-90", {"text-gray-400": userInput === ""})}/>
        </button>}
        {/*{isFetching && <button>*/}
        {/*  <StopCircle className="w-[50px] h-[50px]" />*/}
        {/*</button>}*/}
      </div>
    </div>
  )

  function apiKeySubmitHandler(newKey: string) {
    setApiKey(newKey)
    localStorage.setItem("openRouterKey", newKey)
  }

  function chatHandler() {
    // Check apiKey
    console.log(apiKey)
    if(!apiKey){
      return
    }

    console.log("fetching")
    fetchMessages()

    setUserInput("")
    setChatLogs((pre)=>[
      ...pre, {question: userInput, message: "loading"}
    ])
    setIsFetching(true)
  }

  async function fetchMessages() {
    const messages = []
    chatLogs.forEach((chatLog)=> {
      messages.push({"role": "user", "content": chatLog.question})
      messages.push({"role": "assistant", "content": chatLog.message})
    })
    messages.push({"role": "user", "content": userInput})
    const newMessage = await chat(apiKey!,messages)
    console.log(newMessage)

    if(newMessage){
      const newLogs = [...chatLogs, {question: userInput, message: newMessage}]
      setChatLogs(newLogs)
    }else{
      const newLogs = [...chatLogs, {question: userInput, message: "请求失败, 请重新提问"}]
      setChatLogs(newLogs)
    }
    setIsFetching(false)
  }
}
