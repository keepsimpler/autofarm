var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data2 = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data2, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data2 = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data2.set(chunk, offset);
      offset += chunk.length;
    }
    return data2.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data2) {
  if (data2[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data2.url}`);
  }
  data2[INTERNALS$2].disturbed = true;
  if (data2[INTERNALS$2].error) {
    throw data2[INTERNALS$2].error;
  }
  let { body } = data2;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data2.size > 0 && accumBytes + chunk.length > data2.size) {
        const err = new FetchError(`content size at ${data2.url} over limit: ${data2.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data2.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data2.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data2.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data2 = src(request.url);
      const response2 = new Response(data2, { headers: { "Content-Type": data2.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// node_modules/@sveltejs/kit/dist/adapter-utils.js
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data2 = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data2.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data2.length + chunk.length);
        new_data.set(data2, 0);
        new_data.set(chunk, data2.length);
        data2 = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h["content-type"].split(/;\s*/);
      if (isContentTypeTextual(type)) {
        const encoding = h["content-encoding"] || "utf-8";
        return fulfil(new TextDecoder(encoding).decode(data2));
      }
      fulfil(data2);
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (branch) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page.path)},
						query: new URLSearchParams(${s$1(page.query.toString())}),
						params: ${s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data2, fail) {
  try {
    return devalue(data2);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: {
              "content-type": asset.type
            }
          }) : await fetch(`http://${page.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base)) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (error4) {
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page
    });
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({ ...request, params });
    const preface = `Invalid response from route ${request.path}`;
    if (response) {
      if (typeof response !== "object") {
        return error(`${preface}: expected an object, got ${typeof response}`);
      }
      let { status = 200, body, headers = {} } = response;
      headers = lowercase_keys(headers);
      const type = headers["content-type"];
      const is_type_textual = isContentTypeTextual(type);
      if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
        return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
      }
      let normalized_body;
      if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
        headers = { ...headers, "content-type": "application/json; charset=utf-8" };
        normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
      } else {
        normalized_body = body;
      }
      return { status, body: normalized_body, headers };
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  if (typeof raw === "string") {
    const [type, ...directives] = headers["content-type"].split(/;\s*/);
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const { data: data2, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data2;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data: data2, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data2;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: null,
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$1 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$1);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-61356321.js",
      css: ["/./_app/assets/start-a8cd1609.css"],
      js: ["/./_app/start-61356321.js", "/./_app/chunks/vendor-f553da9a.js", "/./_app/chunks/preload-helper-08cc8e69.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      if (error22.frame) {
        console.error(error22.frame);
      }
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "css/bootstrap.css", "size": 199412, "type": "text/css" }, { "file": "css/bootstrap.min.css", "size": 161409, "type": "text/css" }, { "file": "css/style.css", "size": 12566, "type": "text/css" }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "images/detail1.png", "size": 629966, "type": "image/png" }, { "file": "images/detail1@2x.png", "size": 1875170, "type": "image/png" }, { "file": "images/detail2.png", "size": 96473, "type": "image/png" }, { "file": "images/detail2@2x.png", "size": 362431, "type": "image/png" }, { "file": "images/detail3.png", "size": 104165, "type": "image/png" }, { "file": "images/detail3@2x.png", "size": 365643, "type": "image/png" }, { "file": "images/detail4.png", "size": 142021, "type": "image/png" }, { "file": "images/detail4@2x.png", "size": 506382, "type": "image/png" }, { "file": "images/dhl.png", "size": 1611, "type": "image/png" }, { "file": "images/dhl@2x.png", "size": 4208, "type": "image/png" }, { "file": "images/down.svg", "size": 1424, "type": "image/svg+xml" }, { "file": "images/e-commerce.svg", "size": 2898, "type": "image/svg+xml" }, { "file": "images/email.svg", "size": 1280, "type": "image/svg+xml" }, { "file": "images/fba.png", "size": 2817, "type": "image/png" }, { "file": "images/fba@2x.png", "size": 5892, "type": "image/png" }, { "file": "images/fedex.png", "size": 2532, "type": "image/png" }, { "file": "images/fedex@2x.png", "size": 6027, "type": "image/png" }, { "file": "images/icon0.svg", "size": 4028, "type": "image/svg+xml" }, { "file": "images/icon1.svg", "size": 2926, "type": "image/svg+xml" }, { "file": "images/icon10.svg", "size": 5461, "type": "image/svg+xml" }, { "file": "images/icon11.svg", "size": 4990, "type": "image/svg+xml" }, { "file": "images/icon12.svg", "size": 6495, "type": "image/svg+xml" }, { "file": "images/icon13.svg", "size": 3467, "type": "image/svg+xml" }, { "file": "images/icon14.svg", "size": 3467, "type": "image/svg+xml" }, { "file": "images/icon15.svg", "size": 4783, "type": "image/svg+xml" }, { "file": "images/icon16.svg", "size": 3297, "type": "image/svg+xml" }, { "file": "images/icon2.svg", "size": 5652, "type": "image/svg+xml" }, { "file": "images/icon3.svg", "size": 4364, "type": "image/svg+xml" }, { "file": "images/icon4.svg", "size": 2205, "type": "image/svg+xml" }, { "file": "images/icon5.svg", "size": 4080, "type": "image/svg+xml" }, { "file": "images/icon6.svg", "size": 3666, "type": "image/svg+xml" }, { "file": "images/icon7.svg", "size": 4964, "type": "image/svg+xml" }, { "file": "images/icon8.svg", "size": 4956, "type": "image/svg+xml" }, { "file": "images/icon9.svg", "size": 4583, "type": "image/svg+xml" }, { "file": "images/index1.png", "size": 91747, "type": "image/png" }, { "file": "images/index1@2x.png", "size": 299860, "type": "image/png" }, { "file": "images/index2.png", "size": 146862, "type": "image/png" }, { "file": "images/index2@2x.png", "size": 545960, "type": "image/png" }, { "file": "images/index3.png", "size": 130198, "type": "image/png" }, { "file": "images/index3@2x.png", "size": 439207, "type": "image/png" }, { "file": "images/index4.png", "size": 208564, "type": "image/png" }, { "file": "images/index4@2x.png", "size": 752857, "type": "image/png" }, { "file": "images/index5.png", "size": 173833, "type": "image/png" }, { "file": "images/index5@2x.png", "size": 611419, "type": "image/png" }, { "file": "images/index6.png", "size": 196733, "type": "image/png" }, { "file": "images/index6@2x.png", "size": 689511, "type": "image/png" }, { "file": "images/intro.png", "size": 1078041, "type": "image/png" }, { "file": "images/intro@2x.png", "size": 3990409, "type": "image/png" }, { "file": "images/left.svg", "size": 1389, "type": "image/svg+xml" }, { "file": "images/location.svg", "size": 1982, "type": "image/svg+xml" }, { "file": "images/logo.png", "size": 8127, "type": "image/png" }, { "file": "images/logo@2x.png", "size": 19731, "type": "image/png" }, { "file": "images/order.svg", "size": 3076, "type": "image/svg+xml" }, { "file": "images/phone.svg", "size": 1322, "type": "image/svg+xml" }, { "file": "images/position.svg", "size": 1083, "type": "image/svg+xml" }, { "file": "images/profile.png", "size": 14943, "type": "image/png" }, { "file": "images/profile@2x.png", "size": 48928, "type": "image/png" }, { "file": "images/right.svg", "size": 1603, "type": "image/svg+xml" }, { "file": "images/search.svg", "size": 1711, "type": "image/svg+xml" }, { "file": "images/square.svg", "size": 4255, "type": "image/svg+xml" }, { "file": "images/tnt.png", "size": 3439, "type": "image/png" }, { "file": "images/tnt@2x.png", "size": 8237, "type": "image/png" }, { "file": "images/up.svg", "size": 1536, "type": "image/svg+xml" }, { "file": "images/ups.png", "size": 2194, "type": "image/png" }, { "file": "images/ups@2x.png", "size": 6296, "type": "image/png" }, { "file": "images/wechat.svg", "size": 3051, "type": "image/svg+xml" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/data\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return data;
      })
    },
    {
      type: "page",
      pattern: /^\/list\/?$/,
      params: empty,
      a: ["src/routes/list/__layout.reset.svelte", "src/routes/list/index.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/list\/detail\/?$/,
      params: empty,
      a: ["src/routes/list/__layout.reset.svelte", "src/routes/list/detail.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/test\/?$/,
      params: empty,
      a: ["src/routes/test/__layout.reset.svelte", "src/routes/test/index.svelte"],
      b: []
    },
    {
      type: "page",
      pattern: /^\/test\/leaflet\/?$/,
      params: empty,
      a: ["src/routes/test/__layout.reset.svelte", "src/routes/test/leaflet.svelte"],
      b: []
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/list/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset$1;
  }),
  "src/routes/list/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/list/detail.svelte": () => Promise.resolve().then(function() {
    return detail;
  }),
  "src/routes/test/__layout.reset.svelte": () => Promise.resolve().then(function() {
    return __layout_reset;
  }),
  "src/routes/test/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/test/leaflet.svelte": () => Promise.resolve().then(function() {
    return leaflet;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-b2f4f3f4.js", "css": [], "js": ["/./_app/pages/__layout.svelte-b2f4f3f4.js", "/./_app/chunks/vendor-f553da9a.js", "/./_app/chunks/Footer-f5daeb4a.js"], "styles": null }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-082bae32.js", "css": [], "js": ["/./_app/error.svelte-082bae32.js", "/./_app/chunks/vendor-f553da9a.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-21a88009.js", "css": [], "js": ["/./_app/pages/index.svelte-21a88009.js", "/./_app/chunks/vendor-f553da9a.js", "/./_app/chunks/data-20d1c68a.js"], "styles": null }, "src/routes/list/__layout.reset.svelte": { "entry": "/./_app/pages/list/__layout.reset.svelte-1753bc65.js", "css": [], "js": ["/./_app/pages/list/__layout.reset.svelte-1753bc65.js", "/./_app/chunks/vendor-f553da9a.js", "/./_app/chunks/Footer-f5daeb4a.js"], "styles": null }, "src/routes/list/index.svelte": { "entry": "/./_app/pages/list/index.svelte-4bba62ce.js", "css": ["/./_app/assets/LeafletMap-a034d1b7.css"], "js": ["/./_app/pages/list/index.svelte-4bba62ce.js", "/./_app/chunks/vendor-f553da9a.js", "/./_app/chunks/LeafletMap-95f5cc45.js", "/./_app/chunks/preload-helper-08cc8e69.js", "/./_app/chunks/data-20d1c68a.js"], "styles": null }, "src/routes/list/detail.svelte": { "entry": "/./_app/pages/list/detail.svelte-56995ed2.js", "css": [], "js": ["/./_app/pages/list/detail.svelte-56995ed2.js", "/./_app/chunks/vendor-f553da9a.js"], "styles": null }, "src/routes/test/__layout.reset.svelte": { "entry": "/./_app/pages/test/__layout.reset.svelte-007df5f3.js", "css": [], "js": ["/./_app/pages/test/__layout.reset.svelte-007df5f3.js", "/./_app/chunks/vendor-f553da9a.js"], "styles": null }, "src/routes/test/index.svelte": { "entry": "/./_app/pages/test/index.svelte-401772f1.js", "css": [], "js": ["/./_app/pages/test/index.svelte-401772f1.js", "/./_app/chunks/vendor-f553da9a.js"], "styles": null }, "src/routes/test/leaflet.svelte": { "entry": "/./_app/pages/test/leaflet.svelte-3ddeb532.js", "css": ["/./_app/assets/LeafletMap-a034d1b7.css"], "js": ["/./_app/pages/test/leaflet.svelte-3ddeb532.js", "/./_app/chunks/vendor-f553da9a.js", "/./_app/chunks/LeafletMap-95f5cc45.js", "/./_app/chunks/preload-helper-08cc8e69.js"], "styles": null } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var picture1 = "/_app/assets/index1.50543067.png";
var picture2 = "/_app/assets/index2.d2aa803b.png";
var picture3 = "/_app/assets/index3.e75abcb8.png";
var picture4 = "/_app/assets/index4.0a246c37.png";
var picture5 = "/_app/assets/index5.22480d7d.png";
var picture6 = "/_app/assets/index6.473e571b.png";
var warehouses = [
  {
    picture: picture1,
    name: "\u5B89\u7F8E\u96C6\u56E2\u52A0\u62FF\u5927\u6D77\u5916\u4ED3",
    price: "100.00",
    address: "\u52A0\u62FF\u5927\uFF0C\u591A\u4F26\u591A",
    area: "5,356"
  },
  {
    picture: picture2,
    name: "M-Kite\u52A0\u62FF\u5927\u6D77\u5916\u4ED3",
    price: "120.00",
    address: "\u52A0\u62FF\u5927\uFF0C\u591A\u4F26\u591A",
    area: "14,356"
  },
  {
    picture: picture3,
    name: "\u4E2D\u5357\u901A\u8FBE\u52A0\u62FF\u5927\u4ED3",
    price: "123",
    address: "\u52A0\u62FF\u5927\uFF0C\u591A\u4F26\u591A",
    area: "11,000"
  },
  {
    picture: picture4,
    name: "\u4E50\u5929\u901F\u9012\u52A0\u62FF\u5927\u6D77\u5916\u4ED3",
    price: "124.00",
    address: "\u52A0\u62FF\u5927\uFF0C\u591A\u4F26\u591A",
    area: "12,345"
  },
  {
    picture: picture5,
    name: "\u5343\u4E9A\u56FD\u9645\u52A0\u62FF\u5927\u6D77\u5916\u4ED3",
    price: "90.00",
    address: "\u52A0\u62FF\u5927\uFF0C\u591A\u4F26\u591A",
    area: "12,000"
  },
  {
    picture: picture6,
    name: "\u4F18\u7F8E\u8FBE\u52A0\u62FF\u5927\u4ED3",
    price: "99.00",
    address: "\u52A0\u62FF\u5927\uFF0C\u8499\u7279\u5229\u5C14",
    area: "9,000"
  }
];
var data = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  warehouses
});
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"row no-gutters mt-1 mb-3 header"}"><div class="${"col"}"><h1><a href="${"/"}"><img class="${"logo-image"}" src="${"/static/images/logo.png"}" alt="${"Spacebay"}"></a></h1></div>
    <div id="${"login"}" class="${"col d-flex justify-content-end align-items-center"}"><span>\u6CE8\u518C</span>
        <span class="${"register"}">\u767B\u9646</span></div></div>`;
});
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<footer class="${"footer mt-auto"}"><div class="${"row no-gutters"}"><ul class="${"mb-0"}"><li><a href="${"#/"}">\u5173\u4E8ESpacebay</a></li>
            <li><a href="${"#/"}">\u670D\u52A1\u6761\u6B3E</a></li>
            <li><a href="${"#/"}">\u7533\u8BF7\u6536\u5F55</a></li>
            <li><a href="${"#/"}">\u8054\u7CFB\u6211\u4EEC</a></li></ul>
        <div class="${"ml-auto"}">Copyright \xA92021, Spacebay Inc. - All rights reserved
        </div></div></footer>`;
});
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Welcome to Spacebay</title>`, ""}<link rel="${"stylesheet"}" type="${"text/css"}" href="${"/static/css/bootstrap.css"}" data-svelte="svelte-kiltwe"><link rel="${"stylesheet"}" type="${"text/css"}" href="${"/static/css/style.css"}" data-svelte="svelte-kiltwe">`, ""}



<div class="${"container-fluid px-0 pt-3 d-flex flex-column align-items-center"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

    ${slots.default ? slots.default({}) : ``}
    
    ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var Card = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { picture } = $$props;
  let { name } = $$props;
  let { price } = $$props;
  let { address } = $$props;
  let { area } = $$props;
  if ($$props.picture === void 0 && $$bindings.picture && picture !== void 0)
    $$bindings.picture(picture);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.price === void 0 && $$bindings.price && price !== void 0)
    $$bindings.price(price);
  if ($$props.address === void 0 && $$bindings.address && address !== void 0)
    $$bindings.address(address);
  if ($$props.area === void 0 && $$bindings.area && area !== void 0)
    $$bindings.area(area);
  return `<div class="${"col-4 no-gutters d-flex justify-content-center"}"><div class="${"card border-0"}" style="${"width: 22.25rem"}"><img${add_attribute("src", picture, 0)} class="${"card-img-top"}"${add_attribute("alt", name, 0)}>
        <div class="${"card-body"}"><p class="${"card-text"}">${escape2(name)}</p>
            <p class="${"price-text"}">CAD ${escape2(price)}/\u33A1\xB7\u5929</p>
            <p class="${"location-text d-flex flex-row"}"><span class="${"d-flex align-items-center mr-1"}"><img src="${"/static/images/location.svg"}" alt="${""}">${escape2(address)}</span><span class="${"d-flex align-items-center ml-3"}"><img src="${"/static/images/square.svg"}" alt="${""}">${escape2(area)}\u33A1</span></p></div></div></div>`;
});
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
    <div id="${"search"}" class="${"row no-gutters mt-1"}"><div class="${"col d-flex justify-content-center position-relative"}"><img class="${"intro-image"}" src="${"/static/images/intro.png"}" alt="${"Find a space in the world"}">
            <h2 class="${"position-absolute"}">Find a space in the world</h2>
            <div class="${"position-absolute search-wrap"}"><div class="${"search-title"}"><span class="${"title pointer"}">\u6309\u57CE\u5E02</span>
                    <span class="${"ml-5 title active pointer"}">\u6309\u4E9A\u9A6C\u900A</span></div>
                <div class="${"search-content mb-3"}"><img src="${"/static/images/position.svg"}" class="${"ml-2"}" alt="${""}">
                    <input class="${"ml-3 border-0"}" placeholder="${"\u8BF7\u8F93\u5165\u57CE\u5E02\u540D\u79F0"}">
                    <div class="${"icon-bg rounded-circle ml-auto pointer"}"><a href="${"/list"}"><img src="${"/static/images/search.svg"}" alt="${""}"></a></div></div>
                <div class="${"search-box d-none"}">
                    <div class="${"content-show"}"><div class="${"left"}"><span class="${"active"}">\u591A</span>\u4F26\u591A\uFF0C\u5B89\u5927\u7565\u7701\uFF0C\u52A0\u62FF\u5927</div>
                        <div class="${"ml-auto"}">Toronto, Ontario, Canada</div></div>
                    <div class="${"content-show border-0"}"><div class="${"left"}"><span class="${"active"}">\u591A</span>\u4F26\u591A\uFF0C\u5B89\u5927\u7565\u7701\uFF0C\u52A0\u62FF\u5927</div>
                        <div class="${"ml-auto"}">Toronto, Ontario, Canada</div></div></div>
                <div class="${"search-box d-none"}">
                    <div class="${"content-show no-result border-0"}">\u6CA1\u6709\u76F8\u5173\u641C\u7D22\u7ED3\u679C
                    </div></div></div></div></div>
    <div id="${"amazon"}"><h3 class="${"text-center"}">\u4E9A\u9A6C\u900A\u8F6C\u8FD0\u4ED3\u63A8\u8350</h3>
        <div class="${"d-flex justify-content-center mb-4"}"><div class="${"tag tag-chosen"}">YYZ1
            </div>
            <div class="${"tag ml-3"}">YYZ2
            </div>
            <div class="${"tag ml-3"}">YYZ3
            </div>
            <div class="${"tag ml-3"}">YYZ4
            </div></div>

        <div class="${"row pt-2 no-gutters mb-5 pb-1"}">${warehouses.length ? each(warehouses, (warehouse) => `${validate_component(Card, "Card").$$render($$result, Object.assign(warehouse), {}, {})}`) : `<p>loading</p>`}</div></div>

`;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var Header2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"row no-gutters mt-1 mb-3 header"}"><div class="${"col"}"><h1><a href="${"/"}"><img class="${"logo-image"}" src="${"/static/images/logo.png"}" alt="${"Spacebay"}"></a></h1></div>
    <div class="${"col d-flex align-items-center"}"><div class="${"list-search"}"><input type="${"text"}" class="${"ml-3 border-0"}" placeholder="${"\u591A\u4F26\u591A\u5E02\uFF0C\u5B89\u5927\u7565\u7701\uFF0C\u52A0\u62FF\u5927"}">
            <div class="${"icon-bg rounded-circle ml-auto pointer mr-0"}"><img src="${"/static/images/search.svg"}" alt="${""}"></div></div></div></div>`;
});
var _layout_reset$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<link rel="${"stylesheet"}" type="${"text/css"}" href="${"/static/css/bootstrap.css"}" data-svelte="svelte-omjkmi"><link rel="${"stylesheet"}" type="${"text/css"}" href="${"/static/css/style.css"}" data-svelte="svelte-omjkmi">`, ""}



<div class="${"container-fluid px-0 pt-3 d-flex flex-column align-items-center"}">${validate_component(Header2, "Header2").$$render($$result, {}, {}, {})}

    ${slots.default ? slots.default({}) : ``}
    
    ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div>`;
});
var __layout_reset$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset$1
});
var css = {
  code: "@import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';main.svelte-7asa5b #map.svelte-7asa5b{height:800px}",
  map: `{"version":3,"file":"LeafletMap.svelte","sources":["LeafletMap.svelte"],"sourcesContent":["<script>\\r\\n    import { onMount } from 'svelte';\\r\\n    import { browser } from '$app/env';\\r\\n\\r\\n    onMount(async () => {\\r\\n        if(browser) {\\r\\n            const leaflet = await import('leaflet');\\r\\n\\r\\n            const map = leaflet.map('map').setView([51.505, -0.09], 13);\\r\\n\\r\\n            leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {\\r\\n                attribution: 'Map data &copy; <a href=\\"https://www.openstreetmap.org/copyright\\">OpenStreetMap</a> contributors, Imagery \xA9 <a href=\\"https://www.mapbox.com/\\">Mapbox</a>',\\r\\n                maxZoom: 18,\\r\\n                id: 'mapbox/streets-v11',\\r\\n                tileSize: 512,\\r\\n                zoomOffset: -1,\\r\\n                accessToken: 'pk.eyJ1Ijoia2VlcHNpbXBsZXIiLCJhIjoiY2tyMzA5a3g1MHB1ZjMxcnhuYzB1bjI0bSJ9.Fm9sa9ko_x-BNr2y4HxM3Q'\\r\\n            }).addTo(map);\\r\\n\\r\\n            // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\\r\\n            //     attribution: '\xA9 <a href=\\"https://www.openstreetmap.org/copyright\\">OpenStreetMap</a> contributors'\\r\\n            // }).addTo(map);\\r\\n\\r\\n            leaflet.marker([40.6483, -74.0237]).addTo(map)\\r\\n                .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')\\r\\n                .openPopup();\\r\\n        }\\r\\n    });\\r\\n<\/script>\\r\\n\\r\\n\\r\\n<main>\\r\\n    <div id=\\"map\\"></div>\\r\\n</main>\\r\\n\\r\\n<style>\\r\\n    @import 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';\\r\\n    main #map {\\r\\n        height: 800px;\\r\\n    }\\r\\n</style>"],"names":[],"mappings":"AAoCI,QAAQ,kDAAkD,CAAC,AAC3D,kBAAI,CAAC,IAAI,cAAC,CAAC,AACP,MAAM,CAAE,KAAK,AACjB,CAAC"}`
};
var LeafletMap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<main class="${"svelte-7asa5b"}"><div id="${"map"}" class="${"svelte-7asa5b"}"></div>
</main>`;
});
var List = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<link rel="${"stylesheet"}" type="${"text/css"}" href="${"/static/css/bootstrap.css"}" data-svelte="svelte-sixknz"><link rel="${"stylesheet"}" type="${"text/css"}" href="${"/static/css/style.css"}" data-svelte="svelte-sixknz">`, ""}




    <div id="${"select"}" class="${"select-wrap"}"><div class="${"row no-gutters"}"><div class="${"col d-flex align-items-center"}"><div class="${"text"}">6836\u6761\u8BB0\u5F55</div>
                <div class="${"select-box pointer"}"><div>\u4ED3\u5E93\u9762\u79EF\u4E0D\u9650</div>
                    <div class="${"ml-auto"}"><img src="${"/static/images/down.svg"}" alt="${""}"></div></div>
                <div class="${"select-box pointer"}"><div>\u4ED3\u5E93\u4EF7\u683C\u4E0D\u9650</div>
                    <div class="${"ml-auto"}"><img src="${"/static/images/down.svg"}" alt="${""}"></div></div>
                <div class="${"select-box pointer"}" style="${"width: 7.25rem"}"><div>\u66F4\u591A</div>
                    <div class="${"ml-auto"}"><img src="${"/static/images/down.svg"}" alt="${""}"></div></div>

                <div class="${"select-box active position-relative d-none"}">
                    <div>\u4ED3\u5E93\u9762\u79EF\u4E0D\u9650</div>
                    <div class="${"ml-auto"}"><img src="${"/static/images/up.svg"}" alt="${""}"></div>
                    <div class="${"select-show position-absolute"}"><div class="${"select-content"}">\u4ED3\u5E93\u9762\u79EF\u4E0D\u9650</div>
                        <div class="${"select-content"}">0-5000\u33A1</div>
                        <div class="${"select-content"}">5001-10,000\u33A1</div>
                        <div class="${"select-content"}">20,000\u33A1\u4EE5\u4E0A</div></div></div>
                <div class="${"select-box active position-relative d-none"}" style="${"width: 7.25rem"}">
                    <div>\u66F4\u591A</div>
                    <div class="${"ml-auto"}"><img src="${"/static/images/up.svg"}" alt="${""}"></div>
                    <div class="${"select-show position-absolute pb-0"}"><div class="${"custom-control custom-checkbox ml-3 mb-3 mt-2"}"><input type="${"checkbox"}" class="${"custom-control-input"}" id="${"customCheck1"}">
                            <label class="${"custom-control-label"}" for="${"customCheck1"}">\u7279\u5F811</label></div>
                        <div class="${"custom-control custom-checkbox ml-3 mb-3 mt-1"}"><input type="${"checkbox"}" class="${"custom-control-input"}" id="${"customCheck2"}">
                            <label class="${"custom-control-label"}" for="${"customCheck2"}">\u7279\u5F812</label></div>
                        <div class="${"custom-control custom-checkbox ml-3 mb-3 mt-1"}"><input type="${"checkbox"}" class="${"custom-control-input"}" id="${"customCheck3"}">
                            <label class="${"custom-control-label"}" for="${"customCheck3"}">\u7279\u5F813</label></div>
                        <div class="${"custom-control custom-checkbox ml-3 mb-4 mt-1"}"><input type="${"checkbox"}" class="${"custom-control-input"}" id="${"customCheck4"}">
                            <label class="${"custom-control-label"}" for="${"customCheck4"}">\u7279\u5F814</label></div>
                        <div class="${"mt-auto confirm pointer"}">\u786E\u8BA4</div></div></div></div></div></div>
    <div id="${"list"}" class="${"row no-gutters w-100"}"><div class="${"col-7 pb-4"}"><div class="${"row no-gutters p-4 mt-3 w-100"}">${warehouses.length ? each(warehouses, (warehouse) => `<div class="${"col-6 no-gutters d-flex justify-content-center"}"><div class="${"card border-0"}" style="${"width: 92%"}"><a href="${"/list/detail"}"><img${add_attribute("src", warehouse.picture, 0)} class="${"card-img-top"}"${add_attribute("alt", warehouse.name, 0)}></a>
                        <div class="${"card-body"}"><p class="${"card-text"}">${escape2(warehouse.name)}</p>
                            <p class="${"price-text"}">CAD ${escape2(warehouse.price)}/\u33A1\xB7\u5929</p>
                            <p class="${"location-text d-flex flex-row"}"><span class="${"d-flex align-items-center mr-1"}"><img src="${"/static/images/location.svg"}" alt="${""}">${escape2(warehouse.address)}</span><span class="${"d-flex align-items-center ml-3"}"><img src="${"/static/images/square.svg"}" alt="${""}">${escape2(warehouse.area)}\u33A1</span></p>
                        </div></div>
                </div>`) : `<p>loading</p>`}</div>
            <div class="${"mt-auto d-flex flex-row justify-content-center w-100"}"><div class="${"d-flex flex-row align-items-center mb-3"}"><div class="${"page-no-bg"}"><img src="${"/static/images/left.svg"}" alt="${""}"></div>
                    <div class="${"page-no ml-3 page-no-active"}">1</div>
                    <div class="${"page-no ml-3"}">2</div>
                    <div class="${"page-no ml-3"}">3</div>
                    <div class="${"page-no ml-3"}">4</div>
                    <div class="${"page-no ml-3"}">5</div>
                    <div class="${"ml-3"}">...</div>
                    <div class="${"page-no ml-3"}">10</div>
                    <div class="${"page-no-bg ml-3"}"><img src="${"/static/images/right.svg"}" alt="${""}"></div>
                    <div class="${"ml-3"}">\u8DF3\u81F3</div>
                    <div class="${"page-no-box ml-3"}"><input type="${"number"}" class="${"border-0 text-center"}"></div>
                    <div class="${"ml-3"}">\u9875</div></div></div></div>
        <div class="${"col-5 "}">${validate_component(LeafletMap, "LeafletMap").$$render($$result, {}, {}, {})}</div></div>
`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": List
});
var Detail = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
    <div class="${"separate-line"}"></div>
    <div id="${"dtitle"}" class="${"row no-gutters mt-4 mb-1"}"><h4 class="${"m-0"}">M-Kite\u52A0\u62FF\u5927\u6D77\u5916\u4ED3
        </h4>
        <div class="${"col d-flex justify-content-end align-items-end"}">CAD <span>120.00</span>/\u33A1\xB7\u5929
            <small>\u8D77</small></div></div>
    <div id="${"dlocation"}" class="${"row no-gutters mt-2 mb-4"}"><img src="${"/static/images/location.svg"}" alt="${""}"><span class="${"ml-1"}">4178  Adelaide St, Toronto, Ontario, M5H 1P6, Canada</span></div>
    <div id="${"dpic"}" class="${"row no-gutters"}"><div class="${"col"}"><img src="${"/static/images/detail1.png"}" alt="${""}"></div>
        <div class="${"col right-pic ml-3"}"><div class="${"row no-gutters"}" style="${"width: 16.4375rem"}"><div class="${"col-12"}"><img src="${"/static/images/detail2.png"}" alt="${""}"></div>
                <div class="${"col-12 mt-3"}"><img src="${"/static/images/detail3.png"}" alt="${""}"></div>
                <div class="${"col-12 mt-3"}"><img src="${"/static/images/detail4.png"}" alt="${""}"></div></div></div></div>
    <div id="${"dcontact"}" class="${"row no-gutters"}"><div class="${"col"}"><div class="${"title"}">\u8054\u7CFB\u65B9\u5F0F</div>
            <div class="${"d-flex align-items-center"}"><img src="${"/static/images/profile.png"}" alt="${""}" class="${"mr-1 rounded-circle"}">
                <div class="${"right-content ml-2"}"><div class="${"name"}">Tim Zhouspan<span class="${"ml-3"}">\u4E2D</span><span>\u82F1</span></div>
                    <div class="${"d-flex align-items-center"}"><span><img src="${"/static/images/phone.svg"}" alt="${""}" class="${"mr-2"}">+1 416-505-5409</span>
                        <span><img src="${"/static/images/email.svg"}" alt="${""}" class="${"mr-2"}">timzhou@mkite.com</span>
                        <span><img src="${"/static/images/wechat.svg"}" alt="${""}" class="${"mr-2"}">timzhou1234</span></div></div></div></div></div>
    <div id="${"dintro"}" class="${"row no-gutters"}"><div class="${"col"}"><div class="${"title"}">\u4ED3\u5E93\u4ECB\u7ECD</div>
            <p>M-Kite\u52A0\u62FF\u5927\u6D77\u5916\u4ED3\u4E13\u6CE8\u4E8E\u52A0\u62FF\u5927\u5E02\u573A\u7684\u8FDB\u51FA\u53E3\u3001\u4ED3\u50A8\u53CA\u7269\u6D41\u670D\u52A1\u4E0A\u6709\u774010\u4E8E\u5E74\u7684\u4E30\u5BCC\u7ECF\u9A8C\u3002\u73B0\u6709\u591A\u4F26\u591A\u6D77\u5916\u4ED3\uFF0C\u6E29\u54E5\u534E\u6D77\u5916\u4ED3\u548C\u57C3\u5FB7\u8499\u987F\u6D77\u5916\u4ED3\u5171\u8BA1100000\u5E73\u65B9\u5C3A\uFF0C\u4ED3\u5E93\u5458\u5DE560\u4F59\u4EBA\u548C\u4E13\u4E1A\u7684\u81EA\u8425\u7269\u6D41\u8F66\u961F\u3002\u73B0\u4ED3\u5E93\u5747\u4F4D\u4E8E\u5404\u5927FBA\u4ED3\u5E93\u533A\u57DF\u7684\u7269\u6D41\u6838\u5FC3\u5730\u5E26\uFF0C\u80FD\u6709\u6548\u7684\u8282\u7701\u4E86\u672C\u571F\u7269\u6D41\u8D39\u7528\u548C\u8FD0\u8F93\u5468\u671F\u3002M-Kite\u5728\u52A0\u62FF\u5927\u548C\u4E2D\u56FD\u7684\u516C\u53F8\u5747\u5EFA\u7ACB\u4E86\u4E13\u4E1A\u7684\u672C\u571F\u56E2\u961F\u3002\u51ED\u501F\u56FD\u5916\u5BA2\u670D\u7684\u5B9E\u65F6\u670D\u52A1\u3001\u667A\u80FD\u8BA2\u5355\u5904\u7406\u7CFB\u7EDF\u3001\u9AD8\u6548\u7684\u4ED3\u5E93\u8FD0\u8F6C\u6A21\u5F0F\u548C\u4E13\u4E1A\u7684\u8FD0\u8F93\u6E20\u9053\u7684\u4F18\u52BF\uFF0CM-Kite\u5C06\u52A9\u529B\u5BA2\u6237\u5F00\u62D3\u52A0\u62FF\u5927\u5E02\u573A\u3001\u8282\u7701\u7269\u6D41\u6210\u672C\u3001\u63D0\u9AD8\u8FD0\u8F6C\u6548\u7387\uFF0C\u548C\u6210\u529F\u6253\u9020\u6D77\u5916\u54C1\u724C\u3002</p>
            <p class="${"d-flex align-items-center"}"><img src="${"/static/images/square.svg"}" alt="${""}" class="${"mr-2"}">\u9762\u79EF\uFF1A5,356\u33A1</p>
            <p class="${"d-flex align-items-center"}"><img src="${"/static/images/order.svg"}" alt="${""}" class="${"mr-2"}">\u8BA2\u5355\u5904\u7406\u91CF: 10000</p>
            <p class="${"d-flex align-items-center"}"><img src="${"/static/images/e-commerce.svg"}" alt="${""}" class="${"mr-2"}">\u5927\u8D27: \u4E0D\u652F\u6301</p>
            <div class="${"property"}"><span>\u95EA\u7535\u5B9A\u4ED3</span>
                <span>\u95EA\u7535\u4EE3\u53D1</span>
                <span>\u517C\u804C\u5BA2\u670D</span></div></div></div>
    <div id="${"dcompany"}" class="${"row no-gutters"}"><div class="${"col"}"><div class="${"title"}">\u5C3E\u7A0B\u5FEB\u9012\u516C\u53F8</div>
            <div><span><img src="${"/static/images/ups.png"}" alt="${"UPS"}"></span><span><img src="${"/static/images/fedex.png"}" alt="${"FedEx"}"></span><span><img src="${"/static/images/dhl.png"}" alt="${"DHL"}"></span><span><img src="${"/static/images/tnt.png"}" alt="${"TNT"}"></span><span><img src="${"/static/images/fba.png"}" alt="${"FBA"}"></span></div></div></div>
    <div id="${"dprice"}" class="${"row no-gutters"}"><div class="${"col"}"><div class="${"title"}">\u670D\u52A1\u4E0E\u62A5\u4EF7</div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon0.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u6574\u67DC\u5378\u67DC\u8D39\u7528</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 320.00</div>
                    <div class="${"mt-3"}">CAD 420.00</div>
                    <div class="${"mt-3"}">CAD 450.00</div>
                    <div class="${"mt-3"}">CAD 500.00</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>20GP</div>
                    <div class="${"mt-3"}">40GP</div>
                    <div class="${"mt-3"}">40HQ</div>
                    <div class="${"mt-3"}">45HQ</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon1.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u8D85\u91CD\u8D27\u7269\u5378\u67DC\u989D\u5916\u8D39\u7528</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 1.00/\u4E2A</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u6574\u67DC\u6709\u8D85\u8FC715\u4EF6\u5355\u7BB1\u8D85\u8FC722.00\u516C\u65A4, 200\u52A0\u5E01\u5C01\u9876</div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon2.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u8D85\u591A\u4EF6\u6570\u5378\u67DC\u989D\u5916\u52A0\u6536\u8D39\u7528</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 100.00</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>20\u5C3A\u67DC\u8D85\u8FC7500\u4EF6\uFF0C40\u5C3A\u67DC\u8D85\u8FC71000\u4EF6\uFF0C45\u5C3A\u8D85\u8FC71000\u4EF6</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon3.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u4E0D\u89C4\u5219\u4F53\u79EF\u8D27\u7269\u6253\u6258\u7279\u6B8A\u6258\u76D8</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 56.00/\u6258\u76D8</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u5E73\u677F\u5F62\uFF0C\u957F\u6761\u5F62\u7B49\u4E0D\u89C4\u5219\u8D27\u7269\uFF0C\u6309\u7167\u5E38\u89C4\u6253\u677F\u89C4\u683C\u5F88\u96BE\u6253\u677F\u7684\u8D27\u7269\u542B\u62C9\u4F38\u819C\u53CA
                        \u4EBA\u5DE5\u8D39\uFF0C\u4E0D\u6EE1\u4E00\u6258\u6309\u4E00\u6258\u7B97\uFF0C\u6B64\u7279\u6B8A\u6258\u677F\u9700\u5B9A\u5236\u8BF7\u63D0\u524D\u544A\u77E5
                    </div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon4.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u6253\u6258\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 15.00/\u6258\u76D8</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u542B\u62C9\u4F38\u819C\u53CA\u4EBA\u5DE5\u8D39\uFF0C\u4E0D\u6EE1\u4E00\u6258\u6309\u4E00\u6258\u7B97\uFF0C\u9AD8\u5EA6\u8981\u6C42\u8BF7\u63D0\u524D\u544A\u77E5</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon5.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u91CD\u65B0\u6253\u6258\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 15.00/\u6258\u76D8</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u542B\u62C9\u4F38\u819C\u53CA\u4EBA\u5DE5\u8D39\uFF0C\u4E0D\u6EE1\u4E00\u6258\u6309\u4E00\u6258\u7B97\uFF0C\u9AD8\u5EA6\u8981\u6C42\u8BF7\u63D0\u524D\u544A\u77E5</div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon6.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u5206\u8D27\u8D39/\u91CD\u65B0\u5206\u8D27\u8D39\uFF08\u6B63\u5E38\uFF09</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 0.35/\u7BB1</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u6309\u7167FBA\u4ED3\u5E93\u4EE3\u7801\u5206\u8D27\uFF0C\u9700\u63D0\u524D\u63D0\u4F9B\u5206\u8D27\u6587\u4EF6\u53CA\u6E05</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon15.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u5206\u8D27\u8D39/\u91CD\u65B0\u5206\u8D27\u8D39\uFF08\u7279\u6B8A\uFF09</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 0.50/\u7BB1</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u6309\u7167FBA\u53F7\u7801\u5206\u8D27\uFF0C\u9700\u63D0\u524D\u63D0\u4F9B\u5206\u8D27\u6587\u4EF6\u53CA\u6E05\u5355\uFF0C\u6216\u8005\u8D27\u7269\u5355\u7BB1\u91CD\u91CF\u8D85\u8FC7
                        22.00kg/\u7BB1
                    </div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon7.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u8FDB\u4ED3\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 5.00/\u6258\u677F</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u57FA\u672C\u6258\u677F\u51FA\u5E93\uFF0C\u88C5\u5378\u8F66\u64CD\u4F5C\uFF0C\u4E0D\u542B\u989D\u5916\u5DE5\u4F5C</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon8.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u51FA\u4ED3\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 5.00/\u6258\u677F</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u57FA\u672C\u6258\u677F\u51FA\u5E93\uFF0C\u88C5\u5378\u8F66\u64CD\u4F5C\uFF0C\u4E0D\u542B\u989D\u5916\u5DE5\u4F5C</div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon16.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u8D34\u6807\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 0.70/\u4E2A</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u8D34\u7BB1\u5185\u6807\u7B7E\uFF0C\u6309\u6807\u7B7E\u4E2A\u6570\u6536\u8D39\uFF0C\u6700\u4F4E5.00\u52A0\u5E01\u8D77\u6536</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon9.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u6362\u6807\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 0.50/\u4E2A</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u6309\u6807\u7B7E\u4E2A\u6570\u6536\u8D39\uFF0C\u6700\u4F4E5.00\u52A0\u5E01\u8D77\u6536</div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon10.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">FBA\u5361\u6D3E\u9884\u7EA6\u8D39</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 25.00/\u6B21</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>\u6309\u6B21\u6536\u8D39\uFF0C\u9700\u63D0\u524D\u63D0\u4F9B\u6709\u6548FBA\u53F7\u548CPO\u53F7</div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon11.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u672C\u5730\u5361\u8F66\u6D3E\u9001\u8D39\u7528</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 30.00/\u6258\u76D8</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div>53&#39;\u6574\u67DC\u4EF7\u683C350\u52A0\u5E01\u30021\u5C0F\u65F6\u514D\u8D39\u7B49\u5019\u65F6\u95F4\uFF0C\u4E4B\u540E65\u52A0\u5E01\u6BCF\u5C0F\u65F6\u3002</div></div></div>
            <div class="${"ctable"}"><div><img src="${"/static/images/icon12.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u5F02\u5730\u5361\u8F66\u6D3E\u9001\u8D39\u7528</div>
                <div class="${"d-flex flex-column pl-5"}"><div class="${"d-flex flex-row"}"><div class="${"d-flex flex-column price pt-1"}"><div class="${"ml-adjust"}">CAD 340.00/\u6258\u76D8</div></div>
                        <div class="${"d-flex flex-column remark pt-1"}"><div class="${"ml-adjust"}">YYZ1-9\u30021\u5C0F\u65F6\u514D\u8D39\u7B49\u5019\u65F6\u95F4\uFF0C\u4E4B\u540E65\u52A0\u5E01\u6BCF\u5C0F\u65F6\uFF0C53&#39;\u6574\u67DC\u4EF7\u683C4950\u52A0\u5E01\u3002</div></div></div>
                    <div class="${"d-flex flex-row"}"><div class="${"d-flex flex-column price pt-1"}"><div class="${"mt-3 ml-adjust"}">CAD 330.00/\u6258\u76D8</div></div>
                        <div class="${"d-flex flex-column remark pt-1"}"><div class="${"mt-3 ml-adjust"}">YOW1\u30021\u5C0F\u65F6\u514D\u8D39\u7B49\u5019\u65F6\u95F4\uFF0C\u4E4B\u540E65\u52A0\u5E01\u6BCF\u5C0F\u65F6\u3002</div></div></div>
                    <div class="${"d-flex flex-row"}"><div class="${"d-flex flex-column price pt-1"}"><div class="${"mt-3 ml-adjust"}">CAD 220.00/\u6258\u76D8</div></div>
                        <div class="${"d-flex flex-column remark pt-1"}"><div class="${"mt-3 ml-adjust"}">YYC1\u30021\u5C0F\u65F6\u514D\u8D39\u7B49\u5019\u65F6\u95F4\uFF0C\u4E4B\u540E65\u52A0\u5E01\u6BCF\u5C0F\u65F6</div></div></div>
                    <div class="${"d-flex flex-row"}"><div class="${"d-flex flex-column price pt-1"}"><div class="${"mt-3 ml-adjust"}">CAD 260.00/\u6258\u76D8</div></div>
                        <div class="${"d-flex flex-column remark pt-1"}"><div class="${"mt-3 ml-adjust"}">YEG1\u30021\u5C0F\u65F6\u514D\u8D39\u7B49\u5019\u65F6\u95F4\uFF0C\u4E4B\u540E65\u52A0\u5E01\u6BCF\u5C0F\u65F6</div></div></div></div></div>
            <div class="${"ctable bg-white"}"><div><img src="${"/static/images/icon13.svg"}" alt="${""}"></div>
                <div class="${"item pt-1"}">\u4E00\u4EF6\u4EE3\u53D1</div>
                <div class="${"d-flex flex-column price pt-1"}"><div>CAD 30.00/\u95F4</div></div>
                <div class="${"d-flex flex-column remark pt-1"}"><div></div></div></div></div></div>
`;
});
var detail = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Detail
});
var _layout_reset = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"h-16 w-full flex flex-row justify-center items-stretch space-x-8 text-lg"}"><a href="${"/"}">Home</a>
    <a href="${"/test/header"}">Header</a>
    <a href="${"/test/footer"}">Footer</a>
    <a href="${"/test/search"}">Search</a>
    <a href="${"/test/card"}">Card</a>
    <a href="${"/test/leaflet"}">Leaflet</a>
    <a href="${"/test/header2"}">Header for List Page</a>
    <a href="${"/test/selectMenu"}">Select Menu</a></div>
${slots.default ? slots.default({}) : ``}`;
});
var __layout_reset = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout_reset
});
var Test = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"bg-green-300 border-green-600 border-b p-4 m-4 rounded text-center text-xl"}">This route is going to test the components.
</div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Test
});
var Leaflet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `
	${validate_component(LeafletMap, "LeafletMap").$$render($$result, {}, {}, {})}
`;
});
var leaflet = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Leaflet
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
