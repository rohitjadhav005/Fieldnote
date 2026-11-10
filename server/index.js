import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const PORT = 4000;
const BODY_LIMIT = 16 * 1024;

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
  });
  response.end(body);
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > BODY_LIMIT) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Send a valid JSON request body.');
    error.statusCode = 400;
    throw error;
  }
}

function validateAssessment(input) {
  const latitude = input?.latitude;
  const longitude = input?.longitude;
  const radiusKm = input?.radiusKm;

  if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return 'Latitude must be a number between −90 and 90.';
  }
  if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return 'Longitude must be a number between −180 and 180.';
  }
  if (typeof radiusKm !== 'number' || !Number.isInteger(radiusKm) || radiusKm < 5 || radiusKm > 50 || radiusKm % 5 !== 0) {
    return 'Radius must be a 5 km increment from 5 to 50 km.';
  }
  return null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${PORT}`);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    sendJson(response, 200, { ok: true, service: 'fieldnote-api' });
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/assess') {
    try {
      const input = await readJson(request);
      const validationError = validateAssessment(input);
      if (validationError) {
        sendJson(response, 400, { ok: false, error: validationError });
        return;
      }

      sendJson(response, 200, {
        ok: true,
        assessment: {
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          referencePoint: {
            latitude: input.latitude,
            longitude: input.longitude,
            datum: 'WGS84',
          },
          radiusKm: input.radiusKm,
          resultType: 'illustrative-only',
          suitability: null,
          notice: 'Inputs validated. No live GIS, remote sensing, or validated ML assessment is connected.',
        },
      });
    } catch (error) {
      sendJson(response, error.statusCode || 400, { ok: false, error: error.message || 'Unable to read request.' });
    }
    return;
  }

  sendJson(response, 404, { ok: false, error: 'Route not found.' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Fieldnote API listening at http://127.0.0.1:${PORT}`);
});
