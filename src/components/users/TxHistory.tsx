import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'
import contractAddresses from '../../contracts/AddressesContracts.json'
import FeeShareAbi from "../../contracts/FeeShare.json";
const TxHistory = () => {
    const { address } = useAccount()
    const { chain } = useNetwork()
    const [txHistory, setTxHistory] = useState<any>([]);
    const getWithdrawHistory = async () => {
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        const latestBlockNumber = await provider.getBlockNumber();
        const contractFeeShare = new ethers.Contract(contractAddresses[chain.name][0].FeeShare, FeeShareAbi, provider);
        const depositFilter = contractFeeShare.filters.Deposit(address, null);
        console.log(contractFeeShare.filters)

        const withdrawFilter = contractFeeShare.filters.Withdraw(address, null);
        const multiSendFeeFilter = contractFeeShare.filters.FeeDetails(null, null, null, null, null, null, null);
        const multiSendTokenFilter = contractFeeShare.filters.MultiSend(address, null)
        // const multiSendNativeFilter = contractFeeShare.filters.MultiSend(address, null)
        const multiSendTokenTx = await contractFeeShare.queryFilter(multiSendTokenFilter, 8415257, latestBlockNumber);

        // const multiSendNativeTx = await contractFeeShare.queryFilter(multiSendNativeFilter, 8415257,  latestBlockNumber);
        const withdrawTx = await contractFeeShare.queryFilter(withdrawFilter, 8415257, latestBlockNumber);
        const depositTx = await contractFeeShare.queryFilter(depositFilter, 8415257, latestBlockNumber);
        const multiSendFeeTx = await contractFeeShare.queryFilter(multiSendFeeFilter, 8415257, latestBlockNumber);
        console.log(multiSendTokenTx)

        setTxHistory([...multiSendTokenTx, ...withdrawTx, ...depositTx, ...multiSendFeeTx].sort((a: any, b: any) => b.blockNumber - a.blockNumber))
      
    }

    useEffect(() => {
        if (chain !== undefined) {
            getWithdrawHistory()
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, chain])
    return (
        <>
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
            </table>
        </>
    )
}
export default TxHistory