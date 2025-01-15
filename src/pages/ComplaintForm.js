import React, { useState } from "react";
import "./ComplaintForm.css";


const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    nic: "",
    phone: "",
    address: "",
    category: "",
    subCategory: "",
    details: "",
    location: "",
    date: "",
    time: "",
    files: [],
  });

  const [totalFileSize, setTotalFileSize] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false); 
  const [customMainCategory, setCustomMainCategory] = useState("");
  const [customSubCategory, setCustomSubCategory] = useState("");

  const categories = {
    "Service Issue": ["Service Delay", "Quality Issue"],
    "Product Complaint": ["Defective", "Missing Parts"],
    "Billing Problem": ["Incorrect Charges", "Refund Request"],
    "Feedback": ["Positive", "Negative"],
    "Other": ["Other"],
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const selectedSize = selectedFiles.reduce((total, file) => total + file.size, 0);
  
    // Check total size limit
    if (totalFileSize + selectedSize > 10 * 1024 * 1024) {
      alert("Total file size exceeds 10 MB. Please remove some files.");
      return;
    }
  
    // Add files to formData.files while avoiding duplicates
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: [...prevFormData.files, ...selectedFiles],
    }));
  
    // Update total file size
    setTotalFileSize((prevTotalSize) => prevTotalSize + selectedSize);
  };
  
  const handleRemoveFile = (index) => {
    setFormData((prevFormData) => {
      const removedFileSize = prevFormData.files[index].size;
      const updatedFiles = prevFormData.files.filter((_, i) => i !== index);
  
      // Update total file size
      setTotalFileSize((prevTotalSize) => prevTotalSize - removedFileSize);
  
      return {
        ...prevFormData,
        files: updatedFiles,
      };
    });
  };
  
  const handleCategorySelect = () => {
    setShowCategoryModal(true);
  };

  const handleMainCategorySelect = (category) => {
    setMainCategory(category);
    if (category !== "Other") {
      setSubCategories(categories[category] || []);
      setCustomMainCategory("");
      setCustomSubCategory("");
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategorySelect = (subCategory) => {
    setFormData({ ...formData, category: mainCategory, subCategory });
    setShowCategoryModal(false);
  };

  const handleCustomCategoryApply = () => {
    if (customMainCategory && customSubCategory) {
      setFormData({ ...formData, category: customMainCategory, subCategory: customSubCategory });
      setShowCategoryModal(false);
    } else {
      alert("Please fill both the main category and subcategory.");
    }
  };
//SUbmit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create a FormData object to handle file uploads and text fields
    const submissionData = new FormData();
    submissionData.append("firstName", formData.firstName);
    submissionData.append("lastName", formData.lastName);
    submissionData.append("email", formData.email);
    submissionData.append("nic", formData.nic);
    submissionData.append("phone", formData.phone);
    submissionData.append("address", formData.address);
    submissionData.append("category", formData.category);
    submissionData.append("subCategory", formData.subCategory);
    submissionData.append("details", formData.details);
    submissionData.append("location", formData.location);
    submissionData.append("date", formData.date);
    submissionData.append("time", formData.time);
  
    // Append all files to FormData
    formData.files.forEach((file) => {
      submissionData.append("files", file);
    });
  
    // Submit data to the backend
    try {
      const response = await fetch("http://localhost:1337/api/complaints", {
        method: "POST",
        body: submissionData,
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("Complaint submitted successfully!");
        console.log("Server Response:", result);
  
        // Reset form after successful submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          nic: "",
          phone: "",
          address: "",
          category: "",
          subCategory: "",
          details: "",
          location: "",
          date: "",
          time: "",
          files: [],
        });
        setTotalFileSize(0);
      } else {
        alert("Failed to submit complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("An error occurred while submitting the complaint.");
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <div className="complaint-page">
      <nav className="navbar">
  <button className="sidebar-toggle" onClick={toggleSidebar}>
    &#9776; {/* Hamburger icon */}
  </button>
  <h1></h1>
  <div className="nav-links">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>

      <div className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
        <ul>
          <li><a href="#">Dashboard</a></li>
          <li><a href="#">Settings</a></li>
          <li><a href="#">Help</a></li>
        </ul>
      </div>

      <div className="complaint-form-container">
        <h2>File a Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group-inline">
            <div className="inline-input">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="inline-input">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group-inline">
            <div className="inline-input">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="inline-input">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>NIC</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group-inline">
            <div className="inline-input">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="inline-input">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Complaint Location</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Category</label>
            <button 
              type="button" 
              className="select-category-btn btn btn-primary" 
              onClick={handleCategorySelect}
            >
              Select Categories
            </button>
            <p className="mt-2">
              {formData.category && formData.subCategory 
                ? `${formData.category} - ${formData.subCategory}` 
                : "No category selected"
              }
            </p>
          </div>

          <div className="form-group">
            <label>Details of Complaint</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group file-upload-bar">
            <label>Upload Files (Total size Max 30 MB)</label>
            <div className="upload-container">
              <label htmlFor="file-input" className="upload-bar">
                {formData.files.length === 0 ? (
                  "Click to upload files"
                ) : (
                  <div className="file-thumbnails">
                    {formData.files.map((file, index) => (
                      <div key={index} className="file-thumbnail">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="file preview"
                          className="thumbnail-image"
                        />
                        <button
                          type="button"
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </label>
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileUpload}
                hidden
              />
            </div>
          </div>

          <button type="submit" className="submit-btn btn btn-success">
            Submit Complaint
          </button>
        </form>
      </div>

      {showCategoryModal && (
        <div className="category-modal">
          <div className="modal-content">
            <h3>Select Category</h3>
            <div>
              <button onClick={() => handleMainCategorySelect("Service Issue")}>Service Issue</button>
              <button onClick={() => handleMainCategorySelect("Product Complaint")}>Product Complaint</button>
              <button onClick={() => handleMainCategorySelect("Billing Problem")}>Billing Problem</button>
              <button onClick={() => handleMainCategorySelect("Feedback")}>Feedback</button>
              <button onClick={() => handleMainCategorySelect("Other")}>Other</button>
            </div>
            {mainCategory === "Other" && (
              <>
                <div>
                  <label>Custom Category</label>
                  <input
                    type="text"
                    value={customMainCategory}
                    onChange={(e) => setCustomMainCategory(e.target.value)}
                  />
                </div>
                <div>
                  <label>Custom Subcategory</label>
                  <input
                    type="text"
                    value={customSubCategory}
                    onChange={(e) => setCustomSubCategory(e.target.value)}
                  />
                </div>
                <button onClick={handleCustomCategoryApply}>Apply</button>
              </>
            )}
            {subCategories.length > 0 && (
              <div>
                {subCategories.map((subCat, index) => (
                  <button key={index} onClick={() => handleSubCategorySelect(subCat)}>
                    {subCat}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowCategoryModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;