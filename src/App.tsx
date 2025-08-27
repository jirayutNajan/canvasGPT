import { useEffect, useState } from "react"
import ApiKey from "./components/ApiKey"
import InputPrompt from "./components/InputPrompt";
import InfiniteCanvas from "./components/InfiniteCanvas";

function App() {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    async function checkAPI() {
      const exists = await window.electronAPI?.hasAPIKey();
      setHasApiKey(exists || false);
    }
    
    checkAPI();
  }, [])

  return (
    <div>
      <InputPrompt />
      <InfiniteCanvas />
      {!hasApiKey && <ApiKey setHasApiKey={setHasApiKey}/>}
    </div>
  )
}

export default App