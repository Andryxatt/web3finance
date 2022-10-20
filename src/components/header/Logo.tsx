import { Link } from "react-router-dom";

const Logo = (logoParams:{logoImg: string, logoName: string}) => {
    return (
        <Link className="flex items-center self-start" to="/">
            <img className="w-10 h-10 mr-5" alt={logoParams.logoName} src={logoParams.logoImg} /><h3 className="text-3xl font-extrabold lg:hidden">{logoParams.logoName}</h3>
        </Link>
    )
}
export default Logo;