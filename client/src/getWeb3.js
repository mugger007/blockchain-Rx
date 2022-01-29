import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    //wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        //reload if there is change is MetaMask account
        window.ethereum.on('accountsChanged', () => {
          window.location.reload();
        })

        const web3 = new Web3(window.ethereum);
        try {
          //request account access if needed
          await window.ethereum.enable();
          //accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        };
      }
      //legacy dapp browsers...
      else if (window.web3) {
        //use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      //fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      };
    });
  });

export default getWeb3;
