import { useState, useEffect, useRef } from "react";

const usePlacesAutocomplete = (initialValue) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [predictions, setPredictions] = useState([]);
  const autocompleteService = useRef(null);

  useEffect(() => {
    if (!autocompleteService.current) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const fetchPredictions = (value) => {
    if (!value) {
      setPredictions([]);
      return;
    }
    autocompleteService.current.getPlacePredictions(
      { input: value },
      (results) => {
        setPredictions(results || []);
      }
    );
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
    fetchPredictions(event.target.value);
  };

  return {
    inputValue,
    predictions,
    setInputValue,
    setPredictions,
    handleChange,
  };
};

export default usePlacesAutocomplete;
