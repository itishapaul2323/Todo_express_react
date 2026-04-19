function UsernameForm({ username, password, setPassword, setUsername }) {
  return (
    <>
      <div className="auth-fields">
        <div className="username">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="password-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default UsernameForm;
