import React, { useRef } from "react";
import axios from "axios";
import "./styles.css";

let backendServer = process.env.REACT_APP_BACKEND_SERVER_IP as string; 

interface CourseSearchProps {
  setDebouncedSearchTerm: (searchTerm: string) => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  setDebouncedSearchTerm,
  searchTerm,
  setSearchTerm,
}) => {
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // Convert the input value to uppercase
    value = value.toUpperCase();

    // Extract the prefix
    const prefix = value.match(/[A-Z]+/)?.[0] || "";

    // Remove any spaces from the input
    const inputWithoutSpaces = value.replace(/\s/g, "");

    // Format the input with a space after the prefix if it exists
    let formattedInput = inputWithoutSpaces;
    if (prefix.length > 0 && inputWithoutSpaces.length > prefix.length) {
      formattedInput = prefix + " " + inputWithoutSpaces.slice(prefix.length);
    }

    setSearchTerm(formattedInput);

    // Debounce search input
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(formattedInput);
      if (formattedInput !== "" && formattedInput.length == 8) {
        handleSearchMetrics(formattedInput);
      }
    }, 200); // 300ms delay
  };

  const handleSearchMetrics = async (formattedInput: string) => {
    try {
      await axios.post(`https://${backendServer}/search`, {
        searchTerm: formattedInput,
      });
    } catch (error) {
      console.error("Error sending search metrics", error);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search course codes (ABC 1234)..."
      id="search-input"
      value={searchTerm}
      onChange={handleSearchChange}
      autoCorrect="off"
      className="px-2 py-2 text-black bg-gray-200 rounded-md placeholder-gray-500 w-[100%]"
      style={{ zIndex: 998 }}
    />
  );
};

export default CourseSearch;
