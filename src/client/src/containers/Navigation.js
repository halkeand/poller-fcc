import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import Context from '../Context'
import { Subscribe } from 'unstated'
import { T } from '../utils'
const Nav = styled.ul`
  margin: 0;
  padding: 0;
  width: 700px;
  display: flex;
  flex-direction: row;
  padding: ${T('padding.large')};
  justify-content: space-around;
`

const NavItem = styled(NavLink)`
  text-decoration: none;
  padding: ${T('padding.medium')};
  font-weight: ${p => (p.isActive ? 700 : 400)};

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`

const ButtonNavItem = styled(NavItem)`
  background-color: ${T('colors.main')};
  color: white;
`
export default () => (
  <Subscribe to={[Context]}>
    {({ state: { isAuthenticated }, _logout }) => (
      <Nav>
        <NavItem to="/">Home</NavItem>
        {isAuthenticated && <NavItem to="/mypolls">My Polls</NavItem>}
        {isAuthenticated ? (
          <ButtonNavItem to="/" onClick={_logout}>
            Logout
          </ButtonNavItem>
        ) : (
          <ButtonNavItem to="/signin">Sign in</ButtonNavItem>
        )}
      </Nav>
    )}
  </Subscribe>
)
