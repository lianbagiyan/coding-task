import Movie from './Movie'
import {memo} from 'react'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer }) => {

    return (
        <div data-testid="movies" className="movies-container">
            {movies.movies?.map((movie) => {
                return (
                    <Movie 
                        movie={movie} 
                        key={movie.id}
                        viewTrailer={viewTrailer}
                    />
                )
            })}
        </div>
    )
}

export default memo(Movies)
