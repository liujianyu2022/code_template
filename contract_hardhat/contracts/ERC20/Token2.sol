// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./ERC20.sol";

contract Token2 is ERC20 {
    address public owner;
    uint256 public immutable maxSupply; // 最大总量

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can call this");
        _;
    }

    /**
     * @param _name 代币名称
     * @param _symbol 代币符号
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        owner = msg.sender;
        maxSupply = 100_000_000 * 10 ** 18;                 // 固定总量 1亿枚，考虑18位小数
        _mint(owner, maxSupply);
    }

    // 移除 mint 函数，防止后续增发
    // function mint(address to, uint256 amount) external onlyOwner {
    //     _mint(to, amount);
    // }

    // 仍可保留 burn 功能，让用户销毁代币
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
