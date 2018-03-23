import styled, { injectGlobal } from 'styled-components'
import { T } from '../utils'
const Layout = styled.section`
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

injectGlobal`
  body {
    font-family: 'Roboto Mono', sans-serif;
  }
`
export default Layout
