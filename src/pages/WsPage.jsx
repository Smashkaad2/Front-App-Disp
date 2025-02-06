import React from 'react'
import SensorTracker from '../components/SensorTracker'
import LocationPage from './LocationPage'

const WsPage = () => {
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <LocationPage />
    </div>
  )
}

export default WsPage
