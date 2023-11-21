# Poohnet Rollup Simple Contracts
## 변경사항
아래 패키지의 버전이 최근에 1.0.0 변경됨.
- "@matterlabs/hardhat-zksync-deploy": "^0.6.11",
- "@matterlabs/hardhat-zksync-solc": "^0.4.5",
- "@matterlabs/hardhat-zksync-verify": "^0.2.4",

## Practice
1. install project
2. network setting 
3. prepare wallets 
4. deploy 'Fun' token on L1 
5. deposit ETH for the first account 
6. deposit token for the first account
7. withdraw ETH for the first account
8. withdraw token for the first account


## Install project
### set wallet private key value of .env
WALLET_PRIVATE_KEY=0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110
EMPTY_WALLET_PRIVATE_KEY=0xbc4a28323452742f6854b80c266695db394f2f3def77ec943f056d445c741c19 
### install pacakge and hardhat
```
yarn
yarn hardhat compile
```

## Network setting
```javascript
ethereum:
{
    name: "eth-local",
    chainId: 9,
    rpc: "http://localhost:8545"
}

zksync:
{
    name: "zk-local",
    chainId: 270,
    rpc: "http://localhost:3050"
}

```

## Prepare wallet
We should use the below rich-wallet from local-setup.

both layer1 and layer2's wallet have about 1000000000000 ETH
```javascript
[
    {
        "address": "0x36615Cf349d7F6344891B1e7CA7C72883F5dc049",
        "privateKey": "0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110"
    },
    {
        "address": "0xa61464658AfeAf65CccaaFD3a512b69A83B77618",
        "privateKey": "0xac1e735be8536c6534bb4f17f06f6afc73b2b5ba84ac2cfb12f7461b20c0bbe3"
    },
    {
        "address": "0x0D43eB5B8a47bA8900d84AA36656c92024e9772e",
        "privateKey": "0xd293c684d884d56f8d6abd64fc76757d3664904e309a0645baf8522ab6366d9e"
    },
    {
        "address": "0xA13c10C0D5bd6f79041B9835c63f91de35A15883",
        "privateKey": "0x850683b40d4a740aa6e745f889a6fdc8327be76e122f5aba645a5b02d0248db8"
    },
    {
        "address": "0x8002cD98Cfb563492A6fB3E7C8243b7B9Ad4cc92",
        "privateKey": "0xf12e28c0eb1ef4ff90478f6805b68d63737b7f33abfa091601140805da450d93"
    },
    {
        "address": "0x4F9133D1d3F50011A6859807C837bdCB31Aaab13",
        "privateKey": "0xe667e57a9b8aaa6709e51ff7d093f1c5b73b63f9987e4ab4aa9a5c699e024ee8"
    },
    {
        "address": "0xbd29A1B981925B94eEc5c4F1125AF02a2Ec4d1cA",
        "privateKey": "0x28a574ab2de8a00364d5dd4b07c4f2f574ef7fcc2a86a197f65abaec836d1959"
    },
    {
        "address": "0xedB6F5B4aab3dD95C7806Af42881FF12BE7e9daa",
        "privateKey": "0x74d8b3a188f7260f67698eb44da07397a298df5427df681ef68c45b34b61f998"
    },
    {
        "address": "0xe706e60ab5Dc512C36A4646D719b889F398cbBcB",
        "privateKey": "0xbe79721778b48bcc679b78edac0ce48306a8578186ffcb9f2ee455ae6efeace1"
    },
    {
        "address": "0xE90E12261CCb0F3F7976Ae611A29e84a6A85f424",
        "privateKey": "0x3eb15da85647edd9a1159a4a13b9e7c56877c4eb33f614546d4db06a51868b1c"
    }
]
```

## Deploy Token on L1
you should go into the layer1 folder and install.
``` bash
cd layer1
yarn 
yarn hardhat complie
yarn deploy
```
set FUN_TOKEN_ADDRESS value of .env file after deployment.


## Deposit ETH for the firs wallet
send 2 ETH for account from L1 to L2
``` bash
cd ..
yarn deposit-eth
```


## Deposit ETH for the firs wallet
send 20000 FUN tokens for account from L1 to L2
``` bash
yarn deposit-token
```

## Withdraw token  for the firs wallet
send 2 ETH for account from L2 to L1
``` bash
yarn withdraw-eth
```


## Withdraw token for the firs wallet
send 20000 FUN tokens for account from L2 to L1
``` bash
yarn deposit-token
```

## Transfer token to empty wallet on L2
```bash
yarn transfer-token-on-l2
```

## Deploy Greeter on L2
```bash
yarn deploy-greeter
```
set GREETER_ADDRESS

## Deploy paymaster on L2
```bash
yarn deploy-paymaster
```
set PAYMASTER_ADDRESS value of env file after deploy

## Official Links

- [Website](https://zksync.io/)
- [Documentation](https://v2-docs.zksync.io/dev/)
- [GitHub](https://github.com/matter-labs)
- [Twitter](https://twitter.com/zksync)
- [Discord](https://discord.gg/nMaPGrDDwk)
