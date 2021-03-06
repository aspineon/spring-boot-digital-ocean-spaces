const CDN_URL = "REPLACE_WITH_YOUR_CDN_URL";

const Gallery = () => {
  let { useEffect, useState } = React;
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    setLoading(true);
    axios
      .get("http://localhost:8080/get/images")
      .then(response => {
        setImages(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteImage = id => {
    setLoading(true);
    axios
      .delete("http://localhost:8080/delete/image/" + id)
      .then(response => {
        loadImages();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const uploadFile = image => {
    var formData = new FormData();
    formData.append("image", image);
    let config = {
      onUploadProgress: progressEvent => {
        console.log(
          "progress event:: ",
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
        setProgress(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
      }
    };
    axios
      .put("http://localhost:8080/save/image", formData, config)
      .then(response => {
        loadImages();
        setProgress(0);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="my-3">
      </div>
      <div className="row">
      <div style={{margin: "0 auto",
    width: "500px"}}>
        <div className="custom-file mb-3">
          <input
            type="file"
            className="custom-file-input"
            onChange={e => uploadFile(e.target.files[0])}
            id="customFile"
            name="filename"
          />
          <label className="custom-file-label" htmlFor="customFile">
            Choose file
          </label>
        </div>
        </div>
      </div>
      <div className="row">
        {progress != 0 && (
          <div style={{ width: "100%" }}>
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: `${progress}%` }}
              >
                {progress}%
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        {loading ? (
          <div className="h-50 d-flex justify-content-center align-items-center"> 
          <div
            className="spinner-border text-primary"
            style={{ width: "3rem", height: "3rem" }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
          </div>
        ) : (
          <div>
          {(images.length==0) ?
          <div className="h-50 d-flex justify-content-center align-items-center"> 
            <h4>Gallery is Empty</h4>
            </div>
            :
          <div className="row ">
            {images.map((image, key) => (
              <div key={key} className="col-md-4 image-container">
                <button
                  className="btn btn-danger btn-sm image-delete"
                  onClick={() => deleteImage(image.id)}
                >
                  <img src="delete.png" style={{width: "18px",height: "18px"}}/>
                </button>
                <img
                  src={`${CDN_URL}${image.name}.${image.ext}`}
                  alt={image.name}
                  className="image"
                />
                <div className="image-caption">
                  <span>{image.name}</span>
                </div>
              </div>
            ))}
          </div>
          }
          </div>
        )}
      </div>
    </div>
  );
};
ReactDOM.render(<Gallery />, document.getElementById("root"));
