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
        <div className="bg-white flex text-black justify-between align-center px-10 py-5 sm:flex-row">
            <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button>
            <Logo logoName={logoParams.logoName} logoImg={logoParams.logoImg} />
            <div className="self-center text-lg navigation hidden w-full xl:block xl:w-auto" id="navbar-default">
                {links.map((link, index) => <NavigationLink key={index} link={link.link} name={link.name} />)}
            </div>
            <TotalInformation />
            <WalletModal />
        </div>
    )
}
export default TopNavigation;