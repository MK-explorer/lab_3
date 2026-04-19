export default function UserInfo({ user }) {
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="user-info-box">
      <div className="user-avatar">{initials}</div>
      <h3>{user.name}</h3>
      <p className="email">{user.email}</p>
      <p className="member-since">Учасник з: {user.memberSince}</p>
      <hr className="user-info-divider" />
      <div className="user-info-row">
        <span>Логін</span>
        <span>{user.username}</span>
      </div>
      <div className="user-info-row">
        <span>Email</span>
        <span style={{ fontSize: '0.8rem' }}>{user.email}</span>
      </div>
    </div>
  );
}