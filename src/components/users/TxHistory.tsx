import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import contractAddresses from '../../contracts/AddressesContracts.json'
import FeeShareAbi from "../../contracts/FeeShare.json";
import { loadTransactionHistory, allTransactions } from '../../store/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import PaginationTxHistory from './PaginationTxHistory';
const TxHistory = () => {
    const dispatch = useAppDispatch();
    const txHistory = useAppSelector(allTransactions)
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [loading, setLoading] = useState(true);
    const infuraApiKey = process.env.REACT_APP_INFURA_KEY;
    const [selectedScanName, setSelectedScanName] = useState<any>();
    const scans = [
        {
            name: "etherscan",
            url: "https://etherscan.io/tx/"
        },
        {
            name: "bscscan",
            url: "https://bscscan.com/tx/"
        },
        {
            name: "polygonscan",
            url: "https://polygonscan.com/tx/"
        },
        {
            name: "arbiscan",
            url: "https://arbiscan.io/tx/"
        },
        {
            name: "optimisscans",
            url: "https://optimistic.etherscan.io/tx/"
        },
        {
            name: "avaxscan",
            url: "https://snowtrace.io/tx/"
        }
    ]
    const getTxHistory = async () => {
        const txArray = [];
        let provider = undefined;
        console.log("chain", chain)
        switch (chain.id) {
            case 1:
                provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${infuraApiKey}`);
                setSelectedScanName(scans[0])
                break;
            // case 5:
            //     provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${infuraApiKey}`);
            //     break;
            case 10:
                provider = new ethers.providers.JsonRpcProvider(`https://opt-mainnet.g.alchemy.com/v2/IZcTWl8yY9G_lnKiSJupPvSI-Q752SXj`);
                setSelectedScanName(scans[4])
                break;
            case 56:
                provider = new ethers.providers.JsonRpcProvider(`https://bsc.getblock.io/27578ce8-1ff1-4602-bbf2-127f8edcfc9f/mainnet/`);
                setSelectedScanName(scans[1])
                break;
            case 97:
                provider = new ethers.providers.JsonRpcProvider(`https://bsc.getblock.io/27578ce8-1ff1-4602-bbf2-127f8edcfc9f/testnet/`);
                break;
            case 137:
                provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/4f36124f93704ca1a5bc5e78ffac2245`);
                setSelectedScanName(scans[2])
                break;
            // case 80001:
            //     provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${infuraApiKey}`);
            //     break;
            case 42161:
                provider = new ethers.providers.JsonRpcProvider(`https://arbitrum-mainnet.infura.io/v3/${infuraApiKey}`);
                setSelectedScanName(scans[3])
                break;
            case 43114:
                provider = new ethers.providers.JsonRpcProvider(`https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`);
                setSelectedScanName(scans[5])
                break;
            default:
                break;
        }
        console.log("chain", chain.name)
        if (chain) {
            let name = "";
            switch (chain.name) {
                case "BNB Smart Chain":
                    name = "Binance Smart Chain"
                    break;
                case "Arbitrum One":
                    name = "Arbitrum"
                    break;
                case "Avalanche C-Chain":
                    name = "Avalanche"
                    break;
                default:
                    name = chain.name
                    break;

            }
            const contractFeeShare = new ethers.Contract(contractAddresses[name][0].FeeShare, FeeShareAbi, provider);
            console.log("contractFeeShare", contractFeeShare)
            const depositFilter = contractFeeShare.filters.Deposit(address, null);
            const withdrawFilter = contractFeeShare.filters.Withdraw(address, null);
            const multiSendFeeFilter = contractFeeShare.filters.FeeDetails(address, null, null, null, null);
            const multiSendTokenFilter = contractFeeShare.filters.MultiSend(address, null)
            console.log("multiSendTokenFilter", multiSendTokenFilter)
            if (chain.name === "BNB Smart Chain") {
                const blockNumber = await provider.getBlockNumber()
                const countQueries = Math.ceil((blockNumber - 27120421) / 5000);
                let startBlock = 27120421;
                let endBlock = startBlock + 5000;
                let txHist = [];
                for (let i = 0; i < countQueries; i++) {
                    const multiSendTokenTx = await contractFeeShare.queryFilter(multiSendTokenFilter, startBlock, endBlock);
                    // const multiSendNativeTx = await contractFeeShare.queryFilter(multiSendNativeFilter, 8415257,  latestBlockNumber);
                    const withdrawTx = await contractFeeShare.queryFilter(withdrawFilter, startBlock, endBlock);
                    const depositTx = await contractFeeShare.queryFilter(depositFilter, startBlock, endBlock);
                    const multiSendFeeTx = await contractFeeShare.queryFilter(multiSendFeeFilter, startBlock, endBlock);
                    startBlock = endBlock;
                    endBlock = startBlock + 5000;
                    const array = [...multiSendTokenTx, ...withdrawTx, ...depositTx, ...multiSendFeeTx]
                    txHist = [...txHist, ...array]
                }
                for (let i = 0; i < txHist.length; i++) {
                    const block = await provider.getBlock(txHist[i].blockNumber);
                    const newElem = { id: i + 1, timestamp: block.timestamp, transactionHash: txHist[i].transactionHash, event: txHist[i].event, blockNumber: txHist[i].blockNumber, data: txHist[i].data }
                    txArray.push(newElem)
                }
                dispatch(loadTransactionHistory(txArray))
                setLoading(false)
            }
            else {
                const depositFilter = contractFeeShare.filters.Deposit(address, null);
                const withdrawFilter = contractFeeShare.filters.Withdraw(address, null);
                const multiSendFeeFilter = contractFeeShare.filters.FeeDetails(address, null, null, null, null);
                const multiSendTokenFilter = contractFeeShare.filters.MultiSend(address, null)
                const multiSendTokenTx = await contractFeeShare.queryFilter(multiSendTokenFilter, 0, "latest");
                // const multiSendNativeTx = await contractFeeShare.queryFilter(multiSendNativeFilter, 8415257,  latestBlockNumber);
                const withdrawTx = await contractFeeShare.queryFilter(withdrawFilter, 0, "latest");
                const depositTx = await contractFeeShare.queryFilter(depositFilter, 0, "latest");
                const multiSendFeeTx = await contractFeeShare.queryFilter(multiSendFeeFilter, 0, "latest");
                const txHist = [...multiSendTokenTx, ...withdrawTx, ...depositTx, ...multiSendFeeTx].sort((a: any, b: any) => b.blockNumber - a.blockNumber);
                for (let i = 0; i < txHist.length; i++) {
                    const block = await provider.getBlock(txHist[i].blockNumber);
                    const newElem = { id: i + 1, timestamp: block.timestamp, transactionHash: txHist[i].transactionHash, event: txHist[i].event, blockNumber: txHist[i].blockNumber, data: txHist[i].data, txLink: `https://${chain.name.toLowerCase()}.etherscan.io/tx/${txHist[i].transactionHash}` }
                    txArray.push(newElem)
                }
                dispatch(loadTransactionHistory(txArray))
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        if (chain !== undefined && address !== undefined) {
            getTxHistory()
        }
        else {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chain])
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const pageCount = Math.ceil(txHistory.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = txHistory.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <div className='relative overflow-x-auto mt-3'>
            {loading ? <div className="loader-container justify-center flex">
                <div className="spinner"></div>
            </div> :
                <table className="rounded w-full mb-3 text-sm text-left bg-white text-gray-500 dark:text-gray-400">
                    <thead className='text-md rounded-md text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-800'>
                        <tr>
                            <th scope="col" className="px-6 py-3">№</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Transaction name</th>
                            <th scope="col" className="px-6 py-3">Txn Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((tx: any) => {
                            return (
                                <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700"' key={tx.blockNumber}>
                                    <td className='px-6 py-4'>{tx.id}</td>
                                    <td className='px-6 py-4'>{new Date(tx.timestamp * 1000).toLocaleDateString("en-US")}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{tx.event === "FeeDetails" ? "MultiSendFee" : tx.event}</td>
                                    <td className='px-6 py-4'><a className='text-blue-900 hover:underline ' href={`${selectedScanName.url}${tx.transactionHash}`} target="_blank" rel="noreferrer">{`${tx.transactionHash}`.substring(0, 20)}...{`${tx.transactionHash}`.substring(`${tx.transactionHash}`.length - 4)}`{ }</a></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>}
            {txHistory.length === 0 && !loading && <div className='text-center text-gray-500 dark:text-gray-400'>No transactions found</div>}
            <PaginationTxHistory
                currentCountPerPage={itemsPerPage}
                pageCount={pageCount}
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                handleCountPerPage={setItemsPerPage}
            />
        </div>
    )
}
export default TxHistory


