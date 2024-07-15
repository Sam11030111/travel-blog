import Form from "react-bootstrap/Form";

import usePlacesAutocomplete from "../../hooks/googleMap";

const PlaceInput = ({ setPlaceId }) => {
  const {
    inputValue,
    predictions,
    setInputValue,
    setPredictions,
    handleChange,
  } = usePlacesAutocomplete("");

  return (
    <Form.Group className="mb-10" controlId="exampleForm.ControlInput1">
      <Form.Label>Place</Form.Label>
      <Form.Control
        type="text"
        name="place"
        placeholder="Search for the place..."
        value={inputValue}
        onChange={handleChange}
      />
      {predictions.length > 0 && (
        <ul className="absolute z-10 bg-white shadow-md rounded mt-2">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => {
                setInputValue(prediction.description);
                setPredictions([]);
                setPlaceId(prediction.place_id);
              }}
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </Form.Group>
  );
};

export default PlaceInput;
