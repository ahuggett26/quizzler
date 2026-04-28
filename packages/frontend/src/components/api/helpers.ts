export const BACKEND_URL_BASE = () => {
  const dev = process.env.DEV;
  console.log("dev", dev);
  if (dev === "true") {
    return "http://localhost:4000";
  }
  return "https://quizzler-backend-7zy8.onrender.com";
};
