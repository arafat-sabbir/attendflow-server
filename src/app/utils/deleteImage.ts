import path from "path"
import fs from "fs"

// Define the absolute path to the folder where the images are stored
const uploadDirectory = path.join(__dirname, '../../../public');

// Helper function to safely delete an image
const deleteFile = (filePath: string) => {
  const fullFilePath = path.join(uploadDirectory, filePath);

  // Check if the file exists before attempting to delete
  if (fs.existsSync(fullFilePath)) {
    try {
      fs.unlinkSync(fullFilePath);
      console.log(`Successfully deleted file: ${fullFilePath}`);
    } catch (err) {
      console.error(`Failed to delete file: ${fullFilePath}`, err);
    }
  } else {
    console.warn(`File not found: ${fullFilePath}`);
  }
};
export default deleteFile;
