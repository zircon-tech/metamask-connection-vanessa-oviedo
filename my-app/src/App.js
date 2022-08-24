// Importing modules
import React, { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { abi } from "./constants/abi.js";
import { useWeb3React } from "@web3-react/core";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from '@metamask/detect-provider';
import { TextInput  } from 'react-native'; 

const getLibrary = (provider) => {
  return new Web3Provider(provider);
};

function App() {

  const [personName, setName] = useState('Vanessa');
  const [favoriteNumber, setNumber] = useState(125);

// usetstate for storing and retrieving wallet details
const [data, setdata] = useState({
	address: "",
	Balance: null,
});

const {
  active,
  activate,
  chainId,
  account,
  library: provider,
} = useWeb3React();

// Button handler button for handling a
// request event for metamask
const btnhandler = () => {

	// Asking if metamask is already present or not
	if (window.ethereum) {
      // res[0] for fetching a first wallet
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => accountChangeHandler(res[0]));
      } else {
        alert("install metamask extension!!");
      }
};

async function savePerson () 
{
  if (window.ethereum) {
    console.log("Saving name: " + personName);

    const provider =  await detectEthereumProvider();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    const contractAddress = "0x4e1b0353157700252f95b5C20D990f4a3bA71760";
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      contract.store(personName, favoriteNumber);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please install MetaMask");
  }
};

// getbalance function for getting a balance in
// a right format with help of ethers
const getbalance = (address) => {
	// Requesting balance method
	window.ethereum
	.request({
		method: "eth_getBalance",
		params: [address, "latest"]
	})
	.then((balance) => {
		// Setting balance
		setdata({
      address : address,
		  Balance: ethers.utils.formatEther(balance),
		});
	});
};

// Function for getting handling all events
const accountChangeHandler = (account) => {
	// Setting an address data
	setdata({
	  address: account,
	});

	// Setting a balance
	getbalance(account);
};

function setPersonName() 
{
  return function (event) {
    setName(event.target.value);
  }
}

function setFavoriteNumber() 
{
  return function (event) {
    setNumber(event.target.value);
  }
}

return (
	<div className="App">
      {/* Calling all values which we
      have stored in usestate */
      }
      <Web3ReactProvider getLibrary={getLibrary}>
          <Card className="text-center">
            <Card.Header>
            <strong>Address: </strong>
            {data.address}
            </Card.Header>
            <Card.Body>
            <Card.Text>
              <strong>Balance: </strong>
              {data.Balance}
            </Card.Text>
            <Button onClick={btnhandler} variant="primary">
              Connect to wallet
            </Button>
            </Card.Body>
          </Card>

          <div id="myContract">
            <TextInput  value={personName} onChange={setPersonName()}/>
            <TextInput keyboardType="numeric" value={favoriteNumber} onChange={setFavoriteNumber()}/>
            <Button onClick={savePerson} variant="primary">
                Save person
            </Button>
          </div>
        </Web3ReactProvider>
      </div>
);
}

export default App;
