export default require => (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => (key in obj) ? __defProp(obj, key, {
    enumerable: true,
    configurable: true,
    writable: true,
    value
  }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
    return a;
  };
  var __require = (x => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res);
  };
  var __commonJS = (cb, mod) => function __require2() {
    return (mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
      exports: {}
    }).exports, mod), mod.exports);
  };
  var __export = (target, all) => {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
        get: () => from[key],
        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
      });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
    value: mod,
    enumerable: true
  }) : target, mod));
  var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
    value: true
  }), mod);
  var init_define_process = __esm({
    "<define:process>"() {}
  });
  var require_mode_javascript = __commonJS({
    "node_modules/ace-builds/src-noconflict/mode-javascript.js"(exports, module) {
      "use strict";
      init_define_process();
      ace.define("ace/mode/jsdoc_comment_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require2, exports2, module2) {
        "use strict";
        var oop = require2("../lib/oop");
        var TextHighlightRules = require2("./text_highlight_rules").TextHighlightRules;
        var JsDocCommentHighlightRules = function () {
          this.$rules = {
            "start": [{
              token: ["comment.doc.tag", "comment.doc.text", "lparen.doc"],
              regex: "(@(?:param|member|typedef|property|namespace|var|const|callback))(\\s*)({)",
              push: [{
                token: "lparen.doc",
                regex: "{",
                push: [{
                  include: "doc-syntax"
                }, {
                  token: "rparen.doc",
                  regex: "}|(?=$)",
                  next: "pop"
                }]
              }, {
                token: ["rparen.doc", "text.doc", "variable.parameter.doc", "lparen.doc", "variable.parameter.doc", "rparen.doc"],
                regex: /(})(\s*)(?:([\w=:\/\.]+)|(?:(\[)([\w=:\/\.]+)(\])))/,
                next: "pop"
              }, {
                token: "rparen.doc",
                regex: "}|(?=$)",
                next: "pop"
              }, {
                include: "doc-syntax"
              }, {
                defaultToken: "text.doc"
              }]
            }, {
              token: ["comment.doc.tag", "text.doc", "lparen.doc"],
              regex: "(@(?:returns?|yields|type|this|suppress|public|protected|private|package|modifies|implements|external|exception|throws|enum|define|extends))(\\s*)({)",
              push: [{
                token: "lparen.doc",
                regex: "{",
                push: [{
                  include: "doc-syntax"
                }, {
                  token: "rparen.doc",
                  regex: "}|(?=$)",
                  next: "pop"
                }]
              }, {
                token: "rparen.doc",
                regex: "}|(?=$)",
                next: "pop"
              }, {
                include: "doc-syntax"
              }, {
                defaultToken: "text.doc"
              }]
            }, {
              token: ["comment.doc.tag", "text.doc", "variable.parameter.doc"],
              regex: '(@(?:alias|memberof|instance|module|name|lends|namespace|external|this|template|requires|param|implements|function|extends|typedef|mixes|constructor|var|memberof\\!|event|listens|exports|class|constructs|interface|emits|fires|throws|const|callback|borrows|augments))(\\s+)(\\w[\\w#.:/~"\\-]*)?'
            }, {
              token: ["comment.doc.tag", "text.doc", "variable.parameter.doc"],
              regex: "(@method)(\\s+)(\\w[\\w.\\(\\)]*)"
            }, {
              token: "comment.doc.tag",
              regex: "@access\\s+(?:private|public|protected)"
            }, {
              token: "comment.doc.tag",
              regex: "@kind\\s+(?:class|constant|event|external|file|function|member|mixin|module|namespace|typedef)"
            }, {
              token: "comment.doc.tag",
              regex: "@\\w+(?=\\s|$)"
            }, JsDocCommentHighlightRules.getTagRule(), {
              defaultToken: "comment.doc",
              caseInsensitive: true
            }],
            "doc-syntax": [{
              token: "operator.doc",
              regex: /[|:]/
            }, {
              token: "paren.doc",
              regex: /[\[\]]/
            }]
          };
          this.normalizeRules();
        };
        oop.inherits(JsDocCommentHighlightRules, TextHighlightRules);
        JsDocCommentHighlightRules.getTagRule = function (start) {
          return {
            token: "comment.doc.tag.storage.type",
            regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"
          };
        };
        JsDocCommentHighlightRules.getStartRule = function (start) {
          return {
            token: "comment.doc",
            regex: "\\/\\*(?=\\*)",
            next: start
          };
        };
        JsDocCommentHighlightRules.getEndRule = function (start) {
          return {
            token: "comment.doc",
            regex: "\\*\\/",
            next: start
          };
        };
        exports2.JsDocCommentHighlightRules = JsDocCommentHighlightRules;
      });
      ace.define("ace/mode/javascript_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/jsdoc_comment_highlight_rules", "ace/mode/text_highlight_rules"], function (require2, exports2, module2) {
        "use strict";
        var oop = require2("../lib/oop");
        var DocCommentHighlightRules = require2("./jsdoc_comment_highlight_rules").JsDocCommentHighlightRules;
        var TextHighlightRules = require2("./text_highlight_rules").TextHighlightRules;
        var identifierRe = "[a-zA-Z\\$_\xA1-\uFFFF][a-zA-Z\\d\\$_\xA1-\uFFFF]*";
        var JavaScriptHighlightRules = function (options) {
          var keywordMapper = this.createKeywordMapper({
            "variable.language": "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Symbol|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document",
            "keyword": "const|yield|import|get|set|async|await|break|case|catch|continue|default|delete|do|else|finally|for|function|if|in|of|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|__parent__|__count__|escape|unescape|with|__proto__|class|enum|extends|super|export|implements|private|public|interface|package|protected|static|constructor",
            "storage.type": "const|let|var|function",
            "constant.language": "null|Infinity|NaN|undefined",
            "support.function": "alert",
            "constant.language.boolean": "true|false"
          }, "identifier");
          var kwBeforeRe = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void";
          var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|u{[0-9a-fA-F]{1,6}}|[0-2][0-7]{0,2}|3[0-7][0-7]?|[4-7][0-7]?|.)";
          this.$rules = {
            "no_regex": [DocCommentHighlightRules.getStartRule("doc-start"), comments("no_regex"), {
              token: "string",
              regex: "'(?=.)",
              next: "qstring"
            }, {
              token: "string",
              regex: '"(?=.)',
              next: "qqstring"
            }, {
              token: "constant.numeric",
              regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/
            }, {
              token: "constant.numeric",
              regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/
            }, {
              token: ["storage.type", "punctuation.operator", "support.function", "punctuation.operator", "entity.name.function", "text", "keyword.operator"],
              regex: "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe + ")(\\s*)(=)",
              next: "function_arguments"
            }, {
              token: ["storage.type", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"],
              regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function\\*?)(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: ["entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "paren.lparen"],
              regex: "(" + identifierRe + ")(\\s*)(=)(\\s*)(function\\*?)(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: ["storage.type", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "entity.name.function", "text", "paren.lparen"],
              regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function\\*?)(\\s+)(\\w+)(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: ["storage.type", "text", "entity.name.function", "text", "paren.lparen"],
              regex: "(function\\*?)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: ["entity.name.function", "text", "punctuation.operator", "text", "storage.type", "text", "paren.lparen"],
              regex: "(" + identifierRe + ")(\\s*)(:)(\\s*)(function\\*?)(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: ["text", "text", "storage.type", "text", "paren.lparen"],
              regex: "(:)(\\s*)(function\\*?)(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: "keyword",
              regex: `from(?=\\s*('|"))`
            }, {
              token: "keyword",
              regex: "(?:" + kwBeforeRe + ")\\b",
              next: "start"
            }, {
              token: "support.constant",
              regex: /that\b/
            }, {
              token: ["storage.type", "punctuation.operator", "support.function.firebug"],
              regex: /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/
            }, {
              token: keywordMapper,
              regex: identifierRe
            }, {
              token: "punctuation.operator",
              regex: /[.](?![.])/,
              next: "property"
            }, {
              token: "storage.type",
              regex: /=>/,
              next: "start"
            }, {
              token: "keyword.operator",
              regex: /--|\+\+|\.{3}|===|==|=|!=|!==|<+=?|>+=?|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,
              next: "start"
            }, {
              token: "punctuation.operator",
              regex: /[?:,;.]/,
              next: "start"
            }, {
              token: "paren.lparen",
              regex: /[\[({]/,
              next: "start"
            }, {
              token: "paren.rparen",
              regex: /[\])}]/
            }, {
              token: "comment",
              regex: /^#!.*$/
            }],
            property: [{
              token: "text",
              regex: "\\s+"
            }, {
              token: ["storage.type", "punctuation.operator", "entity.name.function", "text", "keyword.operator", "text", "storage.type", "text", "entity.name.function", "text", "paren.lparen"],
              regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function\\*?)(?:(\\s+)(\\w+))?(\\s*)(\\()",
              next: "function_arguments"
            }, {
              token: "punctuation.operator",
              regex: /[.](?![.])/
            }, {
              token: "support.function",
              regex: /(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|lter|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward|rEach)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
            }, {
              token: "support.function.dom",
              regex: /(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName|ClassName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
            }, {
              token: "support.constant",
              regex: /(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
            }, {
              token: "identifier",
              regex: identifierRe
            }, {
              regex: "",
              token: "empty",
              next: "no_regex"
            }],
            "start": [DocCommentHighlightRules.getStartRule("doc-start"), comments("start"), {
              token: "string.regexp",
              regex: "\\/",
              next: "regex"
            }, {
              token: "text",
              regex: "\\s+|^$",
              next: "start"
            }, {
              token: "empty",
              regex: "",
              next: "no_regex"
            }],
            "regex": [{
              token: "regexp.keyword.operator",
              regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
              token: "string.regexp",
              regex: "/[sxngimy]*",
              next: "no_regex"
            }, {
              token: "invalid",
              regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
            }, {
              token: "constant.language.escape",
              regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
            }, {
              token: "constant.language.delimiter",
              regex: /\|/
            }, {
              token: "constant.language.escape",
              regex: /\[\^?/,
              next: "regex_character_class"
            }, {
              token: "empty",
              regex: "$",
              next: "no_regex"
            }, {
              defaultToken: "string.regexp"
            }],
            "regex_character_class": [{
              token: "regexp.charclass.keyword.operator",
              regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
            }, {
              token: "constant.language.escape",
              regex: "]",
              next: "regex"
            }, {
              token: "constant.language.escape",
              regex: "-"
            }, {
              token: "empty",
              regex: "$",
              next: "no_regex"
            }, {
              defaultToken: "string.regexp.charachterclass"
            }],
            "default_parameter": [{
              token: "string",
              regex: "'(?=.)",
              push: [{
                token: "string",
                regex: "'|$",
                next: "pop"
              }, {
                include: "qstring"
              }]
            }, {
              token: "string",
              regex: '"(?=.)',
              push: [{
                token: "string",
                regex: '"|$',
                next: "pop"
              }, {
                include: "qqstring"
              }]
            }, {
              token: "constant.language",
              regex: "null|Infinity|NaN|undefined"
            }, {
              token: "constant.numeric",
              regex: /0(?:[xX][0-9a-fA-F]+|[oO][0-7]+|[bB][01]+)\b/
            }, {
              token: "constant.numeric",
              regex: /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/
            }, {
              token: "punctuation.operator",
              regex: ",",
              next: "function_arguments"
            }, {
              token: "text",
              regex: "\\s+"
            }, {
              token: "punctuation.operator",
              regex: "$"
            }, {
              token: "empty",
              regex: "",
              next: "no_regex"
            }],
            "function_arguments": [comments("function_arguments"), {
              token: "variable.parameter",
              regex: identifierRe
            }, {
              token: "punctuation.operator",
              regex: ","
            }, {
              token: "text",
              regex: "\\s+"
            }, {
              token: "punctuation.operator",
              regex: "$"
            }, {
              token: "empty",
              regex: "",
              next: "no_regex"
            }],
            "qqstring": [{
              token: "constant.language.escape",
              regex: escapedRe
            }, {
              token: "string",
              regex: "\\\\$",
              consumeLineEnd: true
            }, {
              token: "string",
              regex: '"|$',
              next: "no_regex"
            }, {
              defaultToken: "string"
            }],
            "qstring": [{
              token: "constant.language.escape",
              regex: escapedRe
            }, {
              token: "string",
              regex: "\\\\$",
              consumeLineEnd: true
            }, {
              token: "string",
              regex: "'|$",
              next: "no_regex"
            }, {
              defaultToken: "string"
            }]
          };
          if (!options || !options.noES6) {
            this.$rules.no_regex.unshift({
              regex: "[{}]",
              onMatch: function (val, state, stack) {
                this.next = val == "{" ? this.nextState : "";
                if (val == "{" && stack.length) {
                  stack.unshift("start", state);
                } else if (val == "}" && stack.length) {
                  stack.shift();
                  this.next = stack.shift();
                  if (this.next.indexOf("string") != -1 || this.next.indexOf("jsx") != -1) return "paren.quasi.end";
                }
                return val == "{" ? "paren.lparen" : "paren.rparen";
              },
              nextState: "start"
            }, {
              token: "string.quasi.start",
              regex: /`/,
              push: [{
                token: "constant.language.escape",
                regex: escapedRe
              }, {
                token: "paren.quasi.start",
                regex: /\${/,
                push: "start"
              }, {
                token: "string.quasi.end",
                regex: /`/,
                next: "pop"
              }, {
                defaultToken: "string.quasi"
              }]
            }, {
              token: ["variable.parameter", "text"],
              regex: "(" + identifierRe + ")(\\s*)(?=\\=>)"
            }, {
              token: "paren.lparen",
              regex: "(\\()(?=.+\\s*=>)",
              next: "function_arguments"
            }, {
              token: "variable.language",
              regex: "(?:(?:(?:Weak)?(?:Set|Map))|Promise)\\b"
            });
            this.$rules["function_arguments"].unshift({
              token: "keyword.operator",
              regex: "=",
              next: "default_parameter"
            }, {
              token: "keyword.operator",
              regex: "\\.{3}"
            });
            this.$rules["property"].unshift({
              token: "support.function",
              regex: "(findIndex|repeat|startsWith|endsWith|includes|isSafeInteger|trunc|cbrt|log2|log10|sign|then|catch|finally|resolve|reject|race|any|all|allSettled|keys|entries|isInteger)\\b(?=\\()"
            }, {
              token: "constant.language",
              regex: "(?:MAX_SAFE_INTEGER|MIN_SAFE_INTEGER|EPSILON)\\b"
            });
            if (!options || options.jsx != false) JSX.call(this);
          }
          this.embedRules(DocCommentHighlightRules, "doc-", [DocCommentHighlightRules.getEndRule("no_regex")]);
          this.normalizeRules();
        };
        oop.inherits(JavaScriptHighlightRules, TextHighlightRules);
        function JSX() {
          var tagRegex = identifierRe.replace("\\d", "\\d\\-");
          var jsxTag = {
            onMatch: function (val, state, stack) {
              var offset = val.charAt(1) == "/" ? 2 : 1;
              if (offset == 1) {
                if (state != this.nextState) stack.unshift(this.next, this.nextState, 0); else stack.unshift(this.next);
                stack[2]++;
              } else if (offset == 2) {
                if (state == this.nextState) {
                  stack[1]--;
                  if (!stack[1] || stack[1] < 0) {
                    stack.shift();
                    stack.shift();
                  }
                }
              }
              return [{
                type: "meta.tag.punctuation." + (offset == 1 ? "" : "end-") + "tag-open.xml",
                value: val.slice(0, offset)
              }, {
                type: "meta.tag.tag-name.xml",
                value: val.substr(offset)
              }];
            },
            regex: "</?" + tagRegex,
            next: "jsxAttributes",
            nextState: "jsx"
          };
          this.$rules.start.unshift(jsxTag);
          var jsxJsRule = {
            regex: "{",
            token: "paren.quasi.start",
            push: "start"
          };
          this.$rules.jsx = [jsxJsRule, jsxTag, {
            include: "reference"
          }, {
            defaultToken: "string"
          }];
          this.$rules.jsxAttributes = [{
            token: "meta.tag.punctuation.tag-close.xml",
            regex: "/?>",
            onMatch: function (value, currentState, stack) {
              if (currentState == stack[0]) stack.shift();
              if (value.length == 2) {
                if (stack[0] == this.nextState) stack[1]--;
                if (!stack[1] || stack[1] < 0) {
                  stack.splice(0, 2);
                }
              }
              this.next = stack[0] || "start";
              return [{
                type: this.token,
                value
              }];
            },
            nextState: "jsx"
          }, jsxJsRule, comments("jsxAttributes"), {
            token: "entity.other.attribute-name.xml",
            regex: tagRegex
          }, {
            token: "keyword.operator.attribute-equals.xml",
            regex: "="
          }, {
            token: "text.tag-whitespace.xml",
            regex: "\\s+"
          }, {
            token: "string.attribute-value.xml",
            regex: "'",
            stateName: "jsx_attr_q",
            push: [{
              token: "string.attribute-value.xml",
              regex: "'",
              next: "pop"
            }, {
              include: "reference"
            }, {
              defaultToken: "string.attribute-value.xml"
            }]
          }, {
            token: "string.attribute-value.xml",
            regex: '"',
            stateName: "jsx_attr_qq",
            push: [{
              token: "string.attribute-value.xml",
              regex: '"',
              next: "pop"
            }, {
              include: "reference"
            }, {
              defaultToken: "string.attribute-value.xml"
            }]
          }, jsxTag];
          this.$rules.reference = [{
            token: "constant.language.escape.reference.xml",
            regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
          }];
        }
        function comments(next) {
          return [{
            token: "comment",
            regex: /\/\*/,
            next: [DocCommentHighlightRules.getTagRule(), {
              token: "comment",
              regex: "\\*\\/",
              next: next || "pop"
            }, {
              defaultToken: "comment",
              caseInsensitive: true
            }]
          }, {
            token: "comment",
            regex: "\\/\\/",
            next: [DocCommentHighlightRules.getTagRule(), {
              token: "comment",
              regex: "$|^",
              next: next || "pop"
            }, {
              defaultToken: "comment",
              caseInsensitive: true
            }]
          }];
        }
        exports2.JavaScriptHighlightRules = JavaScriptHighlightRules;
      });
      ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (require2, exports2, module2) {
        "use strict";
        var Range = require2("../range").Range;
        var MatchingBraceOutdent = function () {};
        (function () {
          this.checkOutdent = function (line, input) {
            if (!(/^\s+$/).test(line)) return false;
            return (/^\s*\}/).test(input);
          };
          this.autoOutdent = function (doc, row) {
            var line = doc.getLine(row);
            var match = line.match(/^(\s*\})/);
            if (!match) return 0;
            var column = match[1].length;
            var openBracePos = doc.findMatchingBracket({
              row,
              column
            });
            if (!openBracePos || openBracePos.row == row) return 0;
            var indent = this.$getIndent(doc.getLine(openBracePos.row));
            doc.replace(new Range(row, 0, row, column - 1), indent);
          };
          this.$getIndent = function (line) {
            return line.match(/^\s*/)[0];
          };
        }).call(MatchingBraceOutdent.prototype);
        exports2.MatchingBraceOutdent = MatchingBraceOutdent;
      });
      ace.define("ace/mode/folding/cstyle", ["require", "exports", "module", "ace/lib/oop", "ace/range", "ace/mode/folding/fold_mode"], function (require2, exports2, module2) {
        "use strict";
        var oop = require2("../../lib/oop");
        var Range = require2("../../range").Range;
        var BaseFoldMode = require2("./fold_mode").FoldMode;
        var FoldMode = exports2.FoldMode = function (commentRegex) {
          if (commentRegex) {
            this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start));
            this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end));
          }
        };
        oop.inherits(FoldMode, BaseFoldMode);
        (function () {
          this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
          this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
          this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
          this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
          this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
          this._getFoldWidgetBase = this.getFoldWidget;
          this.getFoldWidget = function (session, foldStyle, row) {
            var line = session.getLine(row);
            if (this.singleLineBlockCommentRe.test(line)) {
              if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line)) return "";
            }
            var fw = this._getFoldWidgetBase(session, foldStyle, row);
            if (!fw && this.startRegionRe.test(line)) return "start";
            return fw;
          };
          this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
            var line = session.getLine(row);
            if (this.startRegionRe.test(line)) return this.getCommentRegionBlock(session, line, row);
            var match = line.match(this.foldingStartMarker);
            if (match) {
              var i = match.index;
              if (match[1]) return this.openingBracketBlock(session, match[1], row, i);
              var range = session.getCommentFoldRange(row, i + match[0].length, 1);
              if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                  range = this.getSectionRange(session, row);
                } else if (foldStyle != "all") range = null;
              }
              return range;
            }
            if (foldStyle === "markbegin") return;
            var match = line.match(this.foldingStopMarker);
            if (match) {
              var i = match.index + match[0].length;
              if (match[1]) return this.closingBracketBlock(session, match[1], row, i);
              return session.getCommentFoldRange(row, i, -1);
            }
          };
          this.getSectionRange = function (session, row) {
            var line = session.getLine(row);
            var startIndent = line.search(/\S/);
            var startRow = row;
            var startColumn = line.length;
            row = row + 1;
            var endRow = row;
            var maxRow = session.getLength();
            while (++row < maxRow) {
              line = session.getLine(row);
              var indent = line.search(/\S/);
              if (indent === -1) continue;
              if (startIndent > indent) break;
              var subRange = this.getFoldWidgetRange(session, "all", row);
              if (subRange) {
                if (subRange.start.row <= startRow) {
                  break;
                } else if (subRange.isMultiLine()) {
                  row = subRange.end.row;
                } else if (startIndent == indent) {
                  break;
                }
              }
              endRow = row;
            }
            return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
          };
          this.getCommentRegionBlock = function (session, line, row) {
            var startColumn = line.search(/\s*$/);
            var maxRow = session.getLength();
            var startRow = row;
            var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
            var depth = 1;
            while (++row < maxRow) {
              line = session.getLine(row);
              var m = re.exec(line);
              if (!m) continue;
              if (m[1]) depth--; else depth++;
              if (!depth) break;
            }
            var endRow = row;
            if (endRow > startRow) {
              return new Range(startRow, startColumn, endRow, line.length);
            }
          };
        }).call(FoldMode.prototype);
      });
      ace.define("ace/mode/javascript", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/javascript_highlight_rules", "ace/mode/matching_brace_outdent", "ace/worker/worker_client", "ace/mode/behaviour/cstyle", "ace/mode/folding/cstyle"], function (require2, exports2, module2) {
        "use strict";
        var oop = require2("../lib/oop");
        var TextMode = require2("./text").Mode;
        var JavaScriptHighlightRules = require2("./javascript_highlight_rules").JavaScriptHighlightRules;
        var MatchingBraceOutdent = require2("./matching_brace_outdent").MatchingBraceOutdent;
        var WorkerClient = require2("../worker/worker_client").WorkerClient;
        var CstyleBehaviour = require2("./behaviour/cstyle").CstyleBehaviour;
        var CStyleFoldMode = require2("./folding/cstyle").FoldMode;
        var Mode = function () {
          this.HighlightRules = JavaScriptHighlightRules;
          this.$outdent = new MatchingBraceOutdent();
          this.$behaviour = new CstyleBehaviour();
          this.foldingRules = new CStyleFoldMode();
        };
        oop.inherits(Mode, TextMode);
        (function () {
          this.lineCommentStart = "//";
          this.blockComment = {
            start: "/*",
            end: "*/"
          };
          this.$quotes = {
            '"': '"',
            "'": "'",
            "`": "`"
          };
          this.$pairQuotesAfter = {
            "`": /\w/
          };
          this.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);
            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;
            var endState = tokenizedLine.state;
            if (tokens.length && tokens[tokens.length - 1].type == "comment") {
              return indent;
            }
            if (state == "start" || state == "no_regex") {
              var match = line.match(/^.*(?:\bcase\b.*:|[\{\(\[])\s*$/);
              if (match) {
                indent += tab;
              }
            } else if (state == "doc-start") {
              if (endState == "start" || endState == "no_regex") {
                return "";
              }
              var match = line.match(/^\s*(\/?)\*/);
              if (match) {
                if (match[1]) {
                  indent += " ";
                }
                indent += "* ";
              }
            }
            return indent;
          };
          this.checkOutdent = function (state, line, input) {
            return this.$outdent.checkOutdent(line, input);
          };
          this.autoOutdent = function (state, doc, row) {
            this.$outdent.autoOutdent(doc, row);
          };
          this.createWorker = function (session) {
            var worker = new WorkerClient(["ace"], "ace/mode/javascript_worker", "JavaScriptWorker");
            worker.attachToDocument(session.getDocument());
            worker.on("annotate", function (results) {
              session.setAnnotations(results.data);
            });
            worker.on("terminate", function () {
              session.clearAnnotations();
            });
            return worker;
          };
          this.$id = "ace/mode/javascript";
          this.snippetFileId = "ace/snippets/javascript";
        }).call(Mode.prototype);
        exports2.Mode = Mode;
      });
      (function () {
        ace.require(["ace/mode/javascript"], function (m) {
          if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
          }
        });
      })();
    }
  });
  var require_theme_twilight = __commonJS({
    "node_modules/ace-builds/src-noconflict/theme-twilight.js"(exports, module) {
      "use strict";
      init_define_process();
      ace.define("ace/theme/twilight-css", ["require", "exports", "module"], function (require2, exports2, module2) {
        module2.exports = ".ace-twilight .ace_gutter {\n  background: #232323;\n  color: #E2E2E2\n}\n\n.ace-twilight .ace_print-margin {\n  width: 1px;\n  background: #232323\n}\n\n.ace-twilight {\n  background-color: #141414;\n  color: #F8F8F8\n}\n\n.ace-twilight .ace_cursor {\n  color: #A7A7A7\n}\n\n.ace-twilight .ace_marker-layer .ace_selection {\n  background: rgba(221, 240, 255, 0.20)\n}\n\n.ace-twilight.ace_multiselect .ace_selection.ace_start {\n  box-shadow: 0 0 3px 0px #141414;\n}\n\n.ace-twilight .ace_marker-layer .ace_step {\n  background: rgb(102, 82, 0)\n}\n\n.ace-twilight .ace_marker-layer .ace_bracket {\n  margin: -1px 0 0 -1px;\n  border: 1px solid rgba(255, 255, 255, 0.25)\n}\n\n.ace-twilight .ace_marker-layer .ace_active-line {\n  background: rgba(255, 255, 255, 0.031)\n}\n\n.ace-twilight .ace_gutter-active-line {\n  background-color: rgba(255, 255, 255, 0.031)\n}\n\n.ace-twilight .ace_marker-layer .ace_selected-word {\n  border: 1px solid rgba(221, 240, 255, 0.20)\n}\n\n.ace-twilight .ace_invisible {\n  color: rgba(255, 255, 255, 0.25)\n}\n\n.ace-twilight .ace_keyword,\n.ace-twilight .ace_meta {\n  color: #CDA869\n}\n\n.ace-twilight .ace_constant,\n.ace-twilight .ace_constant.ace_character,\n.ace-twilight .ace_constant.ace_character.ace_escape,\n.ace-twilight .ace_constant.ace_other,\n.ace-twilight .ace_heading,\n.ace-twilight .ace_markup.ace_heading,\n.ace-twilight .ace_support.ace_constant {\n  color: #CF6A4C\n}\n\n.ace-twilight .ace_invalid.ace_illegal {\n  color: #F8F8F8;\n  background-color: rgba(86, 45, 86, 0.75)\n}\n\n.ace-twilight .ace_invalid.ace_deprecated {\n  text-decoration: underline;\n  font-style: italic;\n  color: #D2A8A1\n}\n\n.ace-twilight .ace_support {\n  color: #9B859D\n}\n\n.ace-twilight .ace_fold {\n  background-color: #AC885B;\n  border-color: #F8F8F8\n}\n\n.ace-twilight .ace_support.ace_function {\n  color: #DAD085\n}\n\n.ace-twilight .ace_list,\n.ace-twilight .ace_markup.ace_list,\n.ace-twilight .ace_storage {\n  color: #F9EE98\n}\n\n.ace-twilight .ace_entity.ace_name.ace_function,\n.ace-twilight .ace_meta.ace_tag {\n  color: #AC885B\n}\n\n.ace-twilight .ace_string {\n  color: #8F9D6A\n}\n\n.ace-twilight .ace_string.ace_regexp {\n  color: #E9C062\n}\n\n.ace-twilight .ace_comment {\n  font-style: italic;\n  color: #5F5A60\n}\n\n.ace-twilight .ace_variable {\n  color: #7587A6\n}\n\n.ace-twilight .ace_xml-pe {\n  color: #494949\n}\n\n.ace-twilight .ace_indent-guide {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWMQERFpYLC1tf0PAAgOAnPnhxyiAAAAAElFTkSuQmCC) right repeat-y\n}\n\n.ace-twilight .ace_indent-guide-active {\n  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2PQ1dX9zzBz5sz/ABCcBFFentLlAAAAAElFTkSuQmCC) right repeat-y;\n}\n";
      });
      ace.define("ace/theme/twilight", ["require", "exports", "module", "ace/theme/twilight-css", "ace/lib/dom"], function (require2, exports2, module2) {
        exports2.isDark = true;
        exports2.cssClass = "ace-twilight";
        exports2.cssText = require2("./twilight-css");
        var dom = require2("../lib/dom");
        dom.importCssString(exports2.cssText, exports2.cssClass, false);
      });
      (function () {
        ace.require(["ace/theme/twilight"], function (m) {
          if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
          }
        });
      })();
    }
  });
  var require_ext_language_tools = __commonJS({
    "node_modules/ace-builds/src-noconflict/ext-language_tools.js"(exports, module) {
      "use strict";
      init_define_process();
      ace.define("ace/snippets", ["require", "exports", "module", "ace/lib/dom", "ace/lib/oop", "ace/lib/event_emitter", "ace/lib/lang", "ace/range", "ace/range_list", "ace/keyboard/hash_handler", "ace/tokenizer", "ace/clipboard", "ace/editor"], function (require2, exports2, module2) {
        "use strict";
        var dom = require2("./lib/dom");
        var oop = require2("./lib/oop");
        var EventEmitter = require2("./lib/event_emitter").EventEmitter;
        var lang = require2("./lib/lang");
        var Range = require2("./range").Range;
        var RangeList = require2("./range_list").RangeList;
        var HashHandler = require2("./keyboard/hash_handler").HashHandler;
        var Tokenizer = require2("./tokenizer").Tokenizer;
        var clipboard = require2("./clipboard");
        var VARIABLES = {
          CURRENT_WORD: function (editor) {
            return editor.session.getTextRange(editor.session.getWordRange());
          },
          SELECTION: function (editor, name, indentation) {
            var text = editor.session.getTextRange();
            if (indentation) return text.replace(/\n\r?([ \t]*\S)/g, "\n" + indentation + "$1");
            return text;
          },
          CURRENT_LINE: function (editor) {
            return editor.session.getLine(editor.getCursorPosition().row);
          },
          PREV_LINE: function (editor) {
            return editor.session.getLine(editor.getCursorPosition().row - 1);
          },
          LINE_INDEX: function (editor) {
            return editor.getCursorPosition().row;
          },
          LINE_NUMBER: function (editor) {
            return editor.getCursorPosition().row + 1;
          },
          SOFT_TABS: function (editor) {
            return editor.session.getUseSoftTabs() ? "YES" : "NO";
          },
          TAB_SIZE: function (editor) {
            return editor.session.getTabSize();
          },
          CLIPBOARD: function (editor) {
            return clipboard.getText && clipboard.getText();
          },
          FILENAME: function (editor) {
            return (/[^/\\]*$/).exec(this.FILEPATH(editor))[0];
          },
          FILENAME_BASE: function (editor) {
            return (/[^/\\]*$/).exec(this.FILEPATH(editor))[0].replace(/\.[^.]*$/, "");
          },
          DIRECTORY: function (editor) {
            return this.FILEPATH(editor).replace(/[^/\\]*$/, "");
          },
          FILEPATH: function (editor) {
            return "/not implemented.txt";
          },
          WORKSPACE_NAME: function () {
            return "Unknown";
          },
          FULLNAME: function () {
            return "Unknown";
          },
          BLOCK_COMMENT_START: function (editor) {
            var mode = editor.session.$mode || ({});
            return mode.blockComment && mode.blockComment.start || "";
          },
          BLOCK_COMMENT_END: function (editor) {
            var mode = editor.session.$mode || ({});
            return mode.blockComment && mode.blockComment.end || "";
          },
          LINE_COMMENT: function (editor) {
            var mode = editor.session.$mode || ({});
            return mode.lineCommentStart || "";
          },
          CURRENT_YEAR: date.bind(null, {
            year: "numeric"
          }),
          CURRENT_YEAR_SHORT: date.bind(null, {
            year: "2-digit"
          }),
          CURRENT_MONTH: date.bind(null, {
            month: "numeric"
          }),
          CURRENT_MONTH_NAME: date.bind(null, {
            month: "long"
          }),
          CURRENT_MONTH_NAME_SHORT: date.bind(null, {
            month: "short"
          }),
          CURRENT_DATE: date.bind(null, {
            day: "2-digit"
          }),
          CURRENT_DAY_NAME: date.bind(null, {
            weekday: "long"
          }),
          CURRENT_DAY_NAME_SHORT: date.bind(null, {
            weekday: "short"
          }),
          CURRENT_HOUR: date.bind(null, {
            hour: "2-digit",
            hour12: false
          }),
          CURRENT_MINUTE: date.bind(null, {
            minute: "2-digit"
          }),
          CURRENT_SECOND: date.bind(null, {
            second: "2-digit"
          })
        };
        VARIABLES.SELECTED_TEXT = VARIABLES.SELECTION;
        function date(dateFormat) {
          var str = new Date().toLocaleString("en-us", dateFormat);
          return str.length == 1 ? "0" + str : str;
        }
        var SnippetManager = (function () {
          function SnippetManager2() {
            this.snippetMap = {};
            this.snippetNameMap = {};
            this.variables = VARIABLES;
          }
          SnippetManager2.prototype.getTokenizer = function () {
            return SnippetManager2.$tokenizer || this.createTokenizer();
          };
          SnippetManager2.prototype.createTokenizer = function () {
            function TabstopToken(str) {
              str = str.substr(1);
              if ((/^\d+$/).test(str)) return [{
                tabstopId: parseInt(str, 10)
              }];
              return [{
                text: str
              }];
            }
            function escape(ch) {
              return "(?:[^\\\\" + ch + "]|\\\\.)";
            }
            var formatMatcher = {
              regex: "/(" + escape("/") + "+)/",
              onMatch: function (val, state, stack) {
                var ts = stack[0];
                ts.fmtString = true;
                ts.guard = val.slice(1, -1);
                ts.flag = "";
                return "";
              },
              next: "formatString"
            };
            SnippetManager2.$tokenizer = new Tokenizer({
              start: [{
                regex: /\\./,
                onMatch: function (val, state, stack) {
                  var ch = val[1];
                  if (ch == "}" && stack.length) {
                    val = ch;
                  } else if (("`$\\").indexOf(ch) != -1) {
                    val = ch;
                  }
                  return [val];
                }
              }, {
                regex: /}/,
                onMatch: function (val, state, stack) {
                  return [stack.length ? stack.shift() : val];
                }
              }, {
                regex: /\$(?:\d+|\w+)/,
                onMatch: TabstopToken
              }, {
                regex: /\$\{[\dA-Z_a-z]+/,
                onMatch: function (str, state, stack) {
                  var t = TabstopToken(str.substr(1));
                  stack.unshift(t[0]);
                  return t;
                },
                next: "snippetVar"
              }, {
                regex: /\n/,
                token: "newline",
                merge: false
              }],
              snippetVar: [{
                regex: "\\|" + escape("\\|") + "*\\|",
                onMatch: function (val, state, stack) {
                  var choices = val.slice(1, -1).replace(/\\[,|\\]|,/g, function (operator) {
                    return operator.length == 2 ? operator[1] : "\0";
                  }).split("\0").map(function (value) {
                    return {
                      value
                    };
                  });
                  stack[0].choices = choices;
                  return [choices[0]];
                },
                next: "start"
              }, formatMatcher, {
                regex: "([^:}\\\\]|\\\\.)*:?",
                token: "",
                next: "start"
              }],
              formatString: [{
                regex: /:/,
                onMatch: function (val, state, stack) {
                  if (stack.length && stack[0].expectElse) {
                    stack[0].expectElse = false;
                    stack[0].ifEnd = {
                      elseEnd: stack[0]
                    };
                    return [stack[0].ifEnd];
                  }
                  return ":";
                }
              }, {
                regex: /\\./,
                onMatch: function (val, state, stack) {
                  var ch = val[1];
                  if (ch == "}" && stack.length) val = ch; else if (("`$\\").indexOf(ch) != -1) val = ch; else if (ch == "n") val = "\n"; else if (ch == "t") val = "	"; else if (("ulULE").indexOf(ch) != -1) val = {
                    changeCase: ch,
                    local: ch > "a"
                  };
                  return [val];
                }
              }, {
                regex: "/\\w*}",
                onMatch: function (val, state, stack) {
                  var next = stack.shift();
                  if (next) next.flag = val.slice(1, -1);
                  this.next = next && next.tabstopId ? "start" : "";
                  return [next || val];
                },
                next: "start"
              }, {
                regex: /\$(?:\d+|\w+)/,
                onMatch: function (val, state, stack) {
                  return [{
                    text: val.slice(1)
                  }];
                }
              }, {
                regex: /\${\w+/,
                onMatch: function (val, state, stack) {
                  var token = {
                    text: val.slice(2)
                  };
                  stack.unshift(token);
                  return [token];
                },
                next: "formatStringVar"
              }, {
                regex: /\n/,
                token: "newline",
                merge: false
              }, {
                regex: /}/,
                onMatch: function (val, state, stack) {
                  var next = stack.shift();
                  this.next = next && next.tabstopId ? "start" : "";
                  return [next || val];
                },
                next: "start"
              }],
              formatStringVar: [{
                regex: /:\/\w+}/,
                onMatch: function (val, state, stack) {
                  var ts = stack[0];
                  ts.formatFunction = val.slice(2, -1);
                  return [stack.shift()];
                },
                next: "formatString"
              }, formatMatcher, {
                regex: /:[\?\-+]?/,
                onMatch: function (val, state, stack) {
                  if (val[1] == "+") stack[0].ifEnd = stack[0];
                  if (val[1] == "?") stack[0].expectElse = true;
                },
                next: "formatString"
              }, {
                regex: "([^:}\\\\]|\\\\.)*:?",
                token: "",
                next: "formatString"
              }]
            });
            return SnippetManager2.$tokenizer;
          };
          SnippetManager2.prototype.tokenizeTmSnippet = function (str, startState) {
            return this.getTokenizer().getLineTokens(str, startState).tokens.map(function (x) {
              return x.value || x;
            });
          };
          SnippetManager2.prototype.getVariableValue = function (editor, name, indentation) {
            if ((/^\d+$/).test(name)) return (this.variables.__ || ({}))[name] || "";
            if ((/^[A-Z]\d+$/).test(name)) return (this.variables[name[0] + "__"] || ({}))[name.substr(1)] || "";
            name = name.replace(/^TM_/, "");
            if (!this.variables.hasOwnProperty(name)) return "";
            var value = this.variables[name];
            if (typeof value == "function") value = this.variables[name](editor, name, indentation);
            return value == null ? "" : value;
          };
          SnippetManager2.prototype.tmStrFormat = function (str, ch, editor) {
            if (!ch.fmt) return str;
            var flag = ch.flag || "";
            var re = ch.guard;
            re = new RegExp(re, flag.replace(/[^gim]/g, ""));
            var fmtTokens = typeof ch.fmt == "string" ? this.tokenizeTmSnippet(ch.fmt, "formatString") : ch.fmt;
            var _self = this;
            var formatted = str.replace(re, function () {
              var oldArgs = _self.variables.__;
              _self.variables.__ = [].slice.call(arguments);
              var fmtParts = _self.resolveVariables(fmtTokens, editor);
              var gChangeCase = "E";
              for (var i = 0; i < fmtParts.length; i++) {
                var ch2 = fmtParts[i];
                if (typeof ch2 == "object") {
                  fmtParts[i] = "";
                  if (ch2.changeCase && ch2.local) {
                    var next = fmtParts[i + 1];
                    if (next && typeof next == "string") {
                      if (ch2.changeCase == "u") fmtParts[i] = next[0].toUpperCase(); else fmtParts[i] = next[0].toLowerCase();
                      fmtParts[i + 1] = next.substr(1);
                    }
                  } else if (ch2.changeCase) {
                    gChangeCase = ch2.changeCase;
                  }
                } else if (gChangeCase == "U") {
                  fmtParts[i] = ch2.toUpperCase();
                } else if (gChangeCase == "L") {
                  fmtParts[i] = ch2.toLowerCase();
                }
              }
              _self.variables.__ = oldArgs;
              return fmtParts.join("");
            });
            return formatted;
          };
          SnippetManager2.prototype.tmFormatFunction = function (str, ch, editor) {
            if (ch.formatFunction == "upcase") return str.toUpperCase();
            if (ch.formatFunction == "downcase") return str.toLowerCase();
            return str;
          };
          SnippetManager2.prototype.resolveVariables = function (snippet, editor) {
            var result = [];
            var indentation = "";
            var afterNewLine = true;
            for (var i = 0; i < snippet.length; i++) {
              var ch = snippet[i];
              if (typeof ch == "string") {
                result.push(ch);
                if (ch == "\n") {
                  afterNewLine = true;
                  indentation = "";
                } else if (afterNewLine) {
                  indentation = (/^\t*/).exec(ch)[0];
                  afterNewLine = (/\S/).test(ch);
                }
                continue;
              }
              if (!ch) continue;
              afterNewLine = false;
              if (ch.fmtString) {
                var j = snippet.indexOf(ch, i + 1);
                if (j == -1) j = snippet.length;
                ch.fmt = snippet.slice(i + 1, j);
                i = j;
              }
              if (ch.text) {
                var value = this.getVariableValue(editor, ch.text, indentation) + "";
                if (ch.fmtString) value = this.tmStrFormat(value, ch, editor);
                if (ch.formatFunction) value = this.tmFormatFunction(value, ch, editor);
                if (value && !ch.ifEnd) {
                  result.push(value);
                  gotoNext(ch);
                } else if (!value && ch.ifEnd) {
                  gotoNext(ch.ifEnd);
                }
              } else if (ch.elseEnd) {
                gotoNext(ch.elseEnd);
              } else if (ch.tabstopId != null) {
                result.push(ch);
              } else if (ch.changeCase != null) {
                result.push(ch);
              }
            }
            function gotoNext(ch2) {
              var i1 = snippet.indexOf(ch2, i + 1);
              if (i1 != -1) i = i1;
            }
            return result;
          };
          SnippetManager2.prototype.getDisplayTextForSnippet = function (editor, snippetText) {
            var processedSnippet = processSnippetText.call(this, editor, snippetText);
            return processedSnippet.text;
          };
          SnippetManager2.prototype.insertSnippetForSelection = function (editor, snippetText, options) {
            if (options === void 0) {
              options = {};
            }
            var processedSnippet = processSnippetText.call(this, editor, snippetText, options);
            var range = editor.getSelectionRange();
            var end = editor.session.replace(range, processedSnippet.text);
            var tabstopManager = new TabstopManager(editor);
            var selectionId = editor.inVirtualSelectionMode && editor.selection.index;
            tabstopManager.addTabstops(processedSnippet.tabstops, range.start, end, selectionId);
          };
          SnippetManager2.prototype.insertSnippet = function (editor, snippetText, options) {
            if (options === void 0) {
              options = {};
            }
            var self = this;
            if (editor.inVirtualSelectionMode) return self.insertSnippetForSelection(editor, snippetText, options);
            editor.forEachSelection(function () {
              self.insertSnippetForSelection(editor, snippetText, options);
            }, null, {
              keepOrder: true
            });
            if (editor.tabstopManager) editor.tabstopManager.tabNext();
          };
          SnippetManager2.prototype.$getScope = function (editor) {
            var scope = editor.session.$mode.$id || "";
            scope = scope.split("/").pop();
            if (scope === "html" || scope === "php") {
              if (scope === "php" && !editor.session.$mode.inlinePhp) scope = "html";
              var c = editor.getCursorPosition();
              var state = editor.session.getState(c.row);
              if (typeof state === "object") {
                state = state[0];
              }
              if (state.substring) {
                if (state.substring(0, 3) == "js-") scope = "javascript"; else if (state.substring(0, 4) == "css-") scope = "css"; else if (state.substring(0, 4) == "php-") scope = "php";
              }
            }
            return scope;
          };
          SnippetManager2.prototype.getActiveScopes = function (editor) {
            var scope = this.$getScope(editor);
            var scopes = [scope];
            var snippetMap = this.snippetMap;
            if (snippetMap[scope] && snippetMap[scope].includeScopes) {
              scopes.push.apply(scopes, snippetMap[scope].includeScopes);
            }
            scopes.push("_");
            return scopes;
          };
          SnippetManager2.prototype.expandWithTab = function (editor, options) {
            var self = this;
            var result = editor.forEachSelection(function () {
              return self.expandSnippetForSelection(editor, options);
            }, null, {
              keepOrder: true
            });
            if (result && editor.tabstopManager) editor.tabstopManager.tabNext();
            return result;
          };
          SnippetManager2.prototype.expandSnippetForSelection = function (editor, options) {
            var cursor = editor.getCursorPosition();
            var line = editor.session.getLine(cursor.row);
            var before = line.substring(0, cursor.column);
            var after = line.substr(cursor.column);
            var snippetMap = this.snippetMap;
            var snippet;
            this.getActiveScopes(editor).some(function (scope) {
              var snippets = snippetMap[scope];
              if (snippets) snippet = this.findMatchingSnippet(snippets, before, after);
              return !!snippet;
            }, this);
            if (!snippet) return false;
            if (options && options.dryRun) return true;
            editor.session.doc.removeInLine(cursor.row, cursor.column - snippet.replaceBefore.length, cursor.column + snippet.replaceAfter.length);
            this.variables.M__ = snippet.matchBefore;
            this.variables.T__ = snippet.matchAfter;
            this.insertSnippetForSelection(editor, snippet.content);
            this.variables.M__ = this.variables.T__ = null;
            return true;
          };
          SnippetManager2.prototype.findMatchingSnippet = function (snippetList, before, after) {
            for (var i = snippetList.length; i--; ) {
              var s = snippetList[i];
              if (s.startRe && !s.startRe.test(before)) continue;
              if (s.endRe && !s.endRe.test(after)) continue;
              if (!s.startRe && !s.endRe) continue;
              s.matchBefore = s.startRe ? s.startRe.exec(before) : [""];
              s.matchAfter = s.endRe ? s.endRe.exec(after) : [""];
              s.replaceBefore = s.triggerRe ? s.triggerRe.exec(before)[0] : "";
              s.replaceAfter = s.endTriggerRe ? s.endTriggerRe.exec(after)[0] : "";
              return s;
            }
          };
          SnippetManager2.prototype.register = function (snippets, scope) {
            var snippetMap = this.snippetMap;
            var snippetNameMap = this.snippetNameMap;
            var self = this;
            if (!snippets) snippets = [];
            function wrapRegexp(src) {
              if (src && !(/^\^?\(.*\)\$?$|^\\b$/).test(src)) src = "(?:" + src + ")";
              return src || "";
            }
            function guardedRegexp(re, guard, opening) {
              re = wrapRegexp(re);
              guard = wrapRegexp(guard);
              if (opening) {
                re = guard + re;
                if (re && re[re.length - 1] != "$") re = re + "$";
              } else {
                re = re + guard;
                if (re && re[0] != "^") re = "^" + re;
              }
              return new RegExp(re);
            }
            function addSnippet(s) {
              if (!s.scope) s.scope = scope || "_";
              scope = s.scope;
              if (!snippetMap[scope]) {
                snippetMap[scope] = [];
                snippetNameMap[scope] = {};
              }
              var map = snippetNameMap[scope];
              if (s.name) {
                var old = map[s.name];
                if (old) self.unregister(old);
                map[s.name] = s;
              }
              snippetMap[scope].push(s);
              if (s.prefix) s.tabTrigger = s.prefix;
              if (!s.content && s.body) s.content = Array.isArray(s.body) ? s.body.join("\n") : s.body;
              if (s.tabTrigger && !s.trigger) {
                if (!s.guard && (/^\w/).test(s.tabTrigger)) s.guard = "\\b";
                s.trigger = lang.escapeRegExp(s.tabTrigger);
              }
              if (!s.trigger && !s.guard && !s.endTrigger && !s.endGuard) return;
              s.startRe = guardedRegexp(s.trigger, s.guard, true);
              s.triggerRe = new RegExp(s.trigger);
              s.endRe = guardedRegexp(s.endTrigger, s.endGuard, true);
              s.endTriggerRe = new RegExp(s.endTrigger);
            }
            if (Array.isArray(snippets)) {
              snippets.forEach(addSnippet);
            } else {
              Object.keys(snippets).forEach(function (key) {
                addSnippet(snippets[key]);
              });
            }
            this._signal("registerSnippets", {
              scope
            });
          };
          SnippetManager2.prototype.unregister = function (snippets, scope) {
            var snippetMap = this.snippetMap;
            var snippetNameMap = this.snippetNameMap;
            function removeSnippet(s) {
              var nameMap = snippetNameMap[s.scope || scope];
              if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                var map = snippetMap[s.scope || scope];
                var i = map && map.indexOf(s);
                if (i >= 0) map.splice(i, 1);
              }
            }
            if (snippets.content) removeSnippet(snippets); else if (Array.isArray(snippets)) snippets.forEach(removeSnippet);
          };
          SnippetManager2.prototype.parseSnippetFile = function (str) {
            str = str.replace(/\r/g, "");
            var list = [], snippet = {};
            var re = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
            var m;
            while (m = re.exec(str)) {
              if (m[1]) {
                try {
                  snippet = JSON.parse(m[1]);
                  list.push(snippet);
                } catch (e) {}
              }
              if (m[4]) {
                snippet.content = m[4].replace(/^\t/gm, "");
                list.push(snippet);
                snippet = {};
              } else {
                var key = m[2], val = m[3];
                if (key == "regex") {
                  var guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
                  snippet.guard = guardRe.exec(val)[1];
                  snippet.trigger = guardRe.exec(val)[1];
                  snippet.endTrigger = guardRe.exec(val)[1];
                  snippet.endGuard = guardRe.exec(val)[1];
                } else if (key == "snippet") {
                  snippet.tabTrigger = val.match(/^\S*/)[0];
                  if (!snippet.name) snippet.name = val;
                } else if (key) {
                  snippet[key] = val;
                }
              }
            }
            return list;
          };
          SnippetManager2.prototype.getSnippetByName = function (name, editor) {
            var snippetMap = this.snippetNameMap;
            var snippet;
            this.getActiveScopes(editor).some(function (scope) {
              var snippets = snippetMap[scope];
              if (snippets) snippet = snippets[name];
              return !!snippet;
            }, this);
            return snippet;
          };
          return SnippetManager2;
        })();
        oop.implement(SnippetManager.prototype, EventEmitter);
        var processSnippetText = function (editor, snippetText, options) {
          if (options === void 0) {
            options = {};
          }
          var cursor = editor.getCursorPosition();
          var line = editor.session.getLine(cursor.row);
          var tabString = editor.session.getTabString();
          var indentString = line.match(/^\s*/)[0];
          if (cursor.column < indentString.length) indentString = indentString.slice(0, cursor.column);
          snippetText = snippetText.replace(/\r/g, "");
          var tokens = this.tokenizeTmSnippet(snippetText);
          tokens = this.resolveVariables(tokens, editor);
          tokens = tokens.map(function (x) {
            if (x == "\n" && !options.excludeExtraIndent) return x + indentString;
            if (typeof x == "string") return x.replace(/\t/g, tabString);
            return x;
          });
          var tabstops = [];
          tokens.forEach(function (p2, i2) {
            if (typeof p2 != "object") return;
            var id2 = p2.tabstopId;
            var ts2 = tabstops[id2];
            if (!ts2) {
              ts2 = tabstops[id2] = [];
              ts2.index = id2;
              ts2.value = "";
              ts2.parents = {};
            }
            if (ts2.indexOf(p2) !== -1) return;
            if (p2.choices && !ts2.choices) ts2.choices = p2.choices;
            ts2.push(p2);
            var i12 = tokens.indexOf(p2, i2 + 1);
            if (i12 === -1) return;
            var value2 = tokens.slice(i2 + 1, i12);
            var isNested = value2.some(function (t) {
              return typeof t === "object";
            });
            if (isNested && !ts2.value) {
              ts2.value = value2;
            } else if (value2.length && (!ts2.value || typeof ts2.value !== "string")) {
              ts2.value = value2.join("");
            }
          });
          tabstops.forEach(function (ts2) {
            ts2.length = 0;
          });
          var expanding = {};
          function copyValue(val) {
            var copy = [];
            for (var i2 = 0; i2 < val.length; i2++) {
              var p2 = val[i2];
              if (typeof p2 == "object") {
                if (expanding[p2.tabstopId]) continue;
                var j = val.lastIndexOf(p2, i2 - 1);
                p2 = copy[j] || ({
                  tabstopId: p2.tabstopId
                });
              }
              copy[i2] = p2;
            }
            return copy;
          }
          for (var i = 0; i < tokens.length; i++) {
            var p = tokens[i];
            if (typeof p != "object") continue;
            var id = p.tabstopId;
            var ts = tabstops[id];
            var i1 = tokens.indexOf(p, i + 1);
            if (expanding[id]) {
              if (expanding[id] === p) {
                delete expanding[id];
                Object.keys(expanding).forEach(function (parentId) {
                  ts.parents[parentId] = true;
                });
              }
              continue;
            }
            expanding[id] = p;
            var value = ts.value;
            if (typeof value !== "string") value = copyValue(value); else if (p.fmt) value = this.tmStrFormat(value, p, editor);
            tokens.splice.apply(tokens, [i + 1, Math.max(0, i1 - i)].concat(value, p));
            if (ts.indexOf(p) === -1) ts.push(p);
          }
          var row = 0, column = 0;
          var text = "";
          tokens.forEach(function (t) {
            if (typeof t === "string") {
              var lines = t.split("\n");
              if (lines.length > 1) {
                column = lines[lines.length - 1].length;
                row += lines.length - 1;
              } else column += t.length;
              text += t;
            } else if (t) {
              if (!t.start) t.start = {
                row,
                column
              }; else t.end = {
                row,
                column
              };
            }
          });
          return {
            text,
            tabstops,
            tokens
          };
        };
        var TabstopManager = (function () {
          function TabstopManager2(editor) {
            this.index = 0;
            this.ranges = [];
            this.tabstops = [];
            if (editor.tabstopManager) return editor.tabstopManager;
            editor.tabstopManager = this;
            this.$onChange = this.onChange.bind(this);
            this.$onChangeSelection = lang.delayedCall(this.onChangeSelection.bind(this)).schedule;
            this.$onChangeSession = this.onChangeSession.bind(this);
            this.$onAfterExec = this.onAfterExec.bind(this);
            this.attach(editor);
          }
          TabstopManager2.prototype.attach = function (editor) {
            this.$openTabstops = null;
            this.selectedTabstop = null;
            this.editor = editor;
            this.session = editor.session;
            this.editor.on("change", this.$onChange);
            this.editor.on("changeSelection", this.$onChangeSelection);
            this.editor.on("changeSession", this.$onChangeSession);
            this.editor.commands.on("afterExec", this.$onAfterExec);
            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
          };
          TabstopManager2.prototype.detach = function () {
            this.tabstops.forEach(this.removeTabstopMarkers, this);
            this.ranges.length = 0;
            this.tabstops.length = 0;
            this.selectedTabstop = null;
            this.editor.off("change", this.$onChange);
            this.editor.off("changeSelection", this.$onChangeSelection);
            this.editor.off("changeSession", this.$onChangeSession);
            this.editor.commands.off("afterExec", this.$onAfterExec);
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.tabstopManager = null;
            this.session = null;
            this.editor = null;
          };
          TabstopManager2.prototype.onChange = function (delta) {
            var isRemove = delta.action[0] == "r";
            var selectedTabstop = this.selectedTabstop || ({});
            var parents = selectedTabstop.parents || ({});
            var tabstops = this.tabstops.slice();
            for (var i = 0; i < tabstops.length; i++) {
              var ts = tabstops[i];
              var active = ts == selectedTabstop || parents[ts.index];
              ts.rangeList.$bias = active ? 0 : 1;
              if (delta.action == "remove" && ts !== selectedTabstop) {
                var parentActive = ts.parents && ts.parents[selectedTabstop.index];
                var startIndex = ts.rangeList.pointIndex(delta.start, parentActive);
                startIndex = startIndex < 0 ? -startIndex - 1 : startIndex + 1;
                var endIndex = ts.rangeList.pointIndex(delta.end, parentActive);
                endIndex = endIndex < 0 ? -endIndex - 1 : endIndex - 1;
                var toRemove = ts.rangeList.ranges.slice(startIndex, endIndex);
                for (var j = 0; j < toRemove.length; j++) this.removeRange(toRemove[j]);
              }
              ts.rangeList.$onChange(delta);
            }
            var session = this.session;
            if (!this.$inChange && isRemove && session.getLength() == 1 && !session.getValue()) this.detach();
          };
          TabstopManager2.prototype.updateLinkedFields = function () {
            var ts = this.selectedTabstop;
            if (!ts || !ts.hasLinkedRanges || !ts.firstNonLinked) return;
            this.$inChange = true;
            var session = this.session;
            var text = session.getTextRange(ts.firstNonLinked);
            for (var i = 0; i < ts.length; i++) {
              var range = ts[i];
              if (!range.linked) continue;
              var original = range.original;
              var fmt = exports2.snippetManager.tmStrFormat(text, original, this.editor);
              session.replace(range, fmt);
            }
            this.$inChange = false;
          };
          TabstopManager2.prototype.onAfterExec = function (e) {
            if (e.command && !e.command.readOnly) this.updateLinkedFields();
          };
          TabstopManager2.prototype.onChangeSelection = function () {
            if (!this.editor) return;
            var lead = this.editor.selection.lead;
            var anchor = this.editor.selection.anchor;
            var isEmpty = this.editor.selection.isEmpty();
            for (var i = 0; i < this.ranges.length; i++) {
              if (this.ranges[i].linked) continue;
              var containsLead = this.ranges[i].contains(lead.row, lead.column);
              var containsAnchor = isEmpty || this.ranges[i].contains(anchor.row, anchor.column);
              if (containsLead && containsAnchor) return;
            }
            this.detach();
          };
          TabstopManager2.prototype.onChangeSession = function () {
            this.detach();
          };
          TabstopManager2.prototype.tabNext = function (dir) {
            var max = this.tabstops.length;
            var index = this.index + (dir || 1);
            index = Math.min(Math.max(index, 1), max);
            if (index == max) index = 0;
            this.selectTabstop(index);
            if (index === 0) this.detach();
          };
          TabstopManager2.prototype.selectTabstop = function (index) {
            this.$openTabstops = null;
            var ts = this.tabstops[this.index];
            if (ts) this.addTabstopMarkers(ts);
            this.index = index;
            ts = this.tabstops[this.index];
            if (!ts || !ts.length) return;
            this.selectedTabstop = ts;
            var range = ts.firstNonLinked || ts;
            if (ts.choices) range.cursor = range.start;
            if (!this.editor.inVirtualSelectionMode) {
              var sel = this.editor.multiSelect;
              sel.toSingleRange(range);
              for (var i = 0; i < ts.length; i++) {
                if (ts.hasLinkedRanges && ts[i].linked) continue;
                sel.addRange(ts[i].clone(), true);
              }
            } else {
              this.editor.selection.fromOrientedRange(range);
            }
            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
            if (this.selectedTabstop && this.selectedTabstop.choices) this.editor.execCommand("startAutocomplete", {
              matches: this.selectedTabstop.choices
            });
          };
          TabstopManager2.prototype.addTabstops = function (tabstops, start, end) {
            var useLink = this.useLink || !this.editor.getOption("enableMultiselect");
            if (!this.$openTabstops) this.$openTabstops = [];
            if (!tabstops[0]) {
              var p = Range.fromPoints(end, end);
              moveRelative(p.start, start);
              moveRelative(p.end, start);
              tabstops[0] = [p];
              tabstops[0].index = 0;
            }
            var i = this.index;
            var arg = [i + 1, 0];
            var ranges = this.ranges;
            tabstops.forEach(function (ts, index) {
              var dest = this.$openTabstops[index] || ts;
              for (var i2 = 0; i2 < ts.length; i2++) {
                var p2 = ts[i2];
                var range = Range.fromPoints(p2.start, p2.end || p2.start);
                movePoint(range.start, start);
                movePoint(range.end, start);
                range.original = p2;
                range.tabstop = dest;
                ranges.push(range);
                if (dest != ts) dest.unshift(range); else dest[i2] = range;
                if (p2.fmtString || dest.firstNonLinked && useLink) {
                  range.linked = true;
                  dest.hasLinkedRanges = true;
                } else if (!dest.firstNonLinked) dest.firstNonLinked = range;
              }
              if (!dest.firstNonLinked) dest.hasLinkedRanges = false;
              if (dest === ts) {
                arg.push(dest);
                this.$openTabstops[index] = dest;
              }
              this.addTabstopMarkers(dest);
              dest.rangeList = dest.rangeList || new RangeList();
              dest.rangeList.$bias = 0;
              dest.rangeList.addList(dest);
            }, this);
            if (arg.length > 2) {
              if (this.tabstops.length) arg.push(arg.splice(2, 1)[0]);
              this.tabstops.splice.apply(this.tabstops, arg);
            }
          };
          TabstopManager2.prototype.addTabstopMarkers = function (ts) {
            var session = this.session;
            ts.forEach(function (range) {
              if (!range.markerId) range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
            });
          };
          TabstopManager2.prototype.removeTabstopMarkers = function (ts) {
            var session = this.session;
            ts.forEach(function (range) {
              session.removeMarker(range.markerId);
              range.markerId = null;
            });
          };
          TabstopManager2.prototype.removeRange = function (range) {
            var i = range.tabstop.indexOf(range);
            if (i != -1) range.tabstop.splice(i, 1);
            i = this.ranges.indexOf(range);
            if (i != -1) this.ranges.splice(i, 1);
            i = range.tabstop.rangeList.ranges.indexOf(range);
            if (i != -1) range.tabstop.splice(i, 1);
            this.session.removeMarker(range.markerId);
            if (!range.tabstop.length) {
              i = this.tabstops.indexOf(range.tabstop);
              if (i != -1) this.tabstops.splice(i, 1);
              if (!this.tabstops.length) this.detach();
            }
          };
          return TabstopManager2;
        })();
        TabstopManager.prototype.keyboardHandler = new HashHandler();
        TabstopManager.prototype.keyboardHandler.bindKeys({
          "Tab": function (editor) {
            if (exports2.snippetManager && exports2.snippetManager.expandWithTab(editor)) return;
            editor.tabstopManager.tabNext(1);
            editor.renderer.scrollCursorIntoView();
          },
          "Shift-Tab": function (editor) {
            editor.tabstopManager.tabNext(-1);
            editor.renderer.scrollCursorIntoView();
          },
          "Esc": function (editor) {
            editor.tabstopManager.detach();
          }
        });
        var movePoint = function (point, diff) {
          if (point.row == 0) point.column += diff.column;
          point.row += diff.row;
        };
        var moveRelative = function (point, start) {
          if (point.row == start.row) point.column -= start.column;
          point.row -= start.row;
        };
        dom.importCssString("\n.ace_snippet-marker {\n    -moz-box-sizing: border-box;\n    box-sizing: border-box;\n    background: rgba(194, 193, 208, 0.09);\n    border: 1px dotted rgba(211, 208, 235, 0.62);\n    position: absolute;\n}", "snippets.css", false);
        exports2.snippetManager = new SnippetManager();
        var Editor = require2("./editor").Editor;
        (function () {
          this.insertSnippet = function (content, options) {
            return exports2.snippetManager.insertSnippet(this, content, options);
          };
          this.expandSnippet = function (options) {
            return exports2.snippetManager.expandWithTab(this, options);
          };
        }).call(Editor.prototype);
      });
      ace.define("ace/autocomplete/popup", ["require", "exports", "module", "ace/virtual_renderer", "ace/editor", "ace/range", "ace/lib/event", "ace/lib/lang", "ace/lib/dom", "ace/config"], function (require2, exports2, module2) {
        "use strict";
        var Renderer = require2("../virtual_renderer").VirtualRenderer;
        var Editor = require2("../editor").Editor;
        var Range = require2("../range").Range;
        var event = require2("../lib/event");
        var lang = require2("../lib/lang");
        var dom = require2("../lib/dom");
        var nls = require2("../config").nls;
        var getAriaId = function (index) {
          return ("suggest-aria-id:").concat(index);
        };
        var $singleLineEditor = function (el) {
          var renderer = new Renderer(el);
          renderer.$maxLines = 4;
          var editor = new Editor(renderer);
          editor.setHighlightActiveLine(false);
          editor.setShowPrintMargin(false);
          editor.renderer.setShowGutter(false);
          editor.renderer.setHighlightGutterLine(false);
          editor.$mouseHandler.$focusTimeout = 0;
          editor.$highlightTagPending = true;
          return editor;
        };
        var AcePopup = (function () {
          function AcePopup2(parentNode) {
            var el = dom.createElement("div");
            var popup = new $singleLineEditor(el);
            if (parentNode) {
              parentNode.appendChild(el);
            }
            el.style.display = "none";
            popup.renderer.content.style.cursor = "default";
            popup.renderer.setStyle("ace_autocomplete");
            popup.renderer.$textLayer.element.setAttribute("role", "listbox");
            popup.renderer.$textLayer.element.setAttribute("aria-label", nls("Autocomplete suggestions"));
            popup.renderer.textarea.setAttribute("aria-hidden", "true");
            popup.setOption("displayIndentGuides", false);
            popup.setOption("dragDelay", 150);
            var noop = function () {};
            popup.focus = noop;
            popup.$isFocused = true;
            popup.renderer.$cursorLayer.restartTimer = noop;
            popup.renderer.$cursorLayer.element.style.opacity = 0;
            popup.renderer.$maxLines = 8;
            popup.renderer.$keepTextAreaAtCursor = false;
            popup.setHighlightActiveLine(false);
            popup.session.highlight("");
            popup.session.$searchHighlight.clazz = "ace_highlight-marker";
            popup.on("mousedown", function (e) {
              var pos = e.getDocumentPosition();
              popup.selection.moveToPosition(pos);
              selectionMarker.start.row = selectionMarker.end.row = pos.row;
              e.stop();
            });
            var lastMouseEvent;
            var hoverMarker = new Range(-1, 0, -1, Infinity);
            var selectionMarker = new Range(-1, 0, -1, Infinity);
            selectionMarker.id = popup.session.addMarker(selectionMarker, "ace_active-line", "fullLine");
            popup.setSelectOnHover = function (val) {
              if (!val) {
                hoverMarker.id = popup.session.addMarker(hoverMarker, "ace_line-hover", "fullLine");
              } else if (hoverMarker.id) {
                popup.session.removeMarker(hoverMarker.id);
                hoverMarker.id = null;
              }
            };
            popup.setSelectOnHover(false);
            popup.on("mousemove", function (e) {
              if (!lastMouseEvent) {
                lastMouseEvent = e;
                return;
              }
              if (lastMouseEvent.x == e.x && lastMouseEvent.y == e.y) {
                return;
              }
              lastMouseEvent = e;
              lastMouseEvent.scrollTop = popup.renderer.scrollTop;
              var row = lastMouseEvent.getDocumentPosition().row;
              if (hoverMarker.start.row != row) {
                if (!hoverMarker.id) popup.setRow(row);
                setHoverMarker(row);
              }
            });
            popup.renderer.on("beforeRender", function () {
              if (lastMouseEvent && hoverMarker.start.row != -1) {
                lastMouseEvent.$pos = null;
                var row = lastMouseEvent.getDocumentPosition().row;
                if (!hoverMarker.id) popup.setRow(row);
                setHoverMarker(row, true);
              }
            });
            popup.renderer.on("afterRender", function () {
              var row = popup.getRow();
              var t = popup.renderer.$textLayer;
              var selected = t.element.childNodes[row - t.config.firstRow];
              var el2 = document.activeElement;
              if (selected !== t.selectedNode && t.selectedNode) {
                dom.removeCssClass(t.selectedNode, "ace_selected");
                el2.removeAttribute("aria-activedescendant");
                t.selectedNode.removeAttribute("id");
              }
              t.selectedNode = selected;
              if (selected) {
                dom.addCssClass(selected, "ace_selected");
                var ariaId = getAriaId(row);
                selected.id = ariaId;
                t.element.setAttribute("aria-activedescendant", ariaId);
                el2.setAttribute("aria-activedescendant", ariaId);
                selected.setAttribute("role", "option");
                selected.setAttribute("aria-label", popup.getData(row).value);
                selected.setAttribute("aria-setsize", popup.data.length);
                selected.setAttribute("aria-posinset", row + 1);
                selected.setAttribute("aria-describedby", "doc-tooltip");
              }
            });
            var hideHoverMarker = function () {
              setHoverMarker(-1);
            };
            var setHoverMarker = function (row, suppressRedraw) {
              if (row !== hoverMarker.start.row) {
                hoverMarker.start.row = hoverMarker.end.row = row;
                if (!suppressRedraw) popup.session._emit("changeBackMarker");
                popup._emit("changeHoverMarker");
              }
            };
            popup.getHoveredRow = function () {
              return hoverMarker.start.row;
            };
            event.addListener(popup.container, "mouseout", hideHoverMarker);
            popup.on("hide", hideHoverMarker);
            popup.on("changeSelection", hideHoverMarker);
            popup.session.doc.getLength = function () {
              return popup.data.length;
            };
            popup.session.doc.getLine = function (i) {
              var data = popup.data[i];
              if (typeof data == "string") return data;
              return data && data.value || "";
            };
            var bgTokenizer = popup.session.bgTokenizer;
            bgTokenizer.$tokenizeRow = function (row) {
              var data = popup.data[row];
              var tokens = [];
              if (!data) return tokens;
              if (typeof data == "string") data = {
                value: data
              };
              var caption = data.caption || data.value || data.name;
              function addToken(value, className) {
                value && tokens.push({
                  type: (data.className || "") + (className || ""),
                  value
                });
              }
              var lower = caption.toLowerCase();
              var filterText = (popup.filterText || "").toLowerCase();
              var lastIndex = 0;
              var lastI = 0;
              for (var i = 0; i <= filterText.length; i++) {
                if (i != lastI && (data.matchMask & 1 << i || i == filterText.length)) {
                  var sub = filterText.slice(lastI, i);
                  lastI = i;
                  var index = lower.indexOf(sub, lastIndex);
                  if (index == -1) continue;
                  addToken(caption.slice(lastIndex, index), "");
                  lastIndex = index + sub.length;
                  addToken(caption.slice(index, lastIndex), "completion-highlight");
                }
              }
              addToken(caption.slice(lastIndex, caption.length), "");
              tokens.push({
                type: "completion-spacer",
                value: " "
              });
              if (data.meta) tokens.push({
                type: "completion-meta",
                value: data.meta
              });
              if (data.message) tokens.push({
                type: "completion-message",
                value: data.message
              });
              return tokens;
            };
            bgTokenizer.$updateOnChange = noop;
            bgTokenizer.start = noop;
            popup.session.$computeWidth = function () {
              return this.screenWidth = 0;
            };
            popup.isOpen = false;
            popup.isTopdown = false;
            popup.autoSelect = true;
            popup.filterText = "";
            popup.data = [];
            popup.setData = function (list, filterText) {
              popup.filterText = filterText || "";
              popup.setValue(lang.stringRepeat("\n", list.length), -1);
              popup.data = list || [];
              popup.setRow(0);
            };
            popup.getData = function (row) {
              return popup.data[row];
            };
            popup.getRow = function () {
              return selectionMarker.start.row;
            };
            popup.setRow = function (line) {
              line = Math.max(this.autoSelect ? 0 : -1, Math.min(this.data.length - 1, line));
              if (selectionMarker.start.row != line) {
                popup.selection.clearSelection();
                selectionMarker.start.row = selectionMarker.end.row = line || 0;
                popup.session._emit("changeBackMarker");
                popup.moveCursorTo(line || 0, 0);
                if (popup.isOpen) popup._signal("select");
              }
            };
            popup.on("changeSelection", function () {
              if (popup.isOpen) popup.setRow(popup.selection.lead.row);
              popup.renderer.scrollCursorIntoView();
            });
            popup.hide = function () {
              this.container.style.display = "none";
              popup.anchorPos = null;
              popup.anchor = null;
              if (popup.isOpen) {
                popup.isOpen = false;
                this._signal("hide");
              }
            };
            popup.tryShow = function (pos, lineHeight, anchor, forceShow) {
              if (!forceShow && popup.isOpen && popup.anchorPos && popup.anchor && popup.anchorPos.top === pos.top && popup.anchorPos.left === pos.left && popup.anchor === anchor) {
                return true;
              }
              var el2 = this.container;
              var screenHeight = window.innerHeight;
              var screenWidth = window.innerWidth;
              var renderer = this.renderer;
              var maxH = renderer.$maxLines * lineHeight * 1.4;
              var dims = {
                top: 0,
                bottom: 0,
                left: 0
              };
              var spaceBelow = screenHeight - pos.top - 3 * this.$borderSize - lineHeight;
              var spaceAbove = pos.top - 3 * this.$borderSize;
              if (!anchor) {
                if (spaceAbove <= spaceBelow || spaceBelow >= maxH) {
                  anchor = "bottom";
                } else {
                  anchor = "top";
                }
              }
              if (anchor === "top") {
                dims.bottom = pos.top - this.$borderSize;
                dims.top = dims.bottom - maxH;
              } else if (anchor === "bottom") {
                dims.top = pos.top + lineHeight + this.$borderSize;
                dims.bottom = dims.top + maxH;
              }
              var fitsX = dims.top >= 0 && dims.bottom <= screenHeight;
              if (!forceShow && !fitsX) {
                return false;
              }
              if (!fitsX) {
                if (anchor === "top") {
                  renderer.$maxPixelHeight = spaceAbove;
                } else {
                  renderer.$maxPixelHeight = spaceBelow;
                }
              } else {
                renderer.$maxPixelHeight = null;
              }
              if (anchor === "top") {
                el2.style.top = "";
                el2.style.bottom = screenHeight - dims.bottom + "px";
                popup.isTopdown = false;
              } else {
                el2.style.top = dims.top + "px";
                el2.style.bottom = "";
                popup.isTopdown = true;
              }
              el2.style.display = "";
              var left = pos.left;
              if (left + el2.offsetWidth > screenWidth) left = screenWidth - el2.offsetWidth;
              el2.style.left = left + "px";
              el2.style.right = "";
              if (!popup.isOpen) {
                popup.isOpen = true;
                this._signal("show");
                lastMouseEvent = null;
              }
              popup.anchorPos = pos;
              popup.anchor = anchor;
              return true;
            };
            popup.show = function (pos, lineHeight, topdownOnly) {
              this.tryShow(pos, lineHeight, topdownOnly ? "bottom" : void 0, true);
            };
            popup.goTo = function (where) {
              var row = this.getRow();
              var max = this.session.getLength() - 1;
              switch (where) {
                case "up":
                  row = row <= 0 ? max : row - 1;
                  break;
                case "down":
                  row = row >= max ? -1 : row + 1;
                  break;
                case "start":
                  row = 0;
                  break;
                case "end":
                  row = max;
                  break;
              }
              this.setRow(row);
            };
            popup.getTextLeftOffset = function () {
              return this.$borderSize + this.renderer.$padding + this.$imageSize;
            };
            popup.$imageSize = 0;
            popup.$borderSize = 1;
            return popup;
          }
          return AcePopup2;
        })();
        dom.importCssString("\n.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #CAD6FA;\n    z-index: 1;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #3a674e;\n}\n.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid #abbffe;\n    margin-top: -1px;\n    background: rgba(233,233,253,0.4);\n    position: absolute;\n    z-index: 2;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid rgba(109, 150, 13, 0.8);\n    background: rgba(58, 103, 78, 0.62);\n}\n.ace_completion-meta {\n    opacity: 0.5;\n    margin-left: 0.9em;\n}\n.ace_completion-message {\n    color: blue;\n}\n.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #2d69c7;\n}\n.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #93ca12;\n}\n.ace_editor.ace_autocomplete {\n    width: 300px;\n    z-index: 200000;\n    border: 1px lightgray solid;\n    position: fixed;\n    box-shadow: 2px 3px 5px rgba(0,0,0,.2);\n    line-height: 1.4;\n    background: #fefefe;\n    color: #111;\n}\n.ace_dark.ace_editor.ace_autocomplete {\n    border: 1px #484747 solid;\n    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.51);\n    line-height: 1.4;\n    background: #25282c;\n    color: #c1c1c1;\n}\n.ace_autocomplete .ace_text-layer  {\n    width: calc(100% - 8px);\n}\n.ace_autocomplete .ace_line {\n    display: flex;\n    align-items: center;\n}\n.ace_autocomplete .ace_line > * {\n    min-width: 0;\n    flex: 0 0 auto;\n}\n.ace_autocomplete .ace_line .ace_ {\n    flex: 0 1 auto;\n    overflow: hidden;\n    white-space: nowrap;\n    text-overflow: ellipsis;\n}\n.ace_autocomplete .ace_completion-spacer {\n    flex: 1;\n}\n", "autocompletion.css", false);
        exports2.AcePopup = AcePopup;
        exports2.$singleLineEditor = $singleLineEditor;
        exports2.getAriaId = getAriaId;
      });
      ace.define("ace/autocomplete/inline", ["require", "exports", "module", "ace/snippets"], function (require2, exports2, module2) {
        "use strict";
        var snippetManager = require2("../snippets").snippetManager;
        var AceInline = (function () {
          function AceInline2() {
            this.editor = null;
          }
          AceInline2.prototype.show = function (editor, completion, prefix) {
            prefix = prefix || "";
            if (editor && this.editor && this.editor !== editor) {
              this.hide();
              this.editor = null;
            }
            if (!editor || !completion) {
              return false;
            }
            var displayText = completion.snippet ? snippetManager.getDisplayTextForSnippet(editor, completion.snippet) : completion.value;
            if (!displayText || !displayText.startsWith(prefix)) {
              return false;
            }
            this.editor = editor;
            displayText = displayText.slice(prefix.length);
            if (displayText === "") {
              editor.removeGhostText();
            } else {
              editor.setGhostText(displayText);
            }
            return true;
          };
          AceInline2.prototype.isOpen = function () {
            if (!this.editor) {
              return false;
            }
            return !!this.editor.renderer.$ghostText;
          };
          AceInline2.prototype.hide = function () {
            if (!this.editor) {
              return false;
            }
            this.editor.removeGhostText();
            return true;
          };
          AceInline2.prototype.destroy = function () {
            this.hide();
            this.editor = null;
          };
          return AceInline2;
        })();
        exports2.AceInline = AceInline;
      });
      ace.define("ace/autocomplete/util", ["require", "exports", "module"], function (require2, exports2, module2) {
        "use strict";
        exports2.parForEach = function (array, fn, callback) {
          var completed = 0;
          var arLength = array.length;
          if (arLength === 0) callback();
          for (var i = 0; i < arLength; i++) {
            fn(array[i], function (result, err) {
              completed++;
              if (completed === arLength) callback(result, err);
            });
          }
        };
        var ID_REGEX = /[a-zA-Z_0-9\$\-\u00A2-\u2000\u2070-\uFFFF]/;
        exports2.retrievePrecedingIdentifier = function (text, pos, regex) {
          regex = regex || ID_REGEX;
          var buf = [];
          for (var i = pos - 1; i >= 0; i--) {
            if (regex.test(text[i])) buf.push(text[i]); else break;
          }
          return buf.reverse().join("");
        };
        exports2.retrieveFollowingIdentifier = function (text, pos, regex) {
          regex = regex || ID_REGEX;
          var buf = [];
          for (var i = pos; i < text.length; i++) {
            if (regex.test(text[i])) buf.push(text[i]); else break;
          }
          return buf;
        };
        exports2.getCompletionPrefix = function (editor) {
          var pos = editor.getCursorPosition();
          var line = editor.session.getLine(pos.row);
          var prefix;
          editor.completers.forEach((function (completer) {
            if (completer.identifierRegexps) {
              completer.identifierRegexps.forEach((function (identifierRegex) {
                if (!prefix && identifierRegex) prefix = this.retrievePrecedingIdentifier(line, pos.column, identifierRegex);
              }).bind(this));
            }
          }).bind(this));
          return prefix || this.retrievePrecedingIdentifier(line, pos.column);
        };
        exports2.triggerAutocomplete = function (editor) {
          var pos = editor.getCursorPosition();
          var line = editor.session.getLine(pos.row);
          var column = pos.column === 0 ? 0 : pos.column - 1;
          var previousChar = line[column];
          return editor.completers.some(function (el) {
            if (el.triggerCharacters && Array.isArray(el.triggerCharacters)) {
              return el.triggerCharacters.includes(previousChar);
            }
          });
        };
      });
      ace.define("ace/autocomplete", ["require", "exports", "module", "ace/keyboard/hash_handler", "ace/autocomplete/popup", "ace/autocomplete/inline", "ace/autocomplete/popup", "ace/autocomplete/util", "ace/lib/lang", "ace/lib/dom", "ace/snippets", "ace/config"], function (require2, exports2, module2) {
        "use strict";
        var HashHandler = require2("./keyboard/hash_handler").HashHandler;
        var AcePopup = require2("./autocomplete/popup").AcePopup;
        var AceInline = require2("./autocomplete/inline").AceInline;
        var getAriaId = require2("./autocomplete/popup").getAriaId;
        var util = require2("./autocomplete/util");
        var lang = require2("./lib/lang");
        var dom = require2("./lib/dom");
        var snippetManager = require2("./snippets").snippetManager;
        var config = require2("./config");
        var destroyCompleter = function (e, editor) {
          editor.completer && editor.completer.destroy();
        };
        var Autocomplete = (function () {
          function Autocomplete2() {
            this.autoInsert = false;
            this.autoSelect = true;
            this.autoShown = false;
            this.exactMatch = false;
            this.inlineEnabled = false;
            this.keyboardHandler = new HashHandler();
            this.keyboardHandler.bindKeys(this.commands);
            this.parentNode = null;
            this.blurListener = this.blurListener.bind(this);
            this.changeListener = this.changeListener.bind(this);
            this.mousedownListener = this.mousedownListener.bind(this);
            this.mousewheelListener = this.mousewheelListener.bind(this);
            this.onLayoutChange = this.onLayoutChange.bind(this);
            this.changeTimer = lang.delayedCall((function () {
              this.updateCompletions(true);
            }).bind(this));
            this.tooltipTimer = lang.delayedCall(this.updateDocTooltip.bind(this), 50);
          }
          Autocomplete2.prototype.$init = function () {
            this.popup = new AcePopup(this.parentNode || document.body || document.documentElement);
            this.popup.on("click", (function (e) {
              this.insertMatch();
              e.stop();
            }).bind(this));
            this.popup.focus = this.editor.focus.bind(this.editor);
            this.popup.on("show", this.$onPopupChange.bind(this));
            this.popup.on("hide", this.$onHidePopup.bind(this));
            this.popup.on("select", this.$onPopupChange.bind(this));
            this.popup.on("changeHoverMarker", this.tooltipTimer.bind(null, null));
            return this.popup;
          };
          Autocomplete2.prototype.$initInline = function () {
            if (!this.inlineEnabled || this.inlineRenderer) return;
            this.inlineRenderer = new AceInline();
            return this.inlineRenderer;
          };
          Autocomplete2.prototype.getPopup = function () {
            return this.popup || this.$init();
          };
          Autocomplete2.prototype.$onHidePopup = function () {
            if (this.inlineRenderer) {
              this.inlineRenderer.hide();
            }
            this.hideDocTooltip();
          };
          Autocomplete2.prototype.$onPopupChange = function (hide) {
            if (this.inlineRenderer && this.inlineEnabled) {
              var completion = hide ? null : this.popup.getData(this.popup.getRow());
              var prefix = util.getCompletionPrefix(this.editor);
              if (!this.inlineRenderer.show(this.editor, completion, prefix)) {
                this.inlineRenderer.hide();
              }
              this.$updatePopupPosition();
            }
            this.tooltipTimer.call(null, null);
          };
          Autocomplete2.prototype.observeLayoutChanges = function () {
            if (this.$elements || !this.editor) return;
            window.addEventListener("resize", this.onLayoutChange, {
              passive: true
            });
            window.addEventListener("wheel", this.mousewheelListener);
            var el = this.editor.container.parentNode;
            var elements = [];
            while (el) {
              elements.push(el);
              el.addEventListener("scroll", this.onLayoutChange, {
                passive: true
              });
              el = el.parentNode;
            }
            this.$elements = elements;
          };
          Autocomplete2.prototype.unObserveLayoutChanges = function () {
            var _this = this;
            window.removeEventListener("resize", this.onLayoutChange, {
              passive: true
            });
            window.removeEventListener("wheel", this.mousewheelListener);
            this.$elements && this.$elements.forEach(function (el) {
              el.removeEventListener("scroll", _this.onLayoutChange, {
                passive: true
              });
            });
            this.$elements = null;
          };
          Autocomplete2.prototype.onLayoutChange = function () {
            if (!this.popup.isOpen) return this.unObserveLayoutChanges();
            this.$updatePopupPosition();
            this.updateDocTooltip();
          };
          Autocomplete2.prototype.$updatePopupPosition = function () {
            var editor = this.editor;
            var renderer = editor.renderer;
            var lineHeight = renderer.layerConfig.lineHeight;
            var pos = renderer.$cursorLayer.getPixelPosition(this.base, true);
            pos.left -= this.popup.getTextLeftOffset();
            var rect = editor.container.getBoundingClientRect();
            pos.top += rect.top - renderer.layerConfig.offset;
            pos.left += rect.left - editor.renderer.scrollLeft;
            pos.left += renderer.gutterWidth;
            var posGhostText = {
              top: pos.top,
              left: pos.left
            };
            if (renderer.$ghostText && renderer.$ghostTextWidget) {
              if (this.base.row === renderer.$ghostText.position.row) {
                posGhostText.top += renderer.$ghostTextWidget.el.offsetHeight;
              }
            }
            if (this.popup.tryShow(posGhostText, lineHeight, "bottom")) {
              return;
            }
            if (this.popup.tryShow(pos, lineHeight, "top")) {
              return;
            }
            this.popup.show(pos, lineHeight);
          };
          Autocomplete2.prototype.openPopup = function (editor, prefix, keepPopupPosition) {
            if (!this.popup) this.$init();
            if (this.inlineEnabled && !this.inlineRenderer) this.$initInline();
            this.popup.autoSelect = this.autoSelect;
            this.popup.setData(this.completions.filtered, this.completions.filterText);
            if (this.editor.textInput.setAriaOptions) {
              this.editor.textInput.setAriaOptions({
                activeDescendant: getAriaId(this.popup.getRow()),
                inline: this.inlineEnabled
              });
            }
            editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
            this.popup.setRow(this.autoSelect ? 0 : -1);
            if (!keepPopupPosition) {
              this.popup.setTheme(editor.getTheme());
              this.popup.setFontSize(editor.getFontSize());
              this.$updatePopupPosition();
              if (this.tooltipNode) {
                this.updateDocTooltip();
              }
            } else if (keepPopupPosition && !prefix) {
              this.detach();
            }
            this.changeTimer.cancel();
            this.observeLayoutChanges();
          };
          Autocomplete2.prototype.detach = function () {
            if (this.editor) {
              this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
              this.editor.off("changeSelection", this.changeListener);
              this.editor.off("blur", this.blurListener);
              this.editor.off("mousedown", this.mousedownListener);
              this.editor.off("mousewheel", this.mousewheelListener);
            }
            this.changeTimer.cancel();
            this.hideDocTooltip();
            if (this.completionProvider) {
              this.completionProvider.detach();
            }
            if (this.popup && this.popup.isOpen) this.popup.hide();
            if (this.base) this.base.detach();
            this.activated = false;
            this.completionProvider = this.completions = this.base = null;
            this.unObserveLayoutChanges();
          };
          Autocomplete2.prototype.changeListener = function (e) {
            var cursor = this.editor.selection.lead;
            if (cursor.row != this.base.row || cursor.column < this.base.column) {
              this.detach();
            }
            if (this.activated) this.changeTimer.schedule(); else this.detach();
          };
          Autocomplete2.prototype.blurListener = function (e) {
            var el = document.activeElement;
            var text = this.editor.textInput.getElement();
            var fromTooltip = e.relatedTarget && this.tooltipNode && this.tooltipNode.contains(e.relatedTarget);
            var container = this.popup && this.popup.container;
            if (el != text && el.parentNode != container && !fromTooltip && el != this.tooltipNode && e.relatedTarget != text) {
              this.detach();
            }
          };
          Autocomplete2.prototype.mousedownListener = function (e) {
            this.detach();
          };
          Autocomplete2.prototype.mousewheelListener = function (e) {
            this.detach();
          };
          Autocomplete2.prototype.goTo = function (where) {
            this.popup.goTo(where);
          };
          Autocomplete2.prototype.insertMatch = function (data, options) {
            if (!data) data = this.popup.getData(this.popup.getRow());
            if (!data) return false;
            if (data.value === "") return this.detach();
            var completions = this.completions;
            var result = this.getCompletionProvider().insertMatch(this.editor, data, completions.filterText, options);
            if (this.completions == completions) this.detach();
            return result;
          };
          Autocomplete2.prototype.showPopup = function (editor, options) {
            if (this.editor) this.detach();
            this.activated = true;
            this.editor = editor;
            if (editor.completer != this) {
              if (editor.completer) editor.completer.detach();
              editor.completer = this;
            }
            editor.on("changeSelection", this.changeListener);
            editor.on("blur", this.blurListener);
            editor.on("mousedown", this.mousedownListener);
            editor.on("mousewheel", this.mousewheelListener);
            this.updateCompletions(false, options);
          };
          Autocomplete2.prototype.getCompletionProvider = function (initialPosition) {
            if (!this.completionProvider) this.completionProvider = new CompletionProvider(initialPosition);
            return this.completionProvider;
          };
          Autocomplete2.prototype.gatherCompletions = function (editor, callback) {
            return this.getCompletionProvider().gatherCompletions(editor, callback);
          };
          Autocomplete2.prototype.updateCompletions = function (keepPopupPosition, options) {
            if (keepPopupPosition && this.base && this.completions) {
              var pos = this.editor.getCursorPosition();
              var prefix = this.editor.session.getTextRange({
                start: this.base,
                end: pos
              });
              if (prefix == this.completions.filterText) return;
              this.completions.setFilter(prefix);
              if (!this.completions.filtered.length) return this.detach();
              if (this.completions.filtered.length == 1 && this.completions.filtered[0].value == prefix && !this.completions.filtered[0].snippet) return this.detach();
              this.openPopup(this.editor, prefix, keepPopupPosition);
              return;
            }
            if (options && options.matches) {
              var pos = this.editor.getSelectionRange().start;
              this.base = this.editor.session.doc.createAnchor(pos.row, pos.column);
              this.base.$insertRight = true;
              this.completions = new FilteredList(options.matches);
              return this.openPopup(this.editor, "", keepPopupPosition);
            }
            var session = this.editor.getSession();
            var pos = this.editor.getCursorPosition();
            var prefix = util.getCompletionPrefix(this.editor);
            this.base = session.doc.createAnchor(pos.row, pos.column - prefix.length);
            this.base.$insertRight = true;
            var completionOptions = {
              exactMatch: this.exactMatch
            };
            this.getCompletionProvider({
              prefix,
              pos
            }).provideCompletions(this.editor, completionOptions, (function (err, completions, finished) {
              var filtered = completions.filtered;
              var prefix2 = util.getCompletionPrefix(this.editor);
              if (finished) {
                if (!filtered.length) {
                  var emptyMessage = !this.autoShown && this.emptyMessage;
                  if (typeof emptyMessage == "function") emptyMessage = this.emptyMessage(prefix2);
                  if (emptyMessage) {
                    var completionsForEmpty = [{
                      caption: this.emptyMessage(prefix2),
                      value: ""
                    }];
                    this.completions = new FilteredList(completionsForEmpty);
                    this.openPopup(this.editor, prefix2, keepPopupPosition);
                    return;
                  }
                  return this.detach();
                }
                if (filtered.length == 1 && filtered[0].value == prefix2 && !filtered[0].snippet) return this.detach();
                if (this.autoInsert && !this.autoShown && filtered.length == 1) return this.insertMatch(filtered[0]);
              }
              this.completions = completions;
              this.openPopup(this.editor, prefix2, keepPopupPosition);
            }).bind(this));
          };
          Autocomplete2.prototype.cancelContextMenu = function () {
            this.editor.$mouseHandler.cancelContextMenu();
          };
          Autocomplete2.prototype.updateDocTooltip = function () {
            var popup = this.popup;
            var all = popup.data;
            var selected = all && (all[popup.getHoveredRow()] || all[popup.getRow()]);
            var doc = null;
            if (!selected || !this.editor || !this.popup.isOpen) return this.hideDocTooltip();
            var completersLength = this.editor.completers.length;
            for (var i = 0; i < completersLength; i++) {
              var completer = this.editor.completers[i];
              if (completer.getDocTooltip && selected.completerId === completer.id) {
                doc = completer.getDocTooltip(selected);
                break;
              }
            }
            if (!doc && typeof selected != "string") doc = selected;
            if (typeof doc == "string") doc = {
              docText: doc
            };
            if (!doc || !(doc.docHTML || doc.docText)) return this.hideDocTooltip();
            this.showDocTooltip(doc);
          };
          Autocomplete2.prototype.showDocTooltip = function (item) {
            if (!this.tooltipNode) {
              this.tooltipNode = dom.createElement("div");
              this.tooltipNode.style.margin = 0;
              this.tooltipNode.style.pointerEvents = "auto";
              this.tooltipNode.tabIndex = -1;
              this.tooltipNode.onblur = this.blurListener.bind(this);
              this.tooltipNode.onclick = this.onTooltipClick.bind(this);
              this.tooltipNode.id = "doc-tooltip";
              this.tooltipNode.setAttribute("role", "tooltip");
            }
            var theme = this.editor.renderer.theme;
            this.tooltipNode.className = "ace_tooltip ace_doc-tooltip " + (theme.isDark ? "ace_dark " : "") + (theme.cssClass || "");
            var tooltipNode = this.tooltipNode;
            if (item.docHTML) {
              tooltipNode.innerHTML = item.docHTML;
            } else if (item.docText) {
              tooltipNode.textContent = item.docText;
            }
            if (!tooltipNode.parentNode) this.popup.container.appendChild(this.tooltipNode);
            var popup = this.popup;
            var rect = popup.container.getBoundingClientRect();
            tooltipNode.style.top = popup.container.style.top;
            tooltipNode.style.bottom = popup.container.style.bottom;
            tooltipNode.style.display = "block";
            if (window.innerWidth - rect.right < 320) {
              if (rect.left < 320) {
                if (popup.isTopdown) {
                  tooltipNode.style.top = rect.bottom + "px";
                  tooltipNode.style.left = rect.left + "px";
                  tooltipNode.style.right = "";
                  tooltipNode.style.bottom = "";
                } else {
                  tooltipNode.style.top = popup.container.offsetTop - tooltipNode.offsetHeight + "px";
                  tooltipNode.style.left = rect.left + "px";
                  tooltipNode.style.right = "";
                  tooltipNode.style.bottom = "";
                }
              } else {
                tooltipNode.style.right = window.innerWidth - rect.left + "px";
                tooltipNode.style.left = "";
              }
            } else {
              tooltipNode.style.left = rect.right + 1 + "px";
              tooltipNode.style.right = "";
            }
          };
          Autocomplete2.prototype.hideDocTooltip = function () {
            this.tooltipTimer.cancel();
            if (!this.tooltipNode) return;
            var el = this.tooltipNode;
            if (!this.editor.isFocused() && document.activeElement == el) this.editor.focus();
            this.tooltipNode = null;
            if (el.parentNode) el.parentNode.removeChild(el);
          };
          Autocomplete2.prototype.onTooltipClick = function (e) {
            var a = e.target;
            while (a && a != this.tooltipNode) {
              if (a.nodeName == "A" && a.href) {
                a.rel = "noreferrer";
                a.target = "_blank";
                break;
              }
              a = a.parentNode;
            }
          };
          Autocomplete2.prototype.destroy = function () {
            this.detach();
            if (this.popup) {
              this.popup.destroy();
              var el = this.popup.container;
              if (el && el.parentNode) el.parentNode.removeChild(el);
            }
            if (this.editor && this.editor.completer == this) {
              this.editor.off("destroy", destroyCompleter);
              this.editor.completer = null;
            }
            this.inlineRenderer = this.popup = this.editor = null;
          };
          return Autocomplete2;
        })();
        Autocomplete.prototype.commands = {
          "Up": function (editor) {
            editor.completer.goTo("up");
          },
          "Down": function (editor) {
            editor.completer.goTo("down");
          },
          "Ctrl-Up|Ctrl-Home": function (editor) {
            editor.completer.goTo("start");
          },
          "Ctrl-Down|Ctrl-End": function (editor) {
            editor.completer.goTo("end");
          },
          "Esc": function (editor) {
            editor.completer.detach();
          },
          "Return": function (editor) {
            return editor.completer.insertMatch();
          },
          "Shift-Return": function (editor) {
            editor.completer.insertMatch(null, {
              deleteSuffix: true
            });
          },
          "Tab": function (editor) {
            var result = editor.completer.insertMatch();
            if (!result && !editor.tabstopManager) editor.completer.goTo("down"); else return result;
          },
          "PageUp": function (editor) {
            editor.completer.popup.gotoPageUp();
          },
          "PageDown": function (editor) {
            editor.completer.popup.gotoPageDown();
          }
        };
        Autocomplete.for = function (editor) {
          if (editor.completer instanceof Autocomplete) {
            return editor.completer;
          }
          if (editor.completer) {
            editor.completer.destroy();
            editor.completer = null;
          }
          if (config.get("sharedPopups")) {
            if (!Autocomplete.$sharedInstance) Autocomplete.$sharedInstance = new Autocomplete();
            editor.completer = Autocomplete.$sharedInstance;
          } else {
            editor.completer = new Autocomplete();
            editor.once("destroy", destroyCompleter);
          }
          return editor.completer;
        };
        Autocomplete.startCommand = {
          name: "startAutocomplete",
          exec: function (editor, options) {
            var completer = Autocomplete.for(editor);
            completer.autoInsert = false;
            completer.autoSelect = true;
            completer.autoShown = false;
            completer.showPopup(editor, options);
            completer.cancelContextMenu();
          },
          bindKey: "Ctrl-Space|Ctrl-Shift-Space|Alt-Space"
        };
        var CompletionProvider = (function () {
          function CompletionProvider2(initialPosition) {
            this.initialPosition = initialPosition;
            this.active = true;
          }
          CompletionProvider2.prototype.insertByIndex = function (editor, index, options) {
            if (!this.completions || !this.completions.filtered) {
              return false;
            }
            return this.insertMatch(editor, this.completions.filtered[index], options);
          };
          CompletionProvider2.prototype.insertMatch = function (editor, data, options) {
            if (!data) return false;
            editor.startOperation({
              command: {
                name: "insertMatch"
              }
            });
            if (data.completer && data.completer.insertMatch) {
              data.completer.insertMatch(editor, data);
            } else {
              if (!this.completions) return false;
              var replaceBefore = this.completions.filterText.length;
              var replaceAfter = 0;
              if (data.range && data.range.start.row === data.range.end.row) {
                replaceBefore -= this.initialPosition.prefix.length;
                replaceBefore += this.initialPosition.pos.column - data.range.start.column;
                replaceAfter += data.range.end.column - this.initialPosition.pos.column;
              }
              if (replaceBefore || replaceAfter) {
                var ranges;
                if (editor.selection.getAllRanges) {
                  ranges = editor.selection.getAllRanges();
                } else {
                  ranges = [editor.getSelectionRange()];
                }
                for (var i = 0, range; range = ranges[i]; i++) {
                  range.start.column -= replaceBefore;
                  range.end.column += replaceAfter;
                  editor.session.remove(range);
                }
              }
              if (data.snippet) {
                snippetManager.insertSnippet(editor, data.snippet);
              } else {
                this.$insertString(editor, data);
              }
              if (data.command && data.command === "startAutocomplete") {
                editor.execCommand(data.command);
              }
            }
            editor.endOperation();
            return true;
          };
          CompletionProvider2.prototype.$insertString = function (editor, data) {
            var text = data.value || data;
            editor.execCommand("insertstring", text);
          };
          CompletionProvider2.prototype.gatherCompletions = function (editor, callback) {
            var session = editor.getSession();
            var pos = editor.getCursorPosition();
            var prefix = util.getCompletionPrefix(editor);
            var matches = [];
            this.completers = editor.completers;
            var total = editor.completers.length;
            editor.completers.forEach(function (completer, i) {
              completer.getCompletions(editor, session, pos, prefix, function (err, results) {
                if (!err && results) matches = matches.concat(results);
                callback(null, {
                  prefix: util.getCompletionPrefix(editor),
                  matches,
                  finished: --total === 0
                });
              });
            });
            return true;
          };
          CompletionProvider2.prototype.provideCompletions = function (editor, options, callback) {
            var processResults = (function (results2) {
              var prefix = results2.prefix;
              var matches = results2.matches;
              this.completions = new FilteredList(matches);
              if (options.exactMatch) this.completions.exactMatch = true;
              if (options.ignoreCaption) this.completions.ignoreCaption = true;
              this.completions.setFilter(prefix);
              if (results2.finished || this.completions.filtered.length) callback(null, this.completions, results2.finished);
            }).bind(this);
            var isImmediate = true;
            var immediateResults = null;
            this.gatherCompletions(editor, (function (err, results2) {
              if (!this.active) {
                return;
              }
              if (err) {
                callback(err, [], true);
                this.detach();
              }
              var prefix = results2.prefix;
              if (prefix.indexOf(results2.prefix) !== 0) return;
              if (isImmediate) {
                immediateResults = results2;
                return;
              }
              processResults(results2);
            }).bind(this));
            isImmediate = false;
            if (immediateResults) {
              var results = immediateResults;
              immediateResults = null;
              processResults(results);
            }
          };
          CompletionProvider2.prototype.detach = function () {
            this.active = false;
            this.completers && this.completers.forEach(function (completer) {
              if (typeof completer.cancel === "function") {
                completer.cancel();
              }
            });
          };
          return CompletionProvider2;
        })();
        var FilteredList = (function () {
          function FilteredList2(array, filterText) {
            this.all = array;
            this.filtered = array;
            this.filterText = filterText || "";
            this.exactMatch = false;
            this.ignoreCaption = false;
          }
          FilteredList2.prototype.setFilter = function (str) {
            if (str.length > this.filterText && str.lastIndexOf(this.filterText, 0) === 0) var matches = this.filtered; else var matches = this.all;
            this.filterText = str;
            matches = this.filterCompletions(matches, this.filterText);
            matches = matches.sort(function (a, b) {
              return b.exactMatch - a.exactMatch || b.$score - a.$score || (a.caption || a.value).localeCompare(b.caption || b.value);
            });
            var prev = null;
            matches = matches.filter(function (item) {
              var caption = item.snippet || item.caption || item.value;
              if (caption === prev) return false;
              prev = caption;
              return true;
            });
            this.filtered = matches;
          };
          FilteredList2.prototype.filterCompletions = function (items, needle) {
            var results = [];
            var upper = needle.toUpperCase();
            var lower = needle.toLowerCase();
            loop: for (var i = 0, item; item = items[i]; i++) {
              var caption = !this.ignoreCaption && item.caption || item.value || item.snippet;
              if (!caption) continue;
              var lastIndex = -1;
              var matchMask = 0;
              var penalty = 0;
              var index, distance;
              if (this.exactMatch) {
                if (needle !== caption.substr(0, needle.length)) continue loop;
              } else {
                var fullMatchIndex = caption.toLowerCase().indexOf(lower);
                if (fullMatchIndex > -1) {
                  penalty = fullMatchIndex;
                } else {
                  for (var j = 0; j < needle.length; j++) {
                    var i1 = caption.indexOf(lower[j], lastIndex + 1);
                    var i2 = caption.indexOf(upper[j], lastIndex + 1);
                    index = i1 >= 0 ? i2 < 0 || i1 < i2 ? i1 : i2 : i2;
                    if (index < 0) continue loop;
                    distance = index - lastIndex - 1;
                    if (distance > 0) {
                      if (lastIndex === -1) penalty += 10;
                      penalty += distance;
                      matchMask = matchMask | 1 << j;
                    }
                    lastIndex = index;
                  }
                }
              }
              item.matchMask = matchMask;
              item.exactMatch = penalty ? 0 : 1;
              item.$score = (item.score || 0) - penalty;
              results.push(item);
            }
            return results;
          };
          return FilteredList2;
        })();
        exports2.Autocomplete = Autocomplete;
        exports2.CompletionProvider = CompletionProvider;
        exports2.FilteredList = FilteredList;
      });
      ace.define("ace/autocomplete/text_completer", ["require", "exports", "module", "ace/range"], function (require2, exports2, module2) {
        var Range = require2("../range").Range;
        var splitRegex = /[^a-zA-Z_0-9\$\-\u00C0-\u1FFF\u2C00-\uD7FF\w]+/;
        function getWordIndex(doc, pos) {
          var textBefore = doc.getTextRange(Range.fromPoints({
            row: 0,
            column: 0
          }, pos));
          return textBefore.split(splitRegex).length - 1;
        }
        function wordDistance(doc, pos) {
          var prefixPos = getWordIndex(doc, pos);
          var words = doc.getValue().split(splitRegex);
          var wordScores = Object.create(null);
          var currentWord = words[prefixPos];
          words.forEach(function (word, idx) {
            if (!word || word === currentWord) return;
            var distance = Math.abs(prefixPos - idx);
            var score = words.length - distance;
            if (wordScores[word]) {
              wordScores[word] = Math.max(score, wordScores[word]);
            } else {
              wordScores[word] = score;
            }
          });
          return wordScores;
        }
        exports2.getCompletions = function (editor, session, pos, prefix, callback) {
          var wordScore = wordDistance(session, pos);
          var wordList = Object.keys(wordScore);
          callback(null, wordList.map(function (word) {
            return {
              caption: word,
              value: word,
              score: wordScore[word],
              meta: "local"
            };
          }));
        };
      });
      ace.define("ace/ext/language_tools", ["require", "exports", "module", "ace/snippets", "ace/autocomplete", "ace/config", "ace/lib/lang", "ace/autocomplete/util", "ace/autocomplete/text_completer", "ace/editor", "ace/config"], function (require2, exports2, module2) {
        "use strict";
        var snippetManager = require2("../snippets").snippetManager;
        var Autocomplete = require2("../autocomplete").Autocomplete;
        var config = require2("../config");
        var lang = require2("../lib/lang");
        var util = require2("../autocomplete/util");
        var textCompleter = require2("../autocomplete/text_completer");
        var keyWordCompleter = {
          getCompletions: function (editor, session, pos, prefix, callback) {
            if (session.$mode.completer) {
              return session.$mode.completer.getCompletions(editor, session, pos, prefix, callback);
            }
            var state = editor.session.getState(pos.row);
            var completions = session.$mode.getCompletions(state, session, pos, prefix);
            completions = completions.map(function (el) {
              el.completerId = keyWordCompleter.id;
              return el;
            });
            callback(null, completions);
          },
          id: "keywordCompleter"
        };
        var transformSnippetTooltip = function (str) {
          var record = {};
          return str.replace(/\${(\d+)(:(.*?))?}/g, function (_, p1, p2, p3) {
            return record[p1] = p3 || "";
          }).replace(/\$(\d+?)/g, function (_, p1) {
            return record[p1];
          });
        };
        var snippetCompleter = {
          getCompletions: function (editor, session, pos, prefix, callback) {
            var scopes = [];
            var token = session.getTokenAt(pos.row, pos.column);
            if (token && token.type.match(/(tag-name|tag-open|tag-whitespace|attribute-name|attribute-value)\.xml$/)) scopes.push("html-tag"); else scopes = snippetManager.getActiveScopes(editor);
            var snippetMap = snippetManager.snippetMap;
            var completions = [];
            scopes.forEach(function (scope) {
              var snippets = snippetMap[scope] || [];
              for (var i = snippets.length; i--; ) {
                var s = snippets[i];
                var caption = s.name || s.tabTrigger;
                if (!caption) continue;
                completions.push({
                  caption,
                  snippet: s.content,
                  meta: s.tabTrigger && !s.name ? s.tabTrigger + "\u21E5 " : "snippet",
                  completerId: snippetCompleter.id
                });
              }
            }, this);
            callback(null, completions);
          },
          getDocTooltip: function (item) {
            if (item.snippet && !item.docHTML) {
              item.docHTML = ["<b>", lang.escapeHTML(item.caption), "</b>", "<hr></hr>", lang.escapeHTML(transformSnippetTooltip(item.snippet))].join("");
            }
          },
          id: "snippetCompleter"
        };
        var completers = [snippetCompleter, textCompleter, keyWordCompleter];
        exports2.setCompleters = function (val) {
          completers.length = 0;
          if (val) completers.push.apply(completers, val);
        };
        exports2.addCompleter = function (completer) {
          completers.push(completer);
        };
        exports2.textCompleter = textCompleter;
        exports2.keyWordCompleter = keyWordCompleter;
        exports2.snippetCompleter = snippetCompleter;
        var expandSnippet = {
          name: "expandSnippet",
          exec: function (editor) {
            return snippetManager.expandWithTab(editor);
          },
          bindKey: "Tab"
        };
        var onChangeMode = function (e, editor) {
          loadSnippetsForMode(editor.session.$mode);
        };
        var loadSnippetsForMode = function (mode) {
          if (typeof mode == "string") mode = config.$modes[mode];
          if (!mode) return;
          if (!snippetManager.files) snippetManager.files = {};
          loadSnippetFile(mode.$id, mode.snippetFileId);
          if (mode.modes) mode.modes.forEach(loadSnippetsForMode);
        };
        var loadSnippetFile = function (id, snippetFilePath) {
          if (!snippetFilePath || !id || snippetManager.files[id]) return;
          snippetManager.files[id] = {};
          config.loadModule(snippetFilePath, function (m) {
            if (!m) return;
            snippetManager.files[id] = m;
            if (!m.snippets && m.snippetText) m.snippets = snippetManager.parseSnippetFile(m.snippetText);
            snippetManager.register(m.snippets || [], m.scope);
            if (m.includeScopes) {
              snippetManager.snippetMap[m.scope].includeScopes = m.includeScopes;
              m.includeScopes.forEach(function (x) {
                loadSnippetsForMode("ace/mode/" + x);
              });
            }
          });
        };
        var doLiveAutocomplete = function (e) {
          var editor = e.editor;
          var hasCompleter = editor.completer && editor.completer.activated;
          if (e.command.name === "backspace") {
            if (hasCompleter && !util.getCompletionPrefix(editor)) editor.completer.detach();
          } else if (e.command.name === "insertstring" && !hasCompleter) {
            lastExecEvent = e;
            var delay = e.editor.$liveAutocompletionDelay;
            if (delay) {
              liveAutocompleteTimer.delay(delay);
            } else {
              showLiveAutocomplete(e);
            }
          }
        };
        var lastExecEvent;
        var liveAutocompleteTimer = lang.delayedCall(function () {
          showLiveAutocomplete(lastExecEvent);
        }, 0);
        var showLiveAutocomplete = function (e) {
          var editor = e.editor;
          var prefix = util.getCompletionPrefix(editor);
          var triggerAutocomplete = util.triggerAutocomplete(editor);
          if (prefix && prefix.length >= editor.$liveAutocompletionThreshold || triggerAutocomplete) {
            var completer = Autocomplete.for(editor);
            completer.autoShown = true;
            completer.showPopup(editor);
          }
        };
        var Editor = require2("../editor").Editor;
        require2("../config").defineOptions(Editor.prototype, "editor", {
          enableBasicAutocompletion: {
            set: function (val) {
              if (val) {
                if (!this.completers) this.completers = Array.isArray(val) ? val : completers;
                this.commands.addCommand(Autocomplete.startCommand);
              } else {
                this.commands.removeCommand(Autocomplete.startCommand);
              }
            },
            value: false
          },
          enableLiveAutocompletion: {
            set: function (val) {
              if (val) {
                if (!this.completers) this.completers = Array.isArray(val) ? val : completers;
                this.commands.on("afterExec", doLiveAutocomplete);
              } else {
                this.commands.off("afterExec", doLiveAutocomplete);
              }
            },
            value: false
          },
          liveAutocompletionDelay: {
            initialValue: 0
          },
          liveAutocompletionThreshold: {
            initialValue: 0
          },
          enableSnippets: {
            set: function (val) {
              if (val) {
                this.commands.addCommand(expandSnippet);
                this.on("changeMode", onChangeMode);
                onChangeMode(null, this);
              } else {
                this.commands.removeCommand(expandSnippet);
                this.off("changeMode", onChangeMode);
              }
            },
            value: false
          }
        });
      });
      (function () {
        ace.require(["ace/ext/language_tools"], function (m) {
          if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
          }
        });
      })();
    }
  });
  var Repl_exports = {};
  __export(Repl_exports, {
    default: () => Repl_default
  });
  init_define_process();
  var import_react = __toESM(__require("react"), 1);
  var import_core = __require("@blueprintjs/core");
  var import_icons = __require("@blueprintjs/icons");
  var import_react_ace = __toESM(__require("react-ace"), 1);
  var import_mode_javascript = __toESM(require_mode_javascript(), 1);
  var import_theme_twilight = __toESM(require_theme_twilight(), 1);
  var import_ext_language_tools = __toESM(require_ext_language_tools(), 1);
  var import_jsx_runtime = __require("react/jsx-runtime");
  var ProgrammableReplGUI = class extends import_react.default.Component {
    constructor(data) {
      super(data);
      this.replInstance = data.programmableReplInstance;
      this.replInstance.setTabReactComponentInstance(this);
    }
    render() {
      const outputDivs = [];
      const outputStringCount = this.replInstance.outputStrings.length;
      for (let i = 0; i < outputStringCount; i++) {
        const str = this.replInstance.outputStrings[i];
        if (str.outputMethod === "richtext") {
          if (str.color === "") {
            outputDivs.push((0, import_jsx_runtime.jsx)("div", {
              dangerouslySetInnerHTML: {
                __html: str.content
              }
            }));
          } else {
            outputDivs.push((0, import_jsx_runtime.jsx)("div", {
              style: {
                color: str.color
              },
              dangerouslySetInnerHTML: {
                __html: str.content
              }
            }));
          }
        } else if (str.color === "") {
          outputDivs.push((0, import_jsx_runtime.jsx)("div", {
            children: str.content
          }));
        } else {
          outputDivs.push((0, import_jsx_runtime.jsx)("div", {
            style: {
              color: str.color
            },
            children: str.content
          }));
        }
      }
      return (0, import_jsx_runtime.jsxs)("div", {
        children: [(0, import_jsx_runtime.jsx)(import_core.Button, {
          className: "programmable-repl-button",
          icon: import_icons.IconNames.PLAY,
          active: true,
          onClick: () => this.replInstance.runCode(),
          text: "Run"
        }), (0, import_jsx_runtime.jsx)(import_core.Button, {
          className: "programmable-repl-button",
          icon: import_icons.IconNames.FLOPPY_DISK,
          active: true,
          onClick: () => this.replInstance.saveEditorContent(),
          text: "Save"
        }), (0, import_jsx_runtime.jsx)(import_react_ace.default, {
          ref: e => this.replInstance.setEditorInstance(e == null ? void 0 : e.editor),
          style: __spreadValues({
            width: "100%",
            height: "375px"
          }, this.replInstance.customizedEditorProps.backgroundImageUrl !== "no-background-image" && ({
            backgroundImage: `url(${this.replInstance.customizedEditorProps.backgroundImageUrl})`,
            backgroundColor: `rgba(20, 20, 20, ${this.replInstance.customizedEditorProps.backgroundColorAlpha})`,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat"
          })),
          mode: "javascript",
          theme: "twilight",
          onChange: newValue => this.replInstance.updateUserCode(newValue),
          value: this.replInstance.userCodeInEditor.toString()
        }), (0, import_jsx_runtime.jsx)("div", {
          id: "output_strings",
          children: outputDivs
        })]
      });
    }
  };
  var Repl_default = {
    toSpawn(_context) {
      return true;
    },
    body(context) {
      return (0, import_jsx_runtime.jsx)(ProgrammableReplGUI, {
        programmableReplInstance: context.context.moduleContexts.repl.state
      });
    },
    label: "Programmable Repl Tab",
    iconName: "code"
  };
  return __toCommonJS(Repl_exports);
})()["default"];