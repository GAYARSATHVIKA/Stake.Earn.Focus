export const FOCUS_ROOM_ABI = [
  "function createRoom(uint256 _stakeAmount) external",
  "function joinRoom(uint256 _roomId) external payable",
  "function exitEarly(uint256 _roomId) external",
  "function markCompleted(uint256 _roomId) external",
  "function distributeRewards(uint256 _roomId) external",
  "function roomCounter() external view returns (uint256)",
  "function rooms(uint256) external view returns (uint256 id, uint256 stakeAmount, uint256 startTime, uint256 endTime, bool distributed)",
  "function getParticipants(uint256 _roomId) external view returns (address[] memory)",
  "function isParticipant(uint256, address) external view returns (bool)",
  "function completed(uint256, address) external view returns (bool)",
  "function exitedEarly(uint256, address) external view returns (bool)",
  "event RoomCreated(uint256 indexed roomId, uint256 stakeAmount, uint256 startTime, uint256 endTime)",
  "event JoinedRoom(uint256 indexed roomId, address indexed participant)",
  "event EarlyExit(uint256 indexed roomId, address indexed participant)",
  "event Completed(uint256 indexed roomId, address indexed participant)",
  "event RewardsDistributed(uint256 indexed roomId, uint256 totalPool, uint256 rewardPerWinner)"
];

// Placeholder address - user will need to update this after deployment
export const FOCUS_ROOM_ADDRESS = "0x800a7C66d61A52ba77571D2A6C21cA9C87C27028";
