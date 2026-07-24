import http$2 from 'node:http';
import https$2 from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import * as nodeCrypto from 'node:crypto';
import { createHash } from 'node:crypto';
import * as fs$1 from 'fs';
import * as googleAuthLibrary from 'google-auth-library';
import * as fastDeepEqual from 'fast-deep-equal';
import * as http$1 from 'http';
import * as https$1 from 'https';
import * as http2$1 from 'http2';
import * as url$1 from 'url';
import * as events from 'events';
import * as busboy from '@fastify/busboy';
import * as zlib from 'zlib';
import * as jsonwebtoken from 'jsonwebtoken';
import * as jwksRsa from 'jwks-rsa';
import * as standalone from '@firebase/database-compat/standalone';
import * as path$1 from 'path';
import { jwtVerify, SignJWT } from 'jose';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
  return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex !== -1) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$2(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [name, opts.domain || "", opts.path || "/"].join(";");
}

function parseCookies(event) {
  return parse(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$2(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function deleteCookie(event, name, serializeOptions) {
  setCookie(event, name, "", {
    ...serializeOptions,
    maxAge: 0
  });
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http$2.Agent(agentOptions);
  const httpsAgent = new https$2.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
const ofetch = createFetch({ fetch, Headers: Headers$1, AbortController });
const $fetch = ofetch;

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

function isEqual(object1, object2) {
  if (object1 === object2) {
    return true;
  }
  if (serialize$1(object1) === serialize$1(object2)) {
    return true;
  }
  return false;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "5eecf048-aa4e-4891-a5ea-fd4fa0435c29",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false,
        "isr": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "firebaseApiKey": "",
    "firebaseAuthDomain": "",
    "firebaseProjectId": "",
    "firebaseStorageBucket": "",
    "firebaseMessagingSenderId": "",
    "firebaseAppId": "",
    "firebaseDatabaseUrl": ""
  },
  "geminiApiKey": "",
  "openrouterApiKey": "",
  "ocrSpaceApiKey": ""
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
  const restores = [];
  for (const leaveHandler of asyncHandlers) {
    const restore2 = leaveHandler();
    if (restore2) {
      restores.push(restore2);
    }
  }
  const restore = () => {
    for (const restore2 of restores) {
      restore2();
    }
  };
  let awaitable = function_();
  if (awaitable && typeof awaitable === "object" && "catch" in awaitable) {
    awaitable = awaitable.catch((error) => {
      restore();
      throw error;
    });
  }
  return [awaitable, restore];
}

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await import('./error-500.mjs');
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

function defineNitroPlugin(def) {
  return def;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

var app = {};

var utils$4 = {};

var credentialInternal = {};

const require$$1$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(fs$1);

const require$$4$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(nodeCrypto);

const require$$2$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(googleAuthLibrary);

var error = {};

var deepCopy$1 = {};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(deepCopy$1, "__esModule", { value: true });
deepCopy$1.deepCopy = deepCopy;
deepCopy$1.deepExtend = deepExtend;
/**
 * Returns a deep copy of an object or array.
 *
 * @param value - The object or array to deep copy.
 * @returns A deep copy of the provided object or array.
 */
function deepCopy(value) {
    return deepExtend(undefined, value);
}
/**
 * Copies properties from source to target (recursively allows extension of objects and arrays).
 * Scalar values in the target are over-written. If target is undefined, an object of the
 * appropriate type will be created (and returned).
 *
 * We recursively copy all child properties of plain objects in the source - so that namespace-like
 * objects are merged.
 *
 * Note that the target can be a function, in which case the properties in the source object are
 * copied onto it as static properties of the function.
 *
 * @param target - The value which is being extended.
 * @param source - The value whose properties are extending the target.
 * @returns The target value.
 */
function deepExtend(target, source) {
    if (!(source instanceof Object)) {
        return source;
    }
    switch (source.constructor) {
        case Date: {
            // Treat Dates like scalars; if the target date object had any child
            // properties - they will be lost!
            const dateValue = source;
            return new Date(dateValue.getTime());
        }
        case Object:
            if (target === undefined) {
                target = {};
            }
            break;
        case Array:
            // Always copy the array source and overwrite the target.
            target = [];
            break;
        default:
            // Not a plain Object - treat it as a scalar.
            return source;
    }
    for (const prop in source) {
        if (!Object.prototype.hasOwnProperty.call(source, prop)) {
            continue;
        }
        target[prop] = deepExtend(target[prop], source[prop]);
    }
    return target;
}

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(error, "__esModule", { value: true });
error.InstanceIdClientErrorCode = error.InstallationsClientErrorCode = error.MessagingClientErrorCode = error.AuthClientErrorCode = error.AppErrorCodes = error.FirebaseProjectManagementError = error.FirebaseMessagingSessionError = error.FirebaseMessagingError = error.FirebaseInstallationsError = error.FirebaseInstanceIdError = error.FirebaseFirestoreError = error.FirebaseDatabaseError = error.FirebaseAuthError = error.FirebaseAppError = error.PrefixedFirebaseError = error.FirebaseError = void 0;
const deep_copy_1$6 = deepCopy$1;
/**
 * Firebase error code structure. This extends Error.
 */
class FirebaseError extends Error {
    /**
     * @param errorInfo - The error information (code and message).
     * @constructor
     * @internal
     */
    constructor(errorInfo) {
        super(errorInfo.message);
        this.errorInfo = errorInfo;
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = FirebaseError.prototype;
    }
    /** @returns The error code. */
    get code() {
        return this.errorInfo?.code;
    }
    /** @returns The error message. */
    get message() {
        return this.errorInfo?.message;
    }
    /** @returns The object representation of the error. */
    toJSON() {
        return {
            code: this.code,
            message: this.message,
        };
    }
}
error.FirebaseError = FirebaseError;
/**
 * A FirebaseError with a prefix in front of the error code.
 */
class PrefixedFirebaseError extends FirebaseError {
    /**
     * @param codePrefix - The prefix to apply to the error code.
     * @param code - The error code.
     * @param message - The error message.
     * @constructor
     * @internal
     */
    constructor(codePrefix, code, message) {
        super({
            code: `${codePrefix}/${code}`,
            message,
        });
        this.codePrefix = codePrefix;
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = PrefixedFirebaseError.prototype;
    }
    /**
     * Allows the error type to be checked without needing to know implementation details
     * of the code prefixing.
     *
     * @param code - The non-prefixed error code to test against.
     * @returns True if the code matches, false otherwise.
     */
    hasCode(code) {
        return `${this.codePrefix}/${code}` === this.code;
    }
}
error.PrefixedFirebaseError = PrefixedFirebaseError;
/**
 * Firebase App error code structure. This extends PrefixedFirebaseError.
 */
class FirebaseAppError extends PrefixedFirebaseError {
    /**
     * @param code - The error code.
     * @param message - The error message.
     * @constructor
     * @internal
     */
    constructor(code, message) {
        super('app', code, message);
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = FirebaseAppError.prototype;
    }
}
error.FirebaseAppError = FirebaseAppError;
/**
 * Firebase Auth error code structure. This extends PrefixedFirebaseError.
 */
class FirebaseAuthError extends PrefixedFirebaseError {
    /**
     * Creates the developer-facing error corresponding to the backend error code.
     *
     * @param serverErrorCode - The server error code.
     * @param [message] The error message. The default message is used
     *     if not provided.
     * @param [rawServerResponse] The error's raw server response.
     * @returns The corresponding developer-facing error.
     * @internal
     */
    static fromServerError(serverErrorCode, message, rawServerResponse) {
        // serverErrorCode could contain additional details:
        // ERROR_CODE : Detailed message which can also contain colons
        const colonSeparator = (serverErrorCode || '').indexOf(':');
        let customMessage = null;
        if (colonSeparator !== -1) {
            customMessage = serverErrorCode.substring(colonSeparator + 1).trim();
            serverErrorCode = serverErrorCode.substring(0, colonSeparator).trim();
        }
        // If not found, default to internal error.
        const clientCodeKey = AUTH_SERVER_TO_CLIENT_CODE[serverErrorCode] || 'INTERNAL_ERROR';
        const error = (0, deep_copy_1$6.deepCopy)(AuthClientErrorCode[clientCodeKey]);
        // Server detailed message should have highest priority.
        error.message = customMessage || message || error.message;
        if (clientCodeKey === 'INTERNAL_ERROR' && typeof rawServerResponse !== 'undefined') {
            try {
                error.message += ` Raw server response: "${JSON.stringify(rawServerResponse)}"`;
            }
            catch (e) {
                // Ignore JSON parsing error.
            }
        }
        return new FirebaseAuthError(error);
    }
    /**
     * @param info - The error code info.
     * @param message - The error message. This will override the default message if provided.
     * @constructor
     * @internal
     */
    constructor(info, message) {
        // Override default message if custom message provided.
        super('auth', info.code, message || info.message);
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = FirebaseAuthError.prototype;
    }
}
error.FirebaseAuthError = FirebaseAuthError;
/**
 * Firebase Database error code structure. This extends FirebaseError.
 */
let FirebaseDatabaseError$1 = class FirebaseDatabaseError extends FirebaseError {
    /**
     * @param info - The error code info.
     * @param message - The error message. This will override the default
     *     message if provided.
     * @constructor
     * @internal
     */
    constructor(info, message) {
        // Override default message if custom message provided.
        super({ code: 'database/' + info.code, message: message || info.message });
    }
};
error.FirebaseDatabaseError = FirebaseDatabaseError$1;
/**
 * Firebase Firestore error code structure. This extends FirebaseError.
 */
class FirebaseFirestoreError extends FirebaseError {
    /**
     * @param info - The error code info.
     * @param message - The error message. This will override the default
     *     message if provided.
     * @constructor
     * @internal
     */
    constructor(info, message) {
        // Override default message if custom message provided.
        super({ code: 'firestore/' + info.code, message: message || info.message });
    }
}
error.FirebaseFirestoreError = FirebaseFirestoreError;
/**
 * Firebase instance ID error code structure. This extends FirebaseError.
 */
class FirebaseInstanceIdError extends FirebaseError {
    /**
     *
     * @param info - The error code info.
     * @param message - The error message. This will override the default
     *     message if provided.
     * @constructor
     * @internal
     */
    constructor(info, message) {
        // Override default message if custom message provided.
        super({ code: 'instance-id/' + info.code, message: message || info.message });
        this.__proto__ = FirebaseInstanceIdError.prototype;
    }
}
error.FirebaseInstanceIdError = FirebaseInstanceIdError;
/**
 * Firebase Installations service error code structure. This extends `FirebaseError`.
 */
class FirebaseInstallationsError extends FirebaseError {
    /**
     *
     * @param info - The error code info.
     * @param message - The error message. This will override the default
     *     message if provided.
     * @constructor
     * @internal
     */
    constructor(info, message) {
        // Override default message if custom message provided.
        super({ code: 'installations/' + info.code, message: message || info.message });
        this.__proto__ = FirebaseInstallationsError.prototype;
    }
}
error.FirebaseInstallationsError = FirebaseInstallationsError;
/**
 * Firebase Messaging error code structure. This extends PrefixedFirebaseError.
 */
class FirebaseMessagingError extends PrefixedFirebaseError {
    /**
     * Creates the developer-facing error corresponding to the backend error code.
     *
     * @param serverErrorCode - The server error code.
     * @param [message] The error message. The default message is used
     *     if not provided.
     * @param [rawServerResponse] The error's raw server response.
     * @returns The corresponding developer-facing error.
     * @internal
     */
    static fromServerError(serverErrorCode, message, rawServerResponse) {
        // If not found, default to unknown error.
        let clientCodeKey = 'UNKNOWN_ERROR';
        if (serverErrorCode && serverErrorCode in MESSAGING_SERVER_TO_CLIENT_CODE) {
            clientCodeKey = MESSAGING_SERVER_TO_CLIENT_CODE[serverErrorCode];
        }
        const error = (0, deep_copy_1$6.deepCopy)(MessagingClientErrorCode[clientCodeKey]);
        error.message = message || error.message;
        if (clientCodeKey === 'UNKNOWN_ERROR' && typeof rawServerResponse !== 'undefined') {
            try {
                error.message += ` Raw server response: "${JSON.stringify(rawServerResponse)}"`;
            }
            catch (e) {
                // Ignore JSON parsing error.
            }
        }
        return new FirebaseMessagingError(error);
    }
    /**
     * @internal
     */
    static fromTopicManagementServerError(serverErrorCode, message, rawServerResponse) {
        // If not found, default to unknown error.
        const clientCodeKey = TOPIC_MGT_SERVER_TO_CLIENT_CODE[serverErrorCode] || 'UNKNOWN_ERROR';
        const error = (0, deep_copy_1$6.deepCopy)(MessagingClientErrorCode[clientCodeKey]);
        error.message = message || error.message;
        if (clientCodeKey === 'UNKNOWN_ERROR' && typeof rawServerResponse !== 'undefined') {
            try {
                error.message += ` Raw server response: "${JSON.stringify(rawServerResponse)}"`;
            }
            catch (e) {
                // Ignore JSON parsing error.
            }
        }
        return new FirebaseMessagingError(error);
    }
    /**
     *
     * @param info - The error code info.
     * @param message - The error message. This will override the default message if provided.
     * @constructor
     * @internal
     */
    constructor(info, message) {
        // Override default message if custom message provided.
        super('messaging', info.code, message || info.message);
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = FirebaseMessagingError.prototype;
    }
}
error.FirebaseMessagingError = FirebaseMessagingError;
class FirebaseMessagingSessionError extends FirebaseMessagingError {
    /**
       *
       * @param info - The error code info.
       * @param message - The error message. This will override the default message if provided.
       * @param pendingBatchResponse - BatchResponse for pending messages when session error occured.
       * @constructor
       * @internal
       */
    constructor(info, message, pendingBatchResponse) {
        // Override default message if custom message provided.
        super(info, message || info.message);
        this.pendingBatchResponse = pendingBatchResponse;
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = FirebaseMessagingSessionError.prototype;
    }
    /** @returns The object representation of the error. */
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            pendingBatchResponse: this.pendingBatchResponse,
        };
    }
}
error.FirebaseMessagingSessionError = FirebaseMessagingSessionError;
/**
 * Firebase project management error code structure. This extends PrefixedFirebaseError.
 */
class FirebaseProjectManagementError extends PrefixedFirebaseError {
    /**
     * @param code - The error code.
     * @param message - The error message.
     * @constructor
     * @internal
     */
    constructor(code, message) {
        super('project-management', code, message);
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = FirebaseProjectManagementError.prototype;
    }
}
error.FirebaseProjectManagementError = FirebaseProjectManagementError;
/**
 * App client error codes and their default messages.
 */
class AppErrorCodes {
}
error.AppErrorCodes = AppErrorCodes;
AppErrorCodes.APP_DELETED = 'app-deleted';
AppErrorCodes.DUPLICATE_APP = 'duplicate-app';
AppErrorCodes.INVALID_ARGUMENT = 'invalid-argument';
AppErrorCodes.INTERNAL_ERROR = 'internal-error';
AppErrorCodes.INVALID_APP_NAME = 'invalid-app-name';
AppErrorCodes.INVALID_APP_OPTIONS = 'invalid-app-options';
AppErrorCodes.INVALID_CREDENTIAL = 'invalid-credential';
AppErrorCodes.NETWORK_ERROR = 'network-error';
AppErrorCodes.NETWORK_TIMEOUT = 'network-timeout';
AppErrorCodes.NO_APP = 'no-app';
AppErrorCodes.UNABLE_TO_PARSE_RESPONSE = 'unable-to-parse-response';
/**
 * Auth client error codes and their default messages.
 */
class AuthClientErrorCode {
}
error.AuthClientErrorCode = AuthClientErrorCode;
AuthClientErrorCode.AUTH_BLOCKING_TOKEN_EXPIRED = {
    code: 'auth-blocking-token-expired',
    message: 'The provided Firebase Auth Blocking token is expired.',
};
AuthClientErrorCode.BILLING_NOT_ENABLED = {
    code: 'billing-not-enabled',
    message: 'Feature requires billing to be enabled.',
};
AuthClientErrorCode.CLAIMS_TOO_LARGE = {
    code: 'claims-too-large',
    message: 'Developer claims maximum payload size exceeded.',
};
AuthClientErrorCode.CONFIGURATION_EXISTS = {
    code: 'configuration-exists',
    message: 'A configuration already exists with the provided identifier.',
};
AuthClientErrorCode.CONFIGURATION_NOT_FOUND = {
    code: 'configuration-not-found',
    message: 'There is no configuration corresponding to the provided identifier.',
};
AuthClientErrorCode.ID_TOKEN_EXPIRED = {
    code: 'id-token-expired',
    message: 'The provided Firebase ID token is expired.',
};
AuthClientErrorCode.INVALID_ARGUMENT = {
    code: 'argument-error',
    message: 'Invalid argument provided.',
};
AuthClientErrorCode.INVALID_CONFIG = {
    code: 'invalid-config',
    message: 'The provided configuration is invalid.',
};
AuthClientErrorCode.EMAIL_ALREADY_EXISTS = {
    code: 'email-already-exists',
    message: 'The email address is already in use by another account.',
};
AuthClientErrorCode.EMAIL_NOT_FOUND = {
    code: 'email-not-found',
    message: 'There is no user record corresponding to the provided email.',
};
AuthClientErrorCode.FORBIDDEN_CLAIM = {
    code: 'reserved-claim',
    message: 'The specified developer claim is reserved and cannot be specified.',
};
AuthClientErrorCode.INVALID_ID_TOKEN = {
    code: 'invalid-id-token',
    message: 'The provided ID token is not a valid Firebase ID token.',
};
AuthClientErrorCode.ID_TOKEN_REVOKED = {
    code: 'id-token-revoked',
    message: 'The Firebase ID token has been revoked.',
};
AuthClientErrorCode.INTERNAL_ERROR = {
    code: 'internal-error',
    message: 'An internal error has occurred.',
};
AuthClientErrorCode.INVALID_CLAIMS = {
    code: 'invalid-claims',
    message: 'The provided custom claim attributes are invalid.',
};
AuthClientErrorCode.INVALID_CONTINUE_URI = {
    code: 'invalid-continue-uri',
    message: 'The continue URL must be a valid URL string.',
};
AuthClientErrorCode.INVALID_CREATION_TIME = {
    code: 'invalid-creation-time',
    message: 'The creation time must be a valid UTC date string.',
};
AuthClientErrorCode.INVALID_CREDENTIAL = {
    code: 'invalid-credential',
    message: 'Invalid credential object provided.',
};
AuthClientErrorCode.INVALID_DISABLED_FIELD = {
    code: 'invalid-disabled-field',
    message: 'The disabled field must be a boolean.',
};
AuthClientErrorCode.INVALID_DISPLAY_NAME = {
    code: 'invalid-display-name',
    message: 'The displayName field must be a valid string.',
};
AuthClientErrorCode.INVALID_DYNAMIC_LINK_DOMAIN = {
    code: 'invalid-dynamic-link-domain',
    message: 'The provided dynamic link domain is not configured or authorized ' +
        'for the current project.',
};
AuthClientErrorCode.INVALID_HOSTING_LINK_DOMAIN = {
    code: 'invalid-hosting-link-domain',
    message: 'The provided hosting link domain is not configured in Firebase ' +
        'Hosting or is not owned by the current project.',
};
AuthClientErrorCode.INVALID_EMAIL_VERIFIED = {
    code: 'invalid-email-verified',
    message: 'The emailVerified field must be a boolean.',
};
AuthClientErrorCode.INVALID_EMAIL = {
    code: 'invalid-email',
    message: 'The email address is improperly formatted.',
};
AuthClientErrorCode.INVALID_NEW_EMAIL = {
    code: 'invalid-new-email',
    message: 'The new email address is improperly formatted.',
};
AuthClientErrorCode.INVALID_ENROLLED_FACTORS = {
    code: 'invalid-enrolled-factors',
    message: 'The enrolled factors must be a valid array of MultiFactorInfo objects.',
};
AuthClientErrorCode.INVALID_ENROLLMENT_TIME = {
    code: 'invalid-enrollment-time',
    message: 'The second factor enrollment time must be a valid UTC date string.',
};
AuthClientErrorCode.INVALID_HASH_ALGORITHM = {
    code: 'invalid-hash-algorithm',
    message: 'The hash algorithm must match one of the strings in the list of ' +
        'supported algorithms.',
};
AuthClientErrorCode.INVALID_HASH_BLOCK_SIZE = {
    code: 'invalid-hash-block-size',
    message: 'The hash block size must be a valid number.',
};
AuthClientErrorCode.INVALID_HASH_DERIVED_KEY_LENGTH = {
    code: 'invalid-hash-derived-key-length',
    message: 'The hash derived key length must be a valid number.',
};
AuthClientErrorCode.INVALID_HASH_KEY = {
    code: 'invalid-hash-key',
    message: 'The hash key must a valid byte buffer.',
};
AuthClientErrorCode.INVALID_HASH_MEMORY_COST = {
    code: 'invalid-hash-memory-cost',
    message: 'The hash memory cost must be a valid number.',
};
AuthClientErrorCode.INVALID_HASH_PARALLELIZATION = {
    code: 'invalid-hash-parallelization',
    message: 'The hash parallelization must be a valid number.',
};
AuthClientErrorCode.INVALID_HASH_ROUNDS = {
    code: 'invalid-hash-rounds',
    message: 'The hash rounds must be a valid number.',
};
AuthClientErrorCode.INVALID_HASH_SALT_SEPARATOR = {
    code: 'invalid-hash-salt-separator',
    message: 'The hashing algorithm salt separator field must be a valid byte buffer.',
};
AuthClientErrorCode.INVALID_LAST_SIGN_IN_TIME = {
    code: 'invalid-last-sign-in-time',
    message: 'The last sign-in time must be a valid UTC date string.',
};
AuthClientErrorCode.INVALID_NAME = {
    code: 'invalid-name',
    message: 'The resource name provided is invalid.',
};
AuthClientErrorCode.INVALID_OAUTH_CLIENT_ID = {
    code: 'invalid-oauth-client-id',
    message: 'The provided OAuth client ID is invalid.',
};
AuthClientErrorCode.INVALID_PAGE_TOKEN = {
    code: 'invalid-page-token',
    message: 'The page token must be a valid non-empty string.',
};
AuthClientErrorCode.INVALID_PASSWORD = {
    code: 'invalid-password',
    message: 'The password must be a string with at least 6 characters.',
};
AuthClientErrorCode.INVALID_PASSWORD_HASH = {
    code: 'invalid-password-hash',
    message: 'The password hash must be a valid byte buffer.',
};
AuthClientErrorCode.INVALID_PASSWORD_SALT = {
    code: 'invalid-password-salt',
    message: 'The password salt must be a valid byte buffer.',
};
AuthClientErrorCode.INVALID_PHONE_NUMBER = {
    code: 'invalid-phone-number',
    message: 'The phone number must be a non-empty E.164 standard compliant identifier ' +
        'string.',
};
AuthClientErrorCode.INVALID_PHOTO_URL = {
    code: 'invalid-photo-url',
    message: 'The photoURL field must be a valid URL.',
};
AuthClientErrorCode.INVALID_PROJECT_ID = {
    code: 'invalid-project-id',
    message: 'Invalid parent project. Either parent project doesn\'t exist or didn\'t enable multi-tenancy.',
};
AuthClientErrorCode.INVALID_PROVIDER_DATA = {
    code: 'invalid-provider-data',
    message: 'The providerData must be a valid array of UserInfo objects.',
};
AuthClientErrorCode.INVALID_PROVIDER_ID = {
    code: 'invalid-provider-id',
    message: 'The providerId must be a valid supported provider identifier string.',
};
AuthClientErrorCode.INVALID_PROVIDER_UID = {
    code: 'invalid-provider-uid',
    message: 'The providerUid must be a valid provider uid string.',
};
AuthClientErrorCode.INVALID_OAUTH_RESPONSETYPE = {
    code: 'invalid-oauth-responsetype',
    message: 'Only exactly one OAuth responseType should be set to true.',
};
AuthClientErrorCode.INVALID_SESSION_COOKIE_DURATION = {
    code: 'invalid-session-cookie-duration',
    message: 'The session cookie duration must be a valid number in milliseconds ' +
        'between 5 minutes and 2 weeks.',
};
AuthClientErrorCode.INVALID_TENANT_ID = {
    code: 'invalid-tenant-id',
    message: 'The tenant ID must be a valid non-empty string.',
};
AuthClientErrorCode.INVALID_TENANT_TYPE = {
    code: 'invalid-tenant-type',
    message: 'Tenant type must be either "full_service" or "lightweight".',
};
AuthClientErrorCode.INVALID_TESTING_PHONE_NUMBER = {
    code: 'invalid-testing-phone-number',
    message: 'Invalid testing phone number or invalid test code provided.',
};
AuthClientErrorCode.INVALID_UID = {
    code: 'invalid-uid',
    message: 'The uid must be a non-empty string with at most 128 characters.',
};
AuthClientErrorCode.INVALID_USER_IMPORT = {
    code: 'invalid-user-import',
    message: 'The user record to import is invalid.',
};
AuthClientErrorCode.INVALID_TOKENS_VALID_AFTER_TIME = {
    code: 'invalid-tokens-valid-after-time',
    message: 'The tokensValidAfterTime must be a valid UTC number in seconds.',
};
AuthClientErrorCode.MISMATCHING_TENANT_ID = {
    code: 'mismatching-tenant-id',
    message: 'User tenant ID does not match with the current TenantAwareAuth tenant ID.',
};
AuthClientErrorCode.MISSING_ANDROID_PACKAGE_NAME = {
    code: 'missing-android-pkg-name',
    message: 'An Android Package Name must be provided if the Android App is ' +
        'required to be installed.',
};
AuthClientErrorCode.MISSING_CONFIG = {
    code: 'missing-config',
    message: 'The provided configuration is missing required attributes.',
};
AuthClientErrorCode.MISSING_CONTINUE_URI = {
    code: 'missing-continue-uri',
    message: 'A valid continue URL must be provided in the request.',
};
AuthClientErrorCode.MISSING_DISPLAY_NAME = {
    code: 'missing-display-name',
    message: 'The resource being created or edited is missing a valid display name.',
};
AuthClientErrorCode.MISSING_EMAIL = {
    code: 'missing-email',
    message: 'The email is required for the specified action. For example, a multi-factor user ' +
        'requires a verified email.',
};
AuthClientErrorCode.MISSING_IOS_BUNDLE_ID = {
    code: 'missing-ios-bundle-id',
    message: 'The request is missing an iOS Bundle ID.',
};
AuthClientErrorCode.MISSING_ISSUER = {
    code: 'missing-issuer',
    message: 'The OAuth/OIDC configuration issuer must not be empty.',
};
AuthClientErrorCode.MISSING_HASH_ALGORITHM = {
    code: 'missing-hash-algorithm',
    message: 'Importing users with password hashes requires that the hashing ' +
        'algorithm and its parameters be provided.',
};
AuthClientErrorCode.MISSING_OAUTH_CLIENT_ID = {
    code: 'missing-oauth-client-id',
    message: 'The OAuth/OIDC configuration client ID must not be empty.',
};
AuthClientErrorCode.MISSING_OAUTH_CLIENT_SECRET = {
    code: 'missing-oauth-client-secret',
    message: 'The OAuth configuration client secret is required to enable OIDC code flow.',
};
AuthClientErrorCode.MISSING_PROVIDER_ID = {
    code: 'missing-provider-id',
    message: 'A valid provider ID must be provided in the request.',
};
AuthClientErrorCode.MISSING_SAML_RELYING_PARTY_CONFIG = {
    code: 'missing-saml-relying-party-config',
    message: 'The SAML configuration provided is missing a relying party configuration.',
};
AuthClientErrorCode.MAXIMUM_TEST_PHONE_NUMBER_EXCEEDED = {
    code: 'test-phone-number-limit-exceeded',
    message: 'The maximum allowed number of test phone number / code pairs has been exceeded.',
};
AuthClientErrorCode.MAXIMUM_USER_COUNT_EXCEEDED = {
    code: 'maximum-user-count-exceeded',
    message: 'The maximum allowed number of users to import has been exceeded.',
};
AuthClientErrorCode.MISSING_UID = {
    code: 'missing-uid',
    message: 'A uid identifier is required for the current operation.',
};
AuthClientErrorCode.OPERATION_NOT_ALLOWED = {
    code: 'operation-not-allowed',
    message: 'The given sign-in provider is disabled for this Firebase project. ' +
        'Enable it in the Firebase console, under the sign-in method tab of the ' +
        'Auth section.',
};
AuthClientErrorCode.PHONE_NUMBER_ALREADY_EXISTS = {
    code: 'phone-number-already-exists',
    message: 'The user with the provided phone number already exists.',
};
AuthClientErrorCode.PROJECT_NOT_FOUND = {
    code: 'project-not-found',
    message: 'No Firebase project was found for the provided credential.',
};
AuthClientErrorCode.INSUFFICIENT_PERMISSION = {
    code: 'insufficient-permission',
    message: 'Credential implementation provided to initializeApp() via the "credential" property ' +
        'has insufficient permission to access the requested resource. See ' +
        'https://firebase.google.com/docs/admin/setup for details on how to authenticate this SDK ' +
        'with appropriate permissions.',
};
AuthClientErrorCode.QUOTA_EXCEEDED = {
    code: 'quota-exceeded',
    message: 'The project quota for the specified operation has been exceeded.',
};
AuthClientErrorCode.SECOND_FACTOR_LIMIT_EXCEEDED = {
    code: 'second-factor-limit-exceeded',
    message: 'The maximum number of allowed second factors on a user has been exceeded.',
};
AuthClientErrorCode.SECOND_FACTOR_UID_ALREADY_EXISTS = {
    code: 'second-factor-uid-already-exists',
    message: 'The specified second factor "uid" already exists.',
};
AuthClientErrorCode.SESSION_COOKIE_EXPIRED = {
    code: 'session-cookie-expired',
    message: 'The Firebase session cookie is expired.',
};
AuthClientErrorCode.SESSION_COOKIE_REVOKED = {
    code: 'session-cookie-revoked',
    message: 'The Firebase session cookie has been revoked.',
};
AuthClientErrorCode.TENANT_NOT_FOUND = {
    code: 'tenant-not-found',
    message: 'There is no tenant corresponding to the provided identifier.',
};
AuthClientErrorCode.UID_ALREADY_EXISTS = {
    code: 'uid-already-exists',
    message: 'The user with the provided uid already exists.',
};
AuthClientErrorCode.UNAUTHORIZED_DOMAIN = {
    code: 'unauthorized-continue-uri',
    message: 'The domain of the continue URL is not whitelisted. Whitelist the domain in the ' +
        'Firebase console.',
};
AuthClientErrorCode.UNSUPPORTED_FIRST_FACTOR = {
    code: 'unsupported-first-factor',
    message: 'A multi-factor user requires a supported first factor.',
};
AuthClientErrorCode.UNSUPPORTED_SECOND_FACTOR = {
    code: 'unsupported-second-factor',
    message: 'The request specified an unsupported type of second factor.',
};
AuthClientErrorCode.UNSUPPORTED_TENANT_OPERATION = {
    code: 'unsupported-tenant-operation',
    message: 'This operation is not supported in a multi-tenant context.',
};
AuthClientErrorCode.UNVERIFIED_EMAIL = {
    code: 'unverified-email',
    message: 'A verified email is required for the specified action. For example, a multi-factor user ' +
        'requires a verified email.',
};
AuthClientErrorCode.USER_NOT_FOUND = {
    code: 'user-not-found',
    message: 'There is no user record corresponding to the provided identifier.',
};
AuthClientErrorCode.NOT_FOUND = {
    code: 'not-found',
    message: 'The requested resource was not found.',
};
AuthClientErrorCode.USER_DISABLED = {
    code: 'user-disabled',
    message: 'The user record is disabled.',
};
AuthClientErrorCode.USER_NOT_DISABLED = {
    code: 'user-not-disabled',
    message: 'The user must be disabled in order to bulk delete it (or you must pass force=true).',
};
AuthClientErrorCode.INVALID_RECAPTCHA_ACTION = {
    code: 'invalid-recaptcha-action',
    message: 'reCAPTCHA action must be "BLOCK".'
};
AuthClientErrorCode.INVALID_RECAPTCHA_ENFORCEMENT_STATE = {
    code: 'invalid-recaptcha-enforcement-state',
    message: 'reCAPTCHA enforcement state must be either "OFF", "AUDIT" or "ENFORCE".'
};
AuthClientErrorCode.RECAPTCHA_NOT_ENABLED = {
    code: 'racaptcha-not-enabled',
    message: 'reCAPTCHA enterprise is not enabled.'
};
/**
 * Messaging client error codes and their default messages.
 */
class MessagingClientErrorCode {
}
error.MessagingClientErrorCode = MessagingClientErrorCode;
MessagingClientErrorCode.INVALID_ARGUMENT = {
    code: 'invalid-argument',
    message: 'Invalid argument provided.',
};
MessagingClientErrorCode.INVALID_RECIPIENT = {
    code: 'invalid-recipient',
    message: 'Invalid message recipient provided.',
};
MessagingClientErrorCode.INVALID_PAYLOAD = {
    code: 'invalid-payload',
    message: 'Invalid message payload provided.',
};
MessagingClientErrorCode.INVALID_DATA_PAYLOAD_KEY = {
    code: 'invalid-data-payload-key',
    message: 'The data message payload contains an invalid key. See the reference documentation ' +
        'for the DataMessagePayload type for restricted keys.',
};
MessagingClientErrorCode.PAYLOAD_SIZE_LIMIT_EXCEEDED = {
    code: 'payload-size-limit-exceeded',
    message: 'The provided message payload exceeds the FCM size limits. See the error documentation ' +
        'for more details.',
};
MessagingClientErrorCode.INVALID_OPTIONS = {
    code: 'invalid-options',
    message: 'Invalid message options provided.',
};
MessagingClientErrorCode.INVALID_REGISTRATION_TOKEN = {
    code: 'invalid-registration-token',
    message: 'Invalid registration token provided. Make sure it matches the registration token ' +
        'the client app receives from registering with FCM.',
};
MessagingClientErrorCode.REGISTRATION_TOKEN_NOT_REGISTERED = {
    code: 'registration-token-not-registered',
    message: 'The provided registration token is not registered. A previously valid registration ' +
        'token can be unregistered for a variety of reasons. See the error documentation for more ' +
        'details. Remove this registration token and stop using it to send messages.',
};
MessagingClientErrorCode.MISMATCHED_CREDENTIAL = {
    code: 'mismatched-credential',
    message: 'The credential used to authenticate this SDK does not have permission to send ' +
        'messages to the device corresponding to the provided registration token. Make sure the ' +
        'credential and registration token both belong to the same Firebase project.',
};
MessagingClientErrorCode.INVALID_PACKAGE_NAME = {
    code: 'invalid-package-name',
    message: 'The message was addressed to a registration token whose package name does not match ' +
        'the provided "restrictedPackageName" option.',
};
MessagingClientErrorCode.DEVICE_MESSAGE_RATE_EXCEEDED = {
    code: 'device-message-rate-exceeded',
    message: 'The rate of messages to a particular device is too high. Reduce the number of ' +
        'messages sent to this device and do not immediately retry sending to this device.',
};
MessagingClientErrorCode.TOPICS_MESSAGE_RATE_EXCEEDED = {
    code: 'topics-message-rate-exceeded',
    message: 'The rate of messages to subscribers to a particular topic is too high. Reduce the ' +
        'number of messages sent for this topic, and do not immediately retry sending to this topic.',
};
MessagingClientErrorCode.MESSAGE_RATE_EXCEEDED = {
    code: 'message-rate-exceeded',
    message: 'Sending limit exceeded for the message target.',
};
MessagingClientErrorCode.THIRD_PARTY_AUTH_ERROR = {
    code: 'third-party-auth-error',
    message: 'A message targeted to an iOS device could not be sent because the required APNs ' +
        'SSL certificate was not uploaded or has expired. Check the validity of your development ' +
        'and production certificates.',
};
MessagingClientErrorCode.TOO_MANY_TOPICS = {
    code: 'too-many-topics',
    message: 'The maximum number of topics the provided registration token can be subscribed to ' +
        'has been exceeded.',
};
MessagingClientErrorCode.AUTHENTICATION_ERROR = {
    code: 'authentication-error',
    message: 'An error occurred when trying to authenticate to the FCM servers. Make sure the ' +
        'credential used to authenticate this SDK has the proper permissions. See ' +
        'https://firebase.google.com/docs/admin/setup for setup instructions.',
};
MessagingClientErrorCode.SERVER_UNAVAILABLE = {
    code: 'server-unavailable',
    message: 'The FCM server could not process the request in time. See the error documentation ' +
        'for more details.',
};
MessagingClientErrorCode.INTERNAL_ERROR = {
    code: 'internal-error',
    message: 'An internal error has occurred. Please retry the request.',
};
MessagingClientErrorCode.UNKNOWN_ERROR = {
    code: 'unknown-error',
    message: 'An unknown server error was returned.',
};
class InstallationsClientErrorCode {
}
error.InstallationsClientErrorCode = InstallationsClientErrorCode;
InstallationsClientErrorCode.INVALID_ARGUMENT = {
    code: 'invalid-argument',
    message: 'Invalid argument provided.',
};
InstallationsClientErrorCode.INVALID_PROJECT_ID = {
    code: 'invalid-project-id',
    message: 'Invalid project ID provided.',
};
InstallationsClientErrorCode.INVALID_INSTALLATION_ID = {
    code: 'invalid-installation-id',
    message: 'Invalid installation ID provided.',
};
InstallationsClientErrorCode.API_ERROR = {
    code: 'api-error',
    message: 'Installation ID API call failed.',
};
class InstanceIdClientErrorCode extends InstallationsClientErrorCode {
}
error.InstanceIdClientErrorCode = InstanceIdClientErrorCode;
InstanceIdClientErrorCode.INVALID_INSTANCE_ID = {
    code: 'invalid-instance-id',
    message: 'Invalid instance ID provided.',
};
/** @const {ServerToClientCode} Auth server to client enum error codes. */
const AUTH_SERVER_TO_CLIENT_CODE = {
    // Feature being configured or used requires a billing account.
    BILLING_NOT_ENABLED: 'BILLING_NOT_ENABLED',
    // Claims payload is too large.
    CLAIMS_TOO_LARGE: 'CLAIMS_TOO_LARGE',
    // Configuration being added already exists.
    CONFIGURATION_EXISTS: 'CONFIGURATION_EXISTS',
    // Configuration not found.
    CONFIGURATION_NOT_FOUND: 'CONFIGURATION_NOT_FOUND',
    // Provided credential has insufficient permissions.
    INSUFFICIENT_PERMISSION: 'INSUFFICIENT_PERMISSION',
    // Provided configuration has invalid fields.
    INVALID_CONFIG: 'INVALID_CONFIG',
    // Provided configuration identifier is invalid.
    INVALID_CONFIG_ID: 'INVALID_PROVIDER_ID',
    // ActionCodeSettings missing continue URL.
    INVALID_CONTINUE_URI: 'INVALID_CONTINUE_URI',
    // Dynamic link domain in provided ActionCodeSettings is not authorized.
    INVALID_DYNAMIC_LINK_DOMAIN: 'INVALID_DYNAMIC_LINK_DOMAIN',
    // Hosting link domain in provided ActionCodeSettings is not owned by the current project.
    INVALID_HOSTING_LINK_DOMAIN: 'INVALID_HOSTING_LINK_DOMAIN',
    // uploadAccount provides an email that already exists.
    DUPLICATE_EMAIL: 'EMAIL_ALREADY_EXISTS',
    // uploadAccount provides a localId that already exists.
    DUPLICATE_LOCAL_ID: 'UID_ALREADY_EXISTS',
    // Request specified a multi-factor enrollment ID that already exists.
    DUPLICATE_MFA_ENROLLMENT_ID: 'SECOND_FACTOR_UID_ALREADY_EXISTS',
    // setAccountInfo email already exists.
    EMAIL_EXISTS: 'EMAIL_ALREADY_EXISTS',
    // /accounts:sendOobCode for password reset when user is not found.
    EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
    // Reserved claim name.
    FORBIDDEN_CLAIM: 'FORBIDDEN_CLAIM',
    // Invalid claims provided.
    INVALID_CLAIMS: 'INVALID_CLAIMS',
    // Invalid session cookie duration.
    INVALID_DURATION: 'INVALID_SESSION_COOKIE_DURATION',
    // Invalid email provided.
    INVALID_EMAIL: 'INVALID_EMAIL',
    // Invalid new email provided.
    INVALID_NEW_EMAIL: 'INVALID_NEW_EMAIL',
    // Invalid tenant display name. This can be thrown on CreateTenant and UpdateTenant.
    INVALID_DISPLAY_NAME: 'INVALID_DISPLAY_NAME',
    // Invalid ID token provided.
    INVALID_ID_TOKEN: 'INVALID_ID_TOKEN',
    // Invalid tenant/parent resource name.
    INVALID_NAME: 'INVALID_NAME',
    // OIDC configuration has an invalid OAuth client ID.
    INVALID_OAUTH_CLIENT_ID: 'INVALID_OAUTH_CLIENT_ID',
    // Invalid page token.
    INVALID_PAGE_SELECTION: 'INVALID_PAGE_TOKEN',
    // Invalid phone number.
    INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
    // Invalid agent project. Either agent project doesn't exist or didn't enable multi-tenancy.
    INVALID_PROJECT_ID: 'INVALID_PROJECT_ID',
    // Invalid provider ID.
    INVALID_PROVIDER_ID: 'INVALID_PROVIDER_ID',
    // Invalid service account.
    INVALID_SERVICE_ACCOUNT: 'INVALID_SERVICE_ACCOUNT',
    // Invalid testing phone number.
    INVALID_TESTING_PHONE_NUMBER: 'INVALID_TESTING_PHONE_NUMBER',
    // Invalid tenant type.
    INVALID_TENANT_TYPE: 'INVALID_TENANT_TYPE',
    // Missing Android package name.
    MISSING_ANDROID_PACKAGE_NAME: 'MISSING_ANDROID_PACKAGE_NAME',
    // Missing configuration.
    MISSING_CONFIG: 'MISSING_CONFIG',
    // Missing configuration identifier.
    MISSING_CONFIG_ID: 'MISSING_PROVIDER_ID',
    // Missing tenant display name: This can be thrown on CreateTenant and UpdateTenant.
    MISSING_DISPLAY_NAME: 'MISSING_DISPLAY_NAME',
    // Email is required for the specified action. For example a multi-factor user requires
    // a verified email.
    MISSING_EMAIL: 'MISSING_EMAIL',
    // Missing iOS bundle ID.
    MISSING_IOS_BUNDLE_ID: 'MISSING_IOS_BUNDLE_ID',
    // Missing OIDC issuer.
    MISSING_ISSUER: 'MISSING_ISSUER',
    // No localId provided (deleteAccount missing localId).
    MISSING_LOCAL_ID: 'MISSING_UID',
    // OIDC configuration is missing an OAuth client ID.
    MISSING_OAUTH_CLIENT_ID: 'MISSING_OAUTH_CLIENT_ID',
    // Missing provider ID.
    MISSING_PROVIDER_ID: 'MISSING_PROVIDER_ID',
    // Missing SAML RP config.
    MISSING_SAML_RELYING_PARTY_CONFIG: 'MISSING_SAML_RELYING_PARTY_CONFIG',
    // Empty user list in uploadAccount.
    MISSING_USER_ACCOUNT: 'MISSING_UID',
    // Password auth disabled in console.
    OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
    // Provided credential has insufficient permissions.
    PERMISSION_DENIED: 'INSUFFICIENT_PERMISSION',
    // Phone number already exists.
    PHONE_NUMBER_EXISTS: 'PHONE_NUMBER_ALREADY_EXISTS',
    // Project not found.
    PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
    // In multi-tenancy context: project creation quota exceeded.
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    // Currently only 5 second factors can be set on the same user.
    SECOND_FACTOR_LIMIT_EXCEEDED: 'SECOND_FACTOR_LIMIT_EXCEEDED',
    // Tenant not found.
    TENANT_NOT_FOUND: 'TENANT_NOT_FOUND',
    // Tenant ID mismatch.
    TENANT_ID_MISMATCH: 'MISMATCHING_TENANT_ID',
    // Token expired error.
    TOKEN_EXPIRED: 'ID_TOKEN_EXPIRED',
    // Continue URL provided in ActionCodeSettings has a domain that is not whitelisted.
    UNAUTHORIZED_DOMAIN: 'UNAUTHORIZED_DOMAIN',
    // A multi-factor user requires a supported first factor.
    UNSUPPORTED_FIRST_FACTOR: 'UNSUPPORTED_FIRST_FACTOR',
    // The request specified an unsupported type of second factor.
    UNSUPPORTED_SECOND_FACTOR: 'UNSUPPORTED_SECOND_FACTOR',
    // Operation is not supported in a multi-tenant context.
    UNSUPPORTED_TENANT_OPERATION: 'UNSUPPORTED_TENANT_OPERATION',
    // A verified email is required for the specified action. For example a multi-factor user
    // requires a verified email.
    UNVERIFIED_EMAIL: 'UNVERIFIED_EMAIL',
    // User on which action is to be performed is not found.
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    // User record is disabled.
    USER_DISABLED: 'USER_DISABLED',
    // Password provided is too weak.
    WEAK_PASSWORD: 'INVALID_PASSWORD',
    // Unrecognized reCAPTCHA action.
    INVALID_RECAPTCHA_ACTION: 'INVALID_RECAPTCHA_ACTION',
    // Unrecognized reCAPTCHA enforcement state.
    INVALID_RECAPTCHA_ENFORCEMENT_STATE: 'INVALID_RECAPTCHA_ENFORCEMENT_STATE',
    // reCAPTCHA is not enabled for account defender.
    RECAPTCHA_NOT_ENABLED: 'RECAPTCHA_NOT_ENABLED'
};
/** @const {ServerToClientCode} Messaging server to client enum error codes. */
const MESSAGING_SERVER_TO_CLIENT_CODE = {
    /* GENERIC ERRORS */
    // Generic invalid message parameter provided.
    InvalidParameters: 'INVALID_ARGUMENT',
    // Mismatched sender ID.
    MismatchSenderId: 'MISMATCHED_CREDENTIAL',
    // FCM server unavailable.
    Unavailable: 'SERVER_UNAVAILABLE',
    // FCM server internal error.
    InternalServerError: 'INTERNAL_ERROR',
    /* SEND ERRORS */
    // Invalid registration token format.
    InvalidRegistration: 'INVALID_REGISTRATION_TOKEN',
    // Registration token is not registered.
    NotRegistered: 'REGISTRATION_TOKEN_NOT_REGISTERED',
    // Registration token does not match restricted package name.
    InvalidPackageName: 'INVALID_PACKAGE_NAME',
    // Message payload size limit exceeded.
    MessageTooBig: 'PAYLOAD_SIZE_LIMIT_EXCEEDED',
    // Invalid key in the data message payload.
    InvalidDataKey: 'INVALID_DATA_PAYLOAD_KEY',
    // Invalid time to live option.
    InvalidTtl: 'INVALID_OPTIONS',
    // Device message rate exceeded.
    DeviceMessageRateExceeded: 'DEVICE_MESSAGE_RATE_EXCEEDED',
    // Topics message rate exceeded.
    TopicsMessageRateExceeded: 'TOPICS_MESSAGE_RATE_EXCEEDED',
    // Invalid APNs credentials.
    InvalidApnsCredential: 'THIRD_PARTY_AUTH_ERROR',
    /* FCM v1 canonical error codes */
    NOT_FOUND: 'REGISTRATION_TOKEN_NOT_REGISTERED',
    PERMISSION_DENIED: 'MISMATCHED_CREDENTIAL',
    RESOURCE_EXHAUSTED: 'MESSAGE_RATE_EXCEEDED',
    UNAUTHENTICATED: 'THIRD_PARTY_AUTH_ERROR',
    /* FCM v1 new error codes */
    APNS_AUTH_ERROR: 'THIRD_PARTY_AUTH_ERROR',
    INTERNAL: 'INTERNAL_ERROR',
    INVALID_ARGUMENT: 'INVALID_ARGUMENT',
    QUOTA_EXCEEDED: 'MESSAGE_RATE_EXCEEDED',
    SENDER_ID_MISMATCH: 'MISMATCHED_CREDENTIAL',
    THIRD_PARTY_AUTH_ERROR: 'THIRD_PARTY_AUTH_ERROR',
    UNAVAILABLE: 'SERVER_UNAVAILABLE',
    UNREGISTERED: 'REGISTRATION_TOKEN_NOT_REGISTERED',
    UNSPECIFIED_ERROR: 'UNKNOWN_ERROR',
};
/** @const {ServerToClientCode} Topic management (IID) server to client enum error codes. */
const TOPIC_MGT_SERVER_TO_CLIENT_CODE = {
    /* TOPIC SUBSCRIPTION MANAGEMENT ERRORS */
    NOT_FOUND: 'REGISTRATION_TOKEN_NOT_REGISTERED',
    INVALID_ARGUMENT: 'INVALID_REGISTRATION_TOKEN',
    TOO_MANY_TOPICS: 'TOO_MANY_TOPICS',
    RESOURCE_EXHAUSTED: 'TOO_MANY_TOPICS',
    PERMISSION_DENIED: 'AUTHENTICATION_ERROR',
    DEADLINE_EXCEEDED: 'SERVER_UNAVAILABLE',
    INTERNAL: 'INTERNAL_ERROR',
    UNKNOWN: 'UNKNOWN_ERROR',
};

var validator$b = {};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(validator$b, "__esModule", { value: true });
validator$b.isBuffer = isBuffer;
validator$b.isArray = isArray;
validator$b.isNonEmptyArray = isNonEmptyArray;
validator$b.isBoolean = isBoolean;
validator$b.isNumber = isNumber;
validator$b.isString = isString;
validator$b.isBase64String = isBase64String;
validator$b.isNonEmptyString = isNonEmptyString;
validator$b.isObject = isObject;
validator$b.isNonNullObject = isNonNullObject;
validator$b.isUid = isUid;
validator$b.isPassword = isPassword;
validator$b.isEmail = isEmail;
validator$b.isPhoneNumber = isPhoneNumber;
validator$b.isISODateString = isISODateString;
validator$b.isUTCDateString = isUTCDateString;
validator$b.isURL = isURL;
validator$b.isTopic = isTopic;
validator$b.isTaskId = isTaskId;
/**
 * Validates that a value is a byte buffer.
 *
 * @param value - The value to validate.
 * @returns Whether the value is byte buffer or not.
 */
function isBuffer(value) {
    return value instanceof Buffer;
}
/**
 * Validates that a value is an array.
 *
 * @param value - The value to validate.
 * @returns Whether the value is an array or not.
 */
function isArray(value) {
    return Array.isArray(value);
}
/**
 * Validates that a value is a non-empty array.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a non-empty array or not.
 */
function isNonEmptyArray(value) {
    return isArray(value) && value.length !== 0;
}
/**
 * Validates that a value is a boolean.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a boolean or not.
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Validates that a value is a number.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a number or not.
 */
function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
/**
 * Validates that a value is a string.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a string or not.
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * Validates that a value is a base64 string.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a base64 string or not.
 */
function isBase64String(value) {
    if (!isString(value)) {
        return false;
    }
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
}
/**
 * Validates that a value is a non-empty string.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a non-empty string or not.
 */
function isNonEmptyString(value) {
    return isString(value) && value !== '';
}
/**
 * Validates that a value is a nullable object.
 *
 * @param value - The value to validate.
 * @returns Whether the value is an object or not.
 */
function isObject(value) {
    return typeof value === 'object' && !isArray(value);
}
/**
 * Validates that a value is a non-null object.
 *
 * @param value - The value to validate.
 * @returns Whether the value is a non-null object or not.
 */
function isNonNullObject(value) {
    return isObject(value) && value !== null;
}
/**
 * Validates that a string is a valid Firebase Auth uid.
 *
 * @param uid - The string to validate.
 * @returns Whether the string is a valid Firebase Auth uid.
 */
function isUid(uid) {
    return typeof uid === 'string' && uid.length > 0 && uid.length <= 128;
}
/**
 * Validates that a string is a valid Firebase Auth password.
 *
 * @param password - The password string to validate.
 * @returns Whether the string is a valid Firebase Auth password.
 */
function isPassword(password) {
    // A password must be a string of at least 6 characters.
    return typeof password === 'string' && password.length >= 6;
}
/**
 * Validates that a string is a valid email.
 *
 * @param email - The string to validate.
 * @returns Whether the string is valid email or not.
 */
function isEmail(email) {
    if (typeof email !== 'string') {
        return false;
    }
    // There must at least one character before the @ symbol and another after.
    const re = /^[^@]+@[^@]+$/;
    return re.test(email);
}
/**
 * Validates that a string is a valid phone number.
 *
 * @param phoneNumber - The string to validate.
 * @returns Whether the string is a valid phone number or not.
 */
function isPhoneNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string') {
        return false;
    }
    // Phone number validation is very lax here. Backend will enforce E.164
    // spec compliance and will normalize accordingly.
    // The phone number string must be non-empty and starts with a plus sign.
    const re1 = /^\+/;
    // The phone number string must contain at least one alphanumeric character.
    const re2 = /[\da-zA-Z]+/;
    return re1.test(phoneNumber) && re2.test(phoneNumber);
}
/**
 * Validates that a string is a valid ISO date string.
 *
 * @param dateString - The string to validate.
 * @returns Whether the string is a valid ISO date string.
 */
function isISODateString(dateString) {
    try {
        return isNonEmptyString(dateString) &&
            (new Date(dateString).toISOString() === dateString);
    }
    catch (e) {
        return false;
    }
}
/**
 * Validates that a string is a valid UTC date string.
 *
 * @param dateString - The string to validate.
 * @returns Whether the string is a valid UTC date string.
 */
function isUTCDateString(dateString) {
    try {
        return isNonEmptyString(dateString) &&
            (new Date(dateString).toUTCString() === dateString);
    }
    catch (e) {
        return false;
    }
}
/**
 * Validates that a string is a valid web URL.
 *
 * @param urlStr - The string to validate.
 * @returns Whether the string is valid web URL or not.
 */
function isURL(urlStr) {
    if (typeof urlStr !== 'string') {
        return false;
    }
    // Lookup illegal characters.
    const re = /[^a-z0-9:/?#[\]@!$&'()*+,;=.\-_~%]/i;
    if (re.test(urlStr)) {
        return false;
    }
    try {
        const uri = new URL(urlStr);
        const scheme = uri.protocol;
        if (scheme !== 'http:' && scheme !== 'https:') {
            return false;
        }
        const hostname = uri.hostname;
        // Validate hostname strictly to match previous behavior and prevent weak/invalid domains.
        // Must be alphanumeric with optional dashes/underscores, separated by dots.
        // Cannot start/end with dot or dash (mostly).
        // This regex is safe (no nested quantifiers with overlap).
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/.test(hostname)) {
            // Check for IPv6 literals which are valid but behave differently.
            // Node 'new URL' keeps brackets for IPv6: [::1] -> [::1]
            // Check for IPv6 address (simple check for brackets)
            if (!/^\[[a-fA-F0-9:.]+\]$/.test(hostname)) {
                return false;
            }
        }
        // Restore strict pathname validation: (/chars+)*/?
        // Where chars can be a combination of: a-z A-Z 0-9 - _ . ~ ! $ & ' ( ) * + , ; = : @ %
        const pathnameRe = /^(\/[\w\-.~!$'()*+,;=:@%]+)*\/?$/;
        // Validate pathname.
        const pathname = uri.pathname;
        if (pathname &&
            pathname !== '/' &&
            !pathnameRe.test(pathname)) {
            return false;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
/**
 * Validates that the provided topic is a valid FCM topic name.
 *
 * @param topic - The topic to validate.
 * @returns Whether the provided topic is a valid FCM topic name.
 */
function isTopic(topic) {
    if (typeof topic !== 'string') {
        return false;
    }
    const VALID_TOPIC_REGEX = /^(\/topics\/)?(private\/)?[a-zA-Z0-9-_.~%]+$/;
    return VALID_TOPIC_REGEX.test(topic);
}
/**
 * Validates that the provided string can be used as a task ID
 * for Cloud Tasks.
 *
 * @param taskId - the task ID to validate.
 * @returns Whether the provided task ID is valid.
 */
function isTaskId(taskId) {
    if (typeof taskId !== 'string') {
        return false;
    }
    const VALID_TASK_ID_REGEX = /^[A-Za-z0-9_-]+$/;
    return VALID_TASK_ID_REGEX.test(taskId);
}

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(credentialInternal, "__esModule", { value: true });
credentialInternal.ImpersonatedServiceAccountCredential = credentialInternal.RefreshTokenCredential = credentialInternal.ServiceAccountCredential = credentialInternal.ApplicationDefaultCredential = void 0;
credentialInternal.isApplicationDefault = isApplicationDefault;
credentialInternal.getApplicationDefault = getApplicationDefault;
const fs = require$$1$2;
const node_crypto_1 = require$$4$1;
const google_auth_library_1 = require$$2$3;
const error_1$a = error;
const util = validator$b;
const SCOPES = [
    'https://www.googleapis.com/auth/cloud-platform',
    'https://www.googleapis.com/auth/firebase.database',
    'https://www.googleapis.com/auth/firebase.messaging',
    'https://www.googleapis.com/auth/identitytoolkit',
    'https://www.googleapis.com/auth/userinfo.email',
];
/**
 * Implementation of ADC that uses google-auth-library-nodejs.
 */
class ApplicationDefaultCredential {
    constructor(httpAgent) {
        this.googleAuth = new google_auth_library_1.GoogleAuth({
            scopes: SCOPES,
            clientOptions: {
                transporterOptions: {
                    agent: httpAgent,
                },
            },
        });
    }
    async getAccessToken() {
        if (!this.authClient) {
            this.authClient = await this.googleAuth.getClient();
        }
        await this.authClient.getAccessToken();
        const credentials = this.authClient.credentials;
        this.quotaProjectId = this.authClient.quotaProjectId;
        return populateCredential(credentials);
    }
    async getProjectId() {
        if (!this.projectId) {
            this.projectId = await this.googleAuth.getProjectId();
        }
        return Promise.resolve(this.projectId);
    }
    getQuotaProjectId() {
        if (!this.quotaProjectId) {
            this.quotaProjectId = this.authClient?.quotaProjectId;
        }
        return this.quotaProjectId;
    }
    async isComputeEngineCredential() {
        if (!this.authClient) {
            this.authClient = await this.googleAuth.getClient();
        }
        return Promise.resolve(this.authClient instanceof google_auth_library_1.Compute);
    }
    /**
   * getIDToken returns a OIDC token from the compute metadata service
   * that can be used to make authenticated calls to audience
   * @param audience the URL the returned ID token will be used to call.
  */
    async getIDToken(audience) {
        if (await this.isComputeEngineCredential()) {
            return this.authClient.fetchIdToken(audience);
        }
        else {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Credentials type should be Compute Engine Credentials.');
        }
    }
    async getServiceAccountEmail() {
        if (this.accountId) {
            return Promise.resolve(this.accountId);
        }
        const { client_email: clientEmail } = await this.googleAuth.getCredentials();
        this.accountId = clientEmail ?? '';
        return Promise.resolve(this.accountId);
    }
}
credentialInternal.ApplicationDefaultCredential = ApplicationDefaultCredential;
/**
 * Implementation of Credential that uses a service account.
 */
class ServiceAccountCredential {
    /**
     * Creates a new ServiceAccountCredential from the given parameters.
     *
     * @param serviceAccountPathOrObject - Service account json object or path to a service account json file.
     * @param httpAgent - Optional http.Agent to use when calling the remote token server.
     * @param implicit - An optional boolean indicating whether this credential was implicitly discovered from the
     *   environment, as opposed to being explicitly specified by the developer.
     *
     * @constructor
     */
    constructor(serviceAccountPathOrObject, httpAgent, implicit = false) {
        this.serviceAccountPathOrObject = serviceAccountPathOrObject;
        this.httpAgent = httpAgent;
        this.implicit = implicit;
        const serviceAccount = (typeof serviceAccountPathOrObject === 'string') ?
            ServiceAccount.fromPath(serviceAccountPathOrObject)
            : new ServiceAccount(serviceAccountPathOrObject);
        this.projectId = serviceAccount.projectId;
        this.privateKey = serviceAccount.privateKey;
        this.clientEmail = serviceAccount.clientEmail;
    }
    getGoogleAuth() {
        if (this.googleAuth) {
            return this.googleAuth;
        }
        const { auth, client } = populateGoogleAuth(this.serviceAccountPathOrObject, this.httpAgent);
        this.googleAuth = auth;
        this.authClient = client;
        return this.googleAuth;
    }
    async getAccessToken() {
        const googleAuth = this.getGoogleAuth();
        if (this.authClient === undefined) {
            this.authClient = await googleAuth.getClient();
        }
        await this.authClient.getAccessToken();
        const credentials = this.authClient.credentials;
        return populateCredential(credentials);
    }
}
credentialInternal.ServiceAccountCredential = ServiceAccountCredential;
/**
 * A struct containing the properties necessary to use service account JSON credentials.
 */
class ServiceAccount {
    static fromPath(filePath) {
        try {
            return new ServiceAccount(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        }
        catch (error) {
            // Throw a nicely formed error message if the file contents cannot be parsed
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Failed to parse service account json file: ' + error);
        }
    }
    constructor(json) {
        if (!util.isNonNullObject(json)) {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Service account must be an object.');
        }
        copyAttr(this, json, 'projectId', 'project_id');
        copyAttr(this, json, 'privateKey', 'private_key');
        copyAttr(this, json, 'clientEmail', 'client_email');
        let errorMessage;
        if (!util.isNonEmptyString(this.projectId)) {
            errorMessage = 'Service account object must contain a string "project_id" property.';
        }
        else if (!util.isNonEmptyString(this.privateKey)) {
            errorMessage = 'Service account object must contain a string "private_key" property.';
        }
        else if (!util.isNonEmptyString(this.clientEmail)) {
            errorMessage = 'Service account object must contain a string "client_email" property.';
        }
        if (typeof errorMessage !== 'undefined') {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, errorMessage);
        }
        // Validate private key format using native crypto module
        try {
            (0, node_crypto_1.createPrivateKey)(this.privateKey);
        }
        catch (error) {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Failed to parse private key: ' + error);
        }
    }
}
/**
 * Implementation of Credential that gets access tokens from refresh tokens.
 */
class RefreshTokenCredential {
    /**
     * Creates a new RefreshTokenCredential from the given parameters.
     *
     * @param refreshTokenPathOrObject - Refresh token json object or path to a refresh token
     *   (user credentials) json file.
     * @param httpAgent - Optional http.Agent to use when calling the remote token server.
     * @param implicit - An optinal boolean indicating whether this credential was implicitly
     *   discovered from the environment, as opposed to being explicitly specified by the developer.
     *
     * @constructor
     */
    constructor(refreshTokenPathOrObject, httpAgent, implicit = false) {
        this.refreshTokenPathOrObject = refreshTokenPathOrObject;
        this.httpAgent = httpAgent;
        this.implicit = implicit;
        (typeof refreshTokenPathOrObject === 'string') ?
            RefreshToken.validateFromPath(refreshTokenPathOrObject)
            : RefreshToken.validateFromJSON(refreshTokenPathOrObject);
    }
    getGoogleAuth() {
        if (this.googleAuth) {
            return this.googleAuth;
        }
        const { auth, client } = populateGoogleAuth(this.refreshTokenPathOrObject, this.httpAgent);
        this.googleAuth = auth;
        this.authClient = client;
        return this.googleAuth;
    }
    async getAccessToken() {
        const googleAuth = this.getGoogleAuth();
        if (this.authClient === undefined) {
            this.authClient = await googleAuth.getClient();
        }
        await this.authClient.getAccessToken();
        const credentials = this.authClient.credentials;
        return populateCredential(credentials);
    }
}
credentialInternal.RefreshTokenCredential = RefreshTokenCredential;
class RefreshToken {
    /*
     * Tries to load a RefreshToken from a path. Throws if the path doesn't exist or the
     * data at the path is invalid.
     */
    static validateFromPath(filePath) {
        try {
            RefreshToken.validateFromJSON(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        }
        catch (error) {
            // Throw a nicely formed error message if the file contents cannot be parsed
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Failed to parse refresh token file: ' + error);
        }
    }
    static validateFromJSON(json) {
        const creds = { clientId: '', clientSecret: '', refreshToken: '', type: '' };
        copyAttr(creds, json, 'clientId', 'client_id');
        copyAttr(creds, json, 'clientSecret', 'client_secret');
        copyAttr(creds, json, 'refreshToken', 'refresh_token');
        copyAttr(creds, json, 'type', 'type');
        let errorMessage;
        if (!util.isNonEmptyString(creds.clientId)) {
            errorMessage = 'Refresh token must contain a "client_id" property.';
        }
        else if (!util.isNonEmptyString(creds.clientSecret)) {
            errorMessage = 'Refresh token must contain a "client_secret" property.';
        }
        else if (!util.isNonEmptyString(creds.refreshToken)) {
            errorMessage = 'Refresh token must contain a "refresh_token" property.';
        }
        else if (!util.isNonEmptyString(creds.type)) {
            errorMessage = 'Refresh token must contain a "type" property.';
        }
        if (typeof errorMessage !== 'undefined') {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, errorMessage);
        }
    }
}
/**
 * Implementation of Credential that uses impersonated service account.
 */
class ImpersonatedServiceAccountCredential {
    /**
     * Creates a new ImpersonatedServiceAccountCredential from the given parameters.
     *
     * @param impersonatedServiceAccountPathOrObject - Impersonated Service account json object or
     * path to a service account json file.
     * @param httpAgent - Optional http.Agent to use when calling the remote token server.
     * @param implicit - An optional boolean indicating whether this credential was implicitly
     *   discovered from the environment, as opposed to being explicitly specified by the developer.
     *
     * @constructor
     */
    constructor(impersonatedServiceAccountPathOrObject, httpAgent, implicit = false) {
        this.impersonatedServiceAccountPathOrObject = impersonatedServiceAccountPathOrObject;
        this.httpAgent = httpAgent;
        this.implicit = implicit;
        (typeof impersonatedServiceAccountPathOrObject === 'string') ?
            ImpersonatedServiceAccount.validateFromPath(impersonatedServiceAccountPathOrObject)
            : ImpersonatedServiceAccount.validateFromJSON(impersonatedServiceAccountPathOrObject);
    }
    getGoogleAuth() {
        if (this.googleAuth) {
            return this.googleAuth;
        }
        const { auth, client } = populateGoogleAuth(this.impersonatedServiceAccountPathOrObject, this.httpAgent);
        this.googleAuth = auth;
        this.authClient = client;
        return this.googleAuth;
    }
    async getAccessToken() {
        const googleAuth = this.getGoogleAuth();
        if (this.authClient === undefined) {
            this.authClient = await googleAuth.getClient();
        }
        await this.authClient.getAccessToken();
        const credentials = this.authClient.credentials;
        return populateCredential(credentials);
    }
}
credentialInternal.ImpersonatedServiceAccountCredential = ImpersonatedServiceAccountCredential;
/**
 * A helper class to validate the properties necessary to use impersonated service account credentials.
 */
class ImpersonatedServiceAccount {
    /*
     * Tries to load a ImpersonatedServiceAccount from a path. Throws if the path doesn't exist or the
     * data at the path is invalid.
     */
    static validateFromPath(filePath) {
        try {
            ImpersonatedServiceAccount.validateFromJSON(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        }
        catch (error) {
            // Throw a nicely formed error message if the file contents cannot be parsed
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Failed to parse impersonated service account file: ' + error);
        }
    }
    static validateFromJSON(json) {
        const { client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, type } = json['source_credentials'];
        let errorMessage;
        if (!util.isNonEmptyString(clientId)) {
            errorMessage = 'Impersonated Service Account must contain a "source_credentials.client_id" property.';
        }
        else if (!util.isNonEmptyString(clientSecret)) {
            errorMessage = 'Impersonated Service Account must contain a "source_credentials.client_secret" property.';
        }
        else if (!util.isNonEmptyString(refreshToken)) {
            errorMessage = 'Impersonated Service Account must contain a "source_credentials.refresh_token" property.';
        }
        else if (!util.isNonEmptyString(type)) {
            errorMessage = 'Impersonated Service Account must contain a "source_credentials.type" property.';
        }
        if (typeof errorMessage !== 'undefined') {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, errorMessage);
        }
    }
}
/**
 * Checks if the given credential was loaded via the application default credentials mechanism.
 *
 * @param credential - The credential instance to check.
 */
function isApplicationDefault(credential) {
    return credential instanceof ApplicationDefaultCredential ||
        (credential instanceof RefreshTokenCredential && credential.implicit);
}
function getApplicationDefault(httpAgent) {
    return new ApplicationDefaultCredential(httpAgent);
}
/**
 * Copies the specified property from one object to another.
 *
 * If no property exists by the given "key", looks for a property identified by "alt", and copies it instead.
 * This can be used to implement behaviors such as "copy property myKey or my_key".
 *
 * @param to - Target object to copy the property into.
 * @param from - Source object to copy the property from.
 * @param key - Name of the property to copy.
 * @param alt - Alternative name of the property to copy.
 */
function copyAttr(to, from, key, alt) {
    const tmp = from[key] || from[alt];
    if (typeof tmp !== 'undefined') {
        to[key] = tmp;
    }
}
/**
 * Populate google-auth-library GoogleAuth credentials type.
 */
function populateGoogleAuth(keyFile, httpAgent) {
    let client;
    const auth = new google_auth_library_1.GoogleAuth({
        scopes: SCOPES,
        clientOptions: {
            transporterOptions: {
                agent: httpAgent,
            },
        },
        keyFile: (typeof keyFile === 'string') ? keyFile : undefined,
    });
    if (typeof keyFile === 'object') {
        if (!util.isNonNullObject(keyFile)) {
            throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Service account must be an object.');
        }
        copyAttr(keyFile, keyFile, 'project_id', 'projectId');
        copyAttr(keyFile, keyFile, 'private_key', 'privateKey');
        copyAttr(keyFile, keyFile, 'client_email', 'clientEmail');
        client = auth.fromJSON(keyFile);
    }
    return { auth, client };
}
/**
 * Populate GoogleOAuthAccessToken credentials from google-auth-library Credentials type.
 */
function populateCredential(credentials) {
    const accessToken = credentials?.access_token;
    const expiryDate = credentials?.expiry_date;
    if (typeof accessToken !== 'string')
        throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Failed to parse Google auth credential: access_token must be a non empty string.');
    if (typeof expiryDate !== 'number')
        throw new error_1$a.FirebaseAppError(error_1$a.AppErrorCodes.INVALID_CREDENTIAL, 'Failed to parse Google auth credential: Invalid expiry_date.');
    return {
        ...credentials,
        access_token: accessToken,
        // inverse operation of following
        // https://github.com/googleapis/google-auth-library-nodejs/blob/5ed910513451c82e2551777a3e2212964799ef8e/src/auth/baseexternalclient.ts#L446-L446
        expires_in: Math.floor((expiryDate - new Date().getTime()) / 1000),
    };
}

var version = "13.10.0";
const require$$2$2 = {
	version: version};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(utils$4, "__esModule", { value: true });
utils$4.getSdkVersion = getSdkVersion;
utils$4.getMetricsHeader = getMetricsHeader;
utils$4.renameProperties = renameProperties;
utils$4.addReadonlyGetter = addReadonlyGetter;
utils$4.getExplicitProjectId = getExplicitProjectId;
utils$4.findProjectId = findProjectId;
utils$4.getExplicitServiceAccountEmail = getExplicitServiceAccountEmail;
utils$4.findServiceAccountEmail = findServiceAccountEmail;
utils$4.toWebSafeBase64 = toWebSafeBase64;
utils$4.formatString = formatString;
utils$4.generateUpdateMask = generateUpdateMask;
utils$4.transformMillisecondsToSecondsString = transformMillisecondsToSecondsString;
utils$4.parseResourceName = parseResourceName;
const credential_internal_1$4 = credentialInternal;
const validator$a = validator$b;
let sdkVersion;
// TODO: Move to firebase-admin/app as an internal member.
function getSdkVersion() {
    if (!sdkVersion) {
        const { version } = require$$2$2; // eslint-disable-line @typescript-eslint/no-var-requires
        sdkVersion = version;
    }
    return sdkVersion;
}
function getMetricsHeader() {
    return `gl-node/${process.versions.node} fire-admin/${getSdkVersion()}`;
}
/**
 * Renames properties on an object given a mapping from old to new property names.
 *
 * For example, this can be used to map underscore_cased properties to camelCase.
 *
 * @param obj - The object whose properties to rename.
 * @param keyMap - The mapping from old to new property names.
 */
function renameProperties(obj, keyMap) {
    Object.keys(keyMap).forEach((oldKey) => {
        if (oldKey in obj) {
            const newKey = keyMap[oldKey];
            // The old key's value takes precedence over the new key's value.
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
        }
    });
}
/**
 * Defines a new read-only property directly on an object and returns the object.
 *
 * @param obj - The object on which to define the property.
 * @param prop - The name of the property to be defined or modified.
 * @param value - The value associated with the property.
 */
function addReadonlyGetter(obj, prop, value) {
    Object.defineProperty(obj, prop, {
        value,
        // Make this property read-only.
        writable: false,
        // Include this property during enumeration of obj's properties.
        enumerable: true,
    });
}
/**
 * Returns the Google Cloud project ID associated with a Firebase app, if it's explicitly
 * specified in either the Firebase app options, credentials or the local environment.
 * Otherwise returns null.
 *
 * @param app - A Firebase app to get the project ID from.
 *
 * @returns A project ID string or null.
 */
function getExplicitProjectId(app) {
    const options = app.options;
    if (validator$a.isNonEmptyString(options.projectId)) {
        return options.projectId;
    }
    const credential = app.options.credential;
    if (credential instanceof credential_internal_1$4.ServiceAccountCredential) {
        return credential.projectId;
    }
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
    if (validator$a.isNonEmptyString(projectId)) {
        return projectId;
    }
    return null;
}
/**
 * Determines the Google Cloud project ID associated with a Firebase app. This method
 * first checks if a project ID is explicitly specified in either the Firebase app options,
 * credentials or the local environment in that order. If no explicit project ID is
 * configured, but the SDK has been initialized with ComputeEngineCredentials, this
 * method attempts to discover the project ID from the local metadata service.
 *
 * @param app - A Firebase app to get the project ID from.
 *
 * @returns A project ID string or null.
 */
function findProjectId(app) {
    const projectId = getExplicitProjectId(app);
    if (projectId) {
        return Promise.resolve(projectId);
    }
    const credential = app.options.credential;
    if (credential instanceof credential_internal_1$4.ApplicationDefaultCredential) {
        return credential.getProjectId();
    }
    return Promise.resolve(null);
}
/**
 * Returns the service account email associated with a Firebase app, if it's explicitly
 * specified in either the Firebase app options, credentials or the local environment.
 * Otherwise returns null.
 *
 * @param app - A Firebase app to get the service account email from.
 *
 * @returns A service account email string or null.
 */
function getExplicitServiceAccountEmail(app) {
    const options = app.options;
    if (validator$a.isNonEmptyString(options.serviceAccountId)) {
        return options.serviceAccountId;
    }
    const credential = app.options.credential;
    if (credential instanceof credential_internal_1$4.ServiceAccountCredential) {
        return credential.clientEmail;
    }
    return null;
}
/**
 * Determines the service account email associated with a Firebase app. This method first
 * checks if a service account email is explicitly specified in either the Firebase app options,
 * credentials or the local environment in that order. If no explicit service account email is
 * configured, but the SDK has been initialized with ComputeEngineCredentials, this
 * method attempts to discover the service account email from the local metadata service.
 *
 * @param app - A Firebase app to get the service account email from.
 *
 * @returns A service account email ID string or null.
 */
function findServiceAccountEmail(app) {
    const accountId = getExplicitServiceAccountEmail(app);
    if (accountId) {
        return Promise.resolve(accountId);
    }
    const credential = app.options.credential;
    if (credential instanceof credential_internal_1$4.ApplicationDefaultCredential) {
        return credential.getServiceAccountEmail();
    }
    return Promise.resolve(null);
}
/**
 * Encodes data using web-safe-base64.
 *
 * @param data - The raw data byte input.
 * @returns The base64-encoded result.
 */
function toWebSafeBase64(data) {
    return data.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
}
/**
 * Formats a string of form 'project/{projectId}/{api}' and replaces
 * with corresponding arguments {projectId: '1234', api: 'resource'}
 * and returns output: 'project/1234/resource'.
 *
 * @param str - The original string where the param need to be
 *     replaced.
 * @param params - The optional parameters to replace in the
 *     string.
 * @returns The resulting formatted string.
 */
function formatString(str, params) {
    let formatted = str;
    Object.keys(params || {}).forEach((key) => {
        formatted = formatted.replace(new RegExp('{' + key + '}', 'g'), params[key]);
    });
    return formatted;
}
/**
 * Generates the update mask for the provided object.
 * Note this will ignore the last key with value undefined.
 *
 * @param obj - The object to generate the update mask for.
 * @param terminalPaths - The optional map of keys for maximum paths to traverse.
 *      Nested objects beyond that path will be ignored. This is useful for
 *      keys with variable object values.
 * @param root - The path so far.
 * @returns The computed update mask list.
 */
function generateUpdateMask(obj, terminalPaths = [], root = '') {
    const updateMask = [];
    if (!validator$a.isNonNullObject(obj)) {
        return updateMask;
    }
    for (const key in obj) {
        if (typeof obj[key] !== 'undefined') {
            const nextPath = root ? `${root}.${key}` : key;
            // We hit maximum path.
            // Consider switching to Set<string> if the list grows too large.
            if (terminalPaths.indexOf(nextPath) !== -1) {
                // Add key and stop traversing this branch.
                updateMask.push(key);
            }
            else {
                const maskList = generateUpdateMask(obj[key], terminalPaths, nextPath);
                if (maskList.length > 0) {
                    maskList.forEach((mask) => {
                        updateMask.push(`${key}.${mask}`);
                    });
                }
                else {
                    updateMask.push(key);
                }
            }
        }
    }
    return updateMask;
}
/**
 * Transforms milliseconds to a protobuf Duration type string.
 * Returns the duration in seconds with up to nine fractional
 * digits, terminated by 's'. Example: "3 seconds 0 nano seconds as 3s,
 * 3 seconds 1 nano seconds as 3.000000001s".
 *
 * @param milliseconds - The duration in milliseconds.
 * @returns The resulting formatted string in seconds with up to nine fractional
 * digits, terminated by 's'.
 */
function transformMillisecondsToSecondsString(milliseconds) {
    let duration;
    const seconds = Math.floor(milliseconds / 1000);
    const nanos = Math.floor((milliseconds - seconds * 1000) * 1000000);
    if (nanos > 0) {
        let nanoString = nanos.toString();
        while (nanoString.length < 9) {
            nanoString = '0' + nanoString;
        }
        duration = `${seconds}.${nanoString}s`;
    }
    else {
        duration = `${seconds}s`;
    }
    return duration;
}
/**
 * Parses the top level resources of a given resource name.
 * Supports both full and partial resources names, example:
 * `locations/{location}/functions/{functionName}`,
 * `projects/{project}/locations/{location}/functions/{functionName}`, or {functionName}
 * Does not support deeply nested resource names.
 *
 * @param resourceName - The resource name string.
 * @param resourceIdKey - The key of the resource name to be parsed.
 * @returns A parsed resource name object.
 */
function parseResourceName(resourceName, resourceIdKey) {
    if (!resourceName.includes('/')) {
        return { resourceId: resourceName };
    }
    const CHANNEL_NAME_REGEX = new RegExp(`^(projects/([^/]+)/)?locations/([^/]+)/${resourceIdKey}/([^/]+)$`);
    const match = CHANNEL_NAME_REGEX.exec(resourceName);
    if (match === null) {
        throw new Error('Invalid resource name format.');
    }
    const projectId = match[2];
    const locationId = match[3];
    const resourceId = match[4];
    return { projectId, locationId, resourceId };
}

var lifecycle = {};

var firebaseApp = {};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(firebaseApp, "__esModule", { value: true });
firebaseApp.FirebaseApp = firebaseApp.FirebaseAppInternals = void 0;
const credential_internal_1$3 = credentialInternal;
const validator$9 = validator$b;
const deep_copy_1$5 = deepCopy$1;
const error_1$9 = error;
const TOKEN_EXPIRY_THRESHOLD_MILLIS = 5 * 60 * 1000;
/**
 * Internals of a FirebaseApp instance.
 */
class FirebaseAppInternals {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    constructor(credential_) {
        this.credential_ = credential_;
        this.tokenListeners_ = [];
        this.isRefreshing = false;
    }
    getToken(forceRefresh = false) {
        if (forceRefresh || this.shouldRefresh()) {
            this.promiseToCachedToken_ = this.refreshToken();
        }
        return this.promiseToCachedToken_;
    }
    getCachedToken() {
        return this.cachedToken_ || null;
    }
    refreshToken() {
        this.isRefreshing = true;
        return Promise.resolve(this.credential_.getAccessToken())
            .then((result) => {
            // Since the developer can provide the credential implementation, we want to weakly verify
            // the return type until the type is properly exported.
            if (!validator$9.isNonNullObject(result) ||
                typeof result.expires_in !== 'number' ||
                typeof result.access_token !== 'string') {
                throw new error_1$9.FirebaseAppError(error_1$9.AppErrorCodes.INVALID_CREDENTIAL, `Invalid access token generated: "${JSON.stringify(result)}". Valid access ` +
                    'tokens must be an object with the "expires_in" (number) and "access_token" ' +
                    '(string) properties.');
            }
            const token = {
                accessToken: result.access_token,
                expirationTime: Date.now() + (result.expires_in * 1000),
            };
            if (!this.cachedToken_
                || this.cachedToken_.accessToken !== token.accessToken
                || this.cachedToken_.expirationTime !== token.expirationTime) {
                // Update the cache before firing listeners. Listeners may directly query the
                // cached token state.
                this.cachedToken_ = token;
                this.tokenListeners_.forEach((listener) => {
                    listener(token.accessToken);
                });
            }
            return token;
        })
            .catch((error) => {
            let errorMessage = (typeof error === 'string') ? error : error.message;
            errorMessage = 'Credential implementation provided to initializeApp() via the ' +
                '"credential" property failed to fetch a valid Google OAuth2 access token with the ' +
                `following error: "${errorMessage}".`;
            if (errorMessage.indexOf('invalid_grant') !== -1) {
                errorMessage += ' There are two likely causes: (1) your server time is not properly ' +
                    'synced or (2) your certificate key file has been revoked. To solve (1), re-sync the ' +
                    'time on your server. To solve (2), make sure the key ID for your key file is still ' +
                    'present at https://console.firebase.google.com/iam-admin/serviceaccounts/project. If ' +
                    'not, generate a new key file at ' +
                    'https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk.';
            }
            throw new error_1$9.FirebaseAppError(error_1$9.AppErrorCodes.INVALID_CREDENTIAL, errorMessage);
        })
            .finally(() => {
            this.isRefreshing = false;
        });
    }
    shouldRefresh() {
        return (!this.cachedToken_ || (this.cachedToken_.expirationTime - Date.now()) <= TOKEN_EXPIRY_THRESHOLD_MILLIS)
            && !this.isRefreshing;
    }
    /**
     * Adds a listener that is called each time a token changes.
     *
     * @param listener - The listener that will be called with each new token.
     */
    addAuthTokenListener(listener) {
        this.tokenListeners_.push(listener);
        if (this.cachedToken_) {
            listener(this.cachedToken_.accessToken);
        }
    }
    /**
     * Removes a token listener.
     *
     * @param listener - The listener to remove.
     */
    removeAuthTokenListener(listener) {
        this.tokenListeners_ = this.tokenListeners_.filter((other) => other !== listener);
    }
}
firebaseApp.FirebaseAppInternals = FirebaseAppInternals;
/**
 * Global context object for a collection of services using a shared authentication state.
 *
 * @internal
 */
class FirebaseApp {
    constructor(options, name, autoInit = false, appStore) {
        this.appStore = appStore;
        this.services_ = {};
        this.isDeleted_ = false;
        this.autoInit_ = false;
        this.customCredential_ = true;
        this.name_ = name;
        this.options_ = (0, deep_copy_1$5.deepCopy)(options);
        this.autoInit_ = autoInit;
        if (!validator$9.isNonNullObject(this.options_)) {
            throw new error_1$9.FirebaseAppError(error_1$9.AppErrorCodes.INVALID_APP_OPTIONS, 'Invalid Firebase app options passed as the first argument to initializeApp() for the ' +
                `app named "${this.name_}". Options must be a non-null object.`);
        }
        const hasCredential = ('credential' in this.options_);
        if (!hasCredential) {
            this.customCredential_ = false;
            this.options_.credential = (0, credential_internal_1$3.getApplicationDefault)(this.options_.httpAgent);
        }
        const credential = this.options_.credential;
        if (typeof credential !== 'object' || credential === null || typeof credential.getAccessToken !== 'function') {
            throw new error_1$9.FirebaseAppError(error_1$9.AppErrorCodes.INVALID_APP_OPTIONS, 'Invalid Firebase app options passed as the first argument to initializeApp() for the ' +
                `app named "${this.name_}". The "credential" property must be an object which implements ` +
                'the Credential interface.');
        }
        this.INTERNAL = new FirebaseAppInternals(credential);
    }
    /**
     * Returns the name of the FirebaseApp instance.
     *
     * @returns The name of the FirebaseApp instance.
     */
    get name() {
        this.checkDestroyed_();
        return this.name_;
    }
    /**
     * Returns the options for the FirebaseApp instance.
     *
     * @returns The options for the FirebaseApp instance.
     */
    get options() {
        this.checkDestroyed_();
        return (0, deep_copy_1$5.deepCopy)(this.options_);
    }
    /**
     * @internal
     */
    getOrInitService(name, init) {
        return this.ensureService_(name, () => init(this));
    }
    /**
     * Returns `true` if this app was initialized with auto-initialization.
     *
     * @internal
     */
    autoInit() {
        return this.autoInit_;
    }
    /**
     * Returns `true` if the `FirebaseApp` instance was initialized with a custom
     * `Credential`.
     *
     * @internal
     */
    customCredential() {
        return this.customCredential_;
    }
    /**
     * Deletes the FirebaseApp instance.
     *
     * @returns An empty Promise fulfilled once the FirebaseApp instance is deleted.
     */
    delete() {
        this.checkDestroyed_();
        // Also remove the instance from the AppStore. This is needed to support the existing
        // app.delete() use case. In the future we can remove this API, and deleteApp() will
        // become the only way to tear down an App.
        this.appStore?.removeApp(this.name);
        return Promise.all(Object.keys(this.services_).map((serviceName) => {
            const service = this.services_[serviceName];
            if (isStateful(service)) {
                return service.delete();
            }
            return Promise.resolve();
        })).then(() => {
            this.services_ = {};
            this.isDeleted_ = true;
        });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ensureService_(serviceName, initializer) {
        this.checkDestroyed_();
        if (!(serviceName in this.services_)) {
            this.services_[serviceName] = initializer();
        }
        return this.services_[serviceName];
    }
    /**
     * Throws an Error if the FirebaseApp instance has already been deleted.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    checkDestroyed_() {
        if (this.isDeleted_) {
            throw new error_1$9.FirebaseAppError(error_1$9.AppErrorCodes.APP_DELETED, `Firebase app named "${this.name_}" has already been deleted.`);
        }
    }
}
firebaseApp.FirebaseApp = FirebaseApp;
function isStateful(service) {
    return typeof service.delete === 'function';
}

const require$$5 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(fastDeepEqual);

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * @license
	 * Copyright 2021 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FIREBASE_CONFIG_VAR = exports.defaultAppStore = exports.AppStore = void 0;
	exports.initializeApp = initializeApp;
	exports.getApp = getApp;
	exports.getApps = getApps;
	exports.deleteApp = deleteApp;
	const fs = require$$1$2;
	const validator = validator$b;
	const error_1 = error;
	const credential_internal_1 = credentialInternal;
	const firebase_app_1 = firebaseApp;
	const fastDeepEqual = require$$5;
	const DEFAULT_APP_NAME = '[DEFAULT]';
	class AppStore {
	    constructor() {
	        this.appStore = new Map();
	    }
	    initializeApp(options, appName = DEFAULT_APP_NAME) {
	        validateAppNameFormat(appName);
	        let autoInit = false;
	        if (typeof options === 'undefined') {
	            autoInit = true;
	            options = loadOptionsFromEnvVar();
	            options.credential = (0, credential_internal_1.getApplicationDefault)();
	        }
	        // Check if an app already exists and, if so, ensure its `AppOptions` match
	        // those of this `initializeApp` request. 
	        if (!this.appStore.has(appName)) {
	            const app = new firebase_app_1.FirebaseApp(options, appName, autoInit, this);
	            this.appStore.set(app.name, app);
	            return app;
	        }
	        const currentApp = this.appStore.get(appName);
	        // Ensure the `autoInit` state matches the existing app's. If not, throw.
	        if (currentApp.autoInit() !== autoInit) {
	            throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_OPTIONS, `A Firebase app named "${appName}" already exists with a different configuration.`);
	        }
	        if (autoInit) {
	            // Auto-initialization is triggered when no options were passed to
	            // `initializeApp`. With no options to compare, simply return the App.
	            return currentApp;
	        }
	        // Ensure the options objects don't break deep equal comparisons.
	        validateAppOptionsSupportDeepEquals(options, currentApp);
	        // `FirebaseApp()` adds a synthesized `Credential` to `app.options` upon
	        // app construction. Run a comparison w/o `Credential` to see if the base
	        // configurations match. Return the existing app if so.
	        const currentAppOptions = { ...currentApp.options };
	        delete currentAppOptions.credential;
	        if (!fastDeepEqual(options, currentAppOptions)) {
	            throw new error_1.FirebaseAppError(error_1.AppErrorCodes.DUPLICATE_APP, `A Firebase app named "${appName}" already exists with a different configuration.`);
	        }
	        return currentApp;
	    }
	    getApp(appName = DEFAULT_APP_NAME) {
	        validateAppNameFormat(appName);
	        if (!this.appStore.has(appName)) {
	            let errorMessage = (appName === DEFAULT_APP_NAME)
	                ? 'The default Firebase app does not exist. ' : `Firebase app named "${appName}" does not exist. `;
	            errorMessage += 'Make sure you call initializeApp() before using any of the Firebase services.';
	            throw new error_1.FirebaseAppError(error_1.AppErrorCodes.NO_APP, errorMessage);
	        }
	        return this.appStore.get(appName);
	    }
	    getApps() {
	        // Return a copy so the caller cannot mutate the array
	        return Array.from(this.appStore.values());
	    }
	    deleteApp(app) {
	        if (typeof app !== 'object' || app === null || !('options' in app)) {
	            throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_ARGUMENT, 'Invalid app argument.');
	        }
	        // Make sure the given app already exists.
	        const existingApp = getApp(app.name);
	        // Delegate delete operation to the App instance itself. That will also remove the App
	        // instance from the AppStore.
	        return existingApp.delete();
	    }
	    clearAllApps() {
	        const promises = [];
	        this.getApps().forEach((app) => {
	            promises.push(this.deleteApp(app));
	        });
	        return Promise.all(promises).then();
	    }
	    /**
	     * Removes the specified App instance from the store. This is currently called by the
	     * {@link FirebaseApp.delete} method. Can be removed once the app deletion is handled
	     * entirely by the {@link deleteApp} top-level function.
	     */
	    removeApp(appName) {
	        this.appStore.delete(appName);
	    }
	}
	exports.AppStore = AppStore;
	/**
	 * Validates that the `requestedOptions` and the `existingApp` options objects
	 * do not have fields that would break deep equals comparisons.
	 *
	 * @param requestedOptions The incoming `AppOptions` of a new `initailizeApp`
	 *   request.
	 * @param existingApp An existing `FirebaseApp` with internal `options` to
	 *   compare against.
	 *
	 * @throws FirebaseAppError if the objects cannot be deeply compared.
	 *
	 * @internal
	 */
	function validateAppOptionsSupportDeepEquals(requestedOptions, existingApp) {
	    // http.Agent checks.
	    if (typeof requestedOptions.httpAgent !== 'undefined') {
	        throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_OPTIONS, `Firebase app named "${existingApp.name}" already exists and initializeApp was` +
	            ' invoked with an optional http.Agent. The SDK cannot confirm the equality' +
	            ' of http.Agent objects with the existing app. Please use getApp or getApps to reuse' +
	            ' the existing app instead.');
	    }
	    else if (typeof existingApp.options.httpAgent !== 'undefined') {
	        throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_OPTIONS, `An existing app named "${existingApp.name}" already exists with a different` +
	            ' options configuration: httpAgent.');
	    }
	    // Credential checks.
	    if (typeof requestedOptions.credential !== 'undefined') {
	        throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_OPTIONS, `Firebase app named "${existingApp.name}" already exists and initializeApp was` +
	            ' invoked with an optional Credential. The SDK cannot confirm the equality' +
	            ' of Credential objects with the existing app. Please use getApp or getApps' +
	            ' to reuse the existing app instead.');
	    }
	    if (existingApp.customCredential()) {
	        throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_OPTIONS, `An existing app named "${existingApp.name}" already exists with a different` +
	            ' options configuration: Credential.');
	    }
	}
	/**
	 * Checks to see if the provided appName is a non-empty string and throws if it
	 * is not.
	 *
	 * @param appName A string representation of an App name.
	 *
	 * @throws FirebaseAppError if appName is not of type string or is empty.
	 *
	 * @internal
	 */
	function validateAppNameFormat(appName) {
	    if (!validator.isNonEmptyString(appName)) {
	        throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_NAME, `Invalid Firebase app name "${appName}" provided. App name must be a non-empty string.`);
	    }
	}
	exports.defaultAppStore = new AppStore();
	/**
	 * Initializes the `App` instance.
	 *
	 * Creates a new instance of {@link App} if one doesn't exist, or returns an existing
	 * `App` instance if one exists with the same `appName` and `options`.
	 *
	 * Note, due to the inablity to compare `http.Agent` objects and `Credential` objects,
	 * this function cannot support idempotency if either of `options.httpAgent` or
	 * `options.credential` are defined. When either is defined, subsequent invocations will
	 * throw a `FirebaseAppError` instead of returning an `App` object.
	 *
	 * For example, to safely initialize an app that may already exist:
	 *
	 * ```javascript
	 * let app;
	 * try {
	 *   app = getApp("myApp");
	 * } catch (error) {
	 *   app = initializeApp({ credential: myCredential }, "myApp");
	 * }
	 * ```
	 *
	 * @param options - Optional A set of {@link AppOptions} for the `App` instance.
	 *   If not present, `initializeApp` will try to initialize with the options from the
	 *   `FIREBASE_CONFIG` environment variable. If the environment variable contains a
	 *   string that starts with `{` it will be parsed as JSON, otherwise it will be
	 *   assumed to be pointing to a file.
	 * @param appName - Optional name of the `App` instance.
	 *
	 * @returns A new App instance, or the existing App if the instance already exists with
	 *   the provided configuration.
	 *
	 * @throws FirebaseAppError if an `App` with the same name has already been
	 *   initialized with a different set of `AppOptions`.
	 * @throws FirebaseAppError if an existing `App` exists and `options.httpAgent`
	 *   or `options.credential` are defined. This is due to the function's inability to
	 *   determine if the existing `App`'s `options` equate to the `options` parameter
	 *   of this function. It's recommended to use {@link getApp} or {@link getApps} if your
	 *   implementation uses either of these two fields in `AppOptions`.
	 */
	function initializeApp(options, appName = DEFAULT_APP_NAME) {
	    return exports.defaultAppStore.initializeApp(options, appName);
	}
	/**
	 * Returns an existing {@link App} instance for the provided name. If no name
	 * is provided the the default app name is used.
	 *
	 * @param appName - Optional name of the `App` instance.
	 *
	 * @returns An existing `App` instance that matches the name provided.
	 *
	 * @throws FirebaseAppError if no `App` exists for the given name.
	 * @throws FirebaseAppError if the `appName` is malformed.
	 */
	function getApp(appName = DEFAULT_APP_NAME) {
	    return exports.defaultAppStore.getApp(appName);
	}
	/**
	 * A (read-only) array of all initialized apps.
	 *
	 * @returns An array containing all initialized apps.
	 */
	function getApps() {
	    return exports.defaultAppStore.getApps();
	}
	/**
	 * Renders this given `App` unusable and frees the resources of
	 * all associated services (though it does *not* clean up any backend
	 * resources). When running the SDK locally, this method
	 * must be called to ensure graceful termination of the process.
	 *
	 * @example
	 * ```javascript
	 * deleteApp(app)
	 *   .then(function() {
	 *     console.log("App deleted successfully");
	 *   })
	 *   .catch(function(error) {
	 *     console.log("Error deleting app:", error);
	 *   });
	 * ```
	 */
	function deleteApp(app) {
	    return exports.defaultAppStore.deleteApp(app);
	}
	/**
	 * Constant holding the environment variable name with the default config.
	 * If the environment variable contains a string that starts with '{' it will be parsed as JSON,
	 * otherwise it will be assumed to be pointing to a file.
	 */
	exports.FIREBASE_CONFIG_VAR = 'FIREBASE_CONFIG';
	/**
	 * Parse the file pointed to by the FIREBASE_CONFIG_VAR, if it exists.
	 * Or if the FIREBASE_CONFIG_ENV contains a valid JSON object, parse it directly.
	 * If the environment variable contains a string that starts with '{' it will be parsed as JSON,
	 * otherwise it will be assumed to be pointing to a file.
	 */
	function loadOptionsFromEnvVar() {
	    const config = process.env[exports.FIREBASE_CONFIG_VAR];
	    if (!validator.isNonEmptyString(config)) {
	        return {};
	    }
	    try {
	        const contents = config.startsWith('{') ? config : fs.readFileSync(config, 'utf8');
	        return JSON.parse(contents);
	    }
	    catch (error) {
	        // Throw a nicely formed error message if the file contents cannot be parsed
	        throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INVALID_APP_OPTIONS, 'Failed to parse app options file: ' + error);
	    }
	} 
} (lifecycle));

var credentialFactory = {};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(credentialFactory, "__esModule", { value: true });
credentialFactory.applicationDefault = applicationDefault;
credentialFactory.cert = cert$1;
credentialFactory.refreshToken = refreshToken;
credentialFactory.clearGlobalAppDefaultCred = clearGlobalAppDefaultCred;
const credential_internal_1$2 = credentialInternal;
let globalAppDefaultCred;
const globalCertCreds = {};
const globalRefreshTokenCreds = {};
/**
 * Returns a credential created from the
 * {@link https://developers.google.com/identity/protocols/application-default-credentials |
 * Google Application Default Credentials}
 * that grants admin access to Firebase services. This credential can be used
 * in the call to {@link firebase-admin.app#initializeApp}.
 *
 * Google Application Default Credentials are available on any Google
 * infrastructure, such as Google App Engine and Google Compute Engine.
 *
 * See
 * {@link https://firebase.google.com/docs/admin/setup#initialize_the_sdk | Initialize the SDK}
 * for more details.
 *
 * @example
 * ```javascript
 * initializeApp({
 *   credential: applicationDefault(),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @param httpAgent - Optional {@link https://nodejs.org/api/http.html#http_class_http_agent | HTTP Agent}
 *   to be used when retrieving access tokens from Google token servers.
 *
 * @returns A credential authenticated via Google
 *   Application Default Credentials that can be used to initialize an app.
 */
function applicationDefault(httpAgent) {
    if (typeof globalAppDefaultCred === 'undefined') {
        globalAppDefaultCred = (0, credential_internal_1$2.getApplicationDefault)(httpAgent);
    }
    return globalAppDefaultCred;
}
/**
 * Returns a credential created from the provided service account that grants
 * admin access to Firebase services. This credential can be used in the call
 * to {@link firebase-admin.app#initializeApp}.
 *
 * See
 * {@link https://firebase.google.com/docs/admin/setup#initialize_the_sdk | Initialize the SDK}
 * for more details.
 *
 * @example
 * ```javascript
 * // Providing a path to a service account key JSON file
 * const serviceAccount = require("path/to/serviceAccountKey.json");
 * initializeApp({
 *   credential: cert(serviceAccount),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @example
 * ```javascript
 * // Providing a service account object inline
 * initializeApp({
 *   credential: cert({
 *     projectId: "<PROJECT_ID>",
 *     clientEmail: "foo@<PROJECT_ID>.iam.gserviceaccount.com",
 *     privateKey: "-----BEGIN PRIVATE KEY-----<KEY>-----END PRIVATE KEY-----\n"
 *   }),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @param serviceAccountPathOrObject - The path to a service
 *   account key JSON file or an object representing a service account key.
 * @param httpAgent - Optional {@link https://nodejs.org/api/http.html#http_class_http_agent | HTTP Agent}
 *   to be used when retrieving access tokens from Google token servers.
 *
 * @returns A credential authenticated via the
 *   provided service account that can be used to initialize an app.
 */
function cert$1(serviceAccountPathOrObject, httpAgent) {
    const stringifiedServiceAccount = JSON.stringify(serviceAccountPathOrObject);
    if (!(stringifiedServiceAccount in globalCertCreds)) {
        globalCertCreds[stringifiedServiceAccount] = new credential_internal_1$2.ServiceAccountCredential(serviceAccountPathOrObject, httpAgent);
    }
    return globalCertCreds[stringifiedServiceAccount];
}
/**
 * Returns a credential created from the provided refresh token that grants
 * admin access to Firebase services. This credential can be used in the call
 * to {@link firebase-admin.app#initializeApp}.
 *
 * See
 * {@link https://firebase.google.com/docs/admin/setup#initialize_the_sdk | Initialize the SDK}
 * for more details.
 *
 * @example
 * ```javascript
 * // Providing a path to a refresh token JSON file
 * const refreshToken = require("path/to/refreshToken.json");
 * initializeApp({
 *   credential: refreshToken(refreshToken),
 *   databaseURL: "https://<DATABASE_NAME>.firebaseio.com"
 * });
 * ```
 *
 * @param refreshTokenPathOrObject - The path to a Google
 *   OAuth2 refresh token JSON file or an object representing a Google OAuth2
 *   refresh token.
 * @param httpAgent - Optional {@link https://nodejs.org/api/http.html#http_class_http_agent | HTTP Agent}
 *   to be used when retrieving access tokens from Google token servers.
 *
 * @returns A credential authenticated via the
 *   provided service account that can be used to initialize an app.
 */
function refreshToken(refreshTokenPathOrObject, httpAgent) {
    const stringifiedRefreshToken = JSON.stringify(refreshTokenPathOrObject);
    if (!(stringifiedRefreshToken in globalRefreshTokenCreds)) {
        globalRefreshTokenCreds[stringifiedRefreshToken] = new credential_internal_1$2.RefreshTokenCredential(refreshTokenPathOrObject, httpAgent);
    }
    return globalRefreshTokenCreds[stringifiedRefreshToken];
}
/**
 * Clears the global ADC cache. Exported for testing.
 */
function clearGlobalAppDefaultCred() {
    globalAppDefaultCred = undefined;
}

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * @license
	 * Copyright 2021 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SDK_VERSION = exports.AppErrorCodes = exports.FirebaseAppError = exports.refreshToken = exports.cert = exports.applicationDefault = exports.deleteApp = exports.getApps = exports.getApp = exports.initializeApp = void 0;
	const utils_1 = utils$4;
	var lifecycle_1 = lifecycle;
	Object.defineProperty(exports, "initializeApp", { enumerable: true, get: function () { return lifecycle_1.initializeApp; } });
	Object.defineProperty(exports, "getApp", { enumerable: true, get: function () { return lifecycle_1.getApp; } });
	Object.defineProperty(exports, "getApps", { enumerable: true, get: function () { return lifecycle_1.getApps; } });
	Object.defineProperty(exports, "deleteApp", { enumerable: true, get: function () { return lifecycle_1.deleteApp; } });
	var credential_factory_1 = credentialFactory;
	Object.defineProperty(exports, "applicationDefault", { enumerable: true, get: function () { return credential_factory_1.applicationDefault; } });
	Object.defineProperty(exports, "cert", { enumerable: true, get: function () { return credential_factory_1.cert; } });
	Object.defineProperty(exports, "refreshToken", { enumerable: true, get: function () { return credential_factory_1.refreshToken; } });
	var error_1 = error;
	Object.defineProperty(exports, "FirebaseAppError", { enumerable: true, get: function () { return error_1.FirebaseAppError; } });
	Object.defineProperty(exports, "AppErrorCodes", { enumerable: true, get: function () { return error_1.AppErrorCodes; } });
	exports.SDK_VERSION = (0, utils_1.getSdkVersion)(); 
} (app));

const mod$2 = /*@__PURE__*/getDefaultExportFromCjs(app);

mod$2.AppErrorCodes;
mod$2.FirebaseAppError;
mod$2.SDK_VERSION;
mod$2.applicationDefault;
const cert = mod$2.cert;
mod$2.deleteApp;
mod$2.getApp;
const getApps = mod$2.getApps;
const initializeApp = mod$2.initializeApp;
mod$2.refreshToken;

var auth$1 = {};

var auth = {};

var authApiRequest = {};

var apiRequest = {};

const require$$2$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(http$1);

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(https$1);

const require$$4 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(http2$1);

const require$$0$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(url$1);

const require$$6 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(events);

const require$$9 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(busboy);

const require$$10 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(zlib);

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(apiRequest, "__esModule", { value: true });
apiRequest.Http2SessionHandler = apiRequest.ExponentialBackoffPoller = apiRequest.ApiSettings = apiRequest.AuthorizedHttp2Client = apiRequest.AuthorizedHttpClient = apiRequest.Http2Client = apiRequest.HttpClient = apiRequest.RequestClient = apiRequest.RequestResponseError = void 0;
apiRequest.defaultRetryConfig = defaultRetryConfig;
apiRequest.parseHttpResponse = parseHttpResponse;
const error_1$8 = error;
const validator$8 = validator$b;
const http = require$$2$1;
const https = require$$3;
const http2 = require$$4;
const url = require$$0$1;
const events_1 = require$$6;
const credential_internal_1$1 = credentialInternal;
const index_1$1 = utils$4;
class DefaultRequestResponse {
    /**
     * Constructs a new `RequestResponse` from the given `LowLevelResponse`.
     */
    constructor(resp) {
        this.status = resp.status;
        this.headers = resp.headers;
        this.text = resp.data;
        try {
            if (!resp.data) {
                throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INTERNAL_ERROR, 'HTTP response missing data.');
            }
            this.parsedData = JSON.parse(resp.data);
        }
        catch (err) {
            this.parsedData = undefined;
            this.parseError = err;
        }
        this.request = `${resp.config.method} ${resp.config.url}`;
    }
    get data() {
        if (this.isJson()) {
            return this.parsedData;
        }
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.UNABLE_TO_PARSE_RESPONSE, `Error while parsing response data: "${this.parseError.toString()}". Raw server ` +
            `response: "${this.text}". Status code: "${this.status}". Outgoing ` +
            `request: "${this.request}."`);
    }
    isJson() {
        return typeof this.parsedData !== 'undefined';
    }
}
/**
 * Represents a multipart HTTP or HTTP/2 response. Parts that constitute the response body can be accessed
 * via the multipart getter. Getters for text and data throw errors.
 */
class MultipartRequestResponse {
    constructor(resp) {
        this.status = resp.status;
        this.headers = resp.headers;
        this.multipart = resp.multipart;
    }
    get text() {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.UNABLE_TO_PARSE_RESPONSE, 'Unable to parse multipart payload as text');
    }
    get data() {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.UNABLE_TO_PARSE_RESPONSE, 'Unable to parse multipart payload as JSON');
    }
    isJson() {
        return false;
    }
}
class RequestResponseError extends Error {
    constructor(response) {
        super(`Server responded with status ${response.status}.`);
        this.response = response;
        // Set the prototype so that instanceof checks will work correctly.
        // See: https://github.com/Microsoft/TypeScript/issues/13965
        Object.setPrototypeOf(this, RequestResponseError.prototype);
    }
}
apiRequest.RequestResponseError = RequestResponseError;
/**
 * Default retry configuration for HTTP and HTTP/2 requests. Retries up to 4 times on connection reset and timeout
 * errors as well as 503 errors. Exposed as a function to ensure that every `RequestClient` gets its own `RetryConfig`
 * instance.
 */
function defaultRetryConfig() {
    return {
        maxRetries: 4,
        statusCodes: [503],
        ioErrorCodes: ['ECONNRESET', 'ETIMEDOUT'],
        backOffFactor: 0.5,
        maxDelayInMillis: 60 * 1000,
    };
}
/**
 * Ensures that the given `RetryConfig` object is valid.
 *
 * @param retry - The configuration to be validated.
 */
function validateRetryConfig(retry) {
    if (!validator$8.isNumber(retry.maxRetries) || retry.maxRetries < 0) {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INVALID_ARGUMENT, 'maxRetries must be a non-negative integer');
    }
    if (typeof retry.backOffFactor !== 'undefined') {
        if (!validator$8.isNumber(retry.backOffFactor) || retry.backOffFactor < 0) {
            throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INVALID_ARGUMENT, 'backOffFactor must be a non-negative number');
        }
    }
    if (!validator$8.isNumber(retry.maxDelayInMillis) || retry.maxDelayInMillis < 0) {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INVALID_ARGUMENT, 'maxDelayInMillis must be a non-negative integer');
    }
    if (typeof retry.statusCodes !== 'undefined' && !validator$8.isArray(retry.statusCodes)) {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INVALID_ARGUMENT, 'statusCodes must be an array');
    }
    if (typeof retry.ioErrorCodes !== 'undefined' && !validator$8.isArray(retry.ioErrorCodes)) {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INVALID_ARGUMENT, 'ioErrorCodes must be an array');
    }
}
class RequestClient {
    constructor(retry = defaultRetryConfig()) {
        if (retry) {
            this.retry = retry;
            validateRetryConfig(this.retry);
        }
    }
    createRequestResponse(resp) {
        if (resp.multipart) {
            return new MultipartRequestResponse(resp);
        }
        return new DefaultRequestResponse(resp);
    }
    waitForRetry(delayMillis) {
        if (delayMillis > 0) {
            return new Promise((resolve) => {
                setTimeout(resolve, delayMillis);
            });
        }
        return Promise.resolve();
    }
    /**
     * Checks if a failed request is eligible for a retry, and if so returns the duration to wait before initiating
     * the retry.
     *
     * @param retryAttempts - Number of retries completed up to now.
     * @param err - The last encountered error.
     * @returns A 2-tuple where the 1st element is the duration to wait before another retry, and the
     *     2nd element is a boolean indicating whether the request is eligible for a retry or not.
     */
    getRetryDelayMillis(retryAttempts, err) {
        if (!this.isRetryEligible(retryAttempts, err)) {
            return [0, false];
        }
        const response = err.response;
        if (response && response.headers['retry-after']) {
            const delayMillis = this.parseRetryAfterIntoMillis(response.headers['retry-after']);
            if (delayMillis > 0) {
                return [delayMillis, true];
            }
        }
        return [this.backOffDelayMillis(retryAttempts), true];
    }
    isRetryEligible(retryAttempts, err) {
        if (!this.retry) {
            return false;
        }
        if (retryAttempts >= this.retry.maxRetries) {
            return false;
        }
        if (err.response) {
            const statusCodes = this.retry.statusCodes || [];
            return statusCodes.indexOf(err.response.status) !== -1;
        }
        if (err.code) {
            const retryCodes = this.retry.ioErrorCodes || [];
            return retryCodes.indexOf(err.code) !== -1;
        }
        return false;
    }
    /**???
     * Parses the Retry-After header as a milliseconds value. Return value is negative if the Retry-After header
     * contains an expired timestamp or otherwise malformed.
     */
    parseRetryAfterIntoMillis(retryAfter) {
        const delaySeconds = parseInt(retryAfter, 10);
        if (!isNaN(delaySeconds)) {
            return delaySeconds * 1000;
        }
        const date = new Date(retryAfter);
        if (!isNaN(date.getTime())) {
            return date.getTime() - Date.now();
        }
        return -1;
    }
    backOffDelayMillis(retryAttempts) {
        if (retryAttempts === 0) {
            return 0;
        }
        if (!this.retry) {
            throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INTERNAL_ERROR, 'Expected this.retry to exist.');
        }
        const backOffFactor = this.retry.backOffFactor || 0;
        const delayInSeconds = (2 ** retryAttempts) * backOffFactor;
        return Math.min(delayInSeconds * 1000, this.retry.maxDelayInMillis);
    }
}
apiRequest.RequestClient = RequestClient;
class HttpClient extends RequestClient {
    constructor(retry) {
        super(retry);
    }
    /**
     * Sends an HTTP request to a remote server. If the server responds with a successful response (2xx), the returned
     * promise resolves with an `RequestResponse`. If the server responds with an error (3xx, 4xx, 5xx), the promise
     * rejects with an `RequestResponseError`. In case of all other errors, the promise rejects with a `FirebaseAppError`.
     * If a request fails due to a low-level network error, the client transparently retries the request once before
     * rejecting the promise.
     *
     * If the request data is specified as an object, it will be serialized into a JSON string. The application/json
     * content-type header will also be automatically set in this case. For all other payload types, the content-type
     * header should be explicitly set by the caller. To send a JSON leaf value (e.g. "foo", 5), parse it into JSON,
     * and pass as a string or a Buffer along with the appropriate content-type header.
     *
     * @param config - HTTP request to be sent.
     * @returns A promise that resolves with the response details.
     */
    send(config) {
        return this.sendWithRetry(config);
    }
    /**
     * Sends an HTTP request. In the event of an error, retries the HTTP request according to the
     * `RetryConfig` set on the `HttpClient`.
     *
     * @param config - HTTP request to be sent.
     * @param retryAttempts - Number of retries performed up to now.
     * @returns A promise that resolves with the response details.
     */
    sendWithRetry(config, retryAttempts = 0) {
        return AsyncHttpCall.invoke(config)
            .then((resp) => {
            return this.createRequestResponse(resp);
        })
            .catch((err) => {
            const [delayMillis, canRetry] = this.getRetryDelayMillis(retryAttempts, err);
            if (canRetry && this.retry && delayMillis <= this.retry.maxDelayInMillis) {
                return this.waitForRetry(delayMillis).then(() => {
                    return this.sendWithRetry(config, retryAttempts + 1);
                });
            }
            if (err.response) {
                throw new RequestResponseError(this.createRequestResponse(err.response));
            }
            if (err.code === 'ETIMEDOUT') {
                throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.NETWORK_TIMEOUT, `Error while making request: ${err.message}.`);
            }
            throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.NETWORK_ERROR, `Error while making request: ${err.message}. Error code: ${err.code}`);
        });
    }
}
apiRequest.HttpClient = HttpClient;
class Http2Client extends RequestClient {
    constructor(retry = defaultRetryConfig()) {
        super(retry);
    }
    /**
     * Sends an HTTP/2 request to a remote server. If the server responds with a successful response (2xx), the returned
     * promise resolves with an `RequestResponse`. If the server responds with an error (3xx, 4xx, 5xx), the promise
     * rejects with an `RequestResponseError`. In case of all other errors, the promise rejects with a `FirebaseAppError`.
     * If a request fails due to a low-level network error, the client transparently retries the request once before
     * rejecting the promise.
     *
     * If the request data is specified as an object, it will be serialized into a JSON string. The application/json
     * content-type header will also be automatically set in this case. For all other payload types, the content-type
     * header should be explicitly set by the caller. To send a JSON leaf value (e.g. "foo", 5), parse it into JSON,
     * and pass as a string or a Buffer along with the appropriate content-type header.
     *
     * @param config - HTTP/2 request to be sent.
     * @returns A promise that resolves with the response details.
     */
    send(config) {
        return this.sendWithRetry(config);
    }
    /**
     * Sends an HTTP/2 request. In the event of an error, retries the HTTP/2 request according to the
     * `RetryConfig` set on the `Http2Client`.
     *
     * @param config - HTTP/2 request to be sent.
     * @param retryAttempts - Number of retries performed up to now.
     * @returns A promise that resolves with the response details.
     */
    sendWithRetry(config, retryAttempts = 0) {
        return AsyncHttp2Call.invoke(config)
            .then((resp) => {
            return this.createRequestResponse(resp);
        })
            .catch((err) => {
            const [delayMillis, canRetry] = this.getRetryDelayMillis(retryAttempts, err);
            if (canRetry && this.retry && delayMillis <= this.retry.maxDelayInMillis) {
                return this.waitForRetry(delayMillis).then(() => {
                    return this.sendWithRetry(config, retryAttempts + 1);
                });
            }
            if (err.response) {
                throw new RequestResponseError(this.createRequestResponse(err.response));
            }
            if (err.code === 'ETIMEDOUT') {
                throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.NETWORK_TIMEOUT, `Error while making request: ${err.message}.`);
            }
            throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.NETWORK_ERROR, `Error while making request: ${err.message}. Error code: ${err.code}`);
        });
    }
}
apiRequest.Http2Client = Http2Client;
/**
 * Parses a full HTTP or HTTP/2 response message containing both a header and a body.
 *
 * @param response - The HTTP or HTTP/2 response to be parsed.
 * @param config - The request configuration that resulted in the HTTP or HTTP/2 response.
 * @returns An object containing the response's parsed status, headers and the body.
 */
function parseHttpResponse(response, config) {
    const responseText = validator$8.isBuffer(response) ?
        response.toString('utf-8') : response;
    const endOfHeaderPos = responseText.indexOf('\r\n\r\n');
    const headerLines = responseText.substring(0, endOfHeaderPos).split('\r\n');
    const statusLine = headerLines[0];
    const status = statusLine.trim().split(/\s/)[1];
    const headers = {};
    headerLines.slice(1).forEach((line) => {
        const colonPos = line.indexOf(':');
        const name = line.substring(0, colonPos).trim().toLowerCase();
        const value = line.substring(colonPos + 1).trim();
        headers[name] = value;
    });
    let data = responseText.substring(endOfHeaderPos + 4);
    if (data.endsWith('\n')) {
        data = data.slice(0, -1);
    }
    if (data.endsWith('\r')) {
        data = data.slice(0, -1);
    }
    const lowLevelResponse = {
        status: parseInt(status, 10),
        headers,
        data,
        config,
        request: null,
    };
    if (!validator$8.isNumber(lowLevelResponse.status)) {
        throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INTERNAL_ERROR, 'Malformed HTTP status line.');
    }
    return new DefaultRequestResponse(lowLevelResponse);
}
/**
 * A helper class for common functionality needed to send requests over the wire.
 * It also wraps the callback API of the Node.js standard library in a more flexible Promise API.
 */
class AsyncRequestCall {
    constructor(configImpl) {
        this.configImpl = configImpl;
    }
    /**
     * Extracts multipart boundary from the HTTP header. The content-type header of a multipart
     * response has the form 'multipart/subtype; boundary=string'.
     *
     * If the content-type header does not exist, or does not start with
     * 'multipart/', then null will be returned.
     */
    getMultipartBoundary(headers) {
        const contentType = headers['content-type'];
        if (!contentType || !contentType.startsWith('multipart/')) {
            return null;
        }
        const segments = contentType.split(';');
        const emptyObject = {};
        const headerParams = segments.slice(1)
            .map((segment) => segment.trim().split('='))
            .reduce((curr, params) => {
            // Parse key=value pairs in the content-type header into properties of an object.
            if (params.length === 2) {
                const keyValuePair = {};
                keyValuePair[params[0]] = params[1];
                return Object.assign(curr, keyValuePair);
            }
            return curr;
        }, emptyObject);
        return headerParams.boundary;
    }
    handleMultipartResponse(response, respStream, boundary) {
        const busboy = require$$9; // eslint-disable-line @typescript-eslint/no-var-requires
        const multipartParser = new busboy.Dicer({ boundary });
        const responseBuffer = [];
        multipartParser.on('part', (part) => {
            const tempBuffers = [];
            part.on('data', (partData) => {
                tempBuffers.push(partData);
            });
            part.on('end', () => {
                responseBuffer.push(Buffer.concat(tempBuffers));
            });
        });
        multipartParser.on('finish', () => {
            response.data = undefined;
            response.multipart = responseBuffer;
            this.finalizeResponse(response);
        });
        respStream.pipe(multipartParser);
    }
    handleRegularResponse(response, respStream) {
        const responseBuffer = [];
        respStream.on('data', (chunk) => {
            responseBuffer.push(chunk);
        });
        respStream.on('error', (err) => {
            const req = response.request;
            if (req && req.destroyed) {
                return;
            }
            this.enhanceAndReject(err, null, req);
        });
        respStream.on('end', () => {
            response.data = Buffer.concat(responseBuffer).toString();
            this.finalizeResponse(response);
        });
    }
    /**
     * Finalizes the current request call in-flight by either resolving or rejecting the associated
     * promise. In the event of an error, adds additional useful information to the returned error.
     */
    finalizeResponse(response) {
        if (response.status >= 200 && response.status < 300) {
            this.resolve(response);
        }
        else {
            this.rejectWithError('Request failed with status code ' + response.status, null, response.request, response);
        }
    }
    /**
     * Creates a new error from the given message, and enhances it with other information available.
     * Then the promise associated with this request call is rejected with the resulting error.
     */
    rejectWithError(message, code, request, response) {
        const error = new Error(message);
        this.enhanceAndReject(error, code, request, response);
    }
    enhanceAndReject(error, code, request, response) {
        this.reject(this.enhanceError(error, code, request, response));
    }
    /**
     * Enhances the given error by adding more information to it. Specifically, the request config,
     * the underlying request and response will be attached to the error.
     */
    enhanceError(error, code, request, response) {
        error.config = this.configImpl;
        if (code) {
            error.code = code;
        }
        error.request = request;
        error.response = response;
        return error;
    }
}
/**
 * A helper class for sending HTTP requests over the wire. This is a wrapper around the standard
 * http and https packages of Node.js, providing content processing, timeouts and error handling.
 * It also wraps the callback API of the Node.js standard library in a more flexible Promise API.
 */
class AsyncHttpCall extends AsyncRequestCall {
    /**
     * Sends an HTTP request based on the provided configuration.
     */
    static invoke(config) {
        return new AsyncHttpCall(config).promise;
    }
    constructor(config) {
        const httpConfigImpl = new HttpRequestConfigImpl(config);
        super(httpConfigImpl);
        try {
            this.httpConfigImpl = httpConfigImpl;
            this.options = this.httpConfigImpl.buildRequestOptions();
            if (!validator$8.isNonNullObject(this.options.headers)) {
                this.options.headers = {};
            }
            this.entity = this.httpConfigImpl.buildEntity(this.options.headers);
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
                this.execute();
            });
        }
        catch (err) {
            this.promise = Promise.reject(this.enhanceError(err, null));
        }
    }
    execute() {
        const transport = this.options.protocol === 'https:' ? https : http;
        const req = transport.request(this.options, (res) => {
            this.handleResponse(res, req);
        });
        // Handle errors
        req.on('error', (err) => {
            if (req.aborted) {
                return;
            }
            this.enhanceAndReject(err, null, req);
        });
        const timeout = this.httpConfigImpl.timeout;
        const timeoutCallback = () => {
            req.destroy();
            this.rejectWithError(`timeout of ${timeout}ms exceeded`, 'ETIMEDOUT', req);
        };
        if (timeout) {
            // Listen to timeouts and throw an error.
            req.setTimeout(timeout, timeoutCallback);
        }
        // Send the request
        req.end(this.entity);
    }
    handleResponse(res, req) {
        if (req.aborted) {
            return;
        }
        if (!res.statusCode) {
            throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INTERNAL_ERROR, 'Expected a statusCode on the response from a ClientRequest');
        }
        const response = {
            status: res.statusCode,
            headers: res.headers,
            request: req,
            data: undefined,
            config: this.httpConfigImpl,
        };
        const boundary = this.getMultipartBoundary(res.headers);
        const respStream = this.uncompressResponse(res);
        if (boundary) {
            this.handleMultipartResponse(response, respStream, boundary);
        }
        else {
            this.handleRegularResponse(response, respStream);
        }
    }
    uncompressResponse(res) {
        // Uncompress the response body transparently if required.
        let respStream = res;
        const encodings = ['gzip', 'compress', 'deflate'];
        if (res.headers['content-encoding'] && encodings.indexOf(res.headers['content-encoding']) !== -1) {
            // Add the unzipper to the body stream processing pipeline.
            const zlib = require$$10; // eslint-disable-line @typescript-eslint/no-var-requires
            respStream = respStream.pipe(zlib.createUnzip());
            // Remove the content-encoding in order to not confuse downstream operations.
            delete res.headers['content-encoding'];
        }
        return respStream;
    }
}
class AsyncHttp2Call extends AsyncRequestCall {
    /**
     * Sends an HTTP2 request based on the provided configuration.
     */
    static invoke(config) {
        return new AsyncHttp2Call(config).promise;
    }
    constructor(config) {
        const http2ConfigImpl = new Http2RequestConfigImpl(config);
        super(http2ConfigImpl);
        try {
            this.http2ConfigImpl = http2ConfigImpl;
            this.options = this.http2ConfigImpl.buildRequestOptions();
            if (!validator$8.isNonNullObject(this.options.headers)) {
                this.options.headers = {};
            }
            this.entity = this.http2ConfigImpl.buildEntity(this.options.headers);
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
                this.execute();
            });
        }
        catch (err) {
            this.promise = Promise.reject(this.enhanceError(err, null));
        }
    }
    execute() {
        const req = this.http2ConfigImpl.http2SessionHandler.session.request({
            ':method': this.options.method,
            ':scheme': this.options.protocol,
            ':path': this.options.path,
            ...this.options.headers
        });
        req.on('response', (headers) => {
            this.handleHttp2Response(headers, req);
        });
        // Handle errors
        req.on('error', (err) => {
            if (req.aborted) {
                return;
            }
            this.enhanceAndReject(err, null, req);
        });
        const timeout = this.http2ConfigImpl.timeout;
        const timeoutCallback = () => {
            req.destroy();
            this.rejectWithError(`timeout of ${timeout}ms exceeded`, 'ETIMEDOUT', req);
        };
        if (timeout) {
            // Listen to timeouts and throw an error.
            req.setTimeout(timeout, timeoutCallback);
        }
        req.end(this.entity);
    }
    handleHttp2Response(headers, stream) {
        if (stream.aborted) {
            return;
        }
        if (!headers[':status']) {
            throw new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.INTERNAL_ERROR, 'Expected a statusCode on the response from a ClientRequest');
        }
        const response = {
            status: headers[':status'],
            headers: headers,
            request: stream,
            data: undefined,
            config: this.http2ConfigImpl,
        };
        const boundary = this.getMultipartBoundary(headers);
        const respStream = this.uncompressResponse(headers, stream);
        if (boundary) {
            this.handleMultipartResponse(response, respStream, boundary);
        }
        else {
            this.handleRegularResponse(response, respStream);
        }
    }
    uncompressResponse(headers, stream) {
        // Uncompress the response body transparently if required.
        let respStream = stream;
        const encodings = ['gzip', 'compress', 'deflate'];
        if (headers['content-encoding'] && encodings.indexOf(headers['content-encoding']) !== -1) {
            // Add the unzipper to the body stream processing pipeline.
            const zlib = require$$10; // eslint-disable-line @typescript-eslint/no-var-requires
            respStream = respStream.pipe(zlib.createUnzip());
            // Remove the content-encoding in order to not confuse downstream operations.
            delete headers['content-encoding'];
        }
        return respStream;
    }
}
/**
 * An adapter class with common functionality needed to extract options and entity data from a `RequestConfig`.
 */
class BaseRequestConfigImpl {
    constructor(config) {
        this.config = config;
        this.config = config;
    }
    get method() {
        return this.config.method;
    }
    get url() {
        return this.config.url;
    }
    get headers() {
        return this.config.headers;
    }
    get data() {
        return this.config.data;
    }
    get timeout() {
        return this.config.timeout;
    }
    buildEntity(headers) {
        let data;
        if (!this.hasEntity() || !this.isEntityEnclosingRequest()) {
            return data;
        }
        if (validator$8.isBuffer(this.data)) {
            data = this.data;
        }
        else if (validator$8.isObject(this.data)) {
            data = Buffer.from(JSON.stringify(this.data), 'utf-8');
            if (typeof headers['content-type'] === 'undefined') {
                headers['content-type'] = 'application/json;charset=utf-8';
            }
        }
        else if (validator$8.isString(this.data)) {
            data = Buffer.from(this.data, 'utf-8');
        }
        else {
            throw new Error('Request data must be a string, a Buffer or a json serializable object');
        }
        // Add Content-Length header if data exists.
        headers['Content-Length'] = data.length.toString();
        return data;
    }
    buildUrl() {
        const fullUrl = this.urlWithProtocol();
        if (!this.hasEntity() || this.isEntityEnclosingRequest()) {
            return url.parse(fullUrl);
        }
        if (!validator$8.isObject(this.data)) {
            throw new Error(`${this.method} requests cannot have a body`);
        }
        // Parse URL and append data to query string.
        const parsedUrl = new url.URL(fullUrl);
        const dataObj = this.data;
        for (const key in dataObj) {
            if (Object.prototype.hasOwnProperty.call(dataObj, key)) {
                parsedUrl.searchParams.append(key, dataObj[key]);
            }
        }
        return url.parse(parsedUrl.toString());
    }
    urlWithProtocol() {
        const fullUrl = this.url;
        if (fullUrl.startsWith('http://') || fullUrl.startsWith('https://')) {
            return fullUrl;
        }
        return `https://${fullUrl}`;
    }
    hasEntity() {
        return !!this.data;
    }
    isEntityEnclosingRequest() {
        // GET and HEAD requests do not support entity (body) in request.
        return this.method !== 'GET' && this.method !== 'HEAD';
    }
}
/**
 * An adapter class for extracting options and entity data from an `HttpRequestConfig`.
 */
class HttpRequestConfigImpl extends BaseRequestConfigImpl {
    constructor(httpConfig) {
        super(httpConfig);
        this.httpConfig = httpConfig;
    }
    get httpAgent() {
        return this.httpConfig.httpAgent;
    }
    buildRequestOptions() {
        const parsed = this.buildUrl();
        const protocol = parsed.protocol;
        let port = parsed.port;
        if (!port) {
            const isHttps = protocol === 'https:';
            port = isHttps ? '443' : '80';
        }
        return {
            protocol,
            hostname: parsed.hostname,
            port,
            path: parsed.path,
            method: this.method,
            agent: this.httpAgent,
            headers: Object.assign({}, this.headers),
        };
    }
}
/**
 * An adapter class for extracting options and entity data from an `Http2RequestConfig`.
 */
class Http2RequestConfigImpl extends BaseRequestConfigImpl {
    constructor(http2Config) {
        super(http2Config);
        this.http2Config = http2Config;
    }
    get http2SessionHandler() {
        return this.http2Config.http2SessionHandler;
    }
    buildRequestOptions() {
        const parsed = this.buildUrl();
        // TODO(b/401051826)
        const protocol = parsed.protocol;
        return {
            protocol,
            path: parsed.path,
            method: this.method,
            headers: Object.assign({}, this.headers),
        };
    }
}
class AuthorizedHttpClient extends HttpClient {
    constructor(app) {
        super();
        this.app = app;
    }
    send(request) {
        return this.getToken().then((token) => {
            const requestCopy = Object.assign({}, request);
            requestCopy.headers = Object.assign({}, request.headers);
            const authHeader = 'Authorization';
            requestCopy.headers[authHeader] = `Bearer ${token}`;
            let quotaProjectId;
            if (this.app.options.credential instanceof credential_internal_1$1.ApplicationDefaultCredential) {
                quotaProjectId = this.app.options.credential.getQuotaProjectId();
            }
            quotaProjectId = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || quotaProjectId;
            if (!requestCopy.headers['x-goog-user-project'] && validator$8.isNonEmptyString(quotaProjectId)) {
                requestCopy.headers['x-goog-user-project'] = quotaProjectId;
            }
            if (!requestCopy.httpAgent && this.app.options.httpAgent) {
                requestCopy.httpAgent = this.app.options.httpAgent;
            }
            if (!requestCopy.headers['X-Goog-Api-Client']) {
                requestCopy.headers['X-Goog-Api-Client'] = (0, index_1$1.getMetricsHeader)();
            }
            return super.send(requestCopy);
        });
    }
    getToken() {
        return this.app.INTERNAL.getToken()
            .then((accessTokenObj) => accessTokenObj.accessToken);
    }
}
apiRequest.AuthorizedHttpClient = AuthorizedHttpClient;
class AuthorizedHttp2Client extends Http2Client {
    constructor(app) {
        super();
        this.app = app;
    }
    send(request) {
        return this.getToken().then((token) => {
            const requestCopy = Object.assign({}, request);
            requestCopy.headers = Object.assign({}, request.headers);
            const authHeader = 'Authorization';
            requestCopy.headers[authHeader] = `Bearer ${token}`;
            let quotaProjectId;
            if (this.app.options.credential instanceof credential_internal_1$1.ApplicationDefaultCredential) {
                quotaProjectId = this.app.options.credential.getQuotaProjectId();
            }
            quotaProjectId = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || quotaProjectId;
            if (!requestCopy.headers['x-goog-user-project'] && validator$8.isNonEmptyString(quotaProjectId)) {
                requestCopy.headers['x-goog-user-project'] = quotaProjectId;
            }
            if (!requestCopy.headers['X-Goog-Api-Client']) {
                requestCopy.headers['X-Goog-Api-Client'] = (0, index_1$1.getMetricsHeader)();
            }
            return super.send(requestCopy);
        });
    }
    getToken() {
        return this.app.INTERNAL.getToken()
            .then((accessTokenObj) => accessTokenObj.accessToken);
    }
}
apiRequest.AuthorizedHttp2Client = AuthorizedHttp2Client;
/**
 * Class that defines all the settings for the backend API endpoint.
 *
 * @param endpoint - The Firebase Auth backend endpoint.
 * @param httpMethod - The HTTP method for that endpoint.
 * @constructor
 */
class ApiSettings {
    constructor(endpoint, httpMethod = 'POST') {
        this.endpoint = endpoint;
        this.httpMethod = httpMethod;
        this.setRequestValidator(null)
            .setResponseValidator(null);
    }
    /** @returns The backend API endpoint. */
    getEndpoint() {
        return this.endpoint;
    }
    /** @returns The request HTTP method. */
    getHttpMethod() {
        return this.httpMethod;
    }
    /**
     * @param requestValidator - The request validator.
     * @returns The current API settings instance.
     */
    setRequestValidator(requestValidator) {
        const nullFunction = () => undefined;
        this.requestValidator = requestValidator || nullFunction;
        return this;
    }
    /** @returns The request validator. */
    getRequestValidator() {
        return this.requestValidator;
    }
    /**
     * @param responseValidator - The response validator.
     * @returns The current API settings instance.
     */
    setResponseValidator(responseValidator) {
        const nullFunction = () => undefined;
        this.responseValidator = responseValidator || nullFunction;
        return this;
    }
    /** @returns The response validator. */
    getResponseValidator() {
        return this.responseValidator;
    }
}
apiRequest.ApiSettings = ApiSettings;
/**
 * Class used for polling an endpoint with exponential backoff.
 *
 * Example usage:
 * ```
 * const poller = new ExponentialBackoffPoller();
 * poller
 *     .poll(() => {
 *       return myRequestToPoll()
 *           .then((responseData: any) => {
 *             if (!isValid(responseData)) {
 *               // Continue polling.
 *               return null;
 *             }
 *
 *             // Polling complete. Resolve promise with final response data.
 *             return responseData;
 *           });
 *     })
 *     .then((responseData: any) => {
 *       console.log(`Final response: ${responseData}`);
 *     });
 * ```
 */
class ExponentialBackoffPoller extends events_1.EventEmitter {
    constructor(initialPollingDelayMillis = 1000, maxPollingDelayMillis = 10000, masterTimeoutMillis = 60000) {
        super();
        this.initialPollingDelayMillis = initialPollingDelayMillis;
        this.maxPollingDelayMillis = maxPollingDelayMillis;
        this.masterTimeoutMillis = masterTimeoutMillis;
        this.numTries = 0;
        this.completed = false;
    }
    /**
     * Poll the provided callback with exponential backoff.
     *
     * @param callback - The callback to be called for each poll. If the
     *     callback resolves to a falsey value, polling will continue. Otherwise, the truthy
     *     resolution will be used to resolve the promise returned by this method.
     * @returns A Promise which resolves to the truthy value returned by the provided
     *     callback when polling is complete.
     */
    poll(callback) {
        if (this.pollCallback) {
            throw new Error('poll() can only be called once per instance of ExponentialBackoffPoller');
        }
        this.pollCallback = callback;
        this.on('poll', this.repoll);
        this.masterTimer = setTimeout(() => {
            if (this.completed) {
                return;
            }
            this.markCompleted();
            this.reject(new Error('ExponentialBackoffPoller deadline exceeded - Master timeout reached'));
        }, this.masterTimeoutMillis);
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.repoll();
        });
    }
    repoll() {
        this.pollCallback()
            .then((result) => {
            if (this.completed) {
                return;
            }
            if (!result) {
                this.repollTimer =
                    setTimeout(() => this.emit('poll'), this.getPollingDelayMillis());
                this.numTries++;
                return;
            }
            this.markCompleted();
            this.resolve(result);
        })
            .catch((err) => {
            if (this.completed) {
                return;
            }
            this.markCompleted();
            this.reject(err);
        });
    }
    getPollingDelayMillis() {
        const increasedPollingDelay = Math.pow(2, this.numTries) * this.initialPollingDelayMillis;
        return Math.min(increasedPollingDelay, this.maxPollingDelayMillis);
    }
    markCompleted() {
        this.completed = true;
        if (this.masterTimer) {
            clearTimeout(this.masterTimer);
        }
        if (this.repollTimer) {
            clearTimeout(this.repollTimer);
        }
    }
}
apiRequest.ExponentialBackoffPoller = ExponentialBackoffPoller;
class Http2SessionHandler {
    constructor(url) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.http2Session = this.createSession(url);
        });
    }
    createSession(url) {
        if (!this.http2Session || this.isClosed) {
            const opts = {
                // Set local max concurrent stream limit to respect backend limit
                peerMaxConcurrentStreams: 100,
                ALPNProtocols: ['h2']
            };
            const http2Session = http2.connect(url, opts);
            http2Session.on('goaway', (errorCode, _, opaqueData) => {
                this.reject(new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.NETWORK_ERROR, `Error while making requests: GOAWAY - ${opaqueData?.toString()}, Error code: ${errorCode}`));
            });
            http2Session.on('error', (error) => {
                let errorMessage;
                if (error.name == 'AggregateError' && error.errors) {
                    errorMessage = `Session error while making requests: ${error.code} - ${error.name}: ` +
                        `[${error.errors.map((e) => e.message).join(', ')}]`;
                }
                else {
                    errorMessage = `Session error while making requests: ${error.code} - ${error.message} `;
                }
                this.reject(new error_1$8.FirebaseAppError(error_1$8.AppErrorCodes.NETWORK_ERROR, errorMessage));
            });
            http2Session.on('close', () => {
                // Resolve current promise
                this.resolve();
            });
            return http2Session;
        }
        return this.http2Session;
    }
    invoke() {
        return this.promise;
    }
    get session() {
        return this.http2Session;
    }
    get isClosed() {
        return this.http2Session.closed;
    }
    close() {
        this.http2Session.close();
    }
}
apiRequest.Http2SessionHandler = Http2SessionHandler;

var userImportBuilder = {};

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(userImportBuilder, "__esModule", { value: true });
userImportBuilder.UserImportBuilder = void 0;
userImportBuilder.convertMultiFactorInfoToServerFormat = convertMultiFactorInfoToServerFormat;
const deep_copy_1$4 = deepCopy$1;
const utils$3 = utils$4;
const validator$7 = validator$b;
const error_1$7 = error;
/**
 * Converts a client format second factor object to server format.
 * @param multiFactorInfo - The client format second factor.
 * @returns The corresponding AuthFactorInfo server request format.
 */
function convertMultiFactorInfoToServerFormat(multiFactorInfo) {
    let enrolledAt;
    if (typeof multiFactorInfo.enrollmentTime !== 'undefined') {
        if (validator$7.isUTCDateString(multiFactorInfo.enrollmentTime)) {
            // Convert from UTC date string (client side format) to ISO date string (server side format).
            enrolledAt = new Date(multiFactorInfo.enrollmentTime).toISOString();
        }
        else {
            throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_ENROLLMENT_TIME, `The second factor "enrollmentTime" for "${multiFactorInfo.uid}" must be a valid ` +
                'UTC date string.');
        }
    }
    // Currently only phone second factors are supported.
    if (isPhoneFactor(multiFactorInfo)) {
        // If any required field is missing or invalid, validation will still fail later.
        const authFactorInfo = {
            mfaEnrollmentId: multiFactorInfo.uid,
            displayName: multiFactorInfo.displayName,
            // Required for all phone second factors.
            phoneInfo: multiFactorInfo.phoneNumber,
            enrolledAt,
        };
        for (const objKey in authFactorInfo) {
            if (typeof authFactorInfo[objKey] === 'undefined') {
                delete authFactorInfo[objKey];
            }
        }
        return authFactorInfo;
    }
    else {
        // Unsupported second factor.
        throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.UNSUPPORTED_SECOND_FACTOR, `Unsupported second factor "${JSON.stringify(multiFactorInfo)}" provided.`);
    }
}
function isPhoneFactor(multiFactorInfo) {
    return multiFactorInfo.factorId === 'phone';
}
/**
 * @param {any} obj The object to check for number field within.
 * @param {string} key The entry key.
 * @returns {number} The corresponding number if available. Otherwise, NaN.
 */
function getNumberField(obj, key) {
    if (typeof obj[key] !== 'undefined' && obj[key] !== null) {
        return parseInt(obj[key].toString(), 10);
    }
    return NaN;
}
/**
 * Converts a UserImportRecord to a UploadAccountUser object. Throws an error when invalid
 * fields are provided.
 * @param {UserImportRecord} user The UserImportRecord to conver to UploadAccountUser.
 * @param {ValidatorFunction=} userValidator The user validator function.
 * @returns {UploadAccountUser} The corresponding UploadAccountUser to return.
 */
function populateUploadAccountUser(user, userValidator) {
    const result = {
        localId: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        disabled: user.disabled,
        photoUrl: user.photoURL,
        phoneNumber: user.phoneNumber,
        providerUserInfo: [],
        mfaInfo: [],
        tenantId: user.tenantId,
        customAttributes: user.customClaims && JSON.stringify(user.customClaims),
    };
    if (typeof user.passwordHash !== 'undefined') {
        if (!validator$7.isBuffer(user.passwordHash)) {
            throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_PASSWORD_HASH);
        }
        result.passwordHash = utils$3.toWebSafeBase64(user.passwordHash);
    }
    if (typeof user.passwordSalt !== 'undefined') {
        if (!validator$7.isBuffer(user.passwordSalt)) {
            throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_PASSWORD_SALT);
        }
        result.salt = utils$3.toWebSafeBase64(user.passwordSalt);
    }
    if (validator$7.isNonNullObject(user.metadata)) {
        if (validator$7.isNonEmptyString(user.metadata.creationTime)) {
            result.createdAt = new Date(user.metadata.creationTime).getTime();
        }
        if (validator$7.isNonEmptyString(user.metadata.lastSignInTime)) {
            result.lastLoginAt = new Date(user.metadata.lastSignInTime).getTime();
        }
    }
    if (validator$7.isArray(user.providerData)) {
        user.providerData.forEach((providerData) => {
            result.providerUserInfo.push({
                providerId: providerData.providerId,
                rawId: providerData.uid,
                email: providerData.email,
                displayName: providerData.displayName,
                photoUrl: providerData.photoURL,
            });
        });
    }
    // Convert user.multiFactor.enrolledFactors to server format.
    if (validator$7.isNonNullObject(user.multiFactor) &&
        validator$7.isNonEmptyArray(user.multiFactor.enrolledFactors)) {
        user.multiFactor.enrolledFactors.forEach((multiFactorInfo) => {
            result.mfaInfo.push(convertMultiFactorInfoToServerFormat(multiFactorInfo));
        });
    }
    // Remove blank fields.
    let key;
    for (key in result) {
        if (typeof result[key] === 'undefined') {
            delete result[key];
        }
    }
    if (result.providerUserInfo.length === 0) {
        delete result.providerUserInfo;
    }
    if (result.mfaInfo.length === 0) {
        delete result.mfaInfo;
    }
    // Validate the constructured user individual request. This will throw if an error
    // is detected.
    if (typeof userValidator === 'function') {
        userValidator(result);
    }
    return result;
}
/**
 * Class that provides a helper for building/validating uploadAccount requests and
 * UserImportResult responses.
 */
class UserImportBuilder {
    /**
     * @param {UserImportRecord[]} users The list of user records to import.
     * @param {UserImportOptions=} options The import options which includes hashing
     *     algorithm details.
     * @param {ValidatorFunction=} userRequestValidator The user request validator function.
     * @constructor
     */
    constructor(users, options, userRequestValidator) {
        this.requiresHashOptions = false;
        this.validatedUsers = [];
        this.userImportResultErrors = [];
        this.indexMap = {};
        this.validatedUsers = this.populateUsers(users, userRequestValidator);
        this.validatedOptions = this.populateOptions(options, this.requiresHashOptions);
    }
    /**
     * Returns the corresponding constructed uploadAccount request.
     * @returns {UploadAccountRequest} The constructed uploadAccount request.
     */
    buildRequest() {
        const users = this.validatedUsers.map((user) => {
            return (0, deep_copy_1$4.deepCopy)(user);
        });
        return (0, deep_copy_1$4.deepExtend)({ users }, (0, deep_copy_1$4.deepCopy)(this.validatedOptions));
    }
    /**
     * Populates the UserImportResult using the client side detected errors and the server
     * side returned errors.
     * @returns {UserImportResult} The user import result based on the returned failed
     *     uploadAccount response.
     */
    buildResponse(failedUploads) {
        // Initialize user import result.
        const importResult = {
            successCount: this.validatedUsers.length,
            failureCount: this.userImportResultErrors.length,
            errors: (0, deep_copy_1$4.deepCopy)(this.userImportResultErrors),
        };
        importResult.failureCount += failedUploads.length;
        importResult.successCount -= failedUploads.length;
        failedUploads.forEach((failedUpload) => {
            importResult.errors.push({
                // Map backend request index to original developer provided array index.
                index: this.indexMap[failedUpload.index],
                error: new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_USER_IMPORT, failedUpload.message),
            });
        });
        // Sort errors by index.
        importResult.errors.sort((a, b) => {
            return a.index - b.index;
        });
        // Return sorted result.
        return importResult;
    }
    /**
     * Validates and returns the hashing options of the uploadAccount request.
     * Throws an error whenever an invalid or missing options is detected.
     * @param {UserImportOptions} options The UserImportOptions.
     * @param {boolean} requiresHashOptions Whether to require hash options.
     * @returns {UploadAccountOptions} The populated UploadAccount options.
     */
    populateOptions(options, requiresHashOptions) {
        let populatedOptions;
        if (!requiresHashOptions) {
            return {};
        }
        if (!validator$7.isNonNullObject(options)) {
            throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_ARGUMENT, '"UserImportOptions" are required when importing users with passwords.');
        }
        if (!validator$7.isNonNullObject(options.hash)) {
            throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.MISSING_HASH_ALGORITHM, '"hash.algorithm" is missing from the provided "UserImportOptions".');
        }
        if (typeof options.hash.algorithm === 'undefined' ||
            !validator$7.isNonEmptyString(options.hash.algorithm)) {
            throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_ALGORITHM, '"hash.algorithm" must be a string matching the list of supported algorithms.');
        }
        let rounds;
        switch (options.hash.algorithm) {
            case 'HMAC_SHA512':
            case 'HMAC_SHA256':
            case 'HMAC_SHA1':
            case 'HMAC_MD5':
                if (!validator$7.isBuffer(options.hash.key)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_KEY, 'A non-empty "hash.key" byte buffer must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                populatedOptions = {
                    hashAlgorithm: options.hash.algorithm,
                    signerKey: utils$3.toWebSafeBase64(options.hash.key),
                };
                break;
            case 'MD5':
            case 'SHA1':
            case 'SHA256':
            case 'SHA512': {
                // MD5 is [0,8192] but SHA1, SHA256, and SHA512 are [1,8192]
                rounds = getNumberField(options.hash, 'rounds');
                const minRounds = options.hash.algorithm === 'MD5' ? 0 : 1;
                if (isNaN(rounds) || rounds < minRounds || rounds > 8192) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_ROUNDS, `A valid "hash.rounds" number between ${minRounds} and 8192 must be provided for ` +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                populatedOptions = {
                    hashAlgorithm: options.hash.algorithm,
                    rounds,
                };
                break;
            }
            case 'PBKDF_SHA1':
            case 'PBKDF2_SHA256':
                rounds = getNumberField(options.hash, 'rounds');
                if (isNaN(rounds) || rounds < 0 || rounds > 120000) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_ROUNDS, 'A valid "hash.rounds" number between 0 and 120000 must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                populatedOptions = {
                    hashAlgorithm: options.hash.algorithm,
                    rounds,
                };
                break;
            case 'SCRYPT': {
                if (!validator$7.isBuffer(options.hash.key)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_KEY, 'A "hash.key" byte buffer must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                rounds = getNumberField(options.hash, 'rounds');
                if (isNaN(rounds) || rounds <= 0 || rounds > 8) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_ROUNDS, 'A valid "hash.rounds" number between 1 and 8 must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                const memoryCost = getNumberField(options.hash, 'memoryCost');
                if (isNaN(memoryCost) || memoryCost <= 0 || memoryCost > 14) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_MEMORY_COST, 'A valid "hash.memoryCost" number between 1 and 14 must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                if (typeof options.hash.saltSeparator !== 'undefined' &&
                    !validator$7.isBuffer(options.hash.saltSeparator)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_SALT_SEPARATOR, '"hash.saltSeparator" must be a byte buffer.');
                }
                populatedOptions = {
                    hashAlgorithm: options.hash.algorithm,
                    signerKey: utils$3.toWebSafeBase64(options.hash.key),
                    rounds,
                    memoryCost,
                    saltSeparator: utils$3.toWebSafeBase64(options.hash.saltSeparator || Buffer.from('')),
                };
                break;
            }
            case 'BCRYPT':
                populatedOptions = {
                    hashAlgorithm: options.hash.algorithm,
                };
                break;
            case 'STANDARD_SCRYPT': {
                const cpuMemCost = getNumberField(options.hash, 'memoryCost');
                if (isNaN(cpuMemCost)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_MEMORY_COST, 'A valid "hash.memoryCost" number must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                const parallelization = getNumberField(options.hash, 'parallelization');
                if (isNaN(parallelization)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_PARALLELIZATION, 'A valid "hash.parallelization" number must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                const blockSize = getNumberField(options.hash, 'blockSize');
                if (isNaN(blockSize)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_BLOCK_SIZE, 'A valid "hash.blockSize" number must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                const dkLen = getNumberField(options.hash, 'derivedKeyLength');
                if (isNaN(dkLen)) {
                    throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_DERIVED_KEY_LENGTH, 'A valid "hash.derivedKeyLength" number must be provided for ' +
                        `hash algorithm ${options.hash.algorithm}.`);
                }
                populatedOptions = {
                    hashAlgorithm: options.hash.algorithm,
                    cpuMemCost,
                    parallelization,
                    blockSize,
                    dkLen,
                };
                break;
            }
            default:
                throw new error_1$7.FirebaseAuthError(error_1$7.AuthClientErrorCode.INVALID_HASH_ALGORITHM, `Unsupported hash algorithm provider "${options.hash.algorithm}".`);
        }
        return populatedOptions;
    }
    /**
     * Validates and returns the users list of the uploadAccount request.
     * Whenever a user with an error is detected, the error is cached and will later be
     * merged into the user import result. This allows the processing of valid users without
     * failing early on the first error detected.
     * @param {UserImportRecord[]} users The UserImportRecords to convert to UnploadAccountUser
     *     objects.
     * @param {ValidatorFunction=} userValidator The user validator function.
     * @returns {UploadAccountUser[]} The populated uploadAccount users.
     */
    populateUsers(users, userValidator) {
        const populatedUsers = [];
        users.forEach((user, index) => {
            try {
                const result = populateUploadAccountUser(user, userValidator);
                if (typeof result.passwordHash !== 'undefined') {
                    this.requiresHashOptions = true;
                }
                // Only users that pass client screening will be passed to backend for processing.
                populatedUsers.push(result);
                // Map user's index (the one to be sent to backend) to original developer provided array.
                this.indexMap[populatedUsers.length - 1] = index;
            }
            catch (error) {
                // Save the client side error with respect to the developer provided array.
                this.userImportResultErrors.push({
                    index,
                    error,
                });
            }
        });
        return populatedUsers;
    }
}
userImportBuilder.UserImportBuilder = UserImportBuilder;

var actionCodeSettingsBuilder = {};

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(actionCodeSettingsBuilder, "__esModule", { value: true });
actionCodeSettingsBuilder.ActionCodeSettingsBuilder = void 0;
const validator$6 = validator$b;
const error_1$6 = error;
/**
 * Defines the ActionCodeSettings builder class used to convert the
 * ActionCodeSettings object to its corresponding server request.
 *
 * @internal
 */
class ActionCodeSettingsBuilder {
    /**
     * ActionCodeSettingsBuilder constructor.
     *
     * @param {ActionCodeSettings} actionCodeSettings The ActionCodeSettings
     *     object used to initiliaze this server request builder.
     * @constructor
     */
    constructor(actionCodeSettings) {
        if (!validator$6.isNonNullObject(actionCodeSettings)) {
            throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings" must be a non-null object.');
        }
        if (typeof actionCodeSettings.url === 'undefined') {
            throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.MISSING_CONTINUE_URI);
        }
        else if (!validator$6.isURL(actionCodeSettings.url)) {
            throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_CONTINUE_URI);
        }
        this.continueUrl = actionCodeSettings.url;
        if (typeof actionCodeSettings.handleCodeInApp !== 'undefined' &&
            !validator$6.isBoolean(actionCodeSettings.handleCodeInApp)) {
            throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.handleCodeInApp" must be a boolean.');
        }
        this.canHandleCodeInApp = actionCodeSettings.handleCodeInApp || false;
        if (typeof actionCodeSettings.dynamicLinkDomain !== 'undefined' &&
            !validator$6.isNonEmptyString(actionCodeSettings.dynamicLinkDomain)) {
            throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_DYNAMIC_LINK_DOMAIN);
        }
        this.dynamicLinkDomain = actionCodeSettings.dynamicLinkDomain;
        if (typeof actionCodeSettings.linkDomain !== 'undefined' &&
            !validator$6.isNonEmptyString(actionCodeSettings.linkDomain)) {
            throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_HOSTING_LINK_DOMAIN);
        }
        this.linkDomain = actionCodeSettings.linkDomain;
        if (typeof actionCodeSettings.iOS !== 'undefined') {
            if (!validator$6.isNonNullObject(actionCodeSettings.iOS)) {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.iOS" must be a valid non-null object.');
            }
            else if (typeof actionCodeSettings.iOS.bundleId === 'undefined') {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.MISSING_IOS_BUNDLE_ID);
            }
            else if (!validator$6.isNonEmptyString(actionCodeSettings.iOS.bundleId)) {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.iOS.bundleId" must be a valid non-empty string.');
            }
            this.ibi = actionCodeSettings.iOS.bundleId;
        }
        if (typeof actionCodeSettings.android !== 'undefined') {
            if (!validator$6.isNonNullObject(actionCodeSettings.android)) {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.android" must be a valid non-null object.');
            }
            else if (typeof actionCodeSettings.android.packageName === 'undefined') {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.MISSING_ANDROID_PACKAGE_NAME);
            }
            else if (!validator$6.isNonEmptyString(actionCodeSettings.android.packageName)) {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.android.packageName" must be a valid non-empty string.');
            }
            else if (typeof actionCodeSettings.android.minimumVersion !== 'undefined' &&
                !validator$6.isNonEmptyString(actionCodeSettings.android.minimumVersion)) {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.android.minimumVersion" must be a valid non-empty string.');
            }
            else if (typeof actionCodeSettings.android.installApp !== 'undefined' &&
                !validator$6.isBoolean(actionCodeSettings.android.installApp)) {
                throw new error_1$6.FirebaseAuthError(error_1$6.AuthClientErrorCode.INVALID_ARGUMENT, '"ActionCodeSettings.android.installApp" must be a valid boolean.');
            }
            this.apn = actionCodeSettings.android.packageName;
            this.amv = actionCodeSettings.android.minimumVersion;
            this.installApp = actionCodeSettings.android.installApp || false;
        }
    }
    /**
     * Returns the corresponding constructed server request corresponding to the
     * current ActionCodeSettings.
     *
     * @returns The constructed EmailActionCodeRequest request.
     */
    buildRequest() {
        const request = {
            continueUrl: this.continueUrl,
            canHandleCodeInApp: this.canHandleCodeInApp,
            dynamicLinkDomain: this.dynamicLinkDomain,
            linkDomain: this.linkDomain,
            androidPackageName: this.apn,
            androidMinimumVersion: this.amv,
            androidInstallApp: this.installApp,
            iOSBundleId: this.ibi,
        };
        // Remove all null and undefined fields from request.
        for (const key in request) {
            if (Object.prototype.hasOwnProperty.call(request, key)) {
                if (typeof request[key] === 'undefined' || request[key] === null) {
                    delete request[key];
                }
            }
        }
        return request;
    }
}
actionCodeSettingsBuilder.ActionCodeSettingsBuilder = ActionCodeSettingsBuilder;

var tenant = {};

var authConfig = {};

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * Copyright 2018 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmailPrivacyAuthConfig = exports.PasswordPolicyAuthConfig = exports.MobileLinksAuthConfig = exports.RecaptchaAuthConfig = exports.SmsRegionsAuthConfig = exports.OIDCConfig = exports.SAMLConfig = exports.EmailSignInConfig = exports.MultiFactorAuthConfig = exports.MAXIMUM_TEST_PHONE_NUMBERS = void 0;
	exports.validateTestPhoneNumbers = validateTestPhoneNumbers;
	const validator = validator$b;
	const deep_copy_1 = deepCopy$1;
	const error_1 = error;
	/** A maximum of 10 test phone number / code pairs can be configured. */
	exports.MAXIMUM_TEST_PHONE_NUMBERS = 10;
	/** Client Auth factor type to server auth factor type mapping. */
	const AUTH_FACTOR_CLIENT_TO_SERVER_TYPE = {
	    phone: 'PHONE_SMS',
	};
	/** Server Auth factor type to client auth factor type mapping. */
	const AUTH_FACTOR_SERVER_TO_CLIENT_TYPE = Object.keys(AUTH_FACTOR_CLIENT_TO_SERVER_TYPE)
	    .reduce((res, key) => {
	    res[AUTH_FACTOR_CLIENT_TO_SERVER_TYPE[key]] = key;
	    return res;
	}, {});
	/**
	 * Defines the multi-factor config class used to convert client side MultiFactorConfig
	 * to a format that is understood by the Auth server.
	 *
	 * @internal
	 */
	class MultiFactorAuthConfig {
	    /**
	     * Static method to convert a client side request to a MultiFactorAuthServerConfig.
	     * Throws an error if validation fails.
	     *
	     * @param options - The options object to convert to a server request.
	     * @returns The resulting server request.
	     * @internal
	     */
	    static buildServerRequest(options) {
	        const request = {};
	        MultiFactorAuthConfig.validate(options);
	        if (Object.prototype.hasOwnProperty.call(options, 'state')) {
	            request.state = options.state;
	        }
	        if (Object.prototype.hasOwnProperty.call(options, 'factorIds')) {
	            (options.factorIds || []).forEach((factorId) => {
	                if (typeof request.enabledProviders === 'undefined') {
	                    request.enabledProviders = [];
	                }
	                request.enabledProviders.push(AUTH_FACTOR_CLIENT_TO_SERVER_TYPE[factorId]);
	            });
	            // In case an empty array is passed. Ensure it gets populated so the array is cleared.
	            if (options.factorIds && options.factorIds.length === 0) {
	                request.enabledProviders = [];
	            }
	        }
	        if (Object.prototype.hasOwnProperty.call(options, 'providerConfigs')) {
	            request.providerConfigs = options.providerConfigs;
	        }
	        return request;
	    }
	    /**
	     * Validates the MultiFactorConfig options object. Throws an error on failure.
	     *
	     * @param options - The options object to validate.
	     */
	    static validate(options) {
	        const validKeys = {
	            state: true,
	            factorIds: true,
	            providerConfigs: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MultiFactorConfig" must be a non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid MultiFactorConfig parameter.`);
	            }
	        }
	        // Validate content.
	        if (typeof options.state !== 'undefined' &&
	            options.state !== 'ENABLED' &&
	            options.state !== 'DISABLED') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MultiFactorConfig.state" must be either "ENABLED" or "DISABLED".');
	        }
	        if (typeof options.factorIds !== 'undefined') {
	            if (!validator.isArray(options.factorIds)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MultiFactorConfig.factorIds" must be an array of valid "AuthFactorTypes".');
	            }
	            // Validate content of array.
	            options.factorIds.forEach((factorId) => {
	                if (typeof AUTH_FACTOR_CLIENT_TO_SERVER_TYPE[factorId] === 'undefined') {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${factorId}" is not a valid "AuthFactorType".`);
	                }
	            });
	        }
	        if (typeof options.providerConfigs !== 'undefined') {
	            if (!validator.isArray(options.providerConfigs)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MultiFactorConfig.providerConfigs" must be an array of valid "MultiFactorProviderConfig."');
	            }
	            //Validate content of array.
	            options.providerConfigs.forEach((multiFactorProviderConfig) => {
	                if (typeof multiFactorProviderConfig === 'undefined' || !validator.isObject(multiFactorProviderConfig)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${multiFactorProviderConfig}" is not a valid "MultiFactorProviderConfig" type.`);
	                }
	                const validProviderConfigKeys = {
	                    state: true,
	                    totpProviderConfig: true,
	                };
	                for (const key in multiFactorProviderConfig) {
	                    if (!(key in validProviderConfigKeys)) {
	                        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid ProviderConfig parameter.`);
	                    }
	                }
	                if (typeof multiFactorProviderConfig.state === 'undefined' ||
	                    (multiFactorProviderConfig.state !== 'ENABLED' &&
	                        multiFactorProviderConfig.state !== 'DISABLED')) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MultiFactorConfig.providerConfigs.state" must be either "ENABLED" or "DISABLED".');
	                }
	                // Since TOTP is the only provider config available right now, not defining it will lead into an error
	                if (typeof multiFactorProviderConfig.totpProviderConfig === 'undefined') {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MultiFactorConfig.providerConfigs.totpProviderConfig" must be defined.');
	                }
	                const validTotpProviderConfigKeys = {
	                    adjacentIntervals: true,
	                };
	                for (const key in multiFactorProviderConfig.totpProviderConfig) {
	                    if (!(key in validTotpProviderConfigKeys)) {
	                        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid TotpProviderConfig parameter.`);
	                    }
	                }
	                const adjIntervals = multiFactorProviderConfig.totpProviderConfig.adjacentIntervals;
	                if (typeof adjIntervals !== 'undefined' &&
	                    (!Number.isInteger(adjIntervals) || adjIntervals < 0 || adjIntervals > 10)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"MultiFactorConfig.providerConfigs.totpProviderConfig.adjacentIntervals" must' +
	                        ' be a valid number between 0 and 10 (both inclusive).');
	                }
	            });
	        }
	    }
	    /**
	     * The MultiFactorAuthConfig constructor.
	     *
	     * @param response - The server side response used to initialize the
	     *     MultiFactorAuthConfig object.
	     * @constructor
	     * @internal
	     */
	    constructor(response) {
	        if (typeof response.state === 'undefined') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid multi-factor configuration response');
	        }
	        this.state = response.state;
	        this.factorIds = [];
	        (response.enabledProviders || []).forEach((enabledProvider) => {
	            // Ignore unsupported types. It is possible the current admin SDK version is
	            // not up to date and newer backend types are supported.
	            if (typeof AUTH_FACTOR_SERVER_TO_CLIENT_TYPE[enabledProvider] !== 'undefined') {
	                this.factorIds.push(AUTH_FACTOR_SERVER_TO_CLIENT_TYPE[enabledProvider]);
	            }
	        });
	        this.providerConfigs = [];
	        (response.providerConfigs || []).forEach((providerConfig) => {
	            if (typeof providerConfig !== 'undefined') {
	                if (typeof providerConfig.state === 'undefined' ||
	                    typeof providerConfig.totpProviderConfig === 'undefined' ||
	                    (typeof providerConfig.totpProviderConfig.adjacentIntervals !== 'undefined' &&
	                        typeof providerConfig.totpProviderConfig.adjacentIntervals !== 'number')) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid multi-factor configuration response');
	                }
	                this.providerConfigs.push(providerConfig);
	            }
	        });
	    }
	    /** Converts MultiFactorConfig to JSON object
	     * @returns The plain object representation of the multi-factor config instance. */
	    toJSON() {
	        return {
	            state: this.state,
	            factorIds: this.factorIds,
	            providerConfigs: this.providerConfigs,
	        };
	    }
	}
	exports.MultiFactorAuthConfig = MultiFactorAuthConfig;
	/**
	 * Validates the provided map of test phone number / code pairs.
	 * @param testPhoneNumbers - The phone number / code pairs to validate.
	 */
	function validateTestPhoneNumbers(testPhoneNumbers) {
	    if (!validator.isObject(testPhoneNumbers)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"testPhoneNumbers" must be a map of phone number / code pairs.');
	    }
	    if (Object.keys(testPhoneNumbers).length > exports.MAXIMUM_TEST_PHONE_NUMBERS) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.MAXIMUM_TEST_PHONE_NUMBER_EXCEEDED);
	    }
	    for (const phoneNumber in testPhoneNumbers) {
	        // Validate phone number.
	        if (!validator.isPhoneNumber(phoneNumber)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TESTING_PHONE_NUMBER, `"${phoneNumber}" is not a valid E.164 standard compliant phone number.`);
	        }
	        // Validate code.
	        if (!validator.isString(testPhoneNumbers[phoneNumber]) ||
	            !/^[\d]{6}$/.test(testPhoneNumbers[phoneNumber])) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TESTING_PHONE_NUMBER, `"${testPhoneNumbers[phoneNumber]}" is not a valid 6 digit code string.`);
	        }
	    }
	}
	/**
	 * Defines the email sign-in config class used to convert client side EmailSignInConfig
	 * to a format that is understood by the Auth server.
	 *
	 * @internal
	 */
	class EmailSignInConfig {
	    /**
	     * Static method to convert a client side request to a EmailSignInConfigServerRequest.
	     * Throws an error if validation fails.
	     *
	     * @param options - The options object to convert to a server request.
	     * @returns The resulting server request.
	     * @internal
	     */
	    static buildServerRequest(options) {
	        const request = {};
	        EmailSignInConfig.validate(options);
	        if (Object.prototype.hasOwnProperty.call(options, 'enabled')) {
	            request.allowPasswordSignup = options.enabled;
	        }
	        if (Object.prototype.hasOwnProperty.call(options, 'passwordRequired')) {
	            request.enableEmailLinkSignin = !options.passwordRequired;
	        }
	        return request;
	    }
	    /**
	     * Validates the EmailSignInConfig options object. Throws an error on failure.
	     *
	     * @param options - The options object to validate.
	     */
	    static validate(options) {
	        // TODO: Validate the request.
	        const validKeys = {
	            enabled: true,
	            passwordRequired: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"EmailSignInConfig" must be a non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, `"${key}" is not a valid EmailSignInConfig parameter.`);
	            }
	        }
	        // Validate content.
	        if (typeof options.enabled !== 'undefined' &&
	            !validator.isBoolean(options.enabled)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"EmailSignInConfig.enabled" must be a boolean.');
	        }
	        if (typeof options.passwordRequired !== 'undefined' &&
	            !validator.isBoolean(options.passwordRequired)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"EmailSignInConfig.passwordRequired" must be a boolean.');
	        }
	    }
	    /**
	     * The EmailSignInConfig constructor.
	     *
	     * @param response - The server side response used to initialize the
	     *     EmailSignInConfig object.
	     * @constructor
	     */
	    constructor(response) {
	        if (typeof response.allowPasswordSignup === 'undefined') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid email sign-in configuration response');
	        }
	        this.enabled = response.allowPasswordSignup;
	        this.passwordRequired = !response.enableEmailLinkSignin;
	    }
	    /** @returns The plain object representation of the email sign-in config. */
	    toJSON() {
	        return {
	            enabled: this.enabled,
	            passwordRequired: this.passwordRequired,
	        };
	    }
	}
	exports.EmailSignInConfig = EmailSignInConfig;
	/**
	 * Defines the SAMLConfig class used to convert a client side configuration to its
	 * server side representation.
	 *
	 * @internal
	 */
	class SAMLConfig {
	    /**
	     * Converts a client side request to a SAMLConfigServerRequest which is the format
	     * accepted by the backend server.
	     * Throws an error if validation fails. If the request is not a SAMLConfig request,
	     * returns null.
	     *
	     * @param options - The options object to convert to a server request.
	     * @param ignoreMissingFields - Whether to ignore missing fields.
	     * @returns The resulting server request or null if not valid.
	     */
	    static buildServerRequest(options, ignoreMissingFields = false) {
	        const makeRequest = validator.isNonNullObject(options) &&
	            (options.providerId || ignoreMissingFields);
	        if (!makeRequest) {
	            return null;
	        }
	        const request = {};
	        // Validate options.
	        SAMLConfig.validate(options, ignoreMissingFields);
	        request.enabled = options.enabled;
	        request.displayName = options.displayName;
	        // IdP config.
	        if (options.idpEntityId || options.ssoURL || options.x509Certificates) {
	            request.idpConfig = {
	                idpEntityId: options.idpEntityId,
	                ssoUrl: options.ssoURL,
	                signRequest: options.enableRequestSigning,
	                idpCertificates: typeof options.x509Certificates === 'undefined' ? undefined : [],
	            };
	            if (options.x509Certificates) {
	                for (const cert of (options.x509Certificates || [])) {
	                    request.idpConfig.idpCertificates.push({ x509Certificate: cert });
	                }
	            }
	        }
	        // RP config.
	        if (options.callbackURL || options.rpEntityId) {
	            request.spConfig = {
	                spEntityId: options.rpEntityId,
	                callbackUri: options.callbackURL,
	            };
	        }
	        return request;
	    }
	    /**
	     * Returns the provider ID corresponding to the resource name if available.
	     *
	     * @param resourceName - The server side resource name.
	     * @returns The provider ID corresponding to the resource, null otherwise.
	     */
	    static getProviderIdFromResourceName(resourceName) {
	        // name is of form projects/project1/inboundSamlConfigs/providerId1
	        const matchProviderRes = resourceName.match(/\/inboundSamlConfigs\/(saml\..*)$/);
	        if (!matchProviderRes || matchProviderRes.length < 2) {
	            return null;
	        }
	        return matchProviderRes[1];
	    }
	    /**
	     * @param providerId - The provider ID to check.
	     * @returns Whether the provider ID corresponds to a SAML provider.
	     */
	    static isProviderId(providerId) {
	        return validator.isNonEmptyString(providerId) && providerId.indexOf('saml.') === 0;
	    }
	    /**
	     * Validates the SAMLConfig options object. Throws an error on failure.
	     *
	     * @param options - The options object to validate.
	     * @param ignoreMissingFields - Whether to ignore missing fields.
	     */
	    static validate(options, ignoreMissingFields = false) {
	        const validKeys = {
	            enabled: true,
	            displayName: true,
	            providerId: true,
	            idpEntityId: true,
	            ssoURL: true,
	            x509Certificates: true,
	            rpEntityId: true,
	            callbackURL: true,
	            enableRequestSigning: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig" must be a valid non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid SAML config parameter.`);
	            }
	        }
	        // Required fields.
	        if (validator.isNonEmptyString(options.providerId)) {
	            if (options.providerId.indexOf('saml.') !== 0) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID, '"SAMLAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "saml.".');
	            }
	        }
	        else if (!ignoreMissingFields) {
	            // providerId is required and not provided correctly.
	            throw new error_1.FirebaseAuthError(!options.providerId ? error_1.AuthClientErrorCode.MISSING_PROVIDER_ID : error_1.AuthClientErrorCode.INVALID_PROVIDER_ID, '"SAMLAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "saml.".');
	        }
	        if (!(ignoreMissingFields && typeof options.idpEntityId === 'undefined') &&
	            !validator.isNonEmptyString(options.idpEntityId)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.idpEntityId" must be a valid non-empty string.');
	        }
	        if (!(ignoreMissingFields && typeof options.ssoURL === 'undefined') &&
	            !validator.isURL(options.ssoURL)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.ssoURL" must be a valid URL string.');
	        }
	        if (!(ignoreMissingFields && typeof options.rpEntityId === 'undefined') &&
	            !validator.isNonEmptyString(options.rpEntityId)) {
	            throw new error_1.FirebaseAuthError(!options.rpEntityId ? error_1.AuthClientErrorCode.MISSING_SAML_RELYING_PARTY_CONFIG :
	                error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.rpEntityId" must be a valid non-empty string.');
	        }
	        if (!(ignoreMissingFields && typeof options.callbackURL === 'undefined') &&
	            !validator.isURL(options.callbackURL)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.callbackURL" must be a valid URL string.');
	        }
	        if (!(ignoreMissingFields && typeof options.x509Certificates === 'undefined') &&
	            !validator.isArray(options.x509Certificates)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.x509Certificates" must be a valid array of X509 certificate strings.');
	        }
	        (options.x509Certificates || []).forEach((cert) => {
	            if (!validator.isNonEmptyString(cert)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.x509Certificates" must be a valid array of X509 certificate strings.');
	            }
	        });
	        if (typeof options.enableRequestSigning !== 'undefined' &&
	            !validator.isBoolean(options.enableRequestSigning)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.enableRequestSigning" must be a boolean.');
	        }
	        if (typeof options.enabled !== 'undefined' &&
	            !validator.isBoolean(options.enabled)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.enabled" must be a boolean.');
	        }
	        if (typeof options.displayName !== 'undefined' &&
	            !validator.isString(options.displayName)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SAMLAuthProviderConfig.displayName" must be a valid string.');
	        }
	    }
	    /**
	     * The SAMLConfig constructor.
	     *
	     * @param response - The server side response used to initialize the SAMLConfig object.
	     * @constructor
	     */
	    constructor(response) {
	        if (!response ||
	            !response.idpConfig ||
	            !response.idpConfig.idpEntityId ||
	            !response.idpConfig.ssoUrl ||
	            !response.spConfig ||
	            !response.spConfig.spEntityId ||
	            !response.name ||
	            !(validator.isString(response.name) &&
	                SAMLConfig.getProviderIdFromResourceName(response.name))) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid SAML configuration response');
	        }
	        const providerId = SAMLConfig.getProviderIdFromResourceName(response.name);
	        if (!providerId) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid SAML configuration response');
	        }
	        this.providerId = providerId;
	        // RP config.
	        this.rpEntityId = response.spConfig.spEntityId;
	        this.callbackURL = response.spConfig.callbackUri;
	        // IdP config.
	        this.idpEntityId = response.idpConfig.idpEntityId;
	        this.ssoURL = response.idpConfig.ssoUrl;
	        this.enableRequestSigning = !!response.idpConfig.signRequest;
	        const x509Certificates = [];
	        for (const cert of (response.idpConfig.idpCertificates || [])) {
	            if (cert.x509Certificate) {
	                x509Certificates.push(cert.x509Certificate);
	            }
	        }
	        this.x509Certificates = x509Certificates;
	        // When enabled is undefined, it takes its default value of false.
	        this.enabled = !!response.enabled;
	        this.displayName = response.displayName;
	    }
	    /** @returns The plain object representation of the SAMLConfig. */
	    toJSON() {
	        return {
	            enabled: this.enabled,
	            displayName: this.displayName,
	            providerId: this.providerId,
	            idpEntityId: this.idpEntityId,
	            ssoURL: this.ssoURL,
	            x509Certificates: (0, deep_copy_1.deepCopy)(this.x509Certificates),
	            rpEntityId: this.rpEntityId,
	            callbackURL: this.callbackURL,
	            enableRequestSigning: this.enableRequestSigning,
	        };
	    }
	}
	exports.SAMLConfig = SAMLConfig;
	/**
	 * Defines the OIDCConfig class used to convert a client side configuration to its
	 * server side representation.
	 *
	 * @internal
	 */
	class OIDCConfig {
	    /**
	     * Converts a client side request to a OIDCConfigServerRequest which is the format
	     * accepted by the backend server.
	     * Throws an error if validation fails. If the request is not a OIDCConfig request,
	     * returns null.
	     *
	     * @param options - The options object to convert to a server request.
	     * @param ignoreMissingFields - Whether to ignore missing fields.
	     * @returns The resulting server request or null if not valid.
	     */
	    static buildServerRequest(options, ignoreMissingFields = false) {
	        const makeRequest = validator.isNonNullObject(options) &&
	            (options.providerId || ignoreMissingFields);
	        if (!makeRequest) {
	            return null;
	        }
	        const request = {};
	        // Validate options.
	        OIDCConfig.validate(options, ignoreMissingFields);
	        request.enabled = options.enabled;
	        request.displayName = options.displayName;
	        request.issuer = options.issuer;
	        request.clientId = options.clientId;
	        if (typeof options.clientSecret !== 'undefined') {
	            request.clientSecret = options.clientSecret;
	        }
	        if (typeof options.responseType !== 'undefined') {
	            request.responseType = options.responseType;
	        }
	        return request;
	    }
	    /**
	     * Returns the provider ID corresponding to the resource name if available.
	     *
	     * @param resourceName - The server side resource name
	     * @returns The provider ID corresponding to the resource, null otherwise.
	     */
	    static getProviderIdFromResourceName(resourceName) {
	        // name is of form projects/project1/oauthIdpConfigs/providerId1
	        const matchProviderRes = resourceName.match(/\/oauthIdpConfigs\/(oidc\..*)$/);
	        if (!matchProviderRes || matchProviderRes.length < 2) {
	            return null;
	        }
	        return matchProviderRes[1];
	    }
	    /**
	     * @param providerId - The provider ID to check.
	     * @returns Whether the provider ID corresponds to an OIDC provider.
	     */
	    static isProviderId(providerId) {
	        return validator.isNonEmptyString(providerId) && providerId.indexOf('oidc.') === 0;
	    }
	    /**
	     * Validates the OIDCConfig options object. Throws an error on failure.
	     *
	     * @param options - The options object to validate.
	     * @param ignoreMissingFields - Whether to ignore missing fields.
	     */
	    static validate(options, ignoreMissingFields = false) {
	        const validKeys = {
	            enabled: true,
	            displayName: true,
	            providerId: true,
	            clientId: true,
	            issuer: true,
	            clientSecret: true,
	            responseType: true,
	        };
	        const validResponseTypes = {
	            idToken: true,
	            code: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"OIDCAuthProviderConfig" must be a valid non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid OIDC config parameter.`);
	            }
	        }
	        // Required fields.
	        if (validator.isNonEmptyString(options.providerId)) {
	            if (options.providerId.indexOf('oidc.') !== 0) {
	                throw new error_1.FirebaseAuthError(!options.providerId ? error_1.AuthClientErrorCode.MISSING_PROVIDER_ID : error_1.AuthClientErrorCode.INVALID_PROVIDER_ID, '"OIDCAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "oidc.".');
	            }
	        }
	        else if (!ignoreMissingFields) {
	            throw new error_1.FirebaseAuthError(!options.providerId ? error_1.AuthClientErrorCode.MISSING_PROVIDER_ID : error_1.AuthClientErrorCode.INVALID_PROVIDER_ID, '"OIDCAuthProviderConfig.providerId" must be a valid non-empty string prefixed with "oidc.".');
	        }
	        if (!(ignoreMissingFields && typeof options.clientId === 'undefined') &&
	            !validator.isNonEmptyString(options.clientId)) {
	            throw new error_1.FirebaseAuthError(!options.clientId ? error_1.AuthClientErrorCode.MISSING_OAUTH_CLIENT_ID : error_1.AuthClientErrorCode.INVALID_OAUTH_CLIENT_ID, '"OIDCAuthProviderConfig.clientId" must be a valid non-empty string.');
	        }
	        if (!(ignoreMissingFields && typeof options.issuer === 'undefined') &&
	            !validator.isURL(options.issuer)) {
	            throw new error_1.FirebaseAuthError(!options.issuer ? error_1.AuthClientErrorCode.MISSING_ISSUER : error_1.AuthClientErrorCode.INVALID_CONFIG, '"OIDCAuthProviderConfig.issuer" must be a valid URL string.');
	        }
	        if (typeof options.enabled !== 'undefined' &&
	            !validator.isBoolean(options.enabled)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"OIDCAuthProviderConfig.enabled" must be a boolean.');
	        }
	        if (typeof options.displayName !== 'undefined' &&
	            !validator.isString(options.displayName)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"OIDCAuthProviderConfig.displayName" must be a valid string.');
	        }
	        if (typeof options.clientSecret !== 'undefined' &&
	            !validator.isNonEmptyString(options.clientSecret)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"OIDCAuthProviderConfig.clientSecret" must be a valid string.');
	        }
	        if (validator.isNonNullObject(options.responseType) && typeof options.responseType !== 'undefined') {
	            Object.keys(options.responseType).forEach((key) => {
	                if (!(key in validResponseTypes)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid OAuthResponseType parameter.`);
	                }
	            });
	            const idToken = options.responseType.idToken;
	            if (typeof idToken !== 'undefined' && !validator.isBoolean(idToken)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"OIDCAuthProviderConfig.responseType.idToken" must be a boolean.');
	            }
	            const code = options.responseType.code;
	            if (typeof code !== 'undefined') {
	                if (!validator.isBoolean(code)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"OIDCAuthProviderConfig.responseType.code" must be a boolean.');
	                }
	                // If code flow is enabled, client secret must be provided.
	                if (code && typeof options.clientSecret === 'undefined') {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.MISSING_OAUTH_CLIENT_SECRET, 'The OAuth configuration client secret is required to enable OIDC code flow.');
	                }
	            }
	            const allKeys = Object.keys(options.responseType).length;
	            const enabledCount = Object.values(options.responseType).filter(Boolean).length;
	            // Only one of OAuth response types can be set to true.
	            if (allKeys > 1 && enabledCount !== 1) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_OAUTH_RESPONSETYPE, 'Only exactly one OAuth responseType should be set to true.');
	            }
	        }
	    }
	    /**
	     * The OIDCConfig constructor.
	     *
	     * @param response - The server side response used to initialize the OIDCConfig object.
	     * @constructor
	     */
	    constructor(response) {
	        if (!response ||
	            !response.issuer ||
	            !response.clientId ||
	            !response.name ||
	            !(validator.isString(response.name) &&
	                OIDCConfig.getProviderIdFromResourceName(response.name))) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid OIDC configuration response');
	        }
	        const providerId = OIDCConfig.getProviderIdFromResourceName(response.name);
	        if (!providerId) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid SAML configuration response');
	        }
	        this.providerId = providerId;
	        this.clientId = response.clientId;
	        this.issuer = response.issuer;
	        // When enabled is undefined, it takes its default value of false.
	        this.enabled = !!response.enabled;
	        this.displayName = response.displayName;
	        if (typeof response.clientSecret !== 'undefined') {
	            this.clientSecret = response.clientSecret;
	        }
	        if (typeof response.responseType !== 'undefined') {
	            this.responseType = response.responseType;
	        }
	    }
	    /** @returns The plain object representation of the OIDCConfig. */
	    toJSON() {
	        return {
	            enabled: this.enabled,
	            displayName: this.displayName,
	            providerId: this.providerId,
	            issuer: this.issuer,
	            clientId: this.clientId,
	            clientSecret: (0, deep_copy_1.deepCopy)(this.clientSecret),
	            responseType: (0, deep_copy_1.deepCopy)(this.responseType),
	        };
	    }
	}
	exports.OIDCConfig = OIDCConfig;
	/**
	 * Defines the SMSRegionConfig class used for validation.
	 *
	 * @internal
	 */
	class SmsRegionsAuthConfig {
	    static validate(options) {
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SmsRegionConfig" must be a non-null object.');
	        }
	        const validKeys = {
	            allowlistOnly: true,
	            allowByDefault: true,
	        };
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid SmsRegionConfig parameter.`);
	            }
	        }
	        // validate mutual exclusiveness of allowByDefault and allowlistOnly
	        if (typeof options.allowByDefault !== 'undefined' && typeof options.allowlistOnly !== 'undefined') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, 'SmsRegionConfig cannot have both "allowByDefault" and "allowlistOnly" parameters.');
	        }
	        // validation for allowByDefault type
	        if (typeof options.allowByDefault !== 'undefined') {
	            const allowByDefaultValidKeys = {
	                disallowedRegions: true,
	            };
	            for (const key in options.allowByDefault) {
	                if (!(key in allowByDefaultValidKeys)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid SmsRegionConfig.allowByDefault parameter.`);
	                }
	            }
	            // disallowedRegion can be empty.
	            if (typeof options.allowByDefault.disallowedRegions !== 'undefined'
	                && !validator.isArray(options.allowByDefault.disallowedRegions)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SmsRegionConfig.allowByDefault.disallowedRegions" must be a valid string array.');
	            }
	        }
	        if (typeof options.allowlistOnly !== 'undefined') {
	            const allowListOnlyValidKeys = {
	                allowedRegions: true,
	            };
	            for (const key in options.allowlistOnly) {
	                if (!(key in allowListOnlyValidKeys)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid SmsRegionConfig.allowlistOnly parameter.`);
	                }
	            }
	            // allowedRegions can be empty
	            if (typeof options.allowlistOnly.allowedRegions !== 'undefined'
	                && !validator.isArray(options.allowlistOnly.allowedRegions)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"SmsRegionConfig.allowlistOnly.allowedRegions" must be a valid string array.');
	            }
	        }
	    }
	}
	exports.SmsRegionsAuthConfig = SmsRegionsAuthConfig;
	/**
	 * Defines the recaptcha config class used to convert client side RecaptchaConfig
	 * to a format that is understood by the Auth server.
	 *
	 * @internal
	 */
	class RecaptchaAuthConfig {
	    /**
	     * The RecaptchaAuthConfig constructor.
	     *
	     * @param response - The server side response used to initialize the
	     *     RecaptchaAuthConfig object.
	     * @constructor
	     * @internal
	     */
	    constructor(response) {
	        const filteredResponse = Object.fromEntries(Object.entries(response).filter(([, value]) => value !== undefined));
	        // Explicitly map the 'tollFraudManagedRules' to 'smsTollFraudManagedRules'
	        if (filteredResponse.tollFraudManagedRules !== undefined) {
	            this.smsTollFraudManagedRules = filteredResponse.tollFraudManagedRules;
	            delete filteredResponse.tollFraudManagedRules; // Remove it if necessary
	        }
	        // Assign the remaining properties directly
	        Object.assign(this, filteredResponse);
	    }
	    /**
	     * Builds a server request object from the client-side RecaptchaConfig.
	     * Converts client-side fields to their server-side equivalents.
	     *
	     * @param options - The client-side RecaptchaConfig object.
	     * @returns The server-side RecaptchaAuthServerConfig object.
	     */
	    static buildServerRequest(options) {
	        RecaptchaAuthConfig.validate(options); // Validate options before building request
	        const request = {};
	        if (typeof options.emailPasswordEnforcementState !== 'undefined') {
	            request.emailPasswordEnforcementState = options.emailPasswordEnforcementState;
	        }
	        if (typeof options.phoneEnforcementState !== 'undefined') {
	            request.phoneEnforcementState = options.phoneEnforcementState;
	        }
	        if (typeof options.managedRules !== 'undefined') {
	            request.managedRules = options.managedRules;
	        }
	        if (typeof options.recaptchaKeys !== 'undefined') {
	            request.recaptchaKeys = options.recaptchaKeys;
	        }
	        if (typeof options.useAccountDefender !== 'undefined') {
	            request.useAccountDefender = options.useAccountDefender;
	        }
	        if (typeof options.useSmsBotScore !== 'undefined') {
	            request.useSmsBotScore = options.useSmsBotScore;
	        }
	        if (typeof options.useSmsTollFraudProtection !== 'undefined') {
	            request.useSmsTollFraudProtection = options.useSmsTollFraudProtection;
	        }
	        if (typeof options.smsTollFraudManagedRules !== 'undefined') {
	            request.tollFraudManagedRules = options.smsTollFraudManagedRules; // Map client-side field to server-side
	        }
	        return request;
	    }
	    /**
	     * Validates the RecaptchaConfig options object. Throws an error on failure.
	     * @param options - The options object to validate.
	     */
	    static validate(options) {
	        const validKeys = {
	            emailPasswordEnforcementState: true,
	            phoneEnforcementState: true,
	            managedRules: true,
	            recaptchaKeys: true,
	            useAccountDefender: true,
	            useSmsBotScore: true,
	            useSmsTollFraudProtection: true,
	            smsTollFraudManagedRules: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig" must be a non-null object.');
	        }
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid RecaptchaConfig parameter.`);
	            }
	        }
	        // Validation
	        if (typeof options.emailPasswordEnforcementState !== 'undefined') {
	            if (!validator.isNonEmptyString(options.emailPasswordEnforcementState)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"RecaptchaConfig.emailPasswordEnforcementState" must be a valid non-empty string.');
	            }
	            if (options.emailPasswordEnforcementState !== 'OFF' &&
	                options.emailPasswordEnforcementState !== 'AUDIT' &&
	                options.emailPasswordEnforcementState !== 'ENFORCE') {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.emailPasswordEnforcementState" must be either "OFF", "AUDIT" or "ENFORCE".');
	            }
	        }
	        if (typeof options.phoneEnforcementState !== 'undefined') {
	            if (!validator.isNonEmptyString(options.phoneEnforcementState)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"RecaptchaConfig.phoneEnforcementState" must be a valid non-empty string.');
	            }
	            if (options.phoneEnforcementState !== 'OFF' &&
	                options.phoneEnforcementState !== 'AUDIT' &&
	                options.phoneEnforcementState !== 'ENFORCE') {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.phoneEnforcementState" must be either "OFF", "AUDIT" or "ENFORCE".');
	            }
	        }
	        if (typeof options.managedRules !== 'undefined') {
	            // Validate array
	            if (!validator.isArray(options.managedRules)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.managedRules" must be an array of valid "RecaptchaManagedRule".');
	            }
	            // Validate each rule of the array
	            options.managedRules.forEach((managedRule) => {
	                RecaptchaAuthConfig.validateManagedRule(managedRule);
	            });
	        }
	        if (typeof options.useAccountDefender !== 'undefined') {
	            if (!validator.isBoolean(options.useAccountDefender)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.useAccountDefender" must be a boolean value".');
	            }
	        }
	        if (typeof options.useSmsBotScore !== 'undefined') {
	            if (!validator.isBoolean(options.useSmsBotScore)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.useSmsBotScore" must be a boolean value".');
	            }
	        }
	        if (typeof options.useSmsTollFraudProtection !== 'undefined') {
	            if (!validator.isBoolean(options.useSmsTollFraudProtection)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.useSmsTollFraudProtection" must be a boolean value".');
	            }
	        }
	        if (typeof options.smsTollFraudManagedRules !== 'undefined') {
	            // Validate array
	            if (!validator.isArray(options.smsTollFraudManagedRules)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaConfig.smsTollFraudManagedRules" must be an array of valid "RecaptchaTollFraudManagedRule".');
	            }
	            // Validate each rule of the array
	            options.smsTollFraudManagedRules.forEach((tollFraudManagedRule) => {
	                RecaptchaAuthConfig.validateTollFraudManagedRule(tollFraudManagedRule);
	            });
	        }
	    }
	    /**
	     * Validate each element in ManagedRule array
	     * @param options - The options object to validate.
	     */
	    static validateManagedRule(options) {
	        const validKeys = {
	            endScore: true,
	            action: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaManagedRule" must be a non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid RecaptchaManagedRule parameter.`);
	            }
	        }
	        // Validate content.
	        if (typeof options.action !== 'undefined' &&
	            options.action !== 'BLOCK') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaManagedRule.action" must be "BLOCK".');
	        }
	    }
	    /**
	     * Validate each element in TollFraudManagedRule array
	     * @param options - The options object to validate.
	     */
	    static validateTollFraudManagedRule(options) {
	        const validKeys = {
	            startScore: true,
	            action: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaTollFraudManagedRule" must be a non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid RecaptchaTollFraudManagedRule parameter.`);
	            }
	        }
	        // Validate content.
	        if (typeof options.action !== 'undefined' &&
	            options.action !== 'BLOCK') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"RecaptchaTollFraudManagedRule.action" must be "BLOCK".');
	        }
	    }
	}
	exports.RecaptchaAuthConfig = RecaptchaAuthConfig;
	/**
	 * Defines the MobileLinksAuthConfig class used for validation.
	 *
	 * @internal
	 */
	class MobileLinksAuthConfig {
	    static validate(options) {
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MobileLinksConfig" must be a non-null object.');
	        }
	        const validKeys = {
	            domain: true,
	        };
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid "MobileLinksConfig" parameter.`);
	            }
	        }
	        if (typeof options.domain !== 'undefined'
	            && options.domain !== 'HOSTING_DOMAIN'
	            && options.domain !== 'FIREBASE_DYNAMIC_LINK_DOMAIN') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"MobileLinksConfig.domain" must be either "HOSTING_DOMAIN" or "FIREBASE_DYNAMIC_LINK_DOMAIN".');
	        }
	    }
	}
	exports.MobileLinksAuthConfig = MobileLinksAuthConfig;
	/**
	 * Defines the password policy config class used to convert client side PasswordPolicyConfig
	 * to a format that is understood by the Auth server.
	 *
	 * @internal
	 */
	class PasswordPolicyAuthConfig {
	    /**
	     * Static method to convert a client side request to a PasswordPolicyAuthServerConfig.
	     * Throws an error if validation fails.
	     *
	     * @param options - The options object to convert to a server request.
	     * @returns The resulting server request.
	     * @internal
	     */
	    static buildServerRequest(options) {
	        const request = {};
	        PasswordPolicyAuthConfig.validate(options);
	        if (Object.prototype.hasOwnProperty.call(options, 'enforcementState')) {
	            request.passwordPolicyEnforcementState = options.enforcementState;
	        }
	        request.forceUpgradeOnSignin = false;
	        if (Object.prototype.hasOwnProperty.call(options, 'forceUpgradeOnSignin')) {
	            request.forceUpgradeOnSignin = options.forceUpgradeOnSignin;
	        }
	        const constraintsRequest = {
	            containsUppercaseCharacter: false,
	            containsLowercaseCharacter: false,
	            containsNonAlphanumericCharacter: false,
	            containsNumericCharacter: false,
	            minPasswordLength: 6,
	            maxPasswordLength: 4096,
	        };
	        request.passwordPolicyVersions = [];
	        if (Object.prototype.hasOwnProperty.call(options, 'constraints')) {
	            if (options) {
	                if (options.constraints?.requireUppercase !== undefined) {
	                    constraintsRequest.containsUppercaseCharacter = options.constraints.requireUppercase;
	                }
	                if (options.constraints?.requireLowercase !== undefined) {
	                    constraintsRequest.containsLowercaseCharacter = options.constraints.requireLowercase;
	                }
	                if (options.constraints?.requireNonAlphanumeric !== undefined) {
	                    constraintsRequest.containsNonAlphanumericCharacter = options.constraints.requireNonAlphanumeric;
	                }
	                if (options.constraints?.requireNumeric !== undefined) {
	                    constraintsRequest.containsNumericCharacter = options.constraints.requireNumeric;
	                }
	                if (options.constraints?.minLength !== undefined) {
	                    constraintsRequest.minPasswordLength = options.constraints.minLength;
	                }
	                if (options.constraints?.maxLength !== undefined) {
	                    constraintsRequest.maxPasswordLength = options.constraints.maxLength;
	                }
	            }
	        }
	        request.passwordPolicyVersions.push({ customStrengthOptions: constraintsRequest });
	        return request;
	    }
	    /**
	     * Validates the PasswordPolicyConfig options object. Throws an error on failure.
	     *
	     * @param options - The options object to validate.
	     * @internal
	     */
	    static validate(options) {
	        const validKeys = {
	            enforcementState: true,
	            forceUpgradeOnSignin: true,
	            constraints: true,
	        };
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig" must be a non-null object.');
	        }
	        // Check for unsupported top level attributes.
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid PasswordPolicyConfig parameter.`);
	            }
	        }
	        // Validate content.
	        if (typeof options.enforcementState === 'undefined' ||
	            !(options.enforcementState === 'ENFORCE' ||
	                options.enforcementState === 'OFF')) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.enforcementState" must be either "ENFORCE" or "OFF".');
	        }
	        if (typeof options.forceUpgradeOnSignin !== 'undefined') {
	            if (!validator.isBoolean(options.forceUpgradeOnSignin)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.forceUpgradeOnSignin" must be a boolean.');
	            }
	        }
	        if (typeof options.constraints !== 'undefined') {
	            if (options.enforcementState === 'ENFORCE' && !validator.isNonNullObject(options.constraints)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints" must be a non-empty object.');
	            }
	            const validCharKeys = {
	                requireUppercase: true,
	                requireLowercase: true,
	                requireNumeric: true,
	                requireNonAlphanumeric: true,
	                minLength: true,
	                maxLength: true,
	            };
	            // Check for unsupported  attributes.
	            for (const key in options.constraints) {
	                if (!(key in validCharKeys)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid PasswordPolicyConfig.constraints parameter.`);
	                }
	            }
	            if (typeof options.constraints.requireUppercase !== 'undefined' &&
	                !validator.isBoolean(options.constraints.requireUppercase)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.requireUppercase" must be a boolean.');
	            }
	            if (typeof options.constraints.requireLowercase !== 'undefined' &&
	                !validator.isBoolean(options.constraints.requireLowercase)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.requireLowercase" must be a boolean.');
	            }
	            if (typeof options.constraints.requireNonAlphanumeric !== 'undefined' &&
	                !validator.isBoolean(options.constraints.requireNonAlphanumeric)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.requireNonAlphanumeric"' +
	                    ' must be a boolean.');
	            }
	            if (typeof options.constraints.requireNumeric !== 'undefined' &&
	                !validator.isBoolean(options.constraints.requireNumeric)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.requireNumeric" must be a boolean.');
	            }
	            if (typeof options.constraints.minLength === 'undefined') {
	                options.constraints.minLength = 6;
	            }
	            else if (!validator.isNumber(options.constraints.minLength)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.minLength" must be a number.');
	            }
	            else {
	                if (!(options.constraints.minLength >= 6
	                    && options.constraints.minLength <= 30)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.minLength"' +
	                        ' must be an integer between 6 and 30, inclusive.');
	                }
	            }
	            if (typeof options.constraints.maxLength === 'undefined') {
	                options.constraints.maxLength = 4096;
	            }
	            else if (!validator.isNumber(options.constraints.maxLength)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.maxLength" must be a number.');
	            }
	            else {
	                if (!(options.constraints.maxLength >= options.constraints.minLength &&
	                    options.constraints.maxLength <= 4096)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints.maxLength"' +
	                        ' must be greater than or equal to minLength and at max 4096.');
	                }
	            }
	        }
	        else {
	            if (options.enforcementState === 'ENFORCE') {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"PasswordPolicyConfig.constraints" must be defined.');
	            }
	        }
	    }
	    /**
	     * The PasswordPolicyAuthConfig constructor.
	     *
	     * @param response - The server side response used to initialize the
	     *     PasswordPolicyAuthConfig object.
	     * @constructor
	     * @internal
	     */
	    constructor(response) {
	        if (typeof response.passwordPolicyEnforcementState === 'undefined') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid password policy configuration response');
	        }
	        this.enforcementState = response.passwordPolicyEnforcementState;
	        let constraintsResponse = {};
	        if (typeof response.passwordPolicyVersions !== 'undefined') {
	            (response.passwordPolicyVersions || []).forEach((policyVersion) => {
	                constraintsResponse = {
	                    requireLowercase: policyVersion.customStrengthOptions?.containsLowercaseCharacter,
	                    requireUppercase: policyVersion.customStrengthOptions?.containsUppercaseCharacter,
	                    requireNonAlphanumeric: policyVersion.customStrengthOptions?.containsNonAlphanumericCharacter,
	                    requireNumeric: policyVersion.customStrengthOptions?.containsNumericCharacter,
	                    minLength: policyVersion.customStrengthOptions?.minPasswordLength,
	                    maxLength: policyVersion.customStrengthOptions?.maxPasswordLength,
	                };
	            });
	        }
	        this.constraints = constraintsResponse;
	        this.forceUpgradeOnSignin = response.forceUpgradeOnSignin ? true : false;
	    }
	}
	exports.PasswordPolicyAuthConfig = PasswordPolicyAuthConfig;
	/**
	 * Defines the EmailPrivacyAuthConfig class used for validation.
	 *
	 * @internal
	 */
	class EmailPrivacyAuthConfig {
	    static validate(options) {
	        if (!validator.isNonNullObject(options)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"EmailPrivacyConfig" must be a non-null object.');
	        }
	        const validKeys = {
	            enableImprovedEmailPrivacy: true,
	        };
	        for (const key in options) {
	            if (!(key in validKeys)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, `"${key}" is not a valid "EmailPrivacyConfig" parameter.`);
	            }
	        }
	        if (typeof options.enableImprovedEmailPrivacy !== 'undefined'
	            && !validator.isBoolean(options.enableImprovedEmailPrivacy)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CONFIG, '"EmailPrivacyConfig.enableImprovedEmailPrivacy" must be a valid boolean value.');
	        }
	    }
	}
	exports.EmailPrivacyAuthConfig = EmailPrivacyAuthConfig; 
} (authConfig));

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(tenant, "__esModule", { value: true });
tenant.Tenant = void 0;
const validator$5 = validator$b;
const deep_copy_1$3 = deepCopy$1;
const error_1$5 = error;
const auth_config_1$2 = authConfig;
/**
 * Represents a tenant configuration.
 *
 * Multi-tenancy support requires Google Cloud's Identity Platform
 * (GCIP). To learn more about GCIP, including pricing and features,
 * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
 *
 * Before multi-tenancy can be used on a Google Cloud Identity Platform project,
 * tenants must be allowed on that project via the Cloud Console UI.
 *
 * A tenant configuration provides information such as the display name, tenant
 * identifier and email authentication configuration.
 * For OIDC/SAML provider configuration management, `TenantAwareAuth` instances should
 * be used instead of a `Tenant` to retrieve the list of configured IdPs on a tenant.
 * When configuring these providers, note that tenants will inherit
 * whitelisted domains and authenticated redirect URIs of their parent project.
 *
 * All other settings of a tenant will also be inherited. These will need to be managed
 * from the Cloud Console UI.
 */
class Tenant {
    /**
     * Builds the corresponding server request for a TenantOptions object.
     *
     * @param tenantOptions - The properties to convert to a server request.
     * @param createRequest - Whether this is a create request.
     * @returns The equivalent server request.
     *
     * @internal
     */
    static buildServerRequest(tenantOptions, createRequest) {
        Tenant.validate(tenantOptions, createRequest);
        let request = {};
        if (typeof tenantOptions.emailSignInConfig !== 'undefined') {
            request = auth_config_1$2.EmailSignInConfig.buildServerRequest(tenantOptions.emailSignInConfig);
        }
        if (typeof tenantOptions.displayName !== 'undefined') {
            request.displayName = tenantOptions.displayName;
        }
        if (typeof tenantOptions.anonymousSignInEnabled !== 'undefined') {
            request.enableAnonymousUser = tenantOptions.anonymousSignInEnabled;
        }
        if (typeof tenantOptions.multiFactorConfig !== 'undefined') {
            request.mfaConfig = auth_config_1$2.MultiFactorAuthConfig.buildServerRequest(tenantOptions.multiFactorConfig);
        }
        if (typeof tenantOptions.testPhoneNumbers !== 'undefined') {
            // null will clear existing test phone numbers. Translate to empty object.
            request.testPhoneNumbers = tenantOptions.testPhoneNumbers ?? {};
        }
        if (typeof tenantOptions.smsRegionConfig !== 'undefined') {
            request.smsRegionConfig = tenantOptions.smsRegionConfig;
        }
        if (typeof tenantOptions.recaptchaConfig !== 'undefined') {
            request.recaptchaConfig = auth_config_1$2.RecaptchaAuthConfig.buildServerRequest(tenantOptions.recaptchaConfig);
        }
        if (typeof tenantOptions.passwordPolicyConfig !== 'undefined') {
            request.passwordPolicyConfig = auth_config_1$2.PasswordPolicyAuthConfig.buildServerRequest(tenantOptions.passwordPolicyConfig);
        }
        if (typeof tenantOptions.emailPrivacyConfig !== 'undefined') {
            request.emailPrivacyConfig = tenantOptions.emailPrivacyConfig;
        }
        return request;
    }
    /**
     * Returns the tenant ID corresponding to the resource name if available.
     *
     * @param resourceName - The server side resource name
     * @returns The tenant ID corresponding to the resource, null otherwise.
     *
     * @internal
     */
    static getTenantIdFromResourceName(resourceName) {
        // name is of form projects/project1/tenants/tenant1
        const matchTenantRes = resourceName.match(/\/tenants\/(.*)$/);
        if (!matchTenantRes || matchTenantRes.length < 2) {
            return null;
        }
        return matchTenantRes[1];
    }
    /**
     * Validates a tenant options object. Throws an error on failure.
     *
     * @param request - The tenant options object to validate.
     * @param createRequest - Whether this is a create request.
     */
    static validate(request, createRequest) {
        const validKeys = {
            displayName: true,
            emailSignInConfig: true,
            anonymousSignInEnabled: true,
            multiFactorConfig: true,
            testPhoneNumbers: true,
            smsRegionConfig: true,
            recaptchaConfig: true,
            passwordPolicyConfig: true,
            emailPrivacyConfig: true,
        };
        const label = createRequest ? 'CreateTenantRequest' : 'UpdateTenantRequest';
        if (!validator$5.isNonNullObject(request)) {
            throw new error_1$5.FirebaseAuthError(error_1$5.AuthClientErrorCode.INVALID_ARGUMENT, `"${label}" must be a valid non-null object.`);
        }
        // Check for unsupported top level attributes.
        for (const key in request) {
            if (!(key in validKeys)) {
                throw new error_1$5.FirebaseAuthError(error_1$5.AuthClientErrorCode.INVALID_ARGUMENT, `"${key}" is not a valid ${label} parameter.`);
            }
        }
        // Validate displayName type if provided.
        if (typeof request.displayName !== 'undefined' &&
            !validator$5.isNonEmptyString(request.displayName)) {
            throw new error_1$5.FirebaseAuthError(error_1$5.AuthClientErrorCode.INVALID_ARGUMENT, `"${label}.displayName" must be a valid non-empty string.`);
        }
        // Validate emailSignInConfig type if provided.
        if (typeof request.emailSignInConfig !== 'undefined') {
            // This will throw an error if invalid.
            auth_config_1$2.EmailSignInConfig.buildServerRequest(request.emailSignInConfig);
        }
        // Validate test phone numbers if provided.
        if (typeof request.testPhoneNumbers !== 'undefined' &&
            request.testPhoneNumbers !== null) {
            (0, auth_config_1$2.validateTestPhoneNumbers)(request.testPhoneNumbers);
        }
        else if (request.testPhoneNumbers === null && createRequest) {
            // null allowed only for update operations.
            throw new error_1$5.FirebaseAuthError(error_1$5.AuthClientErrorCode.INVALID_ARGUMENT, `"${label}.testPhoneNumbers" must be a non-null object.`);
        }
        // Validate multiFactorConfig type if provided.
        if (typeof request.multiFactorConfig !== 'undefined') {
            // This will throw an error if invalid.
            auth_config_1$2.MultiFactorAuthConfig.buildServerRequest(request.multiFactorConfig);
        }
        // Validate SMS Regions Config if provided.
        if (typeof request.smsRegionConfig !== 'undefined') {
            auth_config_1$2.SmsRegionsAuthConfig.validate(request.smsRegionConfig);
        }
        // Validate reCAPTCHAConfig type if provided.
        if (typeof request.recaptchaConfig !== 'undefined') {
            auth_config_1$2.RecaptchaAuthConfig.buildServerRequest(request.recaptchaConfig);
        }
        // Validate passwordPolicyConfig type if provided.
        if (typeof request.passwordPolicyConfig !== 'undefined') {
            // This will throw an error if invalid.
            auth_config_1$2.PasswordPolicyAuthConfig.buildServerRequest(request.passwordPolicyConfig);
        }
        // Validate Email Privacy Config if provided.
        if (typeof request.emailPrivacyConfig !== 'undefined') {
            auth_config_1$2.EmailPrivacyAuthConfig.validate(request.emailPrivacyConfig);
        }
    }
    /**
     * The Tenant object constructor.
     *
     * @param response - The server side response used to initialize the Tenant object.
     * @constructor
     * @internal
     */
    constructor(response) {
        const tenantId = Tenant.getTenantIdFromResourceName(response.name);
        if (!tenantId) {
            throw new error_1$5.FirebaseAuthError(error_1$5.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid tenant response');
        }
        this.tenantId = tenantId;
        this.displayName = response.displayName;
        try {
            this.emailSignInConfig_ = new auth_config_1$2.EmailSignInConfig(response);
        }
        catch (e) {
            // If allowPasswordSignup is undefined, it is disabled by default.
            this.emailSignInConfig_ = new auth_config_1$2.EmailSignInConfig({
                allowPasswordSignup: false,
            });
        }
        this.anonymousSignInEnabled = !!response.enableAnonymousUser;
        if (typeof response.mfaConfig !== 'undefined') {
            this.multiFactorConfig_ = new auth_config_1$2.MultiFactorAuthConfig(response.mfaConfig);
        }
        if (typeof response.testPhoneNumbers !== 'undefined') {
            this.testPhoneNumbers = (0, deep_copy_1$3.deepCopy)(response.testPhoneNumbers || {});
        }
        if (typeof response.smsRegionConfig !== 'undefined') {
            this.smsRegionConfig = (0, deep_copy_1$3.deepCopy)(response.smsRegionConfig);
        }
        if (typeof response.recaptchaConfig !== 'undefined') {
            this.recaptchaConfig_ = new auth_config_1$2.RecaptchaAuthConfig(response.recaptchaConfig);
        }
        if (typeof response.passwordPolicyConfig !== 'undefined') {
            this.passwordPolicyConfig = new auth_config_1$2.PasswordPolicyAuthConfig(response.passwordPolicyConfig);
        }
        if (typeof response.emailPrivacyConfig !== 'undefined') {
            this.emailPrivacyConfig = (0, deep_copy_1$3.deepCopy)(response.emailPrivacyConfig);
        }
    }
    /**
     * The email sign in provider configuration.
     */
    get emailSignInConfig() {
        return this.emailSignInConfig_;
    }
    /**
     * The multi-factor auth configuration on the current tenant.
     */
    get multiFactorConfig() {
        return this.multiFactorConfig_;
    }
    /**
     * The recaptcha config auth configuration of the current tenant.
     */
    get recaptchaConfig() {
        return this.recaptchaConfig_;
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON() {
        const json = {
            tenantId: this.tenantId,
            displayName: this.displayName,
            emailSignInConfig: this.emailSignInConfig_?.toJSON(),
            multiFactorConfig: this.multiFactorConfig_?.toJSON(),
            anonymousSignInEnabled: this.anonymousSignInEnabled,
            testPhoneNumbers: this.testPhoneNumbers,
            smsRegionConfig: (0, deep_copy_1$3.deepCopy)(this.smsRegionConfig),
            recaptchaConfig: (0, deep_copy_1$3.deepCopy)(this.recaptchaConfig),
            passwordPolicyConfig: (0, deep_copy_1$3.deepCopy)(this.passwordPolicyConfig),
            emailPrivacyConfig: (0, deep_copy_1$3.deepCopy)(this.emailPrivacyConfig),
        };
        if (typeof json.multiFactorConfig === 'undefined') {
            delete json.multiFactorConfig;
        }
        if (typeof json.testPhoneNumbers === 'undefined') {
            delete json.testPhoneNumbers;
        }
        if (typeof json.smsRegionConfig === 'undefined') {
            delete json.smsRegionConfig;
        }
        if (typeof json.recaptchaConfig === 'undefined') {
            delete json.recaptchaConfig;
        }
        if (typeof json.passwordPolicyConfig === 'undefined') {
            delete json.passwordPolicyConfig;
        }
        if (typeof json.emailPrivacyConfig === 'undefined') {
            delete json.emailPrivacyConfig;
        }
        return json;
    }
}
tenant.Tenant = Tenant;

var identifier = {};

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(identifier, "__esModule", { value: true });
identifier.isUidIdentifier = isUidIdentifier;
identifier.isEmailIdentifier = isEmailIdentifier;
identifier.isPhoneIdentifier = isPhoneIdentifier;
identifier.isProviderIdentifier = isProviderIdentifier;
/*
 * User defined type guards. See
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
 */
function isUidIdentifier(id) {
    return id.uid !== undefined;
}
function isEmailIdentifier(id) {
    return id.email !== undefined;
}
function isPhoneIdentifier(id) {
    return id.phoneNumber !== undefined;
}
function isProviderIdentifier(id) {
    const pid = id;
    return pid.providerId !== undefined && pid.providerUid !== undefined;
}

var projectConfig = {};

/*! firebase-admin v13.10.0 */
Object.defineProperty(projectConfig, "__esModule", { value: true });
projectConfig.ProjectConfig = void 0;
/*!
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const validator$4 = validator$b;
const error_1$4 = error;
const auth_config_1$1 = authConfig;
const deep_copy_1$2 = deepCopy$1;
/**
* Represents a project configuration.
*/
class ProjectConfig {
    /**
     * The multi-factor auth configuration.
     */
    get multiFactorConfig() {
        return this.multiFactorConfig_;
    }
    /**
     * The reCAPTCHA configuration.
     */
    get recaptchaConfig() {
        return this.recaptchaConfig_;
    }
    /**
     * Validates a project config options object. Throws an error on failure.
     *
     * @param request - The project config options object to validate.
     */
    static validate(request) {
        if (!validator$4.isNonNullObject(request)) {
            throw new error_1$4.FirebaseAuthError(error_1$4.AuthClientErrorCode.INVALID_ARGUMENT, '"UpdateProjectConfigRequest" must be a valid non-null object.');
        }
        const validKeys = {
            smsRegionConfig: true,
            multiFactorConfig: true,
            recaptchaConfig: true,
            passwordPolicyConfig: true,
            emailPrivacyConfig: true,
            mobileLinksConfig: true,
        };
        // Check for unsupported top level attributes.
        for (const key in request) {
            if (!(key in validKeys)) {
                throw new error_1$4.FirebaseAuthError(error_1$4.AuthClientErrorCode.INVALID_ARGUMENT, `"${key}" is not a valid UpdateProjectConfigRequest parameter.`);
            }
        }
        // Validate SMS Regions Config if provided.
        if (typeof request.smsRegionConfig !== 'undefined') {
            auth_config_1$1.SmsRegionsAuthConfig.validate(request.smsRegionConfig);
        }
        // Validate Multi Factor Config if provided
        if (typeof request.multiFactorConfig !== 'undefined') {
            auth_config_1$1.MultiFactorAuthConfig.validate(request.multiFactorConfig);
        }
        // Validate reCAPTCHA config attribute.
        if (typeof request.recaptchaConfig !== 'undefined') {
            auth_config_1$1.RecaptchaAuthConfig.validate(request.recaptchaConfig);
        }
        // Validate Password policy Config if provided
        if (typeof request.passwordPolicyConfig !== 'undefined') {
            auth_config_1$1.PasswordPolicyAuthConfig.validate(request.passwordPolicyConfig);
        }
        // Validate Email Privacy Config if provided.
        if (typeof request.emailPrivacyConfig !== 'undefined') {
            auth_config_1$1.EmailPrivacyAuthConfig.validate(request.emailPrivacyConfig);
        }
        // Validate Mobile Links Config if provided.
        if (typeof request.mobileLinksConfig !== 'undefined') {
            auth_config_1$1.MobileLinksAuthConfig.validate(request.mobileLinksConfig);
        }
    }
    /**
     * Build the corresponding server request for a UpdateProjectConfigRequest object.
     * @param configOptions - The properties to convert to a server request.
     * @returns  The equivalent server request.
     *
     * @internal
     */
    static buildServerRequest(configOptions) {
        ProjectConfig.validate(configOptions);
        const request = {};
        if (typeof configOptions.smsRegionConfig !== 'undefined') {
            request.smsRegionConfig = configOptions.smsRegionConfig;
        }
        if (typeof configOptions.multiFactorConfig !== 'undefined') {
            request.mfa = auth_config_1$1.MultiFactorAuthConfig.buildServerRequest(configOptions.multiFactorConfig);
        }
        if (typeof configOptions.recaptchaConfig !== 'undefined') {
            request.recaptchaConfig = auth_config_1$1.RecaptchaAuthConfig.buildServerRequest(configOptions.recaptchaConfig);
        }
        if (typeof configOptions.passwordPolicyConfig !== 'undefined') {
            request.passwordPolicyConfig = auth_config_1$1.PasswordPolicyAuthConfig.buildServerRequest(configOptions.passwordPolicyConfig);
        }
        if (typeof configOptions.emailPrivacyConfig !== 'undefined') {
            request.emailPrivacyConfig = configOptions.emailPrivacyConfig;
        }
        if (typeof configOptions.mobileLinksConfig !== 'undefined') {
            request.mobileLinksConfig = configOptions.mobileLinksConfig;
        }
        return request;
    }
    /**
     * The Project Config object constructor.
     *
     * @param response - The server side response used to initialize the Project Config object.
     * @constructor
     * @internal
     */
    constructor(response) {
        if (typeof response.smsRegionConfig !== 'undefined') {
            this.smsRegionConfig = response.smsRegionConfig;
        }
        //Backend API returns "mfa" in case of project config and "mfaConfig" in case of tenant config. 
        //The SDK exposes it as multiFactorConfig always.
        if (typeof response.mfa !== 'undefined') {
            this.multiFactorConfig_ = new auth_config_1$1.MultiFactorAuthConfig(response.mfa);
        }
        if (typeof response.recaptchaConfig !== 'undefined') {
            this.recaptchaConfig_ = new auth_config_1$1.RecaptchaAuthConfig(response.recaptchaConfig);
        }
        if (typeof response.passwordPolicyConfig !== 'undefined') {
            this.passwordPolicyConfig = new auth_config_1$1.PasswordPolicyAuthConfig(response.passwordPolicyConfig);
        }
        if (typeof response.emailPrivacyConfig !== 'undefined') {
            this.emailPrivacyConfig = response.emailPrivacyConfig;
        }
        if (typeof response.mobileLinksConfig !== 'undefined') {
            this.mobileLinksConfig = response.mobileLinksConfig;
        }
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON() {
        // JSON serialization
        const json = {
            smsRegionConfig: (0, deep_copy_1$2.deepCopy)(this.smsRegionConfig),
            multiFactorConfig: (0, deep_copy_1$2.deepCopy)(this.multiFactorConfig),
            recaptchaConfig: (0, deep_copy_1$2.deepCopy)(this.recaptchaConfig),
            passwordPolicyConfig: (0, deep_copy_1$2.deepCopy)(this.passwordPolicyConfig),
            emailPrivacyConfig: (0, deep_copy_1$2.deepCopy)(this.emailPrivacyConfig),
            mobileLinksConfig: (0, deep_copy_1$2.deepCopy)(this.mobileLinksConfig),
        };
        if (typeof json.smsRegionConfig === 'undefined') {
            delete json.smsRegionConfig;
        }
        if (typeof json.multiFactorConfig === 'undefined') {
            delete json.multiFactorConfig;
        }
        if (typeof json.recaptchaConfig === 'undefined') {
            delete json.recaptchaConfig;
        }
        if (typeof json.passwordPolicyConfig === 'undefined') {
            delete json.passwordPolicyConfig;
        }
        if (typeof json.emailPrivacyConfig === 'undefined') {
            delete json.emailPrivacyConfig;
        }
        if (typeof json.mobileLinksConfig === 'undefined') {
            delete json.mobileLinksConfig;
        }
        return json;
    }
}
projectConfig.ProjectConfig = ProjectConfig;

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TenantAwareAuthRequestHandler = exports.AuthRequestHandler = exports.AbstractAuthRequestHandler = exports.FIREBASE_AUTH_SIGN_UP_NEW_USER = exports.FIREBASE_AUTH_SET_ACCOUNT_INFO = exports.FIREBASE_AUTH_BATCH_DELETE_ACCOUNTS = exports.FIREBASE_AUTH_DELETE_ACCOUNT = exports.FIREBASE_AUTH_GET_ACCOUNTS_INFO = exports.FIREBASE_AUTH_GET_ACCOUNT_INFO = exports.FIREBASE_AUTH_DOWNLOAD_ACCOUNT = exports.FIREBASE_AUTH_UPLOAD_ACCOUNT = exports.FIREBASE_AUTH_CREATE_SESSION_COOKIE = exports.EMAIL_ACTION_REQUEST_TYPES = exports.RESERVED_CLAIMS = void 0;
	exports.useEmulator = useEmulator;
	const validator = validator$b;
	const deep_copy_1 = deepCopy$1;
	const error_1 = error;
	const api_request_1 = apiRequest;
	const utils = utils$4;
	const user_import_builder_1 = userImportBuilder;
	const action_code_settings_builder_1 = actionCodeSettingsBuilder;
	const tenant_1 = tenant;
	const identifier_1 = identifier;
	const auth_config_1 = authConfig;
	const project_config_1 = projectConfig;
	/** Firebase Auth request header. */
	const FIREBASE_AUTH_HEADERS = {
	    'X-Client-Version': `Node/Admin/${utils.getSdkVersion()}`,
	};
	/** Firebase Auth request timeout duration in milliseconds. */
	const FIREBASE_AUTH_TIMEOUT = 25000;
	/** List of reserved claims which cannot be provided when creating a custom token. */
	exports.RESERVED_CLAIMS = [
	    'acr', 'amr', 'at_hash', 'aud', 'auth_time', 'azp', 'cnf', 'c_hash', 'exp', 'iat',
	    'iss', 'jti', 'nbf', 'nonce', 'sub', 'firebase',
	];
	/** List of supported email action request types. */
	exports.EMAIL_ACTION_REQUEST_TYPES = [
	    'PASSWORD_RESET', 'VERIFY_EMAIL', 'EMAIL_SIGNIN', 'VERIFY_AND_CHANGE_EMAIL',
	];
	/** Maximum allowed number of characters in the custom claims payload. */
	const MAX_CLAIMS_PAYLOAD_SIZE = 1000;
	/** Maximum allowed number of users to batch download at one time. */
	const MAX_DOWNLOAD_ACCOUNT_PAGE_SIZE = 1000;
	/** Maximum allowed number of users to batch upload at one time. */
	const MAX_UPLOAD_ACCOUNT_BATCH_SIZE = 1000;
	/** Maximum allowed number of users to batch get at one time. */
	const MAX_GET_ACCOUNTS_BATCH_SIZE = 100;
	/** Maximum allowed number of users to batch delete at one time. */
	const MAX_DELETE_ACCOUNTS_BATCH_SIZE = 1000;
	/** Minimum allowed session cookie duration in seconds (5 minutes). */
	const MIN_SESSION_COOKIE_DURATION_SECS = 5 * 60;
	/** Maximum allowed session cookie duration in seconds (2 weeks). */
	const MAX_SESSION_COOKIE_DURATION_SECS = 14 * 24 * 60 * 60;
	/** Maximum allowed number of provider configurations to batch download at one time. */
	const MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE = 100;
	/** The Firebase Auth backend base URL format. */
	const FIREBASE_AUTH_BASE_URL_FORMAT = 'https://identitytoolkit.googleapis.com/{version}/projects/{projectId}{api}';
	/** Firebase Auth base URlLformat when using the auth emultor. */
	const FIREBASE_AUTH_EMULATOR_BASE_URL_FORMAT = 'http://{host}/identitytoolkit.googleapis.com/{version}/projects/{projectId}{api}';
	/** The Firebase Auth backend multi-tenancy base URL format. */
	const FIREBASE_AUTH_TENANT_URL_FORMAT = FIREBASE_AUTH_BASE_URL_FORMAT.replace('projects/{projectId}', 'projects/{projectId}/tenants/{tenantId}');
	/** Firebase Auth base URL format when using the auth emultor with multi-tenancy. */
	const FIREBASE_AUTH_EMULATOR_TENANT_URL_FORMAT = FIREBASE_AUTH_EMULATOR_BASE_URL_FORMAT.replace('projects/{projectId}', 'projects/{projectId}/tenants/{tenantId}');
	/** Maximum allowed number of tenants to download at one time. */
	const MAX_LIST_TENANT_PAGE_SIZE = 1000;
	/**
	 * Enum for the user write operation type.
	 */
	var WriteOperationType;
	(function (WriteOperationType) {
	    WriteOperationType["Create"] = "create";
	    WriteOperationType["Update"] = "update";
	    WriteOperationType["Upload"] = "upload";
	})(WriteOperationType || (WriteOperationType = {}));
	/** Defines a base utility to help with resource URL construction. */
	class AuthResourceUrlBuilder {
	    /**
	     * The resource URL builder constructor.
	     *
	     * @param projectId - The resource project ID.
	     * @param version - The endpoint API version.
	     * @constructor
	     */
	    constructor(app, version = 'v1') {
	        this.app = app;
	        this.version = version;
	        if (useEmulator()) {
	            this.urlFormat = utils.formatString(FIREBASE_AUTH_EMULATOR_BASE_URL_FORMAT, {
	                host: emulatorHost()
	            });
	        }
	        else {
	            this.urlFormat = FIREBASE_AUTH_BASE_URL_FORMAT;
	        }
	    }
	    /**
	     * Returns the resource URL corresponding to the provided parameters.
	     *
	     * @param api - The backend API name.
	     * @param params - The optional additional parameters to substitute in the
	     *     URL path.
	     * @returns The corresponding resource URL.
	     */
	    getUrl(api, params) {
	        return this.getProjectId()
	            .then((projectId) => {
	            const baseParams = {
	                version: this.version,
	                projectId,
	                api: api || '',
	            };
	            const baseUrl = utils.formatString(this.urlFormat, baseParams);
	            // Substitute additional api related parameters.
	            return utils.formatString(baseUrl, params || {});
	        });
	    }
	    getProjectId() {
	        if (this.projectId) {
	            return Promise.resolve(this.projectId);
	        }
	        return utils.findProjectId(this.app)
	            .then((projectId) => {
	            if (!validator.isNonEmptyString(projectId)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CREDENTIAL, 'Failed to determine project ID for Auth. Initialize the '
	                    + 'SDK with service account credentials or set project ID as an app option. '
	                    + 'Alternatively set the GOOGLE_CLOUD_PROJECT environment variable.');
	            }
	            this.projectId = projectId;
	            return projectId;
	        });
	    }
	}
	/** Tenant aware resource builder utility. */
	class TenantAwareAuthResourceUrlBuilder extends AuthResourceUrlBuilder {
	    /**
	     * The tenant aware resource URL builder constructor.
	     *
	     * @param projectId - The resource project ID.
	     * @param version - The endpoint API version.
	     * @param tenantId - The tenant ID.
	     * @constructor
	     */
	    constructor(app, version, tenantId) {
	        super(app, version);
	        this.app = app;
	        this.version = version;
	        this.tenantId = tenantId;
	        if (useEmulator()) {
	            this.urlFormat = utils.formatString(FIREBASE_AUTH_EMULATOR_TENANT_URL_FORMAT, {
	                host: emulatorHost()
	            });
	        }
	        else {
	            this.urlFormat = FIREBASE_AUTH_TENANT_URL_FORMAT;
	        }
	    }
	    /**
	     * Returns the resource URL corresponding to the provided parameters.
	     *
	     * @param api - The backend API name.
	     * @param params - The optional additional parameters to substitute in the
	     *     URL path.
	     * @returns The corresponding resource URL.
	     */
	    getUrl(api, params) {
	        return super.getUrl(api, params)
	            .then((url) => {
	            return utils.formatString(url, { tenantId: this.tenantId });
	        });
	    }
	}
	/**
	 * Auth-specific HTTP client which uses the special "owner" token
	 * when communicating with the Auth Emulator.
	 */
	class AuthHttpClient extends api_request_1.AuthorizedHttpClient {
	    getToken() {
	        if (useEmulator()) {
	            return Promise.resolve('owner');
	        }
	        return super.getToken();
	    }
	}
	/**
	 * Validates an AuthFactorInfo object. All unsupported parameters
	 * are removed from the original request. If an invalid field is passed
	 * an error is thrown.
	 *
	 * @param request - The AuthFactorInfo request object.
	 */
	function validateAuthFactorInfo(request) {
	    const validKeys = {
	        mfaEnrollmentId: true,
	        displayName: true,
	        phoneInfo: true,
	        enrolledAt: true,
	    };
	    // Remove unsupported keys from the original request.
	    for (const key in request) {
	        if (!(key in validKeys)) {
	            delete request[key];
	        }
	    }
	    // No enrollment ID is available for signupNewUser. Use another identifier.
	    const authFactorInfoIdentifier = request.mfaEnrollmentId || request.phoneInfo || JSON.stringify(request);
	    // Enrollment uid may or may not be specified for update operations.
	    if (typeof request.mfaEnrollmentId !== 'undefined' &&
	        !validator.isNonEmptyString(request.mfaEnrollmentId)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID, 'The second factor "uid" must be a valid non-empty string.');
	    }
	    if (typeof request.displayName !== 'undefined' &&
	        !validator.isString(request.displayName)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISPLAY_NAME, `The second factor "displayName" for "${authFactorInfoIdentifier}" must be a valid string.`);
	    }
	    // enrolledAt must be a valid UTC date string.
	    if (typeof request.enrolledAt !== 'undefined' &&
	        !validator.isISODateString(request.enrolledAt)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ENROLLMENT_TIME, `The second factor "enrollmentTime" for "${authFactorInfoIdentifier}" must be a valid ` +
	            'UTC date string.');
	    }
	    // Validate required fields depending on second factor type.
	    if (typeof request.phoneInfo !== 'undefined') {
	        // phoneNumber should be a string and a valid phone number.
	        if (!validator.isPhoneNumber(request.phoneInfo)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHONE_NUMBER, `The second factor "phoneNumber" for "${authFactorInfoIdentifier}" must be a non-empty ` +
	                'E.164 standard compliant identifier string.');
	        }
	    }
	    else {
	        // Invalid second factor. For example, a phone second factor may have been provided without
	        // a phone number. A TOTP based second factor may require a secret key, etc.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ENROLLED_FACTORS, 'MFAInfo object provided is invalid.');
	    }
	}
	/**
	 * Validates a providerUserInfo object. All unsupported parameters
	 * are removed from the original request. If an invalid field is passed
	 * an error is thrown.
	 *
	 * @param request - The providerUserInfo request object.
	 */
	function validateProviderUserInfo(request) {
	    const validKeys = {
	        rawId: true,
	        providerId: true,
	        email: true,
	        displayName: true,
	        photoUrl: true,
	    };
	    // Remove invalid keys from original request.
	    for (const key in request) {
	        if (!(key in validKeys)) {
	            delete request[key];
	        }
	    }
	    if (!validator.isNonEmptyString(request.providerId)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID);
	    }
	    if (typeof request.displayName !== 'undefined' &&
	        typeof request.displayName !== 'string') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISPLAY_NAME, `The provider "displayName" for "${request.providerId}" must be a valid string.`);
	    }
	    if (!validator.isNonEmptyString(request.rawId)) {
	        // This is called localId on the backend but the developer specifies this as
	        // uid externally. So the error message should use the client facing name.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID, `The provider "uid" for "${request.providerId}" must be a valid non-empty string.`);
	    }
	    // email should be a string and a valid email.
	    if (typeof request.email !== 'undefined' && !validator.isEmail(request.email)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL, `The provider "email" for "${request.providerId}" must be a valid email string.`);
	    }
	    // photoUrl should be a URL.
	    if (typeof request.photoUrl !== 'undefined' &&
	        !validator.isURL(request.photoUrl)) {
	        // This is called photoUrl on the backend but the developer specifies this as
	        // photoURL externally. So the error message should use the client facing name.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHOTO_URL, `The provider "photoURL" for "${request.providerId}" must be a valid URL string.`);
	    }
	}
	/**
	 * Validates a create/edit request object. All unsupported parameters
	 * are removed from the original request. If an invalid field is passed
	 * an error is thrown.
	 *
	 * @param request - The create/edit request object.
	 * @param writeOperationType - The write operation type.
	 */
	function validateCreateEditRequest(request, writeOperationType) {
	    const uploadAccountRequest = writeOperationType === WriteOperationType.Upload;
	    // Hash set of whitelisted parameters.
	    const validKeys = {
	        displayName: true,
	        localId: true,
	        email: true,
	        password: true,
	        rawPassword: true,
	        emailVerified: true,
	        photoUrl: true,
	        disabled: true,
	        disableUser: true,
	        deleteAttribute: true,
	        deleteProvider: true,
	        sanityCheck: true,
	        phoneNumber: true,
	        customAttributes: true,
	        validSince: true,
	        // Pass linkProviderUserInfo only for updates (i.e. not for uploads.)
	        linkProviderUserInfo: !uploadAccountRequest,
	        // Pass tenantId only for uploadAccount requests.
	        tenantId: uploadAccountRequest,
	        passwordHash: uploadAccountRequest,
	        salt: uploadAccountRequest,
	        createdAt: uploadAccountRequest,
	        lastLoginAt: uploadAccountRequest,
	        providerUserInfo: uploadAccountRequest,
	        mfaInfo: uploadAccountRequest,
	        // Only for non-uploadAccount requests.
	        mfa: !uploadAccountRequest,
	    };
	    // Remove invalid keys from original request.
	    for (const key in request) {
	        if (!(key in validKeys)) {
	            delete request[key];
	        }
	    }
	    if (typeof request.tenantId !== 'undefined' &&
	        !validator.isNonEmptyString(request.tenantId)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TENANT_ID);
	    }
	    // For any invalid parameter, use the external key name in the error description.
	    // displayName should be a string.
	    if (typeof request.displayName !== 'undefined' &&
	        !validator.isString(request.displayName)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISPLAY_NAME);
	    }
	    if ((typeof request.localId !== 'undefined' || uploadAccountRequest) &&
	        !validator.isUid(request.localId)) {
	        // This is called localId on the backend but the developer specifies this as
	        // uid externally. So the error message should use the client facing name.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID);
	    }
	    // email should be a string and a valid email.
	    if (typeof request.email !== 'undefined' && !validator.isEmail(request.email)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL);
	    }
	    // phoneNumber should be a string and a valid phone number.
	    if (typeof request.phoneNumber !== 'undefined' &&
	        !validator.isPhoneNumber(request.phoneNumber)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHONE_NUMBER);
	    }
	    // password should be a string and a minimum of 6 chars.
	    if (typeof request.password !== 'undefined' &&
	        !validator.isPassword(request.password)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PASSWORD);
	    }
	    // rawPassword should be a string and a minimum of 6 chars.
	    if (typeof request.rawPassword !== 'undefined' &&
	        !validator.isPassword(request.rawPassword)) {
	        // This is called rawPassword on the backend but the developer specifies this as
	        // password externally. So the error message should use the client facing name.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PASSWORD);
	    }
	    // emailVerified should be a boolean.
	    if (typeof request.emailVerified !== 'undefined' &&
	        typeof request.emailVerified !== 'boolean') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL_VERIFIED);
	    }
	    // photoUrl should be a URL.
	    if (typeof request.photoUrl !== 'undefined' &&
	        !validator.isURL(request.photoUrl)) {
	        // This is called photoUrl on the backend but the developer specifies this as
	        // photoURL externally. So the error message should use the client facing name.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHOTO_URL);
	    }
	    // disabled should be a boolean.
	    if (typeof request.disabled !== 'undefined' &&
	        typeof request.disabled !== 'boolean') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISABLED_FIELD);
	    }
	    // validSince should be a number.
	    if (typeof request.validSince !== 'undefined' &&
	        !validator.isNumber(request.validSince)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TOKENS_VALID_AFTER_TIME);
	    }
	    // createdAt should be a number.
	    if (typeof request.createdAt !== 'undefined' &&
	        !validator.isNumber(request.createdAt)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CREATION_TIME);
	    }
	    // lastSignInAt should be a number.
	    if (typeof request.lastLoginAt !== 'undefined' &&
	        !validator.isNumber(request.lastLoginAt)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_LAST_SIGN_IN_TIME);
	    }
	    // disableUser should be a boolean.
	    if (typeof request.disableUser !== 'undefined' &&
	        typeof request.disableUser !== 'boolean') {
	        // This is called disableUser on the backend but the developer specifies this as
	        // disabled externally. So the error message should use the client facing name.
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_DISABLED_FIELD);
	    }
	    // customAttributes should be stringified JSON with no blacklisted claims.
	    // The payload should not exceed 1KB.
	    if (typeof request.customAttributes !== 'undefined') {
	        let developerClaims;
	        try {
	            developerClaims = JSON.parse(request.customAttributes);
	        }
	        catch (error) {
	            // JSON parsing error. This should never happen as we stringify the claims internally.
	            // However, we still need to check since setAccountInfo via edit requests could pass
	            // this field.
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CLAIMS, error.message);
	        }
	        const invalidClaims = [];
	        // Check for any invalid claims.
	        exports.RESERVED_CLAIMS.forEach((blacklistedClaim) => {
	            if (Object.prototype.hasOwnProperty.call(developerClaims, blacklistedClaim)) {
	                invalidClaims.push(blacklistedClaim);
	            }
	        });
	        // Throw an error if an invalid claim is detected.
	        if (invalidClaims.length > 0) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.FORBIDDEN_CLAIM, invalidClaims.length > 1 ?
	                `Developer claims "${invalidClaims.join('", "')}" are reserved and cannot be specified.` :
	                `Developer claim "${invalidClaims[0]}" is reserved and cannot be specified.`);
	        }
	        // Check claims payload does not exceed maxmimum size.
	        if (request.customAttributes.length > MAX_CLAIMS_PAYLOAD_SIZE) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.CLAIMS_TOO_LARGE, `Developer claims payload should not exceed ${MAX_CLAIMS_PAYLOAD_SIZE} characters.`);
	        }
	    }
	    // passwordHash has to be a base64 encoded string.
	    if (typeof request.passwordHash !== 'undefined' &&
	        !validator.isString(request.passwordHash)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PASSWORD_HASH);
	    }
	    // salt has to be a base64 encoded string.
	    if (typeof request.salt !== 'undefined' &&
	        !validator.isString(request.salt)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PASSWORD_SALT);
	    }
	    // providerUserInfo has to be an array of valid UserInfo requests.
	    if (typeof request.providerUserInfo !== 'undefined' &&
	        !validator.isArray(request.providerUserInfo)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_DATA);
	    }
	    else if (validator.isArray(request.providerUserInfo)) {
	        request.providerUserInfo.forEach((providerUserInfoEntry) => {
	            validateProviderUserInfo(providerUserInfoEntry);
	        });
	    }
	    // linkProviderUserInfo must be a (single) UserProvider value.
	    if (typeof request.linkProviderUserInfo !== 'undefined') {
	        validateProviderUserInfo(request.linkProviderUserInfo);
	    }
	    // mfaInfo is used for importUsers.
	    // mfa.enrollments is used for setAccountInfo.
	    // enrollments has to be an array of valid AuthFactorInfo requests.
	    let enrollments = null;
	    if (request.mfaInfo) {
	        enrollments = request.mfaInfo;
	    }
	    else if (request.mfa && request.mfa.enrollments) {
	        enrollments = request.mfa.enrollments;
	    }
	    if (enrollments) {
	        if (!validator.isArray(enrollments)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ENROLLED_FACTORS);
	        }
	        enrollments.forEach((authFactorInfoEntry) => {
	            validateAuthFactorInfo(authFactorInfoEntry);
	        });
	    }
	}
	/**
	 * Instantiates the createSessionCookie endpoint settings.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_CREATE_SESSION_COOKIE = new api_request_1.ApiSettings(':createSessionCookie', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // Validate the ID token is a non-empty string.
	    if (!validator.isNonEmptyString(request.idToken)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ID_TOKEN);
	    }
	    // Validate the custom session cookie duration.
	    if (!validator.isNumber(request.validDuration) ||
	        request.validDuration < MIN_SESSION_COOKIE_DURATION_SECS ||
	        request.validDuration > MAX_SESSION_COOKIE_DURATION_SECS) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_SESSION_COOKIE_DURATION);
	    }
	})
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the session cookie.
	    if (!validator.isNonEmptyString(response.sessionCookie)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR);
	    }
	});
	/**
	 * Instantiates the uploadAccount endpoint settings.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_UPLOAD_ACCOUNT = new api_request_1.ApiSettings('/accounts:batchCreate', 'POST');
	/**
	 * Instantiates the downloadAccount endpoint settings.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_DOWNLOAD_ACCOUNT = new api_request_1.ApiSettings('/accounts:batchGet', 'GET')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // Validate next page token.
	    if (typeof request.nextPageToken !== 'undefined' &&
	        !validator.isNonEmptyString(request.nextPageToken)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PAGE_TOKEN);
	    }
	    // Validate max results.
	    if (!validator.isNumber(request.maxResults) ||
	        request.maxResults <= 0 ||
	        request.maxResults > MAX_DOWNLOAD_ACCOUNT_PAGE_SIZE) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Required "maxResults" must be a positive integer that does not exceed ' +
	            `${MAX_DOWNLOAD_ACCOUNT_PAGE_SIZE}.`);
	    }
	});
	/**
	 * Instantiates the getAccountInfo endpoint settings.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_GET_ACCOUNT_INFO = new api_request_1.ApiSettings('/accounts:lookup', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    if (!request.localId && !request.email && !request.phoneNumber && !request.federatedUserId) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
	    }
	})
	    // Set response validator.
	    .setResponseValidator((response) => {
	    if (!response.users || !response.users.length) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.USER_NOT_FOUND);
	    }
	});
	/**
	 * Instantiates the getAccountInfo endpoint settings for use when fetching info
	 * for multiple accounts.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_GET_ACCOUNTS_INFO = new api_request_1.ApiSettings('/accounts:lookup', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    if (!request.localId && !request.email && !request.phoneNumber && !request.federatedUserId) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
	    }
	});
	/**
	 * Instantiates the deleteAccount endpoint settings.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_DELETE_ACCOUNT = new api_request_1.ApiSettings('/accounts:delete', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    if (!request.localId) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
	    }
	});
	/**
	 * @internal
	 */
	exports.FIREBASE_AUTH_BATCH_DELETE_ACCOUNTS = new api_request_1.ApiSettings('/accounts:batchDelete', 'POST')
	    .setRequestValidator((request) => {
	    if (!request.localIds) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifiers');
	    }
	    if (typeof request.force === 'undefined' || request.force !== true) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing force=true field');
	    }
	})
	    .setResponseValidator((response) => {
	    const errors = response.errors || [];
	    errors.forEach((batchDeleteErrorInfo) => {
	        if (typeof batchDeleteErrorInfo.index === 'undefined') {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server BatchDeleteAccountResponse is missing an errors.index field');
	        }
	        if (!batchDeleteErrorInfo.localId) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server BatchDeleteAccountResponse is missing an errors.localId field');
	        }
	        // Allow the (error) message to be missing/undef.
	    });
	});
	/**
	 * Instantiates the setAccountInfo endpoint settings for updating existing accounts.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_SET_ACCOUNT_INFO = new api_request_1.ApiSettings('/accounts:update', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // localId is a required parameter.
	    if (typeof request.localId === 'undefined') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Server request is missing user identifier');
	    }
	    // Throw error when tenantId is passed in POST body.
	    if (typeof request.tenantId !== 'undefined') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"tenantId" is an invalid "UpdateRequest" property.');
	    }
	    validateCreateEditRequest(request, WriteOperationType.Update);
	})
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // If the localId is not returned, then the request failed.
	    if (!response.localId) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.USER_NOT_FOUND);
	    }
	});
	/**
	 * Instantiates the signupNewUser endpoint settings for creating a new user with or without
	 * uid being specified. The backend will create a new one if not provided and return it.
	 *
	 * @internal
	 */
	exports.FIREBASE_AUTH_SIGN_UP_NEW_USER = new api_request_1.ApiSettings('/accounts', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // signupNewUser does not support customAttributes.
	    if (typeof request.customAttributes !== 'undefined') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"customAttributes" cannot be set when creating a new user.');
	    }
	    // signupNewUser does not support validSince.
	    if (typeof request.validSince !== 'undefined') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"validSince" cannot be set when creating a new user.');
	    }
	    // Throw error when tenantId is passed in POST body.
	    if (typeof request.tenantId !== 'undefined') {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"tenantId" is an invalid "CreateRequest" property.');
	    }
	    validateCreateEditRequest(request, WriteOperationType.Create);
	})
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // If the localId is not returned, then the request failed.
	    if (!response.localId) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new user');
	    }
	});
	const FIREBASE_AUTH_GET_OOB_CODE = new api_request_1.ApiSettings('/accounts:sendOobCode', 'POST')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    if (!validator.isEmail(request.email)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL);
	    }
	    if (typeof request.newEmail !== 'undefined' && !validator.isEmail(request.newEmail)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_NEW_EMAIL);
	    }
	    if (exports.EMAIL_ACTION_REQUEST_TYPES.indexOf(request.requestType) === -1) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, `"${request.requestType}" is not a supported email action request type.`);
	    }
	})
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // If the oobLink is not returned, then the request failed.
	    if (!response.oobLink) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create the email action link');
	    }
	});
	/**
	 * Instantiates the retrieve OIDC configuration endpoint settings.
	 *
	 * @internal
	 */
	const GET_OAUTH_IDP_CONFIG = new api_request_1.ApiSettings('/oauthIdpConfigs/{providerId}', 'GET')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the OIDC provider resource name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to get OIDC configuration');
	    }
	});
	/**
	 * Instantiates the delete OIDC configuration endpoint settings.
	 *
	 * @internal
	 */
	const DELETE_OAUTH_IDP_CONFIG = new api_request_1.ApiSettings('/oauthIdpConfigs/{providerId}', 'DELETE');
	/**
	 * Instantiates the create OIDC configuration endpoint settings.
	 *
	 * @internal
	 */
	const CREATE_OAUTH_IDP_CONFIG = new api_request_1.ApiSettings('/oauthIdpConfigs?oauthIdpConfigId={providerId}', 'POST')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the OIDC provider resource name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new OIDC configuration');
	    }
	});
	/**
	 * Instantiates the update OIDC configuration endpoint settings.
	 *
	 * @internal
	 */
	const UPDATE_OAUTH_IDP_CONFIG = new api_request_1.ApiSettings('/oauthIdpConfigs/{providerId}?updateMask={updateMask}', 'PATCH')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the configuration resource name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to update OIDC configuration');
	    }
	});
	/**
	 * Instantiates the list OIDC configuration endpoint settings.
	 *
	 * @internal
	 */
	const LIST_OAUTH_IDP_CONFIGS = new api_request_1.ApiSettings('/oauthIdpConfigs', 'GET')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // Validate next page token.
	    if (typeof request.pageToken !== 'undefined' &&
	        !validator.isNonEmptyString(request.pageToken)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PAGE_TOKEN);
	    }
	    // Validate max results.
	    if (!validator.isNumber(request.pageSize) ||
	        request.pageSize <= 0 ||
	        request.pageSize > MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Required "maxResults" must be a positive integer that does not exceed ' +
	            `${MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE}.`);
	    }
	});
	/**
	 * Instantiates the retrieve SAML configuration endpoint settings.
	 *
	 * @internal
	 */
	const GET_INBOUND_SAML_CONFIG = new api_request_1.ApiSettings('/inboundSamlConfigs/{providerId}', 'GET')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the SAML provider resource name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to get SAML configuration');
	    }
	});
	/**
	 * Instantiates the delete SAML configuration endpoint settings.
	 *
	 * @internal
	 */
	const DELETE_INBOUND_SAML_CONFIG = new api_request_1.ApiSettings('/inboundSamlConfigs/{providerId}', 'DELETE');
	/**
	 * Instantiates the create SAML configuration endpoint settings.
	 *
	 * @internal
	 */
	const CREATE_INBOUND_SAML_CONFIG = new api_request_1.ApiSettings('/inboundSamlConfigs?inboundSamlConfigId={providerId}', 'POST')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the SAML provider resource name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new SAML configuration');
	    }
	});
	/**
	 * Instantiates the update SAML configuration endpoint settings.
	 *
	 * @internal
	 */
	const UPDATE_INBOUND_SAML_CONFIG = new api_request_1.ApiSettings('/inboundSamlConfigs/{providerId}?updateMask={updateMask}', 'PATCH')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain the configuration resource name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to update SAML configuration');
	    }
	});
	/**
	 * Instantiates the list SAML configuration endpoint settings.
	 *
	 * @internal
	 */
	const LIST_INBOUND_SAML_CONFIGS = new api_request_1.ApiSettings('/inboundSamlConfigs', 'GET')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // Validate next page token.
	    if (typeof request.pageToken !== 'undefined' &&
	        !validator.isNonEmptyString(request.pageToken)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PAGE_TOKEN);
	    }
	    // Validate max results.
	    if (!validator.isNumber(request.pageSize) ||
	        request.pageSize <= 0 ||
	        request.pageSize > MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Required "maxResults" must be a positive integer that does not exceed ' +
	            `${MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE}.`);
	    }
	});
	/**
	 * Class that provides the mechanism to send requests to the Firebase Auth backend endpoints.
	 *
	 * @internal
	 */
	class AbstractAuthRequestHandler {
	    /**
	     * @param response - The response to check for errors.
	     * @returns The error code if present; null otherwise.
	     */
	    static getErrorCode(response) {
	        return (validator.isNonNullObject(response) && response.error && response.error.message) || null;
	    }
	    static addUidToRequest(id, request) {
	        if (!validator.isUid(id.uid)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID);
	        }
	        request.localId ? request.localId.push(id.uid) : request.localId = [id.uid];
	        return request;
	    }
	    static addEmailToRequest(id, request) {
	        if (!validator.isEmail(id.email)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL);
	        }
	        request.email ? request.email.push(id.email) : request.email = [id.email];
	        return request;
	    }
	    static addPhoneToRequest(id, request) {
	        if (!validator.isPhoneNumber(id.phoneNumber)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHONE_NUMBER);
	        }
	        request.phoneNumber ? request.phoneNumber.push(id.phoneNumber) : request.phoneNumber = [id.phoneNumber];
	        return request;
	    }
	    static addProviderToRequest(id, request) {
	        if (!validator.isNonEmptyString(id.providerId)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID);
	        }
	        if (!validator.isNonEmptyString(id.providerUid)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_UID);
	        }
	        const federatedUserId = {
	            providerId: id.providerId,
	            rawId: id.providerUid,
	        };
	        request.federatedUserId
	            ? request.federatedUserId.push(federatedUserId)
	            : request.federatedUserId = [federatedUserId];
	        return request;
	    }
	    /**
	     * @param app - The app used to fetch access tokens to sign API requests.
	     * @constructor
	     */
	    constructor(app) {
	        this.app = app;
	        if (typeof app !== 'object' || app === null || !('options' in app)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'First argument passed to admin.auth() must be a valid Firebase app instance.');
	        }
	        this.httpClient = new AuthHttpClient(app);
	    }
	    /**
	     * Creates a new Firebase session cookie with the specified duration that can be used for
	     * session management (set as a server side session cookie with custom cookie policy).
	     * The session cookie JWT will have the same payload claims as the provided ID token.
	     *
	     * @param idToken - The Firebase ID token to exchange for a session cookie.
	     * @param expiresIn - The session cookie duration in milliseconds.
	     *
	     * @returns A promise that resolves on success with the created session cookie.
	     */
	    createSessionCookie(idToken, expiresIn) {
	        const request = {
	            idToken,
	            // Convert to seconds.
	            validDuration: Math.floor(expiresIn / 1000),
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_CREATE_SESSION_COOKIE, request)
	            .then((response) => response.sessionCookie);
	    }
	    /**
	     * Looks up a user by uid.
	     *
	     * @param uid - The uid of the user to lookup.
	     * @returns A promise that resolves with the user information.
	     */
	    getAccountInfoByUid(uid) {
	        if (!validator.isUid(uid)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID));
	        }
	        const request = {
	            localId: [uid],
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_GET_ACCOUNT_INFO, request);
	    }
	    /**
	     * Looks up a user by email.
	     *
	     * @param email - The email of the user to lookup.
	     * @returns A promise that resolves with the user information.
	     */
	    getAccountInfoByEmail(email) {
	        if (!validator.isEmail(email)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_EMAIL));
	        }
	        const request = {
	            email: [email],
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_GET_ACCOUNT_INFO, request);
	    }
	    /**
	     * Looks up a user by phone number.
	     *
	     * @param phoneNumber - The phone number of the user to lookup.
	     * @returns A promise that resolves with the user information.
	     */
	    getAccountInfoByPhoneNumber(phoneNumber) {
	        if (!validator.isPhoneNumber(phoneNumber)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PHONE_NUMBER));
	        }
	        const request = {
	            phoneNumber: [phoneNumber],
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_GET_ACCOUNT_INFO, request);
	    }
	    getAccountInfoByFederatedUid(providerId, rawId) {
	        if (!validator.isNonEmptyString(providerId) || !validator.isNonEmptyString(rawId)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID);
	        }
	        const request = {
	            federatedUserId: [{
	                    providerId,
	                    rawId,
	                }],
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_GET_ACCOUNT_INFO, request);
	    }
	    /**
	     * Looks up multiple users by their identifiers (uid, email, etc).
	     *
	     * @param identifiers - The identifiers indicating the users
	     *     to be looked up. Must have <= 100 entries.
	     * @param A - promise that resolves with the set of successfully
	     *     looked up users. Possibly empty if no users were looked up.
	     */
	    getAccountInfoByIdentifiers(identifiers) {
	        if (identifiers.length === 0) {
	            return Promise.resolve({ users: [] });
	        }
	        else if (identifiers.length > MAX_GET_ACCOUNTS_BATCH_SIZE) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.MAXIMUM_USER_COUNT_EXCEEDED, '`identifiers` parameter must have <= ' + MAX_GET_ACCOUNTS_BATCH_SIZE + ' entries.');
	        }
	        let request = {};
	        for (const id of identifiers) {
	            if ((0, identifier_1.isUidIdentifier)(id)) {
	                request = AbstractAuthRequestHandler.addUidToRequest(id, request);
	            }
	            else if ((0, identifier_1.isEmailIdentifier)(id)) {
	                request = AbstractAuthRequestHandler.addEmailToRequest(id, request);
	            }
	            else if ((0, identifier_1.isPhoneIdentifier)(id)) {
	                request = AbstractAuthRequestHandler.addPhoneToRequest(id, request);
	            }
	            else if ((0, identifier_1.isProviderIdentifier)(id)) {
	                request = AbstractAuthRequestHandler.addProviderToRequest(id, request);
	            }
	            else {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Unrecognized identifier: ' + id);
	            }
	        }
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_GET_ACCOUNTS_INFO, request);
	    }
	    /**
	     * Exports the users (single batch only) with a size of maxResults and starting from
	     * the offset as specified by pageToken.
	     *
	     * @param maxResults - The page size, 1000 if undefined. This is also the maximum
	     *     allowed limit.
	     * @param pageToken - The next page token. If not specified, returns users starting
	     *     without any offset. Users are returned in the order they were created from oldest to
	     *     newest, relative to the page token offset.
	     * @returns A promise that resolves with the current batch of downloaded
	     *     users and the next page token if available. For the last page, an empty list of users
	     *     and no page token are returned.
	     */
	    downloadAccount(maxResults = MAX_DOWNLOAD_ACCOUNT_PAGE_SIZE, pageToken) {
	        // Construct request.
	        const request = {
	            maxResults,
	            nextPageToken: pageToken,
	        };
	        // Remove next page token if not provided.
	        if (typeof request.nextPageToken === 'undefined') {
	            delete request.nextPageToken;
	        }
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_DOWNLOAD_ACCOUNT, request)
	            .then((response) => {
	            // No more users available.
	            if (!response.users) {
	                response.users = [];
	            }
	            return response;
	        });
	    }
	    /**
	     * Imports the list of users provided to Firebase Auth. This is useful when
	     * migrating from an external authentication system without having to use the Firebase CLI SDK.
	     * At most, 1000 users are allowed to be imported one at a time.
	     * When importing a list of password users, UserImportOptions are required to be specified.
	     *
	     * @param users - The list of user records to import to Firebase Auth.
	     * @param options - The user import options, required when the users provided
	     *     include password credentials.
	     * @returns A promise that resolves when the operation completes
	     *     with the result of the import. This includes the number of successful imports, the number
	     *     of failed uploads and their corresponding errors.
	     */
	    uploadAccount(users, options) {
	        // This will throw if any error is detected in the hash options.
	        // For errors in the list of users, this will not throw and will report the errors and the
	        // corresponding user index in the user import generated response below.
	        // No need to validate raw request or raw response as this is done in UserImportBuilder.
	        const userImportBuilder = new user_import_builder_1.UserImportBuilder(users, options, (userRequest) => {
	            // Pass true to validate the uploadAccount specific fields.
	            validateCreateEditRequest(userRequest, WriteOperationType.Upload);
	        });
	        const request = userImportBuilder.buildRequest();
	        // Fail quickly if more users than allowed are to be imported.
	        if (validator.isArray(users) && users.length > MAX_UPLOAD_ACCOUNT_BATCH_SIZE) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.MAXIMUM_USER_COUNT_EXCEEDED, `A maximum of ${MAX_UPLOAD_ACCOUNT_BATCH_SIZE} users can be imported at once.`);
	        }
	        // If no remaining user in request after client side processing, there is no need
	        // to send the request to the server.
	        if (!request.users || request.users.length === 0) {
	            return Promise.resolve(userImportBuilder.buildResponse([]));
	        }
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_UPLOAD_ACCOUNT, request)
	            .then((response) => {
	            // No error object is returned if no error encountered.
	            const failedUploads = (response.error || []);
	            // Rewrite response as UserImportResult and re-insert client previously detected errors.
	            return userImportBuilder.buildResponse(failedUploads);
	        });
	    }
	    /**
	     * Deletes an account identified by a uid.
	     *
	     * @param uid - The uid of the user to delete.
	     * @returns A promise that resolves when the user is deleted.
	     */
	    deleteAccount(uid) {
	        if (!validator.isUid(uid)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID));
	        }
	        const request = {
	            localId: uid,
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_DELETE_ACCOUNT, request);
	    }
	    deleteAccounts(uids, force) {
	        if (uids.length === 0) {
	            return Promise.resolve({});
	        }
	        else if (uids.length > MAX_DELETE_ACCOUNTS_BATCH_SIZE) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.MAXIMUM_USER_COUNT_EXCEEDED, '`uids` parameter must have <= ' + MAX_DELETE_ACCOUNTS_BATCH_SIZE + ' entries.');
	        }
	        const request = {
	            localIds: [],
	            force,
	        };
	        uids.forEach((uid) => {
	            if (!validator.isUid(uid)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID);
	            }
	            request.localIds.push(uid);
	        });
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_BATCH_DELETE_ACCOUNTS, request);
	    }
	    /**
	     * Sets additional developer claims on an existing user identified by provided UID.
	     *
	     * @param uid - The user to edit.
	     * @param customUserClaims - The developer claims to set.
	     * @returns A promise that resolves when the operation completes
	     *     with the user id that was edited.
	     */
	    setCustomUserClaims(uid, customUserClaims) {
	        // Validate user UID.
	        if (!validator.isUid(uid)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID));
	        }
	        else if (!validator.isObject(customUserClaims)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'CustomUserClaims argument must be an object or null.'));
	        }
	        // Delete operation. Replace null with an empty object.
	        if (customUserClaims === null) {
	            customUserClaims = {};
	        }
	        // Construct custom user attribute editting request.
	        const request = {
	            localId: uid,
	            customAttributes: JSON.stringify(customUserClaims),
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_SET_ACCOUNT_INFO, request)
	            .then((response) => {
	            return response.localId;
	        });
	    }
	    /**
	     * Edits an existing user.
	     *
	     * @param uid - The user to edit.
	     * @param properties - The properties to set on the user.
	     * @returns A promise that resolves when the operation completes
	     *     with the user id that was edited.
	     */
	    updateExistingAccount(uid, properties) {
	        if (!validator.isUid(uid)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID));
	        }
	        else if (!validator.isNonNullObject(properties)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Properties argument must be a non-null object.'));
	        }
	        else if (validator.isNonNullObject(properties.providerToLink)) {
	            // TODO(rsgowman): These checks overlap somewhat with
	            // validateProviderUserInfo. It may be possible to refactor a bit.
	            if (!validator.isNonEmptyString(properties.providerToLink.providerId)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'providerToLink.providerId of properties argument must be a non-empty string.');
	            }
	            if (!validator.isNonEmptyString(properties.providerToLink.uid)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'providerToLink.uid of properties argument must be a non-empty string.');
	            }
	        }
	        else if (typeof properties.providersToUnlink !== 'undefined') {
	            if (!validator.isArray(properties.providersToUnlink)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'providersToUnlink of properties argument must be an array of strings.');
	            }
	            properties.providersToUnlink.forEach((providerId) => {
	                if (!validator.isNonEmptyString(providerId)) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'providersToUnlink of properties argument must be an array of strings.');
	                }
	            });
	        }
	        // Build the setAccountInfo request.
	        const request = (0, deep_copy_1.deepCopy)(properties);
	        request.localId = uid;
	        // For deleting displayName or photoURL, these values must be passed as null.
	        // They will be removed from the backend request and an additional parameter
	        // deleteAttribute: ['PHOTO_URL', 'DISPLAY_NAME']
	        // with an array of the parameter names to delete will be passed.
	        // Parameters that are deletable and their deleteAttribute names.
	        // Use client facing names, photoURL instead of photoUrl.
	        const deletableParams = {
	            displayName: 'DISPLAY_NAME',
	            photoURL: 'PHOTO_URL',
	        };
	        // Properties to delete if available.
	        request.deleteAttribute = [];
	        for (const key in deletableParams) {
	            if (request[key] === null) {
	                // Add property identifier to list of attributes to delete.
	                request.deleteAttribute.push(deletableParams[key]);
	                // Remove property from request.
	                delete request[key];
	            }
	        }
	        if (request.deleteAttribute.length === 0) {
	            delete request.deleteAttribute;
	        }
	        // For deleting phoneNumber, this value must be passed as null.
	        // It will be removed from the backend request and an additional parameter
	        // deleteProvider: ['phone'] with an array of providerIds (phone in this case),
	        // will be passed.
	        if (request.phoneNumber === null) {
	            request.deleteProvider ? request.deleteProvider.push('phone') : request.deleteProvider = ['phone'];
	            delete request.phoneNumber;
	        }
	        if (typeof (request.providerToLink) !== 'undefined') {
	            request.linkProviderUserInfo = (0, deep_copy_1.deepCopy)(request.providerToLink);
	            delete request.providerToLink;
	            request.linkProviderUserInfo.rawId = request.linkProviderUserInfo.uid;
	            delete request.linkProviderUserInfo.uid;
	        }
	        if (typeof (request.providersToUnlink) !== 'undefined') {
	            if (!validator.isArray(request.deleteProvider)) {
	                request.deleteProvider = [];
	            }
	            request.deleteProvider = request.deleteProvider.concat(request.providersToUnlink);
	            delete request.providersToUnlink;
	        }
	        // Rewrite photoURL to photoUrl.
	        if (typeof request.photoURL !== 'undefined') {
	            request.photoUrl = request.photoURL;
	            delete request.photoURL;
	        }
	        // Rewrite disabled to disableUser.
	        if (typeof request.disabled !== 'undefined') {
	            request.disableUser = request.disabled;
	            delete request.disabled;
	        }
	        // Construct mfa related user data.
	        if (validator.isNonNullObject(request.multiFactor)) {
	            if (request.multiFactor.enrolledFactors === null) {
	                // Remove all second factors.
	                request.mfa = {};
	            }
	            else if (validator.isArray(request.multiFactor.enrolledFactors)) {
	                request.mfa = {
	                    enrollments: [],
	                };
	                try {
	                    request.multiFactor.enrolledFactors.forEach((multiFactorInfo) => {
	                        request.mfa.enrollments.push((0, user_import_builder_1.convertMultiFactorInfoToServerFormat)(multiFactorInfo));
	                    });
	                }
	                catch (e) {
	                    return Promise.reject(e);
	                }
	                if (request.mfa.enrollments.length === 0) {
	                    delete request.mfa.enrollments;
	                }
	            }
	            delete request.multiFactor;
	        }
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_SET_ACCOUNT_INFO, request)
	            .then((response) => {
	            return response.localId;
	        });
	    }
	    /**
	     * Revokes all refresh tokens for the specified user identified by the uid provided.
	     * In addition to revoking all refresh tokens for a user, all ID tokens issued
	     * before revocation will also be revoked on the Auth backend. Any request with an
	     * ID token generated before revocation will be rejected with a token expired error.
	     * Note that due to the fact that the timestamp is stored in seconds, any tokens minted in
	     * the same second as the revocation will still be valid. If there is a chance that a token
	     * was minted in the last second, delay for 1 second before revoking.
	     *
	     * @param uid - The user whose tokens are to be revoked.
	     * @returns A promise that resolves when the operation completes
	     *     successfully with the user id of the corresponding user.
	     */
	    revokeRefreshTokens(uid) {
	        // Validate user UID.
	        if (!validator.isUid(uid)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_UID));
	        }
	        const request = {
	            localId: uid,
	            // validSince is in UTC seconds.
	            validSince: Math.floor(new Date().getTime() / 1000),
	        };
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_SET_ACCOUNT_INFO, request)
	            .then((response) => {
	            return response.localId;
	        });
	    }
	    /**
	     * Create a new user with the properties supplied.
	     *
	     * @param properties - The properties to set on the user.
	     * @returns A promise that resolves when the operation completes
	     *     with the user id that was created.
	     */
	    createNewAccount(properties) {
	        if (!validator.isNonNullObject(properties)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Properties argument must be a non-null object.'));
	        }
	        const request = (0, deep_copy_1.deepCopy)(properties);
	        // Rewrite photoURL to photoUrl.
	        if (typeof request.photoURL !== 'undefined') {
	            request.photoUrl = request.photoURL;
	            delete request.photoURL;
	        }
	        // Rewrite uid to localId if it exists.
	        if (typeof request.uid !== 'undefined') {
	            request.localId = request.uid;
	            delete request.uid;
	        }
	        // Construct mfa related user data.
	        if (validator.isNonNullObject(request.multiFactor)) {
	            if (validator.isNonEmptyArray(request.multiFactor.enrolledFactors)) {
	                const mfaInfo = [];
	                try {
	                    request.multiFactor.enrolledFactors.forEach((multiFactorInfo) => {
	                        // Enrollment time and uid are not allowed for signupNewUser endpoint.
	                        // They will automatically be provisioned server side.
	                        if ('enrollmentTime' in multiFactorInfo) {
	                            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"enrollmentTime" is not supported when adding second factors via "createUser()"');
	                        }
	                        else if ('uid' in multiFactorInfo) {
	                            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '"uid" is not supported when adding second factors via "createUser()"');
	                        }
	                        mfaInfo.push((0, user_import_builder_1.convertMultiFactorInfoToServerFormat)(multiFactorInfo));
	                    });
	                }
	                catch (e) {
	                    return Promise.reject(e);
	                }
	                request.mfaInfo = mfaInfo;
	            }
	            delete request.multiFactor;
	        }
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), exports.FIREBASE_AUTH_SIGN_UP_NEW_USER, request)
	            .then((response) => {
	            // Return the user id.
	            return response.localId;
	        });
	    }
	    /**
	     * Generates the out of band email action link for the email specified using the action code settings provided.
	     * Returns a promise that resolves with the generated link.
	     *
	     * @param requestType - The request type. This could be either used for password reset,
	     *     email verification, email link sign-in.
	     * @param email - The email of the user the link is being sent to.
	     * @param actionCodeSettings - The optional action code setings which defines whether
	     *     the link is to be handled by a mobile app and the additional state information to be passed in the
	     *     deep link, etc. Required when requestType === 'EMAIL_SIGNIN'
	     * @param newEmail - The email address the account is being updated to.
	     *     Required only for VERIFY_AND_CHANGE_EMAIL requests.
	     * @returns A promise that resolves with the email action link.
	     */
	    getEmailActionLink(requestType, email, actionCodeSettings, newEmail) {
	        let request = {
	            requestType,
	            email,
	            returnOobLink: true,
	            ...(typeof newEmail !== 'undefined') && { newEmail },
	        };
	        // ActionCodeSettings required for email link sign-in to determine the url where the sign-in will
	        // be completed.
	        if (typeof actionCodeSettings === 'undefined' && requestType === 'EMAIL_SIGNIN') {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "`actionCodeSettings` is required when `requestType` === 'EMAIL_SIGNIN'"));
	        }
	        if (typeof actionCodeSettings !== 'undefined' || requestType === 'EMAIL_SIGNIN') {
	            try {
	                const builder = new action_code_settings_builder_1.ActionCodeSettingsBuilder(actionCodeSettings);
	                request = (0, deep_copy_1.deepExtend)(request, builder.buildRequest());
	            }
	            catch (e) {
	                return Promise.reject(e);
	            }
	        }
	        if (requestType === 'VERIFY_AND_CHANGE_EMAIL' && typeof newEmail === 'undefined') {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "`newEmail` is required when `requestType` === 'VERIFY_AND_CHANGE_EMAIL'"));
	        }
	        return this.invokeRequestHandler(this.getAuthUrlBuilder(), FIREBASE_AUTH_GET_OOB_CODE, request)
	            .then((response) => {
	            // Return the link.
	            return response.oobLink;
	        });
	    }
	    /**
	     * Looks up an OIDC provider configuration by provider ID.
	     *
	     * @param providerId - The provider identifier of the configuration to lookup.
	     * @returns A promise that resolves with the provider configuration information.
	     */
	    getOAuthIdpConfig(providerId) {
	        if (!auth_config_1.OIDCConfig.isProviderId(providerId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID));
	        }
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), GET_OAUTH_IDP_CONFIG, {}, { providerId });
	    }
	    /**
	     * Lists the OIDC configurations (single batch only) with a size of maxResults and starting from
	     * the offset as specified by pageToken.
	     *
	     * @param maxResults - The page size, 100 if undefined. This is also the maximum
	     *     allowed limit.
	     * @param pageToken - The next page token. If not specified, returns OIDC configurations
	     *     without any offset. Configurations are returned in the order they were created from oldest to
	     *     newest, relative to the page token offset.
	     * @returns A promise that resolves with the current batch of downloaded
	     *     OIDC configurations and the next page token if available. For the last page, an empty list of provider
	     *     configuration and no page token are returned.
	     */
	    listOAuthIdpConfigs(maxResults = MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE, pageToken) {
	        const request = {
	            pageSize: maxResults,
	        };
	        // Add next page token if provided.
	        if (typeof pageToken !== 'undefined') {
	            request.pageToken = pageToken;
	        }
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), LIST_OAUTH_IDP_CONFIGS, request)
	            .then((response) => {
	            if (!response.oauthIdpConfigs) {
	                response.oauthIdpConfigs = [];
	                delete response.nextPageToken;
	            }
	            return response;
	        });
	    }
	    /**
	     * Deletes an OIDC configuration identified by a providerId.
	     *
	     * @param providerId - The identifier of the OIDC configuration to delete.
	     * @returns A promise that resolves when the OIDC provider is deleted.
	     */
	    deleteOAuthIdpConfig(providerId) {
	        if (!auth_config_1.OIDCConfig.isProviderId(providerId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID));
	        }
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), DELETE_OAUTH_IDP_CONFIG, {}, { providerId })
	            .then(() => {
	            // Return nothing.
	        });
	    }
	    /**
	     * Creates a new OIDC provider configuration with the properties provided.
	     *
	     * @param options - The properties to set on the new OIDC provider configuration to be created.
	     * @returns A promise that resolves with the newly created OIDC
	     *     configuration.
	     */
	    createOAuthIdpConfig(options) {
	        // Construct backend request.
	        let request;
	        try {
	            request = auth_config_1.OIDCConfig.buildServerRequest(options) || {};
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	        const providerId = options.providerId;
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), CREATE_OAUTH_IDP_CONFIG, request, { providerId })
	            .then((response) => {
	            if (!auth_config_1.OIDCConfig.getProviderIdFromResourceName(response.name)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new OIDC provider configuration');
	            }
	            return response;
	        });
	    }
	    /**
	     * Updates an existing OIDC provider configuration with the properties provided.
	     *
	     * @param providerId - The provider identifier of the OIDC configuration to update.
	     * @param options - The properties to update on the existing configuration.
	     * @returns A promise that resolves with the modified provider
	     *     configuration.
	     */
	    updateOAuthIdpConfig(providerId, options) {
	        if (!auth_config_1.OIDCConfig.isProviderId(providerId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID));
	        }
	        // Construct backend request.
	        let request;
	        try {
	            request = auth_config_1.OIDCConfig.buildServerRequest(options, true) || {};
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	        const updateMask = utils.generateUpdateMask(request);
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), UPDATE_OAUTH_IDP_CONFIG, request, { providerId, updateMask: updateMask.join(',') })
	            .then((response) => {
	            if (!auth_config_1.OIDCConfig.getProviderIdFromResourceName(response.name)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to update OIDC provider configuration');
	            }
	            return response;
	        });
	    }
	    /**
	     * Looks up an SAML provider configuration by provider ID.
	     *
	     * @param providerId - The provider identifier of the configuration to lookup.
	     * @returns A promise that resolves with the provider configuration information.
	     */
	    getInboundSamlConfig(providerId) {
	        if (!auth_config_1.SAMLConfig.isProviderId(providerId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID));
	        }
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), GET_INBOUND_SAML_CONFIG, {}, { providerId });
	    }
	    /**
	     * Lists the SAML configurations (single batch only) with a size of maxResults and starting from
	     * the offset as specified by pageToken.
	     *
	     * @param maxResults - The page size, 100 if undefined. This is also the maximum
	     *     allowed limit.
	     * @param pageToken - The next page token. If not specified, returns SAML configurations starting
	     *     without any offset. Configurations are returned in the order they were created from oldest to
	     *     newest, relative to the page token offset.
	     * @returns A promise that resolves with the current batch of downloaded
	     *     SAML configurations and the next page token if available. For the last page, an empty list of provider
	     *     configuration and no page token are returned.
	     */
	    listInboundSamlConfigs(maxResults = MAX_LIST_PROVIDER_CONFIGURATION_PAGE_SIZE, pageToken) {
	        const request = {
	            pageSize: maxResults,
	        };
	        // Add next page token if provided.
	        if (typeof pageToken !== 'undefined') {
	            request.pageToken = pageToken;
	        }
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), LIST_INBOUND_SAML_CONFIGS, request)
	            .then((response) => {
	            if (!response.inboundSamlConfigs) {
	                response.inboundSamlConfigs = [];
	                delete response.nextPageToken;
	            }
	            return response;
	        });
	    }
	    /**
	     * Deletes a SAML configuration identified by a providerId.
	     *
	     * @param providerId - The identifier of the SAML configuration to delete.
	     * @returns A promise that resolves when the SAML provider is deleted.
	     */
	    deleteInboundSamlConfig(providerId) {
	        if (!auth_config_1.SAMLConfig.isProviderId(providerId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID));
	        }
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), DELETE_INBOUND_SAML_CONFIG, {}, { providerId })
	            .then(() => {
	            // Return nothing.
	        });
	    }
	    /**
	     * Creates a new SAML provider configuration with the properties provided.
	     *
	     * @param options - The properties to set on the new SAML provider configuration to be created.
	     * @returns A promise that resolves with the newly created SAML
	     *     configuration.
	     */
	    createInboundSamlConfig(options) {
	        // Construct backend request.
	        let request;
	        try {
	            request = auth_config_1.SAMLConfig.buildServerRequest(options) || {};
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	        const providerId = options.providerId;
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), CREATE_INBOUND_SAML_CONFIG, request, { providerId })
	            .then((response) => {
	            if (!auth_config_1.SAMLConfig.getProviderIdFromResourceName(response.name)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new SAML provider configuration');
	            }
	            return response;
	        });
	    }
	    /**
	     * Updates an existing SAML provider configuration with the properties provided.
	     *
	     * @param providerId - The provider identifier of the SAML configuration to update.
	     * @param options - The properties to update on the existing configuration.
	     * @returns A promise that resolves with the modified provider
	     *     configuration.
	     */
	    updateInboundSamlConfig(providerId, options) {
	        if (!auth_config_1.SAMLConfig.isProviderId(providerId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PROVIDER_ID));
	        }
	        // Construct backend request.
	        let request;
	        try {
	            request = auth_config_1.SAMLConfig.buildServerRequest(options, true) || {};
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	        const updateMask = utils.generateUpdateMask(request);
	        return this.invokeRequestHandler(this.getProjectConfigUrlBuilder(), UPDATE_INBOUND_SAML_CONFIG, request, { providerId, updateMask: updateMask.join(',') })
	            .then((response) => {
	            if (!auth_config_1.SAMLConfig.getProviderIdFromResourceName(response.name)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to update SAML provider configuration');
	            }
	            return response;
	        });
	    }
	    /**
	     * Invokes the request handler based on the API settings object passed.
	     *
	     * @param urlBuilder - The URL builder for Auth endpoints.
	     * @param apiSettings - The API endpoint settings to apply to request and response.
	     * @param requestData - The request data.
	     * @param additionalResourceParams - Additional resource related params if needed.
	     * @returns A promise that resolves with the response.
	     */
	    invokeRequestHandler(urlBuilder, apiSettings, requestData, additionalResourceParams) {
	        return urlBuilder.getUrl(apiSettings.getEndpoint(), additionalResourceParams)
	            .then((url) => {
	            // Validate request.
	            if (requestData) {
	                const requestValidator = apiSettings.getRequestValidator();
	                requestValidator(requestData);
	            }
	            // Process request.
	            const req = {
	                method: apiSettings.getHttpMethod(),
	                url,
	                headers: FIREBASE_AUTH_HEADERS,
	                data: requestData,
	                timeout: FIREBASE_AUTH_TIMEOUT,
	            };
	            return this.httpClient.send(req);
	        })
	            .then((response) => {
	            // Validate response.
	            const responseValidator = apiSettings.getResponseValidator();
	            responseValidator(response.data);
	            // Return entire response.
	            return response.data;
	        })
	            .catch((err) => {
	            if (err instanceof api_request_1.RequestResponseError) {
	                const error = err.response.data;
	                const errorCode = AbstractAuthRequestHandler.getErrorCode(error);
	                if (!errorCode) {
	                    throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'Error returned from server: ' + error + '. Additionally, an ' +
	                        'internal error occurred while attempting to extract the ' +
	                        'errorcode from the error.');
	                }
	                throw error_1.FirebaseAuthError.fromServerError(errorCode, /* message */ undefined, error);
	            }
	            throw err;
	        });
	    }
	    /**
	     * @returns The current Auth user management resource URL builder.
	     */
	    getAuthUrlBuilder() {
	        if (!this.authUrlBuilder) {
	            this.authUrlBuilder = this.newAuthUrlBuilder();
	        }
	        return this.authUrlBuilder;
	    }
	    /**
	     * @returns The current project config resource URL builder.
	     */
	    getProjectConfigUrlBuilder() {
	        if (!this.projectConfigUrlBuilder) {
	            this.projectConfigUrlBuilder = this.newProjectConfigUrlBuilder();
	        }
	        return this.projectConfigUrlBuilder;
	    }
	}
	exports.AbstractAuthRequestHandler = AbstractAuthRequestHandler;
	/** Instantiates the getConfig endpoint settings. */
	const GET_PROJECT_CONFIG = new api_request_1.ApiSettings('/config', 'GET')
	    .setResponseValidator((response) => {
	    // Response should always contain at least the config name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to get project config');
	    }
	});
	/** Instantiates the updateConfig endpoint settings. */
	const UPDATE_PROJECT_CONFIG = new api_request_1.ApiSettings('/config?updateMask={updateMask}', 'PATCH')
	    .setResponseValidator((response) => {
	    // Response should always contain at least the config name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to update project config');
	    }
	});
	/** Instantiates the getTenant endpoint settings. */
	const GET_TENANT = new api_request_1.ApiSettings('/tenants/{tenantId}', 'GET')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain at least the tenant name.
	    if (!validator.isNonEmptyString(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to get tenant');
	    }
	});
	/** Instantiates the deleteTenant endpoint settings. */
	const DELETE_TENANT = new api_request_1.ApiSettings('/tenants/{tenantId}', 'DELETE');
	/** Instantiates the updateTenant endpoint settings. */
	const UPDATE_TENANT = new api_request_1.ApiSettings('/tenants/{tenantId}?updateMask={updateMask}', 'PATCH')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain at least the tenant name.
	    if (!validator.isNonEmptyString(response.name) ||
	        !tenant_1.Tenant.getTenantIdFromResourceName(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to update tenant');
	    }
	});
	/** Instantiates the listTenants endpoint settings. */
	const LIST_TENANTS = new api_request_1.ApiSettings('/tenants', 'GET')
	    // Set request validator.
	    .setRequestValidator((request) => {
	    // Validate next page token.
	    if (typeof request.pageToken !== 'undefined' &&
	        !validator.isNonEmptyString(request.pageToken)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_PAGE_TOKEN);
	    }
	    // Validate max results.
	    if (!validator.isNumber(request.pageSize) ||
	        request.pageSize <= 0 ||
	        request.pageSize > MAX_LIST_TENANT_PAGE_SIZE) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'Required "maxResults" must be a positive non-zero number that does not exceed ' +
	            `the allowed ${MAX_LIST_TENANT_PAGE_SIZE}.`);
	    }
	});
	/** Instantiates the createTenant endpoint settings. */
	const CREATE_TENANT = new api_request_1.ApiSettings('/tenants', 'POST')
	    // Set response validator.
	    .setResponseValidator((response) => {
	    // Response should always contain at least the tenant name.
	    if (!validator.isNonEmptyString(response.name) ||
	        !tenant_1.Tenant.getTenantIdFromResourceName(response.name)) {
	        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Unable to create new tenant');
	    }
	});
	/**
	 * Utility for sending requests to Auth server that are Auth instance related. This includes user, tenant,
	 * and project config management related APIs. This extends the BaseFirebaseAuthRequestHandler class and defines
	 * additional tenant management related APIs.
	 */
	class AuthRequestHandler extends AbstractAuthRequestHandler {
	    /**
	     * The FirebaseAuthRequestHandler constructor used to initialize an instance using a FirebaseApp.
	     *
	     * @param app - The app used to fetch access tokens to sign API requests.
	     * @constructor
	     */
	    constructor(app) {
	        super(app);
	        this.authResourceUrlBuilder = new AuthResourceUrlBuilder(app, 'v2');
	    }
	    /**
	     * @returns A new Auth user management resource URL builder instance.
	     */
	    newAuthUrlBuilder() {
	        return new AuthResourceUrlBuilder(this.app, 'v1');
	    }
	    /**
	     * @returns A new project config resource URL builder instance.
	     */
	    newProjectConfigUrlBuilder() {
	        return new AuthResourceUrlBuilder(this.app, 'v2');
	    }
	    /**
	     * Get the current project's config
	     * @returns A promise that resolves with the project config information.
	     */
	    getProjectConfig() {
	        return this.invokeRequestHandler(this.authResourceUrlBuilder, GET_PROJECT_CONFIG, {}, {})
	            .then((response) => {
	            return response;
	        });
	    }
	    /**
	     * Update the current project's config.
	     * @returns A promise that resolves with the project config information.
	     */
	    updateProjectConfig(options) {
	        try {
	            const request = project_config_1.ProjectConfig.buildServerRequest(options);
	            const updateMask = utils.generateUpdateMask(request);
	            return this.invokeRequestHandler(this.authResourceUrlBuilder, UPDATE_PROJECT_CONFIG, request, { updateMask: updateMask.join(',') })
	                .then((response) => {
	                return response;
	            });
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	    }
	    /**
	     * Looks up a tenant by tenant ID.
	     *
	     * @param tenantId - The tenant identifier of the tenant to lookup.
	     * @returns A promise that resolves with the tenant information.
	     */
	    getTenant(tenantId) {
	        if (!validator.isNonEmptyString(tenantId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TENANT_ID));
	        }
	        return this.invokeRequestHandler(this.authResourceUrlBuilder, GET_TENANT, {}, { tenantId })
	            .then((response) => {
	            return response;
	        });
	    }
	    /**
	     * Exports the tenants (single batch only) with a size of maxResults and starting from
	     * the offset as specified by pageToken.
	     *
	     * @param maxResults - The page size, 1000 if undefined. This is also the maximum
	     *     allowed limit.
	     * @param pageToken - The next page token. If not specified, returns tenants starting
	     *     without any offset. Tenants are returned in the order they were created from oldest to
	     *     newest, relative to the page token offset.
	     * @returns A promise that resolves with the current batch of downloaded
	     *     tenants and the next page token if available. For the last page, an empty list of tenants
	     *     and no page token are returned.
	     */
	    listTenants(maxResults = MAX_LIST_TENANT_PAGE_SIZE, pageToken) {
	        const request = {
	            pageSize: maxResults,
	            pageToken,
	        };
	        // Remove next page token if not provided.
	        if (typeof request.pageToken === 'undefined') {
	            delete request.pageToken;
	        }
	        return this.invokeRequestHandler(this.authResourceUrlBuilder, LIST_TENANTS, request)
	            .then((response) => {
	            if (!response.tenants) {
	                response.tenants = [];
	                delete response.nextPageToken;
	            }
	            return response;
	        });
	    }
	    /**
	     * Deletes a tenant identified by a tenantId.
	     *
	     * @param tenantId - The identifier of the tenant to delete.
	     * @returns A promise that resolves when the tenant is deleted.
	     */
	    deleteTenant(tenantId) {
	        if (!validator.isNonEmptyString(tenantId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TENANT_ID));
	        }
	        return this.invokeRequestHandler(this.authResourceUrlBuilder, DELETE_TENANT, undefined, { tenantId })
	            .then(() => {
	            // Return nothing.
	        });
	    }
	    /**
	     * Creates a new tenant with the properties provided.
	     *
	     * @param tenantOptions - The properties to set on the new tenant to be created.
	     * @returns A promise that resolves with the newly created tenant object.
	     */
	    createTenant(tenantOptions) {
	        try {
	            // Construct backend request.
	            const request = tenant_1.Tenant.buildServerRequest(tenantOptions, true);
	            return this.invokeRequestHandler(this.authResourceUrlBuilder, CREATE_TENANT, request)
	                .then((response) => {
	                return response;
	            });
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	    }
	    /**
	     * Updates an existing tenant with the properties provided.
	     *
	     * @param tenantId - The tenant identifier of the tenant to update.
	     * @param tenantOptions - The properties to update on the existing tenant.
	     * @returns A promise that resolves with the modified tenant object.
	     */
	    updateTenant(tenantId, tenantOptions) {
	        if (!validator.isNonEmptyString(tenantId)) {
	            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_TENANT_ID));
	        }
	        try {
	            // Construct backend request.
	            const request = tenant_1.Tenant.buildServerRequest(tenantOptions, false);
	            // Do not traverse deep into testPhoneNumbers. The entire content should be replaced
	            // and not just specific phone numbers.
	            const updateMask = utils.generateUpdateMask(request, ['testPhoneNumbers']);
	            return this.invokeRequestHandler(this.authResourceUrlBuilder, UPDATE_TENANT, request, { tenantId, updateMask: updateMask.join(',') })
	                .then((response) => {
	                return response;
	            });
	        }
	        catch (e) {
	            return Promise.reject(e);
	        }
	    }
	}
	exports.AuthRequestHandler = AuthRequestHandler;
	/**
	 * Utility for sending requests to Auth server that are tenant Auth instance related. This includes user
	 * management related APIs for specified tenants.
	 * This extends the BaseFirebaseAuthRequestHandler class.
	 */
	class TenantAwareAuthRequestHandler extends AbstractAuthRequestHandler {
	    /**
	     * The FirebaseTenantRequestHandler constructor used to initialize an instance using a
	     * FirebaseApp and a tenant ID.
	     *
	     * @param app - The app used to fetch access tokens to sign API requests.
	     * @param tenantId - The request handler's tenant ID.
	     * @constructor
	     */
	    constructor(app, tenantId) {
	        super(app);
	        this.tenantId = tenantId;
	    }
	    /**
	     * @returns A new Auth user management resource URL builder instance.
	     */
	    newAuthUrlBuilder() {
	        return new TenantAwareAuthResourceUrlBuilder(this.app, 'v1', this.tenantId);
	    }
	    /**
	     * @returns A new project config resource URL builder instance.
	     */
	    newProjectConfigUrlBuilder() {
	        return new TenantAwareAuthResourceUrlBuilder(this.app, 'v2', this.tenantId);
	    }
	    /**
	     * Imports the list of users provided to Firebase Auth. This is useful when
	     * migrating from an external authentication system without having to use the Firebase CLI SDK.
	     * At most, 1000 users are allowed to be imported one at a time.
	     * When importing a list of password users, UserImportOptions are required to be specified.
	     *
	     * Overrides the superclass methods by adding an additional check to match tenant IDs of
	     * imported user records if present.
	     *
	     * @param users - The list of user records to import to Firebase Auth.
	     * @param options - The user import options, required when the users provided
	     *     include password credentials.
	     * @returns A promise that resolves when the operation completes
	     *     with the result of the import. This includes the number of successful imports, the number
	     *     of failed uploads and their corresponding errors.
	     */
	    uploadAccount(users, options) {
	        // Add additional check to match tenant ID of imported user records.
	        users.forEach((user, index) => {
	            if (validator.isNonEmptyString(user.tenantId) &&
	                user.tenantId !== this.tenantId) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.MISMATCHING_TENANT_ID, `UserRecord of index "${index}" has mismatching tenant ID "${user.tenantId}"`);
	            }
	        });
	        return super.uploadAccount(users, options);
	    }
	}
	exports.TenantAwareAuthRequestHandler = TenantAwareAuthRequestHandler;
	function emulatorHost() {
	    return process.env.FIREBASE_AUTH_EMULATOR_HOST;
	}
	/**
	 * When true the SDK should communicate with the Auth Emulator for all API
	 * calls and also produce unsigned tokens.
	 */
	function useEmulator() {
	    return !!emulatorHost();
	} 
} (authApiRequest));

var tenantManager = {};

var baseAuth = {};

var tokenGenerator = {};

var cryptoSigner = {};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(cryptoSigner, "__esModule", { value: true });
cryptoSigner.CryptoSignerErrorCode = cryptoSigner.CryptoSignerError = cryptoSigner.IAMSigner = cryptoSigner.ServiceAccountSigner = void 0;
cryptoSigner.cryptoSignerFromApp = cryptoSignerFromApp;
const credential_internal_1 = credentialInternal;
const api_request_1$1 = apiRequest;
const utils$2 = utils$4;
const validator$3 = validator$b;
const ALGORITHM_RS256 = 'RS256';
/**
 * A CryptoSigner implementation that uses an explicitly specified service account private key to
 * sign data. Performs all operations locally, and does not make any RPC calls.
 */
class ServiceAccountSigner {
    /**
     * Creates a new CryptoSigner instance from the given service account credential.
     *
     * @param credential - A service account credential.
     */
    constructor(credential) {
        this.credential = credential;
        this.algorithm = ALGORITHM_RS256;
        if (!credential) {
            throw new CryptoSignerError({
                code: CryptoSignerErrorCode.INVALID_CREDENTIAL,
                message: 'INTERNAL ASSERT: Must provide a service account credential to initialize ServiceAccountSigner.',
            });
        }
    }
    /**
     * @inheritDoc
     */
    sign(buffer) {
        const crypto = require$$4$1; // eslint-disable-line @typescript-eslint/no-var-requires
        const sign = crypto.createSign('RSA-SHA256');
        sign.update(buffer);
        return Promise.resolve(sign.sign(this.credential.privateKey));
    }
    /**
     * @inheritDoc
     */
    getAccountId() {
        return Promise.resolve(this.credential.clientEmail);
    }
}
cryptoSigner.ServiceAccountSigner = ServiceAccountSigner;
/**
 * A CryptoSigner implementation that uses the remote IAM service to sign data. If initialized without
 * a service account ID, attempts to discover a service account ID by consulting the local Metadata
 * service. This will succeed in managed environments like Google Cloud Functions and App Engine.
 *
 * @see https://cloud.google.com/iam/reference/rest/v1/projects.serviceAccounts/signBlob
 * @see https://cloud.google.com/compute/docs/storing-retrieving-metadata
 */
class IAMSigner {
    constructor(httpClient, app) {
        this.algorithm = ALGORITHM_RS256;
        if (!httpClient) {
            throw new CryptoSignerError({
                code: CryptoSignerErrorCode.INVALID_ARGUMENT,
                message: 'INTERNAL ASSERT: Must provide a HTTP client to initialize IAMSigner.',
            });
        }
        if (app && (typeof app !== 'object' || app === null || !('options' in app))) {
            throw new CryptoSignerError({
                code: CryptoSignerErrorCode.INVALID_ARGUMENT,
                message: 'INTERNAL ASSERT: Must provide a valid Firebase app instance.',
            });
        }
        this.httpClient = httpClient;
        this.app = app;
    }
    /**
     * @inheritDoc
     */
    sign(buffer) {
        return this.getAccountId().then((serviceAccount) => {
            const request = {
                method: 'POST',
                url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${serviceAccount}:signBlob`,
                data: { payload: buffer.toString('base64') },
            };
            return this.httpClient.send(request);
        }).then((response) => {
            // Response from IAM is base64 encoded. Decode it into a buffer and return.
            return Buffer.from(response.data.signedBlob, 'base64');
        }).catch((err) => {
            if (err instanceof api_request_1$1.RequestResponseError) {
                throw new CryptoSignerError({
                    code: CryptoSignerErrorCode.SERVER_ERROR,
                    message: err.message,
                    cause: err
                });
            }
            throw err;
        });
    }
    /**
     * @inheritDoc
     */
    async getAccountId() {
        if (validator$3.isNonEmptyString(this.serviceAccountId)) {
            return this.serviceAccountId;
        }
        if (this.app) {
            const accountId = await utils$2.findServiceAccountEmail(this.app);
            if (accountId) {
                this.serviceAccountId = accountId;
                return accountId;
            }
        }
        const request = {
            method: 'GET',
            url: 'http://metadata/computeMetadata/v1/instance/service-accounts/default/email',
            headers: {
                'Metadata-Flavor': 'Google',
            },
        };
        const client = new api_request_1$1.HttpClient();
        return client.send(request).then((response) => {
            if (!response.text) {
                throw new CryptoSignerError({
                    code: CryptoSignerErrorCode.INTERNAL_ERROR,
                    message: 'HTTP Response missing payload',
                });
            }
            this.serviceAccountId = response.text;
            return response.text;
        }).catch((err) => {
            throw new CryptoSignerError({
                code: CryptoSignerErrorCode.INVALID_CREDENTIAL,
                message: 'Failed to determine service account. Make sure to initialize ' +
                    'the SDK with a service account credential. Alternatively specify a service ' +
                    `account with iam.serviceAccounts.signBlob permission. Original error: ${err}`,
            });
        });
    }
}
cryptoSigner.IAMSigner = IAMSigner;
/**
 * Creates a new CryptoSigner instance for the given app. If the app has been initialized with a
 * service account credential, creates a ServiceAccountSigner.
 *
 * @param app - A FirebaseApp instance.
 * @returns A CryptoSigner instance.
 */
function cryptoSignerFromApp(app) {
    const credential = app.options.credential;
    if (credential instanceof credential_internal_1.ServiceAccountCredential) {
        return new ServiceAccountSigner(credential);
    }
    return new IAMSigner(new api_request_1$1.AuthorizedHttpClient(app), app);
}
/**
 * CryptoSigner error code structure.
 *
 * @param errorInfo - The error information (code and message).
 * @constructor
 */
class CryptoSignerError extends Error {
    constructor(errorInfo) {
        super(errorInfo.message);
        this.errorInfo = errorInfo;
        /* tslint:disable:max-line-length */
        // Set the prototype explicitly. See the following link for more details:
        // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
        /* tslint:enable:max-line-length */
        this.__proto__ = CryptoSignerError.prototype;
    }
    /** @returns The error code. */
    get code() {
        return this.errorInfo.code;
    }
    /** @returns The error message. */
    get message() {
        return this.errorInfo.message;
    }
    /** @returns The error data. */
    get cause() {
        return this.errorInfo.cause;
    }
}
cryptoSigner.CryptoSignerError = CryptoSignerError;
/**
 * Crypto Signer error codes and their default messages.
 */
class CryptoSignerErrorCode {
}
cryptoSigner.CryptoSignerErrorCode = CryptoSignerErrorCode;
CryptoSignerErrorCode.INVALID_ARGUMENT = 'invalid-argument';
CryptoSignerErrorCode.INTERNAL_ERROR = 'internal-error';
CryptoSignerErrorCode.INVALID_CREDENTIAL = 'invalid-credential';
CryptoSignerErrorCode.SERVER_ERROR = 'server-error';

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * @license
	 * Copyright 2017 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FirebaseTokenGenerator = exports.EmulatedSigner = exports.BLACKLISTED_CLAIMS = void 0;
	exports.handleCryptoSignerError = handleCryptoSignerError;
	const error_1 = error;
	const crypto_signer_1 = cryptoSigner;
	const validator = validator$b;
	const utils_1 = utils$4;
	const ALGORITHM_NONE = 'none';
	const ONE_HOUR_IN_SECONDS = 60 * 60;
	// List of blacklisted claims which cannot be provided when creating a custom token
	exports.BLACKLISTED_CLAIMS = [
	    'acr', 'amr', 'at_hash', 'aud', 'auth_time', 'azp', 'cnf', 'c_hash', 'exp', 'iat', 'iss', 'jti',
	    'nbf', 'nonce',
	];
	// Audience to use for Firebase Auth Custom tokens
	const FIREBASE_AUDIENCE = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
	/**
	 * A CryptoSigner implementation that is used when communicating with the Auth emulator.
	 * It produces unsigned tokens.
	 */
	class EmulatedSigner {
	    constructor() {
	        this.algorithm = ALGORITHM_NONE;
	    }
	    /**
	     * @inheritDoc
	     */
	    // eslint-disable-next-line @typescript-eslint/no-unused-vars
	    sign(buffer) {
	        return Promise.resolve(Buffer.from(''));
	    }
	    /**
	     * @inheritDoc
	     */
	    getAccountId() {
	        return Promise.resolve('firebase-auth-emulator@example.com');
	    }
	}
	exports.EmulatedSigner = EmulatedSigner;
	/**
	 * Class for generating different types of Firebase Auth tokens (JWTs).
	 *
	 * @internal
	 */
	class FirebaseTokenGenerator {
	    /**
	     * @param tenantId - The tenant ID to use for the generated Firebase Auth
	     *     Custom token. If absent, then no tenant ID claim will be set in the
	     *     resulting JWT.
	     */
	    constructor(signer, tenantId) {
	        this.tenantId = tenantId;
	        if (!validator.isNonNullObject(signer)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CREDENTIAL, 'INTERNAL ASSERT: Must provide a CryptoSigner to use FirebaseTokenGenerator.');
	        }
	        if (typeof this.tenantId !== 'undefined' && !validator.isNonEmptyString(this.tenantId)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, '`tenantId` argument must be a non-empty string.');
	        }
	        this.signer = signer;
	    }
	    /**
	     * Creates a new Firebase Auth Custom token.
	     *
	     * @param uid - The user ID to use for the generated Firebase Auth Custom token.
	     * @param developerClaims - Optional developer claims to include in the generated Firebase
	     *     Auth Custom token.
	     * @returns A Promise fulfilled with a Firebase Auth Custom token signed with a
	     *     service account key and containing the provided payload.
	     */
	    createCustomToken(uid, developerClaims) {
	        let errorMessage;
	        if (!validator.isNonEmptyString(uid)) {
	            errorMessage = '`uid` argument must be a non-empty string uid.';
	        }
	        else if (uid.length > 128) {
	            errorMessage = '`uid` argument must a uid with less than or equal to 128 characters.';
	        }
	        else if (!this.isDeveloperClaimsValid_(developerClaims)) {
	            errorMessage = '`developerClaims` argument must be a valid, non-null object containing the developer claims.';
	        }
	        if (errorMessage) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage);
	        }
	        const claims = {};
	        if (typeof developerClaims !== 'undefined') {
	            for (const key in developerClaims) {
	                /* istanbul ignore else */
	                if (Object.prototype.hasOwnProperty.call(developerClaims, key)) {
	                    if (exports.BLACKLISTED_CLAIMS.indexOf(key) !== -1) {
	                        throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, `Developer claim "${key}" is reserved and cannot be specified.`);
	                    }
	                    claims[key] = developerClaims[key];
	                }
	            }
	        }
	        return this.signer.getAccountId().then((account) => {
	            const header = {
	                alg: this.signer.algorithm,
	                typ: 'JWT',
	            };
	            const iat = Math.floor(Date.now() / 1000);
	            const body = {
	                aud: FIREBASE_AUDIENCE,
	                iat,
	                exp: iat + ONE_HOUR_IN_SECONDS,
	                iss: account,
	                sub: account,
	                uid,
	            };
	            if (this.tenantId) {
	                body.tenant_id = this.tenantId;
	            }
	            if (Object.keys(claims).length > 0) {
	                body.claims = claims;
	            }
	            const token = `${this.encodeSegment(header)}.${this.encodeSegment(body)}`;
	            const signPromise = this.signer.sign(Buffer.from(token));
	            return Promise.all([token, signPromise]);
	        }).then(([token, signature]) => {
	            return `${token}.${this.encodeSegment(signature)}`;
	        }).catch((err) => {
	            throw handleCryptoSignerError(err);
	        });
	    }
	    encodeSegment(segment) {
	        const buffer = (segment instanceof Buffer) ? segment : Buffer.from(JSON.stringify(segment));
	        return (0, utils_1.toWebSafeBase64)(buffer).replace(/=+$/, '');
	    }
	    /**
	     * Returns whether or not the provided developer claims are valid.
	     *
	     * @param developerClaims - Optional developer claims to validate.
	     * @returns True if the provided claims are valid; otherwise, false.
	     */
	    // eslint-disable-next-line @typescript-eslint/naming-convention
	    isDeveloperClaimsValid_(developerClaims) {
	        if (typeof developerClaims === 'undefined') {
	            return true;
	        }
	        return validator.isNonNullObject(developerClaims);
	    }
	}
	exports.FirebaseTokenGenerator = FirebaseTokenGenerator;
	/**
	 * Creates a new FirebaseAuthError by extracting the error code, message and other relevant
	 * details from a CryptoSignerError.
	 *
	 * @param err - The Error to convert into a FirebaseAuthError error
	 * @returns A Firebase Auth error that can be returned to the user.
	 */
	function handleCryptoSignerError(err) {
	    if (!(err instanceof crypto_signer_1.CryptoSignerError)) {
	        return err;
	    }
	    if (err.code === crypto_signer_1.CryptoSignerErrorCode.SERVER_ERROR && validator.isNonNullObject(err.cause)) {
	        const httpError = err.cause;
	        const errorResponse = httpError.response.data;
	        if (validator.isNonNullObject(errorResponse) && errorResponse.error) {
	            const errorCode = errorResponse.error.status;
	            const description = 'Please refer to https://firebase.google.com/docs/auth/admin/create-custom-tokens ' +
	                'for more details on how to use and troubleshoot this feature.';
	            const errorMsg = `${errorResponse.error.message}; ${description}`;
	            return error_1.FirebaseAuthError.fromServerError(errorCode, errorMsg, errorResponse);
	        }
	        return new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, 'Error returned from server: ' + errorResponse + '. Additionally, an ' +
	            'internal error occurred while attempting to extract the ' +
	            'errorcode from the error.');
	    }
	    return new error_1.FirebaseAuthError(mapToAuthClientErrorCode(err.code), err.message);
	}
	function mapToAuthClientErrorCode(code) {
	    switch (code) {
	        case crypto_signer_1.CryptoSignerErrorCode.INVALID_CREDENTIAL:
	            return error_1.AuthClientErrorCode.INVALID_CREDENTIAL;
	        case crypto_signer_1.CryptoSignerErrorCode.INVALID_ARGUMENT:
	            return error_1.AuthClientErrorCode.INVALID_ARGUMENT;
	        default:
	            return error_1.AuthClientErrorCode.INTERNAL_ERROR;
	    }
	} 
} (tokenGenerator));

var tokenVerifier = {};

var jwt = {};

const require$$1$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(jsonwebtoken);

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(jwksRsa);

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * Copyright 2021 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.JwtErrorCode = exports.JwtError = exports.EmulatorSignatureVerifier = exports.PublicKeySignatureVerifier = exports.UrlKeyFetcher = exports.JwksFetcher = exports.ALGORITHM_ES256 = exports.ALGORITHM_RS256 = void 0;
	exports.verifyJwtSignature = verifyJwtSignature;
	exports.decodeJwt = decodeJwt;
	const validator = validator$b;
	const jwt = require$$1$1;
	const jwks = require$$2;
	const api_request_1 = apiRequest;
	exports.ALGORITHM_RS256 = 'RS256';
	exports.ALGORITHM_ES256 = 'ES256';
	// `jsonwebtoken` converts errors from the `getKey` callback to its own `JsonWebTokenError` type
	// and prefixes the error message with the following. Use the prefix to identify errors thrown
	// from the key provider callback.
	// https://github.com/auth0/node-jsonwebtoken/blob/d71e383862fc735991fd2e759181480f066bf138/verify.js#L96
	const JWT_CALLBACK_ERROR_PREFIX = 'error in secret or public key callback: ';
	const NO_MATCHING_KID_ERROR_MESSAGE = 'no-matching-kid-error';
	const NO_KID_IN_HEADER_ERROR_MESSAGE = 'no-kid-in-header-error';
	const HOUR_IN_SECONDS = 3600;
	class JwksFetcher {
	    constructor(jwksUrl, httpAgent) {
	        this.publicKeysExpireAt = 0;
	        if (!validator.isURL(jwksUrl)) {
	            throw new Error('The provided JWKS URL is not a valid URL.');
	        }
	        this.client = jwks({
	            jwksUri: jwksUrl,
	            cache: false, // disable jwks-rsa LRU cache as the keys are always cached for 6 hours.
	            requestAgent: httpAgent,
	        });
	    }
	    fetchPublicKeys() {
	        if (this.shouldRefresh()) {
	            return this.refresh();
	        }
	        return Promise.resolve(this.publicKeys);
	    }
	    shouldRefresh() {
	        return !this.publicKeys || this.publicKeysExpireAt <= Date.now();
	    }
	    refresh() {
	        return this.client.getSigningKeys()
	            .then((signingKeys) => {
	            // reset expire at from previous set of keys.
	            this.publicKeysExpireAt = 0;
	            const newKeys = signingKeys.reduce((map, signingKey) => {
	                map[signingKey.kid] = signingKey.getPublicKey();
	                return map;
	            }, {});
	            this.publicKeysExpireAt = Date.now() + (HOUR_IN_SECONDS * 6 * 1000);
	            this.publicKeys = newKeys;
	            return newKeys;
	        }).catch((err) => {
	            throw new Error(`Error fetching Json Web Keys: ${err.message}`);
	        });
	    }
	}
	exports.JwksFetcher = JwksFetcher;
	/**
	 * Class to fetch public keys from a client certificates URL.
	 */
	class UrlKeyFetcher {
	    constructor(clientCertUrl, httpAgent) {
	        this.clientCertUrl = clientCertUrl;
	        this.httpAgent = httpAgent;
	        this.publicKeysExpireAt = 0;
	        if (!validator.isURL(clientCertUrl)) {
	            throw new Error('The provided public client certificate URL is not a valid URL.');
	        }
	    }
	    /**
	     * Fetches the public keys for the Google certs.
	     *
	     * @returns A promise fulfilled with public keys for the Google certs.
	     */
	    fetchPublicKeys() {
	        if (this.shouldRefresh()) {
	            return this.refresh();
	        }
	        return Promise.resolve(this.publicKeys);
	    }
	    /**
	     * Checks if the cached public keys need to be refreshed.
	     *
	     * @returns Whether the keys should be fetched from the client certs url or not.
	     */
	    shouldRefresh() {
	        return !this.publicKeys || this.publicKeysExpireAt <= Date.now();
	    }
	    refresh() {
	        const client = new api_request_1.HttpClient();
	        const request = {
	            method: 'GET',
	            url: this.clientCertUrl,
	            httpAgent: this.httpAgent,
	        };
	        return client.send(request).then((resp) => {
	            if (!resp.isJson() || resp.data.error) {
	                // Treat all non-json messages and messages with an 'error' field as
	                // error responses.
	                throw new api_request_1.RequestResponseError(resp);
	            }
	            // reset expire at from previous set of keys.
	            this.publicKeysExpireAt = 0;
	            if (Object.prototype.hasOwnProperty.call(resp.headers, 'cache-control')) {
	                const cacheControlHeader = resp.headers['cache-control'];
	                const parts = cacheControlHeader.split(',');
	                parts.forEach((part) => {
	                    const subParts = part.trim().split('=');
	                    if (subParts[0] === 'max-age') {
	                        const maxAge = +subParts[1];
	                        this.publicKeysExpireAt = Date.now() + (maxAge * 1000);
	                    }
	                });
	            }
	            this.publicKeys = resp.data;
	            return resp.data;
	        }).catch((err) => {
	            if (err instanceof api_request_1.RequestResponseError) {
	                let errorMessage = 'Error fetching public keys for Google certs: ';
	                const resp = err.response;
	                if (resp.isJson() && resp.data.error) {
	                    errorMessage += `${resp.data.error}`;
	                    if (resp.data.error_description) {
	                        errorMessage += ' (' + resp.data.error_description + ')';
	                    }
	                }
	                else {
	                    errorMessage += `${resp.text}`;
	                }
	                throw new Error(errorMessage);
	            }
	            throw err;
	        });
	    }
	}
	exports.UrlKeyFetcher = UrlKeyFetcher;
	/**
	 * Class for verifying JWT signature with a public key.
	 */
	class PublicKeySignatureVerifier {
	    constructor(keyFetcher) {
	        this.keyFetcher = keyFetcher;
	        if (!validator.isNonNullObject(keyFetcher)) {
	            throw new Error('The provided key fetcher is not an object or null.');
	        }
	    }
	    static withCertificateUrl(clientCertUrl, httpAgent) {
	        return new PublicKeySignatureVerifier(new UrlKeyFetcher(clientCertUrl, httpAgent));
	    }
	    static withJwksUrl(jwksUrl, httpAgent) {
	        return new PublicKeySignatureVerifier(new JwksFetcher(jwksUrl, httpAgent));
	    }
	    verify(token) {
	        if (!validator.isString(token)) {
	            return Promise.reject(new JwtError(JwtErrorCode.INVALID_ARGUMENT, 'The provided token must be a string.'));
	        }
	        return verifyJwtSignature(token, getKeyCallback(this.keyFetcher), { algorithms: [exports.ALGORITHM_RS256, exports.ALGORITHM_ES256] })
	            .catch((error) => {
	            if (error.code === JwtErrorCode.NO_KID_IN_HEADER) {
	                // No kid in JWT header. Try with all the public keys.
	                return this.verifyWithoutKid(token);
	            }
	            throw error;
	        });
	    }
	    verifyWithoutKid(token) {
	        return this.keyFetcher.fetchPublicKeys()
	            .then(publicKeys => this.verifyWithAllKeys(token, publicKeys));
	    }
	    verifyWithAllKeys(token, keys) {
	        const promises = [];
	        Object.values(keys).forEach((key) => {
	            const result = verifyJwtSignature(token, key)
	                .then(() => true)
	                .catch((error) => {
	                if (error.code === JwtErrorCode.TOKEN_EXPIRED) {
	                    throw error;
	                }
	                return false;
	            });
	            promises.push(result);
	        });
	        return Promise.all(promises)
	            .then((result) => {
	            if (result.every((r) => r === false)) {
	                throw new JwtError(JwtErrorCode.INVALID_SIGNATURE, 'Invalid token signature.');
	            }
	        });
	    }
	}
	exports.PublicKeySignatureVerifier = PublicKeySignatureVerifier;
	/**
	 * Class for verifying unsigned (emulator) JWTs.
	 */
	class EmulatorSignatureVerifier {
	    verify(token) {
	        // Signature checks skipped for emulator; no need to fetch public keys.
	        return verifyJwtSignature(token, undefined, { algorithms: ['none'] });
	    }
	}
	exports.EmulatorSignatureVerifier = EmulatorSignatureVerifier;
	/**
	 * Provides a callback to fetch public keys.
	 *
	 * @param fetcher - KeyFetcher to fetch the keys from.
	 * @returns A callback function that can be used to get keys in `jsonwebtoken`.
	 */
	function getKeyCallback(fetcher) {
	    return (header, callback) => {
	        if (!header.kid) {
	            callback(new Error(NO_KID_IN_HEADER_ERROR_MESSAGE));
	        }
	        const kid = header.kid || '';
	        fetcher.fetchPublicKeys().then((publicKeys) => {
	            if (!Object.prototype.hasOwnProperty.call(publicKeys, kid)) {
	                callback(new Error(NO_MATCHING_KID_ERROR_MESSAGE));
	            }
	            else {
	                callback(null, publicKeys[kid]);
	            }
	        })
	            .catch(error => {
	            callback(error);
	        });
	    };
	}
	/**
	 * Verifies the signature of a JWT using the provided secret or a function to fetch
	 * the secret or public key.
	 *
	 * @param token - The JWT to be verified.
	 * @param secretOrPublicKey - The secret or a function to fetch the secret or public key.
	 * @param options - JWT verification options.
	 * @returns A Promise resolving for a token with a valid signature.
	 */
	function verifyJwtSignature(token, secretOrPublicKey, options) {
	    if (!validator.isString(token)) {
	        return Promise.reject(new JwtError(JwtErrorCode.INVALID_ARGUMENT, 'The provided token must be a string.'));
	    }
	    return new Promise((resolve, reject) => {
	        jwt.verify(token, secretOrPublicKey, options, (error) => {
	            if (!error) {
	                return resolve();
	            }
	            if (error.name === 'TokenExpiredError') {
	                return reject(new JwtError(JwtErrorCode.TOKEN_EXPIRED, 'The provided token has expired. Get a fresh token from your ' +
	                    'client app and try again.'));
	            }
	            else if (error.name === 'JsonWebTokenError') {
	                if (error.message && error.message.includes(JWT_CALLBACK_ERROR_PREFIX)) {
	                    const message = error.message.split(JWT_CALLBACK_ERROR_PREFIX).pop() || 'Error fetching public keys.';
	                    let code = JwtErrorCode.KEY_FETCH_ERROR;
	                    if (message === NO_MATCHING_KID_ERROR_MESSAGE) {
	                        code = JwtErrorCode.NO_MATCHING_KID;
	                    }
	                    else if (message === NO_KID_IN_HEADER_ERROR_MESSAGE) {
	                        code = JwtErrorCode.NO_KID_IN_HEADER;
	                    }
	                    return reject(new JwtError(code, message));
	                }
	            }
	            return reject(new JwtError(JwtErrorCode.INVALID_SIGNATURE, error.message));
	        });
	    });
	}
	/**
	 * Decodes general purpose Firebase JWTs.
	 *
	 * @param jwtToken - JWT token to be decoded.
	 * @returns Decoded token containing the header and payload.
	 */
	function decodeJwt(jwtToken) {
	    if (!validator.isString(jwtToken)) {
	        return Promise.reject(new JwtError(JwtErrorCode.INVALID_ARGUMENT, 'The provided token must be a string.'));
	    }
	    const fullDecodedToken = jwt.decode(jwtToken, {
	        complete: true,
	    });
	    if (!fullDecodedToken) {
	        return Promise.reject(new JwtError(JwtErrorCode.INVALID_ARGUMENT, 'Decoding token failed.'));
	    }
	    const header = fullDecodedToken?.header;
	    const payload = fullDecodedToken?.payload;
	    return Promise.resolve({ header, payload });
	}
	/**
	 * Jwt error code structure.
	 *
	 * @param code - The error code.
	 * @param message - The error message.
	 * @constructor
	 */
	class JwtError extends Error {
	    constructor(code, message) {
	        super(message);
	        this.code = code;
	        this.message = message;
	        this.__proto__ = JwtError.prototype;
	    }
	}
	exports.JwtError = JwtError;
	/**
	 * JWT error codes.
	 */
	var JwtErrorCode;
	(function (JwtErrorCode) {
	    JwtErrorCode["INVALID_ARGUMENT"] = "invalid-argument";
	    JwtErrorCode["INVALID_CREDENTIAL"] = "invalid-credential";
	    JwtErrorCode["TOKEN_EXPIRED"] = "token-expired";
	    JwtErrorCode["INVALID_SIGNATURE"] = "invalid-token";
	    JwtErrorCode["NO_MATCHING_KID"] = "no-matching-kid-error";
	    JwtErrorCode["NO_KID_IN_HEADER"] = "no-kid-error";
	    JwtErrorCode["KEY_FETCH_ERROR"] = "key-fetch-error";
	})(JwtErrorCode || (exports.JwtErrorCode = JwtErrorCode = {})); 
} (jwt));

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * Copyright 2018 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FirebaseTokenVerifier = exports.SESSION_COOKIE_INFO = exports.AUTH_BLOCKING_TOKEN_INFO = exports.ID_TOKEN_INFO = void 0;
	exports.createIdTokenVerifier = createIdTokenVerifier;
	exports.createAuthBlockingTokenVerifier = createAuthBlockingTokenVerifier;
	exports.createSessionCookieVerifier = createSessionCookieVerifier;
	const error_1 = error;
	const util = utils$4;
	const validator = validator$b;
	const jwt_1 = jwt;
	// Audience to use for Firebase Auth Custom tokens
	const FIREBASE_AUDIENCE = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
	// URL containing the public keys for the Google certs (whose private keys are used to sign Firebase
	// Auth ID tokens)
	const CLIENT_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
	// URL containing the public keys for Firebase session cookies. This will be updated to a different URL soon.
	const SESSION_COOKIE_CERT_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys';
	const EMULATOR_VERIFIER = new jwt_1.EmulatorSignatureVerifier();
	/**
	 * User facing token information related to the Firebase ID token.
	 *
	 * @internal
	 */
	exports.ID_TOKEN_INFO = {
	    url: 'https://firebase.google.com/docs/auth/admin/verify-id-tokens',
	    verifyApiName: 'verifyIdToken()',
	    jwtName: 'Firebase ID token',
	    shortName: 'ID token',
	    expiredErrorCode: error_1.AuthClientErrorCode.ID_TOKEN_EXPIRED,
	};
	/**
	 * User facing token information related to the Firebase Auth Blocking token.
	 *
	 * @internal
	 */
	exports.AUTH_BLOCKING_TOKEN_INFO = {
	    url: 'https://cloud.google.com/identity-platform/docs/blocking-functions',
	    verifyApiName: '_verifyAuthBlockingToken()',
	    jwtName: 'Firebase Auth Blocking token',
	    shortName: 'Auth Blocking token',
	    expiredErrorCode: error_1.AuthClientErrorCode.AUTH_BLOCKING_TOKEN_EXPIRED,
	};
	/**
	 * User facing token information related to the Firebase session cookie.
	 *
	 * @internal
	 */
	exports.SESSION_COOKIE_INFO = {
	    url: 'https://firebase.google.com/docs/auth/admin/manage-cookies',
	    verifyApiName: 'verifySessionCookie()',
	    jwtName: 'Firebase session cookie',
	    shortName: 'session cookie',
	    expiredErrorCode: error_1.AuthClientErrorCode.SESSION_COOKIE_EXPIRED,
	};
	/**
	 * Class for verifying general purpose Firebase JWTs. This verifies ID tokens and session cookies.
	 *
	 * @internal
	 */
	class FirebaseTokenVerifier {
	    constructor(clientCertUrl, issuer, tokenInfo, app) {
	        this.issuer = issuer;
	        this.tokenInfo = tokenInfo;
	        this.app = app;
	        if (!validator.isURL(clientCertUrl)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The provided public client certificate URL is an invalid URL.');
	        }
	        else if (!validator.isURL(issuer)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The provided JWT issuer is an invalid URL.');
	        }
	        else if (!validator.isNonNullObject(tokenInfo)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The provided JWT information is not an object or null.');
	        }
	        else if (!validator.isURL(tokenInfo.url)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The provided JWT verification documentation URL is invalid.');
	        }
	        else if (!validator.isNonEmptyString(tokenInfo.verifyApiName)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The JWT verify API name must be a non-empty string.');
	        }
	        else if (!validator.isNonEmptyString(tokenInfo.jwtName)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The JWT public full name must be a non-empty string.');
	        }
	        else if (!validator.isNonEmptyString(tokenInfo.shortName)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The JWT public short name must be a non-empty string.');
	        }
	        else if (!validator.isNonNullObject(tokenInfo.expiredErrorCode) || !('code' in tokenInfo.expiredErrorCode)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, 'The JWT expiration error code must be a non-null ErrorInfo object.');
	        }
	        this.shortNameArticle = tokenInfo.shortName.charAt(0).match(/[aeiou]/i) ? 'an' : 'a';
	        this.signatureVerifier =
	            jwt_1.PublicKeySignatureVerifier.withCertificateUrl(clientCertUrl, app.options.httpAgent);
	        // For backward compatibility, the project ID is validated in the verification call.
	    }
	    /**
	     * Verifies the format and signature of a Firebase Auth JWT token.
	     *
	     * @param jwtToken - The Firebase Auth JWT token to verify.
	     * @param isEmulator - Whether to accept Auth Emulator tokens.
	     * @returns A promise fulfilled with the decoded claims of the Firebase Auth ID token.
	     */
	    verifyJWT(jwtToken, isEmulator = false) {
	        if (!validator.isString(jwtToken)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, `First argument to ${this.tokenInfo.verifyApiName} must be a ${this.tokenInfo.jwtName} string.`);
	        }
	        return this.ensureProjectId()
	            .then((projectId) => {
	            return this.decodeAndVerify(jwtToken, projectId, isEmulator);
	        })
	            .then((decoded) => {
	            const decodedIdToken = decoded.payload;
	            decodedIdToken.uid = decodedIdToken.sub;
	            return decodedIdToken;
	        });
	    }
	    /** @alpha */
	    // eslint-disable-next-line @typescript-eslint/naming-convention
	    _verifyAuthBlockingToken(jwtToken, isEmulator, audience) {
	        if (!validator.isString(jwtToken)) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, `First argument to ${this.tokenInfo.verifyApiName} must be a ${this.tokenInfo.jwtName} string.`);
	        }
	        return this.ensureProjectId()
	            .then((projectId) => {
	            if (typeof audience === 'undefined') {
	                audience = `${projectId}.cloudfunctions.net/`;
	            }
	            return this.decodeAndVerify(jwtToken, projectId, isEmulator, audience);
	        })
	            .then((decoded) => {
	            const decodedAuthBlockingToken = decoded.payload;
	            decodedAuthBlockingToken.uid = decodedAuthBlockingToken.sub;
	            return decodedAuthBlockingToken;
	        });
	    }
	    ensureProjectId() {
	        return util.findProjectId(this.app)
	            .then((projectId) => {
	            if (!validator.isNonEmptyString(projectId)) {
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CREDENTIAL, 'Must initialize app with a cert credential or set your Firebase project ID as the ' +
	                    `GOOGLE_CLOUD_PROJECT environment variable to call ${this.tokenInfo.verifyApiName}.`);
	            }
	            return Promise.resolve(projectId);
	        });
	    }
	    decodeAndVerify(token, projectId, isEmulator, audience) {
	        return this.safeDecode(token)
	            .then((decodedToken) => {
	            this.verifyContent(decodedToken, projectId, isEmulator, audience);
	            return this.verifySignature(token, isEmulator)
	                .then(() => decodedToken);
	        });
	    }
	    safeDecode(jwtToken) {
	        return (0, jwt_1.decodeJwt)(jwtToken)
	            .catch((err) => {
	            if (err.code === jwt_1.JwtErrorCode.INVALID_ARGUMENT) {
	                const verifyJwtTokenDocsMessage = ` See ${this.tokenInfo.url} ` +
	                    `for details on how to retrieve ${this.shortNameArticle} ${this.tokenInfo.shortName}.`;
	                const errorMessage = `Decoding ${this.tokenInfo.jwtName} failed. Make sure you passed ` +
	                    `the entire string JWT which represents ${this.shortNameArticle} ` +
	                    `${this.tokenInfo.shortName}.` + verifyJwtTokenDocsMessage;
	                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage);
	            }
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, err.message);
	        });
	    }
	    /**
	     * Verifies the content of a Firebase Auth JWT.
	     *
	     * @param fullDecodedToken - The decoded JWT.
	     * @param projectId - The Firebase Project Id.
	     * @param isEmulator - Whether the token is an Emulator token.
	     */
	    verifyContent(fullDecodedToken, projectId, isEmulator, audience) {
	        const header = fullDecodedToken && fullDecodedToken.header;
	        const payload = fullDecodedToken && fullDecodedToken.payload;
	        const projectIdMatchMessage = ` Make sure the ${this.tokenInfo.shortName} comes from the same ` +
	            'Firebase project as the service account used to authenticate this SDK.';
	        const verifyJwtTokenDocsMessage = ` See ${this.tokenInfo.url} ` +
	            `for details on how to retrieve ${this.shortNameArticle} ${this.tokenInfo.shortName}.`;
	        let errorMessage;
	        if (!isEmulator && typeof header.kid === 'undefined') {
	            const isCustomToken = (payload.aud === FIREBASE_AUDIENCE);
	            const isLegacyCustomToken = (header.alg === 'HS256' && payload.v === 0 && 'd' in payload && 'uid' in payload.d);
	            if (isCustomToken) {
	                errorMessage = `${this.tokenInfo.verifyApiName} expects ${this.shortNameArticle} ` +
	                    `${this.tokenInfo.shortName}, but was given a custom token.`;
	            }
	            else if (isLegacyCustomToken) {
	                errorMessage = `${this.tokenInfo.verifyApiName} expects ${this.shortNameArticle} ` +
	                    `${this.tokenInfo.shortName}, but was given a legacy custom token.`;
	            }
	            else {
	                errorMessage = `${this.tokenInfo.jwtName} has no "kid" claim.`;
	            }
	            errorMessage += verifyJwtTokenDocsMessage;
	        }
	        else if (!isEmulator && header.alg !== jwt_1.ALGORITHM_RS256) {
	            errorMessage = `${this.tokenInfo.jwtName} has incorrect algorithm. Expected "` + jwt_1.ALGORITHM_RS256 + '" but got ' +
	                '"' + header.alg + '".' + verifyJwtTokenDocsMessage;
	        }
	        else if (typeof audience !== 'undefined' && !payload.aud.includes(audience)) {
	            errorMessage = `${this.tokenInfo.jwtName} has incorrect "aud" (audience) claim. Expected "` +
	                audience + '" but got "' + payload.aud + '".' + verifyJwtTokenDocsMessage;
	        }
	        else if (typeof audience === 'undefined' && payload.aud !== projectId) {
	            errorMessage = `${this.tokenInfo.jwtName} has incorrect "aud" (audience) claim. Expected "` +
	                projectId + '" but got "' + payload.aud + '".' + projectIdMatchMessage +
	                verifyJwtTokenDocsMessage;
	        }
	        else if (payload.iss !== this.issuer + projectId) {
	            errorMessage = `${this.tokenInfo.jwtName} has incorrect "iss" (issuer) claim. Expected ` +
	                `"${this.issuer}` + projectId + '" but got "' +
	                payload.iss + '".' + projectIdMatchMessage + verifyJwtTokenDocsMessage;
	        }
	        else if (!(payload.event_type !== undefined &&
	            (payload.event_type === 'beforeSendSms' || payload.event_type === 'beforeSendEmail'))) {
	            // excluding `beforeSendSms` and `beforeSendEmail` from processing `sub` as there is no user record available.
	            // `sub` is the same as `uid` which is part of the user record.
	            if (typeof payload.sub !== 'string') {
	                errorMessage = `${this.tokenInfo.jwtName} has no "sub" (subject) claim.` + verifyJwtTokenDocsMessage;
	            }
	            else if (payload.sub === '') {
	                errorMessage = `${this.tokenInfo.jwtName} has an empty "sub" (subject) claim.` +
	                    verifyJwtTokenDocsMessage;
	            }
	            else if (payload.sub.length > 128) {
	                errorMessage = `${this.tokenInfo.jwtName} has a "sub" (subject) claim longer than 128 characters.` +
	                    verifyJwtTokenDocsMessage;
	            }
	        }
	        if (errorMessage) {
	            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage);
	        }
	    }
	    verifySignature(jwtToken, isEmulator) {
	        const verifier = isEmulator ? EMULATOR_VERIFIER : this.signatureVerifier;
	        return verifier.verify(jwtToken)
	            .catch((error) => {
	            throw this.mapJwtErrorToAuthError(error);
	        });
	    }
	    /**
	     * Maps JwtError to FirebaseAuthError
	     *
	     * @param error - JwtError to be mapped.
	     * @returns FirebaseAuthError or Error instance.
	     */
	    mapJwtErrorToAuthError(error) {
	        const verifyJwtTokenDocsMessage = ` See ${this.tokenInfo.url} ` +
	            `for details on how to retrieve ${this.shortNameArticle} ${this.tokenInfo.shortName}.`;
	        if (error.code === jwt_1.JwtErrorCode.TOKEN_EXPIRED) {
	            const errorMessage = `${this.tokenInfo.jwtName} has expired. Get a fresh ${this.tokenInfo.shortName}` +
	                ` from your client app and try again (auth/${this.tokenInfo.expiredErrorCode.code}).` +
	                verifyJwtTokenDocsMessage;
	            return new error_1.FirebaseAuthError(this.tokenInfo.expiredErrorCode, errorMessage);
	        }
	        else if (error.code === jwt_1.JwtErrorCode.INVALID_SIGNATURE) {
	            const errorMessage = `${this.tokenInfo.jwtName} has invalid signature.` + verifyJwtTokenDocsMessage;
	            return new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage);
	        }
	        else if (error.code === jwt_1.JwtErrorCode.NO_MATCHING_KID) {
	            const errorMessage = `${this.tokenInfo.jwtName} has "kid" claim which does not ` +
	                `correspond to a known public key. Most likely the ${this.tokenInfo.shortName} ` +
	                'is expired, so get a fresh token from your client app and try again.';
	            return new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage);
	        }
	        return new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, error.message);
	    }
	}
	exports.FirebaseTokenVerifier = FirebaseTokenVerifier;
	/**
	 * Creates a new FirebaseTokenVerifier to verify Firebase ID tokens.
	 *
	 * @internal
	 * @param app - Firebase app instance.
	 * @returns FirebaseTokenVerifier
	 */
	function createIdTokenVerifier(app) {
	    return new FirebaseTokenVerifier(CLIENT_CERT_URL, 'https://securetoken.google.com/', exports.ID_TOKEN_INFO, app);
	}
	/**
	 * Creates a new FirebaseTokenVerifier to verify Firebase Auth Blocking tokens.
	 *
	 * @internal
	 * @param app - Firebase app instance.
	 * @returns FirebaseTokenVerifier
	 */
	function createAuthBlockingTokenVerifier(app) {
	    return new FirebaseTokenVerifier(CLIENT_CERT_URL, 'https://securetoken.google.com/', exports.AUTH_BLOCKING_TOKEN_INFO, app);
	}
	/**
	 * Creates a new FirebaseTokenVerifier to verify Firebase session cookies.
	 *
	 * @internal
	 * @param app - Firebase app instance.
	 * @returns FirebaseTokenVerifier
	 */
	function createSessionCookieVerifier(app) {
	    return new FirebaseTokenVerifier(SESSION_COOKIE_CERT_URL, 'https://session.firebase.google.com/', exports.SESSION_COOKIE_INFO, app);
	} 
} (tokenVerifier));

var userRecord = {};

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(userRecord, "__esModule", { value: true });
userRecord.UserRecord = userRecord.UserInfo = userRecord.UserMetadata = userRecord.MultiFactorSettings = userRecord.TotpMultiFactorInfo = userRecord.TotpInfo = userRecord.PhoneMultiFactorInfo = userRecord.MultiFactorInfo = void 0;
const deep_copy_1$1 = deepCopy$1;
const validator_1 = validator$b;
const utils$1 = utils$4;
const error_1$3 = error;
/**
 * 'REDACTED', encoded as a base64 string.
 */
const B64_REDACTED = Buffer.from('REDACTED').toString('base64');
/**
 * Parses a time stamp string or number and returns the corresponding date if valid.
 *
 * @param time - The unix timestamp string or number in milliseconds.
 * @returns The corresponding date as a UTC string, if valid. Otherwise, null.
 */
function parseDate(time) {
    try {
        const date = new Date(parseInt(time, 10));
        if (!isNaN(date.getTime())) {
            return date.toUTCString();
        }
    }
    catch (e) {
        // Do nothing. null will be returned.
    }
    return null;
}
var MultiFactorId;
(function (MultiFactorId) {
    MultiFactorId["Phone"] = "phone";
    MultiFactorId["Totp"] = "totp";
})(MultiFactorId || (MultiFactorId = {}));
/**
 * Interface representing the common properties of a user-enrolled second factor.
 */
class MultiFactorInfo {
    /**
     * Initializes the MultiFactorInfo associated subclass using the server side.
     * If no MultiFactorInfo is associated with the response, null is returned.
     *
     * @param response - The server side response.
     * @internal
     */
    static initMultiFactorInfo(response) {
        let multiFactorInfo = null;
        // PhoneMultiFactorInfo, TotpMultiFactorInfo currently available.
        try {
            if (response.phoneInfo !== undefined) {
                multiFactorInfo = new PhoneMultiFactorInfo(response);
            }
            else if (response.totpInfo !== undefined) {
                multiFactorInfo = new TotpMultiFactorInfo(response);
            }
            else {
                // Ignore the other SDK unsupported MFA factors to prevent blocking developers using the current SDK.
            }
        }
        catch (e) {
            // Ignore error.
        }
        return multiFactorInfo;
    }
    /**
     * Initializes the MultiFactorInfo object using the server side response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    constructor(response) {
        this.initFromServerResponse(response);
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON() {
        return {
            uid: this.uid,
            displayName: this.displayName,
            factorId: this.factorId,
            enrollmentTime: this.enrollmentTime,
        };
    }
    /**
     * Initializes the MultiFactorInfo object using the provided server response.
     *
     * @param response - The server side response.
     */
    initFromServerResponse(response) {
        const factorId = response && this.getFactorId(response);
        if (!factorId || !response || !response.mfaEnrollmentId) {
            throw new error_1$3.FirebaseAuthError(error_1$3.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid multi-factor info response');
        }
        utils$1.addReadonlyGetter(this, 'uid', response.mfaEnrollmentId);
        utils$1.addReadonlyGetter(this, 'factorId', factorId);
        utils$1.addReadonlyGetter(this, 'displayName', response.displayName);
        // Encoded using [RFC 3339](https://www.ietf.org/rfc/rfc3339.txt) format.
        // For example, "2017-01-15T01:30:15.01Z".
        // This can be parsed directly via Date constructor.
        // This can be computed using Data.prototype.toISOString.
        if (response.enrolledAt) {
            utils$1.addReadonlyGetter(this, 'enrollmentTime', new Date(response.enrolledAt).toUTCString());
        }
        else {
            utils$1.addReadonlyGetter(this, 'enrollmentTime', null);
        }
    }
}
userRecord.MultiFactorInfo = MultiFactorInfo;
/**
 * Interface representing a phone specific user-enrolled second factor.
 */
class PhoneMultiFactorInfo extends MultiFactorInfo {
    /**
     * Initializes the PhoneMultiFactorInfo object using the server side response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    constructor(response) {
        super(response);
        utils$1.addReadonlyGetter(this, 'phoneNumber', response.phoneInfo);
    }
    /**
     * {@inheritdoc MultiFactorInfo.toJSON}
     */
    toJSON() {
        return Object.assign(super.toJSON(), {
            phoneNumber: this.phoneNumber,
        });
    }
    /**
     * Returns the factor ID based on the response provided.
     *
     * @param response - The server side response.
     * @returns The multi-factor ID associated with the provided response. If the response is
     *     not associated with any known multi-factor ID, null is returned.
     *
     * @internal
     */
    getFactorId(response) {
        return (response && response.phoneInfo) ? MultiFactorId.Phone : null;
    }
}
userRecord.PhoneMultiFactorInfo = PhoneMultiFactorInfo;
/**
 * `TotpInfo` struct associated with a second factor
 */
class TotpInfo {
}
userRecord.TotpInfo = TotpInfo;
/**
 * Interface representing a TOTP specific user-enrolled second factor.
 */
class TotpMultiFactorInfo extends MultiFactorInfo {
    /**
     * Initializes the `TotpMultiFactorInfo` object using the server side response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    constructor(response) {
        super(response);
        utils$1.addReadonlyGetter(this, 'totpInfo', response.totpInfo);
    }
    /**
     * {@inheritdoc MultiFactorInfo.toJSON}
     */
    toJSON() {
        return Object.assign(super.toJSON(), {
            totpInfo: this.totpInfo,
        });
    }
    /**
     * Returns the factor ID based on the response provided.
     *
     * @param response - The server side response.
     * @returns The multi-factor ID associated with the provided response. If the response is
     *     not associated with any known multi-factor ID, `null` is returned.
     *
     * @internal
     */
    getFactorId(response) {
        return (response && response.totpInfo) ? MultiFactorId.Totp : null;
    }
}
userRecord.TotpMultiFactorInfo = TotpMultiFactorInfo;
/**
 * The multi-factor related user settings.
 */
class MultiFactorSettings {
    /**
     * Initializes the `MultiFactor` object using the server side or JWT format response.
     *
     * @param response - The server side response.
     * @constructor
     * @internal
     */
    constructor(response) {
        const parsedEnrolledFactors = [];
        if (!(0, validator_1.isNonNullObject)(response)) {
            throw new error_1$3.FirebaseAuthError(error_1$3.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid multi-factor response');
        }
        else if (response.mfaInfo) {
            response.mfaInfo.forEach((factorResponse) => {
                const multiFactorInfo = MultiFactorInfo.initMultiFactorInfo(factorResponse);
                if (multiFactorInfo) {
                    parsedEnrolledFactors.push(multiFactorInfo);
                }
            });
        }
        // Make enrolled factors immutable.
        utils$1.addReadonlyGetter(this, 'enrolledFactors', Object.freeze(parsedEnrolledFactors));
    }
    /**
     * Returns a JSON-serializable representation of this multi-factor object.
     *
     * @returns A JSON-serializable representation of this multi-factor object.
     */
    toJSON() {
        return {
            enrolledFactors: this.enrolledFactors.map((info) => info.toJSON()),
        };
    }
}
userRecord.MultiFactorSettings = MultiFactorSettings;
/**
 * Represents a user's metadata.
 */
class UserMetadata {
    /**
     * @param response - The server side response returned from the `getAccountInfo`
     *     endpoint.
     * @constructor
     * @internal
     */
    constructor(response) {
        // Creation date should always be available but due to some backend bugs there
        // were cases in the past where users did not have creation date properly set.
        // This included legacy Firebase migrating project users and some anonymous users.
        // These bugs have already been addressed since then.
        utils$1.addReadonlyGetter(this, 'creationTime', parseDate(response.createdAt));
        utils$1.addReadonlyGetter(this, 'lastSignInTime', parseDate(response.lastLoginAt));
        const lastRefreshAt = response.lastRefreshAt ? new Date(response.lastRefreshAt).toUTCString() : null;
        utils$1.addReadonlyGetter(this, 'lastRefreshTime', lastRefreshAt);
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON() {
        return {
            lastSignInTime: this.lastSignInTime,
            creationTime: this.creationTime,
            lastRefreshTime: this.lastRefreshTime,
        };
    }
}
userRecord.UserMetadata = UserMetadata;
/**
 * Represents a user's info from a third-party identity provider
 * such as Google or Facebook.
 */
class UserInfo {
    /**
     * @param response - The server side response returned from the `getAccountInfo`
     *     endpoint.
     * @constructor
     * @internal
     */
    constructor(response) {
        // Provider user id and provider id are required.
        if (!response.rawId || !response.providerId) {
            throw new error_1$3.FirebaseAuthError(error_1$3.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid user info response');
        }
        utils$1.addReadonlyGetter(this, 'uid', response.rawId);
        utils$1.addReadonlyGetter(this, 'displayName', response.displayName);
        utils$1.addReadonlyGetter(this, 'email', response.email);
        utils$1.addReadonlyGetter(this, 'photoURL', response.photoUrl);
        utils$1.addReadonlyGetter(this, 'providerId', response.providerId);
        utils$1.addReadonlyGetter(this, 'phoneNumber', response.phoneNumber);
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON() {
        return {
            uid: this.uid,
            displayName: this.displayName,
            email: this.email,
            photoURL: this.photoURL,
            providerId: this.providerId,
            phoneNumber: this.phoneNumber,
        };
    }
}
userRecord.UserInfo = UserInfo;
/**
 * Represents a user.
 */
class UserRecord {
    /**
     * @param response - The server side response returned from the getAccountInfo
     *     endpoint.
     * @constructor
     * @internal
     */
    constructor(response) {
        // The Firebase user id is required.
        if (!response.localId) {
            throw new error_1$3.FirebaseAuthError(error_1$3.AuthClientErrorCode.INTERNAL_ERROR, 'INTERNAL ASSERT FAILED: Invalid user response');
        }
        utils$1.addReadonlyGetter(this, 'uid', response.localId);
        utils$1.addReadonlyGetter(this, 'email', response.email);
        utils$1.addReadonlyGetter(this, 'emailVerified', !!response.emailVerified);
        utils$1.addReadonlyGetter(this, 'displayName', response.displayName);
        utils$1.addReadonlyGetter(this, 'photoURL', response.photoUrl);
        utils$1.addReadonlyGetter(this, 'phoneNumber', response.phoneNumber);
        // If disabled is not provided, the account is enabled by default.
        utils$1.addReadonlyGetter(this, 'disabled', response.disabled || false);
        utils$1.addReadonlyGetter(this, 'metadata', new UserMetadata(response));
        const providerData = [];
        for (const entry of (response.providerUserInfo || [])) {
            providerData.push(new UserInfo(entry));
        }
        utils$1.addReadonlyGetter(this, 'providerData', providerData);
        // If the password hash is redacted (probably due to missing permissions)
        // then clear it out, similar to how the salt is returned. (Otherwise, it
        // *looks* like a b64-encoded hash is present, which is confusing.)
        if (response.passwordHash === B64_REDACTED) {
            utils$1.addReadonlyGetter(this, 'passwordHash', undefined);
        }
        else {
            utils$1.addReadonlyGetter(this, 'passwordHash', response.passwordHash);
        }
        utils$1.addReadonlyGetter(this, 'passwordSalt', response.salt);
        if (response.customAttributes) {
            utils$1.addReadonlyGetter(this, 'customClaims', JSON.parse(response.customAttributes));
        }
        let validAfterTime = null;
        // Convert validSince first to UTC milliseconds and then to UTC date string.
        if (typeof response.validSince !== 'undefined') {
            validAfterTime = parseDate(parseInt(response.validSince, 10) * 1000);
        }
        utils$1.addReadonlyGetter(this, 'tokensValidAfterTime', validAfterTime || undefined);
        utils$1.addReadonlyGetter(this, 'tenantId', response.tenantId);
        const multiFactor = new MultiFactorSettings(response);
        if (multiFactor.enrolledFactors.length > 0) {
            utils$1.addReadonlyGetter(this, 'multiFactor', multiFactor);
        }
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns A JSON-serializable representation of this object.
     */
    toJSON() {
        const json = {
            uid: this.uid,
            email: this.email,
            emailVerified: this.emailVerified,
            displayName: this.displayName,
            photoURL: this.photoURL,
            phoneNumber: this.phoneNumber,
            disabled: this.disabled,
            // Convert metadata to json.
            metadata: this.metadata.toJSON(),
            passwordHash: this.passwordHash,
            passwordSalt: this.passwordSalt,
            customClaims: (0, deep_copy_1$1.deepCopy)(this.customClaims),
            tokensValidAfterTime: this.tokensValidAfterTime,
            tenantId: this.tenantId,
        };
        if (this.multiFactor) {
            json.multiFactor = this.multiFactor.toJSON();
        }
        json.providerData = [];
        for (const entry of this.providerData) {
            // Convert each provider data to json.
            json.providerData.push(entry.toJSON());
        }
        return json;
    }
}
userRecord.UserRecord = UserRecord;

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(baseAuth, "__esModule", { value: true });
baseAuth.BaseAuth = void 0;
baseAuth.createFirebaseTokenGenerator = createFirebaseTokenGenerator;
const error_1$2 = error;
const deep_copy_1 = deepCopy$1;
const validator$2 = validator$b;
const auth_api_request_1$3 = authApiRequest;
const token_generator_1 = tokenGenerator;
const token_verifier_1 = tokenVerifier;
const auth_config_1 = authConfig;
const user_record_1 = userRecord;
const identifier_1 = identifier;
const crypto_signer_1 = cryptoSigner;
/**
 * @internal
 */
function createFirebaseTokenGenerator(app, tenantId) {
    try {
        const signer = (0, auth_api_request_1$3.useEmulator)() ? new token_generator_1.EmulatedSigner() : (0, crypto_signer_1.cryptoSignerFromApp)(app);
        return new token_generator_1.FirebaseTokenGenerator(signer, tenantId);
    }
    catch (err) {
        throw (0, token_generator_1.handleCryptoSignerError)(err);
    }
}
/**
 * Common parent interface for both `Auth` and `TenantAwareAuth` APIs.
 */
class BaseAuth {
    /**
     * The BaseAuth class constructor.
     *
     * @param app - The FirebaseApp to associate with this Auth instance.
     * @param authRequestHandler - The RPC request handler for this instance.
     * @param tokenGenerator - Optional token generator. If not specified, a
     *     (non-tenant-aware) instance will be created. Use this paramter to
     *     specify a tenant-aware tokenGenerator.
     * @constructor
     * @internal
     */
    constructor(app, 
    /** @internal */ authRequestHandler, tokenGenerator) {
        this.authRequestHandler = authRequestHandler;
        if (tokenGenerator) {
            this.tokenGenerator = tokenGenerator;
        }
        else {
            this.tokenGenerator = createFirebaseTokenGenerator(app);
        }
        this.sessionCookieVerifier = (0, token_verifier_1.createSessionCookieVerifier)(app);
        this.idTokenVerifier = (0, token_verifier_1.createIdTokenVerifier)(app);
        this.authBlockingTokenVerifier = (0, token_verifier_1.createAuthBlockingTokenVerifier)(app);
    }
    /**
     * Creates a new Firebase custom token (JWT) that can be sent back to a client
     * device to use to sign in with the client SDKs' `signInWithCustomToken()`
     * methods. (Tenant-aware instances will also embed the tenant ID in the
     * token.)
     *
     * See {@link https://firebase.google.com/docs/auth/admin/create-custom-tokens | Create Custom Tokens}
     * for code samples and detailed documentation.
     *
     * @param uid - The `uid` to use as the custom token's subject.
     * @param developerClaims - Optional additional claims to include
     *   in the custom token's payload.
     *
     * @returns A promise fulfilled with a custom token for the
     *   provided `uid` and payload.
     */
    createCustomToken(uid, developerClaims) {
        return this.tokenGenerator.createCustomToken(uid, developerClaims);
    }
    /**
     * Verifies a Firebase ID token (JWT). If the token is valid, the promise is
     * fulfilled with the token's decoded claims; otherwise, the promise is
     * rejected.
     *
     * If `checkRevoked` is set to true, first verifies whether the corresponding
     * user is disabled. If yes, an `auth/user-disabled` error is thrown. If no,
     * verifies if the session corresponding to the ID token was revoked. If the
     * corresponding user's session was invalidated, an `auth/id-token-revoked`
     * error is thrown. If not specified the check is not applied.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/verify-id-tokens | Verify ID Tokens}
     * for code samples and detailed documentation.
     *
     * @param idToken - The ID token to verify.
     * @param checkRevoked - Whether to check if the ID token was revoked.
     *   This requires an extra request to the Firebase Auth backend to check
     *   the `tokensValidAfterTime` time for the corresponding user.
     *   When not specified, this additional check is not applied.
     *
     * @returns A promise fulfilled with the
     *   token's decoded claims if the ID token is valid; otherwise, a rejected
     *   promise.
     */
    verifyIdToken(idToken, checkRevoked = false) {
        const isEmulator = (0, auth_api_request_1$3.useEmulator)();
        return this.idTokenVerifier.verifyJWT(idToken, isEmulator)
            .then((decodedIdToken) => {
            // Whether to check if the token was revoked.
            if (checkRevoked || isEmulator) {
                return this.verifyDecodedJWTNotRevokedOrDisabled(decodedIdToken, error_1$2.AuthClientErrorCode.ID_TOKEN_REVOKED);
            }
            return decodedIdToken;
        });
    }
    /**
     * Gets the user data for the user corresponding to a given `uid`.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data | Retrieve user data}
     * for code samples and detailed documentation.
     *
     * @param uid - The `uid` corresponding to the user whose data to fetch.
     *
     * @returns A promise fulfilled with the user
     *   data corresponding to the provided `uid`.
     */
    getUser(uid) {
        return this.authRequestHandler.getAccountInfoByUid(uid)
            .then((response) => {
            // Returns the user record populated with server response.
            return new user_record_1.UserRecord(response.users[0]);
        });
    }
    /**
     * Gets the user data for the user corresponding to a given email.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data | Retrieve user data}
     * for code samples and detailed documentation.
     *
     * @param email - The email corresponding to the user whose data to
     *   fetch.
     *
     * @returns A promise fulfilled with the user
     *   data corresponding to the provided email.
     */
    getUserByEmail(email) {
        return this.authRequestHandler.getAccountInfoByEmail(email)
            .then((response) => {
            // Returns the user record populated with server response.
            return new user_record_1.UserRecord(response.users[0]);
        });
    }
    /**
     * Gets the user data for the user corresponding to a given phone number. The
     * phone number has to conform to the E.164 specification.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data | Retrieve user data}
     * for code samples and detailed documentation.
     *
     * @param phoneNumber - The phone number corresponding to the user whose
     *   data to fetch.
     *
     * @returns A promise fulfilled with the user
     *   data corresponding to the provided phone number.
     */
    getUserByPhoneNumber(phoneNumber) {
        return this.authRequestHandler.getAccountInfoByPhoneNumber(phoneNumber)
            .then((response) => {
            // Returns the user record populated with server response.
            return new user_record_1.UserRecord(response.users[0]);
        });
    }
    /**
     * Gets the user data for the user corresponding to a given provider id.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#retrieve_user_data | Retrieve user data}
     * for code samples and detailed documentation.
     *
     * @param providerId - The provider ID, for example, "google.com" for the
     *   Google provider.
     * @param uid - The user identifier for the given provider.
     *
     * @returns A promise fulfilled with the user data corresponding to the
     *   given provider id.
     */
    getUserByProviderUid(providerId, uid) {
        // Although we don't really advertise it, we want to also handle
        // non-federated idps with this call. So if we detect one of them, we'll
        // reroute this request appropriately.
        if (providerId === 'phone') {
            return this.getUserByPhoneNumber(uid);
        }
        else if (providerId === 'email') {
            return this.getUserByEmail(uid);
        }
        return this.authRequestHandler.getAccountInfoByFederatedUid(providerId, uid)
            .then((response) => {
            // Returns the user record populated with server response.
            return new user_record_1.UserRecord(response.users[0]);
        });
    }
    /**
     * Gets the user data corresponding to the specified identifiers.
     *
     * There are no ordering guarantees; in particular, the nth entry in the result list is not
     * guaranteed to correspond to the nth entry in the input parameters list.
     *
     * Only a maximum of 100 identifiers may be supplied. If more than 100 identifiers are supplied,
     * this method throws a FirebaseAuthError.
     *
     * @param identifiers - The identifiers used to indicate which user records should be returned.
     *     Must not have more than 100 entries.
     * @returns A promise that resolves to the corresponding user records.
     * @throws FirebaseAuthError If any of the identifiers are invalid or if more than 100
     *     identifiers are specified.
     */
    getUsers(identifiers) {
        if (!validator$2.isArray(identifiers)) {
            throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_ARGUMENT, '`identifiers` parameter must be an array');
        }
        return this.authRequestHandler
            .getAccountInfoByIdentifiers(identifiers)
            .then((response) => {
            /**
             * Checks if the specified identifier is within the list of
             * UserRecords.
             */
            const isUserFound = ((id, userRecords) => {
                return !!userRecords.find((userRecord) => {
                    if ((0, identifier_1.isUidIdentifier)(id)) {
                        return id.uid === userRecord.uid;
                    }
                    else if ((0, identifier_1.isEmailIdentifier)(id)) {
                        return id.email === userRecord.email;
                    }
                    else if ((0, identifier_1.isPhoneIdentifier)(id)) {
                        return id.phoneNumber === userRecord.phoneNumber;
                    }
                    else if ((0, identifier_1.isProviderIdentifier)(id)) {
                        const matchingUserInfo = userRecord.providerData.find((userInfo) => {
                            return id.providerId === userInfo.providerId;
                        });
                        return !!matchingUserInfo && id.providerUid === matchingUserInfo.uid;
                    }
                    else {
                        throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INTERNAL_ERROR, 'Unhandled identifier type');
                    }
                });
            });
            const users = response.users ? response.users.map((user) => new user_record_1.UserRecord(user)) : [];
            const notFound = identifiers.filter((id) => !isUserFound(id, users));
            return { users, notFound };
        });
    }
    /**
     * Retrieves a list of users (single batch only) with a size of `maxResults`
     * starting from the offset as specified by `pageToken`. This is used to
     * retrieve all the users of a specified project in batches.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#list_all_users | List all users}
     * for code samples and detailed documentation.
     *
     * @param maxResults - The page size, 1000 if undefined. This is also
     *   the maximum allowed limit.
     * @param pageToken - The next page token. If not specified, returns
     *   users starting without any offset.
     * @returns A promise that resolves with
     *   the current batch of downloaded users and the next page token.
     */
    listUsers(maxResults, pageToken) {
        return this.authRequestHandler.downloadAccount(maxResults, pageToken)
            .then((response) => {
            // List of users to return.
            const users = [];
            // Convert each user response to a UserRecord.
            response.users.forEach((userResponse) => {
                users.push(new user_record_1.UserRecord(userResponse));
            });
            // Return list of user records and the next page token if available.
            const result = {
                users,
                pageToken: response.nextPageToken,
            };
            // Delete result.pageToken if undefined.
            if (typeof result.pageToken === 'undefined') {
                delete result.pageToken;
            }
            return result;
        });
    }
    /**
     * Creates a new user.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#create_a_user | Create a user}
     * for code samples and detailed documentation.
     *
     * @param properties - The properties to set on the
     *   new user record to be created.
     *
     * @returns A promise fulfilled with the user
     *   data corresponding to the newly created user.
     */
    createUser(properties) {
        return this.authRequestHandler.createNewAccount(properties)
            .then((uid) => {
            // Return the corresponding user record.
            return this.getUser(uid);
        })
            .catch((error) => {
            if (error.code === 'auth/user-not-found') {
                // Something must have happened after creating the user and then retrieving it.
                throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INTERNAL_ERROR, 'Unable to create the user record provided.');
            }
            throw error;
        });
    }
    /**
     * Deletes an existing user.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#delete_a_user | Delete a user}
     * for code samples and detailed documentation.
     *
     * @param uid - The `uid` corresponding to the user to delete.
     *
     * @returns An empty promise fulfilled once the user has been
     *   deleted.
     */
    deleteUser(uid) {
        return this.authRequestHandler.deleteAccount(uid)
            .then(() => {
            // Return nothing on success.
        });
    }
    /**
     * Deletes the users specified by the given uids.
     *
     * Deleting a non-existing user won't generate an error (i.e. this method
     * is idempotent.) Non-existing users are considered to be successfully
     * deleted, and are therefore counted in the
     * `DeleteUsersResult.successCount` value.
     *
     * Only a maximum of 1000 identifiers may be supplied. If more than 1000
     * identifiers are supplied, this method throws a FirebaseAuthError.
     *
     * This API is currently rate limited at the server to 1 QPS. If you exceed
     * this, you may get a quota exceeded error. Therefore, if you want to
     * delete more than 1000 users, you may need to add a delay to ensure you
     * don't go over this limit.
     *
     * @param uids - The `uids` corresponding to the users to delete.
     *
     * @returns A Promise that resolves to the total number of successful/failed
     *     deletions, as well as the array of errors that corresponds to the
     *     failed deletions.
     */
    deleteUsers(uids) {
        if (!validator$2.isArray(uids)) {
            throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_ARGUMENT, '`uids` parameter must be an array');
        }
        return this.authRequestHandler.deleteAccounts(uids, /*force=*/ true)
            .then((batchDeleteAccountsResponse) => {
            const result = {
                failureCount: 0,
                successCount: uids.length,
                errors: [],
            };
            if (!validator$2.isNonEmptyArray(batchDeleteAccountsResponse.errors)) {
                return result;
            }
            result.failureCount = batchDeleteAccountsResponse.errors.length;
            result.successCount = uids.length - batchDeleteAccountsResponse.errors.length;
            result.errors = batchDeleteAccountsResponse.errors.map((batchDeleteErrorInfo) => {
                if (batchDeleteErrorInfo.index === undefined) {
                    throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INTERNAL_ERROR, 'Corrupt BatchDeleteAccountsResponse detected');
                }
                const errMsgToError = (msg) => {
                    // We unconditionally set force=true, so the 'NOT_DISABLED' error
                    // should not be possible.
                    const code = msg && msg.startsWith('NOT_DISABLED') ?
                        error_1$2.AuthClientErrorCode.USER_NOT_DISABLED : error_1$2.AuthClientErrorCode.INTERNAL_ERROR;
                    return new error_1$2.FirebaseAuthError(code, batchDeleteErrorInfo.message);
                };
                return {
                    index: batchDeleteErrorInfo.index,
                    error: errMsgToError(batchDeleteErrorInfo.message),
                };
            });
            return result;
        });
    }
    /**
     * Updates an existing user.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-users#update_a_user | Update a user}
     * for code samples and detailed documentation.
     *
     * @param uid - The `uid` corresponding to the user to update.
     * @param properties - The properties to update on
     *   the provided user.
     *
     * @returns A promise fulfilled with the
     *   updated user data.
     */
    updateUser(uid, properties) {
        // Although we don't really advertise it, we want to also handle linking of
        // non-federated idps with this call. So if we detect one of them, we'll
        // adjust the properties parameter appropriately. This *does* imply that a
        // conflict could arise, e.g. if the user provides a phoneNumber property,
        // but also provides a providerToLink with a 'phone' provider id. In that
        // case, we'll throw an error.
        properties = (0, deep_copy_1.deepCopy)(properties);
        if (properties?.providerToLink) {
            if (properties.providerToLink.providerId === 'email') {
                if (typeof properties.email !== 'undefined') {
                    throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_ARGUMENT, "Both UpdateRequest.email and UpdateRequest.providerToLink.providerId='email' were set. To "
                        + 'link to the email/password provider, only specify the UpdateRequest.email field.');
                }
                properties.email = properties.providerToLink.uid;
                delete properties.providerToLink;
            }
            else if (properties.providerToLink.providerId === 'phone') {
                if (typeof properties.phoneNumber !== 'undefined') {
                    throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_ARGUMENT, "Both UpdateRequest.phoneNumber and UpdateRequest.providerToLink.providerId='phone' were set. To "
                        + 'link to a phone provider, only specify the UpdateRequest.phoneNumber field.');
                }
                properties.phoneNumber = properties.providerToLink.uid;
                delete properties.providerToLink;
            }
        }
        if (properties?.providersToUnlink) {
            if (properties.providersToUnlink.indexOf('phone') !== -1) {
                // If we've been told to unlink the phone provider both via setting
                // phoneNumber to null *and* by setting providersToUnlink to include
                // 'phone', then we'll reject that. Though it might also be reasonable
                // to relax this restriction and just unlink it.
                if (properties.phoneNumber === null) {
                    throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_ARGUMENT, "Both UpdateRequest.phoneNumber=null and UpdateRequest.providersToUnlink=['phone'] were set. To "
                        + 'unlink from a phone provider, only specify the UpdateRequest.phoneNumber=null field.');
                }
            }
        }
        return this.authRequestHandler.updateExistingAccount(uid, properties)
            .then((existingUid) => {
            // Return the corresponding user record.
            return this.getUser(existingUid);
        });
    }
    /**
     * Sets additional developer claims on an existing user identified by the
     * provided `uid`, typically used to define user roles and levels of
     * access. These claims should propagate to all devices where the user is
     * already signed in (after token expiration or when token refresh is forced)
     * and the next time the user signs in. If a reserved OIDC claim name
     * is used (sub, iat, iss, etc), an error is thrown. They are set on the
     * authenticated user's ID token JWT.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/custom-claims |
     * Defining user roles and access levels}
     * for code samples and detailed documentation.
     *
     * @param uid - The `uid` of the user to edit.
     * @param customUserClaims - The developer claims to set. If null is
     *   passed, existing custom claims are deleted. Passing a custom claims payload
     *   larger than 1000 bytes will throw an error. Custom claims are added to the
     *   user's ID token which is transmitted on every authenticated request.
     *   For profile non-access related user attributes, use database or other
     *   separate storage systems.
     * @returns A promise that resolves when the operation completes
     *   successfully.
     */
    setCustomUserClaims(uid, customUserClaims) {
        return this.authRequestHandler.setCustomUserClaims(uid, customUserClaims)
            .then(() => {
            // Return nothing on success.
        });
    }
    /**
     * Revokes all refresh tokens for an existing user.
     *
     * This API will update the user's {@link UserRecord.tokensValidAfterTime} to
     * the current UTC. It is important that the server on which this is called has
     * its clock set correctly and synchronized.
     *
     * While this will revoke all sessions for a specified user and disable any
     * new ID tokens for existing sessions from getting minted, existing ID tokens
     * may remain active until their natural expiration (one hour). To verify that
     * ID tokens are revoked, use {@link BaseAuth.verifyIdToken}
     * where `checkRevoked` is set to true.
     *
     * @param uid - The `uid` corresponding to the user whose refresh tokens
     *   are to be revoked.
     *
     * @returns An empty promise fulfilled once the user's refresh
     *   tokens have been revoked.
     */
    revokeRefreshTokens(uid) {
        return this.authRequestHandler.revokeRefreshTokens(uid)
            .then(() => {
            // Return nothing on success.
        });
    }
    /**
     * Imports the provided list of users into Firebase Auth.
     * A maximum of 1000 users are allowed to be imported one at a time.
     * When importing users with passwords,
     * {@link UserImportOptions} are required to be
     * specified.
     * This operation is optimized for bulk imports and will ignore checks on `uid`,
     * `email` and other identifier uniqueness which could result in duplications.
     *
     * @param users - The list of user records to import to Firebase Auth.
     * @param options - The user import options, required when the users provided include
     *   password credentials.
     * @returns A promise that resolves when
     *   the operation completes with the result of the import. This includes the
     *   number of successful imports, the number of failed imports and their
     *   corresponding errors.
    */
    importUsers(users, options) {
        return this.authRequestHandler.uploadAccount(users, options);
    }
    /**
     * Creates a new Firebase session cookie with the specified options. The created
     * JWT string can be set as a server-side session cookie with a custom cookie
     * policy, and be used for session management. The session cookie JWT will have
     * the same payload claims as the provided ID token.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-cookies | Manage Session Cookies}
     * for code samples and detailed documentation.
     *
     * @param idToken - The Firebase ID token to exchange for a session
     *   cookie.
     * @param sessionCookieOptions - The session
     *   cookie options which includes custom session duration.
     *
     * @returns A promise that resolves on success with the
     *   created session cookie.
     */
    createSessionCookie(idToken, sessionCookieOptions) {
        // Return rejected promise if expiresIn is not available.
        if (!validator$2.isNonNullObject(sessionCookieOptions) ||
            !validator$2.isNumber(sessionCookieOptions.expiresIn)) {
            return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_SESSION_COOKIE_DURATION));
        }
        return this.authRequestHandler.createSessionCookie(idToken, sessionCookieOptions.expiresIn);
    }
    /**
     * Verifies a Firebase session cookie. Returns a Promise with the cookie claims.
     * Rejects the promise if the cookie could not be verified.
     *
     * If `checkRevoked` is set to true, first verifies whether the corresponding
     * user is disabled: If yes, an `auth/user-disabled` error is thrown. If no,
     * verifies if the session corresponding to the session cookie was revoked.
     * If the corresponding user's session was invalidated, an
     * `auth/session-cookie-revoked` error is thrown. If not specified the check
     * is not performed.
     *
     * See {@link https://firebase.google.com/docs/auth/admin/manage-cookies#verify_session_cookie_and_check_permissions |
     * Verify Session Cookies}
     * for code samples and detailed documentation
     *
     * @param sessionCookie - The session cookie to verify.
     * @param checkForRevocation -  Whether to check if the session cookie was
     *   revoked. This requires an extra request to the Firebase Auth backend to
     *   check the `tokensValidAfterTime` time for the corresponding user.
     *   When not specified, this additional check is not performed.
     *
     * @returns A promise fulfilled with the
     *   session cookie's decoded claims if the session cookie is valid; otherwise,
     *   a rejected promise.
     */
    verifySessionCookie(sessionCookie, checkRevoked = false) {
        const isEmulator = (0, auth_api_request_1$3.useEmulator)();
        return this.sessionCookieVerifier.verifyJWT(sessionCookie, isEmulator)
            .then((decodedIdToken) => {
            // Whether to check if the token was revoked.
            if (checkRevoked || isEmulator) {
                return this.verifyDecodedJWTNotRevokedOrDisabled(decodedIdToken, error_1$2.AuthClientErrorCode.SESSION_COOKIE_REVOKED);
            }
            return decodedIdToken;
        });
    }
    /**
     * Generates the out of band email action link to reset a user's password.
     * The link is generated for the user with the specified email address. The
     * optional  {@link ActionCodeSettings} object
     * defines whether the link is to be handled by a mobile app or browser and the
     * additional state information to be passed in the deep link, etc.
     *
     * @example
     * ```javascript
     * var actionCodeSettings = {
     *   url: 'https://www.example.com/?email=user@example.com',
     *   iOS: {
     *     bundleId: 'com.example.ios'
     *   },
     *   android: {
     *     packageName: 'com.example.android',
     *     installApp: true,
     *     minimumVersion: '12'
     *   },
     *   handleCodeInApp: true,
     *   linkDomain: 'project-id.firebaseapp.com'
     * };
     * admin.auth()
     *     .generatePasswordResetLink('user@example.com', actionCodeSettings)
     *     .then(function(link) {
     *       // The link was successfully generated.
     *     })
     *     .catch(function(error) {
     *       // Some error occurred, you can inspect the code: error.code
     *     });
     * ```
     *
     * @param email - The email address of the user whose password is to be
     *   reset.
     * @param actionCodeSettings - The action
     *     code settings. If specified, the state/continue URL is set as the
     *     "continueUrl" parameter in the password reset link. The default password
     *     reset landing page will use this to display a link to go back to the app
     *     if it is installed.
     *     If the actionCodeSettings is not specified, no URL is appended to the
     *     action URL.
     *     The state URL provided must belong to a domain that is whitelisted by the
     *     developer in the console. Otherwise an error is thrown.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @returns A promise that resolves with the generated link.
     */
    generatePasswordResetLink(email, actionCodeSettings) {
        return this.authRequestHandler.getEmailActionLink('PASSWORD_RESET', email, actionCodeSettings);
    }
    /**
     * Generates the out of band email action link to verify the user's ownership
     * of the specified email. The {@link ActionCodeSettings} object provided
     * as an argument to this method defines whether the link is to be handled by a
     * mobile app or browser along with additional state information to be passed in
     * the deep link, etc.
     *
     * @example
     * ```javascript
     * var actionCodeSettings = {
     *   url: 'https://www.example.com/cart?email=user@example.com&cartId=123',
     *   iOS: {
     *     bundleId: 'com.example.ios'
     *   },
     *   android: {
     *     packageName: 'com.example.android',
     *     installApp: true,
     *     minimumVersion: '12'
     *   },
     *   handleCodeInApp: true,
     *   linkDomain: 'project-id.firebaseapp.com'
     * };
     * admin.auth()
     *     .generateEmailVerificationLink('user@example.com', actionCodeSettings)
     *     .then(function(link) {
     *       // The link was successfully generated.
     *     })
     *     .catch(function(error) {
     *       // Some error occurred, you can inspect the code: error.code
     *     });
     * ```
     *
     * @param email - The email account to verify.
     * @param actionCodeSettings - The action
     *     code settings. If specified, the state/continue URL is set as the
     *     "continueUrl" parameter in the email verification link. The default email
     *     verification landing page will use this to display a link to go back to
     *     the app if it is installed.
     *     If the actionCodeSettings is not specified, no URL is appended to the
     *     action URL.
     *     The state URL provided must belong to a domain that is whitelisted by the
     *     developer in the console. Otherwise an error is thrown.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @returns A promise that resolves with the generated link.
     */
    generateEmailVerificationLink(email, actionCodeSettings) {
        return this.authRequestHandler.getEmailActionLink('VERIFY_EMAIL', email, actionCodeSettings);
    }
    /**
     * Generates an out-of-band email action link to verify the user's ownership
     * of the specified email. The {@link ActionCodeSettings} object provided
     * as an argument to this method defines whether the link is to be handled by a
     * mobile app or browser along with additional state information to be passed in
     * the deep link, etc.
     *
     * @param email - The current email account.
     * @param newEmail - The email address the account is being updated to.
     * @param actionCodeSettings - The action
     *     code settings. If specified, the state/continue URL is set as the
     *     "continueUrl" parameter in the email verification link. The default email
     *     verification landing page will use this to display a link to go back to
     *     the app if it is installed.
     *     If the actionCodeSettings is not specified, no URL is appended to the
     *     action URL.
     *     The state URL provided must belong to a domain that is authorized
     *     in the console, or an error will be thrown.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @returns A promise that resolves with the generated link.
     */
    generateVerifyAndChangeEmailLink(email, newEmail, actionCodeSettings) {
        return this.authRequestHandler.getEmailActionLink('VERIFY_AND_CHANGE_EMAIL', email, actionCodeSettings, newEmail);
    }
    /**
     * Generates the out of band email action link to verify the user's ownership
     * of the specified email. The {@link ActionCodeSettings} object provided
     * as an argument to this method defines whether the link is to be handled by a
     * mobile app or browser along with additional state information to be passed in
     * the deep link, etc.
     *
     * @example
     * ```javascript
     * var actionCodeSettings = {
     *   url: 'https://www.example.com/cart?email=user@example.com&cartId=123',
     *   iOS: {
     *     bundleId: 'com.example.ios'
     *   },
     *   android: {
     *     packageName: 'com.example.android',
     *     installApp: true,
     *     minimumVersion: '12'
     *   },
     *   handleCodeInApp: true,
     *   linkDomain: 'project-id.firebaseapp.com'
     * };
     * admin.auth()
     *     .generateEmailVerificationLink('user@example.com', actionCodeSettings)
     *     .then(function(link) {
     *       // The link was successfully generated.
     *     })
     *     .catch(function(error) {
     *       // Some error occurred, you can inspect the code: error.code
     *     });
     * ```
     *
     * @param email - The email account to verify.
     * @param actionCodeSettings - The action
     *     code settings. If specified, the state/continue URL is set as the
     *     "continueUrl" parameter in the email verification link. The default email
     *     verification landing page will use this to display a link to go back to
     *     the app if it is installed.
     *     If the actionCodeSettings is not specified, no URL is appended to the
     *     action URL.
     *     The state URL provided must belong to a domain that is whitelisted by the
     *     developer in the console. Otherwise an error is thrown.
     *     Mobile app redirects are only applicable if the developer configures
     *     and accepts the Firebase Dynamic Links terms of service.
     *     The Android package name and iOS bundle ID are respected only if they
     *     are configured in the same Firebase Auth project.
     * @returns A promise that resolves with the generated link.
     */
    generateSignInWithEmailLink(email, actionCodeSettings) {
        return this.authRequestHandler.getEmailActionLink('EMAIL_SIGNIN', email, actionCodeSettings);
    }
    /**
     * Returns the list of existing provider configurations matching the filter
     * provided. At most, 100 provider configs can be listed at a time.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
     *
     * @param options - The provider config filter to apply.
     * @returns A promise that resolves with the list of provider configs meeting the
     *   filter requirements.
     */
    listProviderConfigs(options) {
        const processResponse = (response, providerConfigs) => {
            // Return list of provider configuration and the next page token if available.
            const result = {
                providerConfigs,
            };
            // Delete result.pageToken if undefined.
            if (Object.prototype.hasOwnProperty.call(response, 'nextPageToken')) {
                result.pageToken = response.nextPageToken;
            }
            return result;
        };
        if (options && options.type === 'oidc') {
            return this.authRequestHandler.listOAuthIdpConfigs(options.maxResults, options.pageToken)
                .then((response) => {
                // List of provider configurations to return.
                const providerConfigs = [];
                // Convert each provider config response to a OIDCConfig.
                response.oauthIdpConfigs.forEach((configResponse) => {
                    providerConfigs.push(new auth_config_1.OIDCConfig(configResponse));
                });
                // Return list of provider configuration and the next page token if available.
                return processResponse(response, providerConfigs);
            });
        }
        else if (options && options.type === 'saml') {
            return this.authRequestHandler.listInboundSamlConfigs(options.maxResults, options.pageToken)
                .then((response) => {
                // List of provider configurations to return.
                const providerConfigs = [];
                // Convert each provider config response to a SAMLConfig.
                response.inboundSamlConfigs.forEach((configResponse) => {
                    providerConfigs.push(new auth_config_1.SAMLConfig(configResponse));
                });
                // Return list of provider configuration and the next page token if available.
                return processResponse(response, providerConfigs);
            });
        }
        return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_ARGUMENT, '"AuthProviderConfigFilter.type" must be either "saml" or "oidc"'));
    }
    /**
     * Looks up an Auth provider configuration by the provided ID.
     * Returns a promise that resolves with the provider configuration
     * corresponding to the provider ID specified. If the specified ID does not
     * exist, an `auth/configuration-not-found` error is thrown.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
     *
     * @param providerId - The provider ID corresponding to the provider
     *     config to return.
     * @returns A promise that resolves
     *     with the configuration corresponding to the provided ID.
     */
    getProviderConfig(providerId) {
        if (auth_config_1.OIDCConfig.isProviderId(providerId)) {
            return this.authRequestHandler.getOAuthIdpConfig(providerId)
                .then((response) => {
                return new auth_config_1.OIDCConfig(response);
            });
        }
        else if (auth_config_1.SAMLConfig.isProviderId(providerId)) {
            return this.authRequestHandler.getInboundSamlConfig(providerId)
                .then((response) => {
                return new auth_config_1.SAMLConfig(response);
            });
        }
        return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_PROVIDER_ID));
    }
    /**
     * Deletes the provider configuration corresponding to the provider ID passed.
     * If the specified ID does not exist, an `auth/configuration-not-found` error
     * is thrown.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
     *
     * @param providerId - The provider ID corresponding to the provider
     *     config to delete.
     * @returns A promise that resolves on completion.
     */
    deleteProviderConfig(providerId) {
        if (auth_config_1.OIDCConfig.isProviderId(providerId)) {
            return this.authRequestHandler.deleteOAuthIdpConfig(providerId);
        }
        else if (auth_config_1.SAMLConfig.isProviderId(providerId)) {
            return this.authRequestHandler.deleteInboundSamlConfig(providerId);
        }
        return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_PROVIDER_ID));
    }
    /**
     * Returns a promise that resolves with the updated `AuthProviderConfig`
     * corresponding to the provider ID specified.
     * If the specified ID does not exist, an `auth/configuration-not-found` error
     * is thrown.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
     *
     * @param providerId - The provider ID corresponding to the provider
     *     config to update.
     * @param updatedConfig - The updated configuration.
     * @returns A promise that resolves with the updated provider configuration.
     */
    updateProviderConfig(providerId, updatedConfig) {
        if (!validator$2.isNonNullObject(updatedConfig)) {
            return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_CONFIG, 'Request is missing "UpdateAuthProviderRequest" configuration.'));
        }
        if (auth_config_1.OIDCConfig.isProviderId(providerId)) {
            return this.authRequestHandler.updateOAuthIdpConfig(providerId, updatedConfig)
                .then((response) => {
                return new auth_config_1.OIDCConfig(response);
            });
        }
        else if (auth_config_1.SAMLConfig.isProviderId(providerId)) {
            return this.authRequestHandler.updateInboundSamlConfig(providerId, updatedConfig)
                .then((response) => {
                return new auth_config_1.SAMLConfig(response);
            });
        }
        return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_PROVIDER_ID));
    }
    /**
     * Returns a promise that resolves with the newly created `AuthProviderConfig`
     * when the new provider configuration is created.
     *
     * SAML and OIDC provider support requires Google Cloud's Identity Platform
     * (GCIP). To learn more about GCIP, including pricing and features,
     * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
     *
     * @param config - The provider configuration to create.
     * @returns A promise that resolves with the created provider configuration.
     */
    createProviderConfig(config) {
        if (!validator$2.isNonNullObject(config)) {
            return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_CONFIG, 'Request is missing "AuthProviderConfig" configuration.'));
        }
        if (auth_config_1.OIDCConfig.isProviderId(config.providerId)) {
            return this.authRequestHandler.createOAuthIdpConfig(config)
                .then((response) => {
                return new auth_config_1.OIDCConfig(response);
            });
        }
        else if (auth_config_1.SAMLConfig.isProviderId(config.providerId)) {
            return this.authRequestHandler.createInboundSamlConfig(config)
                .then((response) => {
                return new auth_config_1.SAMLConfig(response);
            });
        }
        return Promise.reject(new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.INVALID_PROVIDER_ID));
    }
    /** @alpha */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _verifyAuthBlockingToken(token, audience) {
        const isEmulator = (0, auth_api_request_1$3.useEmulator)();
        return this.authBlockingTokenVerifier._verifyAuthBlockingToken(token, isEmulator, audience)
            .then((decodedAuthBlockingToken) => {
            return decodedAuthBlockingToken;
        });
    }
    /**
     * Verifies the decoded Firebase issued JWT is not revoked or disabled. Returns a promise that
     * resolves with the decoded claims on success. Rejects the promise with revocation error if revoked
     * or user disabled.
     *
     * @param decodedIdToken - The JWT's decoded claims.
     * @param revocationErrorInfo - The revocation error info to throw on revocation
     *     detection.
     * @returns A promise that will be fulfilled after a successful verification.
     */
    verifyDecodedJWTNotRevokedOrDisabled(decodedIdToken, revocationErrorInfo) {
        // Get tokens valid after time for the corresponding user.
        return this.getUser(decodedIdToken.sub)
            .then((user) => {
            if (user.disabled) {
                throw new error_1$2.FirebaseAuthError(error_1$2.AuthClientErrorCode.USER_DISABLED, 'The user record is disabled.');
            }
            // If no tokens valid after time available, token is not revoked.
            if (user.tokensValidAfterTime) {
                // Get the ID token authentication time and convert to milliseconds UTC.
                const authTimeUtc = decodedIdToken.auth_time * 1000;
                // Get user tokens valid after time in milliseconds UTC.
                const validSinceUtc = new Date(user.tokensValidAfterTime).getTime();
                // Check if authentication time is older than valid since time.
                if (authTimeUtc < validSinceUtc) {
                    throw new error_1$2.FirebaseAuthError(revocationErrorInfo);
                }
            }
            // All checks above passed. Return the decoded token.
            return decodedIdToken;
        });
    }
}
baseAuth.BaseAuth = BaseAuth;

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(tenantManager, "__esModule", { value: true });
tenantManager.TenantManager = tenantManager.TenantAwareAuth = void 0;
const validator$1 = validator$b;
const utils = utils$4;
const error_1$1 = error;
const base_auth_1$1 = baseAuth;
const tenant_1 = tenant;
const auth_api_request_1$2 = authApiRequest;
/**
 * Tenant-aware `Auth` interface used for managing users, configuring SAML/OIDC providers,
 * generating email links for password reset, email verification, etc for specific tenants.
 *
 * Multi-tenancy support requires Google Cloud's Identity Platform
 * (GCIP). To learn more about GCIP, including pricing and features,
 * see the {@link https://cloud.google.com/identity-platform | GCIP documentation}.
 *
 * Each tenant contains its own identity providers, settings and sets of users.
 * Using `TenantAwareAuth`, users for a specific tenant and corresponding OIDC/SAML
 * configurations can also be managed, ID tokens for users signed in to a specific tenant
 * can be verified, and email action links can also be generated for users belonging to the
 * tenant.
 *
 * `TenantAwareAuth` instances for a specific `tenantId` can be instantiated by calling
 * {@link TenantManager.authForTenant}.
 */
class TenantAwareAuth extends base_auth_1$1.BaseAuth {
    /**
     * The TenantAwareAuth class constructor.
     *
     * @param app - The app that created this tenant.
     * @param tenantId - The corresponding tenant ID.
     * @constructor
     * @internal
     */
    constructor(app, tenantId) {
        super(app, new auth_api_request_1$2.TenantAwareAuthRequestHandler(app, tenantId), (0, base_auth_1$1.createFirebaseTokenGenerator)(app, tenantId));
        utils.addReadonlyGetter(this, 'tenantId', tenantId);
    }
    /**
     * {@inheritdoc BaseAuth.verifyIdToken}
     */
    verifyIdToken(idToken, checkRevoked = false) {
        return super.verifyIdToken(idToken, checkRevoked)
            .then((decodedClaims) => {
            // Validate tenant ID.
            if (decodedClaims.firebase.tenant !== this.tenantId) {
                throw new error_1$1.FirebaseAuthError(error_1$1.AuthClientErrorCode.MISMATCHING_TENANT_ID);
            }
            return decodedClaims;
        });
    }
    /**
     * {@inheritdoc BaseAuth.createSessionCookie}
     */
    createSessionCookie(idToken, sessionCookieOptions) {
        // Validate arguments before processing.
        if (!validator$1.isNonEmptyString(idToken)) {
            return Promise.reject(new error_1$1.FirebaseAuthError(error_1$1.AuthClientErrorCode.INVALID_ID_TOKEN));
        }
        if (!validator$1.isNonNullObject(sessionCookieOptions) ||
            !validator$1.isNumber(sessionCookieOptions.expiresIn)) {
            return Promise.reject(new error_1$1.FirebaseAuthError(error_1$1.AuthClientErrorCode.INVALID_SESSION_COOKIE_DURATION));
        }
        // This will verify the ID token and then match the tenant ID before creating the session cookie.
        return this.verifyIdToken(idToken)
            .then(() => {
            return super.createSessionCookie(idToken, sessionCookieOptions);
        });
    }
    /**
     * {@inheritdoc BaseAuth.verifySessionCookie}
     */
    verifySessionCookie(sessionCookie, checkRevoked = false) {
        return super.verifySessionCookie(sessionCookie, checkRevoked)
            .then((decodedClaims) => {
            if (decodedClaims.firebase.tenant !== this.tenantId) {
                throw new error_1$1.FirebaseAuthError(error_1$1.AuthClientErrorCode.MISMATCHING_TENANT_ID);
            }
            return decodedClaims;
        });
    }
}
tenantManager.TenantAwareAuth = TenantAwareAuth;
/**
 * Defines the tenant manager used to help manage tenant related operations.
 * This includes:
 * <ul>
 * <li>The ability to create, update, list, get and delete tenants for the underlying
 *     project.</li>
 * <li>Getting a `TenantAwareAuth` instance for running Auth related operations
 *     (user management, provider configuration management, token verification,
 *     email link generation, etc) in the context of a specified tenant.</li>
 * </ul>
 */
class TenantManager {
    /**
     * Initializes a TenantManager instance for a specified FirebaseApp.
     *
     * @param app - The app for this TenantManager instance.
     *
     * @constructor
     * @internal
     */
    constructor(app) {
        this.app = app;
        this.authRequestHandler = new auth_api_request_1$2.AuthRequestHandler(app);
        this.tenantsMap = {};
    }
    /**
     * Returns a `TenantAwareAuth` instance bound to the given tenant ID.
     *
     * @param tenantId - The tenant ID whose `TenantAwareAuth` instance is to be returned.
     *
     * @returns The `TenantAwareAuth` instance corresponding to this tenant identifier.
     */
    authForTenant(tenantId) {
        if (!validator$1.isNonEmptyString(tenantId)) {
            throw new error_1$1.FirebaseAuthError(error_1$1.AuthClientErrorCode.INVALID_TENANT_ID);
        }
        if (typeof this.tenantsMap[tenantId] === 'undefined') {
            this.tenantsMap[tenantId] = new TenantAwareAuth(this.app, tenantId);
        }
        return this.tenantsMap[tenantId];
    }
    /**
     * Gets the tenant configuration for the tenant corresponding to a given `tenantId`.
     *
     * @param tenantId - The tenant identifier corresponding to the tenant whose data to fetch.
     *
     * @returns A promise fulfilled with the tenant configuration to the provided `tenantId`.
     */
    getTenant(tenantId) {
        return this.authRequestHandler.getTenant(tenantId)
            .then((response) => {
            return new tenant_1.Tenant(response);
        });
    }
    /**
     * Retrieves a list of tenants (single batch only) with a size of `maxResults`
     * starting from the offset as specified by `pageToken`. This is used to
     * retrieve all the tenants of a specified project in batches.
     *
     * @param maxResults - The page size, 1000 if undefined. This is also
     *   the maximum allowed limit.
     * @param pageToken - The next page token. If not specified, returns
     *   tenants starting without any offset.
     *
     * @returns A promise that resolves with
     *   a batch of downloaded tenants and the next page token.
     */
    listTenants(maxResults, pageToken) {
        return this.authRequestHandler.listTenants(maxResults, pageToken)
            .then((response) => {
            // List of tenants to return.
            const tenants = [];
            // Convert each user response to a Tenant.
            response.tenants.forEach((tenantResponse) => {
                tenants.push(new tenant_1.Tenant(tenantResponse));
            });
            // Return list of tenants and the next page token if available.
            const result = {
                tenants,
                pageToken: response.nextPageToken,
            };
            // Delete result.pageToken if undefined.
            if (typeof result.pageToken === 'undefined') {
                delete result.pageToken;
            }
            return result;
        });
    }
    /**
     * Deletes an existing tenant.
     *
     * @param tenantId - The `tenantId` corresponding to the tenant to delete.
     *
     * @returns An empty promise fulfilled once the tenant has been deleted.
     */
    deleteTenant(tenantId) {
        return this.authRequestHandler.deleteTenant(tenantId);
    }
    /**
     * Creates a new tenant.
     * When creating new tenants, tenants that use separate billing and quota will require their
     * own project and must be defined as `full_service`.
     *
     * @param tenantOptions - The properties to set on the new tenant configuration to be created.
     *
     * @returns A promise fulfilled with the tenant configuration corresponding to the newly
     *   created tenant.
     */
    createTenant(tenantOptions) {
        return this.authRequestHandler.createTenant(tenantOptions)
            .then((response) => {
            return new tenant_1.Tenant(response);
        });
    }
    /**
     * Updates an existing tenant configuration.
     *
     * @param tenantId - The `tenantId` corresponding to the tenant to delete.
     * @param tenantOptions - The properties to update on the provided tenant.
     *
     * @returns A promise fulfilled with the update tenant data.
     */
    updateTenant(tenantId, tenantOptions) {
        return this.authRequestHandler.updateTenant(tenantId, tenantOptions)
            .then((response) => {
            return new tenant_1.Tenant(response);
        });
    }
}
tenantManager.TenantManager = TenantManager;

var projectConfigManager = {};

/*! firebase-admin v13.10.0 */
Object.defineProperty(projectConfigManager, "__esModule", { value: true });
projectConfigManager.ProjectConfigManager = void 0;
const project_config_1 = projectConfig;
const auth_api_request_1$1 = authApiRequest;
/**
 * Manages (gets and updates) the current project config.
 */
class ProjectConfigManager {
    /**
     * Initializes a ProjectConfigManager instance for a specified FirebaseApp.
     *
     * @param app - The app for this ProjectConfigManager instance.
     *
     * @constructor
     * @internal
     */
    constructor(app) {
        this.authRequestHandler = new auth_api_request_1$1.AuthRequestHandler(app);
    }
    /**
     * Get the project configuration.
     *
     * @returns A promise fulfilled with the project configuration.
     */
    getProjectConfig() {
        return this.authRequestHandler.getProjectConfig()
            .then((response) => {
            return new project_config_1.ProjectConfig(response);
        });
    }
    /**
     * Updates an existing project configuration.
     *
     * @param projectConfigOptions - The properties to update on the project.
     *
     * @returns A promise fulfilled with the updated project config.
     */
    updateProjectConfig(projectConfigOptions) {
        return this.authRequestHandler.updateProjectConfig(projectConfigOptions)
            .then((response) => {
            return new project_config_1.ProjectConfig(response);
        });
    }
}
projectConfigManager.ProjectConfigManager = ProjectConfigManager;

/*! firebase-admin v13.10.0 */
/*!
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(auth, "__esModule", { value: true });
auth.Auth = void 0;
const auth_api_request_1 = authApiRequest;
const tenant_manager_1 = tenantManager;
const base_auth_1 = baseAuth;
const project_config_manager_1 = projectConfigManager;
/**
 * Auth service bound to the provided app.
 * An Auth instance can have multiple tenants.
 */
class Auth extends base_auth_1.BaseAuth {
    /**
     * @param app - The app for this Auth service.
     * @constructor
     * @internal
     */
    constructor(app) {
        super(app, new auth_api_request_1.AuthRequestHandler(app));
        this.app_ = app;
        this.tenantManager_ = new tenant_manager_1.TenantManager(app);
        this.projectConfigManager_ = new project_config_manager_1.ProjectConfigManager(app);
    }
    /**
     * Returns the app associated with this Auth instance.
     *
     * @returns The app associated with this Auth instance.
     */
    get app() {
        return this.app_;
    }
    /**
     * Returns the tenant manager instance associated with the current project.
     *
     * @returns The tenant manager instance associated with the current project.
     */
    tenantManager() {
        return this.tenantManager_;
    }
    /**
     * Returns the project config manager instance associated with the current project.
     *
     * @returns The project config manager instance associated with the current project.
     */
    projectConfigManager() {
        return this.projectConfigManager_;
    }
}
auth.Auth = Auth;

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AuthClientErrorCode = exports.FirebaseAuthError = exports.UserRecord = exports.UserMetadata = exports.UserInfo = exports.PhoneMultiFactorInfo = exports.MultiFactorSettings = exports.MultiFactorInfo = exports.ProjectConfigManager = exports.ProjectConfig = exports.TenantManager = exports.TenantAwareAuth = exports.Tenant = exports.BaseAuth = exports.Auth = void 0;
	exports.getAuth = getAuth;
	/**
	 * Firebase Authentication.
	 *
	 * @packageDocumentation
	 */
	const index_1 = app;
	const auth_1 = auth;
	/**
	 * Gets the {@link Auth} service for the default app or a
	 * given app.
	 *
	 * `getAuth()` can be called with no arguments to access the default app's
	 * {@link Auth} service or as `getAuth(app)` to access the
	 * {@link Auth} service associated with a specific app.
	 *
	 * @example
	 * ```javascript
	 * // Get the Auth service for the default app
	 * const defaultAuth = getAuth();
	 * ```
	 *
	 * @example
	 * ```javascript
	 * // Get the Auth service for a given app
	 * const otherAuth = getAuth(otherApp);
	 * ```
	 *
	 */
	function getAuth(app) {
	    if (typeof app === 'undefined') {
	        app = (0, index_1.getApp)();
	    }
	    const firebaseApp = app;
	    return firebaseApp.getOrInitService('auth', (app) => new auth_1.Auth(app));
	}
	var auth_2 = auth;
	Object.defineProperty(exports, "Auth", { enumerable: true, get: function () { return auth_2.Auth; } });
	var base_auth_1 = baseAuth;
	Object.defineProperty(exports, "BaseAuth", { enumerable: true, get: function () { return base_auth_1.BaseAuth; } });
	var tenant_1 = tenant;
	Object.defineProperty(exports, "Tenant", { enumerable: true, get: function () { return tenant_1.Tenant; } });
	var tenant_manager_1 = tenantManager;
	Object.defineProperty(exports, "TenantAwareAuth", { enumerable: true, get: function () { return tenant_manager_1.TenantAwareAuth; } });
	Object.defineProperty(exports, "TenantManager", { enumerable: true, get: function () { return tenant_manager_1.TenantManager; } });
	var project_config_1 = projectConfig;
	Object.defineProperty(exports, "ProjectConfig", { enumerable: true, get: function () { return project_config_1.ProjectConfig; } });
	var project_config_manager_1 = projectConfigManager;
	Object.defineProperty(exports, "ProjectConfigManager", { enumerable: true, get: function () { return project_config_manager_1.ProjectConfigManager; } });
	var user_record_1 = userRecord;
	Object.defineProperty(exports, "MultiFactorInfo", { enumerable: true, get: function () { return user_record_1.MultiFactorInfo; } });
	Object.defineProperty(exports, "MultiFactorSettings", { enumerable: true, get: function () { return user_record_1.MultiFactorSettings; } });
	Object.defineProperty(exports, "PhoneMultiFactorInfo", { enumerable: true, get: function () { return user_record_1.PhoneMultiFactorInfo; } });
	Object.defineProperty(exports, "UserInfo", { enumerable: true, get: function () { return user_record_1.UserInfo; } });
	Object.defineProperty(exports, "UserMetadata", { enumerable: true, get: function () { return user_record_1.UserMetadata; } });
	Object.defineProperty(exports, "UserRecord", { enumerable: true, get: function () { return user_record_1.UserRecord; } });
	var error_1 = error;
	Object.defineProperty(exports, "FirebaseAuthError", { enumerable: true, get: function () { return error_1.FirebaseAuthError; } });
	Object.defineProperty(exports, "AuthClientErrorCode", { enumerable: true, get: function () { return error_1.AuthClientErrorCode; } }); 
} (auth$1));

const mod$1 = /*@__PURE__*/getDefaultExportFromCjs(auth$1);

mod$1.Auth;
mod$1.AuthClientErrorCode;
mod$1.BaseAuth;
mod$1.FirebaseAuthError;
mod$1.MultiFactorInfo;
mod$1.MultiFactorSettings;
mod$1.PhoneMultiFactorInfo;
mod$1.ProjectConfig;
mod$1.ProjectConfigManager;
mod$1.Tenant;
mod$1.TenantAwareAuth;
mod$1.TenantManager;
mod$1.UserInfo;
mod$1.UserMetadata;
mod$1.UserRecord;
const getAuth = mod$1.getAuth;

var database$1 = {};

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(standalone);

var database = {};

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(path$1);

/*! firebase-admin v13.10.0 */
/*!
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(database, "__esModule", { value: true });
database.DatabaseService = void 0;
const url_1 = require$$0$1;
const path = require$$1;
const error_1 = error;
const validator = validator$b;
const api_request_1 = apiRequest;
const index_1 = utils$4;
const TOKEN_REFRESH_THRESHOLD_MILLIS = 5 * 60 * 1000;
class DatabaseService {
    constructor(app) {
        this.databases = {};
        if (!validator.isNonNullObject(app) || !('options' in app)) {
            throw new error_1.FirebaseDatabaseError({
                code: 'invalid-argument',
                message: 'First argument passed to admin.database() must be a valid Firebase app instance.',
            });
        }
        this.appInternal = app;
    }
    get firebaseApp() {
        return this.app;
    }
    /**
     * @internal
     */
    delete() {
        if (this.tokenListener) {
            this.firebaseApp.INTERNAL.removeAuthTokenListener(this.tokenListener);
            clearTimeout(this.tokenRefreshTimeout);
        }
        const promises = [];
        for (const dbUrl of Object.keys(this.databases)) {
            const db = this.databases[dbUrl];
            promises.push(db.INTERNAL.delete());
        }
        return Promise.all(promises).then(() => {
            this.databases = {};
        });
    }
    /**
     * Returns the app associated with this DatabaseService instance.
     *
     * @returns The app associated with this DatabaseService instance.
     */
    get app() {
        return this.appInternal;
    }
    getDatabase(url) {
        const dbUrl = this.ensureUrl(url);
        if (!validator.isNonEmptyString(dbUrl)) {
            throw new error_1.FirebaseDatabaseError({
                code: 'invalid-argument',
                message: 'Database URL must be a valid, non-empty URL string.',
            });
        }
        let db = this.databases[dbUrl];
        if (typeof db === 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const rtdb = require$$0;
            db = rtdb.initStandalone(this.appInternal, dbUrl, (0, index_1.getSdkVersion)()).instance;
            const rulesClient = new DatabaseRulesClient(this.app, dbUrl);
            db.getRules = () => {
                return rulesClient.getRules();
            };
            db.getRulesJSON = () => {
                return rulesClient.getRulesJSON();
            };
            db.setRules = (source) => {
                return rulesClient.setRules(source);
            };
            this.databases[dbUrl] = db;
        }
        if (!this.tokenListener) {
            this.tokenListener = this.onTokenChange.bind(this);
            this.firebaseApp.INTERNAL.addAuthTokenListener(this.tokenListener);
        }
        return db;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onTokenChange(_) {
        const token = this.firebaseApp.INTERNAL.getCachedToken();
        if (token) {
            const delayMillis = token.expirationTime - TOKEN_REFRESH_THRESHOLD_MILLIS - Date.now();
            // If the new token is set to expire soon (unlikely), do nothing. Somebody will eventually
            // notice and refresh the token, at which point this callback will fire again.
            if (delayMillis > 0) {
                this.scheduleTokenRefresh(delayMillis);
            }
        }
    }
    scheduleTokenRefresh(delayMillis) {
        clearTimeout(this.tokenRefreshTimeout);
        this.tokenRefreshTimeout = setTimeout(() => {
            this.firebaseApp.INTERNAL.getToken(/*forceRefresh=*/ true)
                .catch(() => {
                // Ignore the error since this might just be an intermittent failure. If we really cannot
                // refresh the token, an error will be logged once the existing token expires and we try
                // to fetch a fresh one.
            });
        }, delayMillis);
    }
    ensureUrl(url) {
        if (typeof url !== 'undefined') {
            return url;
        }
        else if (typeof this.appInternal.options.databaseURL !== 'undefined') {
            return this.appInternal.options.databaseURL;
        }
        throw new error_1.FirebaseDatabaseError({
            code: 'invalid-argument',
            message: 'Can\'t determine Firebase Database URL.',
        });
    }
}
database.DatabaseService = DatabaseService;
const RULES_URL_PATH = '.settings/rules.json';
/**
 * A helper client for managing RTDB security rules.
 */
class DatabaseRulesClient {
    constructor(app, dbUrl) {
        let parsedUrl = new url_1.URL(dbUrl);
        const emulatorHost = process.env.FIREBASE_DATABASE_EMULATOR_HOST;
        if (emulatorHost) {
            const namespace = extractNamespace(parsedUrl);
            parsedUrl = new url_1.URL(`http://${emulatorHost}?ns=${namespace}`);
        }
        parsedUrl.pathname = path.join(parsedUrl.pathname, RULES_URL_PATH);
        this.dbUrl = parsedUrl.toString();
        this.httpClient = new api_request_1.AuthorizedHttpClient(app);
    }
    /**
     * Gets the currently applied security rules as a string. The return value consists of
     * the rules source including comments.
     *
     * @returns A promise fulfilled with the rules as a raw string.
     */
    getRules() {
        const req = {
            method: 'GET',
            url: this.dbUrl,
        };
        return this.httpClient.send(req)
            .then((resp) => {
            if (!resp.text) {
                throw new error_1.FirebaseAppError(error_1.AppErrorCodes.INTERNAL_ERROR, 'HTTP response missing data.');
            }
            return resp.text;
        })
            .catch((err) => {
            throw this.handleError(err);
        });
    }
    /**
     * Gets the currently applied security rules as a parsed JSON object. Any comments in
     * the original source are stripped away.
     *
     * @returns {Promise<object>} A promise fulfilled with the parsed rules source.
     */
    getRulesJSON() {
        const req = {
            method: 'GET',
            url: this.dbUrl,
            data: { format: 'strict' },
        };
        return this.httpClient.send(req)
            .then((resp) => {
            return resp.data;
        })
            .catch((err) => {
            throw this.handleError(err);
        });
    }
    /**
     * Sets the specified rules on the Firebase Database instance. If the rules source is
     * specified as a string or a Buffer, it may include comments.
     *
     * @param {string|Buffer|object} source Source of the rules to apply. Must not be `null`
     *  or empty.
     * @returns {Promise<void>} Resolves when the rules are set on the Database.
     */
    setRules(source) {
        if (!validator.isNonEmptyString(source) &&
            !validator.isBuffer(source) &&
            !validator.isNonNullObject(source)) {
            const error = new error_1.FirebaseDatabaseError({
                code: 'invalid-argument',
                message: 'Source must be a non-empty string, Buffer or an object.',
            });
            return Promise.reject(error);
        }
        const req = {
            method: 'PUT',
            url: this.dbUrl,
            data: source,
            headers: {
                'content-type': 'application/json; charset=utf-8',
            },
        };
        return this.httpClient.send(req)
            .then(() => {
            return;
        })
            .catch((err) => {
            throw this.handleError(err);
        });
    }
    handleError(err) {
        if (err instanceof api_request_1.RequestResponseError) {
            return new error_1.FirebaseDatabaseError({
                code: error_1.AppErrorCodes.INTERNAL_ERROR,
                message: this.getErrorMessage(err),
            });
        }
        return err;
    }
    getErrorMessage(err) {
        const intro = 'Error while accessing security rules';
        try {
            const body = err.response.data;
            if (body && body.error) {
                return `${intro}: ${body.error.trim()}`;
            }
        }
        catch {
            // Ignore parsing errors
        }
        return `${intro}: ${err.response.text}`;
    }
}
function extractNamespace(parsedUrl) {
    const ns = parsedUrl.searchParams.get('ns');
    if (ns) {
        return ns;
    }
    const hostname = parsedUrl.hostname;
    const dotIndex = hostname.indexOf('.');
    return hostname.substring(0, dotIndex).toLowerCase();
}

/*! firebase-admin v13.10.0 */

(function (exports) {
	/*!
	 * Copyright 2020 Google LLC
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.FirebaseDatabaseError = exports.ServerValue = exports.enableLogging = void 0;
	exports.getDatabase = getDatabase;
	exports.getDatabaseWithUrl = getDatabaseWithUrl;
	const standalone_1 = require$$0;
	const app_1 = app;
	const database_1 = database;
	// TODO: Remove the following any-cast once the typins in @firebase/database-types are fixed.
	/**
	 * {@link https://firebase.google.com/docs/reference/js/v8/firebase.database#enablelogging | enableLogging}
	 * function from the `@firebase/database-compat` package.
	 */
	exports.enableLogging = standalone_1.enableLogging;
	/**
	 * {@link https://firebase.google.com/docs/reference/js/v8/firebase.database.ServerValue | ServerValue}
	 * constant from the `@firebase/database-compat` package.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	exports.ServerValue = standalone_1.ServerValue;
	/**
	 * Gets the {@link Database} service for the default
	 * app or a given app.
	 *
	 * `getDatabase()` can be called with no arguments to access the default
	 * app's `Database` service or as `getDatabase(app)` to access the
	 * `Database` service associated with a specific app.
	 *
	 * @example
	 * ```javascript
	 * // Get the Database service for the default app
	 * const defaultDatabase = getDatabase();
	 * ```
	 *
	 * @example
	 * ```javascript
	 * // Get the Database service for a specific app
	 * const otherDatabase = getDatabase(app);
	 * ```
	 *
	 * @param App - whose `Database` service to
	 *   return. If not provided, the default `Database` service will be returned.
	 *
	 * @returns The default `Database` service if no app
	 *   is provided or the `Database` service associated with the provided app.
	 */
	function getDatabase(app) {
	    return getDatabaseInstance({ app });
	}
	/**
	 * Gets the {@link Database} service for the default
	 * app or a given app.
	 *
	 * `getDatabaseWithUrl()` can be called with no arguments to access the default
	 * app's {@link Database} service or as `getDatabaseWithUrl(app)` to access the
	 * {@link Database} service associated with a specific app.
	 *
	 * @example
	 * ```javascript
	 * // Get the Database service for the default app
	 * const defaultDatabase = getDatabaseWithUrl('https://example.firebaseio.com');
	 * ```
	 *
	 * @example
	 * ```javascript
	 * // Get the Database service for a specific app
	 * const otherDatabase = getDatabaseWithUrl('https://example.firebaseio.com', app);
	 * ```
	 *
	 * @param App - whose `Database` service to
	 *   return. If not provided, the default `Database` service will be returned.
	 *
	 * @returns The default `Database` service if no app
	 *   is provided or the `Database` service associated with the provided app.
	 */
	function getDatabaseWithUrl(url, app) {
	    return getDatabaseInstance({ url, app });
	}
	function getDatabaseInstance(options) {
	    let { app } = options;
	    if (typeof app === 'undefined') {
	        app = (0, app_1.getApp)();
	    }
	    const firebaseApp = app;
	    const dbService = firebaseApp.getOrInitService('database', (app) => new database_1.DatabaseService(app));
	    return dbService.getDatabase(options.url);
	}
	var error_1 = error;
	Object.defineProperty(exports, "FirebaseDatabaseError", { enumerable: true, get: function () { return error_1.FirebaseDatabaseError; } }); 
} (database$1));

const mod = /*@__PURE__*/getDefaultExportFromCjs(database$1);

const FirebaseDatabaseError = mod.FirebaseDatabaseError;
const ServerValue = mod.ServerValue;
const enableLogging = mod.enableLogging;
const getDatabase = mod.getDatabase;
const getDatabaseWithUrl = mod.getDatabaseWithUrl;

const index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  FirebaseDatabaseError: FirebaseDatabaseError,
  ServerValue: ServerValue,
  enableLogging: enableLogging,
  getDatabase: getDatabase,
  getDatabaseWithUrl: getDatabaseWithUrl
}, Symbol.toStringTag, { value: 'Module' }));

const _g0IRK9rq7XNXcoA0prjisdKGZ6Pk6m7iPPOUjgo8r2M = defineNitroPlugin(() => {
  if (!getApps().length) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const databaseURL = process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL || "https://alfatahsppt-default-rtdb.firebaseio.com";
    let firebaseConfig;
    if (serviceAccountBase64) {
      try {
        const serviceAccount = JSON.parse(
          Buffer.from(serviceAccountBase64, "base64").toString("utf-8")
        );
        firebaseConfig = {
          credential: cert(serviceAccount),
          databaseURL
        };
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e.message);
        firebaseConfig = { databaseURL };
      }
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not set, using default credentials");
      firebaseConfig = { databaseURL };
    }
    initializeApp(firebaseConfig);
  }
  getDatabase();
  getAuth();
  console.log("Firebase Admin initialized for Nitro server (RTDB + Auth)");
});

const plugins = [
  _g0IRK9rq7XNXcoA0prjisdKGZ6Pk6m7iPPOUjgo8r2M
];

const SESSION_SECRET = new TextEncoder().encode(
  process.env.NUXT_SESSION_SECRET || "dev-session-secret-change-in-production"
);
async function createSessionToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").setIssuedAt().sign(SESSION_SECRET);
}
async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, SESSION_SECRET);
    return payload;
  } catch {
    return null;
  }
}

const PUBLIC_ROUTES = ["/api/health", "/api/uptime/", "/api/auth/login", "/api/auth/nis-login"];
const _K0e8Dm = defineEventHandler(async (event) => {
  var _a, _b;
  const path = event.path || ((_b = (_a = event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url) || "";
  if (!path.startsWith("/api/")) return;
  if (PUBLIC_ROUTES.some((r) => path.startsWith(r))) return;
  let auth = {
    uid: "",
    role: "",
    name: "",
    email: "",
    nis: ""
  };
  const sessionCookie = getCookie(event, "__session");
  if (sessionCookie) {
    try {
      const auth2 = getAuth();
      const decoded = await auth2.verifySessionCookie(sessionCookie, true);
      auth.uid = decoded.uid;
      auth.email = decoded.email || "";
      auth.name = decoded.name || "";
    } catch {
      const payload = await verifySessionToken(sessionCookie);
      if (payload) {
        auth.uid = payload.uid;
        auth.role = payload.role;
        auth.name = payload.name;
        auth.email = payload.email;
        auth.nis = payload.nis;
      }
    }
  }
  if (!auth.uid) {
    const authHeader = getHeader(event, "authorization");
    if (authHeader == null ? void 0 : authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.slice(7);
        const auth2 = getAuth();
        const decoded = await auth2.verifyIdToken(token);
        auth.uid = decoded.uid;
        auth.email = decoded.email || "";
        auth.role = decoded.role || "";
      } catch {
      }
    }
  }
  if (auth.uid && !auth.role) {
    try {
      const { getDatabase } = await Promise.resolve().then(function () { return index; });
      const db = getDatabase();
      const snap = await db.ref(`roles/${auth.uid}/role`).once("value");
      if (snap.exists()) auth.role = snap.val();
    } catch {
    }
  }
  event.context.auth = auth;
});

const _NbbnMd = defineEventHandler(async (event) => {
  setHeaders(event, {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  });
  {
    setHeader(event, "Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  setHeader(event, "X-RateLimit-Limit", "100");
  setHeader(event, "X-RateLimit-Remaining", "99");
});

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_9ZX9P3 = () => import('../routes/api/activity-logs.get.mjs');
const _lazy_jnxcQF = () => import('../routes/api/activity-logs.post.mjs');
const _lazy_n0_1Y6 = () => import('../routes/api/akademik/grades.get.mjs');
const _lazy_IuqDca = () => import('../routes/api/akademik/grades.post.mjs');
const _lazy_bX4SoC = () => import('../routes/api/akademik/grades/_id_.delete.mjs');
const _lazy_bRqSCh = () => import('../routes/api/akademik/grades/_id_.put.mjs');
const _lazy_FMuDge = () => import('../routes/api/akademik/iktibar/_id_.delete.mjs');
const _lazy_v0sfpJ = () => import('../routes/api/akademik/iktibar/_id_.put.mjs');
const _lazy_GwX_mx = () => import('../routes/api/akademik/index.get.mjs');
const _lazy_5j_p7D = () => import('../routes/api/akademik/index.post.mjs');
const _lazy_ZOS8UM = () => import('../routes/api/akademik/imtihan/_id_.delete.mjs');
const _lazy_3kBR4P = () => import('../routes/api/akademik/imtihan/_id_.get.mjs');
const _lazy_QgLNiS = () => import('../routes/api/akademik/imtihan/_id_.put.mjs');
const _lazy_NWIaF5 = () => import('../routes/api/akademik/index2.get.mjs');
const _lazy_jESPbd = () => import('../routes/api/akademik/index2.post.mjs');
const _lazy_CDb_IA = () => import('../routes/api/index.get.mjs');
const _lazy_JhZW1d = () => import('../routes/api/akademik/subjects.get.mjs');
const _lazy_pYIGbt = () => import('../routes/api/akademik/subjects.post.mjs');
const _lazy_VAxyQd = () => import('../routes/api/akademik/subjects/_id_.delete.mjs');
const _lazy_ruHfkG = () => import('../routes/api/akademik/subjects/_id_.put.mjs');
const _lazy_ZEDSBh = () => import('../routes/api/alumni/_id_.delete.mjs');
const _lazy_w6sfaC = () => import('../routes/api/alumni/_id_.put.mjs');
const _lazy_8nNkrj = () => import('../routes/api/alumni/events.get.mjs');
const _lazy_Mszvsw = () => import('../routes/api/alumni/events.post.mjs');
const _lazy_G0WeLt = () => import('../routes/api/alumni/events/_id_.delete.mjs');
const _lazy_PAXnBn = () => import('../routes/api/alumni/events/_id_.put.mjs');
const _lazy_cyikN3 = () => import('../routes/api/alumni/graduations.get.mjs');
const _lazy_H1UKx4 = () => import('../routes/api/alumni/graduations.post.mjs');
const _lazy_dXxVlo = () => import('../routes/api/alumni/graduations/_id_.delete.mjs');
const _lazy_95AFt5 = () => import('../routes/api/alumni/graduations/_id_.put.mjs');
const _lazy_S5pO4k = () => import('../routes/api/index2.get.mjs');
const _lazy_G2sSz7 = () => import('../routes/api/index.post.mjs');
const _lazy_KxQmhC = () => import('../routes/api/attendance/_id_.delete.mjs');
const _lazy_Xk2gz_ = () => import('../routes/api/attendance/_id_.put.mjs');
const _lazy_NyiKVl = () => import('../routes/api/index3.get.mjs');
const _lazy_lJr6v0 = () => import('../routes/api/index2.post.mjs');
const _lazy_stTtXD = () => import('../routes/api/attendance/monthly/_id_.delete.mjs');
const _lazy_3bawVp = () => import('../routes/api/attendance/monthly/_id_.put.mjs');
const _lazy_uWexkr = () => import('../routes/api/attendance/index.get.mjs');
const _lazy_DWJWiy = () => import('../routes/api/attendance/index.post.mjs');
const _lazy_nSXt8O = () => import('../routes/api/attendance/index2.post.mjs');
const _lazy_ZyuPh5 = () => import('../routes/api/auth/login.post.mjs');
const _lazy_K3uXMc = () => import('../routes/api/auth/logout.post.mjs');
const _lazy_5o1qIT = () => import('../routes/api/auth/nis-login.post.mjs');
const _lazy_q9quKN = () => import('../routes/api/auth/nis-map.get.mjs');
const _lazy_ZQn95s = () => import('../routes/api/auth/nis-map/_nis_.delete.mjs');
const _lazy_FWppa4 = () => import('../routes/api/auth/register-nis.post.mjs');
const _lazy_JqYjLm = () => import('../routes/api/auth/register.post.mjs');
const _lazy_waz63G = () => import('../routes/api/auth/set-role.post.mjs');
const _lazy_VK2PMi = () => import('../routes/api/auth/users.get.mjs');
const _lazy_gAx_1n = () => import('../routes/api/backup/_name_.delete.mjs');
const _lazy_wIGHo4 = () => import('../routes/api/backup/download/_name_.get.mjs');
const _lazy_AcpL6B = () => import('../routes/api/backup/drive/list.get.mjs');
const _lazy_OmBNT7 = () => import('../routes/api/backup/drive/restore.post.mjs');
const _lazy_j2Ju8B = () => import('../routes/api/backup/drive/upload.post.mjs');
const _lazy_9u7OFb = () => import('../routes/api/index4.get.mjs');
const _lazy_tu8FzD = () => import('../routes/api/index3.post.mjs');
const _lazy_74ctAC = () => import('../routes/api/backup/restore.post.mjs');
const _lazy_bN3Bib = () => import('../routes/api/dashboard-stats.get.mjs');
const _lazy_4SoDxj = () => import('../routes/api/docs.get.mjs');
const _lazy_JjmK03 = () => import('../routes/api/extracurricular/arts.get.mjs');
const _lazy_ggA6Uv = () => import('../routes/api/extracurricular/arts.post.mjs');
const _lazy_QrbgL_ = () => import('../routes/api/extracurricular/arts/_id_.delete.mjs');
const _lazy_W8E_9w = () => import('../routes/api/extracurricular/extracurricular.get.mjs');
const _lazy_LKbB3V = () => import('../routes/api/extracurricular/extracurricular.post.mjs');
const _lazy_WkznfW = () => import('../routes/api/extracurricular/extracurricular/_id_.delete.mjs');
const _lazy_H0VJ1k = () => import('../routes/api/extracurricular/extracurricular/_id_.put.mjs');
const _lazy_MYyC70 = () => import('../routes/api/extracurricular/hadroh.get.mjs');
const _lazy_WajSGR = () => import('../routes/api/extracurricular/hadroh.post.mjs');
const _lazy_PWRHqZ = () => import('../routes/api/extracurricular/hadroh/_id_.delete.mjs');
const _lazy_u5lCig = () => import('../routes/api/extracurricular/hadroh/_id_.put.mjs');
const _lazy_oepAVA = () => import('../routes/api/extracurricular/media.get.mjs');
const _lazy_5RG2m2 = () => import('../routes/api/extracurricular/media.post.mjs');
const _lazy_JWNBVp = () => import('../routes/api/extracurricular/media/_id_.delete.mjs');
const _lazy_fNpIMl = () => import('../routes/api/extracurricular/media/_id_.put.mjs');
const _lazy_UZl17T = () => import('../routes/api/extracurricular/public-speaking.get.mjs');
const _lazy_yGCKFs = () => import('../routes/api/extracurricular/public-speaking.post.mjs');
const _lazy_QJhCyv = () => import('../routes/api/extracurricular/public-speaking/_id_.delete.mjs');
const _lazy_hhm_VI = () => import('../routes/api/extracurricular/public-speaking/_id_.put.mjs');
const _lazy_CmuFf8 = () => import('../routes/api/guru/_id_.delete.mjs');
const _lazy_yAM7Ug = () => import('../routes/api/guru/_id_.put.mjs');
const _lazy_mPyC0y = () => import('../routes/api/index5.get.mjs');
const _lazy_9PzUia = () => import('../routes/api/index4.post.mjs');
const _lazy_DWL1sA = () => import('../routes/api/health.get.mjs');
const _lazy_ClTre9 = () => import('../routes/api/ibadah/fasting.get.mjs');
const _lazy_K6fr4G = () => import('../routes/api/ibadah/fasting.post.mjs');
const _lazy_7GNzZa = () => import('../routes/api/ibadah/fasting/_id_.delete.mjs');
const _lazy_m791XU = () => import('../routes/api/ibadah/infaq.get.mjs');
const _lazy_GtnXIJ = () => import('../routes/api/ibadah/infaq.post.mjs');
const _lazy_0di72x = () => import('../routes/api/ibadah/infaq/_id_.delete.mjs');
const _lazy_aAqibw = () => import('../routes/api/ibadah/prayer-attendance.get.mjs');
const _lazy_O1HdYz = () => import('../routes/api/ibadah/prayer-attendance.post.mjs');
const _lazy_F_4Ove = () => import('../routes/api/ibadah/prayer-attendance/_id_.delete.mjs');
const _lazy_Z6sTVw = () => import('../routes/api/ibadah/prayer-attendance/_id_.put.mjs');
const _lazy_EEHAKw = () => import('../routes/api/ibadah/tahajjud.get.mjs');
const _lazy_taGfqy = () => import('../routes/api/ibadah/tahajjud.post.mjs');
const _lazy_EygK7t = () => import('../routes/api/ibadah/tahajjud/_id_.delete.mjs');
const _lazy_9BP1H6 = () => import('../routes/api/ibadah/tahajjud/_id_.put.mjs');
const _lazy_Cz9sCn = () => import('../routes/api/ibadah/wirid.get.mjs');
const _lazy_F74bmq = () => import('../routes/api/ibadah/wirid.post.mjs');
const _lazy_as7GOo = () => import('../routes/api/ibadah/wirid/_id_.delete.mjs');
const _lazy_aiAf65 = () => import('../routes/api/ibadah/zakat.get.mjs');
const _lazy_DW2ujs = () => import('../routes/api/ibadah/zakat.post.mjs');
const _lazy_JfLh7m = () => import('../routes/api/ibadah/zakat/_id_.delete.mjs');
const _lazy_JCQj87 = () => import('../routes/api/inventaris/_id_.delete.mjs');
const _lazy_rOfwZv = () => import('../routes/api/inventaris/_id_.put.mjs');
const _lazy_5Awnqv = () => import('../routes/api/index6.get.mjs');
const _lazy_szoR86 = () => import('../routes/api/index5.post.mjs');
const _lazy_oeQWVx = () => import('../routes/api/inventaris/loans.get.mjs');
const _lazy_R2dh_c = () => import('../routes/api/inventaris/loans.post.mjs');
const _lazy_a3uuT7 = () => import('../routes/api/inventaris/loans/_id_.delete.mjs');
const _lazy_Gd1nRg = () => import('../routes/api/inventaris/loans/_id_.patch.mjs');
const _lazy_fQGHv_ = () => import('../routes/api/invoices.get.mjs');
const _lazy_Fl5eD0 = () => import('../routes/api/invoices.post.mjs');
const _lazy_wFQc_w = () => import('../routes/api/invoices/_id_.delete.mjs');
const _lazy_hRj6S5 = () => import('../routes/api/invoices/_id_.get.mjs');
const _lazy_KuEisG = () => import('../routes/api/invoices/_id_.put.mjs');
const _lazy_G872YE = () => import('../routes/api/izin/_id_.delete.mjs');
const _lazy_zLgzMf = () => import('../routes/api/izin/_id_.patch.mjs');
const _lazy_4DuXmF = () => import('../routes/api/index7.get.mjs');
const _lazy_icnG1s = () => import('../routes/api/index6.post.mjs');
const _lazy_VaTf46 = () => import('../routes/api/jadwal/_id_.delete.mjs');
const _lazy_BoNKej = () => import('../routes/api/jadwal/_id_.put.mjs');
const _lazy_Rv5Nm0 = () => import('../routes/api/index8.get.mjs');
const _lazy_IVCZIX = () => import('../routes/api/index7.post.mjs');
const _lazy_qjNcGD = () => import('../routes/api/kesehatan/growth.get.mjs');
const _lazy_pJd7gY = () => import('../routes/api/kesehatan/growth.post.mjs');
const _lazy_RNtMqF = () => import('../routes/api/kesehatan/growth/_id_.delete.mjs');
const _lazy_PTi19g = () => import('../routes/api/kesehatan/medical-records.get.mjs');
const _lazy_Fpc0eV = () => import('../routes/api/kesehatan/medical-records.post.mjs');
const _lazy_ETcivS = () => import('../routes/api/kesehatan/medical-records/_id_.delete.mjs');
const _lazy_f4nf6n = () => import('../routes/api/kesehatan/medical-records/_id_.put.mjs');
const _lazy_EI4RLd = () => import('../routes/api/kesehatan/nutrition.get.mjs');
const _lazy_xKd_It = () => import('../routes/api/kesehatan/nutrition.post.mjs');
const _lazy_gEQlrv = () => import('../routes/api/kesehatan/nutrition/_id_.delete.mjs');
const _lazy_PQKM0q = () => import('../routes/api/kesehatan/sanitation.get.mjs');
const _lazy_bP7wGr = () => import('../routes/api/kesehatan/sanitation.post.mjs');
const _lazy_5QIVND = () => import('../routes/api/kesehatan/sanitation/_id_.delete.mjs');
const _lazy_tKfRvf = () => import('../routes/api/keuangan/salaries.get.mjs');
const _lazy_6zk84r = () => import('../routes/api/keuangan/salaries.post.mjs');
const _lazy_9s0Whc = () => import('../routes/api/keuangan/salaries/_id_.delete.mjs');
const _lazy_lZw83t = () => import('../routes/api/keuangan/salaries/_id_.put.mjs');
const _lazy_N5bK5F = () => import('../routes/api/keuangan/scholarships.get.mjs');
const _lazy_YGSbZ6 = () => import('../routes/api/keuangan/scholarships.post.mjs');
const _lazy_cZxzxx = () => import('../routes/api/keuangan/scholarships/_id_.delete.mjs');
const _lazy_qQLJe0 = () => import('../routes/api/keuangan/scholarships/_id_.put.mjs');
const _lazy_cLk6gn = () => import('../routes/api/keuangan/spp-config.get.mjs');
const _lazy_zKeAJj = () => import('../routes/api/keuangan/spp-config.post.mjs');
const _lazy_7etLvM = () => import('../routes/api/keuangan/spp-config/_id_.delete.mjs');
const _lazy_0hFPak = () => import('../routes/api/keuangan/spp-config/_id_.put.mjs');
const _lazy__BnjsD = () => import('../routes/api/khidmah/_id_.delete.mjs');
const _lazy_vfHQkp = () => import('../routes/api/khidmah/_id_.put.mjs');
const _lazy_eJqZX1 = () => import('../routes/api/index9.get.mjs');
const _lazy_l3MgfU = () => import('../routes/api/index8.post.mjs');
const _lazy_412SCx = () => import('../routes/api/koperasi/items.get.mjs');
const _lazy_Sj8zbG = () => import('../routes/api/koperasi/items.post.mjs');
const _lazy_r6C_Ax = () => import('../routes/api/koperasi/items/_id_.delete.mjs');
const _lazy_OlQOgn = () => import('../routes/api/koperasi/items/_id_.put.mjs');
const _lazy_MjiQhF = () => import('../routes/api/koperasi/transactions.get.mjs');
const _lazy_59FbQ_ = () => import('../routes/api/koperasi/transactions.post.mjs');
const _lazy_ao3Jj4 = () => import('../routes/api/koperasi/transactions/_id_.delete.mjs');
const _lazy_TvSrbI = () => import('../routes/api/laporan/financial.get.mjs');
const _lazy_UosqaE = () => import('../routes/api/laporan/generate.post.mjs');
const _lazy_kKFuef = () => import('../routes/api/index10.get.mjs');
const _lazy_rdjcYf = () => import('../routes/api/laporan/raport/_studentId_.get.mjs');
const _lazy_aLdSa2 = () => import('../routes/api/laporan/receipt/_invoiceId_.get.mjs');
const _lazy_c3KmDY = () => import('../routes/api/master-data/academic-years.get.mjs');
const _lazy_ijqUSv = () => import('../routes/api/master-data/academic-years.post.mjs');
const _lazy_jCsMOw = () => import('../routes/api/master-data/academic-years/_id_.delete.mjs');
const _lazy_ipqCcQ = () => import('../routes/api/master-data/academic-years/_id_.put.mjs');
const _lazy_IN6nT1 = () => import('../routes/api/master-data/classes.get.mjs');
const _lazy_ZztxtI = () => import('../routes/api/master-data/classes.post.mjs');
const _lazy_JTbu02 = () => import('../routes/api/master-data/classes/_id_.delete.mjs');
const _lazy_RXfoTg = () => import('../routes/api/master-data/classes/_id_.put.mjs');
const _lazy_H6oOFL = () => import('../routes/api/master-data/dormitories.get.mjs');
const _lazy_cO7TnM = () => import('../routes/api/master-data/dormitories.post.mjs');
const _lazy_VJTBvc = () => import('../routes/api/master-data/dormitories/_id_.delete.mjs');
const _lazy_tzmZoX = () => import('../routes/api/master-data/dormitories/_id_.put.mjs');
const _lazy_KtwPOz = () => import('../routes/api/master-data/dormitories/_id/rooms.post.mjs');
const _lazy_qCWPJX = () => import('../routes/api/master-data/dormitories/_id/rooms/_roomId_.delete.mjs');
const _lazy_WbESQk = () => import('../routes/api/master-data/periods.get.mjs');
const _lazy_iXErac = () => import('../routes/api/master-data/periods.post.mjs');
const _lazy_XefFhX = () => import('../routes/api/master-data/periods/_id_.delete.mjs');
const _lazy_eUjWB8 = () => import('../routes/api/master-data/periods/_id_.put.mjs');
const _lazy_0uLVdt = () => import('../routes/api/mutasi/_id_.delete.mjs');
const _lazy_j2CL97 = () => import('../routes/api/mutasi/_id_.patch.mjs');
const _lazy_j7VDH2 = () => import('../routes/api/index11.get.mjs');
const _lazy_7kKhMn = () => import('../routes/api/index9.post.mjs');
const _lazy_b074Mf = () => import('../routes/api/notifikasi/_id_.delete.mjs');
const _lazy_j85pXC = () => import('../routes/api/notifikasi/_id_.get.mjs');
const _lazy_J_hzQV = () => import('../routes/api/index12.get.mjs');
const _lazy_6jetfu = () => import('../routes/api/index10.post.mjs');
const _lazy_txT0FI = () => import('../routes/api/ocr/analyze.post.mjs');
const _lazy_S2M0ab = () => import('../routes/api/payments.get.mjs');
const _lazy_PTi1Wf = () => import('../routes/api/payments.post.mjs');
const _lazy_0a1nQM = () => import('../routes/api/psb/registrations.get.mjs');
const _lazy_nrQFv5 = () => import('../routes/api/psb/registrations.post.mjs');
const _lazy_vjRP3L = () => import('../routes/api/psb/registrations/_id_.delete.mjs');
const _lazy_za4BJR = () => import('../routes/api/psb/registrations/_id_.patch.mjs');
const _lazy_qJFhrE = () => import('../routes/api/psb/results.get.mjs');
const _lazy_7FMbty = () => import('../routes/api/psb/results.post.mjs');
const _lazy_XIhHOA = () => import('../routes/api/psb/results/_id_.delete.mjs');
const _lazy_JKRlO8 = () => import('../routes/api/psb/results/_id_.patch.mjs');
const _lazy_BIlkVZ = () => import('../routes/api/psb/tests.get.mjs');
const _lazy_juPAj2 = () => import('../routes/api/psb/tests.post.mjs');
const _lazy_O39IOE = () => import('../routes/api/psb/tests/_id_.delete.mjs');
const _lazy_f0kpHJ = () => import('../routes/api/psb/tests/_id_.patch.mjs');
const _lazy_waRWZP = () => import('../routes/api/reward/_id_.delete.mjs');
const _lazy_m8pRHK = () => import('../routes/api/reward/_id_.put.mjs');
const _lazy_mFHobd = () => import('../routes/api/index13.get.mjs');
const _lazy_nAPq5Z = () => import('../routes/api/index11.post.mjs');
const _lazy_3dP0Vo = () => import('../routes/api/index14.get.mjs');
const _lazy_EF4Atz = () => import('../routes/api/students.get.mjs');
const _lazy_FDR_LS = () => import('../routes/api/students.post.mjs');
const _lazy_W2MLGf = () => import('../routes/api/students/_id_.delete.mjs');
const _lazy_123Cgb = () => import('../routes/api/students/_id_.get.mjs');
const _lazy_Hcs7g8 = () => import('../routes/api/students/_id_.put.mjs');
const _lazy_d7wpyu = () => import('../routes/api/students/_id/violations.get.mjs');
const _lazy_8dorBC = () => import('../routes/api/students/_id/violations.post.mjs');
const _lazy_rZBp_Y = () => import('../routes/api/tahfidz/murojaah.get.mjs');
const _lazy_gbZxWn = () => import('../routes/api/tahfidz/murojaah.post.mjs');
const _lazy_dL_p9q = () => import('../routes/api/tahfidz/murojaah/_id_.delete.mjs');
const _lazy_EFfnET = () => import('../routes/api/tahfidz/ziyadah.get.mjs');
const _lazy_GJiam2 = () => import('../routes/api/tahfidz/ziyadah.post.mjs');
const _lazy_Y4hD1b = () => import('../routes/api/tahfidz/ziyadah/_id_.delete.mjs');
const _lazy_Iu3sLt = () => import('../routes/api/tahfidz/ziyadah/_id_.put.mjs');
const _lazy_wc60pA = () => import('../routes/api/todos/_id_.delete.mjs');
const _lazy_ZSIRkl = () => import('../routes/api/todos/_id_.put.mjs');
const _lazy_gG8DNj = () => import('../routes/api/index15.get.mjs');
const _lazy_DxhRst = () => import('../routes/api/index12.post.mjs');
const _lazy_yXZ5gM = () => import('../routes/api/tools/import.post.mjs');
const _lazy_xfGmFi = () => import('../routes/api/tools/template.get.mjs');
const _lazy_iiSiZC = () => import('../routes/api/uptime/check.get.mjs');
const _lazy_3V5QVH = () => import('../routes/api/uptime/logs.get.mjs');
const _lazy_thap6N = () => import('../routes/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _K0e8Dm, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _NbbnMd, lazy: false, middleware: true, method: undefined },
  { route: '/api/activity-logs', handler: _lazy_9ZX9P3, lazy: true, middleware: false, method: "get" },
  { route: '/api/activity-logs', handler: _lazy_jnxcQF, lazy: true, middleware: false, method: "post" },
  { route: '/api/akademik/grades', handler: _lazy_n0_1Y6, lazy: true, middleware: false, method: "get" },
  { route: '/api/akademik/grades', handler: _lazy_IuqDca, lazy: true, middleware: false, method: "post" },
  { route: '/api/akademik/grades/:id', handler: _lazy_bX4SoC, lazy: true, middleware: false, method: "delete" },
  { route: '/api/akademik/grades/:id', handler: _lazy_bRqSCh, lazy: true, middleware: false, method: "put" },
  { route: '/api/akademik/iktibar/:id', handler: _lazy_FMuDge, lazy: true, middleware: false, method: "delete" },
  { route: '/api/akademik/iktibar/:id', handler: _lazy_v0sfpJ, lazy: true, middleware: false, method: "put" },
  { route: '/api/akademik/iktibar', handler: _lazy_GwX_mx, lazy: true, middleware: false, method: "get" },
  { route: '/api/akademik/iktibar', handler: _lazy_5j_p7D, lazy: true, middleware: false, method: "post" },
  { route: '/api/akademik/imtihan/:id', handler: _lazy_ZOS8UM, lazy: true, middleware: false, method: "delete" },
  { route: '/api/akademik/imtihan/:id', handler: _lazy_3kBR4P, lazy: true, middleware: false, method: "get" },
  { route: '/api/akademik/imtihan/:id', handler: _lazy_QgLNiS, lazy: true, middleware: false, method: "put" },
  { route: '/api/akademik/imtihan', handler: _lazy_NWIaF5, lazy: true, middleware: false, method: "get" },
  { route: '/api/akademik/imtihan', handler: _lazy_jESPbd, lazy: true, middleware: false, method: "post" },
  { route: '/api/akademik', handler: _lazy_CDb_IA, lazy: true, middleware: false, method: "get" },
  { route: '/api/akademik/subjects', handler: _lazy_JhZW1d, lazy: true, middleware: false, method: "get" },
  { route: '/api/akademik/subjects', handler: _lazy_pYIGbt, lazy: true, middleware: false, method: "post" },
  { route: '/api/akademik/subjects/:id', handler: _lazy_VAxyQd, lazy: true, middleware: false, method: "delete" },
  { route: '/api/akademik/subjects/:id', handler: _lazy_ruHfkG, lazy: true, middleware: false, method: "put" },
  { route: '/api/alumni/:id', handler: _lazy_ZEDSBh, lazy: true, middleware: false, method: "delete" },
  { route: '/api/alumni/:id', handler: _lazy_w6sfaC, lazy: true, middleware: false, method: "put" },
  { route: '/api/alumni/events', handler: _lazy_8nNkrj, lazy: true, middleware: false, method: "get" },
  { route: '/api/alumni/events', handler: _lazy_Mszvsw, lazy: true, middleware: false, method: "post" },
  { route: '/api/alumni/events/:id', handler: _lazy_G0WeLt, lazy: true, middleware: false, method: "delete" },
  { route: '/api/alumni/events/:id', handler: _lazy_PAXnBn, lazy: true, middleware: false, method: "put" },
  { route: '/api/alumni/graduations', handler: _lazy_cyikN3, lazy: true, middleware: false, method: "get" },
  { route: '/api/alumni/graduations', handler: _lazy_H1UKx4, lazy: true, middleware: false, method: "post" },
  { route: '/api/alumni/graduations/:id', handler: _lazy_dXxVlo, lazy: true, middleware: false, method: "delete" },
  { route: '/api/alumni/graduations/:id', handler: _lazy_95AFt5, lazy: true, middleware: false, method: "put" },
  { route: '/api/alumni', handler: _lazy_S5pO4k, lazy: true, middleware: false, method: "get" },
  { route: '/api/alumni', handler: _lazy_G2sSz7, lazy: true, middleware: false, method: "post" },
  { route: '/api/attendance/:id', handler: _lazy_KxQmhC, lazy: true, middleware: false, method: "delete" },
  { route: '/api/attendance/:id', handler: _lazy_Xk2gz_, lazy: true, middleware: false, method: "put" },
  { route: '/api/attendance', handler: _lazy_NyiKVl, lazy: true, middleware: false, method: "get" },
  { route: '/api/attendance', handler: _lazy_lJr6v0, lazy: true, middleware: false, method: "post" },
  { route: '/api/attendance/monthly/:id', handler: _lazy_stTtXD, lazy: true, middleware: false, method: "delete" },
  { route: '/api/attendance/monthly/:id', handler: _lazy_3bawVp, lazy: true, middleware: false, method: "put" },
  { route: '/api/attendance/monthly', handler: _lazy_uWexkr, lazy: true, middleware: false, method: "get" },
  { route: '/api/attendance/monthly', handler: _lazy_DWJWiy, lazy: true, middleware: false, method: "post" },
  { route: '/api/attendance/ocr', handler: _lazy_nSXt8O, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_ZyuPh5, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_K3uXMc, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/nis-login', handler: _lazy_5o1qIT, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/nis-map', handler: _lazy_q9quKN, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/nis-map/:nis', handler: _lazy_ZQn95s, lazy: true, middleware: false, method: "delete" },
  { route: '/api/auth/register-nis', handler: _lazy_FWppa4, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/register', handler: _lazy_JqYjLm, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/set-role', handler: _lazy_waz63G, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/users', handler: _lazy_VK2PMi, lazy: true, middleware: false, method: "get" },
  { route: '/api/backup/:name', handler: _lazy_gAx_1n, lazy: true, middleware: false, method: "delete" },
  { route: '/api/backup/download/:name', handler: _lazy_wIGHo4, lazy: true, middleware: false, method: "get" },
  { route: '/api/backup/drive/list', handler: _lazy_AcpL6B, lazy: true, middleware: false, method: "get" },
  { route: '/api/backup/drive/restore', handler: _lazy_OmBNT7, lazy: true, middleware: false, method: "post" },
  { route: '/api/backup/drive/upload', handler: _lazy_j2Ju8B, lazy: true, middleware: false, method: "post" },
  { route: '/api/backup', handler: _lazy_9u7OFb, lazy: true, middleware: false, method: "get" },
  { route: '/api/backup', handler: _lazy_tu8FzD, lazy: true, middleware: false, method: "post" },
  { route: '/api/backup/restore', handler: _lazy_74ctAC, lazy: true, middleware: false, method: "post" },
  { route: '/api/dashboard-stats', handler: _lazy_bN3Bib, lazy: true, middleware: false, method: "get" },
  { route: '/api/docs', handler: _lazy_4SoDxj, lazy: true, middleware: false, method: "get" },
  { route: '/api/extracurricular/arts', handler: _lazy_JjmK03, lazy: true, middleware: false, method: "get" },
  { route: '/api/extracurricular/arts', handler: _lazy_ggA6Uv, lazy: true, middleware: false, method: "post" },
  { route: '/api/extracurricular/arts/:id', handler: _lazy_QrbgL_, lazy: true, middleware: false, method: "delete" },
  { route: '/api/extracurricular/extracurricular', handler: _lazy_W8E_9w, lazy: true, middleware: false, method: "get" },
  { route: '/api/extracurricular/extracurricular', handler: _lazy_LKbB3V, lazy: true, middleware: false, method: "post" },
  { route: '/api/extracurricular/extracurricular/:id', handler: _lazy_WkznfW, lazy: true, middleware: false, method: "delete" },
  { route: '/api/extracurricular/extracurricular/:id', handler: _lazy_H0VJ1k, lazy: true, middleware: false, method: "put" },
  { route: '/api/extracurricular/hadroh', handler: _lazy_MYyC70, lazy: true, middleware: false, method: "get" },
  { route: '/api/extracurricular/hadroh', handler: _lazy_WajSGR, lazy: true, middleware: false, method: "post" },
  { route: '/api/extracurricular/hadroh/:id', handler: _lazy_PWRHqZ, lazy: true, middleware: false, method: "delete" },
  { route: '/api/extracurricular/hadroh/:id', handler: _lazy_u5lCig, lazy: true, middleware: false, method: "put" },
  { route: '/api/extracurricular/media', handler: _lazy_oepAVA, lazy: true, middleware: false, method: "get" },
  { route: '/api/extracurricular/media', handler: _lazy_5RG2m2, lazy: true, middleware: false, method: "post" },
  { route: '/api/extracurricular/media/:id', handler: _lazy_JWNBVp, lazy: true, middleware: false, method: "delete" },
  { route: '/api/extracurricular/media/:id', handler: _lazy_fNpIMl, lazy: true, middleware: false, method: "put" },
  { route: '/api/extracurricular/public-speaking', handler: _lazy_UZl17T, lazy: true, middleware: false, method: "get" },
  { route: '/api/extracurricular/public-speaking', handler: _lazy_yGCKFs, lazy: true, middleware: false, method: "post" },
  { route: '/api/extracurricular/public-speaking/:id', handler: _lazy_QJhCyv, lazy: true, middleware: false, method: "delete" },
  { route: '/api/extracurricular/public-speaking/:id', handler: _lazy_hhm_VI, lazy: true, middleware: false, method: "put" },
  { route: '/api/guru/:id', handler: _lazy_CmuFf8, lazy: true, middleware: false, method: "delete" },
  { route: '/api/guru/:id', handler: _lazy_yAM7Ug, lazy: true, middleware: false, method: "put" },
  { route: '/api/guru', handler: _lazy_mPyC0y, lazy: true, middleware: false, method: "get" },
  { route: '/api/guru', handler: _lazy_9PzUia, lazy: true, middleware: false, method: "post" },
  { route: '/api/health', handler: _lazy_DWL1sA, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/fasting', handler: _lazy_ClTre9, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/fasting', handler: _lazy_K6fr4G, lazy: true, middleware: false, method: "post" },
  { route: '/api/ibadah/fasting/:id', handler: _lazy_7GNzZa, lazy: true, middleware: false, method: "delete" },
  { route: '/api/ibadah/infaq', handler: _lazy_m791XU, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/infaq', handler: _lazy_GtnXIJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/ibadah/infaq/:id', handler: _lazy_0di72x, lazy: true, middleware: false, method: "delete" },
  { route: '/api/ibadah/prayer-attendance', handler: _lazy_aAqibw, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/prayer-attendance', handler: _lazy_O1HdYz, lazy: true, middleware: false, method: "post" },
  { route: '/api/ibadah/prayer-attendance/:id', handler: _lazy_F_4Ove, lazy: true, middleware: false, method: "delete" },
  { route: '/api/ibadah/prayer-attendance/:id', handler: _lazy_Z6sTVw, lazy: true, middleware: false, method: "put" },
  { route: '/api/ibadah/tahajjud', handler: _lazy_EEHAKw, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/tahajjud', handler: _lazy_taGfqy, lazy: true, middleware: false, method: "post" },
  { route: '/api/ibadah/tahajjud/:id', handler: _lazy_EygK7t, lazy: true, middleware: false, method: "delete" },
  { route: '/api/ibadah/tahajjud/:id', handler: _lazy_9BP1H6, lazy: true, middleware: false, method: "put" },
  { route: '/api/ibadah/wirid', handler: _lazy_Cz9sCn, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/wirid', handler: _lazy_F74bmq, lazy: true, middleware: false, method: "post" },
  { route: '/api/ibadah/wirid/:id', handler: _lazy_as7GOo, lazy: true, middleware: false, method: "delete" },
  { route: '/api/ibadah/zakat', handler: _lazy_aiAf65, lazy: true, middleware: false, method: "get" },
  { route: '/api/ibadah/zakat', handler: _lazy_DW2ujs, lazy: true, middleware: false, method: "post" },
  { route: '/api/ibadah/zakat/:id', handler: _lazy_JfLh7m, lazy: true, middleware: false, method: "delete" },
  { route: '/api/inventaris/:id', handler: _lazy_JCQj87, lazy: true, middleware: false, method: "delete" },
  { route: '/api/inventaris/:id', handler: _lazy_rOfwZv, lazy: true, middleware: false, method: "put" },
  { route: '/api/inventaris', handler: _lazy_5Awnqv, lazy: true, middleware: false, method: "get" },
  { route: '/api/inventaris', handler: _lazy_szoR86, lazy: true, middleware: false, method: "post" },
  { route: '/api/inventaris/loans', handler: _lazy_oeQWVx, lazy: true, middleware: false, method: "get" },
  { route: '/api/inventaris/loans', handler: _lazy_R2dh_c, lazy: true, middleware: false, method: "post" },
  { route: '/api/inventaris/loans/:id', handler: _lazy_a3uuT7, lazy: true, middleware: false, method: "delete" },
  { route: '/api/inventaris/loans/:id', handler: _lazy_Gd1nRg, lazy: true, middleware: false, method: "patch" },
  { route: '/api/invoices', handler: _lazy_fQGHv_, lazy: true, middleware: false, method: "get" },
  { route: '/api/invoices', handler: _lazy_Fl5eD0, lazy: true, middleware: false, method: "post" },
  { route: '/api/invoices/:id', handler: _lazy_wFQc_w, lazy: true, middleware: false, method: "delete" },
  { route: '/api/invoices/:id', handler: _lazy_hRj6S5, lazy: true, middleware: false, method: "get" },
  { route: '/api/invoices/:id', handler: _lazy_KuEisG, lazy: true, middleware: false, method: "put" },
  { route: '/api/izin/:id', handler: _lazy_G872YE, lazy: true, middleware: false, method: "delete" },
  { route: '/api/izin/:id', handler: _lazy_zLgzMf, lazy: true, middleware: false, method: "patch" },
  { route: '/api/izin', handler: _lazy_4DuXmF, lazy: true, middleware: false, method: "get" },
  { route: '/api/izin', handler: _lazy_icnG1s, lazy: true, middleware: false, method: "post" },
  { route: '/api/jadwal/:id', handler: _lazy_VaTf46, lazy: true, middleware: false, method: "delete" },
  { route: '/api/jadwal/:id', handler: _lazy_BoNKej, lazy: true, middleware: false, method: "put" },
  { route: '/api/jadwal', handler: _lazy_Rv5Nm0, lazy: true, middleware: false, method: "get" },
  { route: '/api/jadwal', handler: _lazy_IVCZIX, lazy: true, middleware: false, method: "post" },
  { route: '/api/kesehatan/growth', handler: _lazy_qjNcGD, lazy: true, middleware: false, method: "get" },
  { route: '/api/kesehatan/growth', handler: _lazy_pJd7gY, lazy: true, middleware: false, method: "post" },
  { route: '/api/kesehatan/growth/:id', handler: _lazy_RNtMqF, lazy: true, middleware: false, method: "delete" },
  { route: '/api/kesehatan/medical-records', handler: _lazy_PTi19g, lazy: true, middleware: false, method: "get" },
  { route: '/api/kesehatan/medical-records', handler: _lazy_Fpc0eV, lazy: true, middleware: false, method: "post" },
  { route: '/api/kesehatan/medical-records/:id', handler: _lazy_ETcivS, lazy: true, middleware: false, method: "delete" },
  { route: '/api/kesehatan/medical-records/:id', handler: _lazy_f4nf6n, lazy: true, middleware: false, method: "put" },
  { route: '/api/kesehatan/nutrition', handler: _lazy_EI4RLd, lazy: true, middleware: false, method: "get" },
  { route: '/api/kesehatan/nutrition', handler: _lazy_xKd_It, lazy: true, middleware: false, method: "post" },
  { route: '/api/kesehatan/nutrition/:id', handler: _lazy_gEQlrv, lazy: true, middleware: false, method: "delete" },
  { route: '/api/kesehatan/sanitation', handler: _lazy_PQKM0q, lazy: true, middleware: false, method: "get" },
  { route: '/api/kesehatan/sanitation', handler: _lazy_bP7wGr, lazy: true, middleware: false, method: "post" },
  { route: '/api/kesehatan/sanitation/:id', handler: _lazy_5QIVND, lazy: true, middleware: false, method: "delete" },
  { route: '/api/keuangan/salaries', handler: _lazy_tKfRvf, lazy: true, middleware: false, method: "get" },
  { route: '/api/keuangan/salaries', handler: _lazy_6zk84r, lazy: true, middleware: false, method: "post" },
  { route: '/api/keuangan/salaries/:id', handler: _lazy_9s0Whc, lazy: true, middleware: false, method: "delete" },
  { route: '/api/keuangan/salaries/:id', handler: _lazy_lZw83t, lazy: true, middleware: false, method: "put" },
  { route: '/api/keuangan/scholarships', handler: _lazy_N5bK5F, lazy: true, middleware: false, method: "get" },
  { route: '/api/keuangan/scholarships', handler: _lazy_YGSbZ6, lazy: true, middleware: false, method: "post" },
  { route: '/api/keuangan/scholarships/:id', handler: _lazy_cZxzxx, lazy: true, middleware: false, method: "delete" },
  { route: '/api/keuangan/scholarships/:id', handler: _lazy_qQLJe0, lazy: true, middleware: false, method: "put" },
  { route: '/api/keuangan/spp-config', handler: _lazy_cLk6gn, lazy: true, middleware: false, method: "get" },
  { route: '/api/keuangan/spp-config', handler: _lazy_zKeAJj, lazy: true, middleware: false, method: "post" },
  { route: '/api/keuangan/spp-config/:id', handler: _lazy_7etLvM, lazy: true, middleware: false, method: "delete" },
  { route: '/api/keuangan/spp-config/:id', handler: _lazy_0hFPak, lazy: true, middleware: false, method: "put" },
  { route: '/api/khidmah/:id', handler: _lazy__BnjsD, lazy: true, middleware: false, method: "delete" },
  { route: '/api/khidmah/:id', handler: _lazy_vfHQkp, lazy: true, middleware: false, method: "put" },
  { route: '/api/khidmah', handler: _lazy_eJqZX1, lazy: true, middleware: false, method: "get" },
  { route: '/api/khidmah', handler: _lazy_l3MgfU, lazy: true, middleware: false, method: "post" },
  { route: '/api/koperasi/items', handler: _lazy_412SCx, lazy: true, middleware: false, method: "get" },
  { route: '/api/koperasi/items', handler: _lazy_Sj8zbG, lazy: true, middleware: false, method: "post" },
  { route: '/api/koperasi/items/:id', handler: _lazy_r6C_Ax, lazy: true, middleware: false, method: "delete" },
  { route: '/api/koperasi/items/:id', handler: _lazy_OlQOgn, lazy: true, middleware: false, method: "put" },
  { route: '/api/koperasi/transactions', handler: _lazy_MjiQhF, lazy: true, middleware: false, method: "get" },
  { route: '/api/koperasi/transactions', handler: _lazy_59FbQ_, lazy: true, middleware: false, method: "post" },
  { route: '/api/koperasi/transactions/:id', handler: _lazy_ao3Jj4, lazy: true, middleware: false, method: "delete" },
  { route: '/api/laporan/financial', handler: _lazy_TvSrbI, lazy: true, middleware: false, method: "get" },
  { route: '/api/laporan/generate', handler: _lazy_UosqaE, lazy: true, middleware: false, method: "post" },
  { route: '/api/laporan', handler: _lazy_kKFuef, lazy: true, middleware: false, method: "get" },
  { route: '/api/laporan/raport/:studentId', handler: _lazy_rdjcYf, lazy: true, middleware: false, method: "get" },
  { route: '/api/laporan/receipt/:invoiceId', handler: _lazy_aLdSa2, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/academic-years', handler: _lazy_c3KmDY, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/academic-years', handler: _lazy_ijqUSv, lazy: true, middleware: false, method: "post" },
  { route: '/api/master-data/academic-years/:id', handler: _lazy_jCsMOw, lazy: true, middleware: false, method: "delete" },
  { route: '/api/master-data/academic-years/:id', handler: _lazy_ipqCcQ, lazy: true, middleware: false, method: "put" },
  { route: '/api/master-data/classes', handler: _lazy_IN6nT1, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/classes', handler: _lazy_ZztxtI, lazy: true, middleware: false, method: "post" },
  { route: '/api/master-data/classes/:id', handler: _lazy_JTbu02, lazy: true, middleware: false, method: "delete" },
  { route: '/api/master-data/classes/:id', handler: _lazy_RXfoTg, lazy: true, middleware: false, method: "put" },
  { route: '/api/master-data/dormitories', handler: _lazy_H6oOFL, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/dormitories', handler: _lazy_cO7TnM, lazy: true, middleware: false, method: "post" },
  { route: '/api/master-data/dormitories/:id', handler: _lazy_VJTBvc, lazy: true, middleware: false, method: "delete" },
  { route: '/api/master-data/dormitories/:id', handler: _lazy_tzmZoX, lazy: true, middleware: false, method: "put" },
  { route: '/api/master-data/dormitories/:id/rooms', handler: _lazy_KtwPOz, lazy: true, middleware: false, method: "post" },
  { route: '/api/master-data/dormitories/:id/rooms/:roomId', handler: _lazy_qCWPJX, lazy: true, middleware: false, method: "delete" },
  { route: '/api/master-data/periods', handler: _lazy_WbESQk, lazy: true, middleware: false, method: "get" },
  { route: '/api/master-data/periods', handler: _lazy_iXErac, lazy: true, middleware: false, method: "post" },
  { route: '/api/master-data/periods/:id', handler: _lazy_XefFhX, lazy: true, middleware: false, method: "delete" },
  { route: '/api/master-data/periods/:id', handler: _lazy_eUjWB8, lazy: true, middleware: false, method: "put" },
  { route: '/api/mutasi/:id', handler: _lazy_0uLVdt, lazy: true, middleware: false, method: "delete" },
  { route: '/api/mutasi/:id', handler: _lazy_j2CL97, lazy: true, middleware: false, method: "patch" },
  { route: '/api/mutasi', handler: _lazy_j7VDH2, lazy: true, middleware: false, method: "get" },
  { route: '/api/mutasi', handler: _lazy_7kKhMn, lazy: true, middleware: false, method: "post" },
  { route: '/api/notifikasi/:id', handler: _lazy_b074Mf, lazy: true, middleware: false, method: "delete" },
  { route: '/api/notifikasi/:id', handler: _lazy_j85pXC, lazy: true, middleware: false, method: "get" },
  { route: '/api/notifikasi', handler: _lazy_J_hzQV, lazy: true, middleware: false, method: "get" },
  { route: '/api/notifikasi', handler: _lazy_6jetfu, lazy: true, middleware: false, method: "post" },
  { route: '/api/ocr/analyze', handler: _lazy_txT0FI, lazy: true, middleware: false, method: "post" },
  { route: '/api/payments', handler: _lazy_S2M0ab, lazy: true, middleware: false, method: "get" },
  { route: '/api/payments', handler: _lazy_PTi1Wf, lazy: true, middleware: false, method: "post" },
  { route: '/api/psb/registrations', handler: _lazy_0a1nQM, lazy: true, middleware: false, method: "get" },
  { route: '/api/psb/registrations', handler: _lazy_nrQFv5, lazy: true, middleware: false, method: "post" },
  { route: '/api/psb/registrations/:id', handler: _lazy_vjRP3L, lazy: true, middleware: false, method: "delete" },
  { route: '/api/psb/registrations/:id', handler: _lazy_za4BJR, lazy: true, middleware: false, method: "patch" },
  { route: '/api/psb/results', handler: _lazy_qJFhrE, lazy: true, middleware: false, method: "get" },
  { route: '/api/psb/results', handler: _lazy_7FMbty, lazy: true, middleware: false, method: "post" },
  { route: '/api/psb/results/:id', handler: _lazy_XIhHOA, lazy: true, middleware: false, method: "delete" },
  { route: '/api/psb/results/:id', handler: _lazy_JKRlO8, lazy: true, middleware: false, method: "patch" },
  { route: '/api/psb/tests', handler: _lazy_BIlkVZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/psb/tests', handler: _lazy_juPAj2, lazy: true, middleware: false, method: "post" },
  { route: '/api/psb/tests/:id', handler: _lazy_O39IOE, lazy: true, middleware: false, method: "delete" },
  { route: '/api/psb/tests/:id', handler: _lazy_f0kpHJ, lazy: true, middleware: false, method: "patch" },
  { route: '/api/reward/:id', handler: _lazy_waRWZP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/reward/:id', handler: _lazy_m8pRHK, lazy: true, middleware: false, method: "put" },
  { route: '/api/reward', handler: _lazy_mFHobd, lazy: true, middleware: false, method: "get" },
  { route: '/api/reward', handler: _lazy_nAPq5Z, lazy: true, middleware: false, method: "post" },
  { route: '/api/search', handler: _lazy_3dP0Vo, lazy: true, middleware: false, method: "get" },
  { route: '/api/students', handler: _lazy_EF4Atz, lazy: true, middleware: false, method: "get" },
  { route: '/api/students', handler: _lazy_FDR_LS, lazy: true, middleware: false, method: "post" },
  { route: '/api/students/:id', handler: _lazy_W2MLGf, lazy: true, middleware: false, method: "delete" },
  { route: '/api/students/:id', handler: _lazy_123Cgb, lazy: true, middleware: false, method: "get" },
  { route: '/api/students/:id', handler: _lazy_Hcs7g8, lazy: true, middleware: false, method: "put" },
  { route: '/api/students/:id/violations', handler: _lazy_d7wpyu, lazy: true, middleware: false, method: "get" },
  { route: '/api/students/:id/violations', handler: _lazy_8dorBC, lazy: true, middleware: false, method: "post" },
  { route: '/api/tahfidz/murojaah', handler: _lazy_rZBp_Y, lazy: true, middleware: false, method: "get" },
  { route: '/api/tahfidz/murojaah', handler: _lazy_gbZxWn, lazy: true, middleware: false, method: "post" },
  { route: '/api/tahfidz/murojaah/:id', handler: _lazy_dL_p9q, lazy: true, middleware: false, method: "delete" },
  { route: '/api/tahfidz/ziyadah', handler: _lazy_EFfnET, lazy: true, middleware: false, method: "get" },
  { route: '/api/tahfidz/ziyadah', handler: _lazy_GJiam2, lazy: true, middleware: false, method: "post" },
  { route: '/api/tahfidz/ziyadah/:id', handler: _lazy_Y4hD1b, lazy: true, middleware: false, method: "delete" },
  { route: '/api/tahfidz/ziyadah/:id', handler: _lazy_Iu3sLt, lazy: true, middleware: false, method: "put" },
  { route: '/api/todos/:id', handler: _lazy_wc60pA, lazy: true, middleware: false, method: "delete" },
  { route: '/api/todos/:id', handler: _lazy_ZSIRkl, lazy: true, middleware: false, method: "put" },
  { route: '/api/todos', handler: _lazy_gG8DNj, lazy: true, middleware: false, method: "get" },
  { route: '/api/todos', handler: _lazy_DxhRst, lazy: true, middleware: false, method: "post" },
  { route: '/api/tools/import', handler: _lazy_yXZ5gM, lazy: true, middleware: false, method: "post" },
  { route: '/api/tools/template', handler: _lazy_xfGmFi, lazy: true, middleware: false, method: "get" },
  { route: '/api/uptime/check', handler: _lazy_iiSiZC, lazy: true, middleware: false, method: "get" },
  { route: '/api/uptime/logs', handler: _lazy_3V5QVH, lazy: true, middleware: false, method: "get" },
  { route: '/__nuxt_error', handler: _lazy_thap6N, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_thap6N, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

export { $fetch as $, getResponseStatus as A, parseURL as B, decodePath as C, hasProtocol as D, isScriptProtocol as E, joinURL as F, klona as G, sanitizeStatusCode as H, getRequestHeader as I, destr as J, isEqual as K, getContext as L, getCookie as M, defu as N, createHooks as O, executeAsync as P, withTrailingSlash as Q, withoutTrailingSlash as R, getDatabase as a, getQuery as b, getRouterParam as c, defineEventHandler as d, createError$1 as e, getRouterParams as f, getRouteRulesForPath as g, getAuth as h, deleteCookie as i, createSessionToken as j, setHeader as k, useRuntimeConfig as l, getDefaultExportFromNamespaceIfNotNamed as m, getDefaultExportFromCjs as n, require$$1$2 as o, parseQuery as p, joinRelativeURL as q, readBody as r, setCookie as s, toNodeListener as t, useNitroApp as u, encodePath as v, withQuery as w, defineRenderHandler as x, getRouteRules as y, getResponseStatusText as z };
//# sourceMappingURL=nitro.mjs.map
