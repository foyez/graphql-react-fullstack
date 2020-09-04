import React from 'react'
import { NavBar } from './NavBar'

export const Layout: React.FC = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
)
