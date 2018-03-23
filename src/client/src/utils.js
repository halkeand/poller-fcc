import { path } from 'ramda'
export const T = objPath => path(['theme', ...objPath.split('.')])
