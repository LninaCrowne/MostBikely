import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [distance, setDistance] = useState("");
  const [routeType, setRouteType] = useState("city");
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  const getRoutes = async () => {
    try {
      const res = await fetch("/routes");
      const json = await res.json();
      setRoutes(json);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch routes");
    }
  };

  useEffect(() => {
    getRoutes();
  }, []);

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === "startPoint") setStartPoint(value);
    if (name === "endPoint") setEndPoint(value);
    if (name === "distance") setDistance(value);
    if (name === "routeType") setRouteType(value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const results = await fetch("/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ startPoint, endPoint, distance, routeType })
      });

      if (!results.ok) {
        setError("Failed to add route");
        return;
      }

      const updatedRoutes = await results.json();
      setRoutes(updatedRoutes);
      setStartPoint("");
      setEndPoint("");
      setDistance("");
      setRouteType("city");
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to add route");
    }
  };

  const deleteRoute = async id => {
    try {
      const result = await fetch(`/routes/${id}`, {
        method: "DELETE"
      });
      if (!result.ok) {
        setError("Failed to delete route");
        return;
      }
      const updatedRoutes = await result.json();
      setRoutes(updatedRoutes);
      setError(null);
    } catch (error) {
      console.log(error);
      setError("Failed to delete route");
    }
  };

  const calculateDuration = km => {
    const distance = parseFloat(km);
    if (isNaN(distance)) return "Invalid";

    const hours = Math.floor(distance / 50);
    const minutes = Math.round(((distance / 50) - hours) * 60);
    return `${hours}h ${minutes}m`;
  };

  const getImageUrl = type => {
    switch (type) {
      case "mountain":
        return "https://images.unsplash.com/photo-1508264922369-13e197685e68?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      case "beach":
        return "https://images.unsplash.com/photo-1560319734-fe91ab681d85?q=80&w=1809&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      case "city":
        return "https://images.unsplash.com/photo-1517672937779-5b00ae984183?q=80&w=1672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      default:
        return "";
    }
  };

  const openInGoogleMaps = (start, end) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Add your adventure!</h1>
      </header>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="startPoint" className="label">Where does it start?</label>
          <input
            type="text"
            name="startPoint"
            value={startPoint}
            onChange={handleChange}
            className="input"
            id="startPoint"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="endPoint" className="label">Where does it end?</label>
          <input
            type="text"
            name="endPoint"
            value={endPoint}
            onChange={handleChange}
            className="input"
            id="endPoint"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="distance" className="label">How far it takes?</label>
          <input
            type="number"
            name="distance"
            value={distance}
            onChange={handleChange}
            className="input"
            id="distance"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="routeType" className="label">Where's the adventure happening?</label>
          <select
            name="routeType"
            value={routeType}
            onChange={handleChange}
            className="input"
            id="routeType"
            required
          >
            <option value="city">City</option>
            <option value="mountain">Mountain</option>
            <option value="beach">Beach</option>
          </select>
        </div>
        <button type="submit" className="button">Add Route</button>
      </form>
      <div className="routes-list">
        {routes.length > 0 ? (
          routes.map(route => (
            <div key={route.id} className="route-card">
              <div className="route-header">
                <img src={getImageUrl(route.route_type)} alt={route.route_type} className="route-image" />
                <h2 className="route-title">{route.start_point} → {route.end_point}</h2>
              </div>
              <div className="route-details">
                <p><strong>Distance:</strong> {route.distance} km</p>
                <p><strong>Duration:</strong> {calculateDuration(route.distance)}</p>
                <button className="view-maps-button" onClick={() => openInGoogleMaps(route.start_point, route.end_point)}>View on Maps</button>
                <button className="delete-button" onClick={() => deleteRoute(route.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No routes found</p>
        )}
      </div>
    </div>
  );
}
