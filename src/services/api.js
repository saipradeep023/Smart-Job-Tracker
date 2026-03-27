import axios from 'axios'

// ─── Axios instance for DummyJSON (mock data) ────────────────────────────────
const dummyJsonApi = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10_000,
})

// ─── Public API functions ─────────────────────────────────────────────────────

/**
 * Fetch raw product list from DummyJSON.
 * @param {number} limit - Number of products to fetch (default 20).
 */
export const fetchMockProducts = async (limit = 20) => {
  const { data } = await dummyJsonApi.get(`/products?limit=${limit}`)
  return data.products
}

/**
 * Build a Clearbit logo URL for a given company name.
 * Clears special chars and lowercases the domain guess.
 * @param {string} company - The company name.
 * @returns {string} Clearbit logo URL.
 */
export const getClearbitLogoUrl = (company) => {
  if (!company) return ''
  // Strip common suffixes and whitespace to produce a domain guess
  const domain = company
    .toLowerCase()
    .replace(/\s+(inc|llc|ltd|corp|co|group|technologies|tech|solutions)\.?$/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
  return `https://logo.clearbit.com/${domain}.com`
}

export default dummyJsonApi
