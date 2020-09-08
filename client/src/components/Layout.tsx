import { NavBar } from './NavBar'

export const Layout: React.FC = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
)
