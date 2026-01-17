import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../api/movieService";
import Background from "../components/Background";

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllMovies()
            .then((res) => {
                setMovies(res.token);
                setLoading(false);
            })
            .catch(() => {
                alert("Session expired, please login again");
                localStorage.removeItem("token");
                navigate("/login");
            });
    }, []);

    const handlePlay = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <Background />
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your movies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Background />

            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="logo-icon">🎬</div>
                        <h1>StreamFlix</h1>
                    </div>
                    <nav className="nav-menu">
                        <button className="nav-btn active">Movies</button>
                        <button className="nav-btn">Series</button>
                        <button className="nav-btn">Watchlist</button>
                        <button
                            className="nav-btn logout"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="content-wrapper">
                    {/* Featured Movie Banner */}
                    {movies.length > 0 && movies[0].thumbnailUrl && (
                        <section className="featured-section">
                            <div
                                className="featured-background"
                                style={{
                                    backgroundImage: `url(${movies[0].thumbnailUrl.startsWith('http') ? movies[0].thumbnailUrl : `http://ec2-13-234-67-86.ap-south-1.compute.amazonaws.com:8080${movies[0].thumbnailUrl}`})`
                                }}
                            >
                                <div className="featured-overlay"></div>
                                <div className="featured-content">
                                    <div className="featured-badge">⭐ Featured Movie</div>
                                    <h1 className="featured-title">{movies[0].title}</h1>
                                    <p className="featured-description">
                                        {movies[0].description?.length > 150
                                            ? movies[0].description.substring(0, 150) + "..."
                                            : movies[0].description
                                        }
                                    </p>
                                    <div className="featured-meta">
                                        <span className="meta-item">
                                            <span className="meta-icon">⏱️</span>
                                            {movies[0].duration ? `${Math.floor(movies[0].duration / 3600)}h ${Math.floor((movies[0].duration % 3600) / 60)}m` : 'N/A'}
                                        </span>
                                        <span className="meta-item">
                                            <span className="meta-icon">🎬</span>
                                            Movie
                                        </span>
                                    </div>
                                    <div className="featured-actions">
                                        <button
                                            className="featured-play-btn"
                                            onClick={() => handlePlay(movies[0].id)}
                                        >
                                            <span className="play-icon">▶</span>
                                            Watch Now
                                        </button>
                                        <button className="featured-info-btn">
                                            <span className="info-icon">ℹ️</span>
                                            More Info
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="hero-section">
                        <h2 className="section-title">🎯 All Movies</h2>
                        <p className="section-subtitle">Discover amazing content curated just for you</p>
                    </section>

                    <section className="movies-section">
                        {movies.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">🎭</div>
                                <h3>No movies available</h3>
                                <p>Check back later for new content</p>
                            </div>
                        ) : (
                            <div className="movies-grid">
                                {movies.map((movie, index) => (
                                    <div
                                        key={movie.id}
                                        className="movie-card"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="movie-poster">
                                            {movie.thumbnailUrl ? (
                                                <img
                                                    src={movie.thumbnailUrl.startsWith('http') ? movie.thumbnailUrl : `http://localhost:8080${movie.thumbnailUrl}`}
                                                    alt={movie.title}
                                                    className="movie-thumbnail"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="poster-placeholder" style={{ display: movie.thumbnailUrl ? 'none' : 'flex' }}>
                                                <span className="movie-icon">🎬</span>
                                            </div>
                                            <div className="movie-overlay">
                                                <button
                                                    className="play-btn"
                                                    onClick={() => handlePlay(movie.id)}
                                                >
                                                    <span className="play-icon">▶</span>
                                                    Play Now
                                                </button>
                                            </div>
                                        </div>

                                        <div className="movie-info">
                                            <div className="movie-meta">
                                                <span className="movie-duration">
                                                    <span className="duration-icon">⏱️</span>
                                                    {movie.duration ? `${Math.floor(movie.duration / 3600)}h ${Math.floor((movie.duration % 3600) / 60)}m` : 'N/A'}
                                                </span>
                                            </div>
                                            <h3 className="movie-title">{movie.title}</h3>
                                            <p className="movie-description">
                                                {movie.description?.length > 100
                                                    ? movie.description.substring(0, 100) + "..."
                                                    : movie.description
                                                }
                                            </p>

                                            <div className="movie-actions">
                                                <button
                                                    className="action-btn primary"
                                                    onClick={() => handlePlay(movie.id)}
                                                >
                                                    <span className="btn-icon">▶</span>
                                                    Watch Now
                                                </button>
                                                <button className="action-btn secondary">
                                                    <span className="btn-icon">❤️</span>
                                                    Favorite
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default MovieList;
