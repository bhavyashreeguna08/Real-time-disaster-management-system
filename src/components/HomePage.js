import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import {
    WiDaySunny,
    WiRain,
    WiSnow,
    WiCloudy,
    WiThunderstorm,
} from "react-icons/wi";
import "../styles/homepage.css";

function HomePage() {
    const [weatherData, setWeatherData] = useState(null);
    const [newsArticles, setNewsArticles] = useState([]);
    const [additionalNews, setAdditionalNews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [additionalVideos, setAdditionalVideos] = useState([]);
    const [selectedCity, setSelectedCity] = useState("Chennai"); // Default location
    const [cities, setCities] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);

    // Fetch Cities List
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch(
                    `${process.env.PUBLIC_URL}/cities.txt`
                );
                const text = await response.text();
                const citiesList = text.split("\n").map((city) => city.trim());
                setCities(citiesList);
            } catch (err) {
                console.error("Error fetching cities list.");
            }
        };
        fetchCities();
    }, []);

    // Fetch News & Videos
    useEffect(() => {
        const fetchNewsAndVideos = async () => {
            try {
                const newsResponse = await axios.get(
                    "http://localhost:5000/api/weather-news/disaster-news"
                );
                setNewsArticles(newsResponse.data.slice(0, 5)); // Main news section
                setAdditionalNews(newsResponse.data.slice(5, 9)); // Additional news section

                const videosResponse = await axios.get(
                    "http://localhost:5000/api/weather-news/disaster-videos"
                );
                setVideos(videosResponse.data.slice(0, 8)); // Main videos
                setAdditionalVideos(videosResponse.data.slice(8, 11)); // Additional videos section
            } catch (err) {
                console.error("Error fetching disaster news or videos.");
            }
        };
        fetchNewsAndVideos();
    }, []);

    // Fetch Weather Data for selected city
    useEffect(() => {
        if (selectedCity) {
            const fetchWeatherData = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/weather-news/weather/${selectedCity}`
                    );
                    setWeatherData(response.data);
                } catch (err) {
                    console.error("Error fetching weather data.");
                }
            };
            fetchWeatherData();
        }
    }, [selectedCity]);

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSearchQuery(city);
        const filtered = cities.filter((city) =>
            city.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setFilteredCities(filtered);
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setSearchQuery(city);
        setFilteredCities([]);
    };

    // Ensure formatTime is inside the component function
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString();
    };

    const getWeatherIcon = (description) => {
        if (description.includes("rain"))
            return <WiRain className="weather-icon" />;
        if (description.includes("clear"))
            return <WiDaySunny className="weather-icon" />;
        if (description.includes("cloud"))
            return <WiCloudy className="weather-icon" />;
        if (description.includes("snow"))
            return <WiSnow className="weather-icon" />;
        if (description.includes("thunderstorm"))
            return <WiThunderstorm className="weather-icon" />;
        return <WiCloudy className="weather-icon" />;
    };

    return (
        <Container>
            <h2 className="disaster-heading">🌍 Disaster Management</h2>
            <Row>
                {/* Left Side - Main News and Videos */}
                <Col md={8}>
                    <Card className="homepage-card">
                        <Card.Body>
                            <h4>Latest News & Videos</h4>
                            <Row>
                                <Col md={6} className="news-section">
                                    {newsArticles.map((article, index) => (
                                        <Card key={index} className="news-card">
                                            {article.urlToImage && (
                                                <Card.Img
                                                    variant="top"
                                                    src={article.urlToImage}
                                                    alt={article.title}
                                                    className="news-image"
                                                />
                                            )}
                                            <Card.Body>
                                                <Card.Title>
                                                    {article.title}
                                                </Card.Title>
                                                <Card.Text>
                                                    {article.description}
                                                </Card.Text>
                                                <Button
                                                    variant="primary"
                                                    href={article.url}
                                                    target="_blank"
                                                >
                                                    Read More
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </Col>

                                <Col md={6} className="video-section">
                                    {videos.map((video, index) => (
                                        <Card
                                            key={index}
                                            className="video-card"
                                        >
                                            <Card.Body>
                                                <Card.Title>
                                                    {video.snippet.title}
                                                </Card.Title>
                                                <iframe
                                                    width="100%"
                                                    height="200"
                                                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                                    title={video.snippet.title}
                                                    frameBorder="0"
                                                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Side - Weather + Different News Below It */}
                <Col md={4}>
                    {/* Weather Section */}
                    <Card className="homepage-card weather-card">
                        <Card.Body>
                            <Card.Title>☀️ Weather Data</Card.Title>
                            <Form>
                                <Form.Group controlId="formCity">
                                    <Form.Label>
                                        🌎 Select or Type a City
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search city"
                                        value={searchQuery}
                                        onChange={handleCityChange}
                                    />
                                    {filteredCities.length > 0 && (
                                        <ul className="city-list">
                                            {filteredCities.map(
                                                (city, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() =>
                                                            handleCitySelect(
                                                                city
                                                            )
                                                        }
                                                        className="city-item"
                                                    >
                                                        {city}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </Form.Group>
                            </Form>

                            {weatherData ? (
                                <div className="weather-info">
                                    {getWeatherIcon(
                                        weatherData.weather[0].description
                                    )}
                                    <h5>{weatherData.name}</h5>
                                    <p>{weatherData.weather[0].description}</p>
                                    <p>
                                        🌡️ Temperature: {weatherData.main.temp}
                                        °C
                                    </p>
                                    <p>
                                        🤒 Feels Like:{" "}
                                        {weatherData.main.feels_like}°C
                                    </p>
                                    <p>
                                        🔻 Min Temp: {weatherData.main.temp_min}
                                        °C | 🔺 Max Temp:{" "}
                                        {weatherData.main.temp_max}°C
                                    </p>
                                    <p>
                                        💧 Humidity: {weatherData.main.humidity}
                                        %
                                    </p>
                                    <p>
                                        🌅 Sunrise:{" "}
                                        {formatTime(weatherData.sys.sunrise)}
                                    </p>
                                    <p>
                                        🌇 Sunset:{" "}
                                        {formatTime(weatherData.sys.sunset)}
                                    </p>
                                </div>
                            ) : (
                                <p>Select a city to get weather information.</p>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Additional News Below Weather */}
                    <Card className="homepage-card extra-news-video">
                        <Card.Body>
                            {additionalNews.map((article, index) => (
                                <Card key={index} className="news-card-small">
                                    {article.urlToImage && (
                                        <Card.Img
                                            variant="top"
                                            src={article.urlToImage}
                                            alt={article.title}
                                            className="news-image-small"
                                        />
                                    )}
                                    <Card.Body>
                                        <Card.Title>{article.title}</Card.Title>
                                        <Button
                                            variant="link"
                                            href={article.url}
                                            target="_blank"
                                        >
                                            Read More
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>

                    <Card className="homepage-card extra-news-video">
                        <Card.Body>
                            {additionalVideos.map((video, index) => (
                                <Card key={index} className="video-card-small">
                                    <Card.Body>
                                        <Card.Title>
                                            {video.snippet.title}
                                        </Card.Title>
                                        <iframe
                                            width="100%"
                                            height="150"
                                            src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                            title={video.snippet.title}
                                            frameBorder="0"
                                            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
