import { Wallet, Provider, Contract, utils } from "zksync-web3"
import { expect } from "chai"
import * as ethers from "ethers"

import { toBN, Tx, consoleLimit, consoleAddreses, getBalances } from "./utils/helper"
import { deployAAFactory, deployAccount } from "./utils/multisig-aa-deploy"
import {sendTx, sendTxForMultisig} from "./utils/sendtx"
import { rich_wallet } from "./utils/rich-wallets"
import "@nomicfoundation/hardhat-chai-matchers";

const dev_pk = rich_wallet[0].privateKey
const ETH_ADDRESS = "0x000000000000000000000000000000000000800A"
const SLEEP_TIME = 10 // 10 sec

let provider: Provider
let wallet: Wallet
let user1: Wallet
let user2: Wallet

let factory: Contract
let account: Contract


describe("Deployment, Setup & Transfer", function () {

    before(async () => {
        provider = Provider.getDefaultProvider()
        wallet = new Wallet(dev_pk, provider)
        user1 = Wallet.createRandom()
        user2 = Wallet.createRandom()

        factory = await deployAAFactory(wallet)
        account = await deployAccount(wallet, user1, user2, factory.address)
        console.log('account.address :', account.address)
        // 100 ETH transfered to Account
        await (
            await wallet.sendTransaction({
                to: account.address,
                value: toBN("100"),
            })
        ).wait()

        // Modify ONE_DAY from 24horus to 10 seconds for the sake of testing.
        await (await account.changeONE_DAY(SLEEP_TIME)).wait()
    })

    it("Should deploy contracts, send ETH, and set varible correctly", async function () {
        expect(await provider.getBalance(account.address)).to.eql(toBN("100"))

        expect(await account.owner1()).to.equal(user1.address)
        expect(await account.owner2()).to.equal(user2.address)

        await consoleAddreses(wallet, factory, account, user1)
        await consoleAddreses(wallet, factory, account, user2)
    })

    it("Set Limit: Should add ETH spendinglimit correctly", async function () {
        let tx = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, toBN("10"), {
            value: toBN("0"),
        })

        const txReceipt = await sendTxForMultisig(provider, account, user1, user2, tx)

        const limit = await account.limits(ETH_ADDRESS)
        expect(limit.limit).to.eql(toBN("10"))
        expect(limit.available).to.eql(toBN("10"))
        expect(limit.resetTime.toNumber()).to.closeTo(Math.floor(Date.now() / 1000), 5)
        expect(limit.isEnabled).to.equal(true)

        await consoleLimit(limit)
    })

    it("Transfer ETH 1: Should transfer correctly", async function () {
        const balances = await getBalances(provider, wallet, account, user1)
        const tx = Tx(user1, "5")

        //await utils.sleep(SLEEP_TIME * 1000);
        const txReceipt = await sendTxForMultisig(provider, account, user1, user2, tx)

        expect(await provider.getBalance(account.address)).to.be.closeTo(
            balances.AccountETHBal.sub(toBN("5")),
            toBN("0.01"),
        )

        expect(await provider.getBalance(user1.address)).to.eql(balances.UserETHBal.add(toBN("5")))

        const limit = await account.limits(ETH_ADDRESS)
        await consoleLimit(limit)

        expect(limit.limit).to.eql(toBN("10"))
        expect(limit.available).to.eql(toBN("5"))
        expect(limit.resetTime.toNumber()).to.gt(Math.floor(Date.now() / 1000))
        expect(limit.isEnabled).to.equal(true)

        // await getBalances(provider, wallet, account, user)
    })

    it("Transfer ETH 2: Should revert due to spending limit", async function () {
        const balances = await getBalances(provider, wallet, account, user1)

        const tx = Tx(user1, "6")
        const txReceipt = await sendTxForMultisig(provider, account, user1, user2, tx)

        await expect(txReceipt).to.throw('transaction failed')

        expect(await provider.getBalance(account.address)).to.be.closeTo(
            balances.AccountETHBal,
            toBN("0.01"),
        )
        expect(await provider.getBalance(user1.address)).to.eq(balances.UserETHBal)

        const limit = await account.limits(ETH_ADDRESS)
        // await consoleLimit(limit)

        expect(limit.limit).to.eql(toBN("10"))
        expect(limit.available).to.eql(toBN("5"))
        expect(limit.resetTime.toNumber()).to.gt(Math.floor(Date.now() / 1000))
        expect(limit.isEnabled).to.eq(true)

        // await getBalances(provider, wallet, account, user)
    })

    it("Transfer ETH 3: Should revert first but succeed after the daily limit resets", async function () {
        const balances = await getBalances(provider, wallet, account, user2)

        const tx = Tx(user2, "6")
        const resetTime = (await account.limits(ETH_ADDRESS)).resetTime.toNumber()

        if (Math.floor(Date.now() / 1000) < resetTime) {
            // before 10 seconds has passed
            const txReceipt = await sendTxForMultisig(provider, account, user1, user2, tx)
            await expect(txReceipt).to.throw('transaction failed')
        }

        await utils.sleep(SLEEP_TIME * 1000)

        if (Math.floor(Date.now() / 1000) > resetTime) {
            // after 10 seconds has passed
            const txReceipt = await sendTxForMultisig(provider, account, user1, user2, tx)
        }

        expect(await provider.getBalance(account.address)).to.be.closeTo(
            balances.AccountETHBal.sub(toBN("6")),
            toBN("0.01"),
        )
        expect(await provider.getBalance(user2.address)).to.eql(balances.UserETHBal.add(toBN("6")))

        const limit = await account.limits(ETH_ADDRESS)
        // await consoleLimit(limit)

        expect(limit.limit).to.eql(toBN("10"))
        expect(limit.available).to.eql(toBN("4"))
        expect(limit.resetTime.toNumber()).to.gt(resetTime)
        expect(limit.isEnabled).to.eql(true)

        // await getBalances(provider, wallet, account, user)
    })
})
//
// describe("Spending Limit Updates to make a transfer", function () {
//     beforeEach(async function () {
//         await utils.sleep(SLEEP_TIME * 1000)
//
//         let tx = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, toBN("10"), {
//             value: toBN("0"),
//         })
//
//         const txReceipt = await sendTx(provider, account, user, tx)
//         await txReceipt.wait()
//     })
//
//     it("Should succeed after overwriting SpendLimit", async function () {
//         const balances = await getBalances(provider, wallet, account, user)
//
//         const tx1 = Tx(user, "15")
//         const txReceipt1 = await sendTx(provider, account, user, tx1)
//         await expect(txReceipt1).to.throw('transaction failed')
//
//         await utils.sleep(SLEEP_TIME * 1000)
//
//         // Increase Limit
//         const tx2 = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, toBN("20"), {
//             value: toBN("0"),
//         })
//
//         const txReceipt2 = await sendTx(provider, account, user, tx2)
//
//         const txReceipt3 = await sendTx(provider, account, user, tx1)
//
//         expect(await provider.getBalance(account.address)).to.be.closeTo(
//             balances.AccountETHBal.sub(toBN("15")),
//             toBN("0.01"),
//         )
//         expect(await provider.getBalance(user.address)).to.eql(balances.UserETHBal.add(toBN("15")))
//
//         const limit = await account.limits(ETH_ADDRESS)
//         // await consoleLimit(limit)
//
//         expect(limit.limit).to.eql(toBN("20"))
//         expect(limit.available).to.eql(toBN("5"))
//         expect(limit.resetTime.toNumber()).to.gt(Math.floor(Date.now() / 1000))
//         expect(limit.isEnabled).to.eql(true)
//
//         // await getBalances(provider, wallet, account, user)
//     })
//
//     it("Should succeed after removing SpendLimit", async function () {
//         const balances = await getBalances(provider, wallet, account, user)
//
//         const tx1 = Tx(user, "30")
//         const txReceipt1 = await sendTx(provider, account, user, tx1)
//         await expect(txReceipt1).to.throw('transaction failed')
//
//         await utils.sleep(SLEEP_TIME * 1000)
//
//         // Remove Limit
//         const tx2 = await account.populateTransaction.removeSpendingLimit(ETH_ADDRESS, {
//             value: toBN("0"),
//         })
//
//         const txReceipt2 = await sendTx(provider, account, user, tx2)
//
//         const txReceipt3 = await sendTx(provider, account, user, tx1)
//
//         expect(await provider.getBalance(account.address)).to.be.closeTo(
//             balances.AccountETHBal.sub(toBN("30")),
//             toBN("0.01"),
//         )
//         expect(await provider.getBalance(user.address)).to.eq(balances.UserETHBal.add(toBN("30")))
//
//         const limit = await account.limits(ETH_ADDRESS)
//         // await consoleLimit(limit)
//
//         expect(limit.limit).to.eql(toBN("0"))
//         expect(limit.available).to.eql(toBN("0"))
//         expect(limit.resetTime.toNumber()).to.eql(0)
//         expect(limit.isEnabled).to.eql(false)
//
//         // await getBalances(provider, wallet, account, user)
//     })
// })
//
// describe("Spending Limit Updates", function () {
//     before(async function () {
//         //await utils.sleep(SLEEP_TIME * 1000);
//
//         let tx = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, toBN("10"), {
//             value: toBN("0"),
//             gasLimit: ethers.utils.hexlify(600000),
//         })
//
//         const txReceipt = await sendTx(provider, account, user, tx)
//
//         const tx2 = Tx(user, "5")
//         const txReceipt2 = await sendTx(provider, account, user, tx2)
//     })
//
//     it("Should revert. Invalid update for setSpendingLimit", async function () {
//         const tx = await account.populateTransaction.setSpendingLimit(ETH_ADDRESS, toBN("100"), {
//             value: toBN("0"),
//             gasLimit: ethers.utils.hexlify(600000),
//         })
//
//         const txReceipt = await sendTx(provider, account, user, tx)
//         await expect(txReceipt).to.throw('transaction failed')
//
//         const limit = await account.limits(ETH_ADDRESS)
//         // await consoleLimit(limit)
//
//         expect(limit.limit).to.eql(toBN("10"))
//         expect(limit.available).to.eql(toBN("5"))
//         expect(limit.resetTime.toNumber()).to.gt(Math.floor(Date.now() / 1000))
//         expect(limit.isEnabled).to.eql(true)
//     })
//
//     it("Should revert. Invalid update for removeSpendingLimit", async function () {
//         const tx2 = await account.populateTransaction.removeSpendingLimit(ETH_ADDRESS, {
//             value: toBN("0"),
//             gasLimit: ethers.utils.hexlify(600000),
//         })
//
//         const txReceipt = await sendTx(provider, account, user, tx2)
//         await expect(txReceipt).to.throw('transaction failed')
//
//         const limit = await account.limits(ETH_ADDRESS)
//         // await consoleLimit(limit)
//
//         expect(limit.limit).to.eql(toBN("10"))
//         expect(limit.available).to.eql(toBN("5"))
//         expect(limit.resetTime.toNumber()).to.gt(Math.floor(Date.now() / 1000))
//         expect(limit.isEnabled).to.eql(true)
//     })
// })
