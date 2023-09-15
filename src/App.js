import {useEffect, useState, useRef, useCallback} from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import './app.scss'
import Modal from "./components/Modal";
import {Portal} from "./components/Portal";
import useInfiniteScroll from "./hooks/useInfiniteScroll";

const App = () => {

  const state = useSelector((state) => state)
  const { movies } = state  
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState()
  const [isOpen, setOpen] = useState(false)
  const navigate = useNavigate()

  const pageNumber = useRef(1);
  const loadNewMovies = useCallback(() => {
    pageNumber.current++;
    dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${pageNumber.current}`));
  }, [dispatch]);

  const { observe } = useInfiniteScroll(loadNewMovies);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = () => {
    if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+searchQuery))
    } else {
        dispatch(fetchMovies(ENDPOINT_DISCOVER))
    }
  }

  const getMovie = useCallback(async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find((vid) => vid.type === 'Trailer');
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  }, [setVideoKey]);

  const viewTrailer = useCallback((movie) => {
    getMovie(movie.id);
    if (!videoKey) setOpen(true);
  }, [getMovie, videoKey]);

  useEffect(() => {
    const lastWrapper = document.querySelector(".wrapper:last-child");

    if (lastWrapper) {
      observe(lastWrapper);
    }
  }, [observe]);

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <div className="App">
      {
        isOpen
            ? videoKey && (
            <Portal>
              <Modal videoKey={videoKey} closeModal={closeModal} />
            </Portal>
        )
            : null
      }
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
