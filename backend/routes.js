import { logger } from "./util.js";
import config from "./config.js";
import { Controller } from "./controller.js";

const {
  location,
  pages: { homeHTML, controllerHTML },
  constants: { CONTENT_TYPE },
} = config;

const controller = new Controller();

async function routes(request, response) {
  const { method, url } = request;

  if (method === "GET" && url === "/") {
    // 302 --> found status code.
    response.writeHead(302, {
      Location: location.home,
    });

    return response.end();
  } else if (method === "GET" && url === "/home") {
    const { stream } = await controller.getFileStream(homeHTML);

    // response.writeHead(200, {
    //   'Content-Type': 'text/html'
    // });
    // everything that is comming is going to be send through the response.
    return stream.pipe(response);
  } else if (method === "GET" && url === "/controller") {
    const { stream } = await controller.getFileStream(controllerHTML);

    return stream.pipe(response);
  } else if (method === "GET") {
    const { stream, type } = await controller.getFileStream(url);

    const contentType = CONTENT_TYPE[type];

    if (contentType) {
      response.writeHead(200, {
        "Content-Type": CONTENT_TYPE[type],
      });
    }

    return stream.pipe(response);
  }

  response.writeHead(404);
  return response.end();
}

function handleError(error, response) {
  if (error.message.includes("ENOENT")) {
    logger.warn(`asset not found ${error}`);
    response.writeHead(404);
    return response.end();
  }

  logger.error(`caught error on API ${error}`);
  response.writeHead(500);
  return response.end();
}

export function handler(request, response) {
  return routes(request, response).catch((error) => {
    handleError(error, response);
  });
}
