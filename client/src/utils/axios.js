import { default as a } from 'axios'

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export const axios = a.create({ baseURL })