import { NavLink } from "react-router-dom";

const NavigationLink = (link: { name: string, link: string }) => {
    return (
        <NavLink className={({ isActive }) => (isActive ? 'active mr-10 font-extrabold' : 'inactive mr-10 font-extrabold')} to={link.link} >{link.name}</NavLink>
    )
}
export default NavigationLink;  