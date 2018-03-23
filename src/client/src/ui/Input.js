import styled from 'styled-components'
import { T } from '../utils'

const Input = styled.input`
  padding: ${T('padding.small')};
  border-radius: ${T('borderRadius')};
  border: 1px solid ${T('colors.gray')};
  margin: ${T('margin.medium')};

  transition: border 0.3s ease-in-out;

  &:focus {
    transition: border 0.3s ease-in-out;
    border: 1px solid ${T('colors.main')};
    outline: 0;
  }
`

export default Input
