function publicFileUrl(file) {
  return `/uploads/${file.filename}`;
}

function serializeFile(file) {
  return {
    filename: file.filename,
    mimetype: file.mimetype,
    original_name: file.originalname,
    size: file.size,
    url: publicFileUrl(file),
  };
}

export async function uploadMedia(_payload = {}, context = {}) {
  const files = [
    context.file,
    ...(context.files?.images || []),
    ...(context.files?.tour_images || []),
  ].filter(Boolean);
  const uniqueFiles = [...new Map(files.map((file) => [file.filename, file])).values()];

  if (uniqueFiles.length === 0) {
    const error = new Error("Please choose an image to upload");
    error.statusCode = 400;
    throw error;
  }

  return {
    file: serializeFile(uniqueFiles[0]),
    files: uniqueFiles.map(serializeFile),
  };
}
