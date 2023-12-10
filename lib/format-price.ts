export function formatPrice(
    price: number | string,
    options: {
      currency?: 'USD' | 'EUR' | 'MYR' | 'SGD',
      notation?: Intl.NumberFormatOptions['notation']
    } = {}
  ){
    const { currency = 'USD', notation = 'compact' } = options
  
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price
  
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation,
      maximumFractionDigits: 2 // 2 decimal places
    }).format(numericPrice)
  }

  export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: "USD",
  })