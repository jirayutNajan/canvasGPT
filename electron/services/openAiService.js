import OpenAi from 'openai';
import Store from 'electron-store'

const store = new Store({ encryptionKey: "2wwqnCQOAlaVN3BSRoDKvIrC2HnwElUZ+JNdPQEMSLA=" })

let openaiClient = null;

const getOpenAiClient = () => {
  if (!openaiClient) {
    const apiKey = store.get('apiKey');
    if (!apiKey) {
      throw new Error('API key not found. Please set your API key first.');
    }
    openaiClient = new OpenAi({
      apiKey: apiKey
    });
  }
  return openaiClient;
};

// Function to reset the client (useful when API key changes)
const resetClient = () => {
  openaiClient = null;
};

export default getOpenAiClient;
export { resetClient };