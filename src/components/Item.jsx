import React from 'react'

export const Item = ({name, price, description}) => {
  return (
    <div>
        <h2>{name}</h2>
        <p>{description}</p>
        <p>{price}</p>
    </div>
  )
}
