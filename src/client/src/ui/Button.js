import styled from 'styled-components'
import { T } from '../utils'
import { Link } from 'react-router-dom'

const Button = styled.button`
  color: ${p => (p.revertColors ? T('colors.main') : 'white')};
  text-align: center;
  text-decoration: none;
  border: none;
  padding: ${T('padding.medium')};
  margin: ${T('margin.medium')};
  background-color: ${p =>
    p.warning
      ? T('colors.warning')
      : p.revertColors ? 'white' : T('colors.main')};
  box-shadow: ${T('boxShadow')};
  border-radius: ${T('borderRadius')};
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
  outline: none;
  &:hover {
    transition: box-shadow 0.3s ease-in-out;
    box-shadow: none;
  }
`

export const ButtonLink = Button.withComponent(Link)

export default Button
