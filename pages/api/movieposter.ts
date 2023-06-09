import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

// Define types for the TMDB API response
interface TMDBMovie {
  poster_path: string;
}

interface TMDBResponse {
  results: TMDBMovie[];
}

// Define the API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the movie name from the query parameters
  const { movieName } = req.query;

  // Construct the URL and options for the TMDB API request

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    movieName as string
  )}&include_adult=false&language=en-US&page=1`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
    },
  };

  try {
    // Make the API request
    const response = await fetch(url, options);
    const tmdbRes: TMDBResponse = (await response.json()) as TMDBResponse;

    // If no movie was found, return a 404 status
    if (tmdbRes.results.length === 0) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }

    // Get the poster path of the first movie in the results
    const posterPath = tmdbRes.results[0].poster_path;

    // Construct the full image URL
    const imageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;

    // Return the image URL
    res.status(200).json({ imageUrl });
  } catch (error) {
    // If the API request failed, return a 500 status
    res.status(500).json({ message: "Error fetching movie data" });
  }
}
