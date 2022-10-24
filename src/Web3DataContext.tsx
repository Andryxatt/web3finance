import { useWeb3React } from "@web3-react/core";
import { Contract, ethers, Wallet } from "ethers";
import { useContext, createContext, useState, useEffect } from 'react';
import { toast } from "react-toastify";
import Web3 from "web3";
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
    totalAmount:any,
    fast:any, slow:any, average: any,
    countTransactions: (isNative:boolean)=> any,
    totalTokensToMultiSend: ()=> any,
    getUserTokenBalance: (address:any, decimal:any) => any,
    getUserNativeBalance: () => any,
    calculateApproximateFeeTokenNative: (token:any, decimal:any) => any,
    calculateApproximateFeeNative:()=> any,
    setSpeedNetwork: any,
    speedNetwork: any,

};
const Web3Ctx = createContext<Partial<ContextProps>>({});
const Web3DataContext = ({ children }: any) => {
    const contractsAddresses = require("./contracts/AddressesContracts.json")
    const goerliTokens = require("./tokens/goerli.json");
    const ethereumTokens = require("./tokens/ethereum.json");
    const bscTokens = require("./tokens/bsc.json");
    const polygonTokens = require("./tokens/polygon.json");
    const OracleAbi = require("./contracts/oracle/Oracle.json");
    const FeeShareAbi = require("./contracts/FeeShare.json");
    const RTokenAbi = require("./contracts/RTokenAbi.json");
    const MinimalForwarderAbi = require("./contracts/MinimalForwarderAbi.json");
    const [slow, setSlow] = useState('0');
    const [average, setAverage] = useState('0');
    const [fast, setFast] = useState('0');
    const [speedNetwork, setSpeedNetwork] = useState('0');
    const { activate, active, account, library, chainId } = useWeb3React();
    const [addressesFromFile, setAddressesFromFile] = useState<any[]>([]);
    const [isFeeInToken, setIsFeeInToken] = useState<boolean>(false);
    const [currentChainId, setCurrentChainId] = useState<any>("0x5");
    const [currentAsset, setCurrentAsset] = useState<any>(undefined);
    const [totalAmount, setTotalAmount] = useState<any>(0);
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
    const [currentNetwork, setCurrentNetwork] = useState<any>(networks[2]);
    const validateAddresses = () => {
        for (let i = 0; i > addressesFromFile.length; i++) {
            if (addressesFromFile[i].length !== 42) {
                return false;
            }
        }
    }
   
    const stringToAddresses = (addresses: string) => {
        let addressesArray = addresses.split("\n");
        let addressesArrayFormatted = [];
        addressesArray.forEach((address: any) => {
            if (address.split(",")[0].length === 42) {
                addressesArrayFormatted.push(address.split(","));
            }
        });
        setAddressesFromFile(addressesArrayFormatted);
    }
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
    const getUserRTokenBalance = async () => {
        if (active) {
            tokens.map((token: any) => {
                let contract = new Contract(contractsAddresses[currentNetwork.name][0]["r" + token.name], RTokenAbi, library?.getSigner());
                contract.balanceOf(account).then((res: any) => {
                    console.log("user r token balance ", ethers.utils.formatUnits(res, token.decimal));
                    token.userBalance = ethers.utils.formatUnits(res._hex, token.decimal);
                    // props.updateTokens(ethers.utils.formatUnits(res._hex, props.token.decimal), props.token.name)
                });
            })
            
        }

    }
    useEffect(()=>{
        getUserRTokenBalance()
    }, [active])
   
    const countTransactions = (isNative: boolean) => {
        let countTransactions = 0;
        if (addressesFromFile.length > 255) {
            countTransactions = addressesFromFile.length / 255;
        }
        else {
            countTransactions = 1;
        }
        if (!isNative) {
            countTransactions = countTransactions + 1;
        }
        if(addressesFromFile.length === 0){
            countTransactions = 0;
        }
        return countTransactions;
    }
    const totalTokensToMultiSend = () =>{
        let totalTokens = 0;
        addressesFromFile.map((element: any) => {
            totalTokens = totalTokens + parseFloat(element.amount);
        })
        return totalTokens;
    }
    const getUserTokenBalance = async (address:any, decimal:any) =>{
        const contract = new Contract(address, RTokenAbi, library?.getSigner());
        const res = await contract.balanceOf(account)
        return ethers.utils.formatUnits(res._hex, decimal);;
    }
    const getUserNativeBalance = async () =>{
        const balance = await library?.getSigner().getBalance();
        return ethers.utils.formatUnits(balance, 18);
    }
    const calculateApproximateFeeNative = async () =>{
        const feeShare  = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
          // console.log("calculateTxCostNative");
          const arrayOfAmounts = addressesFromFile.map((item: any) => {
              return item.amount.toString().trim();
          });
          const feePerAddressNative = await feeShare["calculateFee()"]();
          const ammount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
          setTotalAmount(ammount);
          arrayOfAmounts.unshift(ammount.toString());
          const addresses = addressesFromFile.map((item: any) => { return item.address });
          addresses.unshift(contractsAddresses[currentNetwork.name][0].FeeShare);
          const msgValue = parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length) + parseFloat(ammount.toString()) + parseFloat("0.0000000000000001");
          const feeData = await library.getFeeData();
          const txInfo = {
              value: ethers.utils.parseEther(msgValue.toString()),
              maxFeePerGas: ethers.utils.parseUnits(speedNetwork, "gwei"),
          }
          const finalAmount = arrayOfAmounts.map((item: any) => {
              return ethers.utils.parseEther(item);
          });
          const units = await feeShare.estimateGas["multiSend(address[],uint256[])"](addresses, finalAmount, txInfo);
          const txFee = ethers.utils.parseUnits(speedNetwork, "gwei").mul(units);
          console.log("txFee", ethers.utils.formatEther(txFee));
          return (parseFloat(ethers.utils.formatEther(txFee)) + parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length)).toString();
    }
    const calculateApproveCostFeeTx = async (addressToken:any) =>{

    }
    const calculateApproximateFeeTokenNative = async (addressToken:any, decimal:any) =>{
        const feeShare  = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShare["calculateFee()"]();
        const ammount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
        setTotalAmount(ammount);
        arrayOfAmounts.unshift(ammount.toString());
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses[currentNetwork.name][0].FeeShare);
        const msgValue = parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length) + parseFloat(ammount.toString()) + parseFloat("0.0000000000000001");
       
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString()),
            maxFeePerGas: ethers.utils.parseUnits(speedNetwork, "gwei"),
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseEther(item);
        });
        const feeData = await library.getFeeData();
        const rTokenContract = new Contract(addressToken, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[currentNetwork.name][0].FeeShare);
            if (parseFloat(ethers.utils.formatUnits(allowance.toString(), decimal)) >= ammount) {
                const gasUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](addressToken, addresses, finalAmount, txInfo);
                const txFee = gasUsed.mul(feeData.gasPrice);
                console.log(txFee, "txFee")
              return ethers.utils.formatUnits(txFee, 'ether');
            }
            else {
                const units = await rTokenContract.estimateGas.approve(contractsAddresses[currentNetwork.name][0].FeeShare, ethers.utils.parseUnits(ammount.toString(), decimal));
                const txFee = units.mul(feeData.gasPrice);
                return ethers.utils.formatUnits(txFee, 'ether');
            }      
    }
   
    const calculateApproximateFeeTokenToken = (addressToken:any) =>{
        const feeShare  = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());

    }
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
    getAssetsPrices();
    getTotalDeposit();

    const sendTransactionToken = async (addressToken:any, decimal:any) => {
        // console.log(isFeeInToken, "isFeeInToken");
        const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());

        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShareContract["calculateFee()"]();
        const amount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
        const feeData = await library.getFeeData();
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        const isRToken = await feeShareContract.getRTokenAddress(addressToken);
        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (addressesFromFile.length) + parseFloat("0.0000000000000001") :
            parseFloat(feePerAddressNative!) * (addressesFromFile.length) + parseFloat("0.0000000000000001");
        const maxFeePerGas = feeData.lastBaseFeePerGas.add(ethers.utils.parseUnits(average, "gwei"));
        const txInfo = {
            value: ethers.utils.parseUnits(parseFloat(msgValue.toString()).toFixed(18)),
            maxFeePerGas: maxFeePerGas,
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, decimal);
        });

        const rTokenContract = new Contract(addressToken, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[currentNetwork.name][0].FeeShare);
        // const feeData = await library.getFeeData();
        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), decimal)) >= parseFloat(amount.toString())) {
            const idToast = toast.loading("Please wait...")
            feeShareContract["multiSend(address,address[],uint256[])"](addressToken, addresses, finalAmount, txInfo)
                .then((res: any) => {
                    res.wait().then((res: any) => {

                    })
                }).catch((err: any) => {
                    // console.log(err);
                    toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
        }
        else {
            const idToast = toast.loading("Please wait...")
            rTokenContract.approve(contractsAddresses[currentNetwork.name][0].FeeShare, ethers.utils.parseUnits(amount.toFixed(6).toString(), decimal), { maxFeePerGas: maxFeePerGas })
                .then((res: any) => {
                    res.wait().then(async (res: any) => {
                        const units = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](addressToken, addresses, finalAmount, txInfo)
                        console.log(units, "units");
                        // const txFee = BigNumber.from(average).mul(units);
                        // setApproximateCost(ethers.utils.formatEther(txFee) + parseFloat(msgValue.toString()).toFixed(18));
                        toast.update(idToast, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                        toast.update(idToast, { render: "Please wait...", isLoading: true });
                        feeShareContract["multiSend(address,address[],uint256[])"](addressToken, addresses, finalAmount, txInfo).then((res: any) => {
                            res.wait().then((res: any) => {
                                toast.update(idToast, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                                console.log(res)
                            })
                        })
                    }).catch((err: any) => {
                        toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                    })
                }).catch((err: any) => {
                    toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false });
                });
        }
    }
    const sendTransactionNative = async () => {
        const idToast = toast.loading("Processing transaction please wait...")
        const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShareContract["calculateFee()"]();
        const ammount = arrayOfAmounts.reduce((a: any, b: any) => {}, 0)
        arrayOfAmounts.unshift(ammount.toString());
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses[currentNetwork.name][0].FeeShare);
        const msgValue = parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length) + parseFloat(ammount.toString()) + parseFloat("0.0000000000000001");
        const feeData = await library.getFeeData();
        const maxFeePerGas = ethers.utils.parseUnits(average, "gwei").add(feeData.lastBaseFeePerGas)
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString()),
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: ethers.utils.parseUnits(average, "gwei")
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseEther(item);
        });
       feeShareContract['multiSend(address[],uint256[])'](addresses, finalAmount, txInfo).then((res:any) =>{
            res.wait().then((res:any) =>{
                toast.update(idToast, { render: "Transaction success", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
            }).catch((err:any) =>{
                toast.update(idToast, { render: "Transaction error", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
            })
        }).catch((err: any) => {
            toast.update(idToast, { render: "Transaction rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
        });

    }
    const signMetaTx = async (req: any) => {
        // console.log(req, "req");
        const msgParams = JSON.stringify({
            domain: {
                chainId: chainId,
                name: 'FeeShare',
                verifyingContract: contractsAddresses[currentNetwork.name][0].MinimalForwarder,
                version: '1.0.0',
            },
            // Defining the message signing data content.
            message: req,
            // Refers to the keys of the *types* object below.
            primaryType: 'ForwardRequest',
            types: {
                // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                // Refer to PrimaryType
                ForwardRequest: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'gas', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'data', type: 'bytes' },
                ],
            },
        })
        var from = account
        var params = [from, msgParams]
        var method = 'eth_signTypedData_v4'
        const signature = await library.provider.request({
            method,
            params,
            from,
        })

        return signature
    }
    const sendTransactionAndPayFeeInToken = async (addressToken:any, decimal:any) => {
        // sendSignedTransaction();
        const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());

        const minimalForwarderContract = new Contract(contractsAddresses[currentNetwork.name][0].MinimalForwarder, MinimalForwarderAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return ethers.utils.parseUnits(item.amount.trim().toString(), decimal);
        });
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        // const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        feeShareContract.on("feeDetails", function (amm1, amm2, amm3, amm4, amm5, amm6) {
            console.log(amm1, amm2, amm3, amm4, amm5, amm6, "feeDetails")
        });
        feeShareContract.on("WhosignerRequest", function (address) {
            console.log(address, "WhosignerRequest")
        });
        // const msgValue = parseFloat(rTokenFee!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        // console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        // const txInfo = {
        //     value: ethers.utils.parseEther(msgValue.toString())
        // }
        const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [addressToken, addresses, arrayOfAmounts]);
        // console.log(dataMessage, "dataMessage");
        // const decoded = new ethers.utils.Interface(FeeShareAbi).decodeFunctionData("multiSendFee", dataMessage);
        // console.log(decoded, "decoded");

        const nonce = await minimalForwarderContract.getNonce(account);
        // console.log(nonce, "nonce");
        const values = {
            from: account,
            to: contractsAddresses[currentNetwork.name][0].FeeShare,
            value: 0,
            gas: '21000000',
            nonce: nonce.toString(),
            data: dataMessage,
        }
        const signature = await signMetaTx(values);

        const dataBuffer = { 'request': values, 'signature': signature }
        localStorage.setItem('transaction', JSON.stringify(dataBuffer));
        sendSignedTransaction();

        // const multiSendUnsigned = await feeShareContract['multiSendFee(address,address[],uint256[])'](props.token.address, addresses, arrayOfAmounts, {gasLimit:"210000"});
        //  console.log(multiSendUnsigned, "multiSendUnsigned");
    }

    const sendSignedTransaction = async () => {
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses[currentNetwork.name][0].MinimalForwarder,
            MinimalForwarderAbi,
            walletSigner
        );
        // console.log(contractForwarder)
        // console.log(localStorage.getItem('transaction'))
        const values = JSON.parse(localStorage.getItem('transaction')).request
        const signature = JSON.parse(localStorage.getItem('transaction')).signature
        // console.log(values)
        // console.log(signature)
        // const networkSpeed = await provider.getGasPrice();

        const result = await contractForwarder.execute(values, signature);
        console.log(result, "result");
        localStorage.clear();
    }

    const historicalBlocks = 20;
    function formatFeeHistory(result:any, includePending:any) {
        let blockNum = result.oldestBlock;
        // console.log(result.oldestBlock, "oldestBlock");
        let index = 0;
        const blocks = [];
        while (blockNum < result.oldestBlock + historicalBlocks) {
            if(result.reward[index] === undefined){
                break;
            }
            blocks.push({
                number: blockNum,
                baseFeePerGas: Number(result.baseFeePerGas[index]),
                gasUsedRatio: Number(result.gasUsedRatio[index]),
                priorityFeePerGas: result.reward[index].map((x:any) => Number(x)),
            });
            blockNum++;
            index++;
        }
        if (includePending) {
            blocks.push({
                number: "pending",
                baseFeePerGas: Number(result.baseFeePerGas[historicalBlocks]),
                gasUsedRatio: NaN,
                priorityFeePerGas: [],
            });
        }
        return blocks;
    }
    function avg(arr) {
        const sum = arr.reduce((a, v) => a + v);
        return Math.round(sum/arr.length);
      }

    const calculateGasLimit = async () => {
            const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_GOERLY_KEY);
            web3.eth.getFeeHistory(historicalBlocks, "pending", [30, 55, 80]).then((feeHistory) => {
                const blocks = formatFeeHistory(feeHistory, false);
                const slow    = avg(blocks.map(b => b.priorityFeePerGas[0]));
                const average = avg(blocks.map(b => b.priorityFeePerGas[1]));
                const fast    = avg(blocks.map(b => b.priorityFeePerGas[2]));

                web3.eth.getBlock("pending").then((block) => {
                  const baseFeePerGas = Number(block.baseFeePerGas);
                  setSlow(ethers.utils.formatUnits(slow + baseFeePerGas, "gwei"));
                  setAverage(ethers.utils.formatUnits(average + baseFeePerGas, "gwei"));
                  setFast(ethers.utils.formatUnits(fast + baseFeePerGas, "gwei"));
                  console.log("Manual estimate:", {
                    slow: ethers.utils.formatUnits(slow + baseFeePerGas, "gwei"),
                    average: ethers.utils.formatUnits(average + baseFeePerGas, "gwei"),
                    fast: ethers.utils.formatUnits(fast + baseFeePerGas, "gwei"),
                  });
                });
        });
        setSpeedNetwork(average);
    }
    useEffect(()=>{
        if(active){
            calculateGasLimit();
        }
    },[active])
    


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
            currentChainId,
            countTransactions,
            totalTokensToMultiSend,
            getUserTokenBalance,
            getUserNativeBalance,
            calculateApproximateFeeTokenNative,
            calculateApproximateFeeNative,
            totalAmount,
            fast, slow, average,
            setSpeedNetwork,
            speedNetwork,
        }}>
            {children}
        </Web3Ctx.Provider>
    );
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};