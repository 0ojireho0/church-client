// components/Footer.jsx
import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-white text-white text-center p-4">
      <p className='text-black'>&copy; {new Date().getFullYear()} Copyright: ChurchConnect.</p>
    </footer>
  )
}
