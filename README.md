# SBIP-App


## Tech Stack
**Languages**: TypeScript, HTML, Solidity

**Frameworks and Libraries**: React.js, MaterialUI

**Others**: WAGMI, Hardhat, Open-zeppelin, Infura, Vercel


## Challenges

  1) I added in an additional upload signature function so as to simulate modern-day signature applications where you can either upload a pre-existing signature, or draw one yourself. However, I scrapped it because of time constraint and it would definitely increase the code's complexity.
  2) It was my first time creating a drawable canvas from scratch, and I have to admit that I was pretty clueless about its implementation. So I had to seek plenty of help from the internet and ChatGPT
  

## Improvements

  1) Instead of simply storing the hash in the contract, an ERC721 signature NFT alongside its hash can be minted (Partially done).
  2) The current user experience only supports submission of repeated signatures partially. A "Submit New Signature" button and functionality can be added.
  3) More types/interfaces should be enforced on the code as I am using TypeScript.
  4) The many different function calls can be segregated into their own folders to keep the code cleaner. Right now they are all lumped into a single file.
  5) My website design is rather plain at the moment. I believe it can be improved upon to make it look even more attractive


## Instructions
  1) Make sure you have a Metamask wallet 
  2) Get some SepoliaETH for Sepolia: https://sepoliafaucet.com/
  3) Head over to the Vercel app: https://sbip-app.vercel.app/
  4) Connect your wallet and draw your signature in the canvas
  5) Once you're done, hit on "Click Here To Sign Your Signature" -- this will prompt MetaMask to use your private key to sign the Base64 format of your signature.
  6) After signing, hit on "Click Here To Submit" -- this will store your signed signature as a hash into the smart contract
  7) Now check on the page to see your stored hash and transaction hash


## Signing off

Always happy to build, make mistakes and learn from them.

Cheers,
Ashton
