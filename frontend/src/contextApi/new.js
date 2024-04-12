useEffect(() => {
    fetch('http://localhost:5000/get-image')
      .then(response => response.json())
      .then(data => setImageSrc(`data:image/png;base64,${data.image}`));
  }, []);

  // URL to the backend endpoint that serves the image
  const imageUrl = "http://localhost:5000/get-image";
  // Open a new tab or window displaying the image
  window.open(imageUrl, '_blank');