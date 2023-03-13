import './App.css';
import React, { useState, useEffect } from 'react';
import { loadContract } from './utils/load-contract';
import Web3 from 'web3';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import CreateCampaign from './pages/CreateCampaign';
import Home from './pages/Home';
import Navbar from './Components/Navbar';
import detectEthereumProvider from '@metamask/detect-provider';




//import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
//import { ethers } from 'ethers';
//import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
function App() {
  
   const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })
  const [balance,setBalance]=useState(null);
  const [account,setAccount]=useState(null);
  const [campaign,setcampaign]=useState([]);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Crowdfunding", provider)
      
      if(provider){
        setWeb3Api(
          {
            provider:provider,
            web3: new Web3(provider),
            contract: contract
          }
        )
      }
      else {
        console.log("Please install MetaMask")
      }
    }
    loadProvider()
  }, []);

   useEffect(
      ()=> {
        const getAccount = async () => {
          const accounts = await web3Api.web3.eth.getAccounts()
          setAccount(accounts[0]) //לוקח רק את החשבון הראשון
        }
        web3Api.web3 && getAccount()
     },[web3Api.web3])   
  //צריך:
  // const handleFormFieldChange = (fieldName, e) => {
  //   setForm({ ...form, [fieldName]: e.target.value })
  // }

  // async function handleCreateCampaign(e) {
  //   e.preventDefault();
  //   let addData = {
  //     title: form.title, 
  //     description: form.description, 
  //     goal: form.goal, 
  //     image: form.image}
  //   setCampaigns([...campaigns, addData])
  //   const {contract, web3} = web3Api

          const LoadCampaigns = async () => {
          const contract = web3Api;
          console.log(contract)
          const campaigns = await contract.getCampaigns(); 
        
      
       
        
          
          const parsedCampaings = campaigns.map((campaign, i) => ({
            creators: campaign.creators,
            titles: campaign.titles,
            descriptions: campaign.descriptions,
        
          }))
          setcampaign(parsedCampaings.titles)
        }
               
  
      
    
  return (
    <div className="App">
      <Router>
    <Navbar />
    <Routes>
        <Route exact path='/Home' element={<Home/>} />
        <Route path='/CreateCampaign' element={<CreateCampaign/>} />
    </Routes>
    </Router>
    <div>Current Balance is {balance} Ether</div>
    <div>Check that your account is {account}</div>
    <div> All campaigns {campaign}</div>
      <button onClick={LoadCampaigns}>clickMe</button>

    </div>
  );

}

export default App;
