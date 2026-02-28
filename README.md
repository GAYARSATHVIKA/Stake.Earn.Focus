# Decentralized Study Rooms (FocusRoom)

A production-ready Web3 accountability platform built on the Monad blockchain. Users stake tokens to join focus rooms, stay productive for the duration, and earn rewards from those who quit early.

## 🚀 Tech Stack

- **Blockchain**: Solidity, Hardhat, OpenZeppelin, ERC721
- **Frontend**: React (Vite), Ethers.js v6, TailwindCSS, Framer Motion
- **State Management**: Zustand
- **Notifications**: React Hot Toast
- **Network**: Monad Testnet

## 🛠️ Setup Instructions

### 1. Smart Contract Deployment

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment:
   Create a `.env` file in the root directory:
   ```env
   PRIVATE_KEY=your_private_key_here
   ```
3. Compile the contract:
   ```bash
   npx hardhat compile
   ```
4. Deploy to Monad Testnet:
   ```bash
   npx hardhat run scripts/deploy.ts --network monadTestnet
   ```
5. Update the contract address in `src/utils/contract.ts`:
   ```typescript
   export const FOCUS_ROOM_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
   ```

### 2. Frontend Development

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Connect your MetaMask wallet.
3. Ensure you are on the Monad Testnet (the app will prompt you to switch).

## 🎮 How to Use

1. **Connect Wallet**: Use the button in the top right corner.
2. **Create a Room**: Set a stake amount (e.g., 0.1 MON) and create a 60-minute focus session.
3. **Join a Room**: Browse active rooms and join by staking the required amount.
4. **Focus**: Stay in the room until the timer ends.
5. **Mark Completed**: Once the timer hits zero, click "Mark Completed".
6. **Claim Rewards**: After the session, claim your original stake plus rewards from quitters, and receive your NFT badge.
7. **Quit Early**: If you must leave, you can quit, but you will forfeit your stake to the remaining participants.

## 📜 Smart Contract Features

- **ReentrancyGuard**: Protection against reentrancy attacks.
- **ERC721**: Automatic NFT badge minting upon successful completion.
- **Reward Distribution**: Fair distribution of forfeited stakes among winners.
- **On-Chain Timers**: Secure session management using block timestamps.

## 🎨 UI/UX Highlights

- **Glassmorphism**: Modern, translucent UI components.
- **Smooth Animations**: Powered by Framer Motion.
- **Real-Time Sync**: Blockchain state polling every 5 seconds.
- **Responsive Design**: Works on mobile and desktop.
