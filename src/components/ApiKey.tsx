import { useState } from "react"

interface ApiKeyProps {
  setHasApiKey: (value: boolean) => void;
}

const ApiKey = ({ setHasApiKey }: ApiKeyProps) => {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = async () => {
    if(!apiKey) return;
    await window.electronAPI?.saveAPIKey(apiKey);
    setHasApiKey(true);
  }

  return (
    <div className="fixed inset-0 flex w-full h-full justify-center items-center">
      <div className="flex flex-col items-center gap-2 bg-[#292929] p-4 rounded-xl">
        <h1 className="text-xl">Chatgpt ApiKey</h1>
        <input 
          type="text" 
          className="outline-none ring-0 bg-[#333333] p-2 rounded-xl"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button 
          className="bg-blue-400 py-1 px-4 rounded-xl mt-1 cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default ApiKey