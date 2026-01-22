export const useFormat = () => {
    const formatNumber = (num: number) => Math.floor(num).toLocaleString()

    const formatMoney = (amount: number) => {
        const val = Math.floor(amount)
        const g = Math.floor(val / 10000)
        const s = Math.floor((val % 10000) / 100)
        const c = Math.floor(val % 100)
        return { g, s, c }
    }

    return { formatNumber, formatMoney }
}