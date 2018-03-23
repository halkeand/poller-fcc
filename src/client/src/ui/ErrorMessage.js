import React from 'react'
import styled, { keyframes } from 'styled-components'
import { T } from '../utils'

const fadeIn = keyframes`
    from {
      opacity: 0;
    }
  
    to {
      opacity: 1;
    }
  
  `
const Error = styled.p`
  color: white;
  text-align: center;
  padding: ${T('padding.medium')};
  background-color: ${T('colors.warning')};
  animation: ${fadeIn} 1s ease-in-out;
  border-radius: ${T('borderRadius')};
`

export default ({ errors, type, message = undefined }) =>
  errors && errors[type] ? <Error>{message || errors[type]}</Error> : null
