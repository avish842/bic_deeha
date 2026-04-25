import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiImage } from "react-icons/fi";
import heroApi from "../../services/hero.api";
import toast from "react-hot-toast";

const AdminHero = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await heroApi.getAllAdmin();
      setImages(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch hero images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image size must be less than 2MB");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await heroApi.add(formData);
      toast.success("Image uploaded successfully");
      fetchImages();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsSubmitting(false);
      e.target.value = null; // reset file input
    }
  };

  const handleToggle = async (id) => {
    try {
      await heroApi.toggleStatus(id);
      toast.success("Status updated");
      fetchImages();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await heroApi.delete(id);
      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-heading">Hero Slider Images</h1>
        
        <label className="btn-primary cursor-pointer">
          {isSubmitting ? "Uploading..." : "Upload New Image"}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleUpload}
            disabled={isSubmitting}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img._id} className={"card overflow-hidden " + (!img.isActive ? "opacity-60" : "")}>
            <div className="h-48 overflow-hidden relative">
              <img src={img.imageUrl} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggle(img._id)}
                  className={`p-2 rounded bg-white/90 backdrop-blur ${img.isActive ? "text-emerald-600" : "text-gray-500"} hover:scale-110 transition-transform`}
                  title={img.isActive ? "Deactivate" : "Activate"}
                >
                  {img.isActive ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center bg-white">
              <span className="text-sm text-gray-500 overflow-hidden text-ellipsis">
                {new Date(img.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDelete(img._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
                title="Delete Image"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
            No hero images uploaded yet. Upload some images to display on the home page slider.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHero;
