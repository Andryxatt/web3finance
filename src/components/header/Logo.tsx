import { Link } from "react-router-dom";

const Logo = (logoParams:{logoImg: string, logoName: string}) => {
    return (
        <Link className="flex justify-center items-center" to="/">
            <img className="w-10 h-10 mr-5" alt={logoParams.logoName} src={logoParams.logoImg} /><h3 className="text-3xl font-extrabold">{logoParams.logoName}</h3>
        </Link>
    )
}
export default Logo;