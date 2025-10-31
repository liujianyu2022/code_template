import { ethers } from "hardhat"

// 合约地址（替换为你部署时得到的实际地址）
const tokenAddress = "0xf7aD103407725F60d6a68dbb1f54Bc439D80330f"
const recipientAccount = "0x4ee40fb2b93ba146fb810bc22d0fe24927707739"

const transferAmount = ethers.parseUnits("1", 18)          // 转账数量 (例如转 100 个代币，假设代币有 18 位小数)

async function main() {
    const [owner] = await ethers.getSigners()

    const token = await ethers.getContractAt("Token1", tokenAddress)

    // 给钱包账户mint token
    await token.mint(recipientAccount, transferAmount)
    
    // 验证余额
    const tokenBalance = await token.balanceOf(recipientAccount)
   
    console.log(`New balances:`);
    console.log(`- CFL: ${ethers.formatUnits(tokenBalance, 18)}`)
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run scripts/mint/mint.ts --network bnbTest