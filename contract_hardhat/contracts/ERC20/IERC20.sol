// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IERC20 {

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

interface IERC20Errors {
    error ERC20InvalidSender(address sender);
    error ERC20InvalidReceiver(address receiver);

    error ERC20InsufficientBalance(address from, uint256 balance, uint256 needed);

    error ERC20InvalidApprover(address approver); 
    error ERC20InvalidSpender(address spender);
    error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed);
}