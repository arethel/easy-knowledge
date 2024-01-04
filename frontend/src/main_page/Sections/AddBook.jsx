import React, { useRef } from "react";
import { ReactComponent as AddBookIcon } from '../../images/add-book.svg';
import "./style.css";

export const AddBook = ({ onFileSelect, client, sectionId }) => {
    const fileInputRef = useRef();

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        try {
          const formData = new FormData();
          console.log("section_id", sectionId)
          formData.append("file", file);
          formData.append("section_id", sectionId);
  
          const response = await client.post("api/book/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response);
          if (response.data.error === 0) {
            console.log("File uploaded successfully")
            onFileSelect(file);
          } else {
            console.error("Failed to upload the file: ", response.data.details);
            alert("Failed to upload the file");
          }
        } catch (error) {
          console.error("Error during the API call", error);
          alert("Error during the API call");
        }
      } else {
        console.error("Invalid file type. Please choose a PDF file.");
        alert("Invalid file type. Please choose a PDF file.");
      }
    };
  
    const handleAddBook = () => {
      fileInputRef.current.click();
    };

    return (
      <div className="vertical-container add-book" onClick={handleAddBook}>
        <div className="vertical-rectangle">
          {/* <img className="book-cover plus-image" src={require("../../images/plus_image.png")} alt={"text"} /> */}
          <AddBookIcon className="plus-icon" alt="Add book"/>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept=".pdf"
        />
      </div>
    );
};