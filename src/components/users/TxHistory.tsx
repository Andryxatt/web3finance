import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import contractAddresses from '../../contracts/AddressesContracts.json'
import FeeShareAbi from "../../contracts/FeeShare.json";
const TxHistory = () => {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [txHistory, setTxHistory] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const getWithdrawHistory = async () => {
         const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        // const latestBlockNumber = await provider.getBlockNumber();
        const contractFeeShare = new ethers.Contract(contractAddresses[chain.name][0].FeeShare, FeeShareAbi, provider);
        console.log(contractFeeShare)
        // const filter = {
        //     address: contractAddresses[chain.name][0].FeeShare,
        //     topics: [ethers.utils.id('multiSend(address,uint256[])')]
        //   };
        //   const events = await provider.getLogs(filter);
        //   console.log(events)
        // const filteredEvents = events.map(event => console.log(event));
        const depositFilter = contractFeeShare.filters.Deposit(address, null);
        const withdrawFilter = contractFeeShare.filters.Withdraw(address, null);
        const multiSendFeeFilter = contractFeeShare.filters.FeeDetails(null, null, null, null, null, null, null);
        const multiSendTokenFilter = contractFeeShare.filters.MultiSend(address, null)
        // const multiSendNativeFilter = contractFeeShare.filters.MultiSend(address, null)
        const multiSendTokenTx = await contractFeeShare.queryFilter(multiSendTokenFilter);

        // const multiSendNativeTx = await contractFeeShare.queryFilter(multiSendNativeFilter, 8415257,  latestBlockNumber);
        const withdrawTx = await contractFeeShare.queryFilter(withdrawFilter);
        const depositTx = await contractFeeShare.queryFilter(depositFilter);
        const multiSendFeeTx = await contractFeeShare.queryFilter(multiSendFeeFilter);
        console.log(multiSendTokenTx)

        setTxHistory([...multiSendTokenTx, ...withdrawTx, ...depositTx, ...multiSendFeeTx].sort((a: any, b: any) => b.blockNumber - a.blockNumber))
        setLoading(false)
    }

    useEffect(() => {
        if (chain !== undefined && address !== undefined) {
            getWithdrawHistory()
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chain])
    return (
        <>
         {loading ? <div className="loader-container justify-center flex">
                    <div className="spinner"></div>
                </div> :
            <table className="table-auto">
                <thead>
                    <tr>
                        <th>Transaction name</th>
                        <th>Txn Hash</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {txHistory.map((tx: any) => {
                        return (
                            <tr key={tx.blockNumber}>
                                <td>{tx.event}</td>
                                <td><a className='text-blue-900 hover:underline ' href={`https://goerli.etherscan.io/tx/${tx.transactionHash}`} target="_blank" rel="noreferrer">{`${tx.transactionHash}`.substring(0, 20)}...{`${tx.transactionHash}`.substring(`${tx.transactionHash}`.length - 4)}`{}</a></td>
                                <td>{tx.blockNumber}</td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>}
        </>
    )
}
export default TxHistory