import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Head/dashboard.css';
import Api from './Api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const logout = async () => {
    localStorage.removeItem('AuthToken');
    navigate('/');
  };

  const handleFileChange = (e) => {
    setIsLoading(true)
    e.preventDefault();
    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      formData.append('file', file);
    }

    Api.post('/uploadPdf/', formData, {
      header: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        setMessage('File Uploaded Successfully!');
      })
      .catch((error) => {
        setMessage('Something went wrong... file failed to upload');
      })
      .finally(() => setIsLoading(false));
  };

  const handleDownload = () => {
    setMessage(false);
    setIsLoading(true); // Show loading indicator
    Api.get('/generate-download-links/') // Replace with your Django endpoint
      .then((response) => {
        setDownloadLinks(response.data.download_links);
      })
      .catch((error) => {
        console.error('Error fetching download links:', error);
      })
      .finally(() => setIsLoading(false)); // Hide loading indicator
  };

  const handleSearch = () => {
    setIsLoading(true); // Show loading indicator
    Api.get(`/search-pdf/?search_term=${searchTerm}`)
      .then((response) => {
        console.log(response.data);
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error('Error searching for text:', error);
      })
      .finally(() => setIsLoading(false)); 
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand m-2">Nexus Horizon</a>
        <div className="mx-auto"></div>
        <div className="form-inline m-2">
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="button-container">
        <label htmlFor="file-upload" className="button upload-button">
          Upload PDF
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <a onClick={handleDownload} className="button download-button">
          Download PDF
        </a>
      </div>
      <ul className="col-12 text-center list-unstyled">
        {downloadLinks.map((link) => (
          <li key={link.file_name}>
            <a href={link.download_url} download className="link-success">
              {link.file_name}
            </a>
          </li>
        ))}
      </ul>
      {message && (
        <div className="text-center m-3 text-danger">{message}</div>
      )}

      <div className="col-12 d-flex">
        <div className="col-3"></div>
        <div className="col-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search pdf"
              aria-label="Search"
              aria-describedby="searchButton"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="input-group-append m-2">
              <button
                className="btn btn-outline-success"
                type="button"
                id="searchButton"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-3"></div>
      </div>

      {isLoading ? (
        <div className="text-center mt-4">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="col-12">
          {searchResults.length > 0 ? (
            <div>
              <h3 className="text-center text-danger">Search Results:</h3>
              <ul className="list-group">
                {searchResults.map((result) => (
                  <li
                    key={result.DocumentName}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h4>{result.DocumentName}</h4>
                      <p>
                        Pages with text: {result.PagesWithText.join(', ')}
                      </p>
                    </div>
                    <span className="badge badge-primary">
                      Pages with text: {result.PagesWithText.join(', ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
