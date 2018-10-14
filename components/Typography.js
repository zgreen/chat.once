import React from 'react'

const HContent = {
  Fallback: ({ children, style }) => <span {...{ style }}>{children}</span>,
  Small: ({ children, style }) => (
    <div>
      <style jsx>{`
        div {
          font-size: 10px;
          font-weight: normal;
        }
      `}</style>
      {children}
    </div>
  ),
  SmallCentered: ({ children }) => (
    <div>
      <style jsx>{`
        div {
          text-align: center;
        }
      `}</style>
      {children}
    </div>
  )
}

export default function Type ({ children, level, type, style }) {
  const contentStyle = style || {}
  const Content = type ? HContent[type] : HContent.Fallback
  switch (level) {
    case 'h2':
      return (
        <h2>
          <Content {...{ children, style: contentStyle }} />
        </h2>
      )
    default:
      return (
        <p>
          <Content {...{ children, style: contentStyle }} />
        </p>
      )
  }
}
Type.defaultProps = {
  style: {},
  type: ''
}
