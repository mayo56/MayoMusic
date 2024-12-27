import React from 'react'

interface Child {
  children: React.ReactNode
}

const Description = ({ children }: Child): React.JSX.Element => {
  return <p>{children}</p>
}

export default Description
