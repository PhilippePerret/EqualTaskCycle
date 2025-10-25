var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// public/js/dom.js
function DGet(selector, container) {
  if (container === undefined) {
    container = document.body;
  }
  return container.querySelector(selector);
}
function stopEvent(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}

// public/js/constants.js
var PORT = 3002, HOST;
var init_constants = __esm(() => {
  HOST = `http://localhost:${PORT}/`;
});

// public/js/flash.js
var exports_flash = {};
__export(exports_flash, {
  Flash: () => Flash
});

class Flash {
  static init() {}
  static checkServerMessages() {
    const divMsg = DGet("div#flash-group div#flash-info");
    if (divMsg) {
      const content = DGet("p.message", divMsg).innerHTML;
      DGet("button", divMsg).remove();
      this.temporize(divMsg, this.calcReadingTime(content));
    }
  }
  static temporize(domMessage, readingTime) {
    this.timer = setTimeout(this.removeServerMessage.bind(this, domMessage), 2000 + readingTime);
  }
  static removeServerMessage(domE, ev) {
    domE.remove();
    this.timer && clearTimeout(this.timer);
    delete this.timer;
  }
  static calcReadingTime(str) {
    return str.split(" ").length * 300 * 4;
  }
  static notice(message) {
    this.buildMessage({ content: message, type: "notice" });
  }
  static info(message) {
    return this.notice(message);
  }
  static success(message) {
    this.buildMessage({ content: message, type: "success" });
  }
  static warning(message) {
    this.buildMessage({ content: message, type: "warning" });
  }
  static error(message) {
    this.buildMessage({ content: message, type: "error" });
  }
  static buildMessage(data) {
    new FlashMessage(data);
  }
  static removeMessage(message) {
    if (message.type != "error") {
      clearTimeout(message.timer);
      message.timer = null;
    }
    message.obj.remove();
    message = undefined;
  }
  static get conteneur() {
    return this._maincont || (this._maincont = DGet("#flash-group"));
  }
}

class FlashMessage {
  constructor(data) {
    this.data = data;
    this.build();
    this.show();
    if (this.type != "error")
      this.temporize();
    this.observe();
  }
  build() {
    const msg = document.createElement("DIV");
    msg.className = `flash-message ${this.type}`;
    msg.innerHTML = this.content;
    this.obj = msg;
  }
  show() {
    Flash.conteneur.appendChild(this.obj);
  }
  observe() {
    this.obj.addEventListener("click", this.onClick.bind(this));
  }
  onClick(ev) {
    Flash.removeMessage(this);
  }
  temporize() {
    this.timer = setTimeout(Flash.removeMessage.bind(Flash, this), 2000 + this.readingTime);
  }
  get readingTime() {
    return Flash.calcReadingTime(this.content);
  }
  get content() {
    return this.data.content;
  }
  get type() {
    return this.data.type;
  }
}
var init_flash = () => {};

// node_modules/marked/lib/marked.esm.js
function L() {
  return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
}
function G(u) {
  T = u;
}
function h(u, e = "") {
  let t = typeof u == "string" ? u : u.source, n = { replace: (r, i) => {
    let s = typeof i == "string" ? i : i.source;
    return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
  }, getRegex: () => new RegExp(t, e) };
  return n;
}
function w(u, e) {
  if (e) {
    if (m.escapeTest.test(u))
      return u.replace(m.escapeReplace, ge);
  } else if (m.escapeTestNoEncode.test(u))
    return u.replace(m.escapeReplaceNoEncode, ge);
  return u;
}
function J(u) {
  try {
    u = encodeURI(u).replace(m.percentDecode, "%");
  } catch {
    return null;
  }
  return u;
}
function V(u, e) {
  let t = u.replace(m.findPipe, (i, s, o) => {
    let a = false, l = s;
    for (;--l >= 0 && o[l] === "\\"; )
      a = !a;
    return a ? "|" : " |";
  }), n = t.split(m.splitPipe), r = 0;
  if (n[0].trim() || n.shift(), n.length > 0 && !n.at(-1)?.trim() && n.pop(), e)
    if (n.length > e)
      n.splice(e);
    else
      for (;n.length < e; )
        n.push("");
  for (;r < n.length; r++)
    n[r] = n[r].trim().replace(m.slashPipe, "|");
  return n;
}
function z(u, e, t) {
  let n = u.length;
  if (n === 0)
    return "";
  let r = 0;
  for (;r < n; ) {
    let i = u.charAt(n - r - 1);
    if (i === e && !t)
      r++;
    else if (i !== e && t)
      r++;
    else
      break;
  }
  return u.slice(0, n - r);
}
function fe(u, e) {
  if (u.indexOf(e[1]) === -1)
    return -1;
  let t = 0;
  for (let n = 0;n < u.length; n++)
    if (u[n] === "\\")
      n++;
    else if (u[n] === e[0])
      t++;
    else if (u[n] === e[1] && (t--, t < 0))
      return n;
  return t > 0 ? -2 : -1;
}
function me(u, e, t, n, r) {
  let i = e.href, s = e.title || null, o = u[1].replace(r.other.outputLinkReplace, "$1");
  n.state.inLink = true;
  let a = { type: u[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: o, tokens: n.inlineTokens(o) };
  return n.state.inLink = false, a;
}
function Ve(u, e, t) {
  let n = u.match(t.other.indentCodeCompensation);
  if (n === null)
    return e;
  let r = n[1];
  return e.split(`
`).map((i) => {
    let s = i.match(t.other.beginningSpace);
    if (s === null)
      return i;
    let [o] = s;
    return o.length >= r.length ? i.slice(r.length) : i;
  }).join(`
`);
}
function k(u3, e) {
  return _.parse(u3, e);
}
var T, I, m, be, Re, Te, E, Oe, F, ie, oe, we, j, ye, Q, Pe, Se, v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", U, $e, ae, _e, K, re, Le, Me, ze, Ae, le, Ie, D, W, ue, Ee, pe, Ce, Be, qe, ce, ve, De, he = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", He, Ze, Ge, Ne, Fe, je, Qe, q, Ue, de, ke, Ke, se, X, We, N, Xe, C, M, Je, ge = (u) => Je[u], y = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0)
      return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z(n, `
`) };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let n = t[0], r = Ve(n, t[3] || "", this.rules);
      return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let n = t[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let r = z(n, "#");
        (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
      }
      return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t)
      return { type: "hr", raw: z(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let n = z(t[0], `
`).split(`
`), r = "", i = "", s = [];
      for (;n.length > 0; ) {
        let o = false, a = [], l;
        for (l = 0;l < n.length; l++)
          if (this.rules.other.blockquoteStart.test(n[l]))
            a.push(n[l]), o = true;
          else if (!o)
            a.push(n[l]);
          else
            break;
        n = n.slice(l);
        let c = a.join(`
`), p = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        r = r ? `${r}
${c}` : c, i = i ? `${i}
${p}` : p;
        let g = this.lexer.state.top;
        if (this.lexer.state.top = true, this.lexer.blockTokens(p, s, true), this.lexer.state.top = g, n.length === 0)
          break;
        let d = s.at(-1);
        if (d?.type === "code")
          break;
        if (d?.type === "blockquote") {
          let R = d, f = R.raw + `
` + n.join(`
`), O = this.blockquote(f);
          s[s.length - 1] = O, r = r.substring(0, r.length - R.raw.length) + O.raw, i = i.substring(0, i.length - R.text.length) + O.text;
          break;
        } else if (d?.type === "list") {
          let R = d, f = R.raw + `
` + n.join(`
`), O = this.list(f);
          s[s.length - 1] = O, r = r.substring(0, r.length - d.raw.length) + O.raw, i = i.substring(0, i.length - R.raw.length) + O.raw, n = f.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: r, tokens: s, text: i };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
      n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
      let s = this.rules.other.listItemRegex(n), o = false;
      for (;e; ) {
        let l = false, c = "", p = "";
        if (!(t = s.exec(e)) || this.rules.block.hr.test(e))
          break;
        c = t[0], e = e.substring(c.length);
        let g = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (H) => " ".repeat(3 * H.length)), d = e.split(`
`, 1)[0], R = !g.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, p = g.trimStart()) : R ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, p = g.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(d) && (c += d + `
`, e = e.substring(d.length + 1), l = true), !l) {
          let H = this.rules.other.nextBulletRegex(f), ee = this.rules.other.hrRegex(f), te = this.rules.other.fencesBeginRegex(f), ne = this.rules.other.headingBeginRegex(f), xe = this.rules.other.htmlBeginRegex(f);
          for (;e; ) {
            let Z = e.split(`
`, 1)[0], A;
            if (d = Z, this.options.pedantic ? (d = d.replace(this.rules.other.listReplaceNesting, "  "), A = d) : A = d.replace(this.rules.other.tabCharGlobal, "    "), te.test(d) || ne.test(d) || xe.test(d) || H.test(d) || ee.test(d))
              break;
            if (A.search(this.rules.other.nonSpaceChar) >= f || !d.trim())
              p += `
` + A.slice(f);
            else {
              if (R || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(g) || ne.test(g) || ee.test(g))
                break;
              p += `
` + d;
            }
            !R && !d.trim() && (R = true), c += Z + `
`, e = e.substring(Z.length + 1), g = A.slice(f);
          }
        }
        i.loose || (o ? i.loose = true : this.rules.other.doubleBlankLine.test(c) && (o = true));
        let O = null, Y;
        this.options.gfm && (O = this.rules.other.listIsTask.exec(p), O && (Y = O[0] !== "[ ] ", p = p.replace(this.rules.other.listReplaceTask, ""))), i.items.push({ type: "list_item", raw: c, task: !!O, checked: Y, loose: false, text: p, tokens: [] }), i.raw += c;
      }
      let a = i.items.at(-1);
      if (a)
        a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
      else
        return;
      i.raw = i.raw.trimEnd();
      for (let l = 0;l < i.items.length; l++)
        if (this.lexer.state.top = false, i.items[l].tokens = this.lexer.blockTokens(i.items[l].text, []), !i.loose) {
          let c = i.items[l].tokens.filter((g) => g.type === "space"), p = c.length > 0 && c.some((g) => this.rules.other.anyLine.test(g.raw));
          i.loose = p;
        }
      if (i.loose)
        for (let l = 0;l < i.items.length; l++)
          i.items[l].loose = true;
      return i;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t)
      return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: n, raw: t[0], href: r, title: i };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2]))
      return;
    let n = V(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
    if (n.length === r.length) {
      for (let o of r)
        this.rules.other.tableAlignRight.test(o) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? s.align.push("left") : s.align.push(null);
      for (let o = 0;o < n.length; o++)
        s.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: s.align[o] });
      for (let o of i)
        s.rows.push(V(o, s.header.length).map((a, l) => ({ text: a, tokens: this.lexer.inline(a), header: false, align: s.align[l] })));
      return s;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t)
      return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t)
      return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t)
      return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let n = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n))
          return;
        let s = z(n.slice(0, -1), "\\");
        if ((n.length - s.length) % 2 === 0)
          return;
      } else {
        let s = fe(t[2], "()");
        if (s === -2)
          return;
        if (s > -1) {
          let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
          t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, a).trim(), t[3] = "";
        }
      }
      let r = t[2], i = "";
      if (this.options.pedantic) {
        let s = this.rules.other.pedanticHrefTitle.exec(r);
        s && (r = s[1], i = s[3]);
      } else
        i = t[3] ? t[3].slice(1, -1) : "";
      return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), me(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let n;
    if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
      let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
      if (!i) {
        let s = n[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return me(n, i, n[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, n = "") {
    let r = this.rules.inline.emStrongLDelim.exec(e);
    if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric))
      return;
    if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      let s = [...r[0]].length - 1, o, a, l = s, c = 0, p = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (p.lastIndex = 0, t = t.slice(-1 * e.length + s);(r = p.exec(t)) != null; ) {
        if (o = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o)
          continue;
        if (a = [...o].length, r[3] || r[4]) {
          l += a;
          continue;
        } else if ((r[5] || r[6]) && s % 3 && !((s + a) % 3)) {
          c += a;
          continue;
        }
        if (l -= a, l > 0)
          continue;
        a = Math.min(a, a + l + c);
        let g = [...r[0]][0].length, d = e.slice(0, s + r.index + g + a);
        if (Math.min(s, a) % 2) {
          let f = d.slice(1, -1);
          return { type: "em", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
        }
        let R = d.slice(2, -2);
        return { type: "strong", raw: d, text: R, tokens: this.lexer.inlineTokens(R) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t)
      return { type: "br", raw: t[0] };
  }
  del(e) {
    let t = this.rules.inline.del.exec(e);
    if (t)
      return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let n, r;
      return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let n, r;
      if (t[2] === "@")
        n = t[0], r = "mailto:" + n;
      else {
        let i;
        do
          i = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (i !== t[0]);
        n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
      }
      return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: n };
    }
  }
}, x = class u {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(e) {
    this.tokens = [], this.tokens.links = Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y, this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
    let t = { other: m, block: C.normal, inline: M.normal };
    this.options.pedantic ? (t.block = C.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = C.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: C, inline: M };
  }
  static lex(e, t) {
    return new u(t).lex(e);
  }
  static lexInline(e, t) {
    return new u(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0;t < this.inlineQueue.length; t++) {
      let n = this.inlineQueue[t];
      this.inlineTokens(n.src, n.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], n = false) {
    for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, ""));e; ) {
      let r;
      if (this.options.extensions?.block?.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false))
        continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        r.raw.length === 1 && s !== undefined ? s.raw += `
` : t.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "paragraph" || s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, t.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), t.push(r);
        continue;
      }
      let i = e;
      if (this.options.extensions?.startBlock) {
        let s = 1 / 0, o = e.slice(1), a;
        this.options.extensions.startBlock.forEach((l) => {
          a = l.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (s = Math.min(s, a));
        }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(i))) {
        let s = t.at(-1);
        n && s?.type === "paragraph" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let s = t.at(-1);
        s?.type === "text" ? (s.raw += (s.raw.endsWith(`
`) ? "" : `
`) + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
        continue;
      }
      if (e) {
        let s = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(s);
          break;
        } else
          throw new Error(s);
      }
    }
    return this.state.top = true, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    let n = e, r = null;
    if (this.tokens.links) {
      let o = Object.keys(this.tokens.links);
      if (o.length > 0)
        for (;(r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; )
          o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (;(r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; )
      n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (;(r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; )
      n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    n = this.options.hooks?.emStrongMask?.call({ lexer: this }, n) ?? n;
    let i = false, s = "";
    for (;e; ) {
      i || (s = ""), i = false;
      let o;
      if (this.options.extensions?.inline?.some((l) => (o = l.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false))
        continue;
      if (o = this.tokenizer.escape(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.tag(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.link(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(o.raw.length);
        let l = t.at(-1);
        o.type === "text" && l?.type === "text" ? (l.raw += o.raw, l.text += o.text) : t.push(o);
        continue;
      }
      if (o = this.tokenizer.emStrong(e, n, s)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.codespan(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.br(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.del(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (o = this.tokenizer.autolink(e)) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      if (!this.state.inLink && (o = this.tokenizer.url(e))) {
        e = e.substring(o.raw.length), t.push(o);
        continue;
      }
      let a = e;
      if (this.options.extensions?.startInline) {
        let l = 1 / 0, c = e.slice(1), p;
        this.options.extensions.startInline.forEach((g) => {
          p = g.call({ lexer: this }, c), typeof p == "number" && p >= 0 && (l = Math.min(l, p));
        }), l < 1 / 0 && l >= 0 && (a = e.substring(0, l + 1));
      }
      if (o = this.tokenizer.inlineText(a)) {
        e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (s = o.raw.slice(-1)), i = true;
        let l = t.at(-1);
        l?.type === "text" ? (l.raw += o.raw, l.text += o.text) : t.push(o);
        continue;
      }
      if (e) {
        let l = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(l);
          break;
        } else
          throw new Error(l);
      }
    }
    return t;
  }
}, P = class {
  options;
  parser;
  constructor(e) {
    this.options = e || T;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: n }) {
    let r = (t || "").match(m.notSpaceStart)?.[0], i = e.replace(m.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, true)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let { ordered: t, start: n } = e, r = "";
    for (let o = 0;o < e.items.length; o++) {
      let a = e.items[o];
      r += this.listitem(a);
    }
    let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + i + s + `>
` + r + "</" + i + `>
`;
  }
  listitem(e) {
    let t = "";
    if (e.task) {
      let n = this.checkbox({ checked: !!e.checked });
      e.loose ? e.tokens[0]?.type === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + w(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = true)) : e.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: true }) : t += n + " ";
    }
    return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", n = "";
    for (let i = 0;i < e.header.length; i++)
      n += this.tablecell(e.header[i]);
    t += this.tablerow({ text: n });
    let r = "";
    for (let i = 0;i < e.rows.length; i++) {
      let s = e.rows[i];
      n = "";
      for (let o = 0;o < s.length; o++)
        n += this.tablecell(s[o]);
      r += this.tablerow({ text: n });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
    return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${w(e, true)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: n }) {
    let r = this.parser.parseInline(n), i = J(e);
    if (i === null)
      return r;
    e = i;
    let s = '<a href="' + e + '"';
    return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: e, title: t, text: n, tokens: r }) {
    r && (n = this.parser.parseInline(r, this.parser.textRenderer));
    let i = J(e);
    if (i === null)
      return w(n);
    e = i;
    let s = `<img src="${e}" alt="${n}"`;
    return t && (s += ` title="${w(t)}"`), s += ">", s;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : ("escaped" in e) && e.escaped ? e.text : w(e.text);
  }
}, $ = class {
  strong({ text: e }) {
    return e;
  }
  em({ text: e }) {
    return e;
  }
  codespan({ text: e }) {
    return e;
  }
  del({ text: e }) {
    return e;
  }
  html({ text: e }) {
    return e;
  }
  text({ text: e }) {
    return e;
  }
  link({ text: e }) {
    return "" + e;
  }
  image({ text: e }) {
    return "" + e;
  }
  br() {
    return "";
  }
}, b = class u2 {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || T, this.options.renderer = this.options.renderer || new P, this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $;
  }
  static parse(e, t) {
    return new u2(t).parse(e);
  }
  static parseInline(e, t) {
    return new u2(t).parseInline(e);
  }
  parse(e, t = true) {
    let n = "";
    for (let r = 0;r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = i, a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          n += a || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "space": {
          n += this.renderer.space(s);
          continue;
        }
        case "hr": {
          n += this.renderer.hr(s);
          continue;
        }
        case "heading": {
          n += this.renderer.heading(s);
          continue;
        }
        case "code": {
          n += this.renderer.code(s);
          continue;
        }
        case "table": {
          n += this.renderer.table(s);
          continue;
        }
        case "blockquote": {
          n += this.renderer.blockquote(s);
          continue;
        }
        case "list": {
          n += this.renderer.list(s);
          continue;
        }
        case "html": {
          n += this.renderer.html(s);
          continue;
        }
        case "def": {
          n += this.renderer.def(s);
          continue;
        }
        case "paragraph": {
          n += this.renderer.paragraph(s);
          continue;
        }
        case "text": {
          let o = s, a = this.renderer.text(o);
          for (;r + 1 < e.length && e[r + 1].type === "text"; )
            o = e[++r], a += `
` + this.renderer.text(o);
          t ? n += this.renderer.paragraph({ type: "paragraph", raw: a, text: a, tokens: [{ type: "text", raw: a, text: a, escaped: true }] }) : n += a;
          continue;
        }
        default: {
          let o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
  parseInline(e, t = this.renderer) {
    let n = "";
    for (let r = 0;r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
        if (o !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
          n += o || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "escape": {
          n += t.text(s);
          break;
        }
        case "html": {
          n += t.html(s);
          break;
        }
        case "link": {
          n += t.link(s);
          break;
        }
        case "image": {
          n += t.image(s);
          break;
        }
        case "strong": {
          n += t.strong(s);
          break;
        }
        case "em": {
          n += t.em(s);
          break;
        }
        case "codespan": {
          n += t.codespan(s);
          break;
        }
        case "br": {
          n += t.br(s);
          break;
        }
        case "del": {
          n += t.del(s);
          break;
        }
        case "text": {
          n += t.text(s);
          break;
        }
        default: {
          let o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent)
            return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return n;
  }
}, S, B = class {
  defaults = L();
  options = this.setOptions;
  parse = this.parseMarkdown(true);
  parseInline = this.parseMarkdown(false);
  Parser = b;
  Renderer = P;
  TextRenderer = $;
  Lexer = x;
  Tokenizer = y;
  Hooks = S;
  constructor(...e) {
    this.use(...e);
  }
  walkTokens(e, t) {
    let n = [];
    for (let r of e)
      switch (n = n.concat(t.call(this, r)), r.type) {
        case "table": {
          let i = r;
          for (let s of i.header)
            n = n.concat(this.walkTokens(s.tokens, t));
          for (let s of i.rows)
            for (let o of s)
              n = n.concat(this.walkTokens(o.tokens, t));
          break;
        }
        case "list": {
          let i = r;
          n = n.concat(this.walkTokens(i.items, t));
          break;
        }
        default: {
          let i = r;
          this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
            let o = i[s].flat(1 / 0);
            n = n.concat(this.walkTokens(o, t));
          }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
        }
      }
    return n;
  }
  use(...e) {
    let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return e.forEach((n) => {
      let r = { ...n };
      if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
        if (!i.name)
          throw new Error("extension name required");
        if ("renderer" in i) {
          let s = t.renderers[i.name];
          s ? t.renderers[i.name] = function(...o) {
            let a = i.renderer.apply(this, o);
            return a === false && (a = s.apply(this, o)), a;
          } : t.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          let s = t[i.level];
          s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
      }), r.extensions = t), n.renderer) {
        let i = this.defaults.renderer || new P(this.defaults);
        for (let s in n.renderer) {
          if (!(s in i))
            throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s))
            continue;
          let o = s, a = n.renderer[o], l = i[o];
          i[o] = (...c) => {
            let p = a.apply(i, c);
            return p === false && (p = l.apply(i, c)), p || "";
          };
        }
        r.renderer = i;
      }
      if (n.tokenizer) {
        let i = this.defaults.tokenizer || new y(this.defaults);
        for (let s in n.tokenizer) {
          if (!(s in i))
            throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s))
            continue;
          let o = s, a = n.tokenizer[o], l = i[o];
          i[o] = (...c) => {
            let p = a.apply(i, c);
            return p === false && (p = l.apply(i, c)), p;
          };
        }
        r.tokenizer = i;
      }
      if (n.hooks) {
        let i = this.defaults.hooks || new S;
        for (let s in n.hooks) {
          if (!(s in i))
            throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s))
            continue;
          let o = s, a = n.hooks[o], l = i[o];
          S.passThroughHooks.has(s) ? i[o] = (c) => {
            if (this.defaults.async && S.passThroughHooksRespectAsync.has(s))
              return (async () => {
                let g = await a.call(i, c);
                return l.call(i, g);
              })();
            let p = a.call(i, c);
            return l.call(i, p);
          } : i[o] = (...c) => {
            if (this.defaults.async)
              return (async () => {
                let g = await a.apply(i, c);
                return g === false && (g = await l.apply(i, c)), g;
              })();
            let p = a.apply(i, c);
            return p === false && (p = l.apply(i, c)), p;
          };
        }
        r.hooks = i;
      }
      if (n.walkTokens) {
        let i = this.defaults.walkTokens, s = n.walkTokens;
        r.walkTokens = function(o) {
          let a = [];
          return a.push(s.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(e) {
    return this.defaults = { ...this.defaults, ...e }, this;
  }
  lexer(e, t) {
    return x.lex(e, t ?? this.defaults);
  }
  parser(e, t) {
    return b.parse(e, t ?? this.defaults);
  }
  parseMarkdown(e) {
    return (n, r) => {
      let i = { ...r }, s = { ...this.defaults, ...i }, o = this.onError(!!s.silent, !!s.async);
      if (this.defaults.async === true && i.async === false)
        return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return o(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async)
        return (async () => {
          let a = s.hooks ? await s.hooks.preprocess(n) : n, c = await (s.hooks ? await s.hooks.provideLexer() : e ? x.lex : x.lexInline)(a, s), p = s.hooks ? await s.hooks.processAllTokens(c) : c;
          s.walkTokens && await Promise.all(this.walkTokens(p, s.walkTokens));
          let d = await (s.hooks ? await s.hooks.provideParser() : e ? b.parse : b.parseInline)(p, s);
          return s.hooks ? await s.hooks.postprocess(d) : d;
        })().catch(o);
      try {
        s.hooks && (n = s.hooks.preprocess(n));
        let l = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
        s.hooks && (l = s.hooks.processAllTokens(l)), s.walkTokens && this.walkTokens(l, s.walkTokens);
        let p = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(l, s);
        return s.hooks && (p = s.hooks.postprocess(p)), p;
      } catch (a) {
        return o(a);
      }
    };
  }
  onError(e, t) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
        let r = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
        return t ? Promise.resolve(r) : r;
      }
      if (t)
        return Promise.reject(n);
      throw n;
    };
  }
}, _, Ht, Zt, Gt, Nt, Ft, Qt, Ut;
var init_marked_esm = __esm(() => {
  T = L();
  I = { exec: () => null };
  m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (u) => new RegExp(`^( {0,3}${u})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (u) => new RegExp(`^ {0,${Math.min(3, u - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (u) => new RegExp(`^ {0,${Math.min(3, u - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (u) => new RegExp(`^ {0,${Math.min(3, u - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (u) => new RegExp(`^ {0,${Math.min(3, u - 1)}}#`), htmlBeginRegex: (u) => new RegExp(`^ {0,${Math.min(3, u - 1)}}<(?:[a-z].*>|!--)`, "i") };
  be = /^(?:[ \t]*(?:\n|$))+/;
  Re = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
  Te = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
  E = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
  Oe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
  F = /(?:[*+-]|\d{1,9}[.)])/;
  ie = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
  oe = h(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex();
  we = h(ie).replace(/bull/g, F).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex();
  j = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
  ye = /^[^\n]+/;
  Q = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/;
  Pe = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
  Se = h(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, F).getRegex();
  U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
  $e = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  ae = h(j).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  _e = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ae).getRegex();
  K = { blockquote: _e, code: Re, def: Pe, fences: Te, heading: Oe, hr: E, html: $e, lheading: oe, list: Se, newline: be, paragraph: ae, table: I, text: ye };
  re = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}\t)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex();
  Le = { ...K, lheading: we, table: re, paragraph: h(j).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() };
  Me = { ...K, html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: I, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: h(j).replace("hr", E).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", oe).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() };
  ze = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
  Ae = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
  le = /^( {2,}|\\)\n(?!\s*$)/;
  Ie = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
  D = /[\p{P}\p{S}]/u;
  W = /[\s\p{P}\p{S}]/u;
  ue = /[^\s\p{P}\p{S}]/u;
  Ee = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W).getRegex();
  pe = /(?!~)[\p{P}\p{S}]/u;
  Ce = /(?!~)[\s\p{P}\p{S}]/u;
  Be = /(?:[^\s\p{P}\p{S}]|~)/u;
  qe = h(/link|code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<!`)(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("code", /(?<!`)(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex();
  ce = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
  ve = h(ce, "u").replace(/punct/g, D).getRegex();
  De = h(ce, "u").replace(/punct/g, pe).getRegex();
  He = h(he, "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex();
  Ze = h(he, "gu").replace(/notPunctSpace/g, Be).replace(/punctSpace/g, Ce).replace(/punct/g, pe).getRegex();
  Ge = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ue).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex();
  Ne = h(/\\(punct)/, "gu").replace(/punct/g, D).getRegex();
  Fe = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
  je = h(U).replace("(?:-->|$)", "-->").getRegex();
  Qe = h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
  q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/;
  Ue = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
  de = h(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", Q).getRegex();
  ke = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex();
  Ke = h("reflink|nolink(?!\\()", "g").replace("reflink", de).replace("nolink", ke).getRegex();
  se = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/;
  X = { _backpedal: I, anyPunctuation: Ne, autolink: Fe, blockSkip: qe, br: le, code: Ae, del: I, emStrongLDelim: ve, emStrongRDelimAst: He, emStrongRDelimUnd: Ge, escape: ze, link: Ue, nolink: ke, punctuation: Ee, reflink: de, reflinkSearch: Ke, tag: Qe, text: Ie, url: I };
  We = { ...X, link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() };
  N = { ...X, emStrongRDelimAst: Ze, emStrongLDelim: De, url: h(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", se).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: h(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", se).getRegex() };
  Xe = { ...N, br: h(le).replace("{2,}", "*").getRegex(), text: h(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() };
  C = { normal: K, gfm: Le, pedantic: Me };
  M = { normal: X, gfm: N, breaks: Xe, pedantic: We };
  Je = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  S = class {
    options;
    block;
    constructor(e) {
      this.options = e || T;
    }
    static passThroughHooks = new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
    static passThroughHooksRespectAsync = new Set(["preprocess", "postprocess", "processAllTokens"]);
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    emStrongMask(e) {
      return e;
    }
    provideLexer() {
      return this.block ? x.lex : x.lexInline;
    }
    provideParser() {
      return this.block ? b.parse : b.parseInline;
    }
  };
  _ = new B;
  k.options = k.setOptions = function(u3) {
    return _.setOptions(u3), k.defaults = _.defaults, G(k.defaults), k;
  };
  k.getDefaults = L;
  k.defaults = T;
  k.use = function(...u3) {
    return _.use(...u3), k.defaults = _.defaults, G(k.defaults), k;
  };
  k.walkTokens = function(u3, e) {
    return _.walkTokens(u3, e);
  };
  k.parseInline = _.parseInline;
  k.Parser = b;
  k.parser = b.parse;
  k.Renderer = P;
  k.TextRenderer = $;
  k.Lexer = x;
  k.lexer = x.lex;
  k.Tokenizer = y;
  k.Hooks = S;
  k.parse = k;
  Ht = k.options;
  Zt = k.setOptions;
  Gt = k.use;
  Nt = k.walkTokens;
  Ft = k.parseInline;
  Qt = b.parse;
  Ut = x.lex;
});

// node:path
function assertPath(path) {
  if (typeof path !== "string")
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
}
function normalizeStringPosix(path, allowAboveRoot) {
  var res = "", lastSegmentLength = 0, lastSlash = -1, dots = 0, code;
  for (var i = 0;i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47)
      break;
    else
      code = 47;
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1)
        ;
      else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1)
                res = "", lastSegmentLength = 0;
              else
                res = res.slice(0, lastSlashIndex), lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              lastSlash = i, dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "", lastSegmentLength = 0, lastSlash = i, dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += "/..";
          else
            res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += "/" + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i, dots = 0;
    } else if (code === 46 && dots !== -1)
      ++dots;
    else
      dots = -1;
  }
  return res;
}
function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root, base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir)
    return base;
  if (dir === pathObject.root)
    return dir + base;
  return dir + sep + base;
}
function resolve() {
  var resolvedPath = "", resolvedAbsolute = false, cwd;
  for (var i = arguments.length - 1;i >= -1 && !resolvedAbsolute; i--) {
    var path;
    if (i >= 0)
      path = arguments[i];
    else {
      if (cwd === undefined)
        cwd = process.cwd();
      path = cwd;
    }
    if (assertPath(path), path.length === 0)
      continue;
    resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  if (resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute), resolvedAbsolute)
    if (resolvedPath.length > 0)
      return "/" + resolvedPath;
    else
      return "/";
  else if (resolvedPath.length > 0)
    return resolvedPath;
  else
    return ".";
}
function normalize(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var isAbsolute = path.charCodeAt(0) === 47, trailingSeparator = path.charCodeAt(path.length - 1) === 47;
  if (path = normalizeStringPosix(path, !isAbsolute), path.length === 0 && !isAbsolute)
    path = ".";
  if (path.length > 0 && trailingSeparator)
    path += "/";
  if (isAbsolute)
    return "/" + path;
  return path;
}
function isAbsolute(path) {
  return assertPath(path), path.length > 0 && path.charCodeAt(0) === 47;
}
function join() {
  if (arguments.length === 0)
    return ".";
  var joined;
  for (var i = 0;i < arguments.length; ++i) {
    var arg = arguments[i];
    if (assertPath(arg), arg.length > 0)
      if (joined === undefined)
        joined = arg;
      else
        joined += "/" + arg;
  }
  if (joined === undefined)
    return ".";
  return normalize(joined);
}
function relative(from, to) {
  if (assertPath(from), assertPath(to), from === to)
    return "";
  if (from = resolve(from), to = resolve(to), from === to)
    return "";
  var fromStart = 1;
  for (;fromStart < from.length; ++fromStart)
    if (from.charCodeAt(fromStart) !== 47)
      break;
  var fromEnd = from.length, fromLen = fromEnd - fromStart, toStart = 1;
  for (;toStart < to.length; ++toStart)
    if (to.charCodeAt(toStart) !== 47)
      break;
  var toEnd = to.length, toLen = toEnd - toStart, length = fromLen < toLen ? fromLen : toLen, lastCommonSep = -1, i = 0;
  for (;i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === 47)
          return to.slice(toStart + i + 1);
        else if (i === 0)
          return to.slice(toStart + i);
      } else if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === 47)
          lastCommonSep = i;
        else if (i === 0)
          lastCommonSep = 0;
      }
      break;
    }
    var fromCode = from.charCodeAt(fromStart + i), toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode)
      break;
    else if (fromCode === 47)
      lastCommonSep = i;
  }
  var out = "";
  for (i = fromStart + lastCommonSep + 1;i <= fromEnd; ++i)
    if (i === fromEnd || from.charCodeAt(i) === 47)
      if (out.length === 0)
        out += "..";
      else
        out += "/..";
  if (out.length > 0)
    return out + to.slice(toStart + lastCommonSep);
  else {
    if (toStart += lastCommonSep, to.charCodeAt(toStart) === 47)
      ++toStart;
    return to.slice(toStart);
  }
}
function _makeLong(path) {
  return path;
}
function dirname(path) {
  if (assertPath(path), path.length === 0)
    return ".";
  var code = path.charCodeAt(0), hasRoot = code === 47, end = -1, matchedSlash = true;
  for (var i = path.length - 1;i >= 1; --i)
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else
      matchedSlash = false;
  if (end === -1)
    return hasRoot ? "/" : ".";
  if (hasRoot && end === 1)
    return "//";
  return path.slice(0, end);
}
function basename(path, ext) {
  if (ext !== undefined && typeof ext !== "string")
    throw new TypeError('"ext" argument must be a string');
  assertPath(path);
  var start = 0, end = -1, matchedSlash = true, i;
  if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
    if (ext.length === path.length && ext === path)
      return "";
    var extIdx = ext.length - 1, firstNonSlashEnd = -1;
    for (i = path.length - 1;i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else {
        if (firstNonSlashEnd === -1)
          matchedSlash = false, firstNonSlashEnd = i + 1;
        if (extIdx >= 0)
          if (code === ext.charCodeAt(extIdx)) {
            if (--extIdx === -1)
              end = i;
          } else
            extIdx = -1, end = firstNonSlashEnd;
      }
    }
    if (start === end)
      end = firstNonSlashEnd;
    else if (end === -1)
      end = path.length;
    return path.slice(start, end);
  } else {
    for (i = path.length - 1;i >= 0; --i)
      if (path.charCodeAt(i) === 47) {
        if (!matchedSlash) {
          start = i + 1;
          break;
        }
      } else if (end === -1)
        matchedSlash = false, end = i + 1;
    if (end === -1)
      return "";
    return path.slice(start, end);
  }
}
function extname(path) {
  assertPath(path);
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, preDotState = 0;
  for (var i = path.length - 1;i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    return "";
  return path.slice(startDot, end);
}
function format(pathObject) {
  if (pathObject === null || typeof pathObject !== "object")
    throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
  return _format("/", pathObject);
}
function parse(path) {
  assertPath(path);
  var ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path.length === 0)
    return ret;
  var code = path.charCodeAt(0), isAbsolute2 = code === 47, start;
  if (isAbsolute2)
    ret.root = "/", start = 1;
  else
    start = 0;
  var startDot = -1, startPart = 0, end = -1, matchedSlash = true, i = path.length - 1, preDotState = 0;
  for (;i >= start; --i) {
    if (code = path.charCodeAt(i), code === 47) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1)
      matchedSlash = false, end = i + 1;
    if (code === 46) {
      if (startDot === -1)
        startDot = i;
      else if (preDotState !== 1)
        preDotState = 1;
    } else if (startDot !== -1)
      preDotState = -1;
  }
  if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1)
      if (startPart === 0 && isAbsolute2)
        ret.base = ret.name = path.slice(1, end);
      else
        ret.base = ret.name = path.slice(startPart, end);
  } else {
    if (startPart === 0 && isAbsolute2)
      ret.name = path.slice(1, startDot), ret.base = path.slice(1, end);
    else
      ret.name = path.slice(startPart, startDot), ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0)
    ret.dir = path.slice(0, startPart - 1);
  else if (isAbsolute2)
    ret.dir = "/";
  return ret;
}
var sep = "/", delimiter = ":", posix, path_default;
var init_path = __esm(() => {
  posix = ((p) => (p.posix = p, p))({ resolve, normalize, isAbsolute, join, relative, _makeLong, dirname, basename, extname, format, parse, sep, delimiter, win32: null, posix: null });
  path_default = posix;
});

// node_modules/js-yaml/dist/js-yaml.mjs
function isNothing(subject) {
  return typeof subject === "undefined" || subject === null;
}
function isObject(subject) {
  return typeof subject === "object" && subject !== null;
}
function toArray(sequence) {
  if (Array.isArray(sequence))
    return sequence;
  else if (isNothing(sequence))
    return [];
  return [sequence];
}
function extend(target, source) {
  var index, length, key, sourceKeys;
  if (source) {
    sourceKeys = Object.keys(source);
    for (index = 0, length = sourceKeys.length;index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }
  return target;
}
function repeat(string, count) {
  var result = "", cycle;
  for (cycle = 0;cycle < count; cycle += 1) {
    result += string;
  }
  return result;
}
function isNegativeZero(number) {
  return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
}
function formatError(exception, compact) {
  var where = "", message = exception.reason || "(unknown reason)";
  if (!exception.mark)
    return message;
  if (exception.mark.name) {
    where += 'in "' + exception.mark.name + '" ';
  }
  where += "(" + (exception.mark.line + 1) + ":" + (exception.mark.column + 1) + ")";
  if (!compact && exception.mark.snippet) {
    where += `

` + exception.mark.snippet;
  }
  return message + " " + where;
}
function YAMLException$1(reason, mark) {
  Error.call(this);
  this.name = "YAMLException";
  this.reason = reason;
  this.mark = mark;
  this.message = formatError(this, false);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack || "";
  }
}
function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
  var head = "";
  var tail = "";
  var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
  if (position - lineStart > maxHalfLength) {
    head = " ... ";
    lineStart = position - maxHalfLength + head.length;
  }
  if (lineEnd - position > maxHalfLength) {
    tail = " ...";
    lineEnd = position + maxHalfLength - tail.length;
  }
  return {
    str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "→") + tail,
    pos: position - lineStart + head.length
  };
}
function padStart(string, max) {
  return common.repeat(" ", max - string.length) + string;
}
function makeSnippet(mark, options) {
  options = Object.create(options || null);
  if (!mark.buffer)
    return null;
  if (!options.maxLength)
    options.maxLength = 79;
  if (typeof options.indent !== "number")
    options.indent = 1;
  if (typeof options.linesBefore !== "number")
    options.linesBefore = 3;
  if (typeof options.linesAfter !== "number")
    options.linesAfter = 2;
  var re2 = /\r?\n|\r|\0/g;
  var lineStarts = [0];
  var lineEnds = [];
  var match;
  var foundLineNo = -1;
  while (match = re2.exec(mark.buffer)) {
    lineEnds.push(match.index);
    lineStarts.push(match.index + match[0].length);
    if (mark.position <= match.index && foundLineNo < 0) {
      foundLineNo = lineStarts.length - 2;
    }
  }
  if (foundLineNo < 0)
    foundLineNo = lineStarts.length - 1;
  var result = "", i, line;
  var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
  var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
  for (i = 1;i <= options.linesBefore; i++) {
    if (foundLineNo - i < 0)
      break;
    line = getLine(mark.buffer, lineStarts[foundLineNo - i], lineEnds[foundLineNo - i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]), maxLineLength);
    result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + `
` + result;
  }
  line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
  result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + `
`;
  result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^" + `
`;
  for (i = 1;i <= options.linesAfter; i++) {
    if (foundLineNo + i >= lineEnds.length)
      break;
    line = getLine(mark.buffer, lineStarts[foundLineNo + i], lineEnds[foundLineNo + i], mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]), maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + `
`;
  }
  return result.replace(/\n$/, "");
}
function compileStyleAliases(map) {
  var result = {};
  if (map !== null) {
    Object.keys(map).forEach(function(style) {
      map[style].forEach(function(alias) {
        result[String(alias)] = style;
      });
    });
  }
  return result;
}
function Type$1(tag, options) {
  options = options || {};
  Object.keys(options).forEach(function(name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });
  this.options = options;
  this.tag = tag;
  this.kind = options["kind"] || null;
  this.resolve = options["resolve"] || function() {
    return true;
  };
  this.construct = options["construct"] || function(data) {
    return data;
  };
  this.instanceOf = options["instanceOf"] || null;
  this.predicate = options["predicate"] || null;
  this.represent = options["represent"] || null;
  this.representName = options["representName"] || null;
  this.defaultStyle = options["defaultStyle"] || null;
  this.multi = options["multi"] || false;
  this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}
function compileList(schema, name) {
  var result = [];
  schema[name].forEach(function(currentType) {
    var newIndex = result.length;
    result.forEach(function(previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
        newIndex = previousIndex;
      }
    });
    result[newIndex] = currentType;
  });
  return result;
}
function compileMap() {
  var result = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, index, length;
  function collectType(type2) {
    if (type2.multi) {
      result.multi[type2.kind].push(type2);
      result.multi["fallback"].push(type2);
    } else {
      result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
    }
  }
  for (index = 0, length = arguments.length;index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}
function Schema$1(definition) {
  return this.extend(definition);
}
function resolveYamlNull(data) {
  if (data === null)
    return true;
  var max = data.length;
  return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
}
function constructYamlNull() {
  return null;
}
function isNull(object) {
  return object === null;
}
function resolveYamlBoolean(data) {
  if (data === null)
    return false;
  var max = data.length;
  return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
}
function constructYamlBoolean(data) {
  return data === "true" || data === "True" || data === "TRUE";
}
function isBoolean(object) {
  return Object.prototype.toString.call(object) === "[object Boolean]";
}
function isHexCode(c) {
  return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
}
function isOctCode(c) {
  return 48 <= c && c <= 55;
}
function isDecCode(c) {
  return 48 <= c && c <= 57;
}
function resolveYamlInteger(data) {
  if (data === null)
    return false;
  var max = data.length, index = 0, hasDigits = false, ch;
  if (!max)
    return false;
  ch = data[index];
  if (ch === "-" || ch === "+") {
    ch = data[++index];
  }
  if (ch === "0") {
    if (index + 1 === max)
      return true;
    ch = data[++index];
    if (ch === "b") {
      index++;
      for (;index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (ch !== "0" && ch !== "1")
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "x") {
      index++;
      for (;index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isHexCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
    if (ch === "o") {
      index++;
      for (;index < max; index++) {
        ch = data[index];
        if (ch === "_")
          continue;
        if (!isOctCode(data.charCodeAt(index)))
          return false;
        hasDigits = true;
      }
      return hasDigits && ch !== "_";
    }
  }
  if (ch === "_")
    return false;
  for (;index < max; index++) {
    ch = data[index];
    if (ch === "_")
      continue;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }
  if (!hasDigits || ch === "_")
    return false;
  return true;
}
function constructYamlInteger(data) {
  var value = data, sign = 1, ch;
  if (value.indexOf("_") !== -1) {
    value = value.replace(/_/g, "");
  }
  ch = value[0];
  if (ch === "-" || ch === "+") {
    if (ch === "-")
      sign = -1;
    value = value.slice(1);
    ch = value[0];
  }
  if (value === "0")
    return 0;
  if (ch === "0") {
    if (value[1] === "b")
      return sign * parseInt(value.slice(2), 2);
    if (value[1] === "x")
      return sign * parseInt(value.slice(2), 16);
    if (value[1] === "o")
      return sign * parseInt(value.slice(2), 8);
  }
  return sign * parseInt(value, 10);
}
function isInteger(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
}
function resolveYamlFloat(data) {
  if (data === null)
    return false;
  if (!YAML_FLOAT_PATTERN.test(data) || data[data.length - 1] === "_") {
    return false;
  }
  return true;
}
function constructYamlFloat(data) {
  var value, sign;
  value = data.replace(/_/g, "").toLowerCase();
  sign = value[0] === "-" ? -1 : 1;
  if ("+-".indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }
  if (value === ".inf") {
    return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  } else if (value === ".nan") {
    return NaN;
  }
  return sign * parseFloat(value, 10);
}
function representYamlFloat(object, style) {
  var res;
  if (isNaN(object)) {
    switch (style) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  } else if (common.isNegativeZero(object)) {
    return "-0.0";
  }
  res = object.toString(10);
  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
}
function isFloat(object) {
  return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
}
function resolveYamlTimestamp(data) {
  if (data === null)
    return false;
  if (YAML_DATE_REGEXP.exec(data) !== null)
    return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
    return true;
  return false;
}
function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
  match = YAML_DATE_REGEXP.exec(data);
  if (match === null)
    match = YAML_TIMESTAMP_REGEXP.exec(data);
  if (match === null)
    throw new Error("Date resolve error");
  year = +match[1];
  month = +match[2] - 1;
  day = +match[3];
  if (!match[4]) {
    return new Date(Date.UTC(year, month, day));
  }
  hour = +match[4];
  minute = +match[5];
  second = +match[6];
  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) {
      fraction += "0";
    }
    fraction = +fraction;
  }
  if (match[9]) {
    tz_hour = +match[10];
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000;
    if (match[9] === "-")
      delta = -delta;
  }
  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
  if (delta)
    date.setTime(date.getTime() - delta);
  return date;
}
function representYamlTimestamp(object) {
  return object.toISOString();
}
function resolveYamlMerge(data) {
  return data === "<<" || data === null;
}
function resolveYamlBinary(data) {
  if (data === null)
    return false;
  var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
  for (idx = 0;idx < max; idx++) {
    code = map2.indexOf(data.charAt(idx));
    if (code > 64)
      continue;
    if (code < 0)
      return false;
    bitlen += 6;
  }
  return bitlen % 8 === 0;
}
function constructYamlBinary(data) {
  var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
  for (idx = 0;idx < max; idx++) {
    if (idx % 4 === 0 && idx) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    }
    bits = bits << 6 | map2.indexOf(input.charAt(idx));
  }
  tailbits = max % 4 * 6;
  if (tailbits === 0) {
    result.push(bits >> 16 & 255);
    result.push(bits >> 8 & 255);
    result.push(bits & 255);
  } else if (tailbits === 18) {
    result.push(bits >> 10 & 255);
    result.push(bits >> 2 & 255);
  } else if (tailbits === 12) {
    result.push(bits >> 4 & 255);
  }
  return new Uint8Array(result);
}
function representYamlBinary(object) {
  var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
  for (idx = 0;idx < max; idx++) {
    if (idx % 3 === 0 && idx) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    }
    bits = (bits << 8) + object[idx];
  }
  tail = max % 3;
  if (tail === 0) {
    result += map2[bits >> 18 & 63];
    result += map2[bits >> 12 & 63];
    result += map2[bits >> 6 & 63];
    result += map2[bits & 63];
  } else if (tail === 2) {
    result += map2[bits >> 10 & 63];
    result += map2[bits >> 4 & 63];
    result += map2[bits << 2 & 63];
    result += map2[64];
  } else if (tail === 1) {
    result += map2[bits >> 2 & 63];
    result += map2[bits << 4 & 63];
    result += map2[64];
    result += map2[64];
  }
  return result;
}
function isBinary(obj) {
  return Object.prototype.toString.call(obj) === "[object Uint8Array]";
}
function resolveYamlOmap(data) {
  if (data === null)
    return true;
  var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
  for (index = 0, length = object.length;index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;
    if (_toString$2.call(pair) !== "[object Object]")
      return false;
    for (pairKey in pair) {
      if (_hasOwnProperty$3.call(pair, pairKey)) {
        if (!pairHasKey)
          pairHasKey = true;
        else
          return false;
      }
    }
    if (!pairHasKey)
      return false;
    if (objectKeys.indexOf(pairKey) === -1)
      objectKeys.push(pairKey);
    else
      return false;
  }
  return true;
}
function constructYamlOmap(data) {
  return data !== null ? data : [];
}
function resolveYamlPairs(data) {
  if (data === null)
    return true;
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length;index < length; index += 1) {
    pair = object[index];
    if (_toString$1.call(pair) !== "[object Object]")
      return false;
    keys = Object.keys(pair);
    if (keys.length !== 1)
      return false;
    result[index] = [keys[0], pair[keys[0]]];
  }
  return true;
}
function constructYamlPairs(data) {
  if (data === null)
    return [];
  var index, length, pair, keys, result, object = data;
  result = new Array(object.length);
  for (index = 0, length = object.length;index < length; index += 1) {
    pair = object[index];
    keys = Object.keys(pair);
    result[index] = [keys[0], pair[keys[0]]];
  }
  return result;
}
function resolveYamlSet(data) {
  if (data === null)
    return true;
  var key, object = data;
  for (key in object) {
    if (_hasOwnProperty$2.call(object, key)) {
      if (object[key] !== null)
        return false;
    }
  }
  return true;
}
function constructYamlSet(data) {
  return data !== null ? data : {};
}
function _class(obj) {
  return Object.prototype.toString.call(obj);
}
function is_EOL(c) {
  return c === 10 || c === 13;
}
function is_WHITE_SPACE(c) {
  return c === 9 || c === 32;
}
function is_WS_OR_EOL(c) {
  return c === 9 || c === 32 || c === 10 || c === 13;
}
function is_FLOW_INDICATOR(c) {
  return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
}
function fromHexCode(c) {
  var lc;
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  lc = c | 32;
  if (97 <= lc && lc <= 102) {
    return lc - 97 + 10;
  }
  return -1;
}
function escapedHexLen(c) {
  if (c === 120) {
    return 2;
  }
  if (c === 117) {
    return 4;
  }
  if (c === 85) {
    return 8;
  }
  return 0;
}
function fromDecimalCode(c) {
  if (48 <= c && c <= 57) {
    return c - 48;
  }
  return -1;
}
function simpleEscapeSequence(c) {
  return c === 48 ? "\x00" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "\t" : c === 9 ? "\t" : c === 110 ? `
` : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "" : c === 95 ? " " : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
}
function charFromCodepoint(c) {
  if (c <= 65535) {
    return String.fromCharCode(c);
  }
  return String.fromCharCode((c - 65536 >> 10) + 55296, (c - 65536 & 1023) + 56320);
}
function State$1(input, options) {
  this.input = input;
  this.filename = options["filename"] || null;
  this.schema = options["schema"] || _default;
  this.onWarning = options["onWarning"] || null;
  this.legacy = options["legacy"] || false;
  this.json = options["json"] || false;
  this.listener = options["listener"] || null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;
  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;
  this.firstTabInLine = -1;
  this.documents = [];
}
function generateError(state, message) {
  var mark = {
    name: state.filename,
    buffer: state.input.slice(0, -1),
    position: state.position,
    line: state.line,
    column: state.position - state.lineStart
  };
  mark.snippet = snippet(mark);
  return new exception(message, mark);
}
function throwError(state, message) {
  throw generateError(state, message);
}
function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}
function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;
  if (start < end) {
    _result = state.input.slice(start, end);
    if (checkJson) {
      for (_position = 0, _length = _result.length;_position < _length; _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
          throwError(state, "expected valid JSON character");
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, "the stream contains non-printable characters");
    }
    state.result += _result;
  }
}
function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;
  if (!common.isObject(source)) {
    throwError(state, "cannot merge mappings; the provided source object is unacceptable");
  }
  sourceKeys = Object.keys(source);
  for (index = 0, quantity = sourceKeys.length;index < quantity; index += 1) {
    key = sourceKeys[index];
    if (!_hasOwnProperty$1.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}
function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
  var index, quantity;
  if (Array.isArray(keyNode)) {
    keyNode = Array.prototype.slice.call(keyNode);
    for (index = 0, quantity = keyNode.length;index < quantity; index += 1) {
      if (Array.isArray(keyNode[index])) {
        throwError(state, "nested arrays are not supported inside keys");
      }
      if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
        keyNode[index] = "[object Object]";
      }
    }
  }
  if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
    keyNode = "[object Object]";
  }
  keyNode = String(keyNode);
  if (_result === null) {
    _result = {};
  }
  if (keyTag === "tag:yaml.org,2002:merge") {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length;index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.lineStart = startLineStart || state.lineStart;
      state.position = startPos || state.position;
      throwError(state, "duplicated mapping key");
    }
    if (keyNode === "__proto__") {
      Object.defineProperty(_result, keyNode, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: valueNode
      });
    } else {
      _result[keyNode] = valueNode;
    }
    delete overridableKeys[keyNode];
  }
  return _result;
}
function readLineBreak(state) {
  var ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 10) {
    state.position++;
  } else if (ch === 13) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 10) {
      state.position++;
    }
  } else {
    throwError(state, "a line break is expected");
  }
  state.line += 1;
  state.lineStart = state.position;
  state.firstTabInLine = -1;
}
function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      if (ch === 9 && state.firstTabInLine === -1) {
        state.firstTabInLine = state.position;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    if (allowComments && ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 10 && ch !== 13 && ch !== 0);
    }
    if (is_EOL(ch)) {
      readLineBreak(state);
      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;
      while (ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }
  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, "deficient indentation");
  }
  return lineBreaks;
}
function testDocumentSeparator(state) {
  var _position = state.position, ch;
  ch = state.input.charCodeAt(_position);
  if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
    _position += 3;
    ch = state.input.charCodeAt(_position);
    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }
  return false;
}
function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += " ";
  } else if (count > 1) {
    state.result += common.repeat(`
`, count - 1);
  }
}
function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
  ch = state.input.charCodeAt(state.position);
  if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
    return false;
  }
  if (ch === 63 || ch === 45) {
    following = state.input.charCodeAt(state.position + 1);
    if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }
  state.kind = "scalar";
  state.result = "";
  captureStart = captureEnd = state.position;
  hasPendingContent = false;
  while (ch !== 0) {
    if (ch === 58) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }
    } else if (ch === 35) {
      preceding = state.input.charCodeAt(state.position - 1);
      if (is_WS_OR_EOL(preceding)) {
        break;
      }
    } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;
    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);
      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }
    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }
    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }
    ch = state.input.charCodeAt(++state.position);
  }
  captureSegment(state, captureStart, captureEnd, false);
  if (state.result) {
    return true;
  }
  state.kind = _kind;
  state.result = _result;
  return false;
}
function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 39) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 39) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (ch === 39) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a single quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a single quoted scalar");
}
function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 34) {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  state.position++;
  captureStart = captureEnd = state.position;
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 34) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    } else if (ch === 92) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);
      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;
        for (;hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);
          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;
          } else {
            throwError(state, "expected hexadecimal character");
          }
        }
        state.result += charFromCodepoint(hexResult);
        state.position++;
      } else {
        throwError(state, "unknown escape sequence");
      }
      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, "unexpected end of the document within a double quoted scalar");
    } else {
      state.position++;
      captureEnd = state.position;
    }
  }
  throwError(state, "unexpected end of the stream within a double quoted scalar");
}
function readFlowCollection(state, nodeIndent) {
  var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = Object.create(null), keyNode, keyTag, valueNode, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 91) {
    terminator = 93;
    isMapping = false;
    _result = [];
  } else if (ch === 123) {
    terminator = 125;
    isMapping = true;
    _result = {};
  } else {
    return false;
  }
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(++state.position);
  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? "mapping" : "sequence";
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, "missed comma between flow collection entries");
    } else if (ch === 44) {
      throwError(state, "expected the node content, but found ','");
    }
    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;
    if (ch === 63) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }
    _line = state.line;
    _lineStart = state.lineStart;
    _pos = state.position;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if ((isExplicitPair || state.line === _line) && ch === 58) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }
    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
    } else {
      _result.push(keyNode);
    }
    skipSeparationSpace(state, true, nodeIndent);
    ch = state.input.charCodeAt(state.position);
    if (ch === 44) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }
  throwError(state, "unexpected end of the stream within a flow collection");
}
function readBlockScalar(state, nodeIndent) {
  var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch === 124) {
    folding = false;
  } else if (ch === 62) {
    folding = true;
  } else {
    return false;
  }
  state.kind = "scalar";
  state.result = "";
  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);
    if (ch === 43 || ch === 45) {
      if (CHOMPING_CLIP === chomping) {
        chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, "repeat of a chomping mode identifier");
      }
    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, "repeat of an indentation width identifier");
      }
    } else {
      break;
    }
  }
  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));
    if (ch === 35) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
    }
  }
  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;
    ch = state.input.charCodeAt(state.position);
    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }
    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }
    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat(`
`, didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) {
          state.result += `
`;
        }
      }
      break;
    }
    if (folding) {
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += common.repeat(`
`, didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat(`
`, emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) {
          state.result += " ";
        }
      } else {
        state.result += common.repeat(`
`, emptyLines);
      }
    } else {
      state.result += common.repeat(`
`, didReadContent ? 1 + emptyLines : emptyLines);
    }
    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;
    while (!is_EOL(ch) && ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, state.position, false);
  }
  return true;
}
function readBlockSequence(state, nodeIndent) {
  var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
  if (state.firstTabInLine !== -1)
    return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    if (ch !== 45) {
      break;
    }
    following = state.input.charCodeAt(state.position + 1);
    if (!is_WS_OR_EOL(following)) {
      break;
    }
    detected = true;
    state.position++;
    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }
    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a sequence entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "sequence";
    state.result = _result;
    return true;
  }
  return false;
}
function readBlockMapping(state, nodeIndent, flowIndent) {
  var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
  if (state.firstTabInLine !== -1)
    return false;
  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }
  ch = state.input.charCodeAt(state.position);
  while (ch !== 0) {
    if (!atExplicitKey && state.firstTabInLine !== -1) {
      state.position = state.firstTabInLine;
      throwError(state, "tab characters must not be used in indentation");
    }
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
      if (ch === 63) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else {
        throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
      }
      state.position += 1;
      ch = following;
    } else {
      _keyLine = state.line;
      _keyLineStart = state.lineStart;
      _keyPos = state.position;
      if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
        break;
      }
      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 58) {
          ch = state.input.charCodeAt(++state.position);
          if (!is_WS_OR_EOL(ch)) {
            throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
          }
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;
        } else if (detected) {
          throwError(state, "can not read an implicit mapping pair; a colon is missed");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      } else if (detected) {
        throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    }
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (atExplicitKey) {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
      }
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }
      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
        keyTag = keyNode = valueNode = null;
      }
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }
    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
      throwError(state, "bad indentation of a mapping entry");
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
  }
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = "mapping";
    state.result = _result;
  }
  return detected;
}
function readTagProperty(state) {
  var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 33)
    return false;
  if (state.tag !== null) {
    throwError(state, "duplication of a tag property");
  }
  ch = state.input.charCodeAt(++state.position);
  if (ch === 60) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 33) {
    isNamed = true;
    tagHandle = "!!";
    ch = state.input.charCodeAt(++state.position);
  } else {
    tagHandle = "!";
  }
  _position = state.position;
  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 62);
    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, "unexpected end of the stream within a verbatim tag");
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 33) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);
          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, "named tag handle cannot contain such characters");
          }
          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, "tag suffix cannot contain exclamation marks");
        }
      }
      ch = state.input.charCodeAt(++state.position);
    }
    tagName = state.input.slice(_position, state.position);
    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, "tag suffix cannot contain flow indicator characters");
    }
  }
  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, "tag name cannot contain such characters: " + tagName);
  }
  try {
    tagName = decodeURIComponent(tagName);
  } catch (err) {
    throwError(state, "tag name is malformed: " + tagName);
  }
  if (isVerbatim) {
    state.tag = tagName;
  } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;
  } else if (tagHandle === "!") {
    state.tag = "!" + tagName;
  } else if (tagHandle === "!!") {
    state.tag = "tag:yaml.org,2002:" + tagName;
  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }
  return true;
}
function readAnchorProperty(state) {
  var _position, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 38)
    return false;
  if (state.anchor !== null) {
    throwError(state, "duplication of an anchor property");
  }
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an anchor node must contain at least one character");
  }
  state.anchor = state.input.slice(_position, state.position);
  return true;
}
function readAlias(state) {
  var _position, alias, ch;
  ch = state.input.charCodeAt(state.position);
  if (ch !== 42)
    return false;
  ch = state.input.charCodeAt(++state.position);
  _position = state.position;
  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }
  if (state.position === _position) {
    throwError(state, "name of an alias node must contain at least one character");
  }
  alias = state.input.slice(_position, state.position);
  if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }
  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}
function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
  if (state.listener !== null) {
    state.listener("open", state);
  }
  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;
  allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;
      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }
  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }
  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }
  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }
    blockIndent = state.position - state.lineStart;
    if (indentStatus === 1) {
      if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;
        } else if (readAlias(state)) {
          hasContent = true;
          if (state.tag !== null || state.anchor !== null) {
            throwError(state, "alias node should not have any properties");
          }
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;
          if (state.tag === null) {
            state.tag = "?";
          }
        }
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }
  if (state.tag === null) {
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = state.result;
    }
  } else if (state.tag === "?") {
    if (state.result !== null && state.kind !== "scalar") {
      throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
    }
    for (typeIndex = 0, typeQuantity = state.implicitTypes.length;typeIndex < typeQuantity; typeIndex += 1) {
      type2 = state.implicitTypes[typeIndex];
      if (type2.resolve(state.result)) {
        state.result = type2.construct(state.result);
        state.tag = type2.tag;
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
        break;
      }
    }
  } else if (state.tag !== "!") {
    if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
      type2 = state.typeMap[state.kind || "fallback"][state.tag];
    } else {
      type2 = null;
      typeList = state.typeMap.multi[state.kind || "fallback"];
      for (typeIndex = 0, typeQuantity = typeList.length;typeIndex < typeQuantity; typeIndex += 1) {
        if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
          type2 = typeList[typeIndex];
          break;
        }
      }
    }
    if (!type2) {
      throwError(state, "unknown tag !<" + state.tag + ">");
    }
    if (state.result !== null && type2.kind !== state.kind) {
      throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
    }
    if (!type2.resolve(state.result, state.tag)) {
      throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
    } else {
      state.result = type2.construct(state.result, state.tag);
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    }
  }
  if (state.listener !== null) {
    state.listener("close", state);
  }
  return state.tag !== null || state.anchor !== null || hasContent;
}
function readDocument(state) {
  var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = Object.create(null);
  state.anchorMap = Object.create(null);
  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);
    ch = state.input.charCodeAt(state.position);
    if (state.lineIndent > 0 || ch !== 37) {
      break;
    }
    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];
    if (directiveName.length < 1) {
      throwError(state, "directive name must not be less than one character in length");
    }
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }
      if (is_EOL(ch))
        break;
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveArgs.push(state.input.slice(_position, state.position));
    }
    if (ch !== 0)
      readLineBreak(state);
    if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }
  skipSeparationSpace(state, true, -1);
  if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else if (hasDirectives) {
    throwError(state, "directives end mark is expected");
  }
  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);
  if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, "non-ASCII line breaks are interpreted as content");
  }
  state.documents.push(state.result);
  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 46) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }
  if (state.position < state.length - 1) {
    throwError(state, "end of the stream or a document separator is expected");
  } else {
    return;
  }
}
function loadDocuments(input, options) {
  input = String(input);
  options = options || {};
  if (input.length !== 0) {
    if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
      input += `
`;
    }
    if (input.charCodeAt(0) === 65279) {
      input = input.slice(1);
    }
  }
  var state = new State$1(input, options);
  var nullpos = input.indexOf("\x00");
  if (nullpos !== -1) {
    state.position = nullpos;
    throwError(state, "null byte is not allowed in input");
  }
  state.input += "\x00";
  while (state.input.charCodeAt(state.position) === 32) {
    state.lineIndent += 1;
    state.position += 1;
  }
  while (state.position < state.length - 1) {
    readDocument(state);
  }
  return state.documents;
}
function loadAll$1(input, iterator, options) {
  if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
    options = iterator;
    iterator = null;
  }
  var documents = loadDocuments(input, options);
  if (typeof iterator !== "function") {
    return documents;
  }
  for (var index = 0, length = documents.length;index < length; index += 1) {
    iterator(documents[index]);
  }
}
function load$1(input, options) {
  var documents = loadDocuments(input, options);
  if (documents.length === 0) {
    return;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new exception("expected a single document in the stream, but found more");
}
function compileStyleMap(schema2, map2) {
  var result, keys, index, length, tag, style, type2;
  if (map2 === null)
    return {};
  result = {};
  keys = Object.keys(map2);
  for (index = 0, length = keys.length;index < length; index += 1) {
    tag = keys[index];
    style = String(map2[tag]);
    if (tag.slice(0, 2) === "!!") {
      tag = "tag:yaml.org,2002:" + tag.slice(2);
    }
    type2 = schema2.compiledTypeMap["fallback"][tag];
    if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
      style = type2.styleAliases[style];
    }
    result[tag] = style;
  }
  return result;
}
function encodeHex(character) {
  var string, handle, length;
  string = character.toString(16).toUpperCase();
  if (character <= 255) {
    handle = "x";
    length = 2;
  } else if (character <= 65535) {
    handle = "u";
    length = 4;
  } else if (character <= 4294967295) {
    handle = "U";
    length = 8;
  } else {
    throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
  }
  return "\\" + handle + common.repeat("0", length - string.length) + string;
}
function State(options) {
  this.schema = options["schema"] || _default;
  this.indent = Math.max(1, options["indent"] || 2);
  this.noArrayIndent = options["noArrayIndent"] || false;
  this.skipInvalid = options["skipInvalid"] || false;
  this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
  this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
  this.sortKeys = options["sortKeys"] || false;
  this.lineWidth = options["lineWidth"] || 80;
  this.noRefs = options["noRefs"] || false;
  this.noCompatMode = options["noCompatMode"] || false;
  this.condenseFlow = options["condenseFlow"] || false;
  this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
  this.forceQuotes = options["forceQuotes"] || false;
  this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;
  this.tag = null;
  this.result = "";
  this.duplicates = [];
  this.usedDuplicates = null;
}
function indentString(string, spaces) {
  var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
  while (position < length) {
    next = string.indexOf(`
`, position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }
    if (line.length && line !== `
`)
      result += ind;
    result += line;
  }
  return result;
}
function generateNextLine(state, level) {
  return `
` + common.repeat(" ", state.indent * level);
}
function testImplicitResolving(state, str2) {
  var index, length, type2;
  for (index = 0, length = state.implicitTypes.length;index < length; index += 1) {
    type2 = state.implicitTypes[index];
    if (type2.resolve(str2)) {
      return true;
    }
  }
  return false;
}
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}
function isPrintable(c) {
  return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
}
function isNsCharOrWhitespace(c) {
  return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
}
function isPlainSafe(c, prev, inblock) {
  var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
  var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
  return (inblock ? cIsNsCharOrWhitespace : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar;
}
function isPlainSafeFirst(c) {
  return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
}
function isPlainSafeLast(c) {
  return !isWhitespace(c) && c !== CHAR_COLON;
}
function codePointAt(string, pos) {
  var first = string.charCodeAt(pos), second;
  if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
    second = string.charCodeAt(pos + 1);
    if (second >= 56320 && second <= 57343) {
      return (first - 55296) * 1024 + second - 56320 + 65536;
    }
  }
  return first;
}
function needIndentIndicator(string) {
  var leadingSpaceRe = /^\n* /;
  return leadingSpaceRe.test(string);
}
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
  var i2;
  var char = 0;
  var prevChar = null;
  var hasLineBreak = false;
  var hasFoldableLine = false;
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1;
  var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
  if (singleLineOnly || forceQuotes) {
    for (i2 = 0;i2 < string.length; char >= 65536 ? i2 += 2 : i2++) {
      char = codePointAt(string, i2);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
  } else {
    for (i2 = 0;i2 < string.length; char >= 65536 ? i2 += 2 : i2++) {
      char = codePointAt(string, i2);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine || i2 - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
          previousLineBreak = i2;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char, prevChar, inblock);
      prevChar = char;
    }
    hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i2 - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
  }
  if (!hasLineBreak && !hasFoldableLine) {
    if (plain && !forceQuotes && !testAmbiguousType(string)) {
      return STYLE_PLAIN;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  if (indentPerLevel > 9 && needIndentIndicator(string)) {
    return STYLE_DOUBLE;
  }
  if (!forceQuotes) {
    return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
  }
  return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
}
function writeScalar(state, string, level, iskey, inblock) {
  state.dump = function() {
    if (string.length === 0) {
      return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
    }
    if (!state.noCompatMode) {
      if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
      }
    }
    var indent = state.indent * Math.max(1, level);
    var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
    var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
    function testAmbiguity(string2) {
      return testImplicitResolving(state, string2);
    }
    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity, state.quotingType, state.forceQuotes && !iskey, inblock)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string) + '"';
      default:
        throw new exception("impossible error: invalid scalar style");
    }
  }();
}
function blockHeader(string, indentPerLevel) {
  var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
  var clip = string[string.length - 1] === `
`;
  var keep = clip && (string[string.length - 2] === `
` || string === `
`);
  var chomp = keep ? "+" : clip ? "" : "-";
  return indentIndicator + chomp + `
`;
}
function dropEndingNewline(string) {
  return string[string.length - 1] === `
` ? string.slice(0, -1) : string;
}
function foldString(string, width) {
  var lineRe = /(\n+)([^\n]*)/g;
  var result = function() {
    var nextLF = string.indexOf(`
`);
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }();
  var prevMoreIndented = string[0] === `
` || string[0] === " ";
  var moreIndented;
  var match;
  while (match = lineRe.exec(string)) {
    var prefix = match[1], line = match[2];
    moreIndented = line[0] === " ";
    result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? `
` : "") + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }
  return result;
}
function foldLine(line, width) {
  if (line === "" || line[0] === " ")
    return line;
  var breakRe = / [^ ]/g;
  var match;
  var start = 0, end, curr = 0, next = 0;
  var result = "";
  while (match = breakRe.exec(line)) {
    next = match.index;
    if (next - start > width) {
      end = curr > start ? curr : next;
      result += `
` + line.slice(start, end);
      start = end + 1;
    }
    curr = next;
  }
  result += `
`;
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + `
` + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }
  return result.slice(1);
}
function escapeString(string) {
  var result = "";
  var char = 0;
  var escapeSeq;
  for (var i2 = 0;i2 < string.length; char >= 65536 ? i2 += 2 : i2++) {
    char = codePointAt(string, i2);
    escapeSeq = ESCAPE_SEQUENCES[char];
    if (!escapeSeq && isPrintable(char)) {
      result += string[i2];
      if (char >= 65536)
        result += string[i2 + 1];
    } else {
      result += escapeSeq || encodeHex(char);
    }
  }
  return result;
}
function writeFlowSequence(state, level, object) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length;index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
      if (_result !== "")
        _result += "," + (!state.condenseFlow ? " " : "");
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = "[" + _result + "]";
}
function writeBlockSequence(state, level, object, compact) {
  var _result = "", _tag = state.tag, index, length, value;
  for (index = 0, length = object.length;index < length; index += 1) {
    value = object[index];
    if (state.replacer) {
      value = state.replacer.call(object, String(index), value);
    }
    if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
      if (!compact || _result !== "") {
        _result += generateNextLine(state, level);
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        _result += "-";
      } else {
        _result += "- ";
      }
      _result += state.dump;
    }
  }
  state.tag = _tag;
  state.dump = _result || "[]";
}
function writeFlowMapping(state, level, object) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
  for (index = 0, length = objectKeyList.length;index < length; index += 1) {
    pairBuffer = "";
    if (_result !== "")
      pairBuffer += ", ";
    if (state.condenseFlow)
      pairBuffer += '"';
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level, objectKey, false, false)) {
      continue;
    }
    if (state.dump.length > 1024)
      pairBuffer += "? ";
    pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
    if (!writeNode(state, level, objectValue, false, false)) {
      continue;
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = "{" + _result + "}";
}
function writeBlockMapping(state, level, object, compact) {
  var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
  if (state.sortKeys === true) {
    objectKeyList.sort();
  } else if (typeof state.sortKeys === "function") {
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    throw new exception("sortKeys must be a boolean or a function");
  }
  for (index = 0, length = objectKeyList.length;index < length; index += 1) {
    pairBuffer = "";
    if (!compact || _result !== "") {
      pairBuffer += generateNextLine(state, level);
    }
    objectKey = objectKeyList[index];
    objectValue = object[objectKey];
    if (state.replacer) {
      objectValue = state.replacer.call(object, objectKey, objectValue);
    }
    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue;
    }
    explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += "?";
      } else {
        pairBuffer += "? ";
      }
    }
    pairBuffer += state.dump;
    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }
    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue;
    }
    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ":";
    } else {
      pairBuffer += ": ";
    }
    pairBuffer += state.dump;
    _result += pairBuffer;
  }
  state.tag = _tag;
  state.dump = _result || "{}";
}
function detectType(state, object, explicit) {
  var _result, typeList, index, length, type2, style;
  typeList = explicit ? state.explicitTypes : state.implicitTypes;
  for (index = 0, length = typeList.length;index < length; index += 1) {
    type2 = typeList[index];
    if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
      if (explicit) {
        if (type2.multi && type2.representName) {
          state.tag = type2.representName(object);
        } else {
          state.tag = type2.tag;
        }
      } else {
        state.tag = "?";
      }
      if (type2.represent) {
        style = state.styleMap[type2.tag] || type2.defaultStyle;
        if (_toString.call(type2.represent) === "[object Function]") {
          _result = type2.represent(object, style);
        } else if (_hasOwnProperty.call(type2.represent, style)) {
          _result = type2.represent[style](object, style);
        } else {
          throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
        }
        state.dump = _result;
      }
      return true;
    }
  }
  return false;
}
function writeNode(state, level, object, block, compact, iskey, isblockseq) {
  state.tag = null;
  state.dump = object;
  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }
  var type2 = _toString.call(state.dump);
  var inblock = block;
  var tagStr;
  if (block) {
    block = state.flowLevel < 0 || state.flowLevel > level;
  }
  var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }
  if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
    compact = false;
  }
  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = "*ref_" + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type2 === "[object Object]") {
      if (block && Object.keys(state.dump).length !== 0) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object Array]") {
      if (block && state.dump.length !== 0) {
        if (state.noArrayIndent && !isblockseq && level > 0) {
          writeBlockSequence(state, level - 1, state.dump, compact);
        } else {
          writeBlockSequence(state, level, state.dump, compact);
        }
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = "&ref_" + duplicateIndex + " " + state.dump;
        }
      }
    } else if (type2 === "[object String]") {
      if (state.tag !== "?") {
        writeScalar(state, state.dump, level, iskey, inblock);
      }
    } else if (type2 === "[object Undefined]") {
      return false;
    } else {
      if (state.skipInvalid)
        return false;
      throw new exception("unacceptable kind of an object to dump " + type2);
    }
    if (state.tag !== null && state.tag !== "?") {
      tagStr = encodeURI(state.tag[0] === "!" ? state.tag.slice(1) : state.tag).replace(/!/g, "%21");
      if (state.tag[0] === "!") {
        tagStr = "!" + tagStr;
      } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
        tagStr = "!!" + tagStr.slice(18);
      } else {
        tagStr = "!<" + tagStr + ">";
      }
      state.dump = tagStr + " " + state.dump;
    }
  }
  return true;
}
function getDuplicateReferences(object, state) {
  var objects = [], duplicatesIndexes = [], index, length;
  inspectNode(object, objects, duplicatesIndexes);
  for (index = 0, length = duplicatesIndexes.length;index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}
function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList, index, length;
  if (object !== null && typeof object === "object") {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);
      if (Array.isArray(object)) {
        for (index = 0, length = object.length;index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);
        for (index = 0, length = objectKeyList.length;index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}
function dump$1(input, options) {
  options = options || {};
  var state = new State(options);
  if (!state.noRefs)
    getDuplicateReferences(input, state);
  var value = input;
  if (state.replacer) {
    value = state.replacer.call({ "": value }, "", value);
  }
  if (writeNode(state, 0, value, true, true))
    return state.dump + `
`;
  return "";
}
function renamed(from, to) {
  return function() {
    throw new Error("Function yaml." + from + " is removed in js-yaml 4. " + "Use yaml." + to + " instead, which is now safe by default.");
  };
}
var isNothing_1, isObject_1, toArray_1, repeat_1, isNegativeZero_1, extend_1, common, exception, snippet, TYPE_CONSTRUCTOR_OPTIONS, YAML_NODE_KINDS, type, schema, str, seq, map, failsafe, _null, bool, int, YAML_FLOAT_PATTERN, SCIENTIFIC_WITHOUT_DOT, float, json, core, YAML_DATE_REGEXP, YAML_TIMESTAMP_REGEXP, timestamp, merge, BASE64_MAP = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`, binary, _hasOwnProperty$3, _toString$2, omap, _toString$1, pairs, _hasOwnProperty$2, set, _default, _hasOwnProperty$1, CONTEXT_FLOW_IN = 1, CONTEXT_FLOW_OUT = 2, CONTEXT_BLOCK_IN = 3, CONTEXT_BLOCK_OUT = 4, CHOMPING_CLIP = 1, CHOMPING_STRIP = 2, CHOMPING_KEEP = 3, PATTERN_NON_PRINTABLE, PATTERN_NON_ASCII_LINE_BREAKS, PATTERN_FLOW_INDICATORS, PATTERN_TAG_HANDLE, PATTERN_TAG_URI, simpleEscapeCheck, simpleEscapeMap, i, directiveHandlers, loadAll_1, load_1, loader, _toString, _hasOwnProperty, CHAR_BOM = 65279, CHAR_TAB = 9, CHAR_LINE_FEED = 10, CHAR_CARRIAGE_RETURN = 13, CHAR_SPACE = 32, CHAR_EXCLAMATION = 33, CHAR_DOUBLE_QUOTE = 34, CHAR_SHARP = 35, CHAR_PERCENT = 37, CHAR_AMPERSAND = 38, CHAR_SINGLE_QUOTE = 39, CHAR_ASTERISK = 42, CHAR_COMMA = 44, CHAR_MINUS = 45, CHAR_COLON = 58, CHAR_EQUALS = 61, CHAR_GREATER_THAN = 62, CHAR_QUESTION = 63, CHAR_COMMERCIAL_AT = 64, CHAR_LEFT_SQUARE_BRACKET = 91, CHAR_RIGHT_SQUARE_BRACKET = 93, CHAR_GRAVE_ACCENT = 96, CHAR_LEFT_CURLY_BRACKET = 123, CHAR_VERTICAL_LINE = 124, CHAR_RIGHT_CURLY_BRACKET = 125, ESCAPE_SEQUENCES, DEPRECATED_BOOLEANS_SYNTAX, DEPRECATED_BASE60_SYNTAX, QUOTING_TYPE_SINGLE = 1, QUOTING_TYPE_DOUBLE = 2, STYLE_PLAIN = 1, STYLE_SINGLE = 2, STYLE_LITERAL = 3, STYLE_FOLDED = 4, STYLE_DOUBLE = 5, dump_1, dumper, Type, Schema, FAILSAFE_SCHEMA, JSON_SCHEMA, CORE_SCHEMA, DEFAULT_SCHEMA, load, loadAll, dump, YAMLException, types, safeLoad, safeLoadAll, safeDump, jsYaml, js_yaml_default;
var init_js_yaml = __esm(() => {
  /*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
  isNothing_1 = isNothing;
  isObject_1 = isObject;
  toArray_1 = toArray;
  repeat_1 = repeat;
  isNegativeZero_1 = isNegativeZero;
  extend_1 = extend;
  common = {
    isNothing: isNothing_1,
    isObject: isObject_1,
    toArray: toArray_1,
    repeat: repeat_1,
    isNegativeZero: isNegativeZero_1,
    extend: extend_1
  };
  YAMLException$1.prototype = Object.create(Error.prototype);
  YAMLException$1.prototype.constructor = YAMLException$1;
  YAMLException$1.prototype.toString = function toString(compact) {
    return this.name + ": " + formatError(this, compact);
  };
  exception = YAMLException$1;
  snippet = makeSnippet;
  TYPE_CONSTRUCTOR_OPTIONS = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ];
  YAML_NODE_KINDS = [
    "scalar",
    "sequence",
    "mapping"
  ];
  type = Type$1;
  Schema$1.prototype.extend = function extend2(definition) {
    var implicit = [];
    var explicit = [];
    if (definition instanceof type) {
      explicit.push(definition);
    } else if (Array.isArray(definition)) {
      explicit = explicit.concat(definition);
    } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
      if (definition.implicit)
        implicit = implicit.concat(definition.implicit);
      if (definition.explicit)
        explicit = explicit.concat(definition.explicit);
    } else {
      throw new exception("Schema.extend argument should be a Type, [ Type ], " + "or a schema definition ({ implicit: [...], explicit: [...] })");
    }
    implicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      if (type$1.loadKind && type$1.loadKind !== "scalar") {
        throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      }
      if (type$1.multi) {
        throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
      }
    });
    explicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
    });
    var result = Object.create(Schema$1.prototype);
    result.implicit = (this.implicit || []).concat(implicit);
    result.explicit = (this.explicit || []).concat(explicit);
    result.compiledImplicit = compileList(result, "implicit");
    result.compiledExplicit = compileList(result, "explicit");
    result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
    return result;
  };
  schema = Schema$1;
  str = new type("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(data) {
      return data !== null ? data : "";
    }
  });
  seq = new type("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(data) {
      return data !== null ? data : [];
    }
  });
  map = new type("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(data) {
      return data !== null ? data : {};
    }
  });
  failsafe = new schema({
    explicit: [
      str,
      seq,
      map
    ]
  });
  _null = new type("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  });
  bool = new type("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function(object) {
        return object ? "true" : "false";
      },
      uppercase: function(object) {
        return object ? "TRUE" : "FALSE";
      },
      camelcase: function(object) {
        return object ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  });
  int = new type("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary: function(obj) {
        return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
      },
      octal: function(obj) {
        return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
      },
      decimal: function(obj) {
        return obj.toString(10);
      },
      hexadecimal: function(obj) {
        return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  });
  YAML_FLOAT_PATTERN = new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?" + "|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?" + "|[-+]?\\.(?:inf|Inf|INF)" + "|\\.(?:nan|NaN|NAN))$");
  SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
  float = new type("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: "lowercase"
  });
  json = failsafe.extend({
    implicit: [
      _null,
      bool,
      int,
      float
    ]
  });
  core = json;
  YAML_DATE_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9])" + "-([0-9][0-9])$");
  YAML_TIMESTAMP_REGEXP = new RegExp("^([0-9][0-9][0-9][0-9])" + "-([0-9][0-9]?)" + "-([0-9][0-9]?)" + "(?:[Tt]|[ \\t]+)" + "([0-9][0-9]?)" + ":([0-9][0-9])" + ":([0-9][0-9])" + "(?:\\.([0-9]*))?" + "(?:[ \\t]*(Z|([-+])([0-9][0-9]?)" + "(?::([0-9][0-9]))?))?$");
  timestamp = new type("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });
  merge = new type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
  });
  binary = new type("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });
  _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  _toString$2 = Object.prototype.toString;
  omap = new type("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });
  _toString$1 = Object.prototype.toString;
  pairs = new type("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });
  _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  set = new type("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });
  _default = core.extend({
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set
    ]
  });
  _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  simpleEscapeCheck = new Array(256);
  simpleEscapeMap = new Array(256);
  for (i = 0;i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }
  directiveHandlers = {
    YAML: function handleYamlDirective(state, name, args) {
      var match, major, minor;
      if (state.version !== null) {
        throwError(state, "duplication of %YAML directive");
      }
      if (args.length !== 1) {
        throwError(state, "YAML directive accepts exactly one argument");
      }
      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
      if (match === null) {
        throwError(state, "ill-formed argument of the YAML directive");
      }
      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);
      if (major !== 1) {
        throwError(state, "unacceptable YAML version of the document");
      }
      state.version = args[0];
      state.checkLineBreaks = minor < 2;
      if (minor !== 1 && minor !== 2) {
        throwWarning(state, "unsupported YAML version of the document");
      }
    },
    TAG: function handleTagDirective(state, name, args) {
      var handle, prefix;
      if (args.length !== 2) {
        throwError(state, "TAG directive accepts exactly two arguments");
      }
      handle = args[0];
      prefix = args[1];
      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
      }
      if (_hasOwnProperty$1.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }
      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
      }
      try {
        prefix = decodeURIComponent(prefix);
      } catch (err) {
        throwError(state, "tag prefix is malformed: " + prefix);
      }
      state.tagMap[handle] = prefix;
    }
  };
  loadAll_1 = loadAll$1;
  load_1 = load$1;
  loader = {
    loadAll: loadAll_1,
    load: load_1
  };
  _toString = Object.prototype.toString;
  _hasOwnProperty = Object.prototype.hasOwnProperty;
  ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0] = "\\0";
  ESCAPE_SEQUENCES[7] = "\\a";
  ESCAPE_SEQUENCES[8] = "\\b";
  ESCAPE_SEQUENCES[9] = "\\t";
  ESCAPE_SEQUENCES[10] = "\\n";
  ESCAPE_SEQUENCES[11] = "\\v";
  ESCAPE_SEQUENCES[12] = "\\f";
  ESCAPE_SEQUENCES[13] = "\\r";
  ESCAPE_SEQUENCES[27] = "\\e";
  ESCAPE_SEQUENCES[34] = "\\\"";
  ESCAPE_SEQUENCES[92] = "\\\\";
  ESCAPE_SEQUENCES[133] = "\\N";
  ESCAPE_SEQUENCES[160] = "\\_";
  ESCAPE_SEQUENCES[8232] = "\\L";
  ESCAPE_SEQUENCES[8233] = "\\P";
  DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ];
  DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  dump_1 = dump$1;
  dumper = {
    dump: dump_1
  };
  Type = type;
  Schema = schema;
  FAILSAFE_SCHEMA = failsafe;
  JSON_SCHEMA = json;
  CORE_SCHEMA = core;
  DEFAULT_SCHEMA = _default;
  load = loader.load;
  loadAll = loader.loadAll;
  dump = dumper.dump;
  YAMLException = exception;
  types = {
    binary,
    float,
    map,
    null: _null,
    pairs,
    set,
    timestamp,
    bool,
    int,
    merge,
    omap,
    seq,
    str
  };
  safeLoad = renamed("safeLoad", "load");
  safeLoadAll = renamed("safeLoadAll", "loadAll");
  safeDump = renamed("safeDump", "dump");
  jsYaml = {
    Type,
    Schema,
    FAILSAFE_SCHEMA,
    JSON_SCHEMA,
    CORE_SCHEMA,
    DEFAULT_SCHEMA,
    load,
    loadAll,
    dump,
    YAMLException,
    types,
    safeLoad,
    safeLoadAll,
    safeDump
  };
  js_yaml_default = jsYaml;
});

// node_modules/bail/index.js
function bail(error) {
  if (error) {
    throw error;
  }
}

// node_modules/extend/index.js
var require_extend = __commonJS((exports, module) => {
  var hasOwn = Object.prototype.hasOwnProperty;
  var toStr = Object.prototype.toString;
  var defineProperty = Object.defineProperty;
  var gOPD = Object.getOwnPropertyDescriptor;
  var isArray = function isArray(arr) {
    if (typeof Array.isArray === "function") {
      return Array.isArray(arr);
    }
    return toStr.call(arr) === "[object Array]";
  };
  var isPlainObject = function isPlainObject(obj) {
    if (!obj || toStr.call(obj) !== "[object Object]") {
      return false;
    }
    var hasOwnConstructor = hasOwn.call(obj, "constructor");
    var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, "isPrototypeOf");
    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
      return false;
    }
    var key;
    for (key in obj) {}
    return typeof key === "undefined" || hasOwn.call(obj, key);
  };
  var setProperty = function setProperty(target, options) {
    if (defineProperty && options.name === "__proto__") {
      defineProperty(target, options.name, {
        enumerable: true,
        configurable: true,
        value: options.newValue,
        writable: true
      });
    } else {
      target[options.name] = options.newValue;
    }
  };
  var getProperty = function getProperty(obj, name) {
    if (name === "__proto__") {
      if (!hasOwn.call(obj, name)) {
        return;
      } else if (gOPD) {
        return gOPD(obj, name).value;
      }
    }
    return obj[name];
  };
  module.exports = function extend() {
    var options, name, src, copy, copyIsArray, clone;
    var target = arguments[0];
    var i2 = 1;
    var length = arguments.length;
    var deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i2 = 2;
    }
    if (target == null || typeof target !== "object" && typeof target !== "function") {
      target = {};
    }
    for (;i2 < length; ++i2) {
      options = arguments[i2];
      if (options != null) {
        for (name in options) {
          src = getProperty(target, name);
          copy = getProperty(options, name);
          if (target !== copy) {
            if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
              if (copyIsArray) {
                copyIsArray = false;
                clone = src && isArray(src) ? src : [];
              } else {
                clone = src && isPlainObject(src) ? src : {};
              }
              setProperty(target, { name, newValue: extend(deep, clone, copy) });
            } else if (typeof copy !== "undefined") {
              setProperty(target, { name, newValue: copy });
            }
          }
        }
      }
    }
    return target;
  };
});

// node_modules/dequal/dist/index.mjs
var init_dist = () => {};

// node_modules/devlop/lib/development.js
function ok(value, message) {
  assert(Boolean(value), false, true, "ok", "Expected value to be truthy", message);
}
function assert(bool2, actual, expected, operator, defaultMessage, userMessage) {
  if (!bool2) {
    throw userMessage instanceof Error ? userMessage : new AssertionError(userMessage || defaultMessage, actual, expected, operator, !userMessage);
  }
}
var codesWarned, AssertionError;
var init_development = __esm(() => {
  init_dist();
  codesWarned = new Set;
  AssertionError = class AssertionError extends Error {
    name = "Assertion";
    code = "ERR_ASSERTION";
    constructor(message, actual, expected, operator, generated) {
      super(message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.actual = actual;
      this.expected = expected;
      this.generated = generated;
      this.operator = operator;
    }
  };
});

// node_modules/is-plain-obj/index.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}

// node_modules/trough/lib/index.js
function trough() {
  const fns = [];
  const pipeline = { run, use };
  return pipeline;
  function run(...values) {
    let middlewareIndex = -1;
    const callback = values.pop();
    if (typeof callback !== "function") {
      throw new TypeError("Expected function as last argument, not " + callback);
    }
    next(null, ...values);
    function next(error, ...output) {
      const fn = fns[++middlewareIndex];
      let index = -1;
      if (error) {
        callback(error);
        return;
      }
      while (++index < values.length) {
        if (output[index] === null || output[index] === undefined) {
          output[index] = values[index];
        }
      }
      values = output;
      if (fn) {
        wrap(fn, next)(...output);
      } else {
        callback(null, ...output);
      }
    }
  }
  function use(middelware) {
    if (typeof middelware !== "function") {
      throw new TypeError("Expected `middelware` to be a function, not " + middelware);
    }
    fns.push(middelware);
    return pipeline;
  }
}
function wrap(middleware, callback) {
  let called;
  return wrapped;
  function wrapped(...parameters) {
    const fnExpectsCallback = middleware.length > parameters.length;
    let result;
    if (fnExpectsCallback) {
      parameters.push(done);
    }
    try {
      result = middleware.apply(this, parameters);
    } catch (error) {
      const exception2 = error;
      if (fnExpectsCallback && called) {
        throw exception2;
      }
      return done(exception2);
    }
    if (!fnExpectsCallback) {
      if (result && result.then && typeof result.then === "function") {
        result.then(then, done);
      } else if (result instanceof Error) {
        done(result);
      } else {
        then(result);
      }
    }
  }
  function done(error, ...output) {
    if (!called) {
      called = true;
      callback(error, ...output);
    }
  }
  function then(value) {
    done(null, value);
  }
}

// node_modules/trough/index.js
var init_trough = () => {};

// node_modules/unist-util-stringify-position/lib/index.js
function stringifyPosition(value) {
  if (!value || typeof value !== "object") {
    return "";
  }
  if ("position" in value || "type" in value) {
    return position(value.position);
  }
  if ("start" in value || "end" in value) {
    return position(value);
  }
  if ("line" in value || "column" in value) {
    return point(value);
  }
  return "";
}
function point(point2) {
  return index(point2 && point2.line) + ":" + index(point2 && point2.column);
}
function position(pos) {
  return point(pos && pos.start) + "-" + point(pos && pos.end);
}
function index(value) {
  return value && typeof value === "number" ? value : 1;
}

// node_modules/unist-util-stringify-position/index.js
var init_unist_util_stringify_position = () => {};

// node_modules/vfile-message/lib/index.js
var VFileMessage;
var init_lib = __esm(() => {
  init_unist_util_stringify_position();
  VFileMessage = class VFileMessage extends Error {
    constructor(causeOrReason, optionsOrParentOrPlace, origin) {
      super();
      if (typeof optionsOrParentOrPlace === "string") {
        origin = optionsOrParentOrPlace;
        optionsOrParentOrPlace = undefined;
      }
      let reason = "";
      let options = {};
      let legacyCause = false;
      if (optionsOrParentOrPlace) {
        if ("line" in optionsOrParentOrPlace && "column" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("start" in optionsOrParentOrPlace && "end" in optionsOrParentOrPlace) {
          options = { place: optionsOrParentOrPlace };
        } else if ("type" in optionsOrParentOrPlace) {
          options = {
            ancestors: [optionsOrParentOrPlace],
            place: optionsOrParentOrPlace.position
          };
        } else {
          options = { ...optionsOrParentOrPlace };
        }
      }
      if (typeof causeOrReason === "string") {
        reason = causeOrReason;
      } else if (!options.cause && causeOrReason) {
        legacyCause = true;
        reason = causeOrReason.message;
        options.cause = causeOrReason;
      }
      if (!options.ruleId && !options.source && typeof origin === "string") {
        const index2 = origin.indexOf(":");
        if (index2 === -1) {
          options.ruleId = origin;
        } else {
          options.source = origin.slice(0, index2);
          options.ruleId = origin.slice(index2 + 1);
        }
      }
      if (!options.place && options.ancestors && options.ancestors) {
        const parent = options.ancestors[options.ancestors.length - 1];
        if (parent) {
          options.place = parent.position;
        }
      }
      const start = options.place && "start" in options.place ? options.place.start : options.place;
      this.ancestors = options.ancestors || undefined;
      this.cause = options.cause || undefined;
      this.column = start ? start.column : undefined;
      this.fatal = undefined;
      this.file = "";
      this.message = reason;
      this.line = start ? start.line : undefined;
      this.name = stringifyPosition(options.place) || "1:1";
      this.place = options.place || undefined;
      this.reason = this.message;
      this.ruleId = options.ruleId || undefined;
      this.source = options.source || undefined;
      this.stack = legacyCause && options.cause && typeof options.cause.stack === "string" ? options.cause.stack : "";
      this.actual = undefined;
      this.expected = undefined;
      this.note = undefined;
      this.url = undefined;
    }
  };
  VFileMessage.prototype.file = "";
  VFileMessage.prototype.name = "";
  VFileMessage.prototype.reason = "";
  VFileMessage.prototype.message = "";
  VFileMessage.prototype.stack = "";
  VFileMessage.prototype.column = undefined;
  VFileMessage.prototype.line = undefined;
  VFileMessage.prototype.ancestors = undefined;
  VFileMessage.prototype.cause = undefined;
  VFileMessage.prototype.fatal = undefined;
  VFileMessage.prototype.place = undefined;
  VFileMessage.prototype.ruleId = undefined;
  VFileMessage.prototype.source = undefined;
});

// node_modules/vfile-message/index.js
var init_vfile_message = __esm(() => {
  init_lib();
});

// node_modules/vfile/lib/minpath.browser.js
function basename2(path, extname2) {
  if (extname2 !== undefined && typeof extname2 !== "string") {
    throw new TypeError('"ext" argument must be a string');
  }
  assertPath2(path);
  let start = 0;
  let end = -1;
  let index2 = path.length;
  let seenNonSlash;
  if (extname2 === undefined || extname2.length === 0 || extname2.length > path.length) {
    while (index2--) {
      if (path.codePointAt(index2) === 47) {
        if (seenNonSlash) {
          start = index2 + 1;
          break;
        }
      } else if (end < 0) {
        seenNonSlash = true;
        end = index2 + 1;
      }
    }
    return end < 0 ? "" : path.slice(start, end);
  }
  if (extname2 === path) {
    return "";
  }
  let firstNonSlashEnd = -1;
  let extnameIndex = extname2.length - 1;
  while (index2--) {
    if (path.codePointAt(index2) === 47) {
      if (seenNonSlash) {
        start = index2 + 1;
        break;
      }
    } else {
      if (firstNonSlashEnd < 0) {
        seenNonSlash = true;
        firstNonSlashEnd = index2 + 1;
      }
      if (extnameIndex > -1) {
        if (path.codePointAt(index2) === extname2.codePointAt(extnameIndex--)) {
          if (extnameIndex < 0) {
            end = index2;
          }
        } else {
          extnameIndex = -1;
          end = firstNonSlashEnd;
        }
      }
    }
  }
  if (start === end) {
    end = firstNonSlashEnd;
  } else if (end < 0) {
    end = path.length;
  }
  return path.slice(start, end);
}
function dirname2(path) {
  assertPath2(path);
  if (path.length === 0) {
    return ".";
  }
  let end = -1;
  let index2 = path.length;
  let unmatchedSlash;
  while (--index2) {
    if (path.codePointAt(index2) === 47) {
      if (unmatchedSlash) {
        end = index2;
        break;
      }
    } else if (!unmatchedSlash) {
      unmatchedSlash = true;
    }
  }
  return end < 0 ? path.codePointAt(0) === 47 ? "/" : "." : end === 1 && path.codePointAt(0) === 47 ? "//" : path.slice(0, end);
}
function extname2(path) {
  assertPath2(path);
  let index2 = path.length;
  let end = -1;
  let startPart = 0;
  let startDot = -1;
  let preDotState = 0;
  let unmatchedSlash;
  while (index2--) {
    const code = path.codePointAt(index2);
    if (code === 47) {
      if (unmatchedSlash) {
        startPart = index2 + 1;
        break;
      }
      continue;
    }
    if (end < 0) {
      unmatchedSlash = true;
      end = index2 + 1;
    }
    if (code === 46) {
      if (startDot < 0) {
        startDot = index2;
      } else if (preDotState !== 1) {
        preDotState = 1;
      }
    } else if (startDot > -1) {
      preDotState = -1;
    }
  }
  if (startDot < 0 || end < 0 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    return "";
  }
  return path.slice(startDot, end);
}
function join2(...segments) {
  let index2 = -1;
  let joined;
  while (++index2 < segments.length) {
    assertPath2(segments[index2]);
    if (segments[index2]) {
      joined = joined === undefined ? segments[index2] : joined + "/" + segments[index2];
    }
  }
  return joined === undefined ? "." : normalize2(joined);
}
function normalize2(path) {
  assertPath2(path);
  const absolute = path.codePointAt(0) === 47;
  let value = normalizeString(path, !absolute);
  if (value.length === 0 && !absolute) {
    value = ".";
  }
  if (value.length > 0 && path.codePointAt(path.length - 1) === 47) {
    value += "/";
  }
  return absolute ? "/" + value : value;
}
function normalizeString(path, allowAboveRoot) {
  let result = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let index2 = -1;
  let code;
  let lastSlashIndex;
  while (++index2 <= path.length) {
    if (index2 < path.length) {
      code = path.codePointAt(index2);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === index2 - 1 || dots === 1) {} else if (lastSlash !== index2 - 1 && dots === 2) {
        if (result.length < 2 || lastSegmentLength !== 2 || result.codePointAt(result.length - 1) !== 46 || result.codePointAt(result.length - 2) !== 46) {
          if (result.length > 2) {
            lastSlashIndex = result.lastIndexOf("/");
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex < 0) {
                result = "";
                lastSegmentLength = 0;
              } else {
                result = result.slice(0, lastSlashIndex);
                lastSegmentLength = result.length - 1 - result.lastIndexOf("/");
              }
              lastSlash = index2;
              dots = 0;
              continue;
            }
          } else if (result.length > 0) {
            result = "";
            lastSegmentLength = 0;
            lastSlash = index2;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          result = result.length > 0 ? result + "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (result.length > 0) {
          result += "/" + path.slice(lastSlash + 1, index2);
        } else {
          result = path.slice(lastSlash + 1, index2);
        }
        lastSegmentLength = index2 - lastSlash - 1;
      }
      lastSlash = index2;
      dots = 0;
    } else if (code === 46 && dots > -1) {
      dots++;
    } else {
      dots = -1;
    }
  }
  return result;
}
function assertPath2(path) {
  if (typeof path !== "string") {
    throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
  }
}
var minpath;
var init_minpath_browser = __esm(() => {
  minpath = { basename: basename2, dirname: dirname2, extname: extname2, join: join2, sep: "/" };
});

// node_modules/vfile/lib/minproc.browser.js
function cwd() {
  return "/";
}
var minproc;
var init_minproc_browser = __esm(() => {
  minproc = { cwd };
});

// node_modules/vfile/lib/minurl.shared.js
function isUrl(fileUrlOrPath) {
  return Boolean(fileUrlOrPath !== null && typeof fileUrlOrPath === "object" && "href" in fileUrlOrPath && fileUrlOrPath.href && "protocol" in fileUrlOrPath && fileUrlOrPath.protocol && fileUrlOrPath.auth === undefined);
}

// node_modules/vfile/lib/minurl.browser.js
function urlToPath(path) {
  if (typeof path === "string") {
    path = new URL(path);
  } else if (!isUrl(path)) {
    const error = new TypeError('The "path" argument must be of type string or an instance of URL. Received `' + path + "`");
    error.code = "ERR_INVALID_ARG_TYPE";
    throw error;
  }
  if (path.protocol !== "file:") {
    const error = new TypeError("The URL must be of scheme file");
    error.code = "ERR_INVALID_URL_SCHEME";
    throw error;
  }
  return getPathFromURLPosix(path);
}
function getPathFromURLPosix(url) {
  if (url.hostname !== "") {
    const error = new TypeError('File URL host must be "localhost" or empty on darwin');
    error.code = "ERR_INVALID_FILE_URL_HOST";
    throw error;
  }
  const pathname = url.pathname;
  let index2 = -1;
  while (++index2 < pathname.length) {
    if (pathname.codePointAt(index2) === 37 && pathname.codePointAt(index2 + 1) === 50) {
      const third = pathname.codePointAt(index2 + 2);
      if (third === 70 || third === 102) {
        const error = new TypeError("File URL path must not include encoded / characters");
        error.code = "ERR_INVALID_FILE_URL_PATH";
        throw error;
      }
    }
  }
  return decodeURIComponent(pathname);
}
var init_minurl_browser = () => {};

// node_modules/vfile/lib/index.js
class VFile {
  constructor(value) {
    let options;
    if (!value) {
      options = {};
    } else if (isUrl(value)) {
      options = { path: value };
    } else if (typeof value === "string" || isUint8Array(value)) {
      options = { value };
    } else {
      options = value;
    }
    this.cwd = "cwd" in options ? "" : minproc.cwd();
    this.data = {};
    this.history = [];
    this.messages = [];
    this.value;
    this.map;
    this.result;
    this.stored;
    let index2 = -1;
    while (++index2 < order.length) {
      const field2 = order[index2];
      if (field2 in options && options[field2] !== undefined && options[field2] !== null) {
        this[field2] = field2 === "history" ? [...options[field2]] : options[field2];
      }
    }
    let field;
    for (field in options) {
      if (!order.includes(field)) {
        this[field] = options[field];
      }
    }
  }
  get basename() {
    return typeof this.path === "string" ? minpath.basename(this.path) : undefined;
  }
  set basename(basename3) {
    assertNonEmpty(basename3, "basename");
    assertPart(basename3, "basename");
    this.path = minpath.join(this.dirname || "", basename3);
  }
  get dirname() {
    return typeof this.path === "string" ? minpath.dirname(this.path) : undefined;
  }
  set dirname(dirname3) {
    assertPath3(this.basename, "dirname");
    this.path = minpath.join(dirname3 || "", this.basename);
  }
  get extname() {
    return typeof this.path === "string" ? minpath.extname(this.path) : undefined;
  }
  set extname(extname3) {
    assertPart(extname3, "extname");
    assertPath3(this.dirname, "extname");
    if (extname3) {
      if (extname3.codePointAt(0) !== 46) {
        throw new Error("`extname` must start with `.`");
      }
      if (extname3.includes(".", 1)) {
        throw new Error("`extname` cannot contain multiple dots");
      }
    }
    this.path = minpath.join(this.dirname, this.stem + (extname3 || ""));
  }
  get path() {
    return this.history[this.history.length - 1];
  }
  set path(path) {
    if (isUrl(path)) {
      path = urlToPath(path);
    }
    assertNonEmpty(path, "path");
    if (this.path !== path) {
      this.history.push(path);
    }
  }
  get stem() {
    return typeof this.path === "string" ? minpath.basename(this.path, this.extname) : undefined;
  }
  set stem(stem) {
    assertNonEmpty(stem, "stem");
    assertPart(stem, "stem");
    this.path = minpath.join(this.dirname || "", stem + (this.extname || ""));
  }
  fail(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
    message.fatal = true;
    throw message;
  }
  info(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = this.message(causeOrReason, optionsOrParentOrPlace, origin);
    message.fatal = undefined;
    return message;
  }
  message(causeOrReason, optionsOrParentOrPlace, origin) {
    const message = new VFileMessage(causeOrReason, optionsOrParentOrPlace, origin);
    if (this.path) {
      message.name = this.path + ":" + message.name;
      message.file = this.path;
    }
    message.fatal = false;
    this.messages.push(message);
    return message;
  }
  toString(encoding) {
    if (this.value === undefined) {
      return "";
    }
    if (typeof this.value === "string") {
      return this.value;
    }
    const decoder = new TextDecoder(encoding || undefined);
    return decoder.decode(this.value);
  }
}
function assertPart(part, name) {
  if (part && part.includes(minpath.sep)) {
    throw new Error("`" + name + "` cannot be a path: did not expect `" + minpath.sep + "`");
  }
}
function assertNonEmpty(part, name) {
  if (!part) {
    throw new Error("`" + name + "` cannot be empty");
  }
}
function assertPath3(path, name) {
  if (!path) {
    throw new Error("Setting `" + name + "` requires `path` to be set too");
  }
}
function isUint8Array(value) {
  return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}
var order;
var init_lib2 = __esm(() => {
  init_vfile_message();
  init_minpath_browser();
  init_minproc_browser();
  init_minurl_browser();
  order = [
    "history",
    "path",
    "basename",
    "stem",
    "extname",
    "dirname"
  ];
});

// node_modules/vfile/index.js
var init_vfile = __esm(() => {
  init_lib2();
});

// node_modules/unified/lib/callable-instance.js
var CallableInstance = function(property) {
  const self2 = this;
  const constr = self2.constructor;
  const proto = constr.prototype;
  const value = proto[property];
  const apply = function() {
    return value.apply(apply, arguments);
  };
  Object.setPrototypeOf(apply, proto);
  return apply;
};

// node_modules/unified/lib/index.js
function assertParser(name, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name + "` without `parser`");
  }
}
function assertCompiler(name, value) {
  if (typeof value !== "function") {
    throw new TypeError("Cannot `" + name + "` without `compiler`");
  }
}
function assertUnfrozen(name, frozen) {
  if (frozen) {
    throw new Error("Cannot call `" + name + "` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.");
  }
}
function assertNode(node) {
  if (!isPlainObject(node) || typeof node.type !== "string") {
    throw new TypeError("Expected node, got `" + node + "`");
  }
}
function assertDone(name, asyncName, complete) {
  if (!complete) {
    throw new Error("`" + name + "` finished async. Use `" + asyncName + "` instead");
  }
}
function vfile(value) {
  return looksLikeAVFile(value) ? value : new VFile(value);
}
function looksLikeAVFile(value) {
  return Boolean(value && typeof value === "object" && "message" in value && "messages" in value);
}
function looksLikeAValue(value) {
  return typeof value === "string" || isUint8Array2(value);
}
function isUint8Array2(value) {
  return Boolean(value && typeof value === "object" && "byteLength" in value && "byteOffset" in value);
}
var import_extend, own, Processor, unified;
var init_lib3 = __esm(() => {
  import_extend = __toESM(require_extend(), 1);
  init_development();
  init_trough();
  init_vfile();
  own = {}.hasOwnProperty;
  Processor = class Processor extends CallableInstance {
    constructor() {
      super("copy");
      this.Compiler = undefined;
      this.Parser = undefined;
      this.attachers = [];
      this.compiler = undefined;
      this.freezeIndex = -1;
      this.frozen = undefined;
      this.namespace = {};
      this.parser = undefined;
      this.transformers = trough();
    }
    copy() {
      const destination = new Processor;
      let index2 = -1;
      while (++index2 < this.attachers.length) {
        const attacher = this.attachers[index2];
        destination.use(...attacher);
      }
      destination.data(import_extend.default(true, {}, this.namespace));
      return destination;
    }
    data(key, value) {
      if (typeof key === "string") {
        if (arguments.length === 2) {
          assertUnfrozen("data", this.frozen);
          this.namespace[key] = value;
          return this;
        }
        return own.call(this.namespace, key) && this.namespace[key] || undefined;
      }
      if (key) {
        assertUnfrozen("data", this.frozen);
        this.namespace = key;
        return this;
      }
      return this.namespace;
    }
    freeze() {
      if (this.frozen) {
        return this;
      }
      const self2 = this;
      while (++this.freezeIndex < this.attachers.length) {
        const [attacher, ...options] = this.attachers[this.freezeIndex];
        if (options[0] === false) {
          continue;
        }
        if (options[0] === true) {
          options[0] = undefined;
        }
        const transformer = attacher.call(self2, ...options);
        if (typeof transformer === "function") {
          this.transformers.use(transformer);
        }
      }
      this.frozen = true;
      this.freezeIndex = Number.POSITIVE_INFINITY;
      return this;
    }
    parse(file) {
      this.freeze();
      const realFile = vfile(file);
      const parser = this.parser || this.Parser;
      assertParser("parse", parser);
      return parser(String(realFile), realFile);
    }
    process(file, done) {
      const self2 = this;
      this.freeze();
      assertParser("process", this.parser || this.Parser);
      assertCompiler("process", this.compiler || this.Compiler);
      return done ? executor(undefined, done) : new Promise(executor);
      function executor(resolve2, reject) {
        const realFile = vfile(file);
        const parseTree = self2.parse(realFile);
        self2.run(parseTree, realFile, function(error, tree, file2) {
          if (error || !tree || !file2) {
            return realDone(error);
          }
          const compileTree = tree;
          const compileResult = self2.stringify(compileTree, file2);
          if (looksLikeAValue(compileResult)) {
            file2.value = compileResult;
          } else {
            file2.result = compileResult;
          }
          realDone(error, file2);
        });
        function realDone(error, file2) {
          if (error || !file2) {
            reject(error);
          } else if (resolve2) {
            resolve2(file2);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(undefined, file2);
          }
        }
      }
    }
    processSync(file) {
      let complete = false;
      let result;
      this.freeze();
      assertParser("processSync", this.parser || this.Parser);
      assertCompiler("processSync", this.compiler || this.Compiler);
      this.process(file, realDone);
      assertDone("processSync", "process", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, file2) {
        complete = true;
        bail(error);
        result = file2;
      }
    }
    run(tree, file, done) {
      assertNode(tree);
      this.freeze();
      const transformers = this.transformers;
      if (!done && typeof file === "function") {
        done = file;
        file = undefined;
      }
      return done ? executor(undefined, done) : new Promise(executor);
      function executor(resolve2, reject) {
        ok(typeof file !== "function", "`file` can’t be a `done` anymore, we checked");
        const realFile = vfile(file);
        transformers.run(tree, realFile, realDone);
        function realDone(error, outputTree, file2) {
          const resultingTree = outputTree || tree;
          if (error) {
            reject(error);
          } else if (resolve2) {
            resolve2(resultingTree);
          } else {
            ok(done, "`done` is defined if `resolve` is not");
            done(undefined, resultingTree, file2);
          }
        }
      }
    }
    runSync(tree, file) {
      let complete = false;
      let result;
      this.run(tree, file, realDone);
      assertDone("runSync", "run", complete);
      ok(result, "we either bailed on an error or have a tree");
      return result;
      function realDone(error, tree2) {
        bail(error);
        result = tree2;
        complete = true;
      }
    }
    stringify(tree, file) {
      this.freeze();
      const realFile = vfile(file);
      const compiler = this.compiler || this.Compiler;
      assertCompiler("stringify", compiler);
      assertNode(tree);
      return compiler(tree, realFile);
    }
    use(value, ...parameters) {
      const attachers = this.attachers;
      const namespace = this.namespace;
      assertUnfrozen("use", this.frozen);
      if (value === null || value === undefined) {} else if (typeof value === "function") {
        addPlugin(value, parameters);
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          addList(value);
        } else {
          addPreset(value);
        }
      } else {
        throw new TypeError("Expected usable value, not `" + value + "`");
      }
      return this;
      function add(value2) {
        if (typeof value2 === "function") {
          addPlugin(value2, []);
        } else if (typeof value2 === "object") {
          if (Array.isArray(value2)) {
            const [plugin, ...parameters2] = value2;
            addPlugin(plugin, parameters2);
          } else {
            addPreset(value2);
          }
        } else {
          throw new TypeError("Expected usable value, not `" + value2 + "`");
        }
      }
      function addPreset(result) {
        if (!("plugins" in result) && !("settings" in result)) {
          throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");
        }
        addList(result.plugins);
        if (result.settings) {
          namespace.settings = import_extend.default(true, namespace.settings, result.settings);
        }
      }
      function addList(plugins) {
        let index2 = -1;
        if (plugins === null || plugins === undefined) {} else if (Array.isArray(plugins)) {
          while (++index2 < plugins.length) {
            const thing = plugins[index2];
            add(thing);
          }
        } else {
          throw new TypeError("Expected a list of plugins, not `" + plugins + "`");
        }
      }
      function addPlugin(plugin, parameters2) {
        let index2 = -1;
        let entryIndex = -1;
        while (++index2 < attachers.length) {
          if (attachers[index2][0] === plugin) {
            entryIndex = index2;
            break;
          }
        }
        if (entryIndex === -1) {
          attachers.push([plugin, ...parameters2]);
        } else if (parameters2.length > 0) {
          let [primary, ...rest] = parameters2;
          const currentPrimary = attachers[entryIndex][1];
          if (isPlainObject(currentPrimary) && isPlainObject(primary)) {
            primary = import_extend.default(true, currentPrimary, primary);
          }
          attachers[entryIndex] = [plugin, primary, ...rest];
        }
      }
    }
  };
  unified = new Processor().freeze();
});

// node_modules/unified/index.js
var init_unified = __esm(() => {
  init_lib3();
});

// node_modules/mdast-util-to-string/lib/index.js
function toString2(value, options) {
  const settings = options || emptyOptions;
  const includeImageAlt = typeof settings.includeImageAlt === "boolean" ? settings.includeImageAlt : true;
  const includeHtml = typeof settings.includeHtml === "boolean" ? settings.includeHtml : true;
  return one(value, includeImageAlt, includeHtml);
}
function one(value, includeImageAlt, includeHtml) {
  if (node(value)) {
    if ("value" in value) {
      return value.type === "html" && !includeHtml ? "" : value.value;
    }
    if (includeImageAlt && "alt" in value && value.alt) {
      return value.alt;
    }
    if ("children" in value) {
      return all(value.children, includeImageAlt, includeHtml);
    }
  }
  if (Array.isArray(value)) {
    return all(value, includeImageAlt, includeHtml);
  }
  return "";
}
function all(values, includeImageAlt, includeHtml) {
  const result = [];
  let index2 = -1;
  while (++index2 < values.length) {
    result[index2] = one(values[index2], includeImageAlt, includeHtml);
  }
  return result.join("");
}
function node(value) {
  return Boolean(value && typeof value === "object");
}
var emptyOptions;
var init_lib4 = __esm(() => {
  emptyOptions = {};
});

// node_modules/mdast-util-to-string/index.js
var init_mdast_util_to_string = __esm(() => {
  init_lib4();
});

// node_modules/decode-named-character-reference/index.dom.js
function decodeNamedCharacterReference(value) {
  const characterReference = "&" + value + ";";
  element.innerHTML = characterReference;
  const character = element.textContent;
  if (character.charCodeAt(character.length - 1) === 59 && value !== "semi") {
    return false;
  }
  return character === characterReference ? false : character;
}
var element;
var init_index_dom = __esm(() => {
  element = document.createElement("i");
});

// node_modules/micromark-util-symbol/lib/codes.js
var codes;
var init_codes = __esm(() => {
  codes = {
    carriageReturn: -5,
    lineFeed: -4,
    carriageReturnLineFeed: -3,
    horizontalTab: -2,
    virtualSpace: -1,
    eof: null,
    nul: 0,
    soh: 1,
    stx: 2,
    etx: 3,
    eot: 4,
    enq: 5,
    ack: 6,
    bel: 7,
    bs: 8,
    ht: 9,
    lf: 10,
    vt: 11,
    ff: 12,
    cr: 13,
    so: 14,
    si: 15,
    dle: 16,
    dc1: 17,
    dc2: 18,
    dc3: 19,
    dc4: 20,
    nak: 21,
    syn: 22,
    etb: 23,
    can: 24,
    em: 25,
    sub: 26,
    esc: 27,
    fs: 28,
    gs: 29,
    rs: 30,
    us: 31,
    space: 32,
    exclamationMark: 33,
    quotationMark: 34,
    numberSign: 35,
    dollarSign: 36,
    percentSign: 37,
    ampersand: 38,
    apostrophe: 39,
    leftParenthesis: 40,
    rightParenthesis: 41,
    asterisk: 42,
    plusSign: 43,
    comma: 44,
    dash: 45,
    dot: 46,
    slash: 47,
    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,
    colon: 58,
    semicolon: 59,
    lessThan: 60,
    equalsTo: 61,
    greaterThan: 62,
    questionMark: 63,
    atSign: 64,
    uppercaseA: 65,
    uppercaseB: 66,
    uppercaseC: 67,
    uppercaseD: 68,
    uppercaseE: 69,
    uppercaseF: 70,
    uppercaseG: 71,
    uppercaseH: 72,
    uppercaseI: 73,
    uppercaseJ: 74,
    uppercaseK: 75,
    uppercaseL: 76,
    uppercaseM: 77,
    uppercaseN: 78,
    uppercaseO: 79,
    uppercaseP: 80,
    uppercaseQ: 81,
    uppercaseR: 82,
    uppercaseS: 83,
    uppercaseT: 84,
    uppercaseU: 85,
    uppercaseV: 86,
    uppercaseW: 87,
    uppercaseX: 88,
    uppercaseY: 89,
    uppercaseZ: 90,
    leftSquareBracket: 91,
    backslash: 92,
    rightSquareBracket: 93,
    caret: 94,
    underscore: 95,
    graveAccent: 96,
    lowercaseA: 97,
    lowercaseB: 98,
    lowercaseC: 99,
    lowercaseD: 100,
    lowercaseE: 101,
    lowercaseF: 102,
    lowercaseG: 103,
    lowercaseH: 104,
    lowercaseI: 105,
    lowercaseJ: 106,
    lowercaseK: 107,
    lowercaseL: 108,
    lowercaseM: 109,
    lowercaseN: 110,
    lowercaseO: 111,
    lowercaseP: 112,
    lowercaseQ: 113,
    lowercaseR: 114,
    lowercaseS: 115,
    lowercaseT: 116,
    lowercaseU: 117,
    lowercaseV: 118,
    lowercaseW: 119,
    lowercaseX: 120,
    lowercaseY: 121,
    lowercaseZ: 122,
    leftCurlyBrace: 123,
    verticalBar: 124,
    rightCurlyBrace: 125,
    tilde: 126,
    del: 127,
    byteOrderMarker: 65279,
    replacementCharacter: 65533
  };
});

// node_modules/micromark-util-symbol/lib/constants.js
var constants;
var init_constants2 = __esm(() => {
  constants = {
    attentionSideAfter: 2,
    attentionSideBefore: 1,
    atxHeadingOpeningFenceSizeMax: 6,
    autolinkDomainSizeMax: 63,
    autolinkSchemeSizeMax: 32,
    cdataOpeningString: "CDATA[",
    characterGroupPunctuation: 2,
    characterGroupWhitespace: 1,
    characterReferenceDecimalSizeMax: 7,
    characterReferenceHexadecimalSizeMax: 6,
    characterReferenceNamedSizeMax: 31,
    codeFencedSequenceSizeMin: 3,
    contentTypeContent: "content",
    contentTypeDocument: "document",
    contentTypeFlow: "flow",
    contentTypeString: "string",
    contentTypeText: "text",
    hardBreakPrefixSizeMin: 2,
    htmlBasic: 6,
    htmlCdata: 5,
    htmlComment: 2,
    htmlComplete: 7,
    htmlDeclaration: 4,
    htmlInstruction: 3,
    htmlRawSizeMax: 8,
    htmlRaw: 1,
    linkResourceDestinationBalanceMax: 32,
    linkReferenceSizeMax: 999,
    listItemValueSizeMax: 10,
    numericBaseDecimal: 10,
    numericBaseHexadecimal: 16,
    tabSize: 4,
    thematicBreakMarkerCountMin: 3,
    v8MaxSafeChunkSize: 1e4
  };
});

// node_modules/micromark-util-symbol/lib/types.js
var types2;
var init_types = __esm(() => {
  types2 = {
    data: "data",
    whitespace: "whitespace",
    lineEnding: "lineEnding",
    lineEndingBlank: "lineEndingBlank",
    linePrefix: "linePrefix",
    lineSuffix: "lineSuffix",
    atxHeading: "atxHeading",
    atxHeadingSequence: "atxHeadingSequence",
    atxHeadingText: "atxHeadingText",
    autolink: "autolink",
    autolinkEmail: "autolinkEmail",
    autolinkMarker: "autolinkMarker",
    autolinkProtocol: "autolinkProtocol",
    characterEscape: "characterEscape",
    characterEscapeValue: "characterEscapeValue",
    characterReference: "characterReference",
    characterReferenceMarker: "characterReferenceMarker",
    characterReferenceMarkerNumeric: "characterReferenceMarkerNumeric",
    characterReferenceMarkerHexadecimal: "characterReferenceMarkerHexadecimal",
    characterReferenceValue: "characterReferenceValue",
    codeFenced: "codeFenced",
    codeFencedFence: "codeFencedFence",
    codeFencedFenceSequence: "codeFencedFenceSequence",
    codeFencedFenceInfo: "codeFencedFenceInfo",
    codeFencedFenceMeta: "codeFencedFenceMeta",
    codeFlowValue: "codeFlowValue",
    codeIndented: "codeIndented",
    codeText: "codeText",
    codeTextData: "codeTextData",
    codeTextPadding: "codeTextPadding",
    codeTextSequence: "codeTextSequence",
    content: "content",
    definition: "definition",
    definitionDestination: "definitionDestination",
    definitionDestinationLiteral: "definitionDestinationLiteral",
    definitionDestinationLiteralMarker: "definitionDestinationLiteralMarker",
    definitionDestinationRaw: "definitionDestinationRaw",
    definitionDestinationString: "definitionDestinationString",
    definitionLabel: "definitionLabel",
    definitionLabelMarker: "definitionLabelMarker",
    definitionLabelString: "definitionLabelString",
    definitionMarker: "definitionMarker",
    definitionTitle: "definitionTitle",
    definitionTitleMarker: "definitionTitleMarker",
    definitionTitleString: "definitionTitleString",
    emphasis: "emphasis",
    emphasisSequence: "emphasisSequence",
    emphasisText: "emphasisText",
    escapeMarker: "escapeMarker",
    hardBreakEscape: "hardBreakEscape",
    hardBreakTrailing: "hardBreakTrailing",
    htmlFlow: "htmlFlow",
    htmlFlowData: "htmlFlowData",
    htmlText: "htmlText",
    htmlTextData: "htmlTextData",
    image: "image",
    label: "label",
    labelText: "labelText",
    labelLink: "labelLink",
    labelImage: "labelImage",
    labelMarker: "labelMarker",
    labelImageMarker: "labelImageMarker",
    labelEnd: "labelEnd",
    link: "link",
    paragraph: "paragraph",
    reference: "reference",
    referenceMarker: "referenceMarker",
    referenceString: "referenceString",
    resource: "resource",
    resourceDestination: "resourceDestination",
    resourceDestinationLiteral: "resourceDestinationLiteral",
    resourceDestinationLiteralMarker: "resourceDestinationLiteralMarker",
    resourceDestinationRaw: "resourceDestinationRaw",
    resourceDestinationString: "resourceDestinationString",
    resourceMarker: "resourceMarker",
    resourceTitle: "resourceTitle",
    resourceTitleMarker: "resourceTitleMarker",
    resourceTitleString: "resourceTitleString",
    setextHeading: "setextHeading",
    setextHeadingText: "setextHeadingText",
    setextHeadingLine: "setextHeadingLine",
    setextHeadingLineSequence: "setextHeadingLineSequence",
    strong: "strong",
    strongSequence: "strongSequence",
    strongText: "strongText",
    thematicBreak: "thematicBreak",
    thematicBreakSequence: "thematicBreakSequence",
    blockQuote: "blockQuote",
    blockQuotePrefix: "blockQuotePrefix",
    blockQuoteMarker: "blockQuoteMarker",
    blockQuotePrefixWhitespace: "blockQuotePrefixWhitespace",
    listOrdered: "listOrdered",
    listUnordered: "listUnordered",
    listItemIndent: "listItemIndent",
    listItemMarker: "listItemMarker",
    listItemPrefix: "listItemPrefix",
    listItemPrefixWhitespace: "listItemPrefixWhitespace",
    listItemValue: "listItemValue",
    chunkDocument: "chunkDocument",
    chunkContent: "chunkContent",
    chunkFlow: "chunkFlow",
    chunkText: "chunkText",
    chunkString: "chunkString"
  };
});

// node_modules/micromark-util-symbol/lib/values.js
var values;
var init_values = __esm(() => {
  values = {
    ht: "\t",
    lf: `
`,
    cr: "\r",
    space: " ",
    exclamationMark: "!",
    quotationMark: '"',
    numberSign: "#",
    dollarSign: "$",
    percentSign: "%",
    ampersand: "&",
    apostrophe: "'",
    leftParenthesis: "(",
    rightParenthesis: ")",
    asterisk: "*",
    plusSign: "+",
    comma: ",",
    dash: "-",
    dot: ".",
    slash: "/",
    digit0: "0",
    digit1: "1",
    digit2: "2",
    digit3: "3",
    digit4: "4",
    digit5: "5",
    digit6: "6",
    digit7: "7",
    digit8: "8",
    digit9: "9",
    colon: ":",
    semicolon: ";",
    lessThan: "<",
    equalsTo: "=",
    greaterThan: ">",
    questionMark: "?",
    atSign: "@",
    uppercaseA: "A",
    uppercaseB: "B",
    uppercaseC: "C",
    uppercaseD: "D",
    uppercaseE: "E",
    uppercaseF: "F",
    uppercaseG: "G",
    uppercaseH: "H",
    uppercaseI: "I",
    uppercaseJ: "J",
    uppercaseK: "K",
    uppercaseL: "L",
    uppercaseM: "M",
    uppercaseN: "N",
    uppercaseO: "O",
    uppercaseP: "P",
    uppercaseQ: "Q",
    uppercaseR: "R",
    uppercaseS: "S",
    uppercaseT: "T",
    uppercaseU: "U",
    uppercaseV: "V",
    uppercaseW: "W",
    uppercaseX: "X",
    uppercaseY: "Y",
    uppercaseZ: "Z",
    leftSquareBracket: "[",
    backslash: "\\",
    rightSquareBracket: "]",
    caret: "^",
    underscore: "_",
    graveAccent: "`",
    lowercaseA: "a",
    lowercaseB: "b",
    lowercaseC: "c",
    lowercaseD: "d",
    lowercaseE: "e",
    lowercaseF: "f",
    lowercaseG: "g",
    lowercaseH: "h",
    lowercaseI: "i",
    lowercaseJ: "j",
    lowercaseK: "k",
    lowercaseL: "l",
    lowercaseM: "m",
    lowercaseN: "n",
    lowercaseO: "o",
    lowercaseP: "p",
    lowercaseQ: "q",
    lowercaseR: "r",
    lowercaseS: "s",
    lowercaseT: "t",
    lowercaseU: "u",
    lowercaseV: "v",
    lowercaseW: "w",
    lowercaseX: "x",
    lowercaseY: "y",
    lowercaseZ: "z",
    leftCurlyBrace: "{",
    verticalBar: "|",
    rightCurlyBrace: "}",
    tilde: "~",
    replacementCharacter: "�"
  };
});

// node_modules/micromark-util-symbol/lib/default.js
var init_default = __esm(() => {
  init_codes();
  init_constants2();
  init_types();
  init_values();
});

// node_modules/micromark-util-chunked/dev/index.js
function splice(list, start, remove, items) {
  const end = list.length;
  let chunkStart = 0;
  let parameters;
  if (start < 0) {
    start = -start > end ? 0 : end + start;
  } else {
    start = start > end ? end : start;
  }
  remove = remove > 0 ? remove : 0;
  if (items.length < constants.v8MaxSafeChunkSize) {
    parameters = Array.from(items);
    parameters.unshift(start, remove);
    list.splice(...parameters);
  } else {
    if (remove)
      list.splice(start, remove);
    while (chunkStart < items.length) {
      parameters = items.slice(chunkStart, chunkStart + constants.v8MaxSafeChunkSize);
      parameters.unshift(start, 0);
      list.splice(...parameters);
      chunkStart += constants.v8MaxSafeChunkSize;
      start += constants.v8MaxSafeChunkSize;
    }
  }
}
function push(list, items) {
  if (list.length > 0) {
    splice(list, list.length, 0, items);
    return list;
  }
  return items;
}
var init_dev = __esm(() => {
  init_default();
});

// node_modules/micromark-util-combine-extensions/index.js
function combineExtensions(extensions) {
  const all2 = {};
  let index2 = -1;
  while (++index2 < extensions.length) {
    syntaxExtension(all2, extensions[index2]);
  }
  return all2;
}
function syntaxExtension(all2, extension) {
  let hook;
  for (hook in extension) {
    const maybe = hasOwnProperty.call(all2, hook) ? all2[hook] : undefined;
    const left = maybe || (all2[hook] = {});
    const right = extension[hook];
    let code;
    if (right) {
      for (code in right) {
        if (!hasOwnProperty.call(left, code))
          left[code] = [];
        const value = right[code];
        constructs(left[code], Array.isArray(value) ? value : value ? [value] : []);
      }
    }
  }
}
function constructs(existing, list) {
  let index2 = -1;
  const before = [];
  while (++index2 < list.length) {
    (list[index2].add === "after" ? existing : before).push(list[index2]);
  }
  splice(existing, 0, 0, before);
}
var hasOwnProperty;
var init_micromark_util_combine_extensions = __esm(() => {
  init_dev();
  hasOwnProperty = {}.hasOwnProperty;
});

// node_modules/micromark-util-decode-numeric-character-reference/dev/index.js
function decodeNumericCharacterReference(value, base) {
  const code = Number.parseInt(value, base);
  if (code < codes.ht || code === codes.vt || code > codes.cr && code < codes.space || code > codes.tilde && code < 160 || code > 55295 && code < 57344 || code > 64975 && code < 65008 || (code & 65535) === 65535 || (code & 65535) === 65534 || code > 1114111) {
    return values.replacementCharacter;
  }
  return String.fromCodePoint(code);
}
var init_dev2 = __esm(() => {
  init_default();
});

// node_modules/micromark-util-normalize-identifier/dev/index.js
function normalizeIdentifier(value) {
  return value.replace(/[\t\n\r ]+/g, values.space).replace(/^ | $/g, "").toLowerCase().toUpperCase();
}
var init_dev3 = __esm(() => {
  init_default();
});

// node_modules/micromark-util-character/dev/index.js
function asciiControl(code) {
  return code !== null && (code < codes.space || code === codes.del);
}
function markdownLineEnding(code) {
  return code !== null && code < codes.horizontalTab;
}
function markdownLineEndingOrSpace(code) {
  return code !== null && (code < codes.nul || code === codes.space);
}
function markdownSpace(code) {
  return code === codes.horizontalTab || code === codes.virtualSpace || code === codes.space;
}
function regexCheck(regex) {
  return check;
  function check(code) {
    return code !== null && code > -1 && regex.test(String.fromCharCode(code));
  }
}
var asciiAlpha, asciiAlphanumeric, asciiAtext, asciiDigit, asciiHexDigit, asciiPunctuation, unicodePunctuation, unicodeWhitespace;
var init_dev4 = __esm(() => {
  init_default();
  asciiAlpha = regexCheck(/[A-Za-z]/);
  asciiAlphanumeric = regexCheck(/[\dA-Za-z]/);
  asciiAtext = regexCheck(/[#-'*+\--9=?A-Z^-~]/);
  asciiDigit = regexCheck(/\d/);
  asciiHexDigit = regexCheck(/[\dA-Fa-f]/);
  asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/);
  unicodePunctuation = regexCheck(/\p{P}|\p{S}/u);
  unicodeWhitespace = regexCheck(/\s/);
});

// node_modules/micromark-util-sanitize-uri/dev/index.js
function normalizeUri(value) {
  const result = [];
  let index2 = -1;
  let start = 0;
  let skip = 0;
  while (++index2 < value.length) {
    const code = value.charCodeAt(index2);
    let replace = "";
    if (code === codes.percentSign && asciiAlphanumeric(value.charCodeAt(index2 + 1)) && asciiAlphanumeric(value.charCodeAt(index2 + 2))) {
      skip = 2;
    } else if (code < 128) {
      if (!/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(code))) {
        replace = String.fromCharCode(code);
      }
    } else if (code > 55295 && code < 57344) {
      const next = value.charCodeAt(index2 + 1);
      if (code < 56320 && next > 56319 && next < 57344) {
        replace = String.fromCharCode(code, next);
        skip = 1;
      } else {
        replace = values.replacementCharacter;
      }
    } else {
      replace = String.fromCharCode(code);
    }
    if (replace) {
      result.push(value.slice(start, index2), encodeURIComponent(replace));
      start = index2 + skip + 1;
      replace = "";
    }
    if (skip) {
      index2 += skip;
      skip = 0;
    }
  }
  return result.join("") + value.slice(start);
}
var init_dev5 = __esm(() => {
  init_dev4();
  init_default();
});

// node_modules/micromark-factory-space/dev/index.js
function factorySpace(effects, ok2, type2, max) {
  const limit = max ? max - 1 : Number.POSITIVE_INFINITY;
  let size = 0;
  return start;
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type2);
      return prefix(code);
    }
    return ok2(code);
  }
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix;
    }
    effects.exit(type2);
    return ok2(code);
  }
}
var init_dev6 = __esm(() => {
  init_dev4();
});

// node_modules/micromark/dev/lib/initialize/content.js
function initializeContent(effects) {
  const contentStart = effects.attempt(this.parser.constructs.contentInitial, afterContentStartConstruct, paragraphInitial);
  let previous;
  return contentStart;
  function afterContentStartConstruct(code) {
    ok(code === codes.eof || markdownLineEnding(code), "expected eol or eof");
    if (code === codes.eof) {
      effects.consume(code);
      return;
    }
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return factorySpace(effects, contentStart, types2.linePrefix);
  }
  function paragraphInitial(code) {
    ok(code !== codes.eof && !markdownLineEnding(code), "expected anything other than a line ending or EOF");
    effects.enter(types2.paragraph);
    return lineStart(code);
  }
  function lineStart(code) {
    const token = effects.enter(types2.chunkText, {
      contentType: constants.contentTypeText,
      previous
    });
    if (previous) {
      previous.next = token;
    }
    previous = token;
    return data(code);
  }
  function data(code) {
    if (code === codes.eof) {
      effects.exit(types2.chunkText);
      effects.exit(types2.paragraph);
      effects.consume(code);
      return;
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      effects.exit(types2.chunkText);
      return lineStart;
    }
    effects.consume(code);
    return data;
  }
}
var content;
var init_content = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  content = { tokenize: initializeContent };
});

// node_modules/micromark/dev/lib/initialize/document.js
function initializeDocument(effects) {
  const self2 = this;
  const stack = [];
  let continued = 0;
  let childFlow;
  let childToken;
  let lineStartOffset;
  return start;
  function start(code) {
    if (continued < stack.length) {
      const item = stack[continued];
      self2.containerState = item[1];
      ok(item[0].continuation, "expected `continuation` to be defined on container construct");
      return effects.attempt(item[0].continuation, documentContinue, checkNewContainers)(code);
    }
    return checkNewContainers(code);
  }
  function documentContinue(code) {
    ok(self2.containerState, "expected `containerState` to be defined after continuation");
    continued++;
    if (self2.containerState._closeFlow) {
      self2.containerState._closeFlow = undefined;
      if (childFlow) {
        closeFlow();
      }
      const indexBeforeExits = self2.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let point2;
      while (indexBeforeFlow--) {
        if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === types2.chunkFlow) {
          point2 = self2.events[indexBeforeFlow][1].end;
          break;
        }
      }
      ok(point2, "could not find previous flow chunk");
      exitContainers(continued);
      let index2 = indexBeforeExits;
      while (index2 < self2.events.length) {
        self2.events[index2][1].end = { ...point2 };
        index2++;
      }
      splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
      self2.events.length = index2;
      return checkNewContainers(code);
    }
    return start(code);
  }
  function checkNewContainers(code) {
    if (continued === stack.length) {
      if (!childFlow) {
        return documentContinued(code);
      }
      if (childFlow.currentConstruct && childFlow.currentConstruct.concrete) {
        return flowStart(code);
      }
      self2.interrupt = Boolean(childFlow.currentConstruct && !childFlow._gfmTableDynamicInterruptHack);
    }
    self2.containerState = {};
    return effects.check(containerConstruct, thereIsANewContainer, thereIsNoNewContainer)(code);
  }
  function thereIsANewContainer(code) {
    if (childFlow)
      closeFlow();
    exitContainers(continued);
    return documentContinued(code);
  }
  function thereIsNoNewContainer(code) {
    self2.parser.lazy[self2.now().line] = continued !== stack.length;
    lineStartOffset = self2.now().offset;
    return flowStart(code);
  }
  function documentContinued(code) {
    self2.containerState = {};
    return effects.attempt(containerConstruct, containerContinue, flowStart)(code);
  }
  function containerContinue(code) {
    ok(self2.currentConstruct, "expected `currentConstruct` to be defined on tokenizer");
    ok(self2.containerState, "expected `containerState` to be defined on tokenizer");
    continued++;
    stack.push([self2.currentConstruct, self2.containerState]);
    return documentContinued(code);
  }
  function flowStart(code) {
    if (code === codes.eof) {
      if (childFlow)
        closeFlow();
      exitContainers(0);
      effects.consume(code);
      return;
    }
    childFlow = childFlow || self2.parser.flow(self2.now());
    effects.enter(types2.chunkFlow, {
      _tokenizer: childFlow,
      contentType: constants.contentTypeFlow,
      previous: childToken
    });
    return flowContinue(code);
  }
  function flowContinue(code) {
    if (code === codes.eof) {
      writeToChild(effects.exit(types2.chunkFlow), true);
      exitContainers(0);
      effects.consume(code);
      return;
    }
    if (markdownLineEnding(code)) {
      effects.consume(code);
      writeToChild(effects.exit(types2.chunkFlow));
      continued = 0;
      self2.interrupt = undefined;
      return start;
    }
    effects.consume(code);
    return flowContinue;
  }
  function writeToChild(token, endOfFile) {
    ok(childFlow, "expected `childFlow` to be defined when continuing");
    const stream = self2.sliceStream(token);
    if (endOfFile)
      stream.push(null);
    token.previous = childToken;
    if (childToken)
      childToken.next = token;
    childToken = token;
    childFlow.defineSkip(token.start);
    childFlow.write(stream);
    if (self2.parser.lazy[token.start.line]) {
      let index2 = childFlow.events.length;
      while (index2--) {
        if (childFlow.events[index2][1].start.offset < lineStartOffset && (!childFlow.events[index2][1].end || childFlow.events[index2][1].end.offset > lineStartOffset)) {
          return;
        }
      }
      const indexBeforeExits = self2.events.length;
      let indexBeforeFlow = indexBeforeExits;
      let seen;
      let point2;
      while (indexBeforeFlow--) {
        if (self2.events[indexBeforeFlow][0] === "exit" && self2.events[indexBeforeFlow][1].type === types2.chunkFlow) {
          if (seen) {
            point2 = self2.events[indexBeforeFlow][1].end;
            break;
          }
          seen = true;
        }
      }
      ok(point2, "could not find previous flow chunk");
      exitContainers(continued);
      index2 = indexBeforeExits;
      while (index2 < self2.events.length) {
        self2.events[index2][1].end = { ...point2 };
        index2++;
      }
      splice(self2.events, indexBeforeFlow + 1, 0, self2.events.slice(indexBeforeExits));
      self2.events.length = index2;
    }
  }
  function exitContainers(size) {
    let index2 = stack.length;
    while (index2-- > size) {
      const entry = stack[index2];
      self2.containerState = entry[1];
      ok(entry[0].exit, "expected `exit` to be defined on container construct");
      entry[0].exit.call(self2, effects);
    }
    stack.length = size;
  }
  function closeFlow() {
    ok(self2.containerState, "expected `containerState` to be defined when closing flow");
    ok(childFlow, "expected `childFlow` to be defined when closing it");
    childFlow.write([codes.eof]);
    childToken = undefined;
    childFlow = undefined;
    self2.containerState._closeFlow = undefined;
  }
}
function tokenizeContainer(effects, ok2, nok) {
  ok(this.parser.constructs.disable.null, "expected `disable.null` to be populated");
  return factorySpace(effects, effects.attempt(this.parser.constructs.document, ok2, nok), types2.linePrefix, this.parser.constructs.disable.null.includes("codeIndented") ? undefined : constants.tabSize);
}
var document2, containerConstruct;
var init_document = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_dev();
  init_default();
  document2 = { tokenize: initializeDocument };
  containerConstruct = { tokenize: tokenizeContainer };
});

// node_modules/micromark-util-classify-character/dev/index.js
function classifyCharacter(code) {
  if (code === codes.eof || markdownLineEndingOrSpace(code) || unicodeWhitespace(code)) {
    return constants.characterGroupWhitespace;
  }
  if (unicodePunctuation(code)) {
    return constants.characterGroupPunctuation;
  }
}
var init_dev7 = __esm(() => {
  init_dev4();
  init_default();
});

// node_modules/micromark-util-resolve-all/index.js
function resolveAll(constructs2, events, context) {
  const called = [];
  let index2 = -1;
  while (++index2 < constructs2.length) {
    const resolve2 = constructs2[index2].resolveAll;
    if (resolve2 && !called.includes(resolve2)) {
      events = resolve2(events, context);
      called.push(resolve2);
    }
  }
  return events;
}

// node_modules/micromark-core-commonmark/dev/lib/attention.js
function resolveAllAttention(events, context) {
  let index2 = -1;
  let open;
  let group;
  let text;
  let openingSequence;
  let closingSequence;
  let use;
  let nextEvents;
  let offset;
  while (++index2 < events.length) {
    if (events[index2][0] === "enter" && events[index2][1].type === "attentionSequence" && events[index2][1]._close) {
      open = index2;
      while (open--) {
        if (events[open][0] === "exit" && events[open][1].type === "attentionSequence" && events[open][1]._open && context.sliceSerialize(events[open][1]).charCodeAt(0) === context.sliceSerialize(events[index2][1]).charCodeAt(0)) {
          if ((events[open][1]._close || events[index2][1]._open) && (events[index2][1].end.offset - events[index2][1].start.offset) % 3 && !((events[open][1].end.offset - events[open][1].start.offset + events[index2][1].end.offset - events[index2][1].start.offset) % 3)) {
            continue;
          }
          use = events[open][1].end.offset - events[open][1].start.offset > 1 && events[index2][1].end.offset - events[index2][1].start.offset > 1 ? 2 : 1;
          const start = { ...events[open][1].end };
          const end = { ...events[index2][1].start };
          movePoint(start, -use);
          movePoint(end, use);
          openingSequence = {
            type: use > 1 ? types2.strongSequence : types2.emphasisSequence,
            start,
            end: { ...events[open][1].end }
          };
          closingSequence = {
            type: use > 1 ? types2.strongSequence : types2.emphasisSequence,
            start: { ...events[index2][1].start },
            end
          };
          text = {
            type: use > 1 ? types2.strongText : types2.emphasisText,
            start: { ...events[open][1].end },
            end: { ...events[index2][1].start }
          };
          group = {
            type: use > 1 ? types2.strong : types2.emphasis,
            start: { ...openingSequence.start },
            end: { ...closingSequence.end }
          };
          events[open][1].end = { ...openingSequence.start };
          events[index2][1].start = { ...closingSequence.end };
          nextEvents = [];
          if (events[open][1].end.offset - events[open][1].start.offset) {
            nextEvents = push(nextEvents, [
              ["enter", events[open][1], context],
              ["exit", events[open][1], context]
            ]);
          }
          nextEvents = push(nextEvents, [
            ["enter", group, context],
            ["enter", openingSequence, context],
            ["exit", openingSequence, context],
            ["enter", text, context]
          ]);
          ok(context.parser.constructs.insideSpan.null, "expected `insideSpan` to be populated");
          nextEvents = push(nextEvents, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + 1, index2), context));
          nextEvents = push(nextEvents, [
            ["exit", text, context],
            ["enter", closingSequence, context],
            ["exit", closingSequence, context],
            ["exit", group, context]
          ]);
          if (events[index2][1].end.offset - events[index2][1].start.offset) {
            offset = 2;
            nextEvents = push(nextEvents, [
              ["enter", events[index2][1], context],
              ["exit", events[index2][1], context]
            ]);
          } else {
            offset = 0;
          }
          splice(events, open - 1, index2 - open + 3, nextEvents);
          index2 = open + nextEvents.length - offset - 2;
          break;
        }
      }
    }
  }
  index2 = -1;
  while (++index2 < events.length) {
    if (events[index2][1].type === "attentionSequence") {
      events[index2][1].type = "data";
    }
  }
  return events;
}
function tokenizeAttention(effects, ok2) {
  const attentionMarkers = this.parser.constructs.attentionMarkers.null;
  const previous = this.previous;
  const before = classifyCharacter(previous);
  let marker;
  return start;
  function start(code) {
    ok(code === codes.asterisk || code === codes.underscore, "expected asterisk or underscore");
    marker = code;
    effects.enter("attentionSequence");
    return inside(code);
  }
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside;
    }
    const token = effects.exit("attentionSequence");
    const after = classifyCharacter(code);
    ok(attentionMarkers, "expected `attentionMarkers` to be populated");
    const open = !after || after === constants.characterGroupPunctuation && before || attentionMarkers.includes(code);
    const close = !before || before === constants.characterGroupPunctuation && after || attentionMarkers.includes(previous);
    token._open = Boolean(marker === codes.asterisk ? open : open && (before || !close));
    token._close = Boolean(marker === codes.asterisk ? close : close && (after || !open));
    return ok2(code);
  }
}
function movePoint(point2, offset) {
  point2.column += offset;
  point2.offset += offset;
  point2._bufferIndex += offset;
}
var attention;
var init_attention = __esm(() => {
  init_development();
  init_dev();
  init_dev7();
  init_default();
  attention = {
    name: "attention",
    resolveAll: resolveAllAttention,
    tokenize: tokenizeAttention
  };
});

// node_modules/micromark-core-commonmark/dev/lib/autolink.js
function tokenizeAutolink(effects, ok2, nok) {
  let size = 0;
  return start;
  function start(code) {
    ok(code === codes.lessThan, "expected `<`");
    effects.enter(types2.autolink);
    effects.enter(types2.autolinkMarker);
    effects.consume(code);
    effects.exit(types2.autolinkMarker);
    effects.enter(types2.autolinkProtocol);
    return open;
  }
  function open(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return schemeOrEmailAtext;
    }
    if (code === codes.atSign) {
      return nok(code);
    }
    return emailAtext(code);
  }
  function schemeOrEmailAtext(code) {
    if (code === codes.plusSign || code === codes.dash || code === codes.dot || asciiAlphanumeric(code)) {
      size = 1;
      return schemeInsideOrEmailAtext(code);
    }
    return emailAtext(code);
  }
  function schemeInsideOrEmailAtext(code) {
    if (code === codes.colon) {
      effects.consume(code);
      size = 0;
      return urlInside;
    }
    if ((code === codes.plusSign || code === codes.dash || code === codes.dot || asciiAlphanumeric(code)) && size++ < constants.autolinkSchemeSizeMax) {
      effects.consume(code);
      return schemeInsideOrEmailAtext;
    }
    size = 0;
    return emailAtext(code);
  }
  function urlInside(code) {
    if (code === codes.greaterThan) {
      effects.exit(types2.autolinkProtocol);
      effects.enter(types2.autolinkMarker);
      effects.consume(code);
      effects.exit(types2.autolinkMarker);
      effects.exit(types2.autolink);
      return ok2;
    }
    if (code === codes.eof || code === codes.space || code === codes.lessThan || asciiControl(code)) {
      return nok(code);
    }
    effects.consume(code);
    return urlInside;
  }
  function emailAtext(code) {
    if (code === codes.atSign) {
      effects.consume(code);
      return emailAtSignOrDot;
    }
    if (asciiAtext(code)) {
      effects.consume(code);
      return emailAtext;
    }
    return nok(code);
  }
  function emailAtSignOrDot(code) {
    return asciiAlphanumeric(code) ? emailLabel(code) : nok(code);
  }
  function emailLabel(code) {
    if (code === codes.dot) {
      effects.consume(code);
      size = 0;
      return emailAtSignOrDot;
    }
    if (code === codes.greaterThan) {
      effects.exit(types2.autolinkProtocol).type = types2.autolinkEmail;
      effects.enter(types2.autolinkMarker);
      effects.consume(code);
      effects.exit(types2.autolinkMarker);
      effects.exit(types2.autolink);
      return ok2;
    }
    return emailValue(code);
  }
  function emailValue(code) {
    if ((code === codes.dash || asciiAlphanumeric(code)) && size++ < constants.autolinkDomainSizeMax) {
      const next = code === codes.dash ? emailValue : emailLabel;
      effects.consume(code);
      return next;
    }
    return nok(code);
  }
}
var autolink;
var init_autolink = __esm(() => {
  init_development();
  init_dev4();
  init_default();
  autolink = { name: "autolink", tokenize: tokenizeAutolink };
});

// node_modules/micromark-core-commonmark/dev/lib/blank-line.js
function tokenizeBlankLine(effects, ok2, nok) {
  return start;
  function start(code) {
    return markdownSpace(code) ? factorySpace(effects, after, types2.linePrefix)(code) : after(code);
  }
  function after(code) {
    return code === codes.eof || markdownLineEnding(code) ? ok2(code) : nok(code);
  }
}
var blankLine;
var init_blank_line = __esm(() => {
  init_dev6();
  init_dev4();
  init_default();
  blankLine = { partial: true, tokenize: tokenizeBlankLine };
});

// node_modules/micromark-core-commonmark/dev/lib/block-quote.js
function tokenizeBlockQuoteStart(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code) {
    if (code === codes.greaterThan) {
      const state = self2.containerState;
      ok(state, "expected `containerState` to be defined in container");
      if (!state.open) {
        effects.enter(types2.blockQuote, { _container: true });
        state.open = true;
      }
      effects.enter(types2.blockQuotePrefix);
      effects.enter(types2.blockQuoteMarker);
      effects.consume(code);
      effects.exit(types2.blockQuoteMarker);
      return after;
    }
    return nok(code);
  }
  function after(code) {
    if (markdownSpace(code)) {
      effects.enter(types2.blockQuotePrefixWhitespace);
      effects.consume(code);
      effects.exit(types2.blockQuotePrefixWhitespace);
      effects.exit(types2.blockQuotePrefix);
      return ok2;
    }
    effects.exit(types2.blockQuotePrefix);
    return ok2(code);
  }
}
function tokenizeBlockQuoteContinuation(effects, ok2, nok) {
  const self2 = this;
  return contStart;
  function contStart(code) {
    if (markdownSpace(code)) {
      ok(self2.parser.constructs.disable.null, "expected `disable.null` to be populated");
      return factorySpace(effects, contBefore, types2.linePrefix, self2.parser.constructs.disable.null.includes("codeIndented") ? undefined : constants.tabSize)(code);
    }
    return contBefore(code);
  }
  function contBefore(code) {
    return effects.attempt(blockQuote, ok2, nok)(code);
  }
}
function exit(effects) {
  effects.exit(types2.blockQuote);
}
var blockQuote;
var init_block_quote = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  blockQuote = {
    continuation: { tokenize: tokenizeBlockQuoteContinuation },
    exit,
    name: "blockQuote",
    tokenize: tokenizeBlockQuoteStart
  };
});

// node_modules/micromark-core-commonmark/dev/lib/character-escape.js
function tokenizeCharacterEscape(effects, ok2, nok) {
  return start;
  function start(code) {
    ok(code === codes.backslash, "expected `\\`");
    effects.enter(types2.characterEscape);
    effects.enter(types2.escapeMarker);
    effects.consume(code);
    effects.exit(types2.escapeMarker);
    return inside;
  }
  function inside(code) {
    if (asciiPunctuation(code)) {
      effects.enter(types2.characterEscapeValue);
      effects.consume(code);
      effects.exit(types2.characterEscapeValue);
      effects.exit(types2.characterEscape);
      return ok2;
    }
    return nok(code);
  }
}
var characterEscape;
var init_character_escape = __esm(() => {
  init_development();
  init_dev4();
  init_default();
  characterEscape = {
    name: "characterEscape",
    tokenize: tokenizeCharacterEscape
  };
});

// node_modules/micromark-core-commonmark/dev/lib/character-reference.js
function tokenizeCharacterReference(effects, ok2, nok) {
  const self2 = this;
  let size = 0;
  let max;
  let test;
  return start;
  function start(code) {
    ok(code === codes.ampersand, "expected `&`");
    effects.enter(types2.characterReference);
    effects.enter(types2.characterReferenceMarker);
    effects.consume(code);
    effects.exit(types2.characterReferenceMarker);
    return open;
  }
  function open(code) {
    if (code === codes.numberSign) {
      effects.enter(types2.characterReferenceMarkerNumeric);
      effects.consume(code);
      effects.exit(types2.characterReferenceMarkerNumeric);
      return numeric;
    }
    effects.enter(types2.characterReferenceValue);
    max = constants.characterReferenceNamedSizeMax;
    test = asciiAlphanumeric;
    return value(code);
  }
  function numeric(code) {
    if (code === codes.uppercaseX || code === codes.lowercaseX) {
      effects.enter(types2.characterReferenceMarkerHexadecimal);
      effects.consume(code);
      effects.exit(types2.characterReferenceMarkerHexadecimal);
      effects.enter(types2.characterReferenceValue);
      max = constants.characterReferenceHexadecimalSizeMax;
      test = asciiHexDigit;
      return value;
    }
    effects.enter(types2.characterReferenceValue);
    max = constants.characterReferenceDecimalSizeMax;
    test = asciiDigit;
    return value(code);
  }
  function value(code) {
    if (code === codes.semicolon && size) {
      const token = effects.exit(types2.characterReferenceValue);
      if (test === asciiAlphanumeric && !decodeNamedCharacterReference(self2.sliceSerialize(token))) {
        return nok(code);
      }
      effects.enter(types2.characterReferenceMarker);
      effects.consume(code);
      effects.exit(types2.characterReferenceMarker);
      effects.exit(types2.characterReference);
      return ok2;
    }
    if (test(code) && size++ < max) {
      effects.consume(code);
      return value;
    }
    return nok(code);
  }
}
var characterReference;
var init_character_reference = __esm(() => {
  init_development();
  init_index_dom();
  init_dev4();
  init_default();
  characterReference = {
    name: "characterReference",
    tokenize: tokenizeCharacterReference
  };
});

// node_modules/micromark-core-commonmark/dev/lib/code-fenced.js
function tokenizeCodeFenced(effects, ok2, nok) {
  const self2 = this;
  const closeStart = { partial: true, tokenize: tokenizeCloseStart };
  let initialPrefix = 0;
  let sizeOpen = 0;
  let marker;
  return start;
  function start(code) {
    return beforeSequenceOpen(code);
  }
  function beforeSequenceOpen(code) {
    ok(code === codes.graveAccent || code === codes.tilde, "expected `` ` `` or `~`");
    const tail = self2.events[self2.events.length - 1];
    initialPrefix = tail && tail[1].type === types2.linePrefix ? tail[2].sliceSerialize(tail[1], true).length : 0;
    marker = code;
    effects.enter(types2.codeFenced);
    effects.enter(types2.codeFencedFence);
    effects.enter(types2.codeFencedFenceSequence);
    return sequenceOpen(code);
  }
  function sequenceOpen(code) {
    if (code === marker) {
      sizeOpen++;
      effects.consume(code);
      return sequenceOpen;
    }
    if (sizeOpen < constants.codeFencedSequenceSizeMin) {
      return nok(code);
    }
    effects.exit(types2.codeFencedFenceSequence);
    return markdownSpace(code) ? factorySpace(effects, infoBefore, types2.whitespace)(code) : infoBefore(code);
  }
  function infoBefore(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.codeFencedFence);
      return self2.interrupt ? ok2(code) : effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
    }
    effects.enter(types2.codeFencedFenceInfo);
    effects.enter(types2.chunkString, { contentType: constants.contentTypeString });
    return info(code);
  }
  function info(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.chunkString);
      effects.exit(types2.codeFencedFenceInfo);
      return infoBefore(code);
    }
    if (markdownSpace(code)) {
      effects.exit(types2.chunkString);
      effects.exit(types2.codeFencedFenceInfo);
      return factorySpace(effects, metaBefore, types2.whitespace)(code);
    }
    if (code === codes.graveAccent && code === marker) {
      return nok(code);
    }
    effects.consume(code);
    return info;
  }
  function metaBefore(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return infoBefore(code);
    }
    effects.enter(types2.codeFencedFenceMeta);
    effects.enter(types2.chunkString, { contentType: constants.contentTypeString });
    return meta(code);
  }
  function meta(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.chunkString);
      effects.exit(types2.codeFencedFenceMeta);
      return infoBefore(code);
    }
    if (code === codes.graveAccent && code === marker) {
      return nok(code);
    }
    effects.consume(code);
    return meta;
  }
  function atNonLazyBreak(code) {
    ok(markdownLineEnding(code), "expected eol");
    return effects.attempt(closeStart, after, contentBefore)(code);
  }
  function contentBefore(code) {
    ok(markdownLineEnding(code), "expected eol");
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return contentStart;
  }
  function contentStart(code) {
    return initialPrefix > 0 && markdownSpace(code) ? factorySpace(effects, beforeContentChunk, types2.linePrefix, initialPrefix + 1)(code) : beforeContentChunk(code);
  }
  function beforeContentChunk(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return effects.check(nonLazyContinuation, atNonLazyBreak, after)(code);
    }
    effects.enter(types2.codeFlowValue);
    return contentChunk(code);
  }
  function contentChunk(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.codeFlowValue);
      return beforeContentChunk(code);
    }
    effects.consume(code);
    return contentChunk;
  }
  function after(code) {
    effects.exit(types2.codeFenced);
    return ok2(code);
  }
  function tokenizeCloseStart(effects2, ok3, nok2) {
    let size = 0;
    return startBefore;
    function startBefore(code) {
      ok(markdownLineEnding(code), "expected eol");
      effects2.enter(types2.lineEnding);
      effects2.consume(code);
      effects2.exit(types2.lineEnding);
      return start2;
    }
    function start2(code) {
      ok(self2.parser.constructs.disable.null, "expected `disable.null` to be populated");
      effects2.enter(types2.codeFencedFence);
      return markdownSpace(code) ? factorySpace(effects2, beforeSequenceClose, types2.linePrefix, self2.parser.constructs.disable.null.includes("codeIndented") ? undefined : constants.tabSize)(code) : beforeSequenceClose(code);
    }
    function beforeSequenceClose(code) {
      if (code === marker) {
        effects2.enter(types2.codeFencedFenceSequence);
        return sequenceClose(code);
      }
      return nok2(code);
    }
    function sequenceClose(code) {
      if (code === marker) {
        size++;
        effects2.consume(code);
        return sequenceClose;
      }
      if (size >= sizeOpen) {
        effects2.exit(types2.codeFencedFenceSequence);
        return markdownSpace(code) ? factorySpace(effects2, sequenceCloseAfter, types2.whitespace)(code) : sequenceCloseAfter(code);
      }
      return nok2(code);
    }
    function sequenceCloseAfter(code) {
      if (code === codes.eof || markdownLineEnding(code)) {
        effects2.exit(types2.codeFencedFence);
        return ok3(code);
      }
      return nok2(code);
    }
  }
}
function tokenizeNonLazyContinuation(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code) {
    if (code === codes.eof) {
      return nok(code);
    }
    ok(markdownLineEnding(code), "expected eol");
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return lineStart;
  }
  function lineStart(code) {
    return self2.parser.lazy[self2.now().line] ? nok(code) : ok2(code);
  }
}
var nonLazyContinuation, codeFenced;
var init_code_fenced = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  nonLazyContinuation = {
    partial: true,
    tokenize: tokenizeNonLazyContinuation
  };
  codeFenced = {
    concrete: true,
    name: "codeFenced",
    tokenize: tokenizeCodeFenced
  };
});

// node_modules/micromark-core-commonmark/dev/lib/code-indented.js
function tokenizeCodeIndented(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code) {
    ok(markdownSpace(code));
    effects.enter(types2.codeIndented);
    return factorySpace(effects, afterPrefix, types2.linePrefix, constants.tabSize + 1)(code);
  }
  function afterPrefix(code) {
    const tail = self2.events[self2.events.length - 1];
    return tail && tail[1].type === types2.linePrefix && tail[2].sliceSerialize(tail[1], true).length >= constants.tabSize ? atBreak(code) : nok(code);
  }
  function atBreak(code) {
    if (code === codes.eof) {
      return after(code);
    }
    if (markdownLineEnding(code)) {
      return effects.attempt(furtherStart, atBreak, after)(code);
    }
    effects.enter(types2.codeFlowValue);
    return inside(code);
  }
  function inside(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.codeFlowValue);
      return atBreak(code);
    }
    effects.consume(code);
    return inside;
  }
  function after(code) {
    effects.exit(types2.codeIndented);
    return ok2(code);
  }
}
function tokenizeFurtherStart(effects, ok2, nok) {
  const self2 = this;
  return furtherStart2;
  function furtherStart2(code) {
    if (self2.parser.lazy[self2.now().line]) {
      return nok(code);
    }
    if (markdownLineEnding(code)) {
      effects.enter(types2.lineEnding);
      effects.consume(code);
      effects.exit(types2.lineEnding);
      return furtherStart2;
    }
    return factorySpace(effects, afterPrefix, types2.linePrefix, constants.tabSize + 1)(code);
  }
  function afterPrefix(code) {
    const tail = self2.events[self2.events.length - 1];
    return tail && tail[1].type === types2.linePrefix && tail[2].sliceSerialize(tail[1], true).length >= constants.tabSize ? ok2(code) : markdownLineEnding(code) ? furtherStart2(code) : nok(code);
  }
}
var codeIndented, furtherStart;
var init_code_indented = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  codeIndented = {
    name: "codeIndented",
    tokenize: tokenizeCodeIndented
  };
  furtherStart = { partial: true, tokenize: tokenizeFurtherStart };
});

// node_modules/micromark-core-commonmark/dev/lib/code-text.js
function resolveCodeText(events) {
  let tailExitIndex = events.length - 4;
  let headEnterIndex = 3;
  let index2;
  let enter;
  if ((events[headEnterIndex][1].type === types2.lineEnding || events[headEnterIndex][1].type === "space") && (events[tailExitIndex][1].type === types2.lineEnding || events[tailExitIndex][1].type === "space")) {
    index2 = headEnterIndex;
    while (++index2 < tailExitIndex) {
      if (events[index2][1].type === types2.codeTextData) {
        events[headEnterIndex][1].type = types2.codeTextPadding;
        events[tailExitIndex][1].type = types2.codeTextPadding;
        headEnterIndex += 2;
        tailExitIndex -= 2;
        break;
      }
    }
  }
  index2 = headEnterIndex - 1;
  tailExitIndex++;
  while (++index2 <= tailExitIndex) {
    if (enter === undefined) {
      if (index2 !== tailExitIndex && events[index2][1].type !== types2.lineEnding) {
        enter = index2;
      }
    } else if (index2 === tailExitIndex || events[index2][1].type === types2.lineEnding) {
      events[enter][1].type = types2.codeTextData;
      if (index2 !== enter + 2) {
        events[enter][1].end = events[index2 - 1][1].end;
        events.splice(enter + 2, index2 - enter - 2);
        tailExitIndex -= index2 - enter - 2;
        index2 = enter + 2;
      }
      enter = undefined;
    }
  }
  return events;
}
function previous(code) {
  return code !== codes.graveAccent || this.events[this.events.length - 1][1].type === types2.characterEscape;
}
function tokenizeCodeText(effects, ok2, nok) {
  const self2 = this;
  let sizeOpen = 0;
  let size;
  let token;
  return start;
  function start(code) {
    ok(code === codes.graveAccent, "expected `` ` ``");
    ok(previous.call(self2, self2.previous), "expected correct previous");
    effects.enter(types2.codeText);
    effects.enter(types2.codeTextSequence);
    return sequenceOpen(code);
  }
  function sequenceOpen(code) {
    if (code === codes.graveAccent) {
      effects.consume(code);
      sizeOpen++;
      return sequenceOpen;
    }
    effects.exit(types2.codeTextSequence);
    return between(code);
  }
  function between(code) {
    if (code === codes.eof) {
      return nok(code);
    }
    if (code === codes.space) {
      effects.enter("space");
      effects.consume(code);
      effects.exit("space");
      return between;
    }
    if (code === codes.graveAccent) {
      token = effects.enter(types2.codeTextSequence);
      size = 0;
      return sequenceClose(code);
    }
    if (markdownLineEnding(code)) {
      effects.enter(types2.lineEnding);
      effects.consume(code);
      effects.exit(types2.lineEnding);
      return between;
    }
    effects.enter(types2.codeTextData);
    return data(code);
  }
  function data(code) {
    if (code === codes.eof || code === codes.space || code === codes.graveAccent || markdownLineEnding(code)) {
      effects.exit(types2.codeTextData);
      return between(code);
    }
    effects.consume(code);
    return data;
  }
  function sequenceClose(code) {
    if (code === codes.graveAccent) {
      effects.consume(code);
      size++;
      return sequenceClose;
    }
    if (size === sizeOpen) {
      effects.exit(types2.codeTextSequence);
      effects.exit(types2.codeText);
      return ok2(code);
    }
    token.type = types2.codeTextData;
    return data(code);
  }
}
var codeText;
var init_code_text = __esm(() => {
  init_development();
  init_dev4();
  init_default();
  codeText = {
    name: "codeText",
    previous,
    resolve: resolveCodeText,
    tokenize: tokenizeCodeText
  };
});

// node_modules/micromark-util-subtokenize/dev/lib/splice-buffer.js
class SpliceBuffer {
  constructor(initial) {
    this.left = initial ? [...initial] : [];
    this.right = [];
  }
  get(index2) {
    if (index2 < 0 || index2 >= this.left.length + this.right.length) {
      throw new RangeError("Cannot access index `" + index2 + "` in a splice buffer of size `" + (this.left.length + this.right.length) + "`");
    }
    if (index2 < this.left.length)
      return this.left[index2];
    return this.right[this.right.length - index2 + this.left.length - 1];
  }
  get length() {
    return this.left.length + this.right.length;
  }
  shift() {
    this.setCursor(0);
    return this.right.pop();
  }
  slice(start, end) {
    const stop = end === null || end === undefined ? Number.POSITIVE_INFINITY : end;
    if (stop < this.left.length) {
      return this.left.slice(start, stop);
    }
    if (start > this.left.length) {
      return this.right.slice(this.right.length - stop + this.left.length, this.right.length - start + this.left.length).reverse();
    }
    return this.left.slice(start).concat(this.right.slice(this.right.length - stop + this.left.length).reverse());
  }
  splice(start, deleteCount, items) {
    const count = deleteCount || 0;
    this.setCursor(Math.trunc(start));
    const removed = this.right.splice(this.right.length - count, Number.POSITIVE_INFINITY);
    if (items)
      chunkedPush(this.left, items);
    return removed.reverse();
  }
  pop() {
    this.setCursor(Number.POSITIVE_INFINITY);
    return this.left.pop();
  }
  push(item) {
    this.setCursor(Number.POSITIVE_INFINITY);
    this.left.push(item);
  }
  pushMany(items) {
    this.setCursor(Number.POSITIVE_INFINITY);
    chunkedPush(this.left, items);
  }
  unshift(item) {
    this.setCursor(0);
    this.right.push(item);
  }
  unshiftMany(items) {
    this.setCursor(0);
    chunkedPush(this.right, items.reverse());
  }
  setCursor(n) {
    if (n === this.left.length || n > this.left.length && this.right.length === 0 || n < 0 && this.left.length === 0)
      return;
    if (n < this.left.length) {
      const removed = this.left.splice(n, Number.POSITIVE_INFINITY);
      chunkedPush(this.right, removed.reverse());
    } else {
      const removed = this.right.splice(this.left.length + this.right.length - n, Number.POSITIVE_INFINITY);
      chunkedPush(this.left, removed.reverse());
    }
  }
}
function chunkedPush(list, right) {
  let chunkStart = 0;
  if (right.length < constants.v8MaxSafeChunkSize) {
    list.push(...right);
  } else {
    while (chunkStart < right.length) {
      list.push(...right.slice(chunkStart, chunkStart + constants.v8MaxSafeChunkSize));
      chunkStart += constants.v8MaxSafeChunkSize;
    }
  }
}
var init_splice_buffer = __esm(() => {
  init_default();
});

// node_modules/micromark-util-subtokenize/dev/index.js
function subtokenize(eventsArray) {
  const jumps = {};
  let index2 = -1;
  let event;
  let lineIndex;
  let otherIndex;
  let otherEvent;
  let parameters;
  let subevents;
  let more;
  const events = new SpliceBuffer(eventsArray);
  while (++index2 < events.length) {
    while (index2 in jumps) {
      index2 = jumps[index2];
    }
    event = events.get(index2);
    if (index2 && event[1].type === types2.chunkFlow && events.get(index2 - 1)[1].type === types2.listItemPrefix) {
      ok(event[1]._tokenizer, "expected `_tokenizer` on subtokens");
      subevents = event[1]._tokenizer.events;
      otherIndex = 0;
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === types2.lineEndingBlank) {
        otherIndex += 2;
      }
      if (otherIndex < subevents.length && subevents[otherIndex][1].type === types2.content) {
        while (++otherIndex < subevents.length) {
          if (subevents[otherIndex][1].type === types2.content) {
            break;
          }
          if (subevents[otherIndex][1].type === types2.chunkText) {
            subevents[otherIndex][1]._isInFirstContentOfListItem = true;
            otherIndex++;
          }
        }
      }
    }
    if (event[0] === "enter") {
      if (event[1].contentType) {
        Object.assign(jumps, subcontent(events, index2));
        index2 = jumps[index2];
        more = true;
      }
    } else if (event[1]._container) {
      otherIndex = index2;
      lineIndex = undefined;
      while (otherIndex--) {
        otherEvent = events.get(otherIndex);
        if (otherEvent[1].type === types2.lineEnding || otherEvent[1].type === types2.lineEndingBlank) {
          if (otherEvent[0] === "enter") {
            if (lineIndex) {
              events.get(lineIndex)[1].type = types2.lineEndingBlank;
            }
            otherEvent[1].type = types2.lineEnding;
            lineIndex = otherIndex;
          }
        } else if (otherEvent[1].type === types2.linePrefix || otherEvent[1].type === types2.listItemIndent) {} else {
          break;
        }
      }
      if (lineIndex) {
        event[1].end = { ...events.get(lineIndex)[1].start };
        parameters = events.slice(lineIndex, index2);
        parameters.unshift(event);
        events.splice(lineIndex, index2 - lineIndex + 1, parameters);
      }
    }
  }
  splice(eventsArray, 0, Number.POSITIVE_INFINITY, events.slice(0));
  return !more;
}
function subcontent(events, eventIndex) {
  const token = events.get(eventIndex)[1];
  const context = events.get(eventIndex)[2];
  let startPosition = eventIndex - 1;
  const startPositions = [];
  ok(token.contentType, "expected `contentType` on subtokens");
  let tokenizer = token._tokenizer;
  if (!tokenizer) {
    tokenizer = context.parser[token.contentType](token.start);
    if (token._contentTypeTextTrailing) {
      tokenizer._contentTypeTextTrailing = true;
    }
  }
  const childEvents = tokenizer.events;
  const jumps = [];
  const gaps = {};
  let stream;
  let previous2;
  let index2 = -1;
  let current = token;
  let adjust = 0;
  let start = 0;
  const breaks = [start];
  while (current) {
    while (events.get(++startPosition)[1] !== current) {}
    ok(!previous2 || current.previous === previous2, "expected previous to match");
    ok(!previous2 || previous2.next === current, "expected next to match");
    startPositions.push(startPosition);
    if (!current._tokenizer) {
      stream = context.sliceStream(current);
      if (!current.next) {
        stream.push(codes.eof);
      }
      if (previous2) {
        tokenizer.defineSkip(current.start);
      }
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = true;
      }
      tokenizer.write(stream);
      if (current._isInFirstContentOfListItem) {
        tokenizer._gfmTasklistFirstContentOfListItem = undefined;
      }
    }
    previous2 = current;
    current = current.next;
  }
  current = token;
  while (++index2 < childEvents.length) {
    if (childEvents[index2][0] === "exit" && childEvents[index2 - 1][0] === "enter" && childEvents[index2][1].type === childEvents[index2 - 1][1].type && childEvents[index2][1].start.line !== childEvents[index2][1].end.line) {
      ok(current, "expected a current token");
      start = index2 + 1;
      breaks.push(start);
      current._tokenizer = undefined;
      current.previous = undefined;
      current = current.next;
    }
  }
  tokenizer.events = [];
  if (current) {
    current._tokenizer = undefined;
    current.previous = undefined;
    ok(!current.next, "expected no next token");
  } else {
    breaks.pop();
  }
  index2 = breaks.length;
  while (index2--) {
    const slice = childEvents.slice(breaks[index2], breaks[index2 + 1]);
    const start2 = startPositions.pop();
    ok(start2 !== undefined, "expected a start position when splicing");
    jumps.push([start2, start2 + slice.length - 1]);
    events.splice(start2, 2, slice);
  }
  jumps.reverse();
  index2 = -1;
  while (++index2 < jumps.length) {
    gaps[adjust + jumps[index2][0]] = adjust + jumps[index2][1];
    adjust += jumps[index2][1] - jumps[index2][0] - 1;
  }
  return gaps;
}
var init_dev8 = __esm(() => {
  init_development();
  init_dev();
  init_default();
  init_splice_buffer();
});

// node_modules/micromark-core-commonmark/dev/lib/content.js
function resolveContent(events) {
  subtokenize(events);
  return events;
}
function tokenizeContent(effects, ok2) {
  let previous2;
  return chunkStart;
  function chunkStart(code) {
    ok(code !== codes.eof && !markdownLineEnding(code), "expected no eof or eol");
    effects.enter(types2.content);
    previous2 = effects.enter(types2.chunkContent, {
      contentType: constants.contentTypeContent
    });
    return chunkInside(code);
  }
  function chunkInside(code) {
    if (code === codes.eof) {
      return contentEnd(code);
    }
    if (markdownLineEnding(code)) {
      return effects.check(continuationConstruct, contentContinue, contentEnd)(code);
    }
    effects.consume(code);
    return chunkInside;
  }
  function contentEnd(code) {
    effects.exit(types2.chunkContent);
    effects.exit(types2.content);
    return ok2(code);
  }
  function contentContinue(code) {
    ok(markdownLineEnding(code), "expected eol");
    effects.consume(code);
    effects.exit(types2.chunkContent);
    ok(previous2, "expected previous token");
    previous2.next = effects.enter(types2.chunkContent, {
      contentType: constants.contentTypeContent,
      previous: previous2
    });
    previous2 = previous2.next;
    return chunkInside;
  }
}
function tokenizeContinuation(effects, ok2, nok) {
  const self2 = this;
  return startLookahead;
  function startLookahead(code) {
    ok(markdownLineEnding(code), "expected a line ending");
    effects.exit(types2.chunkContent);
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return factorySpace(effects, prefixed, types2.linePrefix);
  }
  function prefixed(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }
    ok(self2.parser.constructs.disable.null, "expected `disable.null` to be populated");
    const tail = self2.events[self2.events.length - 1];
    if (!self2.parser.constructs.disable.null.includes("codeIndented") && tail && tail[1].type === types2.linePrefix && tail[2].sliceSerialize(tail[1], true).length >= constants.tabSize) {
      return ok2(code);
    }
    return effects.interrupt(self2.parser.constructs.flow, nok, ok2)(code);
  }
}
var content2, continuationConstruct;
var init_content2 = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_dev8();
  init_default();
  content2 = { resolve: resolveContent, tokenize: tokenizeContent };
  continuationConstruct = { partial: true, tokenize: tokenizeContinuation };
});

// node_modules/micromark-factory-destination/dev/index.js
function factoryDestination(effects, ok2, nok, type2, literalType, literalMarkerType, rawType, stringType, max) {
  const limit = max || Number.POSITIVE_INFINITY;
  let balance = 0;
  return start;
  function start(code) {
    if (code === codes.lessThan) {
      effects.enter(type2);
      effects.enter(literalType);
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      return enclosedBefore;
    }
    if (code === codes.eof || code === codes.space || code === codes.rightParenthesis || asciiControl(code)) {
      return nok(code);
    }
    effects.enter(type2);
    effects.enter(rawType);
    effects.enter(stringType);
    effects.enter(types2.chunkString, { contentType: constants.contentTypeString });
    return raw(code);
  }
  function enclosedBefore(code) {
    if (code === codes.greaterThan) {
      effects.enter(literalMarkerType);
      effects.consume(code);
      effects.exit(literalMarkerType);
      effects.exit(literalType);
      effects.exit(type2);
      return ok2;
    }
    effects.enter(stringType);
    effects.enter(types2.chunkString, { contentType: constants.contentTypeString });
    return enclosed(code);
  }
  function enclosed(code) {
    if (code === codes.greaterThan) {
      effects.exit(types2.chunkString);
      effects.exit(stringType);
      return enclosedBefore(code);
    }
    if (code === codes.eof || code === codes.lessThan || markdownLineEnding(code)) {
      return nok(code);
    }
    effects.consume(code);
    return code === codes.backslash ? enclosedEscape : enclosed;
  }
  function enclosedEscape(code) {
    if (code === codes.lessThan || code === codes.greaterThan || code === codes.backslash) {
      effects.consume(code);
      return enclosed;
    }
    return enclosed(code);
  }
  function raw(code) {
    if (!balance && (code === codes.eof || code === codes.rightParenthesis || markdownLineEndingOrSpace(code))) {
      effects.exit(types2.chunkString);
      effects.exit(stringType);
      effects.exit(rawType);
      effects.exit(type2);
      return ok2(code);
    }
    if (balance < limit && code === codes.leftParenthesis) {
      effects.consume(code);
      balance++;
      return raw;
    }
    if (code === codes.rightParenthesis) {
      effects.consume(code);
      balance--;
      return raw;
    }
    if (code === codes.eof || code === codes.space || code === codes.leftParenthesis || asciiControl(code)) {
      return nok(code);
    }
    effects.consume(code);
    return code === codes.backslash ? rawEscape : raw;
  }
  function rawEscape(code) {
    if (code === codes.leftParenthesis || code === codes.rightParenthesis || code === codes.backslash) {
      effects.consume(code);
      return raw;
    }
    return raw(code);
  }
}
var init_dev9 = __esm(() => {
  init_dev4();
  init_default();
});

// node_modules/micromark-factory-label/dev/index.js
function factoryLabel(effects, ok2, nok, type2, markerType, stringType) {
  const self2 = this;
  let size = 0;
  let seen;
  return start;
  function start(code) {
    ok(code === codes.leftSquareBracket, "expected `[`");
    effects.enter(type2);
    effects.enter(markerType);
    effects.consume(code);
    effects.exit(markerType);
    effects.enter(stringType);
    return atBreak;
  }
  function atBreak(code) {
    if (size > constants.linkReferenceSizeMax || code === codes.eof || code === codes.leftSquareBracket || code === codes.rightSquareBracket && !seen || code === codes.caret && !size && "_hiddenFootnoteSupport" in self2.parser.constructs) {
      return nok(code);
    }
    if (code === codes.rightSquareBracket) {
      effects.exit(stringType);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type2);
      return ok2;
    }
    if (markdownLineEnding(code)) {
      effects.enter(types2.lineEnding);
      effects.consume(code);
      effects.exit(types2.lineEnding);
      return atBreak;
    }
    effects.enter(types2.chunkString, { contentType: constants.contentTypeString });
    return labelInside(code);
  }
  function labelInside(code) {
    if (code === codes.eof || code === codes.leftSquareBracket || code === codes.rightSquareBracket || markdownLineEnding(code) || size++ > constants.linkReferenceSizeMax) {
      effects.exit(types2.chunkString);
      return atBreak(code);
    }
    effects.consume(code);
    if (!seen)
      seen = !markdownSpace(code);
    return code === codes.backslash ? labelEscape : labelInside;
  }
  function labelEscape(code) {
    if (code === codes.leftSquareBracket || code === codes.backslash || code === codes.rightSquareBracket) {
      effects.consume(code);
      size++;
      return labelInside;
    }
    return labelInside(code);
  }
}
var init_dev10 = __esm(() => {
  init_development();
  init_dev4();
  init_default();
});

// node_modules/micromark-factory-title/dev/index.js
function factoryTitle(effects, ok2, nok, type2, markerType, stringType) {
  let marker;
  return start;
  function start(code) {
    if (code === codes.quotationMark || code === codes.apostrophe || code === codes.leftParenthesis) {
      effects.enter(type2);
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      marker = code === codes.leftParenthesis ? codes.rightParenthesis : code;
      return begin;
    }
    return nok(code);
  }
  function begin(code) {
    if (code === marker) {
      effects.enter(markerType);
      effects.consume(code);
      effects.exit(markerType);
      effects.exit(type2);
      return ok2;
    }
    effects.enter(stringType);
    return atBreak(code);
  }
  function atBreak(code) {
    if (code === marker) {
      effects.exit(stringType);
      return begin(marker);
    }
    if (code === codes.eof) {
      return nok(code);
    }
    if (markdownLineEnding(code)) {
      effects.enter(types2.lineEnding);
      effects.consume(code);
      effects.exit(types2.lineEnding);
      return factorySpace(effects, atBreak, types2.linePrefix);
    }
    effects.enter(types2.chunkString, { contentType: constants.contentTypeString });
    return inside(code);
  }
  function inside(code) {
    if (code === marker || code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.chunkString);
      return atBreak(code);
    }
    effects.consume(code);
    return code === codes.backslash ? escape : inside;
  }
  function escape(code) {
    if (code === marker || code === codes.backslash) {
      effects.consume(code);
      return inside;
    }
    return inside(code);
  }
}
var init_dev11 = __esm(() => {
  init_dev6();
  init_dev4();
  init_default();
});

// node_modules/micromark-factory-whitespace/dev/index.js
function factoryWhitespace(effects, ok2) {
  let seen;
  return start;
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter(types2.lineEnding);
      effects.consume(code);
      effects.exit(types2.lineEnding);
      seen = true;
      return start;
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, start, seen ? types2.linePrefix : types2.lineSuffix)(code);
    }
    return ok2(code);
  }
}
var init_dev12 = __esm(() => {
  init_dev6();
  init_dev4();
  init_default();
});

// node_modules/micromark-core-commonmark/dev/lib/definition.js
function tokenizeDefinition(effects, ok2, nok) {
  const self2 = this;
  let identifier;
  return start;
  function start(code) {
    effects.enter(types2.definition);
    return before(code);
  }
  function before(code) {
    ok(code === codes.leftSquareBracket, "expected `[`");
    return factoryLabel.call(self2, effects, labelAfter, nok, types2.definitionLabel, types2.definitionLabelMarker, types2.definitionLabelString)(code);
  }
  function labelAfter(code) {
    identifier = normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1));
    if (code === codes.colon) {
      effects.enter(types2.definitionMarker);
      effects.consume(code);
      effects.exit(types2.definitionMarker);
      return markerAfter;
    }
    return nok(code);
  }
  function markerAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, destinationBefore)(code) : destinationBefore(code);
  }
  function destinationBefore(code) {
    return factoryDestination(effects, destinationAfter, nok, types2.definitionDestination, types2.definitionDestinationLiteral, types2.definitionDestinationLiteralMarker, types2.definitionDestinationRaw, types2.definitionDestinationString)(code);
  }
  function destinationAfter(code) {
    return effects.attempt(titleBefore, after, after)(code);
  }
  function after(code) {
    return markdownSpace(code) ? factorySpace(effects, afterWhitespace, types2.whitespace)(code) : afterWhitespace(code);
  }
  function afterWhitespace(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.definition);
      self2.parser.defined.push(identifier);
      return ok2(code);
    }
    return nok(code);
  }
}
function tokenizeTitleBefore(effects, ok2, nok) {
  return titleBefore2;
  function titleBefore2(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, beforeMarker)(code) : nok(code);
  }
  function beforeMarker(code) {
    return factoryTitle(effects, titleAfter, nok, types2.definitionTitle, types2.definitionTitleMarker, types2.definitionTitleString)(code);
  }
  function titleAfter(code) {
    return markdownSpace(code) ? factorySpace(effects, titleAfterOptionalWhitespace, types2.whitespace)(code) : titleAfterOptionalWhitespace(code);
  }
  function titleAfterOptionalWhitespace(code) {
    return code === codes.eof || markdownLineEnding(code) ? ok2(code) : nok(code);
  }
}
var definition, titleBefore;
var init_definition = __esm(() => {
  init_development();
  init_dev9();
  init_dev10();
  init_dev6();
  init_dev11();
  init_dev12();
  init_dev4();
  init_dev3();
  init_default();
  definition = { name: "definition", tokenize: tokenizeDefinition };
  titleBefore = { partial: true, tokenize: tokenizeTitleBefore };
});

// node_modules/micromark-core-commonmark/dev/lib/hard-break-escape.js
function tokenizeHardBreakEscape(effects, ok2, nok) {
  return start;
  function start(code) {
    ok(code === codes.backslash, "expected `\\`");
    effects.enter(types2.hardBreakEscape);
    effects.consume(code);
    return after;
  }
  function after(code) {
    if (markdownLineEnding(code)) {
      effects.exit(types2.hardBreakEscape);
      return ok2(code);
    }
    return nok(code);
  }
}
var hardBreakEscape;
var init_hard_break_escape = __esm(() => {
  init_development();
  init_dev4();
  init_default();
  hardBreakEscape = {
    name: "hardBreakEscape",
    tokenize: tokenizeHardBreakEscape
  };
});

// node_modules/micromark-core-commonmark/dev/lib/heading-atx.js
function resolveHeadingAtx(events, context) {
  let contentEnd = events.length - 2;
  let contentStart = 3;
  let content3;
  let text;
  if (events[contentStart][1].type === types2.whitespace) {
    contentStart += 2;
  }
  if (contentEnd - 2 > contentStart && events[contentEnd][1].type === types2.whitespace) {
    contentEnd -= 2;
  }
  if (events[contentEnd][1].type === types2.atxHeadingSequence && (contentStart === contentEnd - 1 || contentEnd - 4 > contentStart && events[contentEnd - 2][1].type === types2.whitespace)) {
    contentEnd -= contentStart + 1 === contentEnd ? 2 : 4;
  }
  if (contentEnd > contentStart) {
    content3 = {
      type: types2.atxHeadingText,
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end
    };
    text = {
      type: types2.chunkText,
      start: events[contentStart][1].start,
      end: events[contentEnd][1].end,
      contentType: constants.contentTypeText
    };
    splice(events, contentStart, contentEnd - contentStart + 1, [
      ["enter", content3, context],
      ["enter", text, context],
      ["exit", text, context],
      ["exit", content3, context]
    ]);
  }
  return events;
}
function tokenizeHeadingAtx(effects, ok2, nok) {
  let size = 0;
  return start;
  function start(code) {
    effects.enter(types2.atxHeading);
    return before(code);
  }
  function before(code) {
    ok(code === codes.numberSign, "expected `#`");
    effects.enter(types2.atxHeadingSequence);
    return sequenceOpen(code);
  }
  function sequenceOpen(code) {
    if (code === codes.numberSign && size++ < constants.atxHeadingOpeningFenceSizeMax) {
      effects.consume(code);
      return sequenceOpen;
    }
    if (code === codes.eof || markdownLineEndingOrSpace(code)) {
      effects.exit(types2.atxHeadingSequence);
      return atBreak(code);
    }
    return nok(code);
  }
  function atBreak(code) {
    if (code === codes.numberSign) {
      effects.enter(types2.atxHeadingSequence);
      return sequenceFurther(code);
    }
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.atxHeading);
      return ok2(code);
    }
    if (markdownSpace(code)) {
      return factorySpace(effects, atBreak, types2.whitespace)(code);
    }
    effects.enter(types2.atxHeadingText);
    return data(code);
  }
  function sequenceFurther(code) {
    if (code === codes.numberSign) {
      effects.consume(code);
      return sequenceFurther;
    }
    effects.exit(types2.atxHeadingSequence);
    return atBreak(code);
  }
  function data(code) {
    if (code === codes.eof || code === codes.numberSign || markdownLineEndingOrSpace(code)) {
      effects.exit(types2.atxHeadingText);
      return atBreak(code);
    }
    effects.consume(code);
    return data;
  }
}
var headingAtx;
var init_heading_atx = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_dev();
  init_default();
  headingAtx = {
    name: "headingAtx",
    resolve: resolveHeadingAtx,
    tokenize: tokenizeHeadingAtx
  };
});

// node_modules/micromark-util-html-tag-name/index.js
var htmlBlockNames, htmlRawNames;
var init_micromark_util_html_tag_name = __esm(() => {
  htmlBlockNames = [
    "address",
    "article",
    "aside",
    "base",
    "basefont",
    "blockquote",
    "body",
    "caption",
    "center",
    "col",
    "colgroup",
    "dd",
    "details",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "iframe",
    "legend",
    "li",
    "link",
    "main",
    "menu",
    "menuitem",
    "nav",
    "noframes",
    "ol",
    "optgroup",
    "option",
    "p",
    "param",
    "search",
    "section",
    "summary",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "track",
    "ul"
  ];
  htmlRawNames = ["pre", "script", "style", "textarea"];
});

// node_modules/micromark-core-commonmark/dev/lib/html-flow.js
function resolveToHtmlFlow(events) {
  let index2 = events.length;
  while (index2--) {
    if (events[index2][0] === "enter" && events[index2][1].type === types2.htmlFlow) {
      break;
    }
  }
  if (index2 > 1 && events[index2 - 2][1].type === types2.linePrefix) {
    events[index2][1].start = events[index2 - 2][1].start;
    events[index2 + 1][1].start = events[index2 - 2][1].start;
    events.splice(index2 - 2, 2);
  }
  return events;
}
function tokenizeHtmlFlow(effects, ok2, nok) {
  const self2 = this;
  let marker;
  let closingTag;
  let buffer;
  let index2;
  let markerB;
  return start;
  function start(code) {
    return before(code);
  }
  function before(code) {
    ok(code === codes.lessThan, "expected `<`");
    effects.enter(types2.htmlFlow);
    effects.enter(types2.htmlFlowData);
    effects.consume(code);
    return open;
  }
  function open(code) {
    if (code === codes.exclamationMark) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === codes.slash) {
      effects.consume(code);
      closingTag = true;
      return tagCloseStart;
    }
    if (code === codes.questionMark) {
      effects.consume(code);
      marker = constants.htmlInstruction;
      return self2.interrupt ? ok2 : continuationDeclarationInside;
    }
    if (asciiAlpha(code)) {
      ok(code !== null);
      effects.consume(code);
      buffer = String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  function declarationOpen(code) {
    if (code === codes.dash) {
      effects.consume(code);
      marker = constants.htmlComment;
      return commentOpenInside;
    }
    if (code === codes.leftSquareBracket) {
      effects.consume(code);
      marker = constants.htmlCdata;
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      marker = constants.htmlDeclaration;
      return self2.interrupt ? ok2 : continuationDeclarationInside;
    }
    return nok(code);
  }
  function commentOpenInside(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return self2.interrupt ? ok2 : continuationDeclarationInside;
    }
    return nok(code);
  }
  function cdataOpenInside(code) {
    const value = constants.cdataOpeningString;
    if (code === value.charCodeAt(index2++)) {
      effects.consume(code);
      if (index2 === value.length) {
        return self2.interrupt ? ok2 : continuation;
      }
      return cdataOpenInside;
    }
    return nok(code);
  }
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      ok(code !== null);
      effects.consume(code);
      buffer = String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  function tagName(code) {
    if (code === codes.eof || code === codes.slash || code === codes.greaterThan || markdownLineEndingOrSpace(code)) {
      const slash = code === codes.slash;
      const name = buffer.toLowerCase();
      if (!slash && !closingTag && htmlRawNames.includes(name)) {
        marker = constants.htmlRaw;
        return self2.interrupt ? ok2(code) : continuation(code);
      }
      if (htmlBlockNames.includes(buffer.toLowerCase())) {
        marker = constants.htmlBasic;
        if (slash) {
          effects.consume(code);
          return basicSelfClosing;
        }
        return self2.interrupt ? ok2(code) : continuation(code);
      }
      marker = constants.htmlComplete;
      return self2.interrupt && !self2.parser.lazy[self2.now().line] ? nok(code) : closingTag ? completeClosingTagAfter(code) : completeAttributeNameBefore(code);
    }
    if (code === codes.dash || asciiAlphanumeric(code)) {
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return tagName;
    }
    return nok(code);
  }
  function basicSelfClosing(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      return self2.interrupt ? ok2 : continuation;
    }
    return nok(code);
  }
  function completeClosingTagAfter(code) {
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeClosingTagAfter;
    }
    return completeEnd(code);
  }
  function completeAttributeNameBefore(code) {
    if (code === codes.slash) {
      effects.consume(code);
      return completeEnd;
    }
    if (code === codes.colon || code === codes.underscore || asciiAlpha(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameBefore;
    }
    return completeEnd(code);
  }
  function completeAttributeName(code) {
    if (code === codes.dash || code === codes.dot || code === codes.colon || code === codes.underscore || asciiAlphanumeric(code)) {
      effects.consume(code);
      return completeAttributeName;
    }
    return completeAttributeNameAfter(code);
  }
  function completeAttributeNameAfter(code) {
    if (code === codes.equalsTo) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeNameAfter;
    }
    return completeAttributeNameBefore(code);
  }
  function completeAttributeValueBefore(code) {
    if (code === codes.eof || code === codes.lessThan || code === codes.equalsTo || code === codes.greaterThan || code === codes.graveAccent) {
      return nok(code);
    }
    if (code === codes.quotationMark || code === codes.apostrophe) {
      effects.consume(code);
      markerB = code;
      return completeAttributeValueQuoted;
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAttributeValueBefore;
    }
    return completeAttributeValueUnquoted(code);
  }
  function completeAttributeValueQuoted(code) {
    if (code === markerB) {
      effects.consume(code);
      markerB = null;
      return completeAttributeValueQuotedAfter;
    }
    if (code === codes.eof || markdownLineEnding(code)) {
      return nok(code);
    }
    effects.consume(code);
    return completeAttributeValueQuoted;
  }
  function completeAttributeValueUnquoted(code) {
    if (code === codes.eof || code === codes.quotationMark || code === codes.apostrophe || code === codes.slash || code === codes.lessThan || code === codes.equalsTo || code === codes.greaterThan || code === codes.graveAccent || markdownLineEndingOrSpace(code)) {
      return completeAttributeNameAfter(code);
    }
    effects.consume(code);
    return completeAttributeValueUnquoted;
  }
  function completeAttributeValueQuotedAfter(code) {
    if (code === codes.slash || code === codes.greaterThan || markdownSpace(code)) {
      return completeAttributeNameBefore(code);
    }
    return nok(code);
  }
  function completeEnd(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }
  function completeAfter(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return continuation(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return completeAfter;
    }
    return nok(code);
  }
  function continuation(code) {
    if (code === codes.dash && marker === constants.htmlComment) {
      effects.consume(code);
      return continuationCommentInside;
    }
    if (code === codes.lessThan && marker === constants.htmlRaw) {
      effects.consume(code);
      return continuationRawTagOpen;
    }
    if (code === codes.greaterThan && marker === constants.htmlDeclaration) {
      effects.consume(code);
      return continuationClose;
    }
    if (code === codes.questionMark && marker === constants.htmlInstruction) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    if (code === codes.rightSquareBracket && marker === constants.htmlCdata) {
      effects.consume(code);
      return continuationCdataInside;
    }
    if (markdownLineEnding(code) && (marker === constants.htmlBasic || marker === constants.htmlComplete)) {
      effects.exit(types2.htmlFlowData);
      return effects.check(blankLineBefore, continuationAfter, continuationStart)(code);
    }
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.htmlFlowData);
      return continuationStart(code);
    }
    effects.consume(code);
    return continuation;
  }
  function continuationStart(code) {
    return effects.check(nonLazyContinuationStart, continuationStartNonLazy, continuationAfter)(code);
  }
  function continuationStartNonLazy(code) {
    ok(markdownLineEnding(code));
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return continuationBefore;
  }
  function continuationBefore(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      return continuationStart(code);
    }
    effects.enter(types2.htmlFlowData);
    return continuation(code);
  }
  function continuationCommentInside(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  function continuationRawTagOpen(code) {
    if (code === codes.slash) {
      effects.consume(code);
      buffer = "";
      return continuationRawEndTag;
    }
    return continuation(code);
  }
  function continuationRawEndTag(code) {
    if (code === codes.greaterThan) {
      const name = buffer.toLowerCase();
      if (htmlRawNames.includes(name)) {
        effects.consume(code);
        return continuationClose;
      }
      return continuation(code);
    }
    if (asciiAlpha(code) && buffer.length < constants.htmlRawSizeMax) {
      ok(code !== null);
      effects.consume(code);
      buffer += String.fromCharCode(code);
      return continuationRawEndTag;
    }
    return continuation(code);
  }
  function continuationCdataInside(code) {
    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  function continuationDeclarationInside(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      return continuationClose;
    }
    if (code === codes.dash && marker === constants.htmlComment) {
      effects.consume(code);
      return continuationDeclarationInside;
    }
    return continuation(code);
  }
  function continuationClose(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.htmlFlowData);
      return continuationAfter(code);
    }
    effects.consume(code);
    return continuationClose;
  }
  function continuationAfter(code) {
    effects.exit(types2.htmlFlow);
    return ok2(code);
  }
}
function tokenizeNonLazyContinuationStart(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code) {
    if (markdownLineEnding(code)) {
      effects.enter(types2.lineEnding);
      effects.consume(code);
      effects.exit(types2.lineEnding);
      return after;
    }
    return nok(code);
  }
  function after(code) {
    return self2.parser.lazy[self2.now().line] ? nok(code) : ok2(code);
  }
}
function tokenizeBlankLineBefore(effects, ok2, nok) {
  return start;
  function start(code) {
    ok(markdownLineEnding(code), "expected a line ending");
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return effects.attempt(blankLine, ok2, nok);
  }
}
var htmlFlow, blankLineBefore, nonLazyContinuationStart;
var init_html_flow = __esm(() => {
  init_development();
  init_dev4();
  init_micromark_util_html_tag_name();
  init_default();
  init_blank_line();
  htmlFlow = {
    concrete: true,
    name: "htmlFlow",
    resolveTo: resolveToHtmlFlow,
    tokenize: tokenizeHtmlFlow
  };
  blankLineBefore = { partial: true, tokenize: tokenizeBlankLineBefore };
  nonLazyContinuationStart = {
    partial: true,
    tokenize: tokenizeNonLazyContinuationStart
  };
});

// node_modules/micromark-core-commonmark/dev/lib/html-text.js
function tokenizeHtmlText(effects, ok2, nok) {
  const self2 = this;
  let marker;
  let index2;
  let returnState;
  return start;
  function start(code) {
    ok(code === codes.lessThan, "expected `<`");
    effects.enter(types2.htmlText);
    effects.enter(types2.htmlTextData);
    effects.consume(code);
    return open;
  }
  function open(code) {
    if (code === codes.exclamationMark) {
      effects.consume(code);
      return declarationOpen;
    }
    if (code === codes.slash) {
      effects.consume(code);
      return tagCloseStart;
    }
    if (code === codes.questionMark) {
      effects.consume(code);
      return instruction;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagOpen;
    }
    return nok(code);
  }
  function declarationOpen(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return commentOpenInside;
    }
    if (code === codes.leftSquareBracket) {
      effects.consume(code);
      index2 = 0;
      return cdataOpenInside;
    }
    if (asciiAlpha(code)) {
      effects.consume(code);
      return declaration;
    }
    return nok(code);
  }
  function commentOpenInside(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return commentEnd;
    }
    return nok(code);
  }
  function comment(code) {
    if (code === codes.eof) {
      return nok(code);
    }
    if (code === codes.dash) {
      effects.consume(code);
      return commentClose;
    }
    if (markdownLineEnding(code)) {
      returnState = comment;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return comment;
  }
  function commentClose(code) {
    if (code === codes.dash) {
      effects.consume(code);
      return commentEnd;
    }
    return comment(code);
  }
  function commentEnd(code) {
    return code === codes.greaterThan ? end(code) : code === codes.dash ? commentClose(code) : comment(code);
  }
  function cdataOpenInside(code) {
    const value = constants.cdataOpeningString;
    if (code === value.charCodeAt(index2++)) {
      effects.consume(code);
      return index2 === value.length ? cdata : cdataOpenInside;
    }
    return nok(code);
  }
  function cdata(code) {
    if (code === codes.eof) {
      return nok(code);
    }
    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return cdataClose;
    }
    if (markdownLineEnding(code)) {
      returnState = cdata;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return cdata;
  }
  function cdataClose(code) {
    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }
  function cdataEnd(code) {
    if (code === codes.greaterThan) {
      return end(code);
    }
    if (code === codes.rightSquareBracket) {
      effects.consume(code);
      return cdataEnd;
    }
    return cdata(code);
  }
  function declaration(code) {
    if (code === codes.eof || code === codes.greaterThan) {
      return end(code);
    }
    if (markdownLineEnding(code)) {
      returnState = declaration;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return declaration;
  }
  function instruction(code) {
    if (code === codes.eof) {
      return nok(code);
    }
    if (code === codes.questionMark) {
      effects.consume(code);
      return instructionClose;
    }
    if (markdownLineEnding(code)) {
      returnState = instruction;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return instruction;
  }
  function instructionClose(code) {
    return code === codes.greaterThan ? end(code) : instruction(code);
  }
  function tagCloseStart(code) {
    if (asciiAlpha(code)) {
      effects.consume(code);
      return tagClose;
    }
    return nok(code);
  }
  function tagClose(code) {
    if (code === codes.dash || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagClose;
    }
    return tagCloseBetween(code);
  }
  function tagCloseBetween(code) {
    if (markdownLineEnding(code)) {
      returnState = tagCloseBetween;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagCloseBetween;
    }
    return end(code);
  }
  function tagOpen(code) {
    if (code === codes.dash || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpen;
    }
    if (code === codes.slash || code === codes.greaterThan || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    return nok(code);
  }
  function tagOpenBetween(code) {
    if (code === codes.slash) {
      effects.consume(code);
      return end;
    }
    if (code === codes.colon || code === codes.underscore || asciiAlpha(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenBetween;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenBetween;
    }
    return end(code);
  }
  function tagOpenAttributeName(code) {
    if (code === codes.dash || code === codes.dot || code === codes.colon || code === codes.underscore || asciiAlphanumeric(code)) {
      effects.consume(code);
      return tagOpenAttributeName;
    }
    return tagOpenAttributeNameAfter(code);
  }
  function tagOpenAttributeNameAfter(code) {
    if (code === codes.equalsTo) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeNameAfter;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeNameAfter;
    }
    return tagOpenBetween(code);
  }
  function tagOpenAttributeValueBefore(code) {
    if (code === codes.eof || code === codes.lessThan || code === codes.equalsTo || code === codes.greaterThan || code === codes.graveAccent) {
      return nok(code);
    }
    if (code === codes.quotationMark || code === codes.apostrophe) {
      effects.consume(code);
      marker = code;
      return tagOpenAttributeValueQuoted;
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueBefore;
      return lineEndingBefore(code);
    }
    if (markdownSpace(code)) {
      effects.consume(code);
      return tagOpenAttributeValueBefore;
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuoted(code) {
    if (code === marker) {
      effects.consume(code);
      marker = undefined;
      return tagOpenAttributeValueQuotedAfter;
    }
    if (code === codes.eof) {
      return nok(code);
    }
    if (markdownLineEnding(code)) {
      returnState = tagOpenAttributeValueQuoted;
      return lineEndingBefore(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueQuoted;
  }
  function tagOpenAttributeValueUnquoted(code) {
    if (code === codes.eof || code === codes.quotationMark || code === codes.apostrophe || code === codes.lessThan || code === codes.equalsTo || code === codes.graveAccent) {
      return nok(code);
    }
    if (code === codes.slash || code === codes.greaterThan || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    effects.consume(code);
    return tagOpenAttributeValueUnquoted;
  }
  function tagOpenAttributeValueQuotedAfter(code) {
    if (code === codes.slash || code === codes.greaterThan || markdownLineEndingOrSpace(code)) {
      return tagOpenBetween(code);
    }
    return nok(code);
  }
  function end(code) {
    if (code === codes.greaterThan) {
      effects.consume(code);
      effects.exit(types2.htmlTextData);
      effects.exit(types2.htmlText);
      return ok2;
    }
    return nok(code);
  }
  function lineEndingBefore(code) {
    ok(returnState, "expected return state");
    ok(markdownLineEnding(code), "expected eol");
    effects.exit(types2.htmlTextData);
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return lineEndingAfter;
  }
  function lineEndingAfter(code) {
    ok(self2.parser.constructs.disable.null, "expected `disable.null` to be populated");
    return markdownSpace(code) ? factorySpace(effects, lineEndingAfterPrefix, types2.linePrefix, self2.parser.constructs.disable.null.includes("codeIndented") ? undefined : constants.tabSize)(code) : lineEndingAfterPrefix(code);
  }
  function lineEndingAfterPrefix(code) {
    effects.enter(types2.htmlTextData);
    return returnState(code);
  }
}
var htmlText;
var init_html_text = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  htmlText = { name: "htmlText", tokenize: tokenizeHtmlText };
});

// node_modules/micromark-core-commonmark/dev/lib/label-end.js
function resolveAllLabelEnd(events) {
  let index2 = -1;
  const newEvents = [];
  while (++index2 < events.length) {
    const token = events[index2][1];
    newEvents.push(events[index2]);
    if (token.type === types2.labelImage || token.type === types2.labelLink || token.type === types2.labelEnd) {
      const offset = token.type === types2.labelImage ? 4 : 2;
      token.type = types2.data;
      index2 += offset;
    }
  }
  if (events.length !== newEvents.length) {
    splice(events, 0, events.length, newEvents);
  }
  return events;
}
function resolveToLabelEnd(events, context) {
  let index2 = events.length;
  let offset = 0;
  let token;
  let open;
  let close;
  let media;
  while (index2--) {
    token = events[index2][1];
    if (open) {
      if (token.type === types2.link || token.type === types2.labelLink && token._inactive) {
        break;
      }
      if (events[index2][0] === "enter" && token.type === types2.labelLink) {
        token._inactive = true;
      }
    } else if (close) {
      if (events[index2][0] === "enter" && (token.type === types2.labelImage || token.type === types2.labelLink) && !token._balanced) {
        open = index2;
        if (token.type !== types2.labelLink) {
          offset = 2;
          break;
        }
      }
    } else if (token.type === types2.labelEnd) {
      close = index2;
    }
  }
  ok(open !== undefined, "`open` is supposed to be found");
  ok(close !== undefined, "`close` is supposed to be found");
  const group = {
    type: events[open][1].type === types2.labelLink ? types2.link : types2.image,
    start: { ...events[open][1].start },
    end: { ...events[events.length - 1][1].end }
  };
  const label = {
    type: types2.label,
    start: { ...events[open][1].start },
    end: { ...events[close][1].end }
  };
  const text = {
    type: types2.labelText,
    start: { ...events[open + offset + 2][1].end },
    end: { ...events[close - 2][1].start }
  };
  media = [
    ["enter", group, context],
    ["enter", label, context]
  ];
  media = push(media, events.slice(open + 1, open + offset + 3));
  media = push(media, [["enter", text, context]]);
  ok(context.parser.constructs.insideSpan.null, "expected `insideSpan.null` to be populated");
  media = push(media, resolveAll(context.parser.constructs.insideSpan.null, events.slice(open + offset + 4, close - 3), context));
  media = push(media, [
    ["exit", text, context],
    events[close - 2],
    events[close - 1],
    ["exit", label, context]
  ]);
  media = push(media, events.slice(close + 1));
  media = push(media, [["exit", group, context]]);
  splice(events, open, events.length, media);
  return events;
}
function tokenizeLabelEnd(effects, ok2, nok) {
  const self2 = this;
  let index2 = self2.events.length;
  let labelStart;
  let defined;
  while (index2--) {
    if ((self2.events[index2][1].type === types2.labelImage || self2.events[index2][1].type === types2.labelLink) && !self2.events[index2][1]._balanced) {
      labelStart = self2.events[index2][1];
      break;
    }
  }
  return start;
  function start(code) {
    ok(code === codes.rightSquareBracket, "expected `]`");
    if (!labelStart) {
      return nok(code);
    }
    if (labelStart._inactive) {
      return labelEndNok(code);
    }
    defined = self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize({ start: labelStart.end, end: self2.now() })));
    effects.enter(types2.labelEnd);
    effects.enter(types2.labelMarker);
    effects.consume(code);
    effects.exit(types2.labelMarker);
    effects.exit(types2.labelEnd);
    return after;
  }
  function after(code) {
    if (code === codes.leftParenthesis) {
      return effects.attempt(resourceConstruct, labelEndOk, defined ? labelEndOk : labelEndNok)(code);
    }
    if (code === codes.leftSquareBracket) {
      return effects.attempt(referenceFullConstruct, labelEndOk, defined ? referenceNotFull : labelEndNok)(code);
    }
    return defined ? labelEndOk(code) : labelEndNok(code);
  }
  function referenceNotFull(code) {
    return effects.attempt(referenceCollapsedConstruct, labelEndOk, labelEndNok)(code);
  }
  function labelEndOk(code) {
    return ok2(code);
  }
  function labelEndNok(code) {
    labelStart._balanced = true;
    return nok(code);
  }
}
function tokenizeResource(effects, ok2, nok) {
  return resourceStart;
  function resourceStart(code) {
    ok(code === codes.leftParenthesis, "expected left paren");
    effects.enter(types2.resource);
    effects.enter(types2.resourceMarker);
    effects.consume(code);
    effects.exit(types2.resourceMarker);
    return resourceBefore;
  }
  function resourceBefore(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceOpen)(code) : resourceOpen(code);
  }
  function resourceOpen(code) {
    if (code === codes.rightParenthesis) {
      return resourceEnd(code);
    }
    return factoryDestination(effects, resourceDestinationAfter, resourceDestinationMissing, types2.resourceDestination, types2.resourceDestinationLiteral, types2.resourceDestinationLiteralMarker, types2.resourceDestinationRaw, types2.resourceDestinationString, constants.linkResourceDestinationBalanceMax)(code);
  }
  function resourceDestinationAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceBetween)(code) : resourceEnd(code);
  }
  function resourceDestinationMissing(code) {
    return nok(code);
  }
  function resourceBetween(code) {
    if (code === codes.quotationMark || code === codes.apostrophe || code === codes.leftParenthesis) {
      return factoryTitle(effects, resourceTitleAfter, nok, types2.resourceTitle, types2.resourceTitleMarker, types2.resourceTitleString)(code);
    }
    return resourceEnd(code);
  }
  function resourceTitleAfter(code) {
    return markdownLineEndingOrSpace(code) ? factoryWhitespace(effects, resourceEnd)(code) : resourceEnd(code);
  }
  function resourceEnd(code) {
    if (code === codes.rightParenthesis) {
      effects.enter(types2.resourceMarker);
      effects.consume(code);
      effects.exit(types2.resourceMarker);
      effects.exit(types2.resource);
      return ok2;
    }
    return nok(code);
  }
}
function tokenizeReferenceFull(effects, ok2, nok) {
  const self2 = this;
  return referenceFull;
  function referenceFull(code) {
    ok(code === codes.leftSquareBracket, "expected left bracket");
    return factoryLabel.call(self2, effects, referenceFullAfter, referenceFullMissing, types2.reference, types2.referenceMarker, types2.referenceString)(code);
  }
  function referenceFullAfter(code) {
    return self2.parser.defined.includes(normalizeIdentifier(self2.sliceSerialize(self2.events[self2.events.length - 1][1]).slice(1, -1))) ? ok2(code) : nok(code);
  }
  function referenceFullMissing(code) {
    return nok(code);
  }
}
function tokenizeReferenceCollapsed(effects, ok2, nok) {
  return referenceCollapsedStart;
  function referenceCollapsedStart(code) {
    ok(code === codes.leftSquareBracket, "expected left bracket");
    effects.enter(types2.reference);
    effects.enter(types2.referenceMarker);
    effects.consume(code);
    effects.exit(types2.referenceMarker);
    return referenceCollapsedOpen;
  }
  function referenceCollapsedOpen(code) {
    if (code === codes.rightSquareBracket) {
      effects.enter(types2.referenceMarker);
      effects.consume(code);
      effects.exit(types2.referenceMarker);
      effects.exit(types2.reference);
      return ok2;
    }
    return nok(code);
  }
}
var labelEnd, resourceConstruct, referenceFullConstruct, referenceCollapsedConstruct;
var init_label_end = __esm(() => {
  init_development();
  init_dev9();
  init_dev10();
  init_dev11();
  init_dev12();
  init_dev4();
  init_dev();
  init_dev3();
  init_default();
  labelEnd = {
    name: "labelEnd",
    resolveAll: resolveAllLabelEnd,
    resolveTo: resolveToLabelEnd,
    tokenize: tokenizeLabelEnd
  };
  resourceConstruct = { tokenize: tokenizeResource };
  referenceFullConstruct = { tokenize: tokenizeReferenceFull };
  referenceCollapsedConstruct = { tokenize: tokenizeReferenceCollapsed };
});

// node_modules/micromark-core-commonmark/dev/lib/label-start-image.js
function tokenizeLabelStartImage(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code) {
    ok(code === codes.exclamationMark, "expected `!`");
    effects.enter(types2.labelImage);
    effects.enter(types2.labelImageMarker);
    effects.consume(code);
    effects.exit(types2.labelImageMarker);
    return open;
  }
  function open(code) {
    if (code === codes.leftSquareBracket) {
      effects.enter(types2.labelMarker);
      effects.consume(code);
      effects.exit(types2.labelMarker);
      effects.exit(types2.labelImage);
      return after;
    }
    return nok(code);
  }
  function after(code) {
    return code === codes.caret && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code) : ok2(code);
  }
}
var labelStartImage;
var init_label_start_image = __esm(() => {
  init_development();
  init_default();
  init_label_end();
  labelStartImage = {
    name: "labelStartImage",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartImage
  };
});

// node_modules/micromark-core-commonmark/dev/lib/label-start-link.js
function tokenizeLabelStartLink(effects, ok2, nok) {
  const self2 = this;
  return start;
  function start(code) {
    ok(code === codes.leftSquareBracket, "expected `[`");
    effects.enter(types2.labelLink);
    effects.enter(types2.labelMarker);
    effects.consume(code);
    effects.exit(types2.labelMarker);
    effects.exit(types2.labelLink);
    return after;
  }
  function after(code) {
    return code === codes.caret && "_hiddenFootnoteSupport" in self2.parser.constructs ? nok(code) : ok2(code);
  }
}
var labelStartLink;
var init_label_start_link = __esm(() => {
  init_development();
  init_default();
  init_label_end();
  labelStartLink = {
    name: "labelStartLink",
    resolveAll: labelEnd.resolveAll,
    tokenize: tokenizeLabelStartLink
  };
});

// node_modules/micromark-core-commonmark/dev/lib/line-ending.js
function tokenizeLineEnding(effects, ok2) {
  return start;
  function start(code) {
    ok(markdownLineEnding(code), "expected eol");
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    return factorySpace(effects, ok2, types2.linePrefix);
  }
}
var lineEnding;
var init_line_ending = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  lineEnding = { name: "lineEnding", tokenize: tokenizeLineEnding };
});

// node_modules/micromark-core-commonmark/dev/lib/thematic-break.js
function tokenizeThematicBreak(effects, ok2, nok) {
  let size = 0;
  let marker;
  return start;
  function start(code) {
    effects.enter(types2.thematicBreak);
    return before(code);
  }
  function before(code) {
    ok(code === codes.asterisk || code === codes.dash || code === codes.underscore, "expected `*`, `-`, or `_`");
    marker = code;
    return atBreak(code);
  }
  function atBreak(code) {
    if (code === marker) {
      effects.enter(types2.thematicBreakSequence);
      return sequence(code);
    }
    if (size >= constants.thematicBreakMarkerCountMin && (code === codes.eof || markdownLineEnding(code))) {
      effects.exit(types2.thematicBreak);
      return ok2(code);
    }
    return nok(code);
  }
  function sequence(code) {
    if (code === marker) {
      effects.consume(code);
      size++;
      return sequence;
    }
    effects.exit(types2.thematicBreakSequence);
    return markdownSpace(code) ? factorySpace(effects, atBreak, types2.whitespace)(code) : atBreak(code);
  }
}
var thematicBreak;
var init_thematic_break = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  thematicBreak = {
    name: "thematicBreak",
    tokenize: tokenizeThematicBreak
  };
});

// node_modules/micromark-core-commonmark/dev/lib/list.js
function tokenizeListStart(effects, ok2, nok) {
  const self2 = this;
  const tail = self2.events[self2.events.length - 1];
  let initialSize = tail && tail[1].type === types2.linePrefix ? tail[2].sliceSerialize(tail[1], true).length : 0;
  let size = 0;
  return start;
  function start(code) {
    ok(self2.containerState, "expected state");
    const kind = self2.containerState.type || (code === codes.asterisk || code === codes.plusSign || code === codes.dash ? types2.listUnordered : types2.listOrdered);
    if (kind === types2.listUnordered ? !self2.containerState.marker || code === self2.containerState.marker : asciiDigit(code)) {
      if (!self2.containerState.type) {
        self2.containerState.type = kind;
        effects.enter(kind, { _container: true });
      }
      if (kind === types2.listUnordered) {
        effects.enter(types2.listItemPrefix);
        return code === codes.asterisk || code === codes.dash ? effects.check(thematicBreak, nok, atMarker)(code) : atMarker(code);
      }
      if (!self2.interrupt || code === codes.digit1) {
        effects.enter(types2.listItemPrefix);
        effects.enter(types2.listItemValue);
        return inside(code);
      }
    }
    return nok(code);
  }
  function inside(code) {
    ok(self2.containerState, "expected state");
    if (asciiDigit(code) && ++size < constants.listItemValueSizeMax) {
      effects.consume(code);
      return inside;
    }
    if ((!self2.interrupt || size < 2) && (self2.containerState.marker ? code === self2.containerState.marker : code === codes.rightParenthesis || code === codes.dot)) {
      effects.exit(types2.listItemValue);
      return atMarker(code);
    }
    return nok(code);
  }
  function atMarker(code) {
    ok(self2.containerState, "expected state");
    ok(code !== codes.eof, "eof (`null`) is not a marker");
    effects.enter(types2.listItemMarker);
    effects.consume(code);
    effects.exit(types2.listItemMarker);
    self2.containerState.marker = self2.containerState.marker || code;
    return effects.check(blankLine, self2.interrupt ? nok : onBlank, effects.attempt(listItemPrefixWhitespaceConstruct, endOfPrefix, otherPrefix));
  }
  function onBlank(code) {
    ok(self2.containerState, "expected state");
    self2.containerState.initialBlankLine = true;
    initialSize++;
    return endOfPrefix(code);
  }
  function otherPrefix(code) {
    if (markdownSpace(code)) {
      effects.enter(types2.listItemPrefixWhitespace);
      effects.consume(code);
      effects.exit(types2.listItemPrefixWhitespace);
      return endOfPrefix;
    }
    return nok(code);
  }
  function endOfPrefix(code) {
    ok(self2.containerState, "expected state");
    self2.containerState.size = initialSize + self2.sliceSerialize(effects.exit(types2.listItemPrefix), true).length;
    return ok2(code);
  }
}
function tokenizeListContinuation(effects, ok2, nok) {
  const self2 = this;
  ok(self2.containerState, "expected state");
  self2.containerState._closeFlow = undefined;
  return effects.check(blankLine, onBlank, notBlank);
  function onBlank(code) {
    ok(self2.containerState, "expected state");
    ok(typeof self2.containerState.size === "number", "expected size");
    self2.containerState.furtherBlankLines = self2.containerState.furtherBlankLines || self2.containerState.initialBlankLine;
    return factorySpace(effects, ok2, types2.listItemIndent, self2.containerState.size + 1)(code);
  }
  function notBlank(code) {
    ok(self2.containerState, "expected state");
    if (self2.containerState.furtherBlankLines || !markdownSpace(code)) {
      self2.containerState.furtherBlankLines = undefined;
      self2.containerState.initialBlankLine = undefined;
      return notInCurrentItem(code);
    }
    self2.containerState.furtherBlankLines = undefined;
    self2.containerState.initialBlankLine = undefined;
    return effects.attempt(indentConstruct, ok2, notInCurrentItem)(code);
  }
  function notInCurrentItem(code) {
    ok(self2.containerState, "expected state");
    self2.containerState._closeFlow = true;
    self2.interrupt = undefined;
    ok(self2.parser.constructs.disable.null, "expected `disable.null` to be populated");
    return factorySpace(effects, effects.attempt(list, ok2, nok), types2.linePrefix, self2.parser.constructs.disable.null.includes("codeIndented") ? undefined : constants.tabSize)(code);
  }
}
function tokenizeIndent(effects, ok2, nok) {
  const self2 = this;
  ok(self2.containerState, "expected state");
  ok(typeof self2.containerState.size === "number", "expected size");
  return factorySpace(effects, afterPrefix, types2.listItemIndent, self2.containerState.size + 1);
  function afterPrefix(code) {
    ok(self2.containerState, "expected state");
    const tail = self2.events[self2.events.length - 1];
    return tail && tail[1].type === types2.listItemIndent && tail[2].sliceSerialize(tail[1], true).length === self2.containerState.size ? ok2(code) : nok(code);
  }
}
function tokenizeListEnd(effects) {
  ok(this.containerState, "expected state");
  ok(typeof this.containerState.type === "string", "expected type");
  effects.exit(this.containerState.type);
}
function tokenizeListItemPrefixWhitespace(effects, ok2, nok) {
  const self2 = this;
  ok(self2.parser.constructs.disable.null, "expected `disable.null` to be populated");
  return factorySpace(effects, afterPrefix, types2.listItemPrefixWhitespace, self2.parser.constructs.disable.null.includes("codeIndented") ? undefined : constants.tabSize + 1);
  function afterPrefix(code) {
    const tail = self2.events[self2.events.length - 1];
    return !markdownSpace(code) && tail && tail[1].type === types2.listItemPrefixWhitespace ? ok2(code) : nok(code);
  }
}
var list, listItemPrefixWhitespaceConstruct, indentConstruct;
var init_list = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  init_blank_line();
  init_thematic_break();
  list = {
    continuation: { tokenize: tokenizeListContinuation },
    exit: tokenizeListEnd,
    name: "list",
    tokenize: tokenizeListStart
  };
  listItemPrefixWhitespaceConstruct = {
    partial: true,
    tokenize: tokenizeListItemPrefixWhitespace
  };
  indentConstruct = { partial: true, tokenize: tokenizeIndent };
});

// node_modules/micromark-core-commonmark/dev/lib/setext-underline.js
function resolveToSetextUnderline(events, context) {
  let index2 = events.length;
  let content3;
  let text;
  let definition2;
  while (index2--) {
    if (events[index2][0] === "enter") {
      if (events[index2][1].type === types2.content) {
        content3 = index2;
        break;
      }
      if (events[index2][1].type === types2.paragraph) {
        text = index2;
      }
    } else {
      if (events[index2][1].type === types2.content) {
        events.splice(index2, 1);
      }
      if (!definition2 && events[index2][1].type === types2.definition) {
        definition2 = index2;
      }
    }
  }
  ok(text !== undefined, "expected a `text` index to be found");
  ok(content3 !== undefined, "expected a `text` index to be found");
  ok(events[content3][2] === context, "enter context should be same");
  ok(events[events.length - 1][2] === context, "enter context should be same");
  const heading = {
    type: types2.setextHeading,
    start: { ...events[content3][1].start },
    end: { ...events[events.length - 1][1].end }
  };
  events[text][1].type = types2.setextHeadingText;
  if (definition2) {
    events.splice(text, 0, ["enter", heading, context]);
    events.splice(definition2 + 1, 0, ["exit", events[content3][1], context]);
    events[content3][1].end = { ...events[definition2][1].end };
  } else {
    events[content3][1] = heading;
  }
  events.push(["exit", heading, context]);
  return events;
}
function tokenizeSetextUnderline(effects, ok2, nok) {
  const self2 = this;
  let marker;
  return start;
  function start(code) {
    let index2 = self2.events.length;
    let paragraph;
    ok(code === codes.dash || code === codes.equalsTo, "expected `=` or `-`");
    while (index2--) {
      if (self2.events[index2][1].type !== types2.lineEnding && self2.events[index2][1].type !== types2.linePrefix && self2.events[index2][1].type !== types2.content) {
        paragraph = self2.events[index2][1].type === types2.paragraph;
        break;
      }
    }
    if (!self2.parser.lazy[self2.now().line] && (self2.interrupt || paragraph)) {
      effects.enter(types2.setextHeadingLine);
      marker = code;
      return before(code);
    }
    return nok(code);
  }
  function before(code) {
    effects.enter(types2.setextHeadingLineSequence);
    return inside(code);
  }
  function inside(code) {
    if (code === marker) {
      effects.consume(code);
      return inside;
    }
    effects.exit(types2.setextHeadingLineSequence);
    return markdownSpace(code) ? factorySpace(effects, after, types2.lineSuffix)(code) : after(code);
  }
  function after(code) {
    if (code === codes.eof || markdownLineEnding(code)) {
      effects.exit(types2.setextHeadingLine);
      return ok2(code);
    }
    return nok(code);
  }
}
var setextUnderline;
var init_setext_underline = __esm(() => {
  init_development();
  init_dev6();
  init_dev4();
  init_default();
  setextUnderline = {
    name: "setextUnderline",
    resolveTo: resolveToSetextUnderline,
    tokenize: tokenizeSetextUnderline
  };
});

// node_modules/micromark-core-commonmark/dev/index.js
var init_dev13 = __esm(() => {
  init_attention();
  init_autolink();
  init_blank_line();
  init_block_quote();
  init_character_escape();
  init_character_reference();
  init_code_fenced();
  init_code_indented();
  init_code_text();
  init_content2();
  init_definition();
  init_hard_break_escape();
  init_heading_atx();
  init_html_flow();
  init_html_text();
  init_label_end();
  init_label_start_image();
  init_label_start_link();
  init_line_ending();
  init_list();
  init_setext_underline();
  init_thematic_break();
});

// node_modules/micromark/dev/lib/initialize/flow.js
function initializeFlow(effects) {
  const self2 = this;
  const initial = effects.attempt(blankLine, atBlankEnding, effects.attempt(this.parser.constructs.flowInitial, afterConstruct, factorySpace(effects, effects.attempt(this.parser.constructs.flow, afterConstruct, effects.attempt(content2, afterConstruct)), types2.linePrefix)));
  return initial;
  function atBlankEnding(code) {
    ok(code === codes.eof || markdownLineEnding(code), "expected eol or eof");
    if (code === codes.eof) {
      effects.consume(code);
      return;
    }
    effects.enter(types2.lineEndingBlank);
    effects.consume(code);
    effects.exit(types2.lineEndingBlank);
    self2.currentConstruct = undefined;
    return initial;
  }
  function afterConstruct(code) {
    ok(code === codes.eof || markdownLineEnding(code), "expected eol or eof");
    if (code === codes.eof) {
      effects.consume(code);
      return;
    }
    effects.enter(types2.lineEnding);
    effects.consume(code);
    effects.exit(types2.lineEnding);
    self2.currentConstruct = undefined;
    return initial;
  }
}
var flow;
var init_flow = __esm(() => {
  init_development();
  init_dev13();
  init_dev6();
  init_dev4();
  init_default();
  flow = { tokenize: initializeFlow };
});

// node_modules/micromark/dev/lib/initialize/text.js
function initializeFactory(field) {
  return {
    resolveAll: createResolver(field === "text" ? resolveAllLineSuffixes : undefined),
    tokenize: initializeText
  };
  function initializeText(effects) {
    const self2 = this;
    const constructs2 = this.parser.constructs[field];
    const text2 = effects.attempt(constructs2, start, notText);
    return start;
    function start(code) {
      return atBreak(code) ? text2(code) : notText(code);
    }
    function notText(code) {
      if (code === codes.eof) {
        effects.consume(code);
        return;
      }
      effects.enter(types2.data);
      effects.consume(code);
      return data;
    }
    function data(code) {
      if (atBreak(code)) {
        effects.exit(types2.data);
        return text2(code);
      }
      effects.consume(code);
      return data;
    }
    function atBreak(code) {
      if (code === codes.eof) {
        return true;
      }
      const list2 = constructs2[code];
      let index2 = -1;
      if (list2) {
        ok(Array.isArray(list2), "expected `disable.null` to be populated");
        while (++index2 < list2.length) {
          const item = list2[index2];
          if (!item.previous || item.previous.call(self2, self2.previous)) {
            return true;
          }
        }
      }
      return false;
    }
  }
}
function createResolver(extraResolver) {
  return resolveAllText;
  function resolveAllText(events, context) {
    let index2 = -1;
    let enter;
    while (++index2 <= events.length) {
      if (enter === undefined) {
        if (events[index2] && events[index2][1].type === types2.data) {
          enter = index2;
          index2++;
        }
      } else if (!events[index2] || events[index2][1].type !== types2.data) {
        if (index2 !== enter + 2) {
          events[enter][1].end = events[index2 - 1][1].end;
          events.splice(enter + 2, index2 - enter - 2);
          index2 = enter + 2;
        }
        enter = undefined;
      }
    }
    return extraResolver ? extraResolver(events, context) : events;
  }
}
function resolveAllLineSuffixes(events, context) {
  let eventIndex = 0;
  while (++eventIndex <= events.length) {
    if ((eventIndex === events.length || events[eventIndex][1].type === types2.lineEnding) && events[eventIndex - 1][1].type === types2.data) {
      const data = events[eventIndex - 1][1];
      const chunks = context.sliceStream(data);
      let index2 = chunks.length;
      let bufferIndex = -1;
      let size = 0;
      let tabs;
      while (index2--) {
        const chunk = chunks[index2];
        if (typeof chunk === "string") {
          bufferIndex = chunk.length;
          while (chunk.charCodeAt(bufferIndex - 1) === codes.space) {
            size++;
            bufferIndex--;
          }
          if (bufferIndex)
            break;
          bufferIndex = -1;
        } else if (chunk === codes.horizontalTab) {
          tabs = true;
          size++;
        } else if (chunk === codes.virtualSpace) {} else {
          index2++;
          break;
        }
      }
      if (context._contentTypeTextTrailing && eventIndex === events.length) {
        size = 0;
      }
      if (size) {
        const token = {
          type: eventIndex === events.length || tabs || size < constants.hardBreakPrefixSizeMin ? types2.lineSuffix : types2.hardBreakTrailing,
          start: {
            _bufferIndex: index2 ? bufferIndex : data.start._bufferIndex + bufferIndex,
            _index: data.start._index + index2,
            line: data.end.line,
            column: data.end.column - size,
            offset: data.end.offset - size
          },
          end: { ...data.end }
        };
        data.end = { ...token.start };
        if (data.start.offset === data.end.offset) {
          Object.assign(data, token);
        } else {
          events.splice(eventIndex, 0, ["enter", token, context], ["exit", token, context]);
          eventIndex += 2;
        }
      }
      eventIndex++;
    }
  }
  return events;
}
var resolver, string, text;
var init_text = __esm(() => {
  init_development();
  init_default();
  resolver = { resolveAll: createResolver() };
  string = initializeFactory("string");
  text = initializeFactory("text");
});

// node_modules/micromark/dev/lib/constructs.js
var exports_constructs = {};
__export(exports_constructs, {
  text: () => text2,
  string: () => string2,
  insideSpan: () => insideSpan,
  flowInitial: () => flowInitial,
  flow: () => flow2,
  document: () => document3,
  disable: () => disable,
  contentInitial: () => contentInitial,
  attentionMarkers: () => attentionMarkers
});
var document3, contentInitial, flowInitial, flow2, string2, text2, insideSpan, attentionMarkers, disable;
var init_constructs = __esm(() => {
  init_dev13();
  init_default();
  init_text();
  document3 = {
    [codes.asterisk]: list,
    [codes.plusSign]: list,
    [codes.dash]: list,
    [codes.digit0]: list,
    [codes.digit1]: list,
    [codes.digit2]: list,
    [codes.digit3]: list,
    [codes.digit4]: list,
    [codes.digit5]: list,
    [codes.digit6]: list,
    [codes.digit7]: list,
    [codes.digit8]: list,
    [codes.digit9]: list,
    [codes.greaterThan]: blockQuote
  };
  contentInitial = {
    [codes.leftSquareBracket]: definition
  };
  flowInitial = {
    [codes.horizontalTab]: codeIndented,
    [codes.virtualSpace]: codeIndented,
    [codes.space]: codeIndented
  };
  flow2 = {
    [codes.numberSign]: headingAtx,
    [codes.asterisk]: thematicBreak,
    [codes.dash]: [setextUnderline, thematicBreak],
    [codes.lessThan]: htmlFlow,
    [codes.equalsTo]: setextUnderline,
    [codes.underscore]: thematicBreak,
    [codes.graveAccent]: codeFenced,
    [codes.tilde]: codeFenced
  };
  string2 = {
    [codes.ampersand]: characterReference,
    [codes.backslash]: characterEscape
  };
  text2 = {
    [codes.carriageReturn]: lineEnding,
    [codes.lineFeed]: lineEnding,
    [codes.carriageReturnLineFeed]: lineEnding,
    [codes.exclamationMark]: labelStartImage,
    [codes.ampersand]: characterReference,
    [codes.asterisk]: attention,
    [codes.lessThan]: [autolink, htmlText],
    [codes.leftSquareBracket]: labelStartLink,
    [codes.backslash]: [hardBreakEscape, characterEscape],
    [codes.rightSquareBracket]: labelEnd,
    [codes.underscore]: attention,
    [codes.graveAccent]: codeText
  };
  insideSpan = { null: [attention, resolver] };
  attentionMarkers = { null: [codes.asterisk, codes.underscore] };
  disable = { null: [] };
});

// node_modules/ms/index.js
var require_ms = __commonJS((exports, module) => {
  var s = 1000;
  var m2 = s * 60;
  var h2 = m2 * 60;
  var d = h2 * 24;
  var w2 = d * 7;
  var y2 = d * 365.25;
  module.exports = function(val, options) {
    options = options || {};
    var type2 = typeof val;
    if (type2 === "string" && val.length > 0) {
      return parse2(val);
    } else if (type2 === "number" && isFinite(val)) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse2(str2) {
    str2 = String(str2);
    if (str2.length > 100) {
      return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str2);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type2 = (match[2] || "ms").toLowerCase();
    switch (type2) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y2;
      case "weeks":
      case "week":
      case "w":
        return n * w2;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h2;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m2;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return;
    }
  }
  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + "d";
    }
    if (msAbs >= h2) {
      return Math.round(ms / h2) + "h";
    }
    if (msAbs >= m2) {
      return Math.round(ms / m2) + "m";
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + "s";
    }
    return ms + "ms";
  }
  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h2) {
      return plural(ms, msAbs, h2, "hour");
    }
    if (msAbs >= m2) {
      return plural(ms, msAbs, m2, "minute");
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
  }
  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS((exports, module) => {
  function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable2;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = require_ms();
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key) => {
      createDebug[key] = env[key];
    });
    createDebug.names = [];
    createDebug.skips = [];
    createDebug.formatters = {};
    function selectColor(namespace) {
      let hash = 0;
      for (let i2 = 0;i2 < namespace.length; i2++) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i2);
        hash |= 0;
      }
      return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    function createDebug(namespace) {
      let prevTime;
      let enableOverride = null;
      let namespacesCache;
      let enabledCache;
      function debug(...args) {
        if (!debug.enabled) {
          return;
        }
        const self2 = debug;
        const curr = Number(new Date);
        const ms = curr - (prevTime || curr);
        self2.diff = ms;
        self2.prev = prevTime;
        self2.curr = curr;
        prevTime = curr;
        args[0] = createDebug.coerce(args[0]);
        if (typeof args[0] !== "string") {
          args.unshift("%O");
        }
        let index2 = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format2) => {
          if (match === "%%") {
            return "%";
          }
          index2++;
          const formatter = createDebug.formatters[format2];
          if (typeof formatter === "function") {
            const val = args[index2];
            match = formatter.call(self2, val);
            args.splice(index2, 1);
            index2--;
          }
          return match;
        });
        createDebug.formatArgs.call(self2, args);
        const logFn = self2.log || createDebug.log;
        logFn.apply(self2, args);
      }
      debug.namespace = namespace;
      debug.useColors = createDebug.useColors();
      debug.color = createDebug.selectColor(namespace);
      debug.extend = extend4;
      debug.destroy = createDebug.destroy;
      Object.defineProperty(debug, "enabled", {
        enumerable: true,
        configurable: false,
        get: () => {
          if (enableOverride !== null) {
            return enableOverride;
          }
          if (namespacesCache !== createDebug.namespaces) {
            namespacesCache = createDebug.namespaces;
            enabledCache = createDebug.enabled(namespace);
          }
          return enabledCache;
        },
        set: (v2) => {
          enableOverride = v2;
        }
      });
      if (typeof createDebug.init === "function") {
        createDebug.init(debug);
      }
      return debug;
    }
    function extend4(namespace, delimiter2) {
      const newDebug = createDebug(this.namespace + (typeof delimiter2 === "undefined" ? ":" : delimiter2) + namespace);
      newDebug.log = this.log;
      return newDebug;
    }
    function enable(namespaces) {
      createDebug.save(namespaces);
      createDebug.namespaces = namespaces;
      createDebug.names = [];
      createDebug.skips = [];
      const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const ns of split) {
        if (ns[0] === "-") {
          createDebug.skips.push(ns.slice(1));
        } else {
          createDebug.names.push(ns);
        }
      }
    }
    function matchesTemplate(search, template) {
      let searchIndex = 0;
      let templateIndex = 0;
      let starIndex = -1;
      let matchIndex = 0;
      while (searchIndex < search.length) {
        if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
          if (template[templateIndex] === "*") {
            starIndex = templateIndex;
            matchIndex = searchIndex;
            templateIndex++;
          } else {
            searchIndex++;
            templateIndex++;
          }
        } else if (starIndex !== -1) {
          templateIndex = starIndex + 1;
          matchIndex++;
          searchIndex = matchIndex;
        } else {
          return false;
        }
      }
      while (templateIndex < template.length && template[templateIndex] === "*") {
        templateIndex++;
      }
      return templateIndex === template.length;
    }
    function disable2() {
      const namespaces = [
        ...createDebug.names,
        ...createDebug.skips.map((namespace) => "-" + namespace)
      ].join(",");
      createDebug.enable("");
      return namespaces;
    }
    function enabled(name) {
      for (const skip of createDebug.skips) {
        if (matchesTemplate(name, skip)) {
          return false;
        }
      }
      for (const ns of createDebug.names) {
        if (matchesTemplate(name, ns)) {
          return true;
        }
      }
      return false;
    }
    function coerce(val) {
      if (val instanceof Error) {
        return val.stack || val.message;
      }
      return val;
    }
    function destroy() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
  }
  module.exports = setup;
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS((exports, module) => {
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load2;
  exports.useColors = useColors;
  exports.storage = localstorage();
  exports.destroy = (() => {
    let warned = false;
    return () => {
      if (!warned) {
        warned = true;
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
    };
  })();
  exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
      return true;
    }
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
      return false;
    }
    let m2;
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m2 = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m2[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
    if (!this.useColors) {
      return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    let index2 = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
      if (match === "%%") {
        return;
      }
      index2++;
      if (match === "%c") {
        lastC = index2;
      }
    });
    args.splice(lastC, 0, c);
  }
  exports.log = console.debug || console.log || (() => {});
  function save(namespaces) {
    try {
      if (namespaces) {
        exports.storage.setItem("debug", namespaces);
      } else {
        exports.storage.removeItem("debug");
      }
    } catch (error) {}
  }
  function load2() {
    let r;
    try {
      r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
    } catch (error) {}
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  function localstorage() {
    try {
      return localStorage;
    } catch (error) {}
  }
  module.exports = require_common()(exports);
  var { formatters } = module.exports;
  formatters.j = function(v2) {
    try {
      return JSON.stringify(v2);
    } catch (error) {
      return "[UnexpectedJSONParseError]: " + error.message;
    }
  };
});

// node_modules/micromark/dev/lib/create-tokenizer.js
function createTokenizer(parser, initialize, from) {
  let point2 = {
    _bufferIndex: -1,
    _index: 0,
    line: from && from.line || 1,
    column: from && from.column || 1,
    offset: from && from.offset || 0
  };
  const columnStart = {};
  const resolveAllConstructs = [];
  let chunks = [];
  let stack = [];
  let consumed = true;
  const effects = {
    attempt: constructFactory(onsuccessfulconstruct),
    check: constructFactory(onsuccessfulcheck),
    consume,
    enter,
    exit: exit2,
    interrupt: constructFactory(onsuccessfulcheck, { interrupt: true })
  };
  const context = {
    code: codes.eof,
    containerState: {},
    defineSkip,
    events: [],
    now,
    parser,
    previous: codes.eof,
    sliceSerialize,
    sliceStream,
    write
  };
  let state = initialize.tokenize.call(context, effects);
  let expectedCode;
  if (initialize.resolveAll) {
    resolveAllConstructs.push(initialize);
  }
  return context;
  function write(slice) {
    chunks = push(chunks, slice);
    main();
    if (chunks[chunks.length - 1] !== codes.eof) {
      return [];
    }
    addResult(initialize, 0);
    context.events = resolveAll(resolveAllConstructs, context.events, context);
    return context.events;
  }
  function sliceSerialize(token, expandTabs) {
    return serializeChunks(sliceStream(token), expandTabs);
  }
  function sliceStream(token) {
    return sliceChunks(chunks, token);
  }
  function now() {
    const { _bufferIndex, _index, line, column, offset } = point2;
    return { _bufferIndex, _index, line, column, offset };
  }
  function defineSkip(value) {
    columnStart[value.line] = value.column;
    accountForPotentialSkip();
    debug("position: define skip: `%j`", point2);
  }
  function main() {
    let chunkIndex;
    while (point2._index < chunks.length) {
      const chunk = chunks[point2._index];
      if (typeof chunk === "string") {
        chunkIndex = point2._index;
        if (point2._bufferIndex < 0) {
          point2._bufferIndex = 0;
        }
        while (point2._index === chunkIndex && point2._bufferIndex < chunk.length) {
          go(chunk.charCodeAt(point2._bufferIndex));
        }
      } else {
        go(chunk);
      }
    }
  }
  function go(code) {
    ok(consumed === true, "expected character to be consumed");
    consumed = undefined;
    debug("main: passing `%s` to %s", code, state && state.name);
    expectedCode = code;
    ok(typeof state === "function", "expected state");
    state = state(code);
  }
  function consume(code) {
    ok(code === expectedCode, "expected given code to equal expected code");
    debug("consume: `%s`", code);
    ok(consumed === undefined, "expected code to not have been consumed: this might be because `return x(code)` instead of `return x` was used");
    ok(code === null ? context.events.length === 0 || context.events[context.events.length - 1][0] === "exit" : context.events[context.events.length - 1][0] === "enter", "expected last token to be open");
    if (markdownLineEnding(code)) {
      point2.line++;
      point2.column = 1;
      point2.offset += code === codes.carriageReturnLineFeed ? 2 : 1;
      accountForPotentialSkip();
      debug("position: after eol: `%j`", point2);
    } else if (code !== codes.virtualSpace) {
      point2.column++;
      point2.offset++;
    }
    if (point2._bufferIndex < 0) {
      point2._index++;
    } else {
      point2._bufferIndex++;
      if (point2._bufferIndex === chunks[point2._index].length) {
        point2._bufferIndex = -1;
        point2._index++;
      }
    }
    context.previous = code;
    consumed = true;
  }
  function enter(type2, fields) {
    const token = fields || {};
    token.type = type2;
    token.start = now();
    ok(typeof type2 === "string", "expected string type");
    ok(type2.length > 0, "expected non-empty string");
    debug("enter: `%s`", type2);
    context.events.push(["enter", token, context]);
    stack.push(token);
    return token;
  }
  function exit2(type2) {
    ok(typeof type2 === "string", "expected string type");
    ok(type2.length > 0, "expected non-empty string");
    const token = stack.pop();
    ok(token, "cannot close w/o open tokens");
    token.end = now();
    ok(type2 === token.type, "expected exit token to match current token");
    ok(!(token.start._index === token.end._index && token.start._bufferIndex === token.end._bufferIndex), "expected non-empty token (`" + type2 + "`)");
    debug("exit: `%s`", token.type);
    context.events.push(["exit", token, context]);
    return token;
  }
  function onsuccessfulconstruct(construct, info) {
    addResult(construct, info.from);
  }
  function onsuccessfulcheck(_2, info) {
    info.restore();
  }
  function constructFactory(onreturn, fields) {
    return hook;
    function hook(constructs2, returnState, bogusState) {
      let listOfConstructs;
      let constructIndex;
      let currentConstruct;
      let info;
      return Array.isArray(constructs2) ? handleListOfConstructs(constructs2) : ("tokenize" in constructs2) ? handleListOfConstructs([constructs2]) : handleMapOfConstructs(constructs2);
      function handleMapOfConstructs(map2) {
        return start;
        function start(code) {
          const left = code !== null && map2[code];
          const all2 = code !== null && map2.null;
          const list2 = [
            ...Array.isArray(left) ? left : left ? [left] : [],
            ...Array.isArray(all2) ? all2 : all2 ? [all2] : []
          ];
          return handleListOfConstructs(list2)(code);
        }
      }
      function handleListOfConstructs(list2) {
        listOfConstructs = list2;
        constructIndex = 0;
        if (list2.length === 0) {
          ok(bogusState, "expected `bogusState` to be given");
          return bogusState;
        }
        return handleConstruct(list2[constructIndex]);
      }
      function handleConstruct(construct) {
        return start;
        function start(code) {
          info = store();
          currentConstruct = construct;
          if (!construct.partial) {
            context.currentConstruct = construct;
          }
          ok(context.parser.constructs.disable.null, "expected `disable.null` to be populated");
          if (construct.name && context.parser.constructs.disable.null.includes(construct.name)) {
            return nok(code);
          }
          return construct.tokenize.call(fields ? Object.assign(Object.create(context), fields) : context, effects, ok2, nok)(code);
        }
      }
      function ok2(code) {
        ok(code === expectedCode, "expected code");
        consumed = true;
        onreturn(currentConstruct, info);
        return returnState;
      }
      function nok(code) {
        ok(code === expectedCode, "expected code");
        consumed = true;
        info.restore();
        if (++constructIndex < listOfConstructs.length) {
          return handleConstruct(listOfConstructs[constructIndex]);
        }
        return bogusState;
      }
    }
  }
  function addResult(construct, from2) {
    if (construct.resolveAll && !resolveAllConstructs.includes(construct)) {
      resolveAllConstructs.push(construct);
    }
    if (construct.resolve) {
      splice(context.events, from2, context.events.length - from2, construct.resolve(context.events.slice(from2), context));
    }
    if (construct.resolveTo) {
      context.events = construct.resolveTo(context.events, context);
    }
    ok(construct.partial || context.events.length === 0 || context.events[context.events.length - 1][0] === "exit", "expected last token to end");
  }
  function store() {
    const startPoint = now();
    const startPrevious = context.previous;
    const startCurrentConstruct = context.currentConstruct;
    const startEventsIndex = context.events.length;
    const startStack = Array.from(stack);
    return { from: startEventsIndex, restore };
    function restore() {
      point2 = startPoint;
      context.previous = startPrevious;
      context.currentConstruct = startCurrentConstruct;
      context.events.length = startEventsIndex;
      stack = startStack;
      accountForPotentialSkip();
      debug("position: restore: `%j`", point2);
    }
  }
  function accountForPotentialSkip() {
    if (point2.line in columnStart && point2.column < 2) {
      point2.column = columnStart[point2.line];
      point2.offset += columnStart[point2.line] - 1;
    }
  }
}
function sliceChunks(chunks, token) {
  const startIndex = token.start._index;
  const startBufferIndex = token.start._bufferIndex;
  const endIndex = token.end._index;
  const endBufferIndex = token.end._bufferIndex;
  let view;
  if (startIndex === endIndex) {
    ok(endBufferIndex > -1, "expected non-negative end buffer index");
    ok(startBufferIndex > -1, "expected non-negative start buffer index");
    view = [chunks[startIndex].slice(startBufferIndex, endBufferIndex)];
  } else {
    view = chunks.slice(startIndex, endIndex);
    if (startBufferIndex > -1) {
      const head = view[0];
      if (typeof head === "string") {
        view[0] = head.slice(startBufferIndex);
      } else {
        ok(startBufferIndex === 0, "expected `startBufferIndex` to be `0`");
        view.shift();
      }
    }
    if (endBufferIndex > 0) {
      view.push(chunks[endIndex].slice(0, endBufferIndex));
    }
  }
  return view;
}
function serializeChunks(chunks, expandTabs) {
  let index2 = -1;
  const result = [];
  let atTab;
  while (++index2 < chunks.length) {
    const chunk = chunks[index2];
    let value;
    if (typeof chunk === "string") {
      value = chunk;
    } else
      switch (chunk) {
        case codes.carriageReturn: {
          value = values.cr;
          break;
        }
        case codes.lineFeed: {
          value = values.lf;
          break;
        }
        case codes.carriageReturnLineFeed: {
          value = values.cr + values.lf;
          break;
        }
        case codes.horizontalTab: {
          value = expandTabs ? values.space : values.ht;
          break;
        }
        case codes.virtualSpace: {
          if (!expandTabs && atTab)
            continue;
          value = values.space;
          break;
        }
        default: {
          ok(typeof chunk === "number", "expected number");
          value = String.fromCharCode(chunk);
        }
      }
    atTab = chunk === codes.horizontalTab;
    result.push(value);
  }
  return result.join("");
}
var import_debug, debug;
var init_create_tokenizer = __esm(() => {
  import_debug = __toESM(require_browser(), 1);
  init_development();
  init_dev4();
  init_dev();
  init_default();
  debug = import_debug.default("micromark");
});

// node_modules/micromark/dev/lib/parse.js
function parse2(options) {
  const settings = options || {};
  const constructs2 = combineExtensions([exports_constructs, ...settings.extensions || []]);
  const parser = {
    constructs: constructs2,
    content: create(content),
    defined: [],
    document: create(document2),
    flow: create(flow),
    lazy: {},
    string: create(string),
    text: create(text)
  };
  return parser;
  function create(initial) {
    return creator;
    function creator(from) {
      return createTokenizer(parser, initial, from);
    }
  }
}
var init_parse = __esm(() => {
  init_micromark_util_combine_extensions();
  init_content();
  init_document();
  init_flow();
  init_text();
  init_constructs();
  init_create_tokenizer();
});

// node_modules/micromark/dev/lib/postprocess.js
function postprocess(events) {
  while (!subtokenize(events)) {}
  return events;
}
var init_postprocess = __esm(() => {
  init_dev8();
});

// node_modules/micromark/dev/lib/preprocess.js
function preprocess() {
  let column = 1;
  let buffer = "";
  let start = true;
  let atCarriageReturn;
  return preprocessor;
  function preprocessor(value, encoding, end) {
    const chunks = [];
    let match;
    let next;
    let startPosition;
    let endPosition;
    let code;
    value = buffer + (typeof value === "string" ? value.toString() : new TextDecoder(encoding || undefined).decode(value));
    startPosition = 0;
    buffer = "";
    if (start) {
      if (value.charCodeAt(0) === codes.byteOrderMarker) {
        startPosition++;
      }
      start = undefined;
    }
    while (startPosition < value.length) {
      search.lastIndex = startPosition;
      match = search.exec(value);
      endPosition = match && match.index !== undefined ? match.index : value.length;
      code = value.charCodeAt(endPosition);
      if (!match) {
        buffer = value.slice(startPosition);
        break;
      }
      if (code === codes.lf && startPosition === endPosition && atCarriageReturn) {
        chunks.push(codes.carriageReturnLineFeed);
        atCarriageReturn = undefined;
      } else {
        if (atCarriageReturn) {
          chunks.push(codes.carriageReturn);
          atCarriageReturn = undefined;
        }
        if (startPosition < endPosition) {
          chunks.push(value.slice(startPosition, endPosition));
          column += endPosition - startPosition;
        }
        switch (code) {
          case codes.nul: {
            chunks.push(codes.replacementCharacter);
            column++;
            break;
          }
          case codes.ht: {
            next = Math.ceil(column / constants.tabSize) * constants.tabSize;
            chunks.push(codes.horizontalTab);
            while (column++ < next)
              chunks.push(codes.virtualSpace);
            break;
          }
          case codes.lf: {
            chunks.push(codes.lineFeed);
            column = 1;
            break;
          }
          default: {
            atCarriageReturn = true;
            column = 1;
          }
        }
      }
      startPosition = endPosition + 1;
    }
    if (end) {
      if (atCarriageReturn)
        chunks.push(codes.carriageReturn);
      if (buffer)
        chunks.push(buffer);
      chunks.push(codes.eof);
    }
    return chunks;
  }
}
var search;
var init_preprocess = __esm(() => {
  init_default();
  search = /[\0\t\n\r]/g;
});

// node_modules/micromark/dev/index.js
var init_dev14 = __esm(() => {
  init_parse();
  init_postprocess();
  init_preprocess();
});

// node_modules/micromark-util-decode-string/dev/index.js
function decodeString(value) {
  return value.replace(characterEscapeOrReference, decode);
}
function decode($0, $1, $2) {
  if ($1) {
    return $1;
  }
  const head = $2.charCodeAt(0);
  if (head === codes.numberSign) {
    const head2 = $2.charCodeAt(1);
    const hex = head2 === codes.lowercaseX || head2 === codes.uppercaseX;
    return decodeNumericCharacterReference($2.slice(hex ? 2 : 1), hex ? constants.numericBaseHexadecimal : constants.numericBaseDecimal);
  }
  return decodeNamedCharacterReference($2) || $0;
}
var characterEscapeOrReference;
var init_dev15 = __esm(() => {
  init_index_dom();
  init_dev2();
  init_default();
  characterEscapeOrReference = /\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;
});

// node_modules/mdast-util-from-markdown/dev/lib/index.js
function fromMarkdown(value, encoding, options) {
  if (typeof encoding !== "string") {
    options = encoding;
    encoding = undefined;
  }
  return compiler(options)(postprocess(parse2(options).document().write(preprocess()(value, encoding, true))));
}
function compiler(options) {
  const config = {
    transforms: [],
    canContainEols: ["emphasis", "fragment", "heading", "paragraph", "strong"],
    enter: {
      autolink: opener(link),
      autolinkProtocol: onenterdata,
      autolinkEmail: onenterdata,
      atxHeading: opener(heading),
      blockQuote: opener(blockQuote2),
      characterEscape: onenterdata,
      characterReference: onenterdata,
      codeFenced: opener(codeFlow),
      codeFencedFenceInfo: buffer,
      codeFencedFenceMeta: buffer,
      codeIndented: opener(codeFlow, buffer),
      codeText: opener(codeText2, buffer),
      codeTextData: onenterdata,
      data: onenterdata,
      codeFlowValue: onenterdata,
      definition: opener(definition2),
      definitionDestinationString: buffer,
      definitionLabelString: buffer,
      definitionTitleString: buffer,
      emphasis: opener(emphasis),
      hardBreakEscape: opener(hardBreak),
      hardBreakTrailing: opener(hardBreak),
      htmlFlow: opener(html, buffer),
      htmlFlowData: onenterdata,
      htmlText: opener(html, buffer),
      htmlTextData: onenterdata,
      image: opener(image),
      label: buffer,
      link: opener(link),
      listItem: opener(listItem),
      listItemValue: onenterlistitemvalue,
      listOrdered: opener(list2, onenterlistordered),
      listUnordered: opener(list2),
      paragraph: opener(paragraph),
      reference: onenterreference,
      referenceString: buffer,
      resourceDestinationString: buffer,
      resourceTitleString: buffer,
      setextHeading: opener(heading),
      strong: opener(strong),
      thematicBreak: opener(thematicBreak2)
    },
    exit: {
      atxHeading: closer(),
      atxHeadingSequence: onexitatxheadingsequence,
      autolink: closer(),
      autolinkEmail: onexitautolinkemail,
      autolinkProtocol: onexitautolinkprotocol,
      blockQuote: closer(),
      characterEscapeValue: onexitdata,
      characterReferenceMarkerHexadecimal: onexitcharacterreferencemarker,
      characterReferenceMarkerNumeric: onexitcharacterreferencemarker,
      characterReferenceValue: onexitcharacterreferencevalue,
      characterReference: onexitcharacterreference,
      codeFenced: closer(onexitcodefenced),
      codeFencedFence: onexitcodefencedfence,
      codeFencedFenceInfo: onexitcodefencedfenceinfo,
      codeFencedFenceMeta: onexitcodefencedfencemeta,
      codeFlowValue: onexitdata,
      codeIndented: closer(onexitcodeindented),
      codeText: closer(onexitcodetext),
      codeTextData: onexitdata,
      data: onexitdata,
      definition: closer(),
      definitionDestinationString: onexitdefinitiondestinationstring,
      definitionLabelString: onexitdefinitionlabelstring,
      definitionTitleString: onexitdefinitiontitlestring,
      emphasis: closer(),
      hardBreakEscape: closer(onexithardbreak),
      hardBreakTrailing: closer(onexithardbreak),
      htmlFlow: closer(onexithtmlflow),
      htmlFlowData: onexitdata,
      htmlText: closer(onexithtmltext),
      htmlTextData: onexitdata,
      image: closer(onexitimage),
      label: onexitlabel,
      labelText: onexitlabeltext,
      lineEnding: onexitlineending,
      link: closer(onexitlink),
      listItem: closer(),
      listOrdered: closer(),
      listUnordered: closer(),
      paragraph: closer(),
      referenceString: onexitreferencestring,
      resourceDestinationString: onexitresourcedestinationstring,
      resourceTitleString: onexitresourcetitlestring,
      resource: onexitresource,
      setextHeading: closer(onexitsetextheading),
      setextHeadingLineSequence: onexitsetextheadinglinesequence,
      setextHeadingText: onexitsetextheadingtext,
      strong: closer(),
      thematicBreak: closer()
    }
  };
  configure(config, (options || {}).mdastExtensions || []);
  const data = {};
  return compile;
  function compile(events) {
    let tree = { type: "root", children: [] };
    const context = {
      stack: [tree],
      tokenStack: [],
      config,
      enter,
      exit: exit2,
      buffer,
      resume,
      data
    };
    const listStack = [];
    let index2 = -1;
    while (++index2 < events.length) {
      if (events[index2][1].type === types2.listOrdered || events[index2][1].type === types2.listUnordered) {
        if (events[index2][0] === "enter") {
          listStack.push(index2);
        } else {
          const tail = listStack.pop();
          ok(typeof tail === "number", "expected list ot be open");
          index2 = prepareList(events, tail, index2);
        }
      }
    }
    index2 = -1;
    while (++index2 < events.length) {
      const handler = config[events[index2][0]];
      if (own2.call(handler, events[index2][1].type)) {
        handler[events[index2][1].type].call(Object.assign({ sliceSerialize: events[index2][2].sliceSerialize }, context), events[index2][1]);
      }
    }
    if (context.tokenStack.length > 0) {
      const tail = context.tokenStack[context.tokenStack.length - 1];
      const handler = tail[1] || defaultOnError;
      handler.call(context, undefined, tail[0]);
    }
    tree.position = {
      start: point2(events.length > 0 ? events[0][1].start : { line: 1, column: 1, offset: 0 }),
      end: point2(events.length > 0 ? events[events.length - 2][1].end : { line: 1, column: 1, offset: 0 })
    };
    index2 = -1;
    while (++index2 < config.transforms.length) {
      tree = config.transforms[index2](tree) || tree;
    }
    return tree;
  }
  function prepareList(events, start, length) {
    let index2 = start - 1;
    let containerBalance = -1;
    let listSpread = false;
    let listItem2;
    let lineIndex;
    let firstBlankLineIndex;
    let atMarker;
    while (++index2 <= length) {
      const event = events[index2];
      switch (event[1].type) {
        case types2.listUnordered:
        case types2.listOrdered:
        case types2.blockQuote: {
          if (event[0] === "enter") {
            containerBalance++;
          } else {
            containerBalance--;
          }
          atMarker = undefined;
          break;
        }
        case types2.lineEndingBlank: {
          if (event[0] === "enter") {
            if (listItem2 && !atMarker && !containerBalance && !firstBlankLineIndex) {
              firstBlankLineIndex = index2;
            }
            atMarker = undefined;
          }
          break;
        }
        case types2.linePrefix:
        case types2.listItemValue:
        case types2.listItemMarker:
        case types2.listItemPrefix:
        case types2.listItemPrefixWhitespace: {
          break;
        }
        default: {
          atMarker = undefined;
        }
      }
      if (!containerBalance && event[0] === "enter" && event[1].type === types2.listItemPrefix || containerBalance === -1 && event[0] === "exit" && (event[1].type === types2.listUnordered || event[1].type === types2.listOrdered)) {
        if (listItem2) {
          let tailIndex = index2;
          lineIndex = undefined;
          while (tailIndex--) {
            const tailEvent = events[tailIndex];
            if (tailEvent[1].type === types2.lineEnding || tailEvent[1].type === types2.lineEndingBlank) {
              if (tailEvent[0] === "exit")
                continue;
              if (lineIndex) {
                events[lineIndex][1].type = types2.lineEndingBlank;
                listSpread = true;
              }
              tailEvent[1].type = types2.lineEnding;
              lineIndex = tailIndex;
            } else if (tailEvent[1].type === types2.linePrefix || tailEvent[1].type === types2.blockQuotePrefix || tailEvent[1].type === types2.blockQuotePrefixWhitespace || tailEvent[1].type === types2.blockQuoteMarker || tailEvent[1].type === types2.listItemIndent) {} else {
              break;
            }
          }
          if (firstBlankLineIndex && (!lineIndex || firstBlankLineIndex < lineIndex)) {
            listItem2._spread = true;
          }
          listItem2.end = Object.assign({}, lineIndex ? events[lineIndex][1].start : event[1].end);
          events.splice(lineIndex || index2, 0, ["exit", listItem2, event[2]]);
          index2++;
          length++;
        }
        if (event[1].type === types2.listItemPrefix) {
          const item = {
            type: "listItem",
            _spread: false,
            start: Object.assign({}, event[1].start),
            end: undefined
          };
          listItem2 = item;
          events.splice(index2, 0, ["enter", item, event[2]]);
          index2++;
          length++;
          firstBlankLineIndex = undefined;
          atMarker = true;
        }
      }
    }
    events[start][1]._spread = listSpread;
    return length;
  }
  function opener(create, and) {
    return open;
    function open(token) {
      enter.call(this, create(token), token);
      if (and)
        and.call(this, token);
    }
  }
  function buffer() {
    this.stack.push({ type: "fragment", children: [] });
  }
  function enter(node2, token, errorHandler) {
    const parent = this.stack[this.stack.length - 1];
    ok(parent, "expected `parent`");
    ok("children" in parent, "expected `parent`");
    const siblings = parent.children;
    siblings.push(node2);
    this.stack.push(node2);
    this.tokenStack.push([token, errorHandler || undefined]);
    node2.position = {
      start: point2(token.start),
      end: undefined
    };
  }
  function closer(and) {
    return close;
    function close(token) {
      if (and)
        and.call(this, token);
      exit2.call(this, token);
    }
  }
  function exit2(token, onExitError) {
    const node2 = this.stack.pop();
    ok(node2, "expected `node`");
    const open = this.tokenStack.pop();
    if (!open) {
      throw new Error("Cannot close `" + token.type + "` (" + stringifyPosition({ start: token.start, end: token.end }) + "): it’s not open");
    } else if (open[0].type !== token.type) {
      if (onExitError) {
        onExitError.call(this, token, open[0]);
      } else {
        const handler = open[1] || defaultOnError;
        handler.call(this, token, open[0]);
      }
    }
    ok(node2.type !== "fragment", "unexpected fragment `exit`ed");
    ok(node2.position, "expected `position` to be defined");
    node2.position.end = point2(token.end);
  }
  function resume() {
    return toString2(this.stack.pop());
  }
  function onenterlistordered() {
    this.data.expectingFirstListItemValue = true;
  }
  function onenterlistitemvalue(token) {
    if (this.data.expectingFirstListItemValue) {
      const ancestor = this.stack[this.stack.length - 2];
      ok(ancestor, "expected nodes on stack");
      ok(ancestor.type === "list", "expected list on stack");
      ancestor.start = Number.parseInt(this.sliceSerialize(token), constants.numericBaseDecimal);
      this.data.expectingFirstListItemValue = undefined;
    }
  }
  function onexitcodefencedfenceinfo() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "code", "expected code on stack");
    node2.lang = data2;
  }
  function onexitcodefencedfencemeta() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "code", "expected code on stack");
    node2.meta = data2;
  }
  function onexitcodefencedfence() {
    if (this.data.flowCodeInside)
      return;
    this.buffer();
    this.data.flowCodeInside = true;
  }
  function onexitcodefenced() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "code", "expected code on stack");
    node2.value = data2.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, "");
    this.data.flowCodeInside = undefined;
  }
  function onexitcodeindented() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "code", "expected code on stack");
    node2.value = data2.replace(/(\r?\n|\r)$/g, "");
  }
  function onexitdefinitionlabelstring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "definition", "expected definition on stack");
    node2.label = label;
    node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
  }
  function onexitdefinitiontitlestring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "definition", "expected definition on stack");
    node2.title = data2;
  }
  function onexitdefinitiondestinationstring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "definition", "expected definition on stack");
    node2.url = data2;
  }
  function onexitatxheadingsequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "heading", "expected heading on stack");
    if (!node2.depth) {
      const depth = this.sliceSerialize(token).length;
      ok(depth === 1 || depth === 2 || depth === 3 || depth === 4 || depth === 5 || depth === 6, "expected `depth` between `1` and `6`");
      node2.depth = depth;
    }
  }
  function onexitsetextheadingtext() {
    this.data.setextHeadingSlurpLineEnding = true;
  }
  function onexitsetextheadinglinesequence(token) {
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "heading", "expected heading on stack");
    node2.depth = this.sliceSerialize(token).codePointAt(0) === codes.equalsTo ? 1 : 2;
  }
  function onexitsetextheading() {
    this.data.setextHeadingSlurpLineEnding = undefined;
  }
  function onenterdata(token) {
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok("children" in node2, "expected parent on stack");
    const siblings = node2.children;
    let tail = siblings[siblings.length - 1];
    if (!tail || tail.type !== "text") {
      tail = text3();
      tail.position = {
        start: point2(token.start),
        end: undefined
      };
      siblings.push(tail);
    }
    this.stack.push(tail);
  }
  function onexitdata(token) {
    const tail = this.stack.pop();
    ok(tail, "expected a `node` to be on the stack");
    ok("value" in tail, "expected a `literal` to be on the stack");
    ok(tail.position, "expected `node` to have an open position");
    tail.value += this.sliceSerialize(token);
    tail.position.end = point2(token.end);
  }
  function onexitlineending(token) {
    const context = this.stack[this.stack.length - 1];
    ok(context, "expected `node`");
    if (this.data.atHardBreak) {
      ok("children" in context, "expected `parent`");
      const tail = context.children[context.children.length - 1];
      ok(tail.position, "expected tail to have a starting position");
      tail.position.end = point2(token.end);
      this.data.atHardBreak = undefined;
      return;
    }
    if (!this.data.setextHeadingSlurpLineEnding && config.canContainEols.includes(context.type)) {
      onenterdata.call(this, token);
      onexitdata.call(this, token);
    }
  }
  function onexithardbreak() {
    this.data.atHardBreak = true;
  }
  function onexithtmlflow() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "html", "expected html on stack");
    node2.value = data2;
  }
  function onexithtmltext() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "html", "expected html on stack");
    node2.value = data2;
  }
  function onexitcodetext() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "inlineCode", "expected inline code on stack");
    node2.value = data2;
  }
  function onexitlink() {
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "link", "expected link on stack");
    if (this.data.inReference) {
      const referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    this.data.referenceType = undefined;
  }
  function onexitimage() {
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "image", "expected image on stack");
    if (this.data.inReference) {
      const referenceType = this.data.referenceType || "shortcut";
      node2.type += "Reference";
      node2.referenceType = referenceType;
      delete node2.url;
      delete node2.title;
    } else {
      delete node2.identifier;
      delete node2.label;
    }
    this.data.referenceType = undefined;
  }
  function onexitlabeltext(token) {
    const string3 = this.sliceSerialize(token);
    const ancestor = this.stack[this.stack.length - 2];
    ok(ancestor, "expected ancestor on stack");
    ok(ancestor.type === "image" || ancestor.type === "link", "expected image or link on stack");
    ancestor.label = decodeString(string3);
    ancestor.identifier = normalizeIdentifier(string3).toLowerCase();
  }
  function onexitlabel() {
    const fragment = this.stack[this.stack.length - 1];
    ok(fragment, "expected node on stack");
    ok(fragment.type === "fragment", "expected fragment on stack");
    const value = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "image" || node2.type === "link", "expected image or link on stack");
    this.data.inReference = true;
    if (node2.type === "link") {
      const children = fragment.children;
      node2.children = children;
    } else {
      node2.alt = value;
    }
  }
  function onexitresourcedestinationstring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "image" || node2.type === "link", "expected image or link on stack");
    node2.url = data2;
  }
  function onexitresourcetitlestring() {
    const data2 = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "image" || node2.type === "link", "expected image or link on stack");
    node2.title = data2;
  }
  function onexitresource() {
    this.data.inReference = undefined;
  }
  function onenterreference() {
    this.data.referenceType = "collapsed";
  }
  function onexitreferencestring(token) {
    const label = this.resume();
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "image" || node2.type === "link", "expected image reference or link reference on stack");
    node2.label = label;
    node2.identifier = normalizeIdentifier(this.sliceSerialize(token)).toLowerCase();
    this.data.referenceType = "full";
  }
  function onexitcharacterreferencemarker(token) {
    ok(token.type === "characterReferenceMarkerNumeric" || token.type === "characterReferenceMarkerHexadecimal");
    this.data.characterReferenceType = token.type;
  }
  function onexitcharacterreferencevalue(token) {
    const data2 = this.sliceSerialize(token);
    const type2 = this.data.characterReferenceType;
    let value;
    if (type2) {
      value = decodeNumericCharacterReference(data2, type2 === types2.characterReferenceMarkerNumeric ? constants.numericBaseDecimal : constants.numericBaseHexadecimal);
      this.data.characterReferenceType = undefined;
    } else {
      const result = decodeNamedCharacterReference(data2);
      ok(result !== false, "expected reference to decode");
      value = result;
    }
    const tail = this.stack[this.stack.length - 1];
    ok(tail, "expected `node`");
    ok("value" in tail, "expected `node.value`");
    tail.value += value;
  }
  function onexitcharacterreference(token) {
    const tail = this.stack.pop();
    ok(tail, "expected `node`");
    ok(tail.position, "expected `node.position`");
    tail.position.end = point2(token.end);
  }
  function onexitautolinkprotocol(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "link", "expected link on stack");
    node2.url = this.sliceSerialize(token);
  }
  function onexitautolinkemail(token) {
    onexitdata.call(this, token);
    const node2 = this.stack[this.stack.length - 1];
    ok(node2, "expected node on stack");
    ok(node2.type === "link", "expected link on stack");
    node2.url = "mailto:" + this.sliceSerialize(token);
  }
  function blockQuote2() {
    return { type: "blockquote", children: [] };
  }
  function codeFlow() {
    return { type: "code", lang: null, meta: null, value: "" };
  }
  function codeText2() {
    return { type: "inlineCode", value: "" };
  }
  function definition2() {
    return {
      type: "definition",
      identifier: "",
      label: null,
      title: null,
      url: ""
    };
  }
  function emphasis() {
    return { type: "emphasis", children: [] };
  }
  function heading() {
    return {
      type: "heading",
      depth: 0,
      children: []
    };
  }
  function hardBreak() {
    return { type: "break" };
  }
  function html() {
    return { type: "html", value: "" };
  }
  function image() {
    return { type: "image", title: null, url: "", alt: null };
  }
  function link() {
    return { type: "link", title: null, url: "", children: [] };
  }
  function list2(token) {
    return {
      type: "list",
      ordered: token.type === "listOrdered",
      start: null,
      spread: token._spread,
      children: []
    };
  }
  function listItem(token) {
    return {
      type: "listItem",
      spread: token._spread,
      checked: null,
      children: []
    };
  }
  function paragraph() {
    return { type: "paragraph", children: [] };
  }
  function strong() {
    return { type: "strong", children: [] };
  }
  function text3() {
    return { type: "text", value: "" };
  }
  function thematicBreak2() {
    return { type: "thematicBreak" };
  }
}
function point2(d) {
  return { line: d.line, column: d.column, offset: d.offset };
}
function configure(combined, extensions) {
  let index2 = -1;
  while (++index2 < extensions.length) {
    const value = extensions[index2];
    if (Array.isArray(value)) {
      configure(combined, value);
    } else {
      extension(combined, value);
    }
  }
}
function extension(combined, extension2) {
  let key;
  for (key in extension2) {
    if (own2.call(extension2, key)) {
      switch (key) {
        case "canContainEols": {
          const right = extension2[key];
          if (right) {
            combined[key].push(...right);
          }
          break;
        }
        case "transforms": {
          const right = extension2[key];
          if (right) {
            combined[key].push(...right);
          }
          break;
        }
        case "enter":
        case "exit": {
          const right = extension2[key];
          if (right) {
            Object.assign(combined[key], right);
          }
          break;
        }
      }
    }
  }
}
function defaultOnError(left, right) {
  if (left) {
    throw new Error("Cannot close `" + left.type + "` (" + stringifyPosition({ start: left.start, end: left.end }) + "): a different token (`" + right.type + "`, " + stringifyPosition({ start: right.start, end: right.end }) + ") is open");
  } else {
    throw new Error("Cannot close document, a token (`" + right.type + "`, " + stringifyPosition({ start: right.start, end: right.end }) + ") is still open");
  }
}
var own2;
var init_lib5 = __esm(() => {
  init_development();
  init_mdast_util_to_string();
  init_dev14();
  init_dev2();
  init_dev15();
  init_dev3();
  init_default();
  init_index_dom();
  init_unist_util_stringify_position();
  own2 = {}.hasOwnProperty;
});

// node_modules/mdast-util-from-markdown/dev/index.js
var init_dev16 = __esm(() => {
  init_lib5();
});

// node_modules/remark-parse/lib/index.js
function remarkParse(options) {
  const self2 = this;
  self2.parser = parser;
  function parser(doc) {
    return fromMarkdown(doc, {
      ...self2.data("settings"),
      ...options,
      extensions: self2.data("micromarkExtensions") || [],
      mdastExtensions: self2.data("fromMarkdownExtensions") || []
    });
  }
}
var init_lib6 = __esm(() => {
  init_dev16();
});

// node_modules/remark-parse/index.js
var init_remark_parse = __esm(() => {
  init_lib6();
});

// node_modules/mdast-util-to-hast/lib/handlers/blockquote.js
function blockquote(state, node2) {
  const result = {
    type: "element",
    tagName: "blockquote",
    properties: {},
    children: state.wrap(state.all(node2), true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_blockquote = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/break.js
function hardBreak(state, node2) {
  const result = { type: "element", tagName: "br", properties: {}, children: [] };
  state.patch(node2, result);
  return [state.applyData(node2, result), { type: "text", value: `
` }];
}
var init_break = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/code.js
function code(state, node2) {
  const value = node2.value ? node2.value + `
` : "";
  const properties = {};
  if (node2.lang) {
    properties.className = ["language-" + node2.lang];
  }
  let result = {
    type: "element",
    tagName: "code",
    properties,
    children: [{ type: "text", value }]
  };
  if (node2.meta) {
    result.data = { meta: node2.meta };
  }
  state.patch(node2, result);
  result = state.applyData(node2, result);
  result = { type: "element", tagName: "pre", properties: {}, children: [result] };
  state.patch(node2, result);
  return result;
}
var init_code = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/delete.js
function strikethrough(state, node2) {
  const result = {
    type: "element",
    tagName: "del",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_delete = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/emphasis.js
function emphasis(state, node2) {
  const result = {
    type: "element",
    tagName: "em",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_emphasis = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/footnote-reference.js
function footnoteReference(state, node2) {
  const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
  const id = String(node2.identifier).toUpperCase();
  const safeId = normalizeUri(id.toLowerCase());
  const index2 = state.footnoteOrder.indexOf(id);
  let counter;
  let reuseCounter = state.footnoteCounts.get(id);
  if (reuseCounter === undefined) {
    reuseCounter = 0;
    state.footnoteOrder.push(id);
    counter = state.footnoteOrder.length;
  } else {
    counter = index2 + 1;
  }
  reuseCounter += 1;
  state.footnoteCounts.set(id, reuseCounter);
  const link = {
    type: "element",
    tagName: "a",
    properties: {
      href: "#" + clobberPrefix + "fn-" + safeId,
      id: clobberPrefix + "fnref-" + safeId + (reuseCounter > 1 ? "-" + reuseCounter : ""),
      dataFootnoteRef: true,
      ariaDescribedBy: ["footnote-label"]
    },
    children: [{ type: "text", value: String(counter) }]
  };
  state.patch(node2, link);
  const sup = {
    type: "element",
    tagName: "sup",
    properties: {},
    children: [link]
  };
  state.patch(node2, sup);
  return state.applyData(node2, sup);
}
var init_footnote_reference = __esm(() => {
  init_dev5();
});

// node_modules/mdast-util-to-hast/lib/handlers/heading.js
function heading(state, node2) {
  const result = {
    type: "element",
    tagName: "h" + node2.depth,
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_heading = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/html.js
function html(state, node2) {
  if (state.options.allowDangerousHtml) {
    const result = { type: "raw", value: node2.value };
    state.patch(node2, result);
    return state.applyData(node2, result);
  }
  return;
}
var init_html = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/revert.js
function revert(state, node2) {
  const subtype = node2.referenceType;
  let suffix = "]";
  if (subtype === "collapsed") {
    suffix += "[]";
  } else if (subtype === "full") {
    suffix += "[" + (node2.label || node2.identifier) + "]";
  }
  if (node2.type === "imageReference") {
    return [{ type: "text", value: "![" + node2.alt + suffix }];
  }
  const contents = state.all(node2);
  const head = contents[0];
  if (head && head.type === "text") {
    head.value = "[" + head.value;
  } else {
    contents.unshift({ type: "text", value: "[" });
  }
  const tail = contents[contents.length - 1];
  if (tail && tail.type === "text") {
    tail.value += suffix;
  } else {
    contents.push({ type: "text", value: suffix });
  }
  return contents;
}
var init_revert = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/image-reference.js
function imageReference(state, node2) {
  const id = String(node2.identifier).toUpperCase();
  const definition2 = state.definitionById.get(id);
  if (!definition2) {
    return revert(state, node2);
  }
  const properties = { src: normalizeUri(definition2.url || ""), alt: node2.alt };
  if (definition2.title !== null && definition2.title !== undefined) {
    properties.title = definition2.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_image_reference = __esm(() => {
  init_dev5();
  init_revert();
});

// node_modules/mdast-util-to-hast/lib/handlers/image.js
function image(state, node2) {
  const properties = { src: normalizeUri(node2.url) };
  if (node2.alt !== null && node2.alt !== undefined) {
    properties.alt = node2.alt;
  }
  if (node2.title !== null && node2.title !== undefined) {
    properties.title = node2.title;
  }
  const result = { type: "element", tagName: "img", properties, children: [] };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_image = __esm(() => {
  init_dev5();
});

// node_modules/mdast-util-to-hast/lib/handlers/inline-code.js
function inlineCode(state, node2) {
  const text3 = { type: "text", value: node2.value.replace(/\r?\n|\r/g, " ") };
  state.patch(node2, text3);
  const result = {
    type: "element",
    tagName: "code",
    properties: {},
    children: [text3]
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_inline_code = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/link-reference.js
function linkReference(state, node2) {
  const id = String(node2.identifier).toUpperCase();
  const definition2 = state.definitionById.get(id);
  if (!definition2) {
    return revert(state, node2);
  }
  const properties = { href: normalizeUri(definition2.url || "") };
  if (definition2.title !== null && definition2.title !== undefined) {
    properties.title = definition2.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_link_reference = __esm(() => {
  init_dev5();
  init_revert();
});

// node_modules/mdast-util-to-hast/lib/handlers/link.js
function link(state, node2) {
  const properties = { href: normalizeUri(node2.url) };
  if (node2.title !== null && node2.title !== undefined) {
    properties.title = node2.title;
  }
  const result = {
    type: "element",
    tagName: "a",
    properties,
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_link = __esm(() => {
  init_dev5();
});

// node_modules/mdast-util-to-hast/lib/handlers/list-item.js
function listItem(state, node2, parent) {
  const results = state.all(node2);
  const loose = parent ? listLoose(parent) : listItemLoose(node2);
  const properties = {};
  const children = [];
  if (typeof node2.checked === "boolean") {
    const head = results[0];
    let paragraph;
    if (head && head.type === "element" && head.tagName === "p") {
      paragraph = head;
    } else {
      paragraph = { type: "element", tagName: "p", properties: {}, children: [] };
      results.unshift(paragraph);
    }
    if (paragraph.children.length > 0) {
      paragraph.children.unshift({ type: "text", value: " " });
    }
    paragraph.children.unshift({
      type: "element",
      tagName: "input",
      properties: { type: "checkbox", checked: node2.checked, disabled: true },
      children: []
    });
    properties.className = ["task-list-item"];
  }
  let index2 = -1;
  while (++index2 < results.length) {
    const child = results[index2];
    if (loose || index2 !== 0 || child.type !== "element" || child.tagName !== "p") {
      children.push({ type: "text", value: `
` });
    }
    if (child.type === "element" && child.tagName === "p" && !loose) {
      children.push(...child.children);
    } else {
      children.push(child);
    }
  }
  const tail = results[results.length - 1];
  if (tail && (loose || tail.type !== "element" || tail.tagName !== "p")) {
    children.push({ type: "text", value: `
` });
  }
  const result = { type: "element", tagName: "li", properties, children };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function listLoose(node2) {
  let loose = false;
  if (node2.type === "list") {
    loose = node2.spread || false;
    const children = node2.children;
    let index2 = -1;
    while (!loose && ++index2 < children.length) {
      loose = listItemLoose(children[index2]);
    }
  }
  return loose;
}
function listItemLoose(node2) {
  const spread = node2.spread;
  return spread === null || spread === undefined ? node2.children.length > 1 : spread;
}
var init_list_item = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/list.js
function list2(state, node2) {
  const properties = {};
  const results = state.all(node2);
  let index2 = -1;
  if (typeof node2.start === "number" && node2.start !== 1) {
    properties.start = node2.start;
  }
  while (++index2 < results.length) {
    const child = results[index2];
    if (child.type === "element" && child.tagName === "li" && child.properties && Array.isArray(child.properties.className) && child.properties.className.includes("task-list-item")) {
      properties.className = ["contains-task-list"];
      break;
    }
  }
  const result = {
    type: "element",
    tagName: node2.ordered ? "ol" : "ul",
    properties,
    children: state.wrap(results, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_list2 = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/paragraph.js
function paragraph(state, node2) {
  const result = {
    type: "element",
    tagName: "p",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_paragraph = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/root.js
function root(state, node2) {
  const result = { type: "root", children: state.wrap(state.all(node2)) };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_root = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/strong.js
function strong(state, node2) {
  const result = {
    type: "element",
    tagName: "strong",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_strong = __esm(() => {
  "";
});

// node_modules/unist-util-position/lib/index.js
function point3(type2) {
  return point4;
  function point4(node2) {
    const point5 = node2 && node2.position && node2.position[type2] || {};
    if (typeof point5.line === "number" && point5.line > 0 && typeof point5.column === "number" && point5.column > 0) {
      return {
        line: point5.line,
        column: point5.column,
        offset: typeof point5.offset === "number" && point5.offset > -1 ? point5.offset : undefined
      };
    }
  }
}
function position2(node2) {
  const start = pointStart(node2);
  const end = pointEnd(node2);
  if (start && end) {
    return { start, end };
  }
}
var pointEnd, pointStart;
var init_lib7 = __esm(() => {
  pointEnd = point3("end");
  pointStart = point3("start");
});

// node_modules/unist-util-position/index.js
var init_unist_util_position = __esm(() => {
  init_lib7();
});

// node_modules/mdast-util-to-hast/lib/handlers/table.js
function table(state, node2) {
  const rows = state.all(node2);
  const firstRow = rows.shift();
  const tableContent = [];
  if (firstRow) {
    const head = {
      type: "element",
      tagName: "thead",
      properties: {},
      children: state.wrap([firstRow], true)
    };
    state.patch(node2.children[0], head);
    tableContent.push(head);
  }
  if (rows.length > 0) {
    const body = {
      type: "element",
      tagName: "tbody",
      properties: {},
      children: state.wrap(rows, true)
    };
    const start = pointStart(node2.children[1]);
    const end = pointEnd(node2.children[node2.children.length - 1]);
    if (start && end)
      body.position = { start, end };
    tableContent.push(body);
  }
  const result = {
    type: "element",
    tagName: "table",
    properties: {},
    children: state.wrap(tableContent, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_table = __esm(() => {
  init_unist_util_position();
});

// node_modules/mdast-util-to-hast/lib/handlers/table-row.js
function tableRow(state, node2, parent) {
  const siblings = parent ? parent.children : undefined;
  const rowIndex = siblings ? siblings.indexOf(node2) : 1;
  const tagName = rowIndex === 0 ? "th" : "td";
  const align = parent && parent.type === "table" ? parent.align : undefined;
  const length = align ? align.length : node2.children.length;
  let cellIndex = -1;
  const cells = [];
  while (++cellIndex < length) {
    const cell = node2.children[cellIndex];
    const properties = {};
    const alignValue = align ? align[cellIndex] : undefined;
    if (alignValue) {
      properties.align = alignValue;
    }
    let result2 = { type: "element", tagName, properties, children: [] };
    if (cell) {
      result2.children = state.all(cell);
      state.patch(cell, result2);
      result2 = state.applyData(cell, result2);
    }
    cells.push(result2);
  }
  const result = {
    type: "element",
    tagName: "tr",
    properties: {},
    children: state.wrap(cells, true)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_table_row = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/table-cell.js
function tableCell(state, node2) {
  const result = {
    type: "element",
    tagName: "td",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_table_cell = __esm(() => {
  "";
});

// node_modules/trim-lines/index.js
function trimLines(value) {
  const source = String(value);
  const search2 = /\r?\n|\r/g;
  let match = search2.exec(source);
  let last = 0;
  const lines = [];
  while (match) {
    lines.push(trimLine(source.slice(last, match.index), last > 0, true), match[0]);
    last = match.index + match[0].length;
    match = search2.exec(source);
  }
  lines.push(trimLine(source.slice(last), last > 0, false));
  return lines.join("");
}
function trimLine(value, start, end) {
  let startIndex = 0;
  let endIndex = value.length;
  if (start) {
    let code2 = value.codePointAt(startIndex);
    while (code2 === tab || code2 === space) {
      startIndex++;
      code2 = value.codePointAt(startIndex);
    }
  }
  if (end) {
    let code2 = value.codePointAt(endIndex - 1);
    while (code2 === tab || code2 === space) {
      endIndex--;
      code2 = value.codePointAt(endIndex - 1);
    }
  }
  return endIndex > startIndex ? value.slice(startIndex, endIndex) : "";
}
var tab = 9, space = 32;

// node_modules/mdast-util-to-hast/lib/handlers/text.js
function text3(state, node2) {
  const result = { type: "text", value: trimLines(String(node2.value)) };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_text2 = () => {};

// node_modules/mdast-util-to-hast/lib/handlers/thematic-break.js
function thematicBreak2(state, node2) {
  const result = {
    type: "element",
    tagName: "hr",
    properties: {},
    children: []
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
var init_thematic_break2 = __esm(() => {
  "";
});

// node_modules/mdast-util-to-hast/lib/handlers/index.js
function ignore() {
  return;
}
var handlers;
var init_handlers = __esm(() => {
  init_blockquote();
  init_break();
  init_code();
  init_delete();
  init_emphasis();
  init_footnote_reference();
  init_heading();
  init_html();
  init_image_reference();
  init_image();
  init_inline_code();
  init_link_reference();
  init_link();
  init_list_item();
  init_list2();
  init_paragraph();
  init_root();
  init_strong();
  init_table();
  init_table_row();
  init_table_cell();
  init_text2();
  init_thematic_break2();
  handlers = {
    blockquote,
    break: hardBreak,
    code,
    delete: strikethrough,
    emphasis,
    footnoteReference,
    heading,
    html,
    imageReference,
    image,
    inlineCode,
    linkReference,
    link,
    listItem,
    list: list2,
    paragraph,
    root,
    strong,
    table,
    tableCell,
    tableRow,
    text: text3,
    thematicBreak: thematicBreak2,
    toml: ignore,
    yaml: ignore,
    definition: ignore,
    footnoteDefinition: ignore
  };
});

// node_modules/@ungap/structured-clone/esm/types.js
var VOID = -1, PRIMITIVE = 0, ARRAY = 1, OBJECT = 2, DATE = 3, REGEXP = 4, MAP = 5, SET = 6, ERROR = 7, BIGINT = 8;

// node_modules/@ungap/structured-clone/esm/deserialize.js
var env, deserializer = ($2, _2) => {
  const as = (out, index2) => {
    $2.set(index2, out);
    return out;
  };
  const unpair = (index2) => {
    if ($2.has(index2))
      return $2.get(index2);
    const [type2, value] = _2[index2];
    switch (type2) {
      case PRIMITIVE:
      case VOID:
        return as(value, index2);
      case ARRAY: {
        const arr = as([], index2);
        for (const index3 of value)
          arr.push(unpair(index3));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index2);
        for (const [key, index3] of value)
          object[unpair(key)] = unpair(index3);
        return object;
      }
      case DATE:
        return as(new Date(value), index2);
      case REGEXP: {
        const { source, flags } = value;
        return as(new RegExp(source, flags), index2);
      }
      case MAP: {
        const map2 = as(new Map, index2);
        for (const [key, index3] of value)
          map2.set(unpair(key), unpair(index3));
        return map2;
      }
      case SET: {
        const set2 = as(new Set, index2);
        for (const index3 of value)
          set2.add(unpair(index3));
        return set2;
      }
      case ERROR: {
        const { name, message } = value;
        return as(new env[name](message), index2);
      }
      case BIGINT:
        return as(BigInt(value), index2);
      case "BigInt":
        return as(Object(BigInt(value)), index2);
      case "ArrayBuffer":
        return as(new Uint8Array(value).buffer, value);
      case "DataView": {
        const { buffer } = new Uint8Array(value);
        return as(new DataView(buffer), value);
      }
    }
    return as(new env[type2](value), index2);
  };
  return unpair;
}, deserialize = (serialized) => deserializer(new Map, serialized)(0);
var init_deserialize = __esm(() => {
  env = typeof self === "object" ? self : globalThis;
});

// node_modules/@ungap/structured-clone/esm/serialize.js
var EMPTY = "", toString3, keys, typeOf = (value) => {
  const type2 = typeof value;
  if (type2 !== "object" || !value)
    return [PRIMITIVE, type2];
  const asString = toString3.call(value).slice(8, -1);
  switch (asString) {
    case "Array":
      return [ARRAY, EMPTY];
    case "Object":
      return [OBJECT, EMPTY];
    case "Date":
      return [DATE, EMPTY];
    case "RegExp":
      return [REGEXP, EMPTY];
    case "Map":
      return [MAP, EMPTY];
    case "Set":
      return [SET, EMPTY];
    case "DataView":
      return [ARRAY, asString];
  }
  if (asString.includes("Array"))
    return [ARRAY, asString];
  if (asString.includes("Error"))
    return [ERROR, asString];
  return [OBJECT, asString];
}, shouldSkip = ([TYPE, type2]) => TYPE === PRIMITIVE && (type2 === "function" || type2 === "symbol"), serializer = (strict, json2, $2, _2) => {
  const as = (out, value) => {
    const index2 = _2.push(out) - 1;
    $2.set(value, index2);
    return index2;
  };
  const pair = (value) => {
    if ($2.has(value))
      return $2.get(value);
    let [TYPE, type2] = typeOf(value);
    switch (TYPE) {
      case PRIMITIVE: {
        let entry = value;
        switch (type2) {
          case "bigint":
            TYPE = BIGINT;
            entry = value.toString();
            break;
          case "function":
          case "symbol":
            if (strict)
              throw new TypeError("unable to serialize " + type2);
            entry = null;
            break;
          case "undefined":
            return as([VOID], value);
        }
        return as([TYPE, entry], value);
      }
      case ARRAY: {
        if (type2) {
          let spread = value;
          if (type2 === "DataView") {
            spread = new Uint8Array(value.buffer);
          } else if (type2 === "ArrayBuffer") {
            spread = new Uint8Array(value);
          }
          return as([type2, [...spread]], value);
        }
        const arr = [];
        const index2 = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index2;
      }
      case OBJECT: {
        if (type2) {
          switch (type2) {
            case "BigInt":
              return as([type2, value.toString()], value);
            case "Boolean":
            case "Number":
            case "String":
              return as([type2, value.valueOf()], value);
          }
        }
        if (json2 && "toJSON" in value)
          return pair(value.toJSON());
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index2;
      }
      case DATE:
        return as([TYPE, value.toISOString()], value);
      case REGEXP: {
        const { source, flags } = value;
        return as([TYPE, { source, flags }], value);
      }
      case MAP: {
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index2;
      }
      case SET: {
        const entries = [];
        const index2 = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index2;
      }
    }
    const { message } = value;
    return as([TYPE, { name: type2, message }], value);
  };
  return pair;
}, serialize = (value, { json: json2, lossy } = {}) => {
  const _2 = [];
  return serializer(!(json2 || lossy), !!json2, new Map, _2)(value), _2;
};
var init_serialize = __esm(() => {
  ({ toString: toString3 } = {});
  ({ keys } = Object);
});

// node_modules/@ungap/structured-clone/esm/index.js
var esm_default;
var init_esm = __esm(() => {
  init_deserialize();
  init_serialize();
  esm_default = typeof structuredClone === "function" ? (any, options) => options && (("json" in options) || ("lossy" in options)) ? deserialize(serialize(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize(any, options));
});

// node_modules/mdast-util-to-hast/lib/footer.js
function defaultFootnoteBackContent(_2, rereferenceIndex) {
  const result = [{ type: "text", value: "↩" }];
  if (rereferenceIndex > 1) {
    result.push({
      type: "element",
      tagName: "sup",
      properties: {},
      children: [{ type: "text", value: String(rereferenceIndex) }]
    });
  }
  return result;
}
function defaultFootnoteBackLabel(referenceIndex, rereferenceIndex) {
  return "Back to reference " + (referenceIndex + 1) + (rereferenceIndex > 1 ? "-" + rereferenceIndex : "");
}
function footer(state) {
  const clobberPrefix = typeof state.options.clobberPrefix === "string" ? state.options.clobberPrefix : "user-content-";
  const footnoteBackContent = state.options.footnoteBackContent || defaultFootnoteBackContent;
  const footnoteBackLabel = state.options.footnoteBackLabel || defaultFootnoteBackLabel;
  const footnoteLabel = state.options.footnoteLabel || "Footnotes";
  const footnoteLabelTagName = state.options.footnoteLabelTagName || "h2";
  const footnoteLabelProperties = state.options.footnoteLabelProperties || {
    className: ["sr-only"]
  };
  const listItems = [];
  let referenceIndex = -1;
  while (++referenceIndex < state.footnoteOrder.length) {
    const definition2 = state.footnoteById.get(state.footnoteOrder[referenceIndex]);
    if (!definition2) {
      continue;
    }
    const content3 = state.all(definition2);
    const id = String(definition2.identifier).toUpperCase();
    const safeId = normalizeUri(id.toLowerCase());
    let rereferenceIndex = 0;
    const backReferences = [];
    const counts = state.footnoteCounts.get(id);
    while (counts !== undefined && ++rereferenceIndex <= counts) {
      if (backReferences.length > 0) {
        backReferences.push({ type: "text", value: " " });
      }
      let children = typeof footnoteBackContent === "string" ? footnoteBackContent : footnoteBackContent(referenceIndex, rereferenceIndex);
      if (typeof children === "string") {
        children = { type: "text", value: children };
      }
      backReferences.push({
        type: "element",
        tagName: "a",
        properties: {
          href: "#" + clobberPrefix + "fnref-" + safeId + (rereferenceIndex > 1 ? "-" + rereferenceIndex : ""),
          dataFootnoteBackref: "",
          ariaLabel: typeof footnoteBackLabel === "string" ? footnoteBackLabel : footnoteBackLabel(referenceIndex, rereferenceIndex),
          className: ["data-footnote-backref"]
        },
        children: Array.isArray(children) ? children : [children]
      });
    }
    const tail = content3[content3.length - 1];
    if (tail && tail.type === "element" && tail.tagName === "p") {
      const tailTail = tail.children[tail.children.length - 1];
      if (tailTail && tailTail.type === "text") {
        tailTail.value += " ";
      } else {
        tail.children.push({ type: "text", value: " " });
      }
      tail.children.push(...backReferences);
    } else {
      content3.push(...backReferences);
    }
    const listItem2 = {
      type: "element",
      tagName: "li",
      properties: { id: clobberPrefix + "fn-" + safeId },
      children: state.wrap(content3, true)
    };
    state.patch(definition2, listItem2);
    listItems.push(listItem2);
  }
  if (listItems.length === 0) {
    return;
  }
  return {
    type: "element",
    tagName: "section",
    properties: { dataFootnotes: true, className: ["footnotes"] },
    children: [
      {
        type: "element",
        tagName: footnoteLabelTagName,
        properties: {
          ...esm_default(footnoteLabelProperties),
          id: "footnote-label"
        },
        children: [{ type: "text", value: footnoteLabel }]
      },
      { type: "text", value: `
` },
      {
        type: "element",
        tagName: "ol",
        properties: {},
        children: state.wrap(listItems, true)
      },
      { type: "text", value: `
` }
    ]
  };
}
var init_footer = __esm(() => {
  init_esm();
  init_dev5();
});

// node_modules/unist-util-is/lib/index.js
function anyFactory(tests) {
  const checks = [];
  let index2 = -1;
  while (++index2 < tests.length) {
    checks[index2] = convert(tests[index2]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index3 = -1;
    while (++index3 < checks.length) {
      if (checks[index3].apply(this, parameters))
        return true;
    }
    return false;
  }
}
function propertiesFactory(check) {
  const checkAsRecord = check;
  return castFactory(all2);
  function all2(node2) {
    const nodeAsRecord = node2;
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key])
        return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type2);
  function type2(node2) {
    return node2 && node2.type === check;
  }
}
function castFactory(testFunction) {
  return check;
  function check(value, index2, parent) {
    return Boolean(looksLikeANode(value) && testFunction.call(this, value, typeof index2 === "number" ? index2 : undefined, parent || undefined));
  }
}
function ok2() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}
var convert = function(test) {
  if (test === null || test === undefined) {
    return ok2;
  }
  if (typeof test === "function") {
    return castFactory(test);
  }
  if (typeof test === "object") {
    return Array.isArray(test) ? anyFactory(test) : propertiesFactory(test);
  }
  if (typeof test === "string") {
    return typeFactory(test);
  }
  throw new Error("Expected function, string, or object as test");
};

// node_modules/unist-util-is/index.js
var init_unist_util_is = () => {};

// node_modules/unist-util-visit-parents/lib/color.js
function color(d) {
  return d;
}

// node_modules/unist-util-visit-parents/lib/index.js
function visitParents(tree, test, visitor, reverse) {
  let check;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }
  const is2 = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, undefined, [])();
  function factory(node2, index2, parents) {
    const value = node2 && typeof node2 === "object" ? node2 : {};
    if (typeof value.type === "string") {
      const name = typeof value.tagName === "string" ? value.tagName : typeof value.name === "string" ? value.name : undefined;
      Object.defineProperty(visit, "name", {
        value: "node (" + color(node2.type + (name ? "<" + name + ">" : "")) + ")"
      });
    }
    return visit;
    function visit() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;
      if (!test || is2(node2, index2, parents[parents.length - 1] || undefined)) {
        result = toResult(visitor(node2, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ("children" in node2 && node2.children) {
        const nodeAsParent = node2;
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return value === null || value === undefined ? empty : [value];
}
var empty, CONTINUE = true, EXIT = false, SKIP = "skip";
var init_lib8 = __esm(() => {
  init_unist_util_is();
  empty = [];
});

// node_modules/unist-util-visit-parents/index.js
var init_unist_util_visit_parents = __esm(() => {
  init_lib8();
});

// node_modules/unist-util-visit/lib/index.js
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse;
  let test;
  let visitor;
  if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
    test = undefined;
    visitor = testOrVisitor;
    reverse = visitorOrReverse;
  } else {
    test = testOrVisitor;
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node2, parents) {
    const parent = parents[parents.length - 1];
    const index2 = parent ? parent.children.indexOf(node2) : undefined;
    return visitor(node2, index2, parent);
  }
}
var init_lib9 = __esm(() => {
  init_unist_util_visit_parents();
});

// node_modules/unist-util-visit/index.js
var init_unist_util_visit = __esm(() => {
  init_lib9();
});

// node_modules/mdast-util-to-hast/lib/state.js
function createState(tree, options) {
  const settings = options || emptyOptions2;
  const definitionById = new Map;
  const footnoteById = new Map;
  const footnoteCounts = new Map;
  const handlers2 = { ...handlers, ...settings.handlers };
  const state = {
    all: all2,
    applyData,
    definitionById,
    footnoteById,
    footnoteCounts,
    footnoteOrder: [],
    handlers: handlers2,
    one: one2,
    options: settings,
    patch,
    wrap: wrap2
  };
  visit(tree, function(node2) {
    if (node2.type === "definition" || node2.type === "footnoteDefinition") {
      const map2 = node2.type === "definition" ? definitionById : footnoteById;
      const id = String(node2.identifier).toUpperCase();
      if (!map2.has(id)) {
        map2.set(id, node2);
      }
    }
  });
  return state;
  function one2(node2, parent) {
    const type2 = node2.type;
    const handle = state.handlers[type2];
    if (own3.call(state.handlers, type2) && handle) {
      return handle(state, node2, parent);
    }
    if (state.options.passThrough && state.options.passThrough.includes(type2)) {
      if ("children" in node2) {
        const { children, ...shallow } = node2;
        const result = esm_default(shallow);
        result.children = state.all(node2);
        return result;
      }
      return esm_default(node2);
    }
    const unknown = state.options.unknownHandler || defaultUnknownHandler;
    return unknown(state, node2, parent);
  }
  function all2(parent) {
    const values2 = [];
    if ("children" in parent) {
      const nodes = parent.children;
      let index2 = -1;
      while (++index2 < nodes.length) {
        const result = state.one(nodes[index2], parent);
        if (result) {
          if (index2 && nodes[index2 - 1].type === "break") {
            if (!Array.isArray(result) && result.type === "text") {
              result.value = trimMarkdownSpaceStart(result.value);
            }
            if (!Array.isArray(result) && result.type === "element") {
              const head = result.children[0];
              if (head && head.type === "text") {
                head.value = trimMarkdownSpaceStart(head.value);
              }
            }
          }
          if (Array.isArray(result)) {
            values2.push(...result);
          } else {
            values2.push(result);
          }
        }
      }
    }
    return values2;
  }
}
function patch(from, to) {
  if (from.position)
    to.position = position2(from);
}
function applyData(from, to) {
  let result = to;
  if (from && from.data) {
    const hName = from.data.hName;
    const hChildren = from.data.hChildren;
    const hProperties = from.data.hProperties;
    if (typeof hName === "string") {
      if (result.type === "element") {
        result.tagName = hName;
      } else {
        const children = "children" in result ? result.children : [result];
        result = { type: "element", tagName: hName, properties: {}, children };
      }
    }
    if (result.type === "element" && hProperties) {
      Object.assign(result.properties, esm_default(hProperties));
    }
    if ("children" in result && result.children && hChildren !== null && hChildren !== undefined) {
      result.children = hChildren;
    }
  }
  return result;
}
function defaultUnknownHandler(state, node2) {
  const data = node2.data || {};
  const result = "value" in node2 && !(own3.call(data, "hProperties") || own3.call(data, "hChildren")) ? { type: "text", value: node2.value } : {
    type: "element",
    tagName: "div",
    properties: {},
    children: state.all(node2)
  };
  state.patch(node2, result);
  return state.applyData(node2, result);
}
function wrap2(nodes, loose) {
  const result = [];
  let index2 = -1;
  if (loose) {
    result.push({ type: "text", value: `
` });
  }
  while (++index2 < nodes.length) {
    if (index2)
      result.push({ type: "text", value: `
` });
    result.push(nodes[index2]);
  }
  if (loose && nodes.length > 0) {
    result.push({ type: "text", value: `
` });
  }
  return result;
}
function trimMarkdownSpaceStart(value) {
  let index2 = 0;
  let code2 = value.charCodeAt(index2);
  while (code2 === 9 || code2 === 32) {
    index2++;
    code2 = value.charCodeAt(index2);
  }
  return value.slice(index2);
}
var own3, emptyOptions2;
var init_state = __esm(() => {
  init_esm();
  init_unist_util_visit();
  init_unist_util_position();
  init_handlers();
  own3 = {}.hasOwnProperty;
  emptyOptions2 = {};
});

// node_modules/mdast-util-to-hast/lib/index.js
function toHast(tree, options) {
  const state = createState(tree, options);
  const node2 = state.one(tree, undefined);
  const foot = footer(state);
  const result = Array.isArray(node2) ? { type: "root", children: node2 } : node2 || { type: "root", children: [] };
  if (foot) {
    ok("children" in result);
    result.children.push({ type: "text", value: `
` }, foot);
  }
  return result;
}
var init_lib10 = __esm(() => {
  init_development();
  init_footer();
  init_state();
});

// node_modules/mdast-util-to-hast/index.js
var init_mdast_util_to_hast = __esm(() => {
  init_lib10();
});

// node_modules/remark-rehype/lib/index.js
function remarkRehype(destination, options) {
  if (destination && "run" in destination) {
    return async function(tree, file) {
      const hastTree = toHast(tree, { file, ...options });
      await destination.run(hastTree, file);
    };
  }
  return function(tree, file) {
    return toHast(tree, { file, ...destination || options });
  };
}
var init_lib11 = __esm(() => {
  init_mdast_util_to_hast();
});

// node_modules/remark-rehype/index.js
var init_remark_rehype = __esm(() => {
  init_lib11();
});

// node_modules/html-void-elements/index.js
var htmlVoidElements;
var init_html_void_elements = __esm(() => {
  htmlVoidElements = [
    "area",
    "base",
    "basefont",
    "bgsound",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "image",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];
});

// node_modules/property-information/lib/util/schema.js
class Schema2 {
  constructor(property, normal, space2) {
    this.normal = normal;
    this.property = property;
    if (space2) {
      this.space = space2;
    }
  }
}
var init_schema = __esm(() => {
  Schema2.prototype.normal = {};
  Schema2.prototype.property = {};
  Schema2.prototype.space = undefined;
});

// node_modules/property-information/lib/util/merge.js
function merge2(definitions, space2) {
  const property = {};
  const normal = {};
  for (const definition2 of definitions) {
    Object.assign(property, definition2.property);
    Object.assign(normal, definition2.normal);
  }
  return new Schema2(property, normal, space2);
}
var init_merge = __esm(() => {
  init_schema();
});

// node_modules/property-information/lib/normalize.js
function normalize3(value) {
  return value.toLowerCase();
}

// node_modules/property-information/lib/util/info.js
class Info {
  constructor(property, attribute) {
    this.attribute = attribute;
    this.property = property;
  }
}
var init_info = __esm(() => {
  Info.prototype.attribute = "";
  Info.prototype.booleanish = false;
  Info.prototype.boolean = false;
  Info.prototype.commaOrSpaceSeparated = false;
  Info.prototype.commaSeparated = false;
  Info.prototype.defined = false;
  Info.prototype.mustUseProperty = false;
  Info.prototype.number = false;
  Info.prototype.overloadedBoolean = false;
  Info.prototype.property = "";
  Info.prototype.spaceSeparated = false;
  Info.prototype.space = undefined;
});

// node_modules/property-information/lib/util/types.js
var exports_types = {};
__export(exports_types, {
  spaceSeparated: () => spaceSeparated,
  overloadedBoolean: () => overloadedBoolean,
  number: () => number,
  commaSeparated: () => commaSeparated,
  commaOrSpaceSeparated: () => commaOrSpaceSeparated,
  booleanish: () => booleanish,
  boolean: () => boolean
});
function increment() {
  return 2 ** ++powers;
}
var powers = 0, boolean, booleanish, overloadedBoolean, number, spaceSeparated, commaSeparated, commaOrSpaceSeparated;
var init_types2 = __esm(() => {
  boolean = increment();
  booleanish = increment();
  overloadedBoolean = increment();
  number = increment();
  spaceSeparated = increment();
  commaSeparated = increment();
  commaOrSpaceSeparated = increment();
});

// node_modules/property-information/lib/util/defined-info.js
function mark(values2, key, value) {
  if (value) {
    values2[key] = value;
  }
}
var checks, DefinedInfo;
var init_defined_info = __esm(() => {
  init_info();
  init_types2();
  checks = Object.keys(exports_types);
  DefinedInfo = class DefinedInfo extends Info {
    constructor(property, attribute, mask, space2) {
      let index2 = -1;
      super(property, attribute);
      mark(this, "space", space2);
      if (typeof mask === "number") {
        while (++index2 < checks.length) {
          const check = checks[index2];
          mark(this, checks[index2], (mask & exports_types[check]) === exports_types[check]);
        }
      }
    }
  };
  DefinedInfo.prototype.defined = true;
});

// node_modules/property-information/lib/util/create.js
function create(definition2) {
  const properties = {};
  const normals = {};
  for (const [property, value] of Object.entries(definition2.properties)) {
    const info = new DefinedInfo(property, definition2.transform(definition2.attributes || {}, property), value, definition2.space);
    if (definition2.mustUseProperty && definition2.mustUseProperty.includes(property)) {
      info.mustUseProperty = true;
    }
    properties[property] = info;
    normals[normalize3(property)] = property;
    normals[normalize3(info.attribute)] = property;
  }
  return new Schema2(properties, normals, definition2.space);
}
var init_create = __esm(() => {
  init_defined_info();
  init_schema();
});

// node_modules/property-information/lib/aria.js
var aria;
var init_aria = __esm(() => {
  init_create();
  init_types2();
  aria = create({
    properties: {
      ariaActiveDescendant: null,
      ariaAtomic: booleanish,
      ariaAutoComplete: null,
      ariaBusy: booleanish,
      ariaChecked: booleanish,
      ariaColCount: number,
      ariaColIndex: number,
      ariaColSpan: number,
      ariaControls: spaceSeparated,
      ariaCurrent: null,
      ariaDescribedBy: spaceSeparated,
      ariaDetails: null,
      ariaDisabled: booleanish,
      ariaDropEffect: spaceSeparated,
      ariaErrorMessage: null,
      ariaExpanded: booleanish,
      ariaFlowTo: spaceSeparated,
      ariaGrabbed: booleanish,
      ariaHasPopup: null,
      ariaHidden: booleanish,
      ariaInvalid: null,
      ariaKeyShortcuts: null,
      ariaLabel: null,
      ariaLabelledBy: spaceSeparated,
      ariaLevel: number,
      ariaLive: null,
      ariaModal: booleanish,
      ariaMultiLine: booleanish,
      ariaMultiSelectable: booleanish,
      ariaOrientation: null,
      ariaOwns: spaceSeparated,
      ariaPlaceholder: null,
      ariaPosInSet: number,
      ariaPressed: booleanish,
      ariaReadOnly: booleanish,
      ariaRelevant: null,
      ariaRequired: booleanish,
      ariaRoleDescription: spaceSeparated,
      ariaRowCount: number,
      ariaRowIndex: number,
      ariaRowSpan: number,
      ariaSelected: booleanish,
      ariaSetSize: number,
      ariaSort: null,
      ariaValueMax: number,
      ariaValueMin: number,
      ariaValueNow: number,
      ariaValueText: null,
      role: null
    },
    transform(_2, property) {
      return property === "role" ? property : "aria-" + property.slice(4).toLowerCase();
    }
  });
});

// node_modules/property-information/lib/util/case-sensitive-transform.js
function caseSensitiveTransform(attributes, attribute) {
  return attribute in attributes ? attributes[attribute] : attribute;
}

// node_modules/property-information/lib/util/case-insensitive-transform.js
function caseInsensitiveTransform(attributes, property) {
  return caseSensitiveTransform(attributes, property.toLowerCase());
}
var init_case_insensitive_transform = () => {};

// node_modules/property-information/lib/html.js
var html2;
var init_html2 = __esm(() => {
  init_case_insensitive_transform();
  init_create();
  init_types2();
  html2 = create({
    attributes: {
      acceptcharset: "accept-charset",
      classname: "class",
      htmlfor: "for",
      httpequiv: "http-equiv"
    },
    mustUseProperty: ["checked", "multiple", "muted", "selected"],
    properties: {
      abbr: null,
      accept: commaSeparated,
      acceptCharset: spaceSeparated,
      accessKey: spaceSeparated,
      action: null,
      allow: null,
      allowFullScreen: boolean,
      allowPaymentRequest: boolean,
      allowUserMedia: boolean,
      alt: null,
      as: null,
      async: boolean,
      autoCapitalize: null,
      autoComplete: spaceSeparated,
      autoFocus: boolean,
      autoPlay: boolean,
      blocking: spaceSeparated,
      capture: null,
      charSet: null,
      checked: boolean,
      cite: null,
      className: spaceSeparated,
      cols: number,
      colSpan: null,
      content: null,
      contentEditable: booleanish,
      controls: boolean,
      controlsList: spaceSeparated,
      coords: number | commaSeparated,
      crossOrigin: null,
      data: null,
      dateTime: null,
      decoding: null,
      default: boolean,
      defer: boolean,
      dir: null,
      dirName: null,
      disabled: boolean,
      download: overloadedBoolean,
      draggable: booleanish,
      encType: null,
      enterKeyHint: null,
      fetchPriority: null,
      form: null,
      formAction: null,
      formEncType: null,
      formMethod: null,
      formNoValidate: boolean,
      formTarget: null,
      headers: spaceSeparated,
      height: number,
      hidden: overloadedBoolean,
      high: number,
      href: null,
      hrefLang: null,
      htmlFor: spaceSeparated,
      httpEquiv: spaceSeparated,
      id: null,
      imageSizes: null,
      imageSrcSet: null,
      inert: boolean,
      inputMode: null,
      integrity: null,
      is: null,
      isMap: boolean,
      itemId: null,
      itemProp: spaceSeparated,
      itemRef: spaceSeparated,
      itemScope: boolean,
      itemType: spaceSeparated,
      kind: null,
      label: null,
      lang: null,
      language: null,
      list: null,
      loading: null,
      loop: boolean,
      low: number,
      manifest: null,
      max: null,
      maxLength: number,
      media: null,
      method: null,
      min: null,
      minLength: number,
      multiple: boolean,
      muted: boolean,
      name: null,
      nonce: null,
      noModule: boolean,
      noValidate: boolean,
      onAbort: null,
      onAfterPrint: null,
      onAuxClick: null,
      onBeforeMatch: null,
      onBeforePrint: null,
      onBeforeToggle: null,
      onBeforeUnload: null,
      onBlur: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onContextLost: null,
      onContextMenu: null,
      onContextRestored: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFormData: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLanguageChange: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadEnd: null,
      onLoadStart: null,
      onMessage: null,
      onMessageError: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRejectionHandled: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onScrollEnd: null,
      onSecurityPolicyViolation: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onSlotChange: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnhandledRejection: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onWheel: null,
      open: boolean,
      optimum: number,
      pattern: null,
      ping: spaceSeparated,
      placeholder: null,
      playsInline: boolean,
      popover: null,
      popoverTarget: null,
      popoverTargetAction: null,
      poster: null,
      preload: null,
      readOnly: boolean,
      referrerPolicy: null,
      rel: spaceSeparated,
      required: boolean,
      reversed: boolean,
      rows: number,
      rowSpan: number,
      sandbox: spaceSeparated,
      scope: null,
      scoped: boolean,
      seamless: boolean,
      selected: boolean,
      shadowRootClonable: boolean,
      shadowRootDelegatesFocus: boolean,
      shadowRootMode: null,
      shape: null,
      size: number,
      sizes: null,
      slot: null,
      span: number,
      spellCheck: booleanish,
      src: null,
      srcDoc: null,
      srcLang: null,
      srcSet: null,
      start: number,
      step: null,
      style: null,
      tabIndex: number,
      target: null,
      title: null,
      translate: null,
      type: null,
      typeMustMatch: boolean,
      useMap: null,
      value: booleanish,
      width: number,
      wrap: null,
      writingSuggestions: null,
      align: null,
      aLink: null,
      archive: spaceSeparated,
      axis: null,
      background: null,
      bgColor: null,
      border: number,
      borderColor: null,
      bottomMargin: number,
      cellPadding: null,
      cellSpacing: null,
      char: null,
      charOff: null,
      classId: null,
      clear: null,
      code: null,
      codeBase: null,
      codeType: null,
      color: null,
      compact: boolean,
      declare: boolean,
      event: null,
      face: null,
      frame: null,
      frameBorder: null,
      hSpace: number,
      leftMargin: number,
      link: null,
      longDesc: null,
      lowSrc: null,
      marginHeight: number,
      marginWidth: number,
      noResize: boolean,
      noHref: boolean,
      noShade: boolean,
      noWrap: boolean,
      object: null,
      profile: null,
      prompt: null,
      rev: null,
      rightMargin: number,
      rules: null,
      scheme: null,
      scrolling: booleanish,
      standby: null,
      summary: null,
      text: null,
      topMargin: number,
      valueType: null,
      version: null,
      vAlign: null,
      vLink: null,
      vSpace: number,
      allowTransparency: null,
      autoCorrect: null,
      autoSave: null,
      disablePictureInPicture: boolean,
      disableRemotePlayback: boolean,
      prefix: null,
      property: null,
      results: number,
      security: null,
      unselectable: null
    },
    space: "html",
    transform: caseInsensitiveTransform
  });
});

// node_modules/property-information/lib/svg.js
var svg;
var init_svg = __esm(() => {
  init_create();
  init_types2();
  svg = create({
    attributes: {
      accentHeight: "accent-height",
      alignmentBaseline: "alignment-baseline",
      arabicForm: "arabic-form",
      baselineShift: "baseline-shift",
      capHeight: "cap-height",
      className: "class",
      clipPath: "clip-path",
      clipRule: "clip-rule",
      colorInterpolation: "color-interpolation",
      colorInterpolationFilters: "color-interpolation-filters",
      colorProfile: "color-profile",
      colorRendering: "color-rendering",
      crossOrigin: "crossorigin",
      dataType: "datatype",
      dominantBaseline: "dominant-baseline",
      enableBackground: "enable-background",
      fillOpacity: "fill-opacity",
      fillRule: "fill-rule",
      floodColor: "flood-color",
      floodOpacity: "flood-opacity",
      fontFamily: "font-family",
      fontSize: "font-size",
      fontSizeAdjust: "font-size-adjust",
      fontStretch: "font-stretch",
      fontStyle: "font-style",
      fontVariant: "font-variant",
      fontWeight: "font-weight",
      glyphName: "glyph-name",
      glyphOrientationHorizontal: "glyph-orientation-horizontal",
      glyphOrientationVertical: "glyph-orientation-vertical",
      hrefLang: "hreflang",
      horizAdvX: "horiz-adv-x",
      horizOriginX: "horiz-origin-x",
      horizOriginY: "horiz-origin-y",
      imageRendering: "image-rendering",
      letterSpacing: "letter-spacing",
      lightingColor: "lighting-color",
      markerEnd: "marker-end",
      markerMid: "marker-mid",
      markerStart: "marker-start",
      navDown: "nav-down",
      navDownLeft: "nav-down-left",
      navDownRight: "nav-down-right",
      navLeft: "nav-left",
      navNext: "nav-next",
      navPrev: "nav-prev",
      navRight: "nav-right",
      navUp: "nav-up",
      navUpLeft: "nav-up-left",
      navUpRight: "nav-up-right",
      onAbort: "onabort",
      onActivate: "onactivate",
      onAfterPrint: "onafterprint",
      onBeforePrint: "onbeforeprint",
      onBegin: "onbegin",
      onCancel: "oncancel",
      onCanPlay: "oncanplay",
      onCanPlayThrough: "oncanplaythrough",
      onChange: "onchange",
      onClick: "onclick",
      onClose: "onclose",
      onCopy: "oncopy",
      onCueChange: "oncuechange",
      onCut: "oncut",
      onDblClick: "ondblclick",
      onDrag: "ondrag",
      onDragEnd: "ondragend",
      onDragEnter: "ondragenter",
      onDragExit: "ondragexit",
      onDragLeave: "ondragleave",
      onDragOver: "ondragover",
      onDragStart: "ondragstart",
      onDrop: "ondrop",
      onDurationChange: "ondurationchange",
      onEmptied: "onemptied",
      onEnd: "onend",
      onEnded: "onended",
      onError: "onerror",
      onFocus: "onfocus",
      onFocusIn: "onfocusin",
      onFocusOut: "onfocusout",
      onHashChange: "onhashchange",
      onInput: "oninput",
      onInvalid: "oninvalid",
      onKeyDown: "onkeydown",
      onKeyPress: "onkeypress",
      onKeyUp: "onkeyup",
      onLoad: "onload",
      onLoadedData: "onloadeddata",
      onLoadedMetadata: "onloadedmetadata",
      onLoadStart: "onloadstart",
      onMessage: "onmessage",
      onMouseDown: "onmousedown",
      onMouseEnter: "onmouseenter",
      onMouseLeave: "onmouseleave",
      onMouseMove: "onmousemove",
      onMouseOut: "onmouseout",
      onMouseOver: "onmouseover",
      onMouseUp: "onmouseup",
      onMouseWheel: "onmousewheel",
      onOffline: "onoffline",
      onOnline: "ononline",
      onPageHide: "onpagehide",
      onPageShow: "onpageshow",
      onPaste: "onpaste",
      onPause: "onpause",
      onPlay: "onplay",
      onPlaying: "onplaying",
      onPopState: "onpopstate",
      onProgress: "onprogress",
      onRateChange: "onratechange",
      onRepeat: "onrepeat",
      onReset: "onreset",
      onResize: "onresize",
      onScroll: "onscroll",
      onSeeked: "onseeked",
      onSeeking: "onseeking",
      onSelect: "onselect",
      onShow: "onshow",
      onStalled: "onstalled",
      onStorage: "onstorage",
      onSubmit: "onsubmit",
      onSuspend: "onsuspend",
      onTimeUpdate: "ontimeupdate",
      onToggle: "ontoggle",
      onUnload: "onunload",
      onVolumeChange: "onvolumechange",
      onWaiting: "onwaiting",
      onZoom: "onzoom",
      overlinePosition: "overline-position",
      overlineThickness: "overline-thickness",
      paintOrder: "paint-order",
      panose1: "panose-1",
      pointerEvents: "pointer-events",
      referrerPolicy: "referrerpolicy",
      renderingIntent: "rendering-intent",
      shapeRendering: "shape-rendering",
      stopColor: "stop-color",
      stopOpacity: "stop-opacity",
      strikethroughPosition: "strikethrough-position",
      strikethroughThickness: "strikethrough-thickness",
      strokeDashArray: "stroke-dasharray",
      strokeDashOffset: "stroke-dashoffset",
      strokeLineCap: "stroke-linecap",
      strokeLineJoin: "stroke-linejoin",
      strokeMiterLimit: "stroke-miterlimit",
      strokeOpacity: "stroke-opacity",
      strokeWidth: "stroke-width",
      tabIndex: "tabindex",
      textAnchor: "text-anchor",
      textDecoration: "text-decoration",
      textRendering: "text-rendering",
      transformOrigin: "transform-origin",
      typeOf: "typeof",
      underlinePosition: "underline-position",
      underlineThickness: "underline-thickness",
      unicodeBidi: "unicode-bidi",
      unicodeRange: "unicode-range",
      unitsPerEm: "units-per-em",
      vAlphabetic: "v-alphabetic",
      vHanging: "v-hanging",
      vIdeographic: "v-ideographic",
      vMathematical: "v-mathematical",
      vectorEffect: "vector-effect",
      vertAdvY: "vert-adv-y",
      vertOriginX: "vert-origin-x",
      vertOriginY: "vert-origin-y",
      wordSpacing: "word-spacing",
      writingMode: "writing-mode",
      xHeight: "x-height",
      playbackOrder: "playbackorder",
      timelineBegin: "timelinebegin"
    },
    properties: {
      about: commaOrSpaceSeparated,
      accentHeight: number,
      accumulate: null,
      additive: null,
      alignmentBaseline: null,
      alphabetic: number,
      amplitude: number,
      arabicForm: null,
      ascent: number,
      attributeName: null,
      attributeType: null,
      azimuth: number,
      bandwidth: null,
      baselineShift: null,
      baseFrequency: null,
      baseProfile: null,
      bbox: null,
      begin: null,
      bias: number,
      by: null,
      calcMode: null,
      capHeight: number,
      className: spaceSeparated,
      clip: null,
      clipPath: null,
      clipPathUnits: null,
      clipRule: null,
      color: null,
      colorInterpolation: null,
      colorInterpolationFilters: null,
      colorProfile: null,
      colorRendering: null,
      content: null,
      contentScriptType: null,
      contentStyleType: null,
      crossOrigin: null,
      cursor: null,
      cx: null,
      cy: null,
      d: null,
      dataType: null,
      defaultAction: null,
      descent: number,
      diffuseConstant: number,
      direction: null,
      display: null,
      dur: null,
      divisor: number,
      dominantBaseline: null,
      download: boolean,
      dx: null,
      dy: null,
      edgeMode: null,
      editable: null,
      elevation: number,
      enableBackground: null,
      end: null,
      event: null,
      exponent: number,
      externalResourcesRequired: null,
      fill: null,
      fillOpacity: number,
      fillRule: null,
      filter: null,
      filterRes: null,
      filterUnits: null,
      floodColor: null,
      floodOpacity: null,
      focusable: null,
      focusHighlight: null,
      fontFamily: null,
      fontSize: null,
      fontSizeAdjust: null,
      fontStretch: null,
      fontStyle: null,
      fontVariant: null,
      fontWeight: null,
      format: null,
      fr: null,
      from: null,
      fx: null,
      fy: null,
      g1: commaSeparated,
      g2: commaSeparated,
      glyphName: commaSeparated,
      glyphOrientationHorizontal: null,
      glyphOrientationVertical: null,
      glyphRef: null,
      gradientTransform: null,
      gradientUnits: null,
      handler: null,
      hanging: number,
      hatchContentUnits: null,
      hatchUnits: null,
      height: null,
      href: null,
      hrefLang: null,
      horizAdvX: number,
      horizOriginX: number,
      horizOriginY: number,
      id: null,
      ideographic: number,
      imageRendering: null,
      initialVisibility: null,
      in: null,
      in2: null,
      intercept: number,
      k: number,
      k1: number,
      k2: number,
      k3: number,
      k4: number,
      kernelMatrix: commaOrSpaceSeparated,
      kernelUnitLength: null,
      keyPoints: null,
      keySplines: null,
      keyTimes: null,
      kerning: null,
      lang: null,
      lengthAdjust: null,
      letterSpacing: null,
      lightingColor: null,
      limitingConeAngle: number,
      local: null,
      markerEnd: null,
      markerMid: null,
      markerStart: null,
      markerHeight: null,
      markerUnits: null,
      markerWidth: null,
      mask: null,
      maskContentUnits: null,
      maskUnits: null,
      mathematical: null,
      max: null,
      media: null,
      mediaCharacterEncoding: null,
      mediaContentEncodings: null,
      mediaSize: number,
      mediaTime: null,
      method: null,
      min: null,
      mode: null,
      name: null,
      navDown: null,
      navDownLeft: null,
      navDownRight: null,
      navLeft: null,
      navNext: null,
      navPrev: null,
      navRight: null,
      navUp: null,
      navUpLeft: null,
      navUpRight: null,
      numOctaves: null,
      observer: null,
      offset: null,
      onAbort: null,
      onActivate: null,
      onAfterPrint: null,
      onBeforePrint: null,
      onBegin: null,
      onCancel: null,
      onCanPlay: null,
      onCanPlayThrough: null,
      onChange: null,
      onClick: null,
      onClose: null,
      onCopy: null,
      onCueChange: null,
      onCut: null,
      onDblClick: null,
      onDrag: null,
      onDragEnd: null,
      onDragEnter: null,
      onDragExit: null,
      onDragLeave: null,
      onDragOver: null,
      onDragStart: null,
      onDrop: null,
      onDurationChange: null,
      onEmptied: null,
      onEnd: null,
      onEnded: null,
      onError: null,
      onFocus: null,
      onFocusIn: null,
      onFocusOut: null,
      onHashChange: null,
      onInput: null,
      onInvalid: null,
      onKeyDown: null,
      onKeyPress: null,
      onKeyUp: null,
      onLoad: null,
      onLoadedData: null,
      onLoadedMetadata: null,
      onLoadStart: null,
      onMessage: null,
      onMouseDown: null,
      onMouseEnter: null,
      onMouseLeave: null,
      onMouseMove: null,
      onMouseOut: null,
      onMouseOver: null,
      onMouseUp: null,
      onMouseWheel: null,
      onOffline: null,
      onOnline: null,
      onPageHide: null,
      onPageShow: null,
      onPaste: null,
      onPause: null,
      onPlay: null,
      onPlaying: null,
      onPopState: null,
      onProgress: null,
      onRateChange: null,
      onRepeat: null,
      onReset: null,
      onResize: null,
      onScroll: null,
      onSeeked: null,
      onSeeking: null,
      onSelect: null,
      onShow: null,
      onStalled: null,
      onStorage: null,
      onSubmit: null,
      onSuspend: null,
      onTimeUpdate: null,
      onToggle: null,
      onUnload: null,
      onVolumeChange: null,
      onWaiting: null,
      onZoom: null,
      opacity: null,
      operator: null,
      order: null,
      orient: null,
      orientation: null,
      origin: null,
      overflow: null,
      overlay: null,
      overlinePosition: number,
      overlineThickness: number,
      paintOrder: null,
      panose1: null,
      path: null,
      pathLength: number,
      patternContentUnits: null,
      patternTransform: null,
      patternUnits: null,
      phase: null,
      ping: spaceSeparated,
      pitch: null,
      playbackOrder: null,
      pointerEvents: null,
      points: null,
      pointsAtX: number,
      pointsAtY: number,
      pointsAtZ: number,
      preserveAlpha: null,
      preserveAspectRatio: null,
      primitiveUnits: null,
      propagate: null,
      property: commaOrSpaceSeparated,
      r: null,
      radius: null,
      referrerPolicy: null,
      refX: null,
      refY: null,
      rel: commaOrSpaceSeparated,
      rev: commaOrSpaceSeparated,
      renderingIntent: null,
      repeatCount: null,
      repeatDur: null,
      requiredExtensions: commaOrSpaceSeparated,
      requiredFeatures: commaOrSpaceSeparated,
      requiredFonts: commaOrSpaceSeparated,
      requiredFormats: commaOrSpaceSeparated,
      resource: null,
      restart: null,
      result: null,
      rotate: null,
      rx: null,
      ry: null,
      scale: null,
      seed: null,
      shapeRendering: null,
      side: null,
      slope: null,
      snapshotTime: null,
      specularConstant: number,
      specularExponent: number,
      spreadMethod: null,
      spacing: null,
      startOffset: null,
      stdDeviation: null,
      stemh: null,
      stemv: null,
      stitchTiles: null,
      stopColor: null,
      stopOpacity: null,
      strikethroughPosition: number,
      strikethroughThickness: number,
      string: null,
      stroke: null,
      strokeDashArray: commaOrSpaceSeparated,
      strokeDashOffset: null,
      strokeLineCap: null,
      strokeLineJoin: null,
      strokeMiterLimit: number,
      strokeOpacity: number,
      strokeWidth: null,
      style: null,
      surfaceScale: number,
      syncBehavior: null,
      syncBehaviorDefault: null,
      syncMaster: null,
      syncTolerance: null,
      syncToleranceDefault: null,
      systemLanguage: commaOrSpaceSeparated,
      tabIndex: number,
      tableValues: null,
      target: null,
      targetX: number,
      targetY: number,
      textAnchor: null,
      textDecoration: null,
      textRendering: null,
      textLength: null,
      timelineBegin: null,
      title: null,
      transformBehavior: null,
      type: null,
      typeOf: commaOrSpaceSeparated,
      to: null,
      transform: null,
      transformOrigin: null,
      u1: null,
      u2: null,
      underlinePosition: number,
      underlineThickness: number,
      unicode: null,
      unicodeBidi: null,
      unicodeRange: null,
      unitsPerEm: number,
      values: null,
      vAlphabetic: number,
      vMathematical: number,
      vectorEffect: null,
      vHanging: number,
      vIdeographic: number,
      version: null,
      vertAdvY: number,
      vertOriginX: number,
      vertOriginY: number,
      viewBox: null,
      viewTarget: null,
      visibility: null,
      width: null,
      widths: null,
      wordSpacing: null,
      writingMode: null,
      x: null,
      x1: null,
      x2: null,
      xChannelSelector: null,
      xHeight: number,
      y: null,
      y1: null,
      y2: null,
      yChannelSelector: null,
      z: null,
      zoomAndPan: null
    },
    space: "svg",
    transform: caseSensitiveTransform
  });
});

// node_modules/property-information/lib/xlink.js
var xlink;
var init_xlink = __esm(() => {
  init_create();
  xlink = create({
    properties: {
      xLinkActuate: null,
      xLinkArcRole: null,
      xLinkHref: null,
      xLinkRole: null,
      xLinkShow: null,
      xLinkTitle: null,
      xLinkType: null
    },
    space: "xlink",
    transform(_2, property) {
      return "xlink:" + property.slice(5).toLowerCase();
    }
  });
});

// node_modules/property-information/lib/xmlns.js
var xmlns;
var init_xmlns = __esm(() => {
  init_create();
  init_case_insensitive_transform();
  xmlns = create({
    attributes: { xmlnsxlink: "xmlns:xlink" },
    properties: { xmlnsXLink: null, xmlns: null },
    space: "xmlns",
    transform: caseInsensitiveTransform
  });
});

// node_modules/property-information/lib/xml.js
var xml;
var init_xml = __esm(() => {
  init_create();
  xml = create({
    properties: { xmlBase: null, xmlLang: null, xmlSpace: null },
    space: "xml",
    transform(_2, property) {
      return "xml:" + property.slice(3).toLowerCase();
    }
  });
});

// node_modules/property-information/lib/find.js
function find(schema2, value) {
  const normal = normalize3(value);
  let property = value;
  let Type2 = Info;
  if (normal in schema2.normal) {
    return schema2.property[schema2.normal[normal]];
  }
  if (normal.length > 4 && normal.slice(0, 4) === "data" && valid.test(value)) {
    if (value.charAt(4) === "-") {
      const rest = value.slice(5).replace(dash, camelcase);
      property = "data" + rest.charAt(0).toUpperCase() + rest.slice(1);
    } else {
      const rest = value.slice(4);
      if (!dash.test(rest)) {
        let dashes = rest.replace(cap, kebab);
        if (dashes.charAt(0) !== "-") {
          dashes = "-" + dashes;
        }
        value = "data" + dashes;
      }
    }
    Type2 = DefinedInfo;
  }
  return new Type2(property, value);
}
function kebab($0) {
  return "-" + $0.toLowerCase();
}
function camelcase($0) {
  return $0.charAt(1).toUpperCase();
}
var cap, dash, valid;
var init_find = __esm(() => {
  init_defined_info();
  init_info();
  cap = /[A-Z]/g;
  dash = /-[a-z]/g;
  valid = /^data[-\w.:]+$/i;
});

// node_modules/property-information/index.js
var html3, svg2;
var init_property_information = __esm(() => {
  init_merge();
  init_aria();
  init_html2();
  init_svg();
  init_xlink();
  init_xmlns();
  init_xml();
  init_find();
  html3 = merge2([aria, html2, xlink, xmlns, xml], "html");
  svg2 = merge2([aria, svg, xlink, xmlns, xml], "svg");
});

// node_modules/zwitch/index.js
function zwitch(key, options) {
  const settings = options || {};
  function one2(value, ...parameters) {
    let fn = one2.invalid;
    const handlers2 = one2.handlers;
    if (value && own4.call(value, key)) {
      const id = String(value[key]);
      fn = own4.call(handlers2, id) ? handlers2[id] : one2.unknown;
    }
    if (fn) {
      return fn.call(this, value, ...parameters);
    }
  }
  one2.handlers = settings.handlers || {};
  one2.invalid = settings.invalid;
  one2.unknown = settings.unknown;
  return one2;
}
var own4;
var init_zwitch = __esm(() => {
  own4 = {}.hasOwnProperty;
});

// node_modules/stringify-entities/lib/core.js
function core2(value, options) {
  value = value.replace(options.subset ? charactersToExpressionCached(options.subset) : defaultSubsetRegex, basic);
  if (options.subset || options.escapeOnly) {
    return value;
  }
  return value.replace(surrogatePairsRegex, surrogate).replace(controlCharactersRegex, basic);
  function surrogate(pair, index2, all2) {
    return options.format((pair.charCodeAt(0) - 55296) * 1024 + pair.charCodeAt(1) - 56320 + 65536, all2.charCodeAt(index2 + 2), options);
  }
  function basic(character, index2, all2) {
    return options.format(character.charCodeAt(0), all2.charCodeAt(index2 + 1), options);
  }
}
function charactersToExpressionCached(subset) {
  let cached = subsetToRegexCache.get(subset);
  if (!cached) {
    cached = charactersToExpression(subset);
    subsetToRegexCache.set(subset, cached);
  }
  return cached;
}
function charactersToExpression(subset) {
  const groups = [];
  let index2 = -1;
  while (++index2 < subset.length) {
    groups.push(subset[index2].replace(regexEscapeRegex, "\\$&"));
  }
  return new RegExp("(?:" + groups.join("|") + ")", "g");
}
var defaultSubsetRegex, surrogatePairsRegex, controlCharactersRegex, regexEscapeRegex, subsetToRegexCache;
var init_core = __esm(() => {
  defaultSubsetRegex = /["&'<>`]/g;
  surrogatePairsRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  controlCharactersRegex = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
  regexEscapeRegex = /[|\\{}()[\]^$+*?.]/g;
  subsetToRegexCache = new WeakMap;
});

// node_modules/stringify-entities/lib/util/to-hexadecimal.js
function toHexadecimal(code2, next, omit) {
  const value = "&#x" + code2.toString(16).toUpperCase();
  return omit && next && !hexadecimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
}
var hexadecimalRegex;
var init_to_hexadecimal = __esm(() => {
  hexadecimalRegex = /[\dA-Fa-f]/;
});

// node_modules/stringify-entities/lib/util/to-decimal.js
function toDecimal(code2, next, omit) {
  const value = "&#" + String(code2);
  return omit && next && !decimalRegex.test(String.fromCharCode(next)) ? value : value + ";";
}
var decimalRegex;
var init_to_decimal = __esm(() => {
  decimalRegex = /\d/;
});

// node_modules/character-entities-legacy/index.js
var characterEntitiesLegacy;
var init_character_entities_legacy = __esm(() => {
  characterEntitiesLegacy = [
    "AElig",
    "AMP",
    "Aacute",
    "Acirc",
    "Agrave",
    "Aring",
    "Atilde",
    "Auml",
    "COPY",
    "Ccedil",
    "ETH",
    "Eacute",
    "Ecirc",
    "Egrave",
    "Euml",
    "GT",
    "Iacute",
    "Icirc",
    "Igrave",
    "Iuml",
    "LT",
    "Ntilde",
    "Oacute",
    "Ocirc",
    "Ograve",
    "Oslash",
    "Otilde",
    "Ouml",
    "QUOT",
    "REG",
    "THORN",
    "Uacute",
    "Ucirc",
    "Ugrave",
    "Uuml",
    "Yacute",
    "aacute",
    "acirc",
    "acute",
    "aelig",
    "agrave",
    "amp",
    "aring",
    "atilde",
    "auml",
    "brvbar",
    "ccedil",
    "cedil",
    "cent",
    "copy",
    "curren",
    "deg",
    "divide",
    "eacute",
    "ecirc",
    "egrave",
    "eth",
    "euml",
    "frac12",
    "frac14",
    "frac34",
    "gt",
    "iacute",
    "icirc",
    "iexcl",
    "igrave",
    "iquest",
    "iuml",
    "laquo",
    "lt",
    "macr",
    "micro",
    "middot",
    "nbsp",
    "not",
    "ntilde",
    "oacute",
    "ocirc",
    "ograve",
    "ordf",
    "ordm",
    "oslash",
    "otilde",
    "ouml",
    "para",
    "plusmn",
    "pound",
    "quot",
    "raquo",
    "reg",
    "sect",
    "shy",
    "sup1",
    "sup2",
    "sup3",
    "szlig",
    "thorn",
    "times",
    "uacute",
    "ucirc",
    "ugrave",
    "uml",
    "uuml",
    "yacute",
    "yen",
    "yuml"
  ];
});

// node_modules/character-entities-html4/index.js
var characterEntitiesHtml4;
var init_character_entities_html4 = __esm(() => {
  characterEntitiesHtml4 = {
    nbsp: " ",
    iexcl: "¡",
    cent: "¢",
    pound: "£",
    curren: "¤",
    yen: "¥",
    brvbar: "¦",
    sect: "§",
    uml: "¨",
    copy: "©",
    ordf: "ª",
    laquo: "«",
    not: "¬",
    shy: "­",
    reg: "®",
    macr: "¯",
    deg: "°",
    plusmn: "±",
    sup2: "²",
    sup3: "³",
    acute: "´",
    micro: "µ",
    para: "¶",
    middot: "·",
    cedil: "¸",
    sup1: "¹",
    ordm: "º",
    raquo: "»",
    frac14: "¼",
    frac12: "½",
    frac34: "¾",
    iquest: "¿",
    Agrave: "À",
    Aacute: "Á",
    Acirc: "Â",
    Atilde: "Ã",
    Auml: "Ä",
    Aring: "Å",
    AElig: "Æ",
    Ccedil: "Ç",
    Egrave: "È",
    Eacute: "É",
    Ecirc: "Ê",
    Euml: "Ë",
    Igrave: "Ì",
    Iacute: "Í",
    Icirc: "Î",
    Iuml: "Ï",
    ETH: "Ð",
    Ntilde: "Ñ",
    Ograve: "Ò",
    Oacute: "Ó",
    Ocirc: "Ô",
    Otilde: "Õ",
    Ouml: "Ö",
    times: "×",
    Oslash: "Ø",
    Ugrave: "Ù",
    Uacute: "Ú",
    Ucirc: "Û",
    Uuml: "Ü",
    Yacute: "Ý",
    THORN: "Þ",
    szlig: "ß",
    agrave: "à",
    aacute: "á",
    acirc: "â",
    atilde: "ã",
    auml: "ä",
    aring: "å",
    aelig: "æ",
    ccedil: "ç",
    egrave: "è",
    eacute: "é",
    ecirc: "ê",
    euml: "ë",
    igrave: "ì",
    iacute: "í",
    icirc: "î",
    iuml: "ï",
    eth: "ð",
    ntilde: "ñ",
    ograve: "ò",
    oacute: "ó",
    ocirc: "ô",
    otilde: "õ",
    ouml: "ö",
    divide: "÷",
    oslash: "ø",
    ugrave: "ù",
    uacute: "ú",
    ucirc: "û",
    uuml: "ü",
    yacute: "ý",
    thorn: "þ",
    yuml: "ÿ",
    fnof: "ƒ",
    Alpha: "Α",
    Beta: "Β",
    Gamma: "Γ",
    Delta: "Δ",
    Epsilon: "Ε",
    Zeta: "Ζ",
    Eta: "Η",
    Theta: "Θ",
    Iota: "Ι",
    Kappa: "Κ",
    Lambda: "Λ",
    Mu: "Μ",
    Nu: "Ν",
    Xi: "Ξ",
    Omicron: "Ο",
    Pi: "Π",
    Rho: "Ρ",
    Sigma: "Σ",
    Tau: "Τ",
    Upsilon: "Υ",
    Phi: "Φ",
    Chi: "Χ",
    Psi: "Ψ",
    Omega: "Ω",
    alpha: "α",
    beta: "β",
    gamma: "γ",
    delta: "δ",
    epsilon: "ε",
    zeta: "ζ",
    eta: "η",
    theta: "θ",
    iota: "ι",
    kappa: "κ",
    lambda: "λ",
    mu: "μ",
    nu: "ν",
    xi: "ξ",
    omicron: "ο",
    pi: "π",
    rho: "ρ",
    sigmaf: "ς",
    sigma: "σ",
    tau: "τ",
    upsilon: "υ",
    phi: "φ",
    chi: "χ",
    psi: "ψ",
    omega: "ω",
    thetasym: "ϑ",
    upsih: "ϒ",
    piv: "ϖ",
    bull: "•",
    hellip: "…",
    prime: "′",
    Prime: "″",
    oline: "‾",
    frasl: "⁄",
    weierp: "℘",
    image: "ℑ",
    real: "ℜ",
    trade: "™",
    alefsym: "ℵ",
    larr: "←",
    uarr: "↑",
    rarr: "→",
    darr: "↓",
    harr: "↔",
    crarr: "↵",
    lArr: "⇐",
    uArr: "⇑",
    rArr: "⇒",
    dArr: "⇓",
    hArr: "⇔",
    forall: "∀",
    part: "∂",
    exist: "∃",
    empty: "∅",
    nabla: "∇",
    isin: "∈",
    notin: "∉",
    ni: "∋",
    prod: "∏",
    sum: "∑",
    minus: "−",
    lowast: "∗",
    radic: "√",
    prop: "∝",
    infin: "∞",
    ang: "∠",
    and: "∧",
    or: "∨",
    cap: "∩",
    cup: "∪",
    int: "∫",
    there4: "∴",
    sim: "∼",
    cong: "≅",
    asymp: "≈",
    ne: "≠",
    equiv: "≡",
    le: "≤",
    ge: "≥",
    sub: "⊂",
    sup: "⊃",
    nsub: "⊄",
    sube: "⊆",
    supe: "⊇",
    oplus: "⊕",
    otimes: "⊗",
    perp: "⊥",
    sdot: "⋅",
    lceil: "⌈",
    rceil: "⌉",
    lfloor: "⌊",
    rfloor: "⌋",
    lang: "〈",
    rang: "〉",
    loz: "◊",
    spades: "♠",
    clubs: "♣",
    hearts: "♥",
    diams: "♦",
    quot: '"',
    amp: "&",
    lt: "<",
    gt: ">",
    OElig: "Œ",
    oelig: "œ",
    Scaron: "Š",
    scaron: "š",
    Yuml: "Ÿ",
    circ: "ˆ",
    tilde: "˜",
    ensp: " ",
    emsp: " ",
    thinsp: " ",
    zwnj: "‌",
    zwj: "‍",
    lrm: "‎",
    rlm: "‏",
    ndash: "–",
    mdash: "—",
    lsquo: "‘",
    rsquo: "’",
    sbquo: "‚",
    ldquo: "“",
    rdquo: "”",
    bdquo: "„",
    dagger: "†",
    Dagger: "‡",
    permil: "‰",
    lsaquo: "‹",
    rsaquo: "›",
    euro: "€"
  };
});

// node_modules/stringify-entities/lib/constant/dangerous.js
var dangerous;
var init_dangerous = __esm(() => {
  dangerous = [
    "cent",
    "copy",
    "divide",
    "gt",
    "lt",
    "not",
    "para",
    "times"
  ];
});

// node_modules/stringify-entities/lib/util/to-named.js
function toNamed(code2, next, omit, attribute) {
  const character = String.fromCharCode(code2);
  if (own5.call(characters, character)) {
    const name = characters[character];
    const value = "&" + name;
    if (omit && characterEntitiesLegacy.includes(name) && !dangerous.includes(name) && (!attribute || next && next !== 61 && notAlphanumericRegex.test(String.fromCharCode(next)))) {
      return value;
    }
    return value + ";";
  }
  return "";
}
var own5, characters, key, notAlphanumericRegex;
var init_to_named = __esm(() => {
  init_character_entities_legacy();
  init_character_entities_html4();
  init_dangerous();
  own5 = {}.hasOwnProperty;
  characters = {};
  for (key in characterEntitiesHtml4) {
    if (own5.call(characterEntitiesHtml4, key)) {
      characters[characterEntitiesHtml4[key]] = key;
    }
  }
  notAlphanumericRegex = /[^\dA-Za-z]/;
});

// node_modules/stringify-entities/lib/util/format-smart.js
function formatSmart(code2, next, options) {
  let numeric = toHexadecimal(code2, next, options.omitOptionalSemicolons);
  let named;
  if (options.useNamedReferences || options.useShortestReferences) {
    named = toNamed(code2, next, options.omitOptionalSemicolons, options.attribute);
  }
  if ((options.useShortestReferences || !named) && options.useShortestReferences) {
    const decimal = toDecimal(code2, next, options.omitOptionalSemicolons);
    if (decimal.length < numeric.length) {
      numeric = decimal;
    }
  }
  return named && (!options.useShortestReferences || named.length < numeric.length) ? named : numeric;
}
var init_format_smart = __esm(() => {
  init_to_hexadecimal();
  init_to_decimal();
  init_to_named();
});

// node_modules/stringify-entities/lib/index.js
function stringifyEntities(value, options) {
  return core2(value, Object.assign({ format: formatSmart }, options));
}
var init_lib12 = __esm(() => {
  init_core();
  init_format_smart();
});

// node_modules/stringify-entities/index.js
var init_stringify_entities = __esm(() => {
  init_lib12();
});

// node_modules/hast-util-to-html/lib/handle/comment.js
function comment(node2, _1, _2, state) {
  return state.settings.bogusComments ? "<?" + stringifyEntities(node2.value, Object.assign({}, state.settings.characterReferences, {
    subset: bogusCommentEntitySubset
  })) + ">" : "<!--" + node2.value.replace(htmlCommentRegex, encode) + "-->";
  function encode($0) {
    return stringifyEntities($0, Object.assign({}, state.settings.characterReferences, {
      subset: commentEntitySubset
    }));
  }
}
var htmlCommentRegex, bogusCommentEntitySubset, commentEntitySubset;
var init_comment = __esm(() => {
  init_stringify_entities();
  htmlCommentRegex = /^>|^->|<!--|-->|--!>|<!-$/g;
  bogusCommentEntitySubset = [">"];
  commentEntitySubset = ["<", ">"];
});

// node_modules/hast-util-to-html/lib/handle/doctype.js
function doctype(_1, _2, _3, state) {
  return "<!" + (state.settings.upperDoctype ? "DOCTYPE" : "doctype") + (state.settings.tightDoctype ? "" : " ") + "html>";
}

// node_modules/ccount/index.js
function ccount(value, character) {
  const source = String(value);
  if (typeof character !== "string") {
    throw new TypeError("Expected character");
  }
  let count = 0;
  let index2 = source.indexOf(character);
  while (index2 !== -1) {
    count++;
    index2 = source.indexOf(character, index2 + character.length);
  }
  return count;
}

// node_modules/comma-separated-tokens/index.js
function stringify(values2, options) {
  const settings = options || {};
  const input = values2[values2.length - 1] === "" ? [...values2, ""] : values2;
  return input.join((settings.padRight ? " " : "") + "," + (settings.padLeft === false ? "" : " ")).trim();
}

// node_modules/space-separated-tokens/index.js
function stringify2(values2) {
  return values2.join(" ").trim();
}

// node_modules/hast-util-whitespace/lib/index.js
function whitespace(thing) {
  return typeof thing === "object" ? thing.type === "text" ? empty2(thing.value) : false : empty2(thing);
}
function empty2(value) {
  return value.replace(re2, "") === "";
}
var re2;
var init_lib13 = __esm(() => {
  re2 = /[ \t\n\f\r]/g;
});

// node_modules/hast-util-whitespace/index.js
var init_hast_util_whitespace = __esm(() => {
  init_lib13();
});

// node_modules/hast-util-to-html/lib/omission/util/siblings.js
function siblings(increment2) {
  return sibling;
  function sibling(parent, index2, includeWhitespace) {
    const siblings2 = parent ? parent.children : emptyChildren;
    let offset = (index2 || 0) + increment2;
    let next = siblings2[offset];
    if (!includeWhitespace) {
      while (next && whitespace(next)) {
        offset += increment2;
        next = siblings2[offset];
      }
    }
    return next;
  }
}
var siblingAfter, siblingBefore, emptyChildren;
var init_siblings = __esm(() => {
  init_hast_util_whitespace();
  siblingAfter = siblings(1);
  siblingBefore = siblings(-1);
  emptyChildren = [];
});

// node_modules/hast-util-to-html/lib/omission/omission.js
function omission(handlers2) {
  return omit;
  function omit(node2, index2, parent) {
    return own6.call(handlers2, node2.tagName) && handlers2[node2.tagName](node2, index2, parent);
  }
}
var own6;
var init_omission = __esm(() => {
  own6 = {}.hasOwnProperty;
});

// node_modules/hast-util-to-html/lib/omission/closing.js
function headOrColgroupOrCaption(_2, index2, parent) {
  const next = siblingAfter(parent, index2, true);
  return !next || next.type !== "comment" && !(next.type === "text" && whitespace(next.value.charAt(0)));
}
function html4(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type !== "comment";
}
function body(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type !== "comment";
}
function p(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return next ? next.type === "element" && (next.tagName === "address" || next.tagName === "article" || next.tagName === "aside" || next.tagName === "blockquote" || next.tagName === "details" || next.tagName === "div" || next.tagName === "dl" || next.tagName === "fieldset" || next.tagName === "figcaption" || next.tagName === "figure" || next.tagName === "footer" || next.tagName === "form" || next.tagName === "h1" || next.tagName === "h2" || next.tagName === "h3" || next.tagName === "h4" || next.tagName === "h5" || next.tagName === "h6" || next.tagName === "header" || next.tagName === "hgroup" || next.tagName === "hr" || next.tagName === "main" || next.tagName === "menu" || next.tagName === "nav" || next.tagName === "ol" || next.tagName === "p" || next.tagName === "pre" || next.tagName === "section" || next.tagName === "table" || next.tagName === "ul") : !parent || !(parent.type === "element" && (parent.tagName === "a" || parent.tagName === "audio" || parent.tagName === "del" || parent.tagName === "ins" || parent.tagName === "map" || parent.tagName === "noscript" || parent.tagName === "video"));
}
function li(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && next.tagName === "li";
}
function dt(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return Boolean(next && next.type === "element" && (next.tagName === "dt" || next.tagName === "dd"));
}
function dd(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "dt" || next.tagName === "dd");
}
function rubyElement(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "rp" || next.tagName === "rt");
}
function optgroup(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && next.tagName === "optgroup";
}
function option(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "option" || next.tagName === "optgroup");
}
function thead(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return Boolean(next && next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot"));
}
function tbody(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "tbody" || next.tagName === "tfoot");
}
function tfoot(_2, index2, parent) {
  return !siblingAfter(parent, index2);
}
function tr(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && next.tagName === "tr";
}
function cells(_2, index2, parent) {
  const next = siblingAfter(parent, index2);
  return !next || next.type === "element" && (next.tagName === "td" || next.tagName === "th");
}
var closing;
var init_closing = __esm(() => {
  init_hast_util_whitespace();
  init_siblings();
  init_omission();
  closing = omission({
    body,
    caption: headOrColgroupOrCaption,
    colgroup: headOrColgroupOrCaption,
    dd,
    dt,
    head: headOrColgroupOrCaption,
    html: html4,
    li,
    optgroup,
    option,
    p,
    rp: rubyElement,
    rt: rubyElement,
    tbody,
    td: cells,
    tfoot,
    th: cells,
    thead,
    tr
  });
});

// node_modules/hast-util-to-html/lib/omission/opening.js
function html5(node2) {
  const head = siblingAfter(node2, -1);
  return !head || head.type !== "comment";
}
function head(node2) {
  const seen = new Set;
  for (const child2 of node2.children) {
    if (child2.type === "element" && (child2.tagName === "base" || child2.tagName === "title")) {
      if (seen.has(child2.tagName))
        return false;
      seen.add(child2.tagName);
    }
  }
  const child = node2.children[0];
  return !child || child.type === "element";
}
function body2(node2) {
  const head2 = siblingAfter(node2, -1, true);
  return !head2 || head2.type !== "comment" && !(head2.type === "text" && whitespace(head2.value.charAt(0))) && !(head2.type === "element" && (head2.tagName === "meta" || head2.tagName === "link" || head2.tagName === "script" || head2.tagName === "style" || head2.tagName === "template"));
}
function colgroup(node2, index2, parent) {
  const previous2 = siblingBefore(parent, index2);
  const head2 = siblingAfter(node2, -1, true);
  if (parent && previous2 && previous2.type === "element" && previous2.tagName === "colgroup" && closing(previous2, parent.children.indexOf(previous2), parent)) {
    return false;
  }
  return Boolean(head2 && head2.type === "element" && head2.tagName === "col");
}
function tbody2(node2, index2, parent) {
  const previous2 = siblingBefore(parent, index2);
  const head2 = siblingAfter(node2, -1);
  if (parent && previous2 && previous2.type === "element" && (previous2.tagName === "thead" || previous2.tagName === "tbody") && closing(previous2, parent.children.indexOf(previous2), parent)) {
    return false;
  }
  return Boolean(head2 && head2.type === "element" && head2.tagName === "tr");
}
var opening;
var init_opening = __esm(() => {
  init_hast_util_whitespace();
  init_siblings();
  init_closing();
  init_omission();
  opening = omission({
    body: body2,
    colgroup,
    head,
    html: html5,
    tbody: tbody2
  });
});

// node_modules/hast-util-to-html/lib/handle/element.js
function element2(node2, index2, parent, state) {
  const schema2 = state.schema;
  const omit = schema2.space === "svg" ? false : state.settings.omitOptionalTags;
  let selfClosing = schema2.space === "svg" ? state.settings.closeEmptyElements : state.settings.voids.includes(node2.tagName.toLowerCase());
  const parts = [];
  let last;
  if (schema2.space === "html" && node2.tagName === "svg") {
    state.schema = svg2;
  }
  const attributes = serializeAttributes(state, node2.properties);
  const content3 = state.all(schema2.space === "html" && node2.tagName === "template" ? node2.content : node2);
  state.schema = schema2;
  if (content3)
    selfClosing = false;
  if (attributes || !omit || !opening(node2, index2, parent)) {
    parts.push("<", node2.tagName, attributes ? " " + attributes : "");
    if (selfClosing && (schema2.space === "svg" || state.settings.closeSelfClosing)) {
      last = attributes.charAt(attributes.length - 1);
      if (!state.settings.tightSelfClosing || last === "/" || last && last !== '"' && last !== "'") {
        parts.push(" ");
      }
      parts.push("/");
    }
    parts.push(">");
  }
  parts.push(content3);
  if (!selfClosing && (!omit || !closing(node2, index2, parent))) {
    parts.push("</" + node2.tagName + ">");
  }
  return parts.join("");
}
function serializeAttributes(state, properties) {
  const values2 = [];
  let index2 = -1;
  let key2;
  if (properties) {
    for (key2 in properties) {
      if (properties[key2] !== null && properties[key2] !== undefined) {
        const value = serializeAttribute(state, key2, properties[key2]);
        if (value)
          values2.push(value);
      }
    }
  }
  while (++index2 < values2.length) {
    const last = state.settings.tightAttributes ? values2[index2].charAt(values2[index2].length - 1) : undefined;
    if (index2 !== values2.length - 1 && last !== '"' && last !== "'") {
      values2[index2] += " ";
    }
  }
  return values2.join("");
}
function serializeAttribute(state, key2, value) {
  const info = find(state.schema, key2);
  const x2 = state.settings.allowParseErrors && state.schema.space === "html" ? 0 : 1;
  const y2 = state.settings.allowDangerousCharacters ? 0 : 1;
  let quote = state.quote;
  let result;
  if (info.overloadedBoolean && (value === info.attribute || value === "")) {
    value = true;
  } else if ((info.boolean || info.overloadedBoolean) && (typeof value !== "string" || value === info.attribute || value === "")) {
    value = Boolean(value);
  }
  if (value === null || value === undefined || value === false || typeof value === "number" && Number.isNaN(value)) {
    return "";
  }
  const name = stringifyEntities(info.attribute, Object.assign({}, state.settings.characterReferences, {
    subset: constants2.name[x2][y2]
  }));
  if (value === true)
    return name;
  value = Array.isArray(value) ? (info.commaSeparated ? stringify : stringify2)(value, {
    padLeft: !state.settings.tightCommaSeparatedLists
  }) : String(value);
  if (state.settings.collapseEmptyAttributes && !value)
    return name;
  if (state.settings.preferUnquoted) {
    result = stringifyEntities(value, Object.assign({}, state.settings.characterReferences, {
      attribute: true,
      subset: constants2.unquoted[x2][y2]
    }));
  }
  if (result !== value) {
    if (state.settings.quoteSmart && ccount(value, quote) > ccount(value, state.alternative)) {
      quote = state.alternative;
    }
    result = quote + stringifyEntities(value, Object.assign({}, state.settings.characterReferences, {
      subset: (quote === "'" ? constants2.single : constants2.double)[x2][y2],
      attribute: true
    })) + quote;
  }
  return name + (result ? "=" + result : result);
}
var constants2;
var init_element = __esm(() => {
  init_property_information();
  init_stringify_entities();
  init_closing();
  init_opening();
  constants2 = {
    name: [
      [`	
\f\r &/=>`.split(""), `	
\f\r "&'/=>\``.split("")],
      [`\x00	
\f\r "&'/<=>`.split(""), `\x00	
\f\r "&'/<=>\``.split("")]
    ],
    unquoted: [
      [`	
\f\r &>`.split(""), `\x00	
\f\r "&'<=>\``.split("")],
      [`\x00	
\f\r "&'<=>\``.split(""), `\x00	
\f\r "&'<=>\``.split("")]
    ],
    single: [
      ["&'".split(""), "\"&'`".split("")],
      ["\x00&'".split(""), "\x00\"&'`".split("")]
    ],
    double: [
      ['"&'.split(""), "\"&'`".split("")],
      ['\x00"&'.split(""), "\x00\"&'`".split("")]
    ]
  };
});

// node_modules/hast-util-to-html/lib/handle/text.js
function text4(node2, _2, parent, state) {
  return parent && parent.type === "element" && (parent.tagName === "script" || parent.tagName === "style") ? node2.value : stringifyEntities(node2.value, Object.assign({}, state.settings.characterReferences, {
    subset: textEntitySubset
  }));
}
var textEntitySubset;
var init_text3 = __esm(() => {
  init_stringify_entities();
  textEntitySubset = ["<", "&"];
});

// node_modules/hast-util-to-html/lib/handle/raw.js
function raw(node2, index2, parent, state) {
  return state.settings.allowDangerousHtml ? node2.value : text4(node2, index2, parent, state);
}
var init_raw = __esm(() => {
  init_text3();
});

// node_modules/hast-util-to-html/lib/handle/root.js
function root2(node2, _1, _2, state) {
  return state.all(node2);
}

// node_modules/hast-util-to-html/lib/handle/index.js
function invalid(node2) {
  throw new Error("Expected node, not `" + node2 + "`");
}
function unknown(node_) {
  const node2 = node_;
  throw new Error("Cannot compile unknown node `" + node2.type + "`");
}
var handle;
var init_handle = __esm(() => {
  init_zwitch();
  init_comment();
  init_element();
  init_raw();
  init_text3();
  handle = zwitch("type", {
    invalid,
    unknown,
    handlers: { comment, doctype, element: element2, raw, root: root2, text: text4 }
  });
});

// node_modules/hast-util-to-html/lib/index.js
function toHtml(tree, options) {
  const options_ = options || emptyOptions3;
  const quote = options_.quote || '"';
  const alternative = quote === '"' ? "'" : '"';
  if (quote !== '"' && quote !== "'") {
    throw new Error("Invalid quote `" + quote + "`, expected `'` or `\"`");
  }
  const state = {
    one: one2,
    all: all2,
    settings: {
      omitOptionalTags: options_.omitOptionalTags || false,
      allowParseErrors: options_.allowParseErrors || false,
      allowDangerousCharacters: options_.allowDangerousCharacters || false,
      quoteSmart: options_.quoteSmart || false,
      preferUnquoted: options_.preferUnquoted || false,
      tightAttributes: options_.tightAttributes || false,
      upperDoctype: options_.upperDoctype || false,
      tightDoctype: options_.tightDoctype || false,
      bogusComments: options_.bogusComments || false,
      tightCommaSeparatedLists: options_.tightCommaSeparatedLists || false,
      tightSelfClosing: options_.tightSelfClosing || false,
      collapseEmptyAttributes: options_.collapseEmptyAttributes || false,
      allowDangerousHtml: options_.allowDangerousHtml || false,
      voids: options_.voids || htmlVoidElements,
      characterReferences: options_.characterReferences || emptyCharacterReferences,
      closeSelfClosing: options_.closeSelfClosing || false,
      closeEmptyElements: options_.closeEmptyElements || false
    },
    schema: options_.space === "svg" ? svg2 : html3,
    quote,
    alternative
  };
  return state.one(Array.isArray(tree) ? { type: "root", children: tree } : tree, undefined, undefined);
}
function one2(node2, index2, parent) {
  return handle(node2, index2, parent, this);
}
function all2(parent) {
  const results = [];
  const children = parent && parent.children || emptyChildren2;
  let index2 = -1;
  while (++index2 < children.length) {
    results[index2] = this.one(children[index2], index2, parent);
  }
  return results.join("");
}
var emptyOptions3, emptyCharacterReferences, emptyChildren2;
var init_lib14 = __esm(() => {
  init_html_void_elements();
  init_property_information();
  init_handle();
  emptyOptions3 = {};
  emptyCharacterReferences = {};
  emptyChildren2 = [];
});

// node_modules/hast-util-to-html/index.js
var init_hast_util_to_html = __esm(() => {
  init_lib14();
});

// node_modules/rehype-stringify/lib/index.js
function rehypeStringify(options) {
  const self2 = this;
  const settings = { ...self2.data("settings"), ...options };
  self2.compiler = compiler2;
  function compiler2(tree) {
    return toHtml(tree, settings);
  }
}
var init_lib15 = __esm(() => {
  init_hast_util_to_html();
});

// node_modules/rehype-stringify/index.js
var init_rehype_stringify = __esm(() => {
  init_lib15();
});

// public/utils.ts
var exports_utils = {};
__export(exports_utils, {
  subTitleize: () => subTitleize,
  red: () => red,
  postToServer: () => postToServer,
  markdown: () => markdown,
  listenBtn: () => listenBtn,
  green: () => green,
  blue: () => blue
});
async function postToServer(route, data) {
  if (route.startsWith("/")) {
    route = route.substring(1, route.length);
  }
  const controller = new AbortController;
  const timeoutId = setTimeout(() => controller.abort(), 30 * 60 * 1000);
  let response;
  try {
    response = await fetch(HOST + route, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then((r) => r.json());
  } catch (err) {
    console.error(err);
    response = { ok: false, error: `ERREUR postToServer: ${err.message}` };
  } finally {
    clearTimeout(timeoutId);
  }
  return response;
}
function listenBtn(id, method, container = document.body) {
  DGet(`button.btn-${id}`, container).addEventListener("click", method);
}
function markdown(md) {
  md = md.replace(/^(\#+?)/mg, "$1##");
  const result = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).processSync(md);
  const html6 = String(result);
  return html6;
}
function red(msg) {
  return colorize(msg, "31");
}
function green(msg) {
  return colorize(msg, "32");
}
function blue(msg) {
  return colorize(msg, "34");
}
function colorize(msg, color2) {
  return `\x1B[${color2}m${msg}\x1B[0m`;
}
function subTitleize(titre, car = "-") {
  return titre + `
` + new Array(titre.length + 1).join(car);
}
var init_utils = __esm(() => {
  init_constants();
  init_unified();
  init_remark_parse();
  init_remark_rehype();
  init_rehype_stringify();
});

// lib/Locale.ts
var {readFileSync} = (() => ({}));
function t(route, params) {
  if (params) {
    const template = loc.translate(route);
    for (var i2 in params) {
      const regexp = new RegExp(`_${i2}_`, "g");
      template.replace(regexp, params[i2]);
    }
    return template;
  } else {
    return loc.translate(route);
  }
}
function tt(text5) {
  return loc.translateText(text5);
}

class Locale {
  BASEFILES = ["messages", "ui", "help"];
  getLocales() {
    return this.locales;
  }
  translateText(texte) {
    return texte.replace(/\bt\((.+?)\)/g, this.replacementMethod.bind(this));
  }
  translate(route) {
    const translated = route.split(".").reduce((obj, key2) => obj?.[key2], this.locales);
    return typeof translated === "string" ? translated : `[LOC: ${route}]`;
  }
  replacementMethod(tout, route) {
    return this.translate(route);
  }
  async init(lang) {
    if (typeof window === "undefined") {
      this.locales = {};
      const folderLang = path_default.join(LOCALES_FOLDER, lang);
      this.BASEFILES.forEach((base) => {
        const pathLocale = path_default.join(folderLang, `${base}.yaml`);
        Object.assign(this.locales, js_yaml_default.load(readFileSync(pathLocale, "utf8")));
      });
    } else {
      const { postToServer: postToServer2 } = await Promise.resolve().then(() => (init_utils(), exports_utils));
      const { prefs } = await Promise.resolve().then(() => (init_prefs(), exports_prefs));
      const { Flash: Flash2 } = await Promise.resolve().then(() => (init_flash(), exports_flash));
      const retour = await postToServer2("localization/get-all", { lang: prefs.getLang() });
      if (retour.ok) {
        this.locales = retour.locales;
      } else {
        Flash2.error("Impossible to load locales… I can only speaking english, sorry…");
      }
    }
  }
  locales;
  constructor() {}
  static getInstance() {
    return this.inst || (this.inst = new Locale);
  }
  static inst;
}
var __dirname = "/Users/philippeperret/Programmes/EqualTaskCycle/lib", LOCALES_FOLDER, loc;
var init_Locale = __esm(() => {
  init_path();
  init_js_yaml();
  LOCALES_FOLDER = path_default.resolve(path_default.join(__dirname, "locales"));
  loc = Locale.getInstance();
});

// public/help.ts
class Help {
  static getInstance() {
    return this.inst || (this.inst = new Help);
  }
  static inst;
  texts;
  async show(helpIds) {
    this.isOpened() || ui.toggleHelp();
    this.texts = helpIds.map((helpId) => {
      let texte = HELP_TEXTS[helpId];
      if (texte.indexOf("help(")) {
        texte = texte.replace(/\bhelp\((.+?)\)/g, (_tout, liste) => {
          return liste.split(",").map((hid) => {
            hid = hid.trim();
            return HELP_TEXTS[hid];
          }).join(`

`);
        });
      }
      return `<a id="help-${helpId}" name="${helpId}"></a>

` + this.finalizeText(tt(texte)).trim().concat(`

---`);
    });
    this.timer = setInterval(() => {
      this.writeText.bind(this)();
      DGet(`a#help-${helpIds[0]}`).scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  }
  timer;
  finalizeText(text5) {
    text5 = text5.replace(/\bhlink\((.+?)\)/g, (_tout, args) => {
      const [tit, hid] = args.split(",").map((s) => s.trim());
      return `<span onclick="help.show(['${hid}'])">${tit}</span>`;
    });
    while (text5.match(/\bt\(/)) {
      text5 = loc.translateText(text5);
    }
    return text5;
  }
  writeText() {
    var text5;
    if (text5 = this.texts.shift()) {
      this.write(k.parse(text5));
    } else {
      clearInterval(this.timer);
      delete this.timer;
    }
  }
  close() {
    ui.toggleHelp();
  }
  write(text5) {
    this.content.insertAdjacentHTML("beforeend", text5);
    return true;
  }
  isOpened() {
    return !this.obj.classList.contains("hidden");
  }
  get obj() {
    return this._obj || (this._obj = DGet("section#help"));
  }
  _obj;
  get content() {
    return this._content || (this._content = DGet("div#help-content", DGet("section#help")));
  }
  _content;
  init() {
    DGet("button.btn-close-help").addEventListener("click", this.close.bind(this));
    listenBtn("help-toggle", this.show.bind(this, ["resume_home_page"]));
  }
}
var HELP_TEXTS, help;
var init_help = __esm(() => {
  init_marked_esm();
  init_ui();
  init_Locale();
  init_utils();
  HELP_TEXTS = {
    resume_home_page: `
help(introduction, terminologie, task_list)
  `,
    introduction: `
### t(help.intro.title)

t(help.intro.text)
`,
    terminologie: `
### t(help.term.title)

*(D'abord un peu de terminologie pour bien comprendre l'aide)*

t(help.term.text)
  `,
    task_list: `
### t(help.task_list.title)

t(help.task_list.text)
`,
    task_data: `
### t(help.task_data.title)

t(help.task_data.text)
`,
    duree_cycle_vs_duree_sess: `
# t(help.durcycvsdursess.title)

t(help.durcycvsdursess.text)
`
  };
  help = Help.getInstance();
  help.init();
  window.help = help;
});

// lib/types.ts
var WorkProps;
var init_types3 = __esm(() => {
  WorkProps = ["active", "id", "project", "content", "duration", "folder", "script"];
});

// node_modules/nanoid/url-alphabet/index.js
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

// node_modules/nanoid/index.browser.js
var nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
var init_index_browser = () => {};

// public/editing.ts
class Editing {
  get section() {
    return DGet("section#editing");
  }
  get configContainer() {
    return this._configcont || (this._configcont = DGet("#editing-config-container", this.section));
  }
  _configcont;
  getAllData() {
    const AllData = this.collectConfigData();
    Object.assign(AllData, { works: this.collectTaskData() });
    return AllData;
  }
  collectConfigData() {
    const configData = {
      duration: Number(this.getConfProp("duration")),
      theme: this.getConfProp("theme")
    };
    return configData;
  }
  getConfProp(prop) {
    return DGet(`#config-data-${prop}`, this.configContainer).value;
  }
  setConfigData(data) {
    ConfigProperties.forEach((paire) => {
      const [prop, defaultValue] = paire;
      this.setConfProp(prop, data[prop] || defaultValue);
    });
  }
  setConfProp(prop, value) {
    DGet(`#config-data-${prop}`, this.configContainer).value = value;
  }
  collectTaskData() {
    const newTaskData = [];
    this.taskContainer.querySelectorAll(".editing-form-task").forEach((form) => {
      newTaskData.push(this.getTaskDataIn(form));
    });
    return newTaskData;
  }
  getTaskDataIn(form) {
    const taskData = {};
    WorkProps.forEach((prop) => {
      let value = DGet(`.form-task-${prop}`, form).value;
      if (value !== "") {
        if (prop === "active") {
          value = (0, eval)(value);
        } else if (prop === "duration") {
          value = Number(value);
        }
        Object.assign(taskData, { [prop]: value });
      }
    });
    return taskData;
  }
  async startEditing() {
    ui.toggleSection("editing");
    const container = this.taskContainer;
    container.innerHTML = "";
    const retour = await postToServer("tasks/all", { dataPath: prefs.getValue("file") });
    if (retour.ok === false) {
      return Flash.error(retour.error);
    }
    this.setConfigData(retour.data);
    const works = retour.data.works;
    DGet("span#tasks-count", this.section).innerHTML = works.length;
    works.forEach((work) => {
      this.createNewTask(work);
    });
  }
  get formClone() {
    return this._formtemp || (this._formtemp = this.section.querySelector(".editing-form-task"));
  }
  createNewTask(work) {
    const owork = this.formClone.cloneNode(true);
    this.taskContainer.appendChild(owork);
    this.peupleWorkForm(owork, work);
    this.observeWorkForm(owork, work);
    owork.classList.remove("hidden");
    if (work.active)
      owork.classList.remove("off");
    return owork;
  }
  peupleWorkForm(obj, work) {
    WorkProps.forEach((prop) => {
      const field = DGet(`.form-task-${prop}`, obj);
      let value = work[prop];
      if (prop === "active") {
        if (value === undefined) {
          value = true;
        }
        value = String(value);
      }
      field.value = String(value || "");
    });
    DGet("span.task-id-disp", obj).innerHTML = work.id;
  }
  observeWorkForm(owork, work) {
    listenBtn("up", this.onUp.bind(this, owork), owork);
    listenBtn("down", this.onDown.bind(this, owork), owork);
    listenBtn("remove", this.onRemove.bind(this, work), owork);
    const menuActive = DGet(".form-task-active", owork);
    menuActive.addEventListener("change", (ev) => {
      const actif = menuActive.value === "true";
      owork.classList[actif ? "remove" : "add"]("off");
    });
  }
  onUp(owork, ev) {
    if (owork.previousSibling) {
      owork.parentNode.insertBefore(owork, owork.previousSibling);
    }
  }
  onDown(owork, ev) {
    if (owork.nextSibling) {
      if (owork.nextSibling.nextSibling) {
        owork.parentNode.insertBefore(owork, owork.nextSibling.nextSibling);
      } else {
        owork.parentNode.appendChild(owork);
      }
    }
  }
  onRemove(work, ev) {
    Flash.notice(t("task.destroy", [work.id]));
  }
  get taskContainer() {
    return DGet("div#editing-tasks-container");
  }
  onAddTask() {
    const owork = this.createNewTask({
      id: nanoid(),
      project: t("ui.text.your_project"),
      content: t("ui.text.temp_description"),
      folder: t("ui.text.path_example"),
      active: false
    });
    owork.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  onSaveData() {
    postToServer("/tasks/save", this.getAllData());
  }
  stopEditing() {
    ui.toggleSection("work");
  }
  init() {
    this.observeButtons();
  }
  observeButtons() {
    listenBtn("editing-start", this.startEditing.bind(this));
    listenBtn("editing-end", this.stopEditing.bind(this));
    listenBtn("editing-add", this.onAddTask.bind(this));
    listenBtn("editing-save", this.onSaveData.bind(this));
  }
  static getIntance() {
    return this._inst || (this._inst = new Editing);
  }
  static _inst;
  constructor() {}
  _formtemp;
}
var ConfigProperties, editor;
var init_editing = __esm(() => {
  init_types3();
  init_flash();
  init_prefs();
  init_ui();
  init_utils();
  init_index_browser();
  init_Locale();
  ConfigProperties = [
    ["duration", 120],
    ["theme", t("ui.adj.light")]
  ];
  editor = Editing.getIntance();
});

// public/end_work_report.ts
class EndWorkReport {
  work;
  inited = false;
  constructor(work) {
    this.work = work;
  }
  async writeReport() {
    return new Promise((ok3, ko) => {
      this.ok = ok3;
      this.ko = ko;
      this.open();
    });
  }
  ok;
  ko;
  open() {
    this.inited || this.init();
    this.reset();
    this.show();
  }
  close() {
    this.hide();
  }
  onSave(ev) {
    this.close();
    this.ok(this.getContent());
    ev && stopEvent(ev);
    return false;
  }
  onDontSave(ev) {
    this.close();
    this.ok(false);
    ev && stopEvent(ev);
    return false;
  }
  onTemplate(ev) {
    if (this.getContent().length) {
      Flash.error(t("report.empty_content"));
    } else {
      this.setContent(this.TEMPLATES[0]);
    }
    return ev && stopEvent(ev);
  }
  getContent() {
    return this.contentField.value;
  }
  setContent(s) {
    this.contentField.value = s;
  }
  init() {
    this.contentField.setAttribute("placeholder", t("ui.text.description_stop_report_modele"));
    DGet("#ETR-explication", this.obj).innerText = t("ui.text.description_stop_report");
    this.observeButtons();
  }
  observeButtons() {
    listenBtn("etr-save", this.onSave.bind(this));
    listenBtn("etr-dont-save", this.onDontSave.bind(this));
    listenBtn("etr-template", this.onTemplate.bind(this));
  }
  reset() {
    this.contentField.value = "";
  }
  show() {
    this.obj.classList.remove("hidden");
  }
  hide() {
    this.obj.classList.add("hidden");
  }
  id;
  get contentField() {
    return this._contfield || (this._contfield = DGet("textarea#ETR-report", this.obj));
  }
  get obj() {
    return this._obj || (this._obj = DGet("div#ETR-container"));
  }
  _contfield;
  _obj;
  TEMPLATES = [
    `
    *(Taking up the baton for the next work session)*
    ## Main Goal : 

    ## Main Tasks :
    - 
    -
    -

    ## Main Usefull Files :
    - 
    - 
    - 

    ## Remarque
    *(mind about this)*

    ## Config Note
    *(note about curren config or situation)*

    `
  ];
}
var init_end_work_report = __esm(() => {
  init_utils();
  init_flash();
  init_Locale();
});

// public/work_client.ts
class Work {
  data;
  static async init() {
    console.log("-> Initialisation de Work");
    const res = await this.getCurrent();
    if (res === true) {
      prefs.init();
      editor.init();
      Flash.notice(`${t("app.is_ready")} <span id="mes123">(${t("help.show")})</span>`);
      DGet("span#mes123").addEventListener("click", help.show.bind(help, ["resume_home_page"]), { once: true, capture: true });
    }
  }
  static currentWork;
  static async addTimeToCurrentWork(time) {
    if (time) {
      await this.currentWork.addTimeAndSave(time);
    } else {
      Flash.error(t("times.to_short_to_be_saved"));
    }
  }
  async addTimeAndSave(time) {
    this.data.totalTime += time;
    this.data.cycleTime += time;
    this.data.restTime -= time;
    if (this.data.restTime < 0) {
      this.data.restTime = 0;
    }
    if (this.data.cycleCount === 0) {
      this.data.cycleCount = 1;
      this.data.startedAt = clock.getStartTime();
    }
    this.data.lastWorkedAt = clock.getStartTime();
    const stopReport = await new EndWorkReport(this).writeReport();
    if (!stopReport) {
      await Work.getCurrent();
      return false;
    }
    this.data.report = stopReport;
    console.log("[addTimeAndSave] Enregistrement des temps et du rapport", this.data);
    const result = await postToServer("work/save-session", this.data);
    this.dispatchData();
    await new Promise((resolve2) => setTimeout(resolve2, 2000));
    Work.displayWork(result.next, result.options);
    if (result.ok) {
      Flash.success(t("times.saved"));
    }
    return true;
  }
  static get obj() {
    return this._obj || (this._obj = DGet("section#current-work-container"));
  }
  static _obj;
  static async getCurrent() {
    const retour = await fetch(HOST + "task/current").then((r) => r.json());
    prefs.setData(retour.prefs);
    await loc.init(prefs.getLang());
    clock.setClockStyle(retour.prefs.clock);
    clock.setCounterMode(retour.prefs.counter);
    ui.setUITheme(retour.prefs.theme);
    if (retour.task.ok === false) {
      Flash.error(t("task.any_active"));
      return false;
    } else {
      ui.resetBackgroundColor();
      this.displayWork(retour.task, retour.options);
      return true;
    }
  }
  static displayWork(wdata, options) {
    this.currentWork = new Work(wdata);
    this.currentWork.display(options);
  }
  constructor(data) {
    this.data = data;
  }
  get id() {
    return this.data.id;
  }
  get script() {
    return this.data.script;
  }
  get folder() {
    return this.data.folder;
  }
  get restTime() {
    return this.data.restTime;
  }
  get cycleTime() {
    return this.data.cycleTime;
  }
  get totalTime() {
    return this.data.totalTime;
  }
  display(options) {
    this.dispatchData();
    ui.showButtons({
      Start: true,
      Restart: false,
      Stop: false,
      Pause: false,
      Change: options.canChange,
      runScript: !!this.data.script,
      openFolder: !!this.data.folder
    });
  }
  dispatchData() {
    Object.entries(this.data).forEach(([k2, v2]) => {
      v2 = ((prop, v3) => {
        switch (prop) {
          case "totalTime":
          case "cycleTime":
          case "restTime":
            return clock.time2horloge(v3);
          case "report":
            if (v3) {
              return markdown(`---

# ${t("ui.title.stop_report")}

` + v3);
            } else {
              return "";
            }
          default:
            return v3;
        }
      })(k2, v2);
      const propField = this.field(k2);
      if (propField) {
        propField.innerHTML = v2;
      }
    });
  }
  field(prop) {
    return Work.obj.querySelector(`#current-work-${prop}`);
  }
}
var init_work_client = __esm(() => {
  init_Clock();
  init_constants();
  init_flash();
  init_ui();
  init_prefs();
  init_help();
  init_editing();
  init_end_work_report();
  init_utils();
  init_Locale();
  Work.init();
});

// public/activityTracker.ts
var ActivityTracker;
var init_activityTracker = __esm(() => {
  init_work_client();
  init_ui();
  init_utils();
  init_flash();
  init_Locale();
  ActivityTracker = class ActivityTracker {
    static CHECK_INTERVAL = 5 * 60 * 1000;
    static timer;
    static inactiveUser;
    static startControl() {
      this.timer = setInterval(this.control.bind(this), this.CHECK_INTERVAL);
    }
    static stopControl() {
      if (this.timer) {
        clearInterval(this.timer);
        delete this.timer;
      }
    }
    static inactiveUserCorrection(workingTime) {
      console.log("Working time : ", workingTime);
      if (this.inactiveUser) {
        console.log("Working time rectifié : ", workingTime - this.CHECK_INTERVAL / 2 / 1000);
        return workingTime - this.CHECK_INTERVAL / 2 / 1000;
      } else {
        return workingTime;
      }
    }
    static async control() {
      const result = await postToServer("work/check-activity", {
        projectFolder: Work.currentWork.folder,
        lastCheck: Date.now() - this.CHECK_INTERVAL
      });
      if (result.ok) {
        this.inactiveUser = result.userIsWorking === false;
        if (this.inactiveUser) {
          ui.onForceStop();
        }
      } else {
        console.error("An error has occurred: ", result.error);
        Flash.error(t("error.occurred", [result.error]));
      }
    }
  };
});

// public/ui.ts
function stopEvent2(ev) {
  ev.stopPropagation();
  ev.preventDefault();
  return false;
}

class UI {
  static instance;
  constructor() {}
  static getInstance() {
    return UI.instance || (UI.instance = new UI);
  }
  onStart(ev) {
    this.mask([this.btnStart]);
    clock.start(Work.currentWork);
    this.reveal([this.btnStop, this.btnPause]);
    ActivityTracker.startControl();
  }
  onRestart(ev) {
    this.mask([this.btnRestart]);
    clock.restart();
    this.reveal([this.btnStop, this.btnPause]);
    ActivityTracker.startControl();
  }
  onStop(ev) {
    this.mask([this.btnStop, this.btnPause, this.btnRestart]);
    this.reveal([this.btnStart]);
    ActivityTracker.stopControl();
    if (ev && (ev.shiftKey || ev.metaKey)) {
      Flash.notice(t("times.dont_add_and_save"));
    } else {
      const workTime = ActivityTracker.inactiveUserCorrection(clock.stop());
      Work.addTimeToCurrentWork(Math.round(workTime / 60));
    }
  }
  onPause(ev) {
    this.mask([this.btnPause]);
    this.reveal([this.btnRestart]);
    ActivityTracker.stopControl();
    clock.pause();
  }
  setUITheme(theme) {
    document.body.className = theme;
  }
  setBackgroundColorAt(color2) {
    document.body.style.backgroundColor = color2;
  }
  resetBackgroundColor() {
    document.body.style.backgroundColor = "";
  }
  SECTIONS = ["work", "help", "prefs", "editing"];
  toggleSection(name) {
    this.SECTIONS.forEach((section) => {
      if (name === section) {
        this.openSection(section);
      } else {
        this.closeSection(section);
      }
    });
  }
  toggleHelp() {
    if (this.isSectionOpen("help")) {
      this.toggleSection("work");
    } else {
      this.toggleSection("help");
    }
  }
  isSectionOpen(name) {
    return !DGet("section#" + name).classList.contains("hidden");
  }
  mask(eList) {
    eList.forEach((e) => e.obj.classList.add("hidden"));
  }
  reveal(eList) {
    eList.forEach((e) => e.obj.classList.remove("hidden"));
  }
  showButtons(states) {
    this.buttons.forEach((bouton) => bouton.setState(states[bouton.id]));
  }
  closeSection(name) {
    DGet("section#" + name).classList.add("hidden");
  }
  openSection(name) {
    DGet("section#" + name).classList.remove("hidden");
  }
  onForceStop() {
    this.onStop(undefined);
  }
  async onChange(ev) {
    ev && stopEvent2(ev);
    const curwork = Work.currentWork;
    const result = await postToServer("task/change", { workId: curwork.id });
    if (result.ok === false) {
      Flash.error(t("error.occurred", [result.error]));
    }
    return false;
  }
  async onRunScript(ev) {
    ev && stopEvent2(ev);
    const curwork = Work.currentWork;
    const result = await postToServer("task/run-script", { workId: curwork.id, script: curwork.script });
    if (result.ok) {
      Flash.success(t("script.ran_successfully"));
    } else {
      Flash.error(t("error.occurred", [result.error]));
    }
    return false;
  }
  async onOpenFolder(ev) {
    ev && stopEvent2(ev);
    const curwork = Work.currentWork;
    const result = await postToServer("task/open-folder", { workId: curwork.id, folder: curwork.folder });
    if (result.ok) {
      Flash.success(t("folder.opened_in_finder"));
    } else {
      Flash.error(t("error.occurred", [result.error]));
    }
    return false;
  }
  btnStart;
  btnRestart;
  btnPause;
  btnStop;
  btnChange;
  btnRunScript;
  btnOpenFolder;
  get buttons() {
    this._buttons || this.instancieButtons();
    return this._buttons;
  }
  _buttons;
  instancieButtons() {
    console.log("-> Instanciation des boutons");
    this._buttons = this.DATA_BUTTONS.map((bdata) => {
      let id, name, onclick, hidden, row, title;
      [id, name, onclick, hidden, row, title] = bdata;
      this[`btn${id}`] = new Button({ id, name, onclick, hidden, row, title }).build();
      return this[`btn${id}`];
    });
  }
  get DATA_BUTTONS() {
    return this.databuts || (this.databuts = this.getDataButtons());
  }
  databuts;
  getDataButtons() {
    return [
      [
        "runScript",
        t("ui.button.run"),
        this.onRunScript.bind(this),
        false,
        2,
        t("ui.text.to_run_script")
      ],
      [
        "openFolder",
        t("ui.button.open_project"),
        this.onOpenFolder.bind(this),
        false,
        2,
        t("ui.text.to_open_project_folder")
      ],
      [
        "Change",
        t("ui.button.change"),
        this.onChange.bind(this),
        false,
        2,
        t("ui.text.to_choose_another_task")
      ],
      [
        "Stop",
        t("ui.button.stop"),
        this.onStop.bind(this),
        true,
        1,
        t("ui.text.to_stop_and_next")
      ],
      [
        "Pause",
        t("ui.button.pause"),
        this.onPause.bind(this),
        true,
        1,
        t("ui.text.to_pause_the_task")
      ],
      [
        "Start",
        t("ui.button.start"),
        this.onStart.bind(this),
        false,
        1,
        t("ui.text.to_start_working_on_task")
      ],
      [
        "Restart",
        t("ui.button.restart"),
        this.onRestart.bind(this),
        true,
        1,
        t("ui.text.to_restart_work_on_task")
      ]
    ];
  }
}

class Button {
  data;
  static get container() {
    return this._container || (this._container = document.body.querySelector("div#buttons-container"));
  }
  static _container;
  _obj;
  constructor(data) {
    this.data = data;
  }
  setState(state) {
    this[state ? "show" : "hide"]();
  }
  onClick(ev) {
    this.data.onclick(ev);
    return stopEvent2(ev);
  }
  build() {
    const o = document.createElement("BUTTON");
    o.innerHTML = this.data.name;
    o.id = `btn-${this.id}`;
    o.setAttribute("title", this.data.title);
    o.addEventListener("click", this.onClick.bind(this));
    Button.container.querySelector(`div#row${this.data.row}`).appendChild(o);
    this._obj = o;
    if (this.data.hidden) {
      this.hide();
    } else {
      this.show();
    }
    return this;
  }
  show() {
    this.obj.classList.remove("hidden");
  }
  hide() {
    this.obj.classList.add("hidden");
  }
  get id() {
    return this.data.id;
  }
  get obj() {
    return this._obj;
  }
}
var ui;
var init_ui = __esm(() => {
  init_Clock();
  init_work_client();
  init_activityTracker();
  init_flash();
  init_Locale();
  init_utils();
  ui = UI.getInstance();
});

// lib/Clock.ts
class Clock {
  static getInstance() {
    return this._instance || (this._instance = new Clock);
  }
  static _instance;
  constructor() {}
  counterMode;
  time2horloge(mn) {
    let hrs = Math.floor(mn / 60);
    let mns = Math.round(mn % 60);
    let horloge = [];
    horloge.push(`${hrs}`);
    horloge.push(`${mns > 9 ? "" : "0"}${mns}’`);
    return horloge.join(" h ");
  }
  get clockContainer() {
    return this._clockcont || (this._clockcont = DGet("div#clock-container"));
  }
  _clockcont;
  setClockStyle(style) {
    this.clockContainer.classList.add(style);
  }
  setCounterMode(mode = "clock") {
    this.counterMode = mode;
  }
  currentWork;
  timer;
  startTime;
  totalTime;
  currentTimeSegment;
  timeSegments = [];
  getTime() {
    return Math.round(new Date().getTime() / 1000);
  }
  start(currentWork) {
    this.currentWork = currentWork;
    this.timeSegments = [];
    this.clockContainer.classList.remove("hidden");
    this.clockObj.innerHTML = this.startClockPerCounterMode();
    this.createTimeSegment();
    this.calcTotalRecTime();
    this.startTimer();
  }
  startClockPerCounterMode() {
    if (this.counterMode === "clock") {
      return "0:00:00";
    } else {
      return this.s2h(this.currentWork.restTime * 60);
    }
  }
  get totalRestTimeSeconds() {
    return this._totresttime || (this._totresttime = this.currentWork.restTime * 60);
  }
  _totresttime;
  calcTotalRecTime() {
    this.totalTime = this.timeSegments.filter((segTime) => !!segTime.laps).reduce((accu, segTime) => accu + segTime.laps, 0);
  }
  restart() {
    this.createTimeSegment();
    this.clockContainer.classList.remove("hidden");
    this.startTimer();
  }
  startTimer() {
    this.startTime = this.getTime();
    this.timer = setInterval(this.run.bind(this), 1000);
  }
  createTimeSegment() {
    this.currentTimeSegment = { beg: this.getTime(), end: undefined, laps: undefined };
  }
  endCurrentTimeSegment() {
    const end = this.getTime();
    const laps = end - this.currentTimeSegment.beg;
    Object.assign(this.currentTimeSegment, { end, laps });
    this.timeSegments.push(this.currentTimeSegment);
    delete this.currentTimeSegment;
    this.calcTotalRecTime();
  }
  getStartTime() {
    return this.startTime;
  }
  pause() {
    this.endCurrentTimeSegment();
    clearInterval(this.timer);
    this.clockContainer.classList.add("hidden");
  }
  stop() {
    clearInterval(this.timer);
    delete this.timer;
    this.endCurrentTimeSegment();
    this.clockContainer.classList.add("hidden");
    return this.totalTime;
  }
  run() {
    const secondesOfWork = this.totalTime + this.lapsFromStart();
    let displayedSeconds;
    if (this.counterMode === "clock") {
      displayedSeconds = secondesOfWork;
    } else {
      displayedSeconds = this.totalRestTimeSeconds - secondesOfWork;
    }
    const restTime = this.taskRestTime(secondesOfWork);
    this.clockObj.innerHTML = this.s2h(displayedSeconds);
    if (secondesOfWork % 60 === 0) {
      const thisMinute = Math.round(secondesOfWork / 60);
      const elapsedMinutes = this.currentWork.cycleTime + thisMinute;
      const totalMinutes = this.currentWork.totalTime + thisMinute;
      this.restTimeField.innerHTML = this.time2horloge(restTime);
      this.cycleTimeField.innerHTML = this.time2horloge(elapsedMinutes);
      this.totalTimeField.innerHTML = this.time2horloge(totalMinutes);
    }
    if (restTime < 10 && this.alerte10minsDone === false) {
      this.donneAlerte10mins();
    } else if (this.alerte10minsDone) {
      if (this.alerteWorkDone === false && restTime < 0) {
        this.donneAlerteWorkDone();
      }
    }
  }
  get restTimeField() {
    return this._restfield || (this._restfield = DGet("span#current-work-restTime"));
  }
  get cycleTimeField() {
    return this._cycledurfield || (this._cycledurfield = DGet("span#current-work-cycleTime"));
  }
  get totalTimeField() {
    return this._totalfield || (this._totalfield = DGet("span#current-work-totalTime"));
  }
  alerte10minsDone = false;
  alerteWorkDone = false;
  donneAlerte10mins() {
    ui.setBackgroundColorAt("orange");
    this.bringAppToFront();
    Flash.notice("10 minutes of work remaining");
    this.alerte10minsDone = true;
  }
  donneAlerteWorkDone() {
    this.bringAppToFront();
    Flash.notice("Work time is over. Please move on to the next task.");
    this.alerteWorkDone = true;
  }
  taskRestTime(minutesOfWork) {
    minutesOfWork = minutesOfWork / 60;
    return this.currentWork.restTime - minutesOfWork;
  }
  lapsFromStart() {
    return Math.round(this.getTime() - this.startTime);
  }
  get clockObj() {
    return this._clockobj || (this._clockobj = DGet("#clock"));
  }
  _clockobj;
  s2h(s) {
    let h2 = Math.floor(s / 3600);
    s = s % 3600;
    let m2 = Math.floor(s / 60);
    const mstr = m2 < 10 ? `0${m2}` : String(m2);
    s = s % 60;
    const sstr = s < 10 ? `0${s}` : String(s);
    return `${h2}:${mstr}:${sstr}`;
  }
  bringAppToFront() {
    window.electronAPI.bringToFront();
  }
  _restfield;
  _cycledurfield;
  _totalfield;
}
var clock;
var init_Clock = __esm(() => {
  init_ui();
  init_flash();
  clock = Clock.getInstance();
});

// public/prefs.ts
var exports_prefs = {};
__export(exports_prefs, {
  prefs: () => prefs,
  Prefs: () => Prefs
});

class Prefs {
  data;
  fieldsReady = false;
  static inst;
  constructor() {}
  static getInstance() {
    return this.inst || (this.inst = new Prefs);
  }
  init() {
    this.observeButtons();
  }
  getLang() {
    return this.data.lang || "en";
  }
  async onOpenDataFile(ev) {
    stopEvent(ev);
    const result = await postToServer("prefs/open-data-file", {
      filePath: this.getValue("file")
    });
    if (result.ok) {
      Flash.success(t("data_file.open_with_sucess"));
    } else {
      Flash.error(t("error.occurred", result.error));
    }
  }
  async onSave(ev) {
    stopEvent(ev);
    const result = await postToServer("prefs/save", this.getData());
    if (result.ok) {
      this.close();
      Flash.success(t("prefs.saved"));
    } else {
      Flash.error(result.errors);
    }
    return false;
  }
  onChangePref(prop, ev) {
    const value = this.getValue(prop);
    switch (prop) {
      case "clock":
        clock.setClockStyle(value);
        break;
      case "counter":
        clock.setCounterMode(value);
        break;
      case "theme":
        ui.setUITheme(value);
        break;
      default:
    }
  }
  onOpen(ev) {
    this.open();
    return stopEvent(ev);
  }
  onClose(ev) {
    this.close();
    return stopEvent(ev);
  }
  setData(data) {
    this.data = data;
    this.fieldsReady || this.observeFields();
    Object.entries(this.data).forEach(([k2, v2]) => {
      this.setValue(k2, v2);
    });
  }
  getData() {
    Object.entries(this.data).forEach(([k2, _v]) => {
      Object.assign(this.data, { [k2]: this.getValue(k2) });
    });
    return this.data;
  }
  getValue(prop) {
    switch (prop) {
      case "random":
        return this.field("random").checked;
      default:
        return this.field(prop).value;
    }
  }
  setValue(prop, value) {
    switch (prop) {
      case "random":
        this.field("random").checked = value;
        break;
      default:
        this.field(prop).value = value;
    }
  }
  field(key2) {
    return DGet(`#prefs-${key2}`) || console.error(t("error.unfound_field", [`prefs-${key2}`]));
  }
  close() {
    ui.openSection("work");
    ui.closeSection("prefs");
  }
  open() {
    ui.openSection("prefs");
    ui.closeSection("work");
  }
  observeButtons() {
    listenBtn("prefs", this.onOpen.bind(this));
    listenBtn("close-prefs", this.onClose.bind(this));
    listenBtn("save-prefs", this.onSave.bind(this));
    listenBtn("open-datafile", this.onOpenDataFile.bind(this));
  }
  observeFields() {
    Object.keys(this.data).forEach((prop) => {
      this.field(prop).addEventListener("change", this.onChangePref.bind(this, prop));
    });
    this.fieldsReady = true;
  }
}
var prefs;
var init_prefs = __esm(() => {
  init_Clock();
  init_flash();
  init_ui();
  init_utils();
  init_Locale();
  prefs = Prefs.getInstance();
});
init_prefs();

export {
  prefs,
  Prefs
};
