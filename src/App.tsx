import React, { useState, useEffect, JSX } from "react";
import axios from "axios";
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";
import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
} from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const APIkey = "4c16246246198be81d5eadbe07087b93";

const App = () => {
  const [data, setData] = useState<any>(null);
  const [location, setLocation] = useState("Chittagong");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any>("");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setLocation(inputValue);
    } else {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
    }
    setInputValue("");
  };

  useEffect(() => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIkey}&units=metric`;

    axios
      .get(url)
      .then((res) => {
        setTimeout(() => {
          setData(res.data);
          setLoading(false);
        }, 1500);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err);
      });
  }, [location]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-gray-800 dark:to-black">
        <ImSpinner8 className="text-5xl text-white animate-spin" />
      </div>
    );
  }

  let icon: JSX.Element;
  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill />;
      break;
    case "Rain":
      icon = <IoMdRainy className="text-[#31cafb]" />;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-[#ffde33]" />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill />;
      break;
    case "Snow":
      icon = <IoMdSnow className="text-[#31cafb]" />;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm className="text-[#31cafb]" />;
      break;
    default:
      icon = <IoMdSunny className="text-[#ffde33]" />;
  }

  const date = new Date();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen px-4 py-6 text-white transition-colors duration-300 bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-gray-900 dark:to-black">
      {/* Toggle Theme Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 text-sm text-black bg-white rounded-full shadow-md dark:bg-gray-700 dark:text-white"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <h1 className="mb-4 text-3xl font-bold">☁️ Weather App</h1>

      {errorMsg && (
        <div className="w-full max-w-md p-4 mb-4 text-center text-white bg-red-600 rounded-md">
          {errorMsg.response?.data?.message || "Something went wrong!"}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${
          animate ? "animate-shake" : ""
        } w-full max-w-md h-16 bg-black/30 dark:bg-white/10 rounded-full backdrop-blur-md mb-6`}
      >
        <div className="flex items-center justify-between h-full px-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleInput}
            placeholder="Enter your location..."
            className="flex-1 text-sm text-white bg-transparent outline-none placeholder:text-white"
          />
          <button
            type="submit"
            className="flex items-center justify-center w-12 h-12 bg-blue-400 rounded-full hover:bg-blue-500"
          >
            <IoMdSearch className="text-xl" />
          </button>
        </div>
      </form>

      <div className="w-full max-w-md p-8 bg-black/30 dark:bg-white/10 rounded-3xl backdrop-blur-md">
        {loading ? (
          <div className="flex justify-center">
            <ImSpinner8 className="text-5xl animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6 gap-x-4">
              <div className="text-[87px]">{icon}</div>
              <div>
                <h2 className="text-xl font-semibold">
                  {data.name}, {data.sys.country}
                </h2>
                <p>
                  {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center mb-4">
              <h3 className="text-[100px] font-light leading-none">
                {parseInt(data.main.temp)}
              </h3>
              <TbTemperatureCelsius className="text-4xl" />
            </div>
            <p className="mb-6 text-lg text-center capitalize">
              {data.weather[0].description}
            </p>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-x-2">
                  <BsEye className="text-lg" />
                  <span>Visibility: {data.visibility / 1000} km</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <BsThermometer className="text-lg" />
                  <span className="flex items-center">
                    Feels like: {data.main.feels_like}
                    <TbTemperatureCelsius />
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-x-2">
                  <BsWater className="text-lg" />
                  <span>Humidity: {data.main.humidity}%</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <BsWind className="text-lg" />
                  <span>Wind: {data.wind.speed} m/s</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="mt-6 text-sm text-white opacity-70">
        © {new Date().getFullYear()} Shuvo. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
