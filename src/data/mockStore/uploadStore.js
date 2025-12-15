/**
 * Mock Store for Global Upload System (Temp Assets)
 *
 * Concept:
 * - Stores files that are uploaded/cropped but NOT yet saved to a business object.
 * - These are "Temp Assets".
 * - When user saves (e.g. saves Campaign), we move these to `fileStore`.
 * - If user cancels, we just clear these (or backend auto-cleans).
 */

let tempAssets = [];

// Helper to generate IDs
const generateId = (prefix = "tmp") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const uploadStore = {
  // Get all temp assets
  getTempAssets: () => [...tempAssets],

  // Add a new file (Raw upload or Cropped blob)
  addTempFile: (fileBlob, metadata = {}) => {
    const id = generateId("tmp");

    // Safety check: Is this a Blob/File or a Library Asset object?
    let objectUrl;
    if (fileBlob instanceof Blob || fileBlob instanceof File) {
      objectUrl = URL.createObjectURL(fileBlob);
    } else if (fileBlob && typeof fileBlob === "object" && fileBlob.url) {
      // reuse existing URL from library asset
      objectUrl = fileBlob.url;
    } else {
      console.warn(
        "uploadStore.addTempFile received invalid file object",
        fileBlob
      );
      objectUrl = "";
    }

    const newAsset = {
      id,
      url: objectUrl,
      file: fileBlob,
      name: fileBlob.name || metadata.name || "Untitled",
      type: fileBlob.type || "image/jpeg",
      size: fileBlob.size || 0,
      lastModified: new Date().toISOString(),
      isDerived: metadata.isDerived || false,
      parentFileId: metadata.parentFileId || null, // If derived from existing file
      ...metadata,
    };
    tempAssets.push(newAsset);
    return newAsset;
  },

  // Update an existing temp file (e.g. re-crop)
  updateTempFile: (id, newBlob, metadata = {}) => {
    const index = tempAssets.findIndex((a) => a.id === id);
    if (index === -1) return null;

    // Revoke old URL to avoid memory leaks
    URL.revokeObjectURL(tempAssets[index].url);

    const updatedAsset = {
      ...tempAssets[index],
      url: URL.createObjectURL(newBlob),
      file: newBlob,
      size: newBlob.size,
      lastModified: new Date().toISOString(),
      ...metadata,
    };
    tempAssets[index] = updatedAsset;
    return updatedAsset;
  },

  // Remove a temp file
  removeTempFile: (id) => {
    const index = tempAssets.findIndex((a) => a.id === id);
    if (index !== -1) {
      URL.revokeObjectURL(tempAssets[index].url);
      tempAssets.splice(index, 1);
    }
  },

  // Commit to FileStore (Simulates "Save" action)
  commitToFiles: (tempFileId) => {
    const tempAsset = tempAssets.find((a) => a.id === tempFileId);
    if (!tempAsset) return null;

    // In a real app, this would be an API call to move Temp -> Permanent
    // Here we strictly mock it by adding to fileStore's list (if we had a setter there)
    // Since fileStore exports a const `files` array, we might need a method there or just simulate the ID return.

    // For prototype, we verify it exists and return a "permanent" ID
    // We can't easily push to the imported `files` array if it's a const export in another module without a setter.
    // So we will assume the Consumer does the "saving" to their local state or sends to backend.

    return {
      ...tempAsset,
      id: tempAsset.id.replace("tmp-", "file-"), // Simulate ID change
      status: "active",
    };
  },

  // Clean up all (e.g. on unmount)
  clearAll: () => {
    tempAssets.forEach((a) => URL.revokeObjectURL(a.url));
    tempAssets = [];
  },
};
