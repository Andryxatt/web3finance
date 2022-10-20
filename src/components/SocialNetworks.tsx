import twitter from '../images/twitter.svg'
import discord from '../images/discord.svg'
import facebook from '../images/facebook.svg'
import telegram from '../images/telegram.svg'
import medium from '../images/medium.svg'
import reddit from '../images/reddit.svg'
const SocialNetworks = (props:any) => {
    const icons = [
        {
            name: 'facebook',
            icon: facebook,
        },
        {
            name: 'discord',
            icon: discord
        },
        {
            name: 'twitter',
            icon: twitter,
        },
        {
            name: 'telegram',
            icon: telegram,
        },
        {
            name: 'medium',
            icon: medium
        },
        {
            name: 'reddit',
            icon: reddit
        }

    ]
    return(
        // "flex flex-col right-5 fixed"
        <div className={props.class}>
            {
                icons.map((icon: any) => {
                    return (
                        <div key={icon.name} className="flex cursor-pointer">
                           <img className="w-full h-full" src={icon.icon} alt="icon" />
                        </div>
                    )
                }
            )}
        </div>
    )
}
export default SocialNetworks;