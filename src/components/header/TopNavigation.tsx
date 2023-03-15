
import React from "react";
import Logo from "./Logo";
import NavigationLink from "./NavigationLink";
// import TotalInformation from "./TotalInformation";
import WalletModal from "./WalletModal";

const TopNavigation = () => {
    const links = [
        {
            name: 'Main',
            link: '/'
        },
        {
            name: 'User History',
            link: '/stats'
        },
        {
            name: 'Help',
            link: '/help'
        }]
    const logoParams = { logoName: "Finance", logoImg: "logo512.png" }
    const [hidden, setHidden] = React.useState(false);
    const showModal = () => {
        console.log("Show modal")
       setHidden(!hidden);
    }

    return (
        <nav className="bg-white flex text-black align-center h-full sm:flex-row p-4">
            <div className="container flex flex-wrap justify-between lg:justify-start mx-auto lg:flex-col ">
                <div className="flex lg:flex-row lg:justify-start">
                    <button onClick={showModal} type="button" className="hidden sm:inline-flex items-center text-sm text-gray-500 lg:block rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </button>
                    <Logo logoName={logoParams.logoName} logoImg={logoParams.logoImg} />
                </div>
                <div className="flex justify-between h-auto lg:mt-4 md:self-start">
                    <div className={`${hidden ? "hidden":"block"} self-center xl:flex-row text-lg navigation sm:w-[350px] sm:h-[100%] sm:self-end sm:mr-auto sm:bg-gray-800 sm:fixed z-10 sm:left-0 sm:top-0`} id="navbar-default">
                        <button onClick={showModal} type="button" id="button-close-nav" className="hidden sm:block sm:mr-auto ml-auto mr-10 mt-5 sm:text-white xs:mr-auto xs:text:wh md:text-white z-11">X</button>
                        <ul className="flex flex-row md:flex-col p-2">
                            {links.map((link, index) => <NavigationLink key={index} link={link.link} name={link.name} />)}
                        </ul>
                    
                    </div>
                  
                </div>

                <WalletModal />
            </div>
        </nav>
    )
}
export default TopNavigation;