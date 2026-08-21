import MasterModel from "../models/masterModel.js";

async function handle(req, res, next) {
  try {
    normalizeMultipartBody(req);
    const body = normalizeCommandRequest(req);
    const files = normalizeUploadedFiles(req);
    const result = await MasterModel.handleCommand({
      body,
      file: files.file,
      files,
      user: req.user,
    });

    return res.status(result.statusCode || 200).json({
      data: result.data || null,
      message: result.message || "Success",
      ok: true,
    });
  } catch (error) {
    return next(error);
  }
}

function normalizeUploadedFiles(req) {
  const groupedFiles = req.files || {};
  const file = req.file || groupedFiles.file?.[0] || groupedFiles.image?.[0] || null;

  return {
    ...groupedFiles,
    destination_images: groupedFiles.destination_images || [],
    documents: groupedFiles.documents || [],
    file,
    image: file,
    images: groupedFiles.images || [],
    tour_images: groupedFiles.tour_images || groupedFiles.images || [],
  };
}

function normalizeMultipartBody(req) {
  parseJsonBodyField(req, "data");
  parseJsonBodyField(req, "payload");
  parseJsonBodyField(req, "filters");
  parseJsonBodyField(req, "interest_ids");
  parseJsonBodyField(req, "category_ids");
}

function parseJsonBodyField(req, field) {
  if (typeof req.body?.[field] !== "string") {
    return;
  }

  const value = req.body[field].trim();
  if (!value.startsWith("{") && !value.startsWith("[")) {
    return;
  }

  try {
    req.body[field] = JSON.parse(value);
  } catch (error) {
    error.statusCode = 400;
    error.message = `Invalid JSON in ${field} field`;
    throw error;
  }
}

function normalizeCommandRequest(req) {
  const headers = req.headers || {};
  const rawBody = req.body || {};
  const command = headers.command || headers["x-command"] || rawBody.command;

  const body = {
    ...rawBody,
    action: rawBody.action,
    command,
    data: rawBody.data,
    filters: rawBody.filters,
    id: rawBody.id,
    limit: headers.limit || rawBody.limit,
    page: headers.page || rawBody.page,
    payload: rawBody.payload,
    request: rawBody.request || command,
    search: headers.search || rawBody.search,
  };

  if (!body.data && shouldTreatBodyAsData(rawBody)) {
    body.data = rawBody;
  }

  return body;
}

function shouldTreatBodyAsData(body) {
  const metadataFields = new Set([
    "action",
    "command",
    "data",
    "filters",
    "id",
    "limit",
    "page",
    "payload",
    "request",
    "search",
  ]);
  const fields = Object.keys(body || {});

  return fields.length > 0 && fields.some((field) => !metadataFields.has(field));
}

export { handle };

export default {
  handle,
};
