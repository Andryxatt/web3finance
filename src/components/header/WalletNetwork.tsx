function WalletNetwork({ name, icon, switchNetwork }: any) {
  return (
    <div className="network_wrapper" onClick={(e) => { switchNetwork(e) }}>
      <img src={icon} alt={name}/>
      <span>{name}</span>
    </div>
  )
}
export default WalletNetwork;