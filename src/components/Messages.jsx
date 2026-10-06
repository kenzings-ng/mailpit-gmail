import React from 'react'
import Message from './Message'

const Messages = ({ messages, selected, onToggle }) => {
  return (
    <div>
      {
        messages.map((email) => <Message key={email.ID} email={email} checked={selected.has(email.ID)} onToggle={onToggle} />)
      }
    </div>
  )
}

export default Messages
