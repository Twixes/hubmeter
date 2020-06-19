import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './rootReducer'
import Header from '../components/Header'
import Main from '../components/Main'
import Footer from '../components/Footer'

export default function App(): JSX.Element {
  const dispatch = useDispatch()

  const { currentLogin } = useSelector(
    (state: RootState) => state.eventsDisplay
  )

  return (
    <>
      <Header/>
      <Main/>
      <Footer/>
    </>
  )
}
