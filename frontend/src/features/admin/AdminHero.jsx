import { useState, useEffect } from "react";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import heroApi from "../../services/hero.api";
import toast from "react-hot-toast";

const AdminHero = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadTargetAudience, setUploadTargetAudience] = useState("BOTH");

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
    formData.append("targetAudience", uploadTargetAudience);

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

  const handleReorder = async (id, order) => {
    try {
      await heroApi.updateOrder(id, Number(order));
      toast.success("Sequence updated");
      fetchImages();
    } catch (error) {
      toast.error("Failed to update sequence");
    }
  };

  const handleTargetAudience = async (id, targetAudience) => {
    try {
      await heroApi.updateTargetAudience(id, targetAudience);
      toast.success("Target updated");
      fetchImages();
    } catch (error) {
      toast.error("Failed to update target");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-heading">Hero Slider Images</h1>

        <div className="flex items-center gap-3">
          <select
            value={uploadTargetAudience}
            onChange={(e) => setUploadTargetAudience(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="BOTH">Both Devices</option>
            <option value="DESKTOP">Desktop Only</option>
            <option value="MOBILE">Mobile Only</option>
          </select>

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, index) => (
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
            
            <div className="p-4 bg-white space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-500 overflow-hidden text-ellipsis">
                  {new Date(img.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(img._id, img.order - 1)}
                    disabled={index === 0}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    onClick={() => handleReorder(img._id, img.order + 1)}
                    disabled={index === images.length - 1}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <FiArrowDown />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Sequence</label>
                <input
                  type="number"
                  min={1}
                  max={images.length || 1}
                  defaultValue={img.order || index + 1}
                  onBlur={(e) => {
                    const nextValue = Number(e.target.value);
                    if (!Number.isNaN(nextValue) && nextValue >= 1) {
                      handleReorder(img._id, nextValue);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  className="w-20 border rounded-lg px-2 py-1 text-sm"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-gray-600 font-medium">Show On</label>
                <select
                  value={img.targetAudience || "BOTH"}
                  onChange={(e) => handleTargetAudience(img._id, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value="BOTH">Both</option>
                  <option value="DESKTOP">Desktop</option>
                  <option value="MOBILE">Mobile</option>
                </select>
              </div>

              <button
                onClick={() => handleDelete(img._id)}
                className="w-full p-2 text-red-500 hover:bg-red-50 rounded"
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
