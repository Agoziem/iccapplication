import React from 'react'

interface ProductPlaceholderProps {
  width?: number;
  height?: number;
  fontSize?: string;
}

const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({width=68,height=68,fontSize="1.5rem"}) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        width: `${width}px`, // `68px` by default
        height: `${height}px`, // `68px` by default
        borderRadius: "50%",
        backgroundColor: "var(--bgDarkColor)",
        color: "var(--bgDarkerColor)",
        fontSize: fontSize, // `1.5rem` by default
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <i className="bi bi-basket2 mb-0"></i>
    </div>
  )
}

export default ProductPlaceholder