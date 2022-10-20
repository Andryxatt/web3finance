import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useContext, createContext, useState } from 'react';
import { connectors } from "./helpers/connectors";
import { toHex } from "./helpers/utils";


type ContextProps = {
    active: boolean,
    account: string,
    library: any,
    activate: any,
    isConnected: boolean,
    ConnectWallet?: (connectorName: string, chainId: any) => void,
    addressesFromFile: any,
    setAddressesFromFile: any,
    getUserBalanceToken: any,
    nativeTokenFeePerAddress: string,
    isFeeInToken: boolean,
    setIsFeeInToken: any,
    userTokenBalance: any,
    chainId: any,
    setTokens: any,
    SwitchNetwork?: (network: any) => void,
    tokens: any,
    filters: any,
    networks: any,
    UpdateNetwork?: (network: any) => void,
    setFilters: any,
    currentNetwork: any,
    setNetworks: any,
    currentChainId: any,
};
const Web3Ctx = createContext<Partial<ContextProps>>({});

const Web3DataContext = ({ children }: any) => {
    const contractsAddresses = require("./contracts/AddressesContracts.json")
    const goerliTokens = require("./tokens/goerli.json");
    const ethereumTokens = require("./tokens/ethereum.json");
    const bscTokens = require("./tokens/bsc.json");
    const polygonTokens = require("./tokens/polygon.json");
    const OracleAbi = require("./contracts/oracle/Oracle.json");
    const RTokenAbi = require("./contracts/RTokenAbi.json");
    const { activate, active, account, library, chainId } = useWeb3React();
    const [addressesFromFile, setAddressesFromFile] = useState<any[]>([]);
    const [isFeeInToken, setIsFeeInToken] = useState<boolean>(false);
    const [currentChainId, setCurrentChainId] = useState<any>("0x5");
    const getAssetsPrices = async () => {
        const providerInfura = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
        const contractGoerli = new Contract(contractsAddresses["Goerli Testnet"][0].PriceOracle, OracleAbi, providerInfura);
        goerliTokens.Tokenization.map(async (token: any) => {
            const goerliPrice = await contractGoerli.getAssetPrice(token.address);
            token.tokenPrice = ethers.utils.formatUnits(goerliPrice, 8);
        })

        const providerBsc = new ethers.providers.JsonRpcProvider('https://practical-cold-owl.bsc-testnet.discover.quiknode.pro/' + process.env.REACT_APP_QUICK_NODE_KEY);
        const contractBsc = new Contract(contractsAddresses["Smart Chain Testnet"][0].PriceOracle, OracleAbi, providerBsc);
        bscTokens.Tokenization.map(async (token: any) => {
            const bscPrice = await contractBsc.getAssetPrice(token.address);
            token.tokenPrice = ethers.utils.formatUnits(bscPrice, 8);
        })
        const providerPolygon = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/' + process.env.REACT_APP_MUMBAI_KEY);
        const contractMumbai = new Contract(contractsAddresses["Mumbai Testnet"][0].PriceOracle, OracleAbi, providerPolygon);
        polygonTokens.Tokenization.map(async (token: any) => {
            const polygonPrice = await contractMumbai.getAssetPrice(token.address);
            token.tokenPrice = ethers.utils.formatUnits(polygonPrice, 8);
        });

    }
    const getTotalDeposit = async () => {
        const providerInfura = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
        goerliTokens.Tokenization.map(async (token: any) => {
            const contractGoerli = new Contract(contractsAddresses["Goerli Testnet"][0]["r" + token.name], RTokenAbi, providerInfura);
            const totalDeposit = await contractGoerli.totalSupply();
            token.deposits = parseFloat(ethers.utils.formatUnits(totalDeposit, token.decimal));
        })

        const providerBsc = new ethers.providers.JsonRpcProvider('https://practical-cold-owl.bsc-testnet.discover.quiknode.pro/' + process.env.REACT_APP_QUICK_NODE_KEY);
        bscTokens.Tokenization.map(async (token: any) => {
            const contractBsc = new Contract(contractsAddresses["Smart Chain Testnet"][0]["r" + token.name], RTokenAbi, providerBsc);
            const totalDeposit = await contractBsc.totalSupply();
            token.deposits = parseFloat(ethers.utils.formatUnits(totalDeposit, token.decimal));
        })

        const providerPolygon = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/' + process.env.REACT_APP_MUMBAI_KEY);
        polygonTokens.Tokenization.map(async (token: any) => {
            const contractPolygon = new Contract(contractsAddresses["Mumbai Testnet"][0]["r" + token.name], RTokenAbi, providerPolygon);
            const totalDeposit = await contractPolygon.totalSupply();
            token.deposits = parseFloat(ethers.utils.formatUnits(totalDeposit, token.decimal));
        })
        
    }
    getAssetsPrices();
    getTotalDeposit();
    const [tokens, setTokens] = useState<any>(goerliTokens.Tokenization);
    const [filters, setFilters] = useState([
        {
            name: "All",
            isSelected: true
        },
        {
            name: "Token Price",
            isSelected: false
        },
        {
            name: "Some Filter 2",
            isSelected: false
        },
        {
            name: "Some Filter 3",
            isSelected: false
        },
        {
            name: "Some Filter 4",
            isSelected: false
        },
        {
            name: "Some Filter 5",
            isSelected: false
        }
    ]);

    const [networks, setNetworks] = useState([
        {
            name: "Ethereum",
            icon: require("./images/ethereum.png"),
            chainId: "0x1",
            isActive: false,
            rpcUrl: '',
            Currency: "ETH"
        },
        {
            name: "Mumbai Testnet",
            icon: require("./images/polygon.png"),
            chainId: toHex(80001),
            isActive: false,
            Currency: 'MATIC',
            rpcUrl: 'https://rpc-mumbai.matic.today'
        },
        {
            name: "Goerli Testnet",
            icon: require("./images/ethereum.png"),
            chainId: "0x5",
            isActive: true,
            Currency: 'RETH',
            rpcUrl: ''
        },
        {
            icon: require("./images/binance.png"),
            name: "Smart Chain Testnet",
            chainId: toHex(97),
            isActive: false,
            Currency: 'tBNB',
            rpcUrl: 'https://data-seed-prebsc-1-s3.binance.org:8545'
        }
    ]);
    const [currentNetwork, setCurrentNetwork] = useState<any>(networks[2]);
    const ConnectWallet = async (connectorName: string) => {
        activate(connectors[connectorName]);
    }

    const SwitchNetwork = async (network: any) => {
        if (active) {
            try {
                if (toHex(chainId) !== network.chainId) {
                    UpdateNetwork(network);
                    await library?.provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: network.chainId }]
                    });

                }
            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await library?.provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: toHex(network.chainId), rpcUrls: [network.rpcUrl], chainName: network.name, nativeCurrency: {
                                name: network.Currency,
                                symbol: network.Currency, // 2-6 characters long
                                decimals: 18,
                            }
                        }],
                    });
                }
            }
        }

    }
    const UpdateNetwork = (network: any) => {
        const newState = networks.map(obj => {
            if (obj.name === network.name) {
                setCurrentNetwork(network);
                setCurrentChainId(network.chainId);
                switch (network.name) {
                    case "Ethereum":
                        setTokens(ethereumTokens.Tokenization);
                        break;
                    case "Mumbai Testnet":
                        setTokens(polygonTokens.Tokenization);
                        break;
                    case "Goerli Testnet":
                        setTokens(goerliTokens.Tokenization);
                        break;
                    case "Smart Chain Testnet":
                        setTokens(bscTokens.Tokenization);
                        break;
                    default:
                        setTokens([]);
                }
                return { ...obj, isActive: true };
            }
            else {
                return { ...obj, isActive: false };
            }
        });

        setNetworks(newState);
    };

    return (
        <Web3Ctx.Provider value={{
            active: active,
            account: account!,
            library: library!,
            activate,
            ConnectWallet,
            addressesFromFile: addressesFromFile,
            setAddressesFromFile,
            isFeeInToken,
            setIsFeeInToken,
            chainId,
            SwitchNetwork,
            tokens,
            filters,
            networks,
            setTokens,
            setFilters,
            UpdateNetwork,
            currentNetwork,
            setNetworks,
            currentChainId
        }}>
            {children}
        </Web3Ctx.Provider>
    );
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};