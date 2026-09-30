const API_BASE_URL = "https://resin-website.onrender.com";

export const getImageUrl = (image) => {
  if (!image) return "";

  // Cloudinary / any complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Old /uploads images
  return `${API_BASE_URL}${image}`;
};

export default getImageUrl;