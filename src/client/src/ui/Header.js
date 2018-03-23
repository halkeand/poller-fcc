import React from 'react'

import styled from 'styled-components'
import { T } from '../utils'
const Header = styled.header`
  width: 100%;
  background-color: ${T('colors.main')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: white;
  border-bottom: 2px solid white;
  box-shadow: ${T('boxShadow')};
`

export default () => (
  <Header>
    <h1>Poller</h1>
  </Header>
)
