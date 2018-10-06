// @flow
import Head from 'next/head'
import { appStyles } from '../components/styles'

export default ({ render, children }: { render: Function }) => (
  <div className='app'>
    <style jsx>{appStyles}</style>
    <Head>
      <title>once.chat</title>
    </Head>
    <h1>
      chat
      <span className='dot'>.</span>
      once
    </h1>
    {children}
  </div>
)
