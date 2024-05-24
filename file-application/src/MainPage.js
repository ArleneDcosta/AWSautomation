import React, { useState } from 'react';
import AWS from 'aws-sdk';
import config from '../../nanoid/config.js';
import './MainPage.css'

const MainPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file.');
      return;
    }

    setUploading(true);

    const s3 = new AWS.S3({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });

    const params = {
      Bucket: config.bucketname,
      Key: selectedFile.name,
      Body: selectedFile
      // ACL: 'public-read' // Change as needed
    };

    const options = {
      partSize: 10 * 1024 * 1024, // 10 MB
      queueSize: 1
    };

    s3.upload(params, options)
      .on('httpUploadProgress', (progress) => {
        setUploadProgress(Math.round(progress.loaded / progress.total * 100));
      })
      .send((err, data) => {
        if (err) {
          console.error('S3 upload error:', err);
          alert('Upload failed. Please try again.');
        } else {
          console.log('S3 upload successful:', data);
          alert('Upload successful!');
        }
        setUploading(false);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} className="input-bar" />
      <button onClick={handleUpload} disabled={uploading} className="submit-button">Upload</button>
      {uploading && <div>Uploading... {uploadProgress}%</div>}
    </div>
  );
};

export default MainPage;
