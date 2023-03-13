import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import contractAddresses from '../../contracts/AddressesContracts.json'
import FeeShareAbi from "../../contracts/FeeShare.json";
import { loadTransactionHistory, allTransactions } from '../../store/user/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import  PaginationTxHistory  from './PaginationTxHistory';
const TxHistory = () => {
    const dispatch = useAppDispatch();
    const txHistory = useAppSelector(allTransactions)
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [loading, setLoading] = useState(true);
    const infuraApiKey = process.env.REACT_APP_INFURA_KEY;
    const getTxHistory = async () => {
        const txArray = [];
        let provider = undefined;
        switch (chain.id) {
            case 5:
            provider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${infuraApiKey}`);
            break;
            case 97:
            provider = new ethers.providers.JsonRpcProvider(`https://bsc.getblock.io/27578ce8-1ff1-4602-bbf2-127f8edcfc9f/testnet/`);
            break;
            case 80001:
            provider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${infuraApiKey}`);
            break;
            default:
                break;
        }  
        const contractFeeShare = new ethers.Contract(contractAddresses[chain.name][0].FeeShare, FeeShareAbi, provider);
        const depositFilter = contractFeeShare.filters.Deposit(address, null);
        const withdrawFilter = contractFeeShare.filters.Withdraw(address, null);
        const multiSendFeeFilter = contractFeeShare.filters.FeeDetails(address, null, null, null, null);
        const multiSendTokenFilter = contractFeeShare.filters.MultiSend(address, null)
        const multiSendTokenTx = await contractFeeShare.queryFilter(multiSendTokenFilter);

        // const multiSendNativeTx = await contractFeeShare.queryFilter(multiSendNativeFilter, 8415257,  latestBlockNumber);
        const withdrawTx = await contractFeeShare.queryFilter(withdrawFilter);
        const depositTx = await contractFeeShare.queryFilter(depositFilter);
        const multiSendFeeTx = await contractFeeShare.queryFilter(multiSendFeeFilter);

        const txHist = [...multiSendTokenTx, ...withdrawTx, ...depositTx, ...multiSendFeeTx].sort((a: any, b: any) => b.blockNumber - a.blockNumber);
        for (let i = 0; i < txHist.length; i++) {
            const block = await provider.getBlock(txHist[i].blockNumber);
            const newElem = { timestamp: block.timestamp, transactionHash: txHist[i].transactionHash, event: txHist[i].event, blockNumber: txHist[i].blockNumber, data: txHist[i].data }
            txArray.push(newElem)
        }
        dispatch(loadTransactionHistory(txArray))
        setLoading(false)
    }
    useEffect(() => {
        if (chain !== undefined && address !== undefined && txHistory.length === 0) {
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
        <div className='relative overflow-x-auto p-3'>
            {loading ? <div className="loader-container justify-center flex">
                <div className="spinner"></div>
            </div> :
                <table className="w-full mb-3 text-sm text-left bg-white text-gray-500 dark:text-gray-400 rounded-md">
                    <thead className='text-md rounded-md text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-800'>
                        <tr>
                            <th scope="col" className="px-6 py-3">Transaction name</th>
                            <th scope="col" className="px-6 py-3">Txn Hash</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((tx: any) => {
                            return (
                                <tr className='class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"' key={tx.blockNumber}>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{tx.event === "FeeDetails" ? "MultiSendFee": tx.event}</td>
                                    <td className='class="px-6 py-4"'><a className='text-blue-900 hover:underline ' href={`https://goerli.etherscan.io/tx/${tx.transactionHash}`} target="_blank" rel="noreferrer">{`${tx.transactionHash}`.substring(0, 20)}...{`${tx.transactionHash}`.substring(`${tx.transactionHash}`.length - 4)}`{ }</a></td>
                                    <td className='class="px-6 py-4"'>{new Date(tx.timestamp * 1000).toLocaleDateString("en-US")}</td>
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


