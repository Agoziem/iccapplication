import React, { ReactNode, FC } from 'react'

interface OrderLayoutProps {
  children: ReactNode;
}

const OrderLayout: FC<OrderLayoutProps> = ({children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default OrderLayout;