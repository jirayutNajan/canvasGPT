import { useEffect, useState } from "react"
import { useChatCanvas } from "./store/chatstore";
import ApiKey from "./components/ApiKey"
import InputPrompt from "./components/InputPrompt";
import InfiniteCanvas from "./components/InfiniteCanvas";
import Sidebar from "./components/Sidebar";

function App() {
  const [isSideBarClosed, setSideBarClosed] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    async function checkAPI() {
      const exists = await window.electronAPI?.hasAPIKey();
      if(!exists) {
        setHasApiKey(false)
      }
    }
    
    checkAPI();
  }, [])

  return (
    <div>
      <InputPrompt />
      <Sidebar 
        isSideBarClosed={isSideBarClosed} 
        setSideBarClosed={() => setSideBarClosed(prev => !prev)}
      />
      <InfiniteCanvas isSideBarClosed={isSideBarClosed} />
      {!hasApiKey && <ApiKey setHasApiKey={setHasApiKey}/>}
    </div>
  )
}

export default App