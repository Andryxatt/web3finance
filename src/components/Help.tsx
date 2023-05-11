
const Help = () => {
    return (
        <div className="bg-white mt-5 rounded-md p-8">
            <h2 className="text-2xl font-bold text-center mb-5">About FeeShare Service: </h2>
            <p className="indent-5 text-md mb-3">If you're looking for a service that can help you streamline your cryptocurrency transactions, a multi-send transaction service might be just what you need. With this type of service, you can easily send funds to multiple recipients with just one transaction, saving you time and money on transaction fees. With Multi-Send, you can easily send funds to multiple recipients at once, without having to create separate transactions for each recipient. Multi-Send is particularly useful for businesses or individuals who need to make frequent payments to multiple recipients, such as paying salaries or vendor invoices. By using this service, you can simplify your payment process and reduce the time and effort required to manage multiple transactions.</p>
            <h2 className="text-2xl font-bold text-center mb-5">How to use FeeShare service: </h2>
            <p className="text-lg mb-3">To use FeeShare with payment fee in native token(Ethereum, Matic, BNB, AVAX): </p>
            <div className="mb-3">
                <ol className="list-decimal list-inside pl-5 text-md">
                    <li className="mb-1"> Simply connect your wallet via the «Connect Wallet» button. </li>
                    <li className="mb-1"> Then select the network and coin you want to send from the provided list or enter your token contract address. </li>
                    <li className="mb-1"> Then specify the addresses and amounts of recipients or upload a file with such addresses in CSV / Excel / Txt format. </li>
                    <li className="mb-1"> Click "Next". </li>
                    <li className="mb-1"> You will see a summary of your transaction details (Total number of addresses, Total number of transactions needed, Total number of tokens to be sent, Your token balance, commission fee and transaction fee). At this stage, you can remove unwanted addresses, change the «network speed gwei» parameter. </li>
                    <li className="mb-1"> If everything fits, then click the "Next" button. </li>
                    <li className="mb-1"> Then confirm the transaction and wait for it to be processed. Everything is simple</li>
                </ol>
            </div>

            <div className="mb-3">
                <p className="text-lg mb-3">To use FeeShare with payment fee in token (USDT, USDC …..): </p>
                <ol className="list-decimal list-inside pl-5 text-md">
                    <li className="mb-1">8. Simply connect your wallet via the «Connect Wallet» button. </li>
                    <li className="mb-1">9. Then select the network and coin you want to send from the provided list or enter your token contract address. </li>
                    <li className="mb-1">10. Then specify the addresses and amounts of recipients or upload a file with such addresses in CSV / Excel / Txt format. </li>
                    <li className="mb-1">12. Click "Next".</li>
                    <li className="mb-1">13. You will see a summary of your transaction details (Total number of addresses, Total number of transactions needed, Total number of tokens to be sent, Your token balance, commission fee and transaction fee). At this stage, you can remove unwanted addresses, change the «network speed gwei» parameter. </li>
                    <li className="mb-1">14. If everything fits, then click the "Next" button. </li>
                    <li className="mb-1"> Then confirm the transaction and wait for it to be processed. Everything is simple</li>
                </ol>
            </div>

            <div className="mb-3">
                <h2 className="text-2xl font-bold text-center mb-5">FeeShare service fees:</h2>
                <p className="text-lg mb-3">Currently, the service is supported Ethereum, Polygon, BSC, Arbitrum, Optimism and Avalanche networks.
                    The service commission depends on the number of addresses to which the funds will be sent.</p>
                <ul className="pl-5 text-md">
                    <li className="mb-1">Ethereum - 1$ per address for tokens that are in the list , 0.2 Ethereum for your contracts regardless of the number of addresses.</li>
                    <li className="mb-1">Polygon - 0.1$ per address for tokens that are in the list , 0.2 Matic for your contracts regardless of the number of addresses.</li>
                    <li className="mb-1">BSC - 0.1$ per address for tokens that are in the list , 0.2 BNB for your contracts regardless of the number of addresses.</li>
                    <li className="mb-1">Arbitrum -  0.1$ per address for tokens that are in the list , 0.2 Ethereum for your contracts regardless of the number of addresses.</li>
                    <li className="mb-1">Avalanche -  0.1$ per address for tokens that are in the list , 0.2 AVAX for your contracts regardless of the number of addresses.</li>
                    <li className="mb-1">Optimism - 1$ per address for tokens that are in the list , 0.2 Ethereum for your contracts regardless of the number of addresses.</li>

                </ul>
            </div>

            <span className="italic font-bold text-center">Service commissions are not constant and may change!</span>
        </div>
    )
}
export default Help;