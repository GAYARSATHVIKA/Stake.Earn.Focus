// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FocusRoom is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;

    struct Room {
        uint256 id;
        uint256 stakeAmount;
        uint256 startTime;
        uint256 endTime;
        address[] participants;
        bool distributed;
    }

    uint256 public roomCounter;
    uint256 public tokenCounter;
    
    mapping(uint256 => Room) public rooms;
    mapping(uint256 => mapping(address => bool)) public isParticipant;
    mapping(uint256 => mapping(address => bool)) public completed;
    mapping(uint256 => mapping(address => bool)) public exitedEarly;

    event RoomCreated(uint256 indexed roomId, uint256 stakeAmount, uint256 startTime, uint256 endTime);
    event JoinedRoom(uint256 indexed roomId, address indexed participant);
    event EarlyExit(uint256 indexed roomId, address indexed participant);
    event Completed(uint256 indexed roomId, address indexed participant);
    event RewardsDistributed(uint256 indexed roomId, uint256 totalPool, uint256 rewardPerWinner);

    constructor() ERC721("Focus Badge", "FOCB") Ownable(msg.sender) {}

    function createRoom(uint256 _stakeAmount) external {
        roomCounter++;
        uint256 roomId = roomCounter;
        
        rooms[roomId] = Room({
            id: roomId,
            stakeAmount: _stakeAmount,
            startTime: block.timestamp,
            endTime: block.timestamp + 60 minutes,
            participants: new address[](0),
            distributed: false
        });

        emit RoomCreated(roomId, _stakeAmount, block.timestamp, rooms[roomId].endTime);
    }

    function joinRoom(uint256 _roomId) external payable nonReentrant {
        Room storage room = rooms[_roomId];
        require(block.timestamp < room.endTime, "Room session already started or ended");
        require(msg.value == room.stakeAmount, "Incorrect stake amount");
        require(!isParticipant[_roomId][msg.sender], "Already joined");

        room.participants.push(msg.sender);
        isParticipant[_roomId][msg.sender] = true;

        emit JoinedRoom(_roomId, msg.sender);
    }

    function exitEarly(uint256 _roomId) external nonReentrant {
        require(isParticipant[_roomId][msg.sender], "Not a participant");
        require(!completed[_roomId][msg.sender], "Already completed");
        require(!exitedEarly[_roomId][msg.sender], "Already exited");

        exitedEarly[_roomId][msg.sender] = true;
        
        emit EarlyExit(_roomId, msg.sender);
    }

    function markCompleted(uint256 _roomId) external {
        require(isParticipant[_roomId][msg.sender], "Not a participant");
        require(block.timestamp >= rooms[_roomId].endTime, "Session not finished yet");
        require(!exitedEarly[_roomId][msg.sender], "You exited early");
        require(!completed[_roomId][msg.sender], "Already marked completed");

        completed[_roomId][msg.sender] = true;

        emit Completed(_roomId, msg.sender);
    }

    function distributeRewards(uint256 _roomId) external nonReentrant {
        Room storage room = rooms[_roomId];
        require(block.timestamp >= room.endTime, "Session not finished yet");
        require(!room.distributed, "Rewards already distributed");

        uint256 winnerCount = 0;
        for (uint256 i = 0; i < room.participants.length; i++) {
            if (completed[_roomId][room.participants[i]]) {
                winnerCount++;
            }
        }

        require(winnerCount > 0, "No winners to distribute to");

        uint256 totalPool = room.participants.length * room.stakeAmount;
        uint256 rewardPerWinner = totalPool / winnerCount;

        room.distributed = true;

        for (uint256 i = 0; i < room.participants.length; i++) {
            address participant = room.participants[i];
            if (completed[_roomId][participant]) {
                (bool success, ) = payable(participant).call{value: rewardPerWinner}("");
                require(success, "Transfer failed");
                mintBadge(participant);
            }
        }

        emit RewardsDistributed(_roomId, totalPool, rewardPerWinner);
    }

    function mintBadge(address _user) internal {    
        tokenCounter++;
        uint256 tokenId = tokenCounter;
        
        string memory uri = string(abi.encodePacked(
            "data:application/json;base64,",
            "eyJuYW1lIjogIkZvY3VzIEJhZGdlICMiLCAiZGVzY3JpcHRpb24iOiAiQSBwcm9vZiBvZiBmb2N1cyBmb3IgUm9vbSAjIiwgImltYWdlIjogImh0dHBzOi8vYXBpLmRpY2ViZWFyLmNvbS83LngvYm90dHRzL3N2Zz9zZWVkPUZvY3VzIn0="
        ));
        
        _safeMint(_user, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function getParticipants(uint256 _roomId) external view returns (address[] memory) {
        return rooms[_roomId].participants;
    }

    receive() external payable {}
}
