import React from 'react'
import './listHeader.css'

export default function ListHeader({ listName}) {
  
  const signOut = ()=>{
    console.log('Sign Out');
  }
  
  return (
    <div className='list-header'>
      <h1>🌿🌈{listName}🌈🌿</h1>

      <div className="button-container">
        <button className='create'>Add New</button>
        <button className='signout'
        onClick={signOut}
        >Sign Out</button>
      </div>
    </div>
  )
}
