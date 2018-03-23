import styled, { keyframes } from 'styled-components'
import { T } from '../utils'

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`

const Loader = styled.button`

    border: 1px solid ${T('colors.gray')}; /* Light grey */
    border-top: 1px solid ${T('colors.main')}; /* Blue */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: ${spin} 2s ease-in-out infinite;
}
`

export default Loader
