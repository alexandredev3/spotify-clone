import { jest, expect, describe, test, beforeEach } from "@jest/globals";

import config from "../../../backend/config";
import { handler } from "../../../backend/routes";
import { Controller } from "../../../backend/controller";
import TestUtil from "../__util/testUtil";

const {
  pages,
  location,
  constants: { CONTENT_TYPE },
} = config;

describe("#Routes - test site for API response", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("GET / - should redirect to home page", async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = "GET";
    params.request.url = "/";

    await handler(...params.values());

    expect(params.response.writeHead).toBeCalledWith(302, {
      Location: location.home,
    });
    expect(params.response.end).toHaveBeenCalled();
  });

  test(`GET /home - should response with ${pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    params.request.method = "GET";
    params.request.url = "/home";

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  test(`GET /controller - should response with ${pages.controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    params.request.method = "GET";
    params.request.url = "/controller";

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(
      pages.controllerHTML
    );
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  test(`GET /index.html - should response with a file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    const filename = "/index.html";
    const expectedType = ".html";

    params.request.method = "GET";
    params.request.url = filename;

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(filename);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      "Content-Type": CONTENT_TYPE[expectedType],
    });
  });

  test(`GET /file.ext - should response with a file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    const filename = "/file.ext";
    const expectedType = ".ext";

    params.request.method = "GET";
    params.request.url = filename;

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      });

    jest.spyOn(mockFileStream, "pipe").mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(filename);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).not.toHaveBeenCalledWith();
  });

  test(`POST /products - given an inexistent route path it should respond with 404 error status code`, async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = "POST";
    params.request.url = "/products";

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(404);
    expect(params.response.end).toHaveBeenCalled();
  });

  describe("exceptions", () => {
    test("given inexistent file it should respond with 404 error status code", async () => {
      const params = TestUtil.defaultHandleParams();

      params.request.method = "GET";
      params.request.url = "/index.png";

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(
          new Error("Error: ENOENT: no such file or directory")
        );

      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(404);
      expect(params.response.end).toHaveBeenCalled();
    });
    test("given an error it should respond with 500 error status code", async () => {
      const params = TestUtil.defaultHandleParams();

      params.request.method = "GET";
      params.request.url = "/index.png";

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error("Internal Server Error"));

      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(500);
      expect(params.response.end).toHaveBeenCalled();
    });
  });
});
