import { ethers } from "hardhat"

// const recipientAccount = "0xfd7972d5b4ae9b4187df4a516f49b6669fc45a26"
// const recipientAccount = "0xed0c6cf771fa027713cbf64523b4a80b938ce56a"
const recipientAccount = "0xb40cf46d82A38234F00df654146A0e451418a85D"

const main = async () => {
    const [ owner ] = await ethers.getSigners()

    const tx = await owner.sendTransaction({
        to: recipientAccount,
        value: ethers.parseEther("100")
    })

    await tx.wait()

    const ethBalance = await ethers.provider.getBalance(recipientAccount)

    console.log("eth balance = ", ethers.formatEther(ethBalance))
}

main()
    .catch((error) => {
        console.error("error = ", error)
    })

// npx hardhat run .\scripts\transfer\transferEth.ts --network localhost