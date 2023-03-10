import { useState } from "react";

const TotalInformation = () => {
    const [total, setTotal] = useState(22333333);
    let timer: any;
    const updateCount = () => {
        timer = !timer && setInterval(() => {
            setTotal(prevCount => prevCount + 0.01);
        }, 20)
    }
    const showPrice = (num: number) => {
        let number = num;
        let decimals = 2
        let decpoint = '.'
        let thousand = ','

        let n = Math.abs(number).toFixed(decimals).split('.')
        n[0] = n[0].split('').reverse().map((c, i, a) =>
            i > 0 && i < a.length && i % 3 === 0 ? c + thousand : c
        ).reverse().join('')
        let final = (Math.sign(number) < 0 ? '-' : '') + n.join(decpoint)
        return final
    }

    updateCount()

    return (
        <div className="lg:justify-center">
            <div className="flex flex-row"><span className="text-gray-600 text-md pt-1">Deposits:</span> <span className="total-usd text-black text-xl font-extrabold ml-10 w-[135px]">{showPrice(total)}</span> <span className="text-black text-xl font-extrabold">USD</span></div>
            <div className="flex flex-row"><span className="text-gray-600 text-md pt-1">FARM Price:</span> <span className="total-usd text-black text-xl font-extrabold ml-4">44.55 USD</span></div>
        </div>
    )
}
export default TotalInformation;