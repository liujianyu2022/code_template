import { ethers } from "hardhat"

// alchemy网址：   https://dashboard.alchemy.com/apps
// infura网址：    https://app.infura.io/

async function main() {
    const [ owner ] = await ethers.getSigners()
    const ownerAddress = await owner.getAddress()
    console.log("ownerAddress = ", ownerAddress)

    const factory = await ethers.getContractFactory("Token1")
    const contract = await factory.deploy("CFL", "CFL")
    const address = await contract.getAddress()
    
    console.log("CFL Token Address = ", address)         
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run .\scripts\ERC20\CFL_deploy.ts --network localhost         // 

// npx hardhat run .\scripts\ERC20\CFL_deploy.ts --network bnbTest           // 0xa24B56440a797a7658778b778E6E6dE744B26a74

// npx hardhat run .\scripts\ERC20\CFL_deploy.ts --network bnbMain           // 