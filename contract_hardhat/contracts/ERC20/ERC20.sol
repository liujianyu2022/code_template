// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./IERC20.sol";

contract ERC20 is IERC20, IERC20Errors {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    // uint256 private totalSupply;
    uint public totalSupply;
    mapping(address account => uint256) private _balances;
    mapping(address account => mapping(address spender => uint256)) private _allowances;

    // 构造函数，初始化代币名称、符号、小数位数和总供应量
    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    // function totalSupply() external view override returns (uint256) {
    //     return _totalSupply;
    // }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    // 转账函数
    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    // 返回授权额度
    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }

    // 授权函数
    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount, true);
        return true;
    }

    // 从授权账户转账
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        _spendAllowance(from, msg.sender, amount);              // 处理授权额度的扣除逻辑
        _transfer(from, to, amount);                            // 转账
        return true;
    }

    function _transfer(address from, address to, uint256 amount) internal {
        if (from == address(0)) revert ERC20InvalidSender(address(0));
        if (to == address(0)) revert ERC20InvalidReceiver(address(0));

        _update(from, to, amount);
    }

    function _update(address from, address to, uint256 amount) internal {
        if (from == address(0)) {
            totalSupply += amount;         // 说明是 _mint 调用

        } else {
            // 处理 from 的逻辑

            uint256 fromBalance = _balances[from];
            if(fromBalance < amount) revert ERC20InsufficientBalance(from, fromBalance, amount);

            // 在 Solidity 0.8.0 版本之后，算术运算默认会进行溢出检查（如果发生溢出，交易会 revert）。
            // 某些情况下，我们可以确定运算不会溢出，这时可以用 unchecked 来优化 Gas 消耗
            unchecked {
                _balances[from] = fromBalance - amount;
            }
        }

        if (to == address(0)) {
            totalSupply -= amount;         // 说明是 _burn 调用
            
        } else {
            // 处理 to 的逻辑

            unchecked {
                _balances[to] += amount;
            }
        }

        emit Transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal {
        if(to == address(0)) revert ERC20InvalidReceiver(address(0));
        _update(address(0), to, amount);
    }

    function _burn(address from, uint256 amount) internal {
        if(from == address(0)) revert ERC20InvalidSender(address(0));
        _update(from, address(0), amount);
    }

    // 真正处理授权额度的调整
    function _approve(address owner, address spender, uint256 amount, bool emitEvent) internal {
        if (owner == address(0)) revert ERC20InvalidApprover(address(0));
        if (spender == address(0)) revert ERC20InvalidSpender(address(0));
        
        _allowances[owner][spender] = amount;

        // 只需要当用户主动调用 approve() 进行授权的时候，才触发 Approval 事件
        if (emitEvent) emit Approval(owner, spender, amount);
    }

    // 处理授权额度（allowance）的扣除逻辑，确保在调用 transferFrom 时，只能转移已被授权的代币数量
    // 1. spender 已被 owner 授权足够的额度
    // 2. 每次转账后，剩余的授权额度要相应减少（除非授权额度是 uint256.max，表示无限授权）
    function _spendAllowance(address owner, address spender, uint256 amount) internal virtual {
        uint256 currentAllowance = _allowances[owner][spender];

        // 如果不是无限授权
        if (currentAllowance < type(uint256).max) {

            // 授权额度不足
            if (currentAllowance < amount) revert ERC20InsufficientAllowance(spender, currentAllowance, amount);
            
            // 减少授权额度
            unchecked {
                _approve(owner, spender, currentAllowance - amount, false);
            }
        }

        // 如果是无限授权（type(uint256).max），则不需要减少额度
    }
}
