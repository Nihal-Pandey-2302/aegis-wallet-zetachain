// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

// =================================================================================================
// START of pasted code from: https://raw.githubusercontent.com/Uniswap/v2-periphery/master/contracts/interfaces/IUniswapV2Router02.sol
// =================================================================================================
interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);
    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(address token, uint liquidity, uint amountTokenMin, uint amountETHMin, address to, uint deadline, bool approveMax, uint8 v, bytes32 r, bytes32 s) external returns (uint amountETH);
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external;
}
// =================================================================================================
// END of pasted code from IUniswapV2Router02.sol
// =================================================================================================


// =================================================================================================
// START of pasted code from: https://raw.githubusercontent.com/zeta-chain/protocol-contracts/main/contracts/zevm/interfaces/IZRC20.sol
// =================================================================================================
interface IZRC20 {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function deposit(address to, uint256 amount) external;
    function withdraw(address to, uint256 amount) external;
    function withdraw(bytes memory to, uint256 amount) external;
}
// =================================================================================================
// END of pasted code from IZRC20.sol
// =================================================================================================


// =================================================================================================
// START of pasted code from: https://raw.githubusercontent.com/zeta-chain/protocol-contracts/main/contracts/zevm/interfaces/UniversalContract.sol
// =================================================================================================
struct MessageContext {
    bytes sender;
    uint256 chainID;
    address senderEVM;
    string message;
}

interface UniversalContract {
    function onCall(MessageContext calldata context, address zrc20, uint256 amount, bytes calldata message) external;
    function onCall(MessageContext calldata context, bytes calldata message) external payable;
}

error NotGateway();

abstract contract UniversalContractImpl is UniversalContract {
    address public immutable gateway;

    modifier onlyGateway() {
        if (msg.sender != gateway) revert NotGateway();
        _;
    }

    constructor() {
        gateway = 0x610178DA211fEF7d417BC0b6FeC39F05609E06F4;
    }
}
// =================================================================================================
// END of pasted code from UniversalContract.sol
// =================================================================================================


// =================================================================================================
// YOUR AEGIS VAULT CONTRACT (FINAL VERSION)
// =================================================================================================
contract AegisVault is UniversalContractImpl {
    IUniswapV2Router02 public immutable UNISWAP_ROUTER;
    mapping(address => mapping(address => uint256)) public userBalances;
    address public owner;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Swap(address indexed user, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() UniversalContractImpl() {
        UNISWAP_ROUTER = IUniswapV2Router02(0x2ca7d64A7EFE2D62A725E2B35Cf7230D6677FfEe);
        owner = msg.sender;
    }

    function onCall(MessageContext calldata context, address zrc20, uint256 amount, bytes calldata message) public virtual override onlyGateway {
        address sender = context.senderEVM;
        userBalances[sender][zrc20] += amount;
        emit Deposit(sender, zrc20, amount);

        if (message.length == 20) {
            address tokenOut = abi.decode(message, (address));
            _swap(sender, zrc20, tokenOut, amount);
        }
    }

    function onCall(MessageContext calldata, bytes calldata) public payable virtual override onlyGateway {}

    function withdraw(address zrc20Address, uint256 amount) external {
        address user = msg.sender;
        require(userBalances[user][zrc20Address] >= amount, "Insufficient balance");
        userBalances[user][zrc20Address] -= amount;
        emit Withdraw(user, zrc20Address, amount);
        IZRC20(zrc20Address).transfer(user, amount);
    }

    function swap(address tokenIn, address tokenOut, uint256 amountIn) external {
        _swap(msg.sender, tokenIn, tokenOut, amountIn);
    }

    function _swap(address user, address tokenIn, address tokenOut, uint256 amountIn) internal {
        require(userBalances[user][tokenIn] >= amountIn, "Insufficient balance for swap");
        userBalances[user][tokenIn] -= amountIn;
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        IZRC20(tokenIn).approve(address(UNISWAP_ROUTER), amountIn);
        uint256[] memory amounts = UNISWAP_ROUTER.swapExactTokensForTokens(amountIn, 0, path, address(this), block.timestamp);
        uint256 amountOut = amounts[1];
        userBalances[user][tokenOut] += amountOut;
        emit Swap(user, tokenIn, tokenOut, amountIn, amountOut);
    }

    function deposit(address zrc20, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        IZRC20(zrc20).transferFrom(msg.sender, address(this), amount);
        userBalances[msg.sender][zrc20] += amount;
        emit Deposit(msg.sender, zrc20, amount);
    }
    
    function airdropTokens(address user, address token, uint256 amount) external onlyOwner {
        userBalances[user][token] += amount;
        emit Deposit(user, token, amount);
    }
}