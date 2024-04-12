import StarRating from "../reusable-components/StarRating";

export default function MovieDescription({
  watchedUserRating,
  isWatched,
  handleAdd,
  movie,
  userRating,
  onSetUserRating,
}) {
  return (
    <section>
      <div className="rating">
        {isWatched ? (
          <p>You've rated this {watchedUserRating} ⭐'s</p>
        ) : (
          <>
            <StarRating
              maxRating={10}
              size={24}
              onSetRating={onSetUserRating}
            />
            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
          </>
        )}
      </div>
      <p>
        <em>{movie.Plot}</em>
      </p>
      <p>Starring {movie.Actors}</p>
      <p>Directed by {movie.Director}</p>
    </section>
  );
}
