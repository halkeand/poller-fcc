import styled from 'styled-components'
import { T } from '../utils'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 300px;
  min-width: 400px;
  padding: ${T('padding.medium')};
  margin: ${T('margin.medium')};
  box-shadow: ${T('boxShadow')};
  border-radius: ${T('borderRadius')};
  border: 1px solid ${T('colors.gray')};
`

export default Form
