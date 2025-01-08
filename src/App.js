import { useEffect, useState } from "react";

const KEY = ""; // API key for OMDB API (You can move this to an environment variable)

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("batman"); // 1. Create a new state 'query' with default value "batman"
  
  // useEffect hook to fetch data when the query changes
  // useEffect(() => {
  //   const controller = new AbortController();
  //   fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
  //     signal: controller.signal,
  //   }) // 2. Use 'query' in the API URL
  //     .then((res) => res.json())
  //     .then((data) => data.Response === "True" && setMovies(data.Search))
  //     .catch((err) => console.log(err));
  //   return () => controller.abort;
  // }, [query]); // Re-run the effect every time the query changes

  useEffect(() => {
    const controller = new AbortController();
    const fetchMovies = async() => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {
            signal: controller.signal,
          }
        );
        const data = await response.json();
        if (data.Response === "True"){
          setMovies(data.Search);
        }
      } catch (error){
        console.error("Fetch error:", error.message);
      }
    };
    fetchMovies();
    return () => {
      controller.abort();
    }
  }, [query])

  return (
    <div>
      <h1>Movies</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={query} // 3. Set value to 'query' to make it a controlled input
        onChange={(e) => setQuery(e.target.value)} // 3. Update the 'query' state on user input
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
        {movies.map((movie) => (
            <tr key={movie.imdbID}>
              <td>{movie.Title}</td>
              <td>{movie.Year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
