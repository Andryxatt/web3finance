import Logo from "./Logo";
import NavigationLink from "./NavigationLink";
import TotalInformation from "./TotalInformation";
import WalletModal from "./WalletModal";

const TopNavigation = () => {
    const links = [
        {
            name: 'Assets',
            link: '/assets'
        },
        {
            name: 'Stats',
            link: '/stats'
        },
        {
            name: 'Help',
            link: '/help'
        }]
    const logoParams = { logoName: "Finance", logoImg: "logo512.png" }
    return (
        <div className="bg-white flex text-black justify-between align-center px-10 py-5 ">
            <Logo logoName={logoParams.logoName} logoImg={logoParams.logoImg} />
            <div className="self-center text-lg navigation">
                {links.map((link, index) => <NavigationLink key={index} link={link.link} name={link.name} />)}
            </div>
            <TotalInformation />
            <WalletModal/>
        </div>
    )
}
export default TopNavigation;