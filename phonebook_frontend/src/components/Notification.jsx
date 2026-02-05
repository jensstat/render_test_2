const Notification = ({ notification }) => {
  if (!notification) return null
  console.log(notification)
  const notificationStyle = {
    color: notification.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={notificationStyle}>{notification.message}</div>

  )
}

export default Notification