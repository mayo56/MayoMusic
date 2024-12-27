import React from 'react'

interface Child {
  children: React.ReactNode
}

const Title = ({ children }: Child): React.JSX.Element => {
  return <h2>{children}</h2>
}

export default Title
