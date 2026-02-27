// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Agent Services Marketplace
 * Users pay USDC or burn MONITOR to access agent services
 * Platform takes 20% fee, agent creator gets 80%
 */

interface IAgent {
    function executeService(address user, bytes calldata data) external;
}

contract AgentMarketplace is Ownable {
    // Constants
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b3bA3a393F3; // Base USDC
    address public constant MONITOR = 0xaE43160D804366F3A6bCDA2C938Fabde71b26ba3; // MONITOR token
    address public constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    uint256 public constant PLATFORM_FEE_BPS = 200; // 2%
    
    // Agent info
    struct Agent {
        address creator;
        string name;
        string description;
        address serviceAddress;
        uint256 usdcPrice;
        uint256 monitorPrice;
        bool active;
        uint256 totalUsages;
        uint256 totalRevenue;
    }
    
    mapping(uint256 => Agent) public agents;
    uint256 public agentCount;
    
    // Transaction tracking
    struct Transaction {
        uint256 agentId;
        address user;
        uint256 amount;
        address tokenUsed;
        uint256 timestamp;
        bool success;
    }
    
    Transaction[] public transactions;
    
    // Events
    event AgentRegistered(uint256 indexed agentId, address indexed creator, string name);
    event ServicePurchased(uint256 indexed agentId, address indexed user, uint256 amount, address tokenUsed);
    event RevenuePaid(uint256 indexed agentId, address indexed creator, uint256 amount);
    
    // Register a new agent service
    function registerAgent(
        string memory _name,
        string memory _description,
        address _serviceAddress,
        uint256 _usdcPrice,
        uint256 _monitorPrice
    ) external {
        require(_serviceAddress != address(0), "Invalid service address");
        require(_usdcPrice > 0 || _monitorPrice > 0, "Price must be set");
        
        agents[agentCount] = Agent({
            creator: msg.sender,
            name: _name,
            description: _description,
            serviceAddress: _serviceAddress,
            usdcPrice: _usdcPrice,
            monitorPrice: _monitorPrice,
            active: true,
            totalUsages: 0,
            totalRevenue: 0
        });
        
        emit AgentRegistered(agentCount, msg.sender, _name);
        agentCount++;
    }
    
    // Pay with USDC
    function purchaseWithUSDC(uint256 _agentId, bytes calldata _serviceData) external {
        require(_agentId < agentCount, "Agent not found");
        Agent storage agent = agents[_agentId];
        require(agent.active, "Agent not active");
        require(agent.usdcPrice > 0, "USDC not available for this agent");
        
        uint256 price = agent.usdcPrice;
        uint256 platformFee = (price * PLATFORM_FEE_BPS) / 10000;
        uint256 agentRevenue = price - platformFee;
        
        // Transfer USDC from user
        IERC20(USDC).transferFrom(msg.sender, address(this), price);
        
        // Pay creator
        IERC20(USDC).transfer(agent.creator, agentRevenue);
        
        // Execute service
        IAgent(agent.serviceAddress).executeService(msg.sender, _serviceData);
        
        // Track
        agent.totalUsages++;
        agent.totalRevenue += agentRevenue;
        transactions.push(Transaction({
            agentId: _agentId,
            user: msg.sender,
            amount: price,
            tokenUsed: USDC,
            timestamp: block.timestamp,
            success: true
        }));
        
        emit ServicePurchased(_agentId, msg.sender, price, USDC);
    }
    
    // Pay with MONITOR (burn tokens)
    function purchaseWithMONITOR(uint256 _agentId, bytes calldata _serviceData) external {
        require(_agentId < agentCount, "Agent not found");
        Agent storage agent = agents[_agentId];
        require(agent.active, "Agent not active");
        require(agent.monitorPrice > 0, "MONITOR not available for this agent");
        
        uint256 price = agent.monitorPrice;
        uint256 platformFee = (price * PLATFORM_FEE_BPS) / 10000;
        uint256 agentRevenue = price - platformFee;
        
        // Transfer MONITOR from user (to be burned)
        IERC20(MONITOR).transferFrom(msg.sender, address(this), price);
        
        // Platform fee goes to owner (in MONITOR)
        // Agent revenue is sent to creator
        IERC20(MONITOR).transfer(agent.creator, agentRevenue);
        
        // Burn platform fee (send to dead address)
        IERC20(MONITOR).transfer(BURN_ADDRESS, platformFee);
        
        // Execute service
        IAgent(agent.serviceAddress).executeService(msg.sender, _serviceData);
        
        // Track
        agent.totalUsages++;
        agent.totalRevenue += agentRevenue;
        transactions.push(Transaction({
            agentId: _agentId,
            user: msg.sender,
            amount: price,
            tokenUsed: MONITOR,
            timestamp: block.timestamp,
            success: true
        }));
        
        emit ServicePurchased(_agentId, msg.sender, price, MONITOR);
    }
    
    // Get agent details
    function getAgent(uint256 _agentId) external view returns (Agent memory) {
        require(_agentId < agentCount, "Agent not found");
        return agents[_agentId];
    }
    
    // Get all agents
    function getAllAgents() external view returns (Agent[] memory) {
        Agent[] memory result = new Agent[](agentCount);
        for (uint256 i = 0; i < agentCount; i++) {
            result[i] = agents[i];
        }
        return result;
    }
    
    // Get transaction history
    function getTransactions(uint256 _limit) external view returns (Transaction[] memory) {
        uint256 length = transactions.length;
        uint256 start = length > _limit ? length - _limit : 0;
        Transaction[] memory result = new Transaction[](length - start);
        
        for (uint256 i = start; i < length; i++) {
            result[i - start] = transactions[i];
        }
        return result;
    }
    
    // Withdraw platform fees (USDC)
    function withdrawUSDC(uint256 _amount) external onlyOwner {
        IERC20(USDC).transfer(msg.sender, _amount);
    }
    
    // Withdraw platform fees (MONITOR - if any)
    function withdrawMONITOR(uint256 _amount) external onlyOwner {
        IERC20(MONITOR).transfer(msg.sender, _amount);
    }
}
