import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useRef } from 'react';
import { Navbar, Container, Form, Button, Row, Col, Alert, Image, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [format, setFormat] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [convertedFileName, setConvertedFileName] = useState('');
  const fileInputRef = useRef(null); 

  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setDownloadUrl('');
    setConvertedFileName('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setDownloadUrl('');
    setConvertedFileName('');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleFormatChange = (event) => {
    setFormat(event.target.value);
  };

  const handleConvert = async () => {
    if (!selectedFile || !format) {
      setErrorMessage('Please upload an image and select a format.');
      return;
    }

    setErrorMessage('');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('format', format);

    try {
      const response = await axios.post('/api/convert', formData, {
        responseType: 'blob',
      });

      const url = URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);

      const originalName = selectedFile.name;
      const newFileName = originalName.substring(0, originalName.lastIndexOf('.')) + `.${format}`;
      setConvertedFileName(newFileName);
    } catch (error) {
      setErrorMessage('Conversion failed. Please try again.');
    }
  };

  return (
    <Container fluid className="p-5" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" className="mb-5">
        <Container>
          <Navbar.Brand href="#">Format Converter</Navbar.Brand>
        </Container>
      </Navbar>

      <Row className="justify-content-md-center">
        <Col md={6}>
          <h4 className="text-center mb-4">Free unlimited image format conversions</h4>
          <p className="text-center">Drag and drop an image or select it from your device. Choose the format and download the converted file.</p>
          <p className="text-center">All conversions are done on your device locally for data protection.</p>

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

          <Form.Group
            className="mb-3"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
            onClick={handleAreaClick}
            style={{
              border: '2px dashed #ffffff',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#333333',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >
            <Form.Label>Drag and Drop Image Here or Click to Upload</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <div
              style={{
                color: selectedFile ? '#00FF00' : '#ffffff',
                fontWeight: 'bold',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {selectedFile ? `Selected File: ${selectedFile.name}` : 'No file selected'}
            </div>
          </Form.Group>

          <Form.Group controlId="formSelect" className="mb-3">
            <Form.Label>Select Format</Form.Label>
            <Form.Select onChange={handleFormatChange} value={format}>
              <option value="">Choose format...</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WEBP</option>
              <option value="gif">GIF</option>
              <option value="tiff">TIFF</option>
            </Form.Select>
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" onClick={handleConvert} disabled={!selectedFile || !format}>
              Convert
            </Button>
          </div>

          {downloadUrl && (
            <Card className="mt-4 p-3 text-center" style={{ backgroundColor: '#222222', color: '#ffffff' }}>
              <Row className="align-items-center">
                <Col xs={12} md={2} className="mb-2 mb-md-0">
                  <Image src={downloadUrl} thumbnail fluid style={{ width: '50px' }} />
                </Col>
                <Col xs={12} md={8} className="mb-2 mb-md-0">
                  <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{convertedFileName}</span>
                </Col>
                <Col xs={12} md={2}>
                  <Button variant="success" href={downloadUrl} download={convertedFileName}>
                    Download
                  </Button>
                </Col>
              </Row>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
