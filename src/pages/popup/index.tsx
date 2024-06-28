import React, { useEffect } from 'react'
import { getTemp } from '../utils'
import './index.scss'

export default ()=>{
  useEffect(()=>{
    getTemp()
  },[])
  return <div className='dac-popup'>
    我是popup
  </div>
}