🧠 Decentralized Study Rooms (FocusRoom)

A production-ready Web3 accountability platform built on the Monad Testnet that incentivizes deep focus through financial staking and on-chain rewards.

Users stake MON tokens to join time-bound focus rooms. Participants who complete the session earn rewards from those who quit early — plus a unique NFT badge as proof of discipline.

🌍 Live Overview

Decentralized Study Rooms combines:

💰 DeFi staking mechanics

🎯 Productivity accountability

🏆 NFT-based achievement rewards

🔒 Trustless smart contract automation

⚡ High-performance Monad blockchain

The platform gamifies focus sessions while maintaining fairness, transparency, and decentralization.

🚀 Features
🏠 Smart Contract (FocusRoom.sol)

Create time-bound study rooms

Stake MON tokens to participate

Early exit forfeits stake

Automated reward distribution

NFT badge minting for winners

Reentrancy protection

Fully on-chain logic

💻 Frontend

Wallet connection (MetaMask)

Room creation & joining

Countdown timers

Reward claiming

Real-time blockchain polling

Responsive modern UI

🏗️ Architecture
User Wallet (MetaMask)
        ↓
Frontend (React + Ethers v6)
        ↓
FocusRoom Smart Contract (Solidity)
        ↓
Monad Testnet
🛠️ Tech Stack
🔗 Blockchain

Solidity ^0.8.20

Hardhat

OpenZeppelin Contracts

ERC721 (NFT badge minting)

ReentrancyGuard

🎨 Frontend

React (Vite)

Ethers.js v6

TailwindCSS

Framer Motion

Zustand (state management)

React Hot Toast

🌐 Network

Monad Testnet

Chain ID: 143

📜 Smart Contract Logic
Room Creation

Creator defines stake amount.

Session duration = 60 minutes.

Room stored on-chain with timestamp.

Joining

User stakes exact MON amount.

Participant recorded on-chain.

Completion

Users must wait until session ends.

If they did not exit early → eligible for rewards.

Early Exit

User forfeits stake.

Stake added to reward pool.

Reward Distribution

Total pool = participants × stake.

Distributed equally among completed users.

Each winner receives:

Reward share

NFT Badge

🏆 NFT Badge

Each successful participant receives an ERC721 NFT containing:

Room completion proof

On-chain metadata

Unique token ID

Achievement badge image

This acts as a permanent on-chain proof of discipline.

🧪 Smart Contract Security

✅ ReentrancyGuard protection

✅ Checks-Effects-Interactions pattern

✅ Strict stake validation

✅ On-chain timestamp validation

✅ No centralized admin control

📦 Installation & Setup
🔹 1. Clone Repository
git clone https://github.com/GAYARSATHVIKA/Stake.Earn.Focus.git
cd Stake.Earn.Focus
🔹 2. Install Dependencies
npm install
🔐 Smart Contract Deployment
1️⃣ Configure Environment

Create .env file:

PRIVATE_KEY=your_private_key_here

⚠️ Never commit your private key.

2️⃣ Compile Contract
npx hardhat compile
3️⃣ Deploy to Monad Testnet
npx hardhat run scripts/deploy.ts --network monadTestnet

After deployment, copy the contract address.

4️⃣ Update Frontend Contract Address

In:

src/utils/contract.ts

Update:

export const FOCUS_ROOM_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
💻 Run Frontend
npm run dev

Then open:

http://localhost:5173
🎮 How to Use

Connect MetaMask.

Switch to Monad Testnet.

Create or join a room.

Focus until timer ends.

Mark completed.

Claim rewards + NFT badge.

📊 Reward Formula
Total Pool = Total Participants × Stake Amount
Reward Per Winner = Total Pool / Winners

Participants who exit early lose their stake.

Winners receive equal share of forfeited stakes.

📡 Blockchain Details
Property	Value
Network	Monad Testnet
Chain ID	143
Currency	MON
Standard	ERC721
EVM Version	Paris
🎨 UI Highlights

Glassmorphism design

Smooth transitions (Framer Motion)

Real-time polling every 5 seconds

Mobile responsive layout

Clean and minimal UX

📁 Project Structure
contracts/
  FocusRoom.sol

scripts/
  deploy.ts

src/
  components/
  pages/
  utils/
  store/

hardhat.config.ts
🏗️ Future Improvements

Dynamic session duration

Reputation scoring system

On-chain leaderboard

Room privacy settings

Multi-token staking support

DAO governance for feature updates

👤 Author

GAYARSATHVIKA
Blockchain Developer | Web3 Builder

📜 License

MIT License

🌟 Why This Project Matters

Decentralized Study Rooms transforms productivity into an economically aligned system.

Instead of relying on motivation alone, users stake value on their focus. Discipline becomes rewarding, and quitting becomes costly — all enforced by transparent smart contracts.

Built fully decentralized on Monad.
