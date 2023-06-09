## Movie Recommendation Engine
This application is a movie recommendation system built by Mike Gamaroff. 

I opted to use NextJS because it simplifies API management, which I needed to make the appliation a lot more vibrant and interesting, leverage movie posters from a free service called TMDB. 

This allowed me to use the names provided in the movies.json to get posters of every movie listed.

I also did not want to modify the movies.json, as a means to demonstrate my flexibility with varying datasets. 

### About the app

The app's primary function is to recommend movies based on the likes of other users. It finds users who liked the same movies and recommends the most frequently liked movies among these similar users, organized by number of likes.

Key elements:

1. **Data**: The data used in this application comes from a JSON file that contains a list of movies and users, where each user has an array of movie IDs that they like.

2. **State**: There are several state variables used to manage the application's state:
   - `SelectedMovies`: an array that stores the IDs of the movies that the current user has selected.
   - `recommendedMovies`: an array that stores the recommended movies based on the user's selections (which can be multiple).
   - `moviesWithPosters`: an array that stores all the movies with their corresponding posters fetched from the TMDB API.
   - `containerKey`: a number that is incremented every time the recommendations are updated. This forces a rerender of the recommended movie items, triggering their entrance animations.

3. **Fetching Movie Posters**: This is performed by a function called `fetchMovieWithPoster` which takes a movie name and ID, sends a request to the TMDB API to fetch the movie's poster, and returns an object containing the movie's ID, title, poster URL, and a `selected` property indicating whether the movie has been selected by the user or not.

4. **Handling Movie Selection**: The `handleMovieClick` function toggles the selection of a movie. If the clicked movie is already liked, it removes it from the `SelectedMovies` array; if not, it adds it.

5. **Movie Recommendation Logic**: The core of the recommendation logic is in the `getRecommendations` function. Here's how it works:
   - It first finds users who have liked at least one of the same movies as the current selection. These are considered "similar users".
   - It then counts the occurrences of each movie liked by these similar users. If a similar user liked a movie that the current user has not yet selected, it increments the count of this movie in the `recommendations` object.
   - Finally, it sorts the movies by count and returns the top 5. These are the movies most frequently liked by users who share similar taste with the current user.

6. **Updating Recommendations**: The `useEffect` hook that depends on `SelectedMovies` is used to update the recommendations. Every time the user selects or unselects a movie, it triggers this hook, which calls `getRecommendations` to calculate the new recommendations, fetches their details, and sets them to the `recommendedMovies` state. It also increments the `containerKey`, forcing a rerender of the recommendations.

7. **Rendering the UI**: The application renders a list of movies for the user to choose from and a list of recommended movies. When a movie is clicked, it updates the `SelectedMovies` state, triggering the update of recommendations. The recommended movie items have a CSS transition that animates their entrance. Every time the recommendations are updated, the `containerKey` changes, which unmounts and remounts the entire list, resetting the entrance animations.

8. **Hacks**: Because the TMDB API was not finding matches when searching with the dates e.g. (1979), I needed to truncate the name. I noticed there was a consistent pattern in the database where all had the same format with a date in parenthesis at the end of the movie title string. So I used a simple regex function called `truncateString` to get all the text up to the first parenthesis. This cleaned the data and ensured a match on the TMDB API for every movie title.

9. **Responsivity**: This app has been adjsuted to work well on both desktop and mobile. In desktop mode, it provides a long scroller that fits nicely flush across the full width of the page. The recommendations themselves are displayed neatly in tiles that wrap when they get to the end. When the browser shrinks or you enter mobile mode, the recommended movies stack on top of each and neatly full the width of the mobile browser. The movies can be scrolled with swiping on a device, or with the nicely styled scrollbars in desktop.

10. **ENV**: An .env.local is needed with the param TMDB_READ_TOKEN=xxxx which is the read token from TMDB to access the API. I can provide mine for the test.

### Summary

Simply having a text input where a user could type in IDs may have worked, but it would not have been user friendly. The user may not know which movie corresponds to which ID, and they would greatly appreciate not just knowing the movie they are seeking recommendations from, but seeing the movie poster itself.

This is why I felt that we needed a strong UI that leveraged imagery to make it easy and intuitive for the user to get the recommendations they wanted by doing nothing more than choosing the iconic film imagery they known and love.

This exercise demonstrates not only my ability to implement sound programmatic logic utilizing predetermined datasets, but my empathy and understanding for the needs of the user who should never be presented with difficult challenges when navigating their online experiences.
