import logo from './logo.svg';
import { useState} from 'react'
import { ethers } from 'ethers'
import './App.css';
import Greeter from '//artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {

  const[ greeting, setGreetingValue] = useState('')

  async function requestAccount(){
     await window.ethereum.request({method: 'eth_requestAccounts' });
  }

  async function fetchGreeting(){
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
  }
}

  async function setGreeting(){
    if (!greeting) return // Checking if there is any greeting being returned in the first place
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()  // Request the user's account
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();  // To get the contract signed
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting) // To enter the local greeting variable
      setGreetingValue('')
      await transaction.wait()  // waiting for the actual transaction to be confirmed
     
      fetchGreeting()  // fetch the final greeting value
    
  }
}
 
return (
  <div className="App">
    <header className="App-header">
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      <button onClick={setGreeting}>Set Greeting</button>
      <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      
    </header>
  </div>
);
}

export default App;
