import SocialNetworks from "../SocialNetworks";
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
    const showModal = () =>{
        let elem = document.getElementById("navbar-default");
            elem.classList.toggle("lg:hidden");
        
    }  
    
    return (
        <nav className="bg-white flex text-black align-center sm:flex-row p-4">
            <div className=" container flex flex-wrap justify-between lg:justify-start mx-auto lg:flex-col">
                <div className="flex lg:flex-row lg:justify-start">
                    <button onClick={showModal} type="button" className="inline-flex items-center text-sm text-gray-500 lg:block rounded-lg 2xl:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                    <Logo logoName={logoParams.logoName} logoImg={logoParams.logoImg} />


                </div>
                <div className="flex lg:justify-between lg:mt-4 lg:self-center">
                    <div className="self-center xl:flex-row text-lg navigation lg:bg-slate-700 lg:hidden xl:block lg:w-[350px] lg:absolute lg:left-0 lg:top-0 lg:z-1 lg:h-full" id="navbar-default">
                        <button onClick={showModal} id="button-close-nav" className="hidden lg:block">x</button>
                        <ul className="flex-row">
                            {links.map((link, index) => <NavigationLink key={index} link={link.link} name={link.name} />)}
                        </ul>
                        <SocialNetworks class={"hidden lg:flex"} />
                    </div>
                    <TotalInformation />
                </div>

                <WalletModal />
            </div>
        </nav>
    )
}
export default TopNavigation;