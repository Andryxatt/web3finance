function WalletNetwork({ name, icon, switchNetwork, isActive }: any) {
  return (
    <div className={`${isActive ? "active-network" : ""} network_wrapper`}  onClick={(e) => { e.preventDefault(); switchNetwork(e) }}>
      <img src={icon} alt={name}/>
      <span>{name}</span>
    </div>
  )
}
export default WalletNetwork;