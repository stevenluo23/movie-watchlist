// Stateless component
export default function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>
        <a href={window.location.href}>Movie Watchlist</a>
      </h1>
      <span role="img">🎥</span>
    </div>
  );
}
