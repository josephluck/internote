!(function (t) {
  var e = {};
  function n(r) {
    if (e[r]) return e[r].exports;
    var i = (e[r] = { i: r, l: !1, exports: {} });
    return t[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  (n.m = t),
    (n.c = e),
    (n.d = function (t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
    }),
    (n.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (n.t = function (t, e) {
      if ((1 & e && (t = n(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var i in t)
          n.d(
            r,
            i,
            function (e) {
              return t[e];
            }.bind(null, i)
          );
      return r;
    }),
    (n.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return n.d(e, "a", e), e;
    }),
    (n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (n.p = ""),
    n((n.s = 53));
})([
  function (t, e, n) {
    "use strict";
    var r = n(7);
    var i = n(2),
      o = n(19);
    n.d(e, "b", function () {
      return s;
    }),
      n.d(e, "a", function () {
        return f;
      }),
      n.d(e, "d", function () {
        return h;
      }),
      n.d(e, "c", function () {
        return d;
      }),
      n.d(e, "e", function () {
        return m;
      });
    var u,
      s,
      a =
        ((u = function (t, e) {
          return (u =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(t, e);
        }),
        function (t, e) {
          function n() {
            this.constructor = t;
          }
          u(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((n.prototype = e.prototype), new n()));
        });
    !(function (t) {
      var e = { dispose: function () {} };
      function n(t) {
        return function (e, n, r) {
          void 0 === n && (n = null);
          var i,
            o = !1;
          return (
            (i = t(
              function (t) {
                if (!o) return i ? i.dispose() : (o = !0), e.call(n, t);
              },
              null,
              r
            )),
            o && i.dispose(),
            i
          );
        };
      }
      function r(t, e) {
        return a(function (n, r, i) {
          return (
            void 0 === r && (r = null),
            t(
              function (t) {
                return n.call(r, e(t));
              },
              null,
              i
            )
          );
        });
      }
      function o(t, e) {
        return a(function (n, r, i) {
          return (
            void 0 === r && (r = null),
            t(
              function (t) {
                e(t), n.call(r, t);
              },
              null,
              i
            )
          );
        });
      }
      function u(t, e) {
        return a(function (n, r, i) {
          return (
            void 0 === r && (r = null),
            t(
              function (t) {
                return e(t) && n.call(r, t);
              },
              null,
              i
            )
          );
        });
      }
      function s(t, e, n) {
        var i = n;
        return r(t, function (t) {
          return (i = e(i, t));
        });
      }
      function a(t) {
        var e,
          n = new f({
            onFirstListenerAdd: function () {
              e = t(n.fire, n);
            },
            onLastListenerRemove: function () {
              e.dispose();
            },
          });
        return n.event;
      }
      function c(t) {
        var e,
          n = !0;
        return u(t, function (t) {
          var r = n || t !== e;
          return (n = !1), (e = t), r;
        });
      }
      (t.None = function () {
        return e;
      }),
        (t.once = n),
        (t.map = r),
        (t.forEach = o),
        (t.filter = u),
        (t.signal = function (t) {
          return t;
        }),
        (t.any = function () {
          for (var t = [], e = 0; e < arguments.length; e++)
            t[e] = arguments[e];
          return function (e, n, r) {
            return (
              void 0 === n && (n = null),
              Object(i.c)(
                t.map(function (t) {
                  return t(
                    function (t) {
                      return e.call(n, t);
                    },
                    null,
                    r
                  );
                })
              )
            );
          };
        }),
        (t.reduce = s),
        (t.snapshot = a),
        (t.debounce = function (t, e, n, r, i) {
          var o;
          void 0 === n && (n = 100), void 0 === r && (r = !1);
          var u = void 0,
            s = void 0,
            a = 0,
            c = new f({
              leakWarningThreshold: i,
              onFirstListenerAdd: function () {
                o = t(function (t) {
                  a++,
                    (u = e(u, t)),
                    r && !s && c.fire(u),
                    clearTimeout(s),
                    (s = setTimeout(function () {
                      var t = u;
                      (u = void 0),
                        (s = void 0),
                        (!r || a > 1) && c.fire(t),
                        (a = 0);
                    }, n));
                });
              },
              onLastListenerRemove: function () {
                o.dispose();
              },
            });
          return c.event;
        }),
        (t.stopwatch = function (t) {
          var e = new Date().getTime();
          return r(n(t), function (t) {
            return new Date().getTime() - e;
          });
        }),
        (t.latch = c),
        (t.buffer = function (t, e, n) {
          void 0 === e && (e = !1), void 0 === n && (n = []);
          var r = n.slice(),
            i = t(function (t) {
              r ? r.push(t) : u.fire(t);
            }),
            o = function () {
              r &&
                r.forEach(function (t) {
                  return u.fire(t);
                }),
                (r = null);
            },
            u = new f({
              onFirstListenerAdd: function () {
                i ||
                  (i = t(function (t) {
                    return u.fire(t);
                  }));
              },
              onFirstListenerDidAdd: function () {
                r && (e ? setTimeout(o) : o());
              },
              onLastListenerRemove: function () {
                i && i.dispose(), (i = null);
              },
            });
          return u.event;
        });
      var l = (function () {
        function t(t) {
          this.event = t;
        }
        return (
          (t.prototype.map = function (e) {
            return new t(r(this.event, e));
          }),
          (t.prototype.forEach = function (e) {
            return new t(o(this.event, e));
          }),
          (t.prototype.filter = function (e) {
            return new t(u(this.event, e));
          }),
          (t.prototype.reduce = function (e, n) {
            return new t(s(this.event, e, n));
          }),
          (t.prototype.latch = function () {
            return new t(c(this.event));
          }),
          (t.prototype.on = function (t, e, n) {
            return this.event(t, e, n);
          }),
          (t.prototype.once = function (t, e, r) {
            return n(this.event)(t, e, r);
          }),
          t
        );
      })();
      (t.chain = function (t) {
        return new l(t);
      }),
        (t.fromNodeEventEmitter = function (t, e, n) {
          void 0 === n &&
            (n = function (t) {
              return t;
            });
          var r = function () {
              for (var t = [], e = 0; e < arguments.length; e++)
                t[e] = arguments[e];
              return i.fire(n.apply(void 0, t));
            },
            i = new f({
              onFirstListenerAdd: function () {
                return t.on(e, r);
              },
              onLastListenerRemove: function () {
                return t.removeListener(e, r);
              },
            });
          return i.event;
        }),
        (t.fromPromise = function (t) {
          var e = new f(),
            n = !1;
          return (
            t
              .then(void 0, function () {
                return null;
              })
              .then(function () {
                n
                  ? e.fire(void 0)
                  : setTimeout(function () {
                      return e.fire(void 0);
                    }, 0);
              }),
            (n = !0),
            e.event
          );
        }),
        (t.toPromise = function (t) {
          return new Promise(function (e) {
            return n(t)(e);
          });
        });
    })(s || (s = {}));
    var c = -1,
      l = (function () {
        function t(t, e) {
          void 0 === e && (e = Math.random().toString(18).slice(2, 5)),
            (this.customThreshold = t),
            (this.name = e),
            (this._warnCountdown = 0);
        }
        return (
          (t.prototype.dispose = function () {
            this._stacks && this._stacks.clear();
          }),
          (t.prototype.check = function (t) {
            var e = this,
              n = c;
            if (
              ("number" == typeof this.customThreshold &&
                (n = this.customThreshold),
              !(n <= 0 || t < n))
            ) {
              this._stacks || (this._stacks = new Map());
              var r = new Error().stack.split("\n").slice(3).join("\n"),
                i = this._stacks.get(r) || 0;
              if (
                (this._stacks.set(r, i + 1),
                (this._warnCountdown -= 1),
                this._warnCountdown <= 0)
              ) {
                var o;
                this._warnCountdown = 0.5 * n;
                var u = 0;
                this._stacks.forEach(function (t, e) {
                  (!o || u < t) && ((o = e), (u = t));
                }),
                  console.warn(
                    "[" +
                      this.name +
                      "] potential listener LEAK detected, having " +
                      t +
                      " listeners already. MOST frequent listener (" +
                      u +
                      "):"
                  ),
                  console.warn(o);
              }
              return function () {
                var t = e._stacks.get(r) || 0;
                e._stacks.set(r, t - 1);
              };
            }
          }),
          t
        );
      })(),
      f = (function () {
        function t(t) {
          (this._disposed = !1),
            (this._options = t),
            (this._leakageMon =
              c > 0
                ? new l(this._options && this._options.leakWarningThreshold)
                : void 0);
        }
        return (
          Object.defineProperty(t.prototype, "event", {
            get: function () {
              var e = this;
              return (
                this._event ||
                  (this._event = function (n, r, i) {
                    e._listeners || (e._listeners = new o.a());
                    var u = e._listeners.isEmpty();
                    u &&
                      e._options &&
                      e._options.onFirstListenerAdd &&
                      e._options.onFirstListenerAdd(e);
                    var s,
                      a,
                      c = e._listeners.push(r ? [n, r] : n);
                    return (
                      u &&
                        e._options &&
                        e._options.onFirstListenerDidAdd &&
                        e._options.onFirstListenerDidAdd(e),
                      e._options &&
                        e._options.onListenerDidAdd &&
                        e._options.onListenerDidAdd(e, n, r),
                      e._leakageMon &&
                        (s = e._leakageMon.check(e._listeners.size)),
                      (a = {
                        dispose: function () {
                          (s && s(), (a.dispose = t._noop), e._disposed) ||
                            (c(),
                            e._options &&
                              e._options.onLastListenerRemove &&
                              ((e._listeners && !e._listeners.isEmpty()) ||
                                e._options.onLastListenerRemove(e)));
                        },
                      }),
                      Array.isArray(i) && i.push(a),
                      a
                    );
                  }),
                this._event
              );
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.fire = function (t) {
            if (this._listeners) {
              this._deliveryQueue || (this._deliveryQueue = new o.a());
              for (
                var e = this._listeners.iterator(), n = e.next();
                !n.done;
                n = e.next()
              )
                this._deliveryQueue.push([n.value, t]);
              for (; this._deliveryQueue.size > 0; ) {
                var i = this._deliveryQueue.shift(),
                  u = i[0],
                  s = i[1];
                try {
                  "function" == typeof u
                    ? u.call(void 0, s)
                    : u[0].call(u[1], s);
                } catch (n) {
                  Object(r.e)(n);
                }
              }
            }
          }),
          (t.prototype.dispose = function () {
            this._listeners && this._listeners.clear(),
              this._deliveryQueue && this._deliveryQueue.clear(),
              this._leakageMon && this._leakageMon.dispose(),
              (this._disposed = !0);
          }),
          (t._noop = function () {}),
          t
        );
      })(),
      h = (function (t) {
        function e(e) {
          var n = t.call(this, e) || this;
          return (
            (n._isPaused = 0),
            (n._eventQueue = new o.a()),
            (n._mergeFn = e && e.merge),
            n
          );
        }
        return (
          a(e, t),
          (e.prototype.pause = function () {
            this._isPaused++;
          }),
          (e.prototype.resume = function () {
            if (0 !== this._isPaused && 0 == --this._isPaused)
              if (this._mergeFn) {
                var e = this._eventQueue.toArray();
                this._eventQueue.clear(),
                  t.prototype.fire.call(this, this._mergeFn(e));
              } else
                for (; !this._isPaused && 0 !== this._eventQueue.size; )
                  t.prototype.fire.call(this, this._eventQueue.shift());
          }),
          (e.prototype.fire = function (e) {
            this._listeners &&
              (0 !== this._isPaused
                ? this._eventQueue.push(e)
                : t.prototype.fire.call(this, e));
          }),
          e
        );
      })(f),
      d =
        ((function () {
          function t() {
            var t = this;
            (this.hasListeners = !1),
              (this.events = []),
              (this.emitter = new f({
                onFirstListenerAdd: function () {
                  return t.onFirstListenerAdd();
                },
                onLastListenerRemove: function () {
                  return t.onLastListenerRemove();
                },
              }));
          }
          Object.defineProperty(t.prototype, "event", {
            get: function () {
              return this.emitter.event;
            },
            enumerable: !0,
            configurable: !0,
          }),
            (t.prototype.add = function (t) {
              var e = this,
                n = { event: t, listener: null };
              this.events.push(n), this.hasListeners && this.hook(n);
              return Object(i.e)(
                (function (t) {
                  var e,
                    n = this,
                    r = !1;
                  return function () {
                    return r ? e : ((r = !0), (e = t.apply(n, arguments)));
                  };
                })(function () {
                  e.hasListeners && e.unhook(n);
                  var t = e.events.indexOf(n);
                  e.events.splice(t, 1);
                })
              );
            }),
            (t.prototype.onFirstListenerAdd = function () {
              var t = this;
              (this.hasListeners = !0),
                this.events.forEach(function (e) {
                  return t.hook(e);
                });
            }),
            (t.prototype.onLastListenerRemove = function () {
              var t = this;
              (this.hasListeners = !1),
                this.events.forEach(function (e) {
                  return t.unhook(e);
                });
            }),
            (t.prototype.hook = function (t) {
              var e = this;
              t.listener = t.event(function (t) {
                return e.emitter.fire(t);
              });
            }),
            (t.prototype.unhook = function (t) {
              t.listener && t.listener.dispose(), (t.listener = null);
            }),
            (t.prototype.dispose = function () {
              this.emitter.dispose();
            });
        })(),
        (function () {
          function t() {
            this.buffers = [];
          }
          return (
            (t.prototype.wrapEvent = function (t) {
              var e = this;
              return function (n, r, i) {
                return t(
                  function (t) {
                    var i = e.buffers[e.buffers.length - 1];
                    i
                      ? i.push(function () {
                          return n.call(r, t);
                        })
                      : n.call(r, t);
                  },
                  void 0,
                  i
                );
              };
            }),
            (t.prototype.bufferEvents = function (t) {
              var e = [];
              this.buffers.push(e);
              var n = t();
              return (
                this.buffers.pop(),
                e.forEach(function (t) {
                  return t();
                }),
                n
              );
            }),
            t
          );
        })()),
      m = (function () {
        function t() {
          var t = this;
          (this.listening = !1),
            (this.inputEvent = s.None),
            (this.inputEventListener = i.a.None),
            (this.emitter = new f({
              onFirstListenerDidAdd: function () {
                (t.listening = !0),
                  (t.inputEventListener = t.inputEvent(
                    t.emitter.fire,
                    t.emitter
                  ));
              },
              onLastListenerRemove: function () {
                (t.listening = !1), t.inputEventListener.dispose();
              },
            })),
            (this.event = this.emitter.event);
        }
        return (
          Object.defineProperty(t.prototype, "input", {
            set: function (t) {
              (this.inputEvent = t),
                this.listening &&
                  (this.inputEventListener.dispose(),
                  (this.inputEventListener = t(
                    this.emitter.fire,
                    this.emitter
                  )));
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.dispose = function () {
            this.inputEventListener.dispose(), this.emitter.dispose();
          }),
          t
        );
      })();
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return i;
    });
    var r = n(3),
      i = (function () {
        function t(t, e, n, r) {
          t > n || (t === n && e > r)
            ? ((this.startLineNumber = n),
              (this.startColumn = r),
              (this.endLineNumber = t),
              (this.endColumn = e))
            : ((this.startLineNumber = t),
              (this.startColumn = e),
              (this.endLineNumber = n),
              (this.endColumn = r));
        }
        return (
          (t.prototype.isEmpty = function () {
            return t.isEmpty(this);
          }),
          (t.isEmpty = function (t) {
            return (
              t.startLineNumber === t.endLineNumber &&
              t.startColumn === t.endColumn
            );
          }),
          (t.prototype.containsPosition = function (e) {
            return t.containsPosition(this, e);
          }),
          (t.containsPosition = function (t, e) {
            return (
              !(
                e.lineNumber < t.startLineNumber ||
                e.lineNumber > t.endLineNumber
              ) &&
              !(
                e.lineNumber === t.startLineNumber && e.column < t.startColumn
              ) &&
              !(e.lineNumber === t.endLineNumber && e.column > t.endColumn)
            );
          }),
          (t.prototype.containsRange = function (e) {
            return t.containsRange(this, e);
          }),
          (t.containsRange = function (t, e) {
            return (
              !(
                e.startLineNumber < t.startLineNumber ||
                e.endLineNumber < t.startLineNumber
              ) &&
              !(
                e.startLineNumber > t.endLineNumber ||
                e.endLineNumber > t.endLineNumber
              ) &&
              !(
                e.startLineNumber === t.startLineNumber &&
                e.startColumn < t.startColumn
              ) &&
              !(
                e.endLineNumber === t.endLineNumber && e.endColumn > t.endColumn
              )
            );
          }),
          (t.prototype.plusRange = function (e) {
            return t.plusRange(this, e);
          }),
          (t.plusRange = function (e, n) {
            var r, i, o, u;
            return (
              n.startLineNumber < e.startLineNumber
                ? ((r = n.startLineNumber), (i = n.startColumn))
                : n.startLineNumber === e.startLineNumber
                ? ((r = n.startLineNumber),
                  (i = Math.min(n.startColumn, e.startColumn)))
                : ((r = e.startLineNumber), (i = e.startColumn)),
              n.endLineNumber > e.endLineNumber
                ? ((o = n.endLineNumber), (u = n.endColumn))
                : n.endLineNumber === e.endLineNumber
                ? ((o = n.endLineNumber),
                  (u = Math.max(n.endColumn, e.endColumn)))
                : ((o = e.endLineNumber), (u = e.endColumn)),
              new t(r, i, o, u)
            );
          }),
          (t.prototype.intersectRanges = function (e) {
            return t.intersectRanges(this, e);
          }),
          (t.intersectRanges = function (e, n) {
            var r = e.startLineNumber,
              i = e.startColumn,
              o = e.endLineNumber,
              u = e.endColumn,
              s = n.startLineNumber,
              a = n.startColumn,
              c = n.endLineNumber,
              l = n.endColumn;
            return (
              r < s ? ((r = s), (i = a)) : r === s && (i = Math.max(i, a)),
              o > c ? ((o = c), (u = l)) : o === c && (u = Math.min(u, l)),
              r > o ? null : r === o && i > u ? null : new t(r, i, o, u)
            );
          }),
          (t.prototype.equalsRange = function (e) {
            return t.equalsRange(this, e);
          }),
          (t.equalsRange = function (t, e) {
            return (
              !!t &&
              !!e &&
              t.startLineNumber === e.startLineNumber &&
              t.startColumn === e.startColumn &&
              t.endLineNumber === e.endLineNumber &&
              t.endColumn === e.endColumn
            );
          }),
          (t.prototype.getEndPosition = function () {
            return new r.a(this.endLineNumber, this.endColumn);
          }),
          (t.prototype.getStartPosition = function () {
            return new r.a(this.startLineNumber, this.startColumn);
          }),
          (t.prototype.toString = function () {
            return (
              "[" +
              this.startLineNumber +
              "," +
              this.startColumn +
              " -> " +
              this.endLineNumber +
              "," +
              this.endColumn +
              "]"
            );
          }),
          (t.prototype.setEndPosition = function (e, n) {
            return new t(this.startLineNumber, this.startColumn, e, n);
          }),
          (t.prototype.setStartPosition = function (e, n) {
            return new t(e, n, this.endLineNumber, this.endColumn);
          }),
          (t.prototype.collapseToStart = function () {
            return t.collapseToStart(this);
          }),
          (t.collapseToStart = function (e) {
            return new t(
              e.startLineNumber,
              e.startColumn,
              e.startLineNumber,
              e.startColumn
            );
          }),
          (t.fromPositions = function (e, n) {
            return (
              void 0 === n && (n = e),
              new t(e.lineNumber, e.column, n.lineNumber, n.column)
            );
          }),
          (t.lift = function (e) {
            return e
              ? new t(
                  e.startLineNumber,
                  e.startColumn,
                  e.endLineNumber,
                  e.endColumn
                )
              : null;
          }),
          (t.isIRange = function (t) {
            return (
              t &&
              "number" == typeof t.startLineNumber &&
              "number" == typeof t.startColumn &&
              "number" == typeof t.endLineNumber &&
              "number" == typeof t.endColumn
            );
          }),
          (t.areIntersectingOrTouching = function (t, e) {
            return (
              !(
                t.endLineNumber < e.startLineNumber ||
                (t.endLineNumber === e.startLineNumber &&
                  t.endColumn < e.startColumn)
              ) &&
              !(
                e.endLineNumber < t.startLineNumber ||
                (e.endLineNumber === t.startLineNumber &&
                  e.endColumn < t.startColumn)
              )
            );
          }),
          (t.areIntersecting = function (t, e) {
            return (
              !(
                t.endLineNumber < e.startLineNumber ||
                (t.endLineNumber === e.startLineNumber &&
                  t.endColumn <= e.startColumn)
              ) &&
              !(
                e.endLineNumber < t.startLineNumber ||
                (e.endLineNumber === t.startLineNumber &&
                  e.endColumn <= t.startColumn)
              )
            );
          }),
          (t.compareRangesUsingStarts = function (t, e) {
            if (t && e) {
              var n = 0 | t.startLineNumber,
                r = 0 | e.startLineNumber;
              if (n === r) {
                var i = 0 | t.startColumn,
                  o = 0 | e.startColumn;
                if (i === o) {
                  var u = 0 | t.endLineNumber,
                    s = 0 | e.endLineNumber;
                  return u === s
                    ? (0 | t.endColumn) - (0 | e.endColumn)
                    : u - s;
                }
                return i - o;
              }
              return n - r;
            }
            return (t ? 1 : 0) - (e ? 1 : 0);
          }),
          (t.compareRangesUsingEnds = function (t, e) {
            return t.endLineNumber === e.endLineNumber
              ? t.endColumn === e.endColumn
                ? t.startLineNumber === e.startLineNumber
                  ? t.startColumn - e.startColumn
                  : t.startLineNumber - e.startLineNumber
                : t.endColumn - e.endColumn
              : t.endLineNumber - e.endLineNumber;
          }),
          (t.spansMultipleLines = function (t) {
            return t.endLineNumber > t.startLineNumber;
          }),
          t
        );
      })();
  },
  function (t, e, n) {
    "use strict";
    function r(t) {
      for (var e = [], n = 1; n < arguments.length; n++)
        e[n - 1] = arguments[n];
      return Array.isArray(t)
        ? (t.forEach(function (t) {
            return t && t.dispose();
          }),
          [])
        : 0 === e.length
        ? t
          ? (t.dispose(), t)
          : void 0
        : (r(t), r(e), []);
    }
    function i(t) {
      return {
        dispose: function () {
          return r(t);
        },
      };
    }
    function o(t) {
      return {
        dispose: function () {
          t();
        },
      };
    }
    n.d(e, "d", function () {
      return r;
    }),
      n.d(e, "c", function () {
        return i;
      }),
      n.d(e, "e", function () {
        return o;
      }),
      n.d(e, "a", function () {
        return u;
      }),
      n.d(e, "b", function () {
        return s;
      });
    var u = (function () {
        function t() {
          (this._toDispose = []), (this._lifecycle_disposable_isDisposed = !1);
        }
        return (
          (t.prototype.dispose = function () {
            (this._lifecycle_disposable_isDisposed = !0),
              (this._toDispose = r(this._toDispose));
          }),
          (t.prototype._register = function (t) {
            return (
              this._lifecycle_disposable_isDisposed
                ? (console.warn(
                    "Registering disposable on object that has already been disposed."
                  ),
                  t.dispose())
                : this._toDispose.push(t),
              t
            );
          }),
          (t.None = Object.freeze({ dispose: function () {} })),
          t
        );
      })(),
      s = (function () {
        function t(t) {
          this.object = t;
        }
        return (t.prototype.dispose = function () {}), t;
      })();
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return r;
    });
    var r = (function () {
      function t(t, e) {
        (this.lineNumber = t), (this.column = e);
      }
      return (
        (t.prototype.with = function (e, n) {
          return (
            void 0 === e && (e = this.lineNumber),
            void 0 === n && (n = this.column),
            e === this.lineNumber && n === this.column ? this : new t(e, n)
          );
        }),
        (t.prototype.delta = function (t, e) {
          return (
            void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            this.with(this.lineNumber + t, this.column + e)
          );
        }),
        (t.prototype.equals = function (e) {
          return t.equals(this, e);
        }),
        (t.equals = function (t, e) {
          return (
            (!t && !e) ||
            (!!t &&
              !!e &&
              t.lineNumber === e.lineNumber &&
              t.column === e.column)
          );
        }),
        (t.prototype.isBefore = function (e) {
          return t.isBefore(this, e);
        }),
        (t.isBefore = function (t, e) {
          return (
            t.lineNumber < e.lineNumber ||
            (!(e.lineNumber < t.lineNumber) && t.column < e.column)
          );
        }),
        (t.prototype.isBeforeOrEqual = function (e) {
          return t.isBeforeOrEqual(this, e);
        }),
        (t.isBeforeOrEqual = function (t, e) {
          return (
            t.lineNumber < e.lineNumber ||
            (!(e.lineNumber < t.lineNumber) && t.column <= e.column)
          );
        }),
        (t.compare = function (t, e) {
          var n = 0 | t.lineNumber,
            r = 0 | e.lineNumber;
          return n === r ? (0 | t.column) - (0 | e.column) : n - r;
        }),
        (t.prototype.clone = function () {
          return new t(this.lineNumber, this.column);
        }),
        (t.prototype.toString = function () {
          return "(" + this.lineNumber + "," + this.column + ")";
        }),
        (t.lift = function (e) {
          return new t(e.lineNumber, e.column);
        }),
        (t.isIPosition = function (t) {
          return (
            t && "number" == typeof t.lineNumber && "number" == typeof t.column
          );
        }),
        t
      );
    })();
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "i", function () {
      return r;
    }),
      n.d(e, "r", function () {
        return i;
      }),
      n.d(e, "o", function () {
        return u;
      }),
      n.d(e, "l", function () {
        return s;
      }),
      n.d(e, "m", function () {
        return a;
      }),
      n.d(e, "y", function () {
        return c;
      }),
      n.d(e, "g", function () {
        return l;
      }),
      n.d(e, "B", function () {
        return f;
      }),
      n.d(e, "j", function () {
        return h;
      }),
      n.d(e, "h", function () {
        return d;
      }),
      n.d(e, "A", function () {
        return m;
      }),
      n.d(e, "z", function () {
        return p;
      }),
      n.d(e, "n", function () {
        return g;
      }),
      n.d(e, "p", function () {
        return _;
      }),
      n.d(e, "x", function () {
        return v;
      }),
      n.d(e, "v", function () {
        return y;
      }),
      n.d(e, "w", function () {
        return b;
      }),
      n.d(e, "k", function () {
        return L;
      }),
      n.d(e, "C", function () {
        return N;
      }),
      n.d(e, "b", function () {
        return S;
      }),
      n.d(e, "c", function () {
        return w;
      }),
      n.d(e, "t", function () {
        return A;
      }),
      n.d(e, "u", function () {
        return O;
      }),
      n.d(e, "f", function () {
        return M;
      }),
      n.d(e, "d", function () {
        return x;
      }),
      n.d(e, "q", function () {
        return R;
      }),
      n.d(e, "e", function () {
        return k;
      }),
      n.d(e, "s", function () {
        return D;
      }),
      n.d(e, "a", function () {
        return F;
      }),
      n.d(e, "D", function () {
        return U;
      });
    var r = "";
    function i(t) {
      return !t || "string" != typeof t || 0 === t.trim().length;
    }
    var o = /{(\d+)}/g;
    function u(t) {
      for (var e = [], n = 1; n < arguments.length; n++)
        e[n - 1] = arguments[n];
      return 0 === e.length
        ? t
        : t.replace(o, function (t, n) {
            var r = parseInt(n, 10);
            return isNaN(r) || r < 0 || r >= e.length ? t : e[r];
          });
    }
    function s(t) {
      return t.replace(/[<>&]/g, function (t) {
        switch (t) {
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case "&":
            return "&amp;";
          default:
            return t;
        }
      });
    }
    function a(t) {
      return t.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, "\\$&");
    }
    function c(t, e) {
      if (!t || !e) return t;
      var n = e.length;
      if (0 === n || 0 === t.length) return t;
      for (var r = 0; t.indexOf(e, r) === r; ) r += n;
      return t.substring(r);
    }
    function l(t) {
      return t
        .replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&")
        .replace(/[\*]/g, ".*");
    }
    function f(t, e) {
      if (t.length < e.length) return !1;
      if (t === e) return !0;
      for (var n = 0; n < e.length; n++) if (t[n] !== e[n]) return !1;
      return !0;
    }
    function h(t, e) {
      var n = t.length - e.length;
      return n > 0 ? t.indexOf(e, n) === n : 0 === n && t === e;
    }
    function d(t, e, n) {
      if ((void 0 === n && (n = {}), !t))
        throw new Error("Cannot create regex from empty string");
      e || (t = a(t)),
        n.wholeWord &&
          (/\B/.test(t.charAt(0)) || (t = "\\b" + t),
          /\B/.test(t.charAt(t.length - 1)) || (t += "\\b"));
      var r = "";
      return (
        n.global && (r += "g"),
        n.matchCase || (r += "i"),
        n.multiline && (r += "m"),
        n.unicode && (r += "u"),
        new RegExp(t, r)
      );
    }
    function m(t) {
      return (
        "^" !== t.source &&
        "^$" !== t.source &&
        "$" !== t.source &&
        "^\\s*$" !== t.source &&
        !(!t.exec("") || 0 !== t.lastIndex)
      );
    }
    function p(t) {
      return (
        (t.global ? "g" : "") +
        (t.ignoreCase ? "i" : "") +
        (t.multiline ? "m" : "") +
        (t.unicode ? "u" : "")
      );
    }
    function g(t) {
      for (var e = 0, n = t.length; e < n; e++) {
        var r = t.charCodeAt(e);
        if (32 !== r && 9 !== r) return e;
      }
      return -1;
    }
    function _(t, e, n) {
      void 0 === e && (e = 0), void 0 === n && (n = t.length);
      for (var r = e; r < n; r++) {
        var i = t.charCodeAt(r);
        if (32 !== i && 9 !== i) return t.substring(e, r);
      }
      return t.substring(e, n);
    }
    function v(t, e) {
      void 0 === e && (e = t.length - 1);
      for (var n = e; n >= 0; n--) {
        var r = t.charCodeAt(n);
        if (32 !== r && 9 !== r) return n;
      }
      return -1;
    }
    function y(t) {
      return t >= 97 && t <= 122;
    }
    function b(t) {
      return t >= 65 && t <= 90;
    }
    function C(t) {
      return y(t) || b(t);
    }
    function L(t, e) {
      return (t ? t.length : 0) === (e ? e.length : 0) && E(t, e);
    }
    function E(t, e, n) {
      if (
        (void 0 === n && (n = t.length),
        "string" != typeof t || "string" != typeof e)
      )
        return !1;
      for (var r = 0; r < n; r++) {
        var i = t.charCodeAt(r),
          o = e.charCodeAt(r);
        if (i !== o)
          if (C(i) && C(o)) {
            var u = Math.abs(i - o);
            if (0 !== u && 32 !== u) return !1;
          } else if (
            String.fromCharCode(i).toLowerCase() !==
            String.fromCharCode(o).toLowerCase()
          )
            return !1;
      }
      return !0;
    }
    function N(t, e) {
      var n = e.length;
      return !(e.length > t.length) && E(t, e, n);
    }
    function S(t, e) {
      var n,
        r = Math.min(t.length, e.length);
      for (n = 0; n < r; n++) if (t.charCodeAt(n) !== e.charCodeAt(n)) return n;
      return r;
    }
    function w(t, e) {
      var n,
        r = Math.min(t.length, e.length),
        i = t.length - 1,
        o = e.length - 1;
      for (n = 0; n < r; n++)
        if (t.charCodeAt(i - n) !== e.charCodeAt(o - n)) return n;
      return r;
    }
    function A(t) {
      return 55296 <= t && t <= 56319;
    }
    function O(t) {
      return 56320 <= t && t <= 57343;
    }
    var T = /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE33\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDCFF]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD50-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
    function M(t) {
      return T.test(t);
    }
    var P = /(?:[\u231A\u231B\u23F0\u23F3\u2600-\u27BF\u2B50\u2B55]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEF8]|\uD83E[\uDD00-\uDDE6])/;
    function x(t) {
      return P.test(t);
    }
    var I = /^[\t\n\r\x20-\x7E]*$/;
    function R(t) {
      return I.test(t);
    }
    function k(t) {
      for (var e = 0, n = t.length; e < n; e++)
        if (D(t.charCodeAt(e))) return !0;
      return !1;
    }
    function D(t) {
      return (
        ((t = +t) >= 11904 && t <= 55215) ||
        (t >= 63744 && t <= 64255) ||
        (t >= 65281 && t <= 65374)
      );
    }
    var F = String.fromCharCode(65279);
    function U(t) {
      return !!(t && t.length > 0 && 65279 === t.charCodeAt(0));
    }
  },
  function (t, e, n) {
    "use strict";
    (function (t, r) {
      n.d(e, "g", function () {
        return m;
      }),
        n.d(e, "d", function () {
          return p;
        }),
        n.d(e, "c", function () {
          return g;
        }),
        n.d(e, "e", function () {
          return _;
        }),
        n.d(e, "f", function () {
          return v;
        }),
        n.d(e, "b", function () {
          return y;
        }),
        n.d(e, "h", function () {
          return C;
        }),
        n.d(e, "a", function () {
          return L;
        });
      var i = !1,
        o = !1,
        u = !1,
        s = !1,
        a = !1,
        c =
          void 0 !== t &&
          void 0 !== t.versions &&
          void 0 !== t.versions.electron &&
          "renderer" === t.type;
      if ("object" != typeof navigator || c) {
        if ("object" == typeof t) {
          (i = "win32" === t.platform),
            (o = "darwin" === t.platform),
            (u = "linux" === t.platform),
            "en",
            "en";
          var l = t.env.VSCODE_NLS_CONFIG;
          if (l)
            try {
              var f = JSON.parse(l),
                h = f.availableLanguages["*"];
              f.locale, h || "en", f._translationsConfigFile;
            } catch (t) {}
          s = !0;
        }
      } else {
        var d = navigator.userAgent;
        (i = d.indexOf("Windows") >= 0),
          (o = d.indexOf("Macintosh") >= 0),
          (u = d.indexOf("Linux") >= 0),
          (a = !0),
          navigator.language;
      }
      var m = i,
        p = o,
        g = u,
        _ = s,
        v = a,
        y = "object" == typeof self ? self : "object" == typeof r ? r : {},
        b = null;
      function C(e) {
        return (
          null === b &&
            (b = y.setImmediate
              ? y.setImmediate.bind(y)
              : void 0 !== t && "function" == typeof t.nextTick
              ? t.nextTick.bind(t)
              : y.setTimeout.bind(y)),
          b(e)
        );
      }
      var L = o ? 2 : i ? 1 : 3;
    }.call(this, n(28), n(21)));
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "b", function () {
      return i;
    }),
      n.d(e, "h", function () {
        return o;
      }),
      n.d(e, "g", function () {
        return u;
      }),
      n.d(e, "f", function () {
        return s;
      }),
      n.d(e, "c", function () {
        return a;
      }),
      n.d(e, "i", function () {
        return c;
      }),
      n.d(e, "j", function () {
        return l;
      }),
      n.d(e, "d", function () {
        return h;
      }),
      n.d(e, "e", function () {
        return d;
      }),
      n.d(e, "k", function () {
        return m;
      }),
      n.d(e, "a", function () {
        return g;
      }),
      n.d(e, "l", function () {
        return _;
      }),
      n.d(e, "m", function () {
        return v;
      });
    var r = {
      number: "number",
      string: "string",
      undefined: "undefined",
      object: "object",
      function: "function",
    };
    function i(t) {
      return Array.isArray
        ? Array.isArray(t)
        : !(!t || typeof t.length !== r.number || t.constructor !== Array);
    }
    function o(t) {
      return typeof t === r.string || t instanceof String;
    }
    function u(t) {
      return !(
        typeof t !== r.object ||
        null === t ||
        Array.isArray(t) ||
        t instanceof RegExp ||
        t instanceof Date
      );
    }
    function s(t) {
      return (typeof t === r.number || t instanceof Number) && !isNaN(t);
    }
    function a(t) {
      return !0 === t || !1 === t;
    }
    function c(t) {
      return typeof t === r.undefined;
    }
    function l(t) {
      return c(t) || null === t;
    }
    var f = Object.prototype.hasOwnProperty;
    function h(t) {
      if (!u(t)) return !1;
      for (var e in t) if (f.call(t, e)) return !1;
      return !0;
    }
    function d(t) {
      return typeof t === r.function;
    }
    function m(t, e) {
      for (var n = Math.min(t.length, e.length), r = 0; r < n; r++)
        p(t[r], e[r]);
    }
    function p(t, e) {
      if (o(e)) {
        if (typeof t !== e)
          throw new Error("argument does not match constraint: typeof " + e);
      } else if (d(e)) {
        try {
          if (t instanceof e) return;
        } catch (t) {}
        if (!l(t) && t.constructor === e) return;
        if (1 === e.length && !0 === e.call(void 0, t)) return;
        throw new Error(
          "argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true"
        );
      }
    }
    function g(t) {
      for (var e = [], n = Object.getPrototypeOf(t); Object.prototype !== n; )
        (e = e.concat(Object.getOwnPropertyNames(n))),
          (n = Object.getPrototypeOf(n));
      return e;
    }
    function _(t) {
      return null === t ? void 0 : t;
    }
    function v(t) {
      return void 0 === t ? null : t;
    }
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "e", function () {
      return i;
    }),
      n.d(e, "f", function () {
        return o;
      }),
      n.d(e, "d", function () {
        return s;
      }),
      n.d(e, "a", function () {
        return a;
      }),
      n.d(e, "b", function () {
        return c;
      }),
      n.d(e, "c", function () {
        return l;
      });
    var r = new ((function () {
      function t() {
        (this.listeners = []),
          (this.unexpectedErrorHandler = function (t) {
            setTimeout(function () {
              if (t.stack) throw new Error(t.message + "\n\n" + t.stack);
              throw t;
            }, 0);
          });
      }
      return (
        (t.prototype.emit = function (t) {
          this.listeners.forEach(function (e) {
            e(t);
          });
        }),
        (t.prototype.onUnexpectedError = function (t) {
          this.unexpectedErrorHandler(t), this.emit(t);
        }),
        (t.prototype.onUnexpectedExternalError = function (t) {
          this.unexpectedErrorHandler(t);
        }),
        t
      );
    })())();
    function i(t) {
      s(t) || r.onUnexpectedError(t);
    }
    function o(t) {
      return t instanceof Error
        ? {
            $isError: !0,
            name: t.name,
            message: t.message,
            stack: t.stacktrace || t.stack,
          }
        : t;
    }
    var u = "Canceled";
    function s(t) {
      return t instanceof Error && t.name === u && t.message === u;
    }
    function a() {
      var t = new Error(u);
      return (t.name = t.message), t;
    }
    function c(t) {
      return t
        ? new Error("Illegal argument: " + t)
        : new Error("Illegal argument");
    }
    function l(t) {
      return t ? new Error("Illegal state: " + t) : new Error("Illegal state");
    }
  },
  function (t, e, n) {
    "use strict";
    function r(t, e) {
      return void 0 === e && (e = 0), t[t.length - (1 + e)];
    }
    function i(t) {
      if (0 === t.length) throw new Error("Invalid tail call");
      return [t.slice(0, t.length - 1), t[t.length - 1]];
    }
    function o(t, e, n) {
      if (
        (void 0 === n &&
          (n = function (t, e) {
            return t === e;
          }),
        t === e)
      )
        return !0;
      if (!t || !e) return !1;
      if (t.length !== e.length) return !1;
      for (var r = 0, i = t.length; r < i; r++) if (!n(t[r], e[r])) return !1;
      return !0;
    }
    function u(t, e, n) {
      for (var r = 0, i = t.length - 1; r <= i; ) {
        var o = ((r + i) / 2) | 0,
          u = n(t[o], e);
        if (u < 0) r = o + 1;
        else {
          if (!(u > 0)) return o;
          i = o - 1;
        }
      }
      return -(r + 1);
    }
    function s(t, e) {
      return (
        (function t(e, n, r, i, o) {
          if (i <= r) return;
          var u = (r + (i - r) / 2) | 0;
          t(e, n, r, u, o);
          t(e, n, u + 1, i, o);
          if (n(e[u], e[u + 1]) <= 0) return;
          !(function (t, e, n, r, i, o) {
            for (var u = n, s = r + 1, a = n; a <= i; a++) o[a] = t[a];
            for (a = n; a <= i; a++)
              u > r
                ? (t[a] = o[s++])
                : s > i
                ? (t[a] = o[u++])
                : e(o[s], o[u]) < 0
                ? (t[a] = o[s++])
                : (t[a] = o[u++]);
          })(e, n, r, u, i, o);
        })(t, e, 0, t.length - 1, []),
        t
      );
    }
    function a(t) {
      return t
        ? t.filter(function (t) {
            return !!t;
          })
        : t;
    }
    function c(t) {
      return !Array.isArray(t) || 0 === t.length;
    }
    function l(t) {
      return Array.isArray(t) && t.length > 0;
    }
    function f(t, e) {
      if (!e)
        return t.filter(function (e, n) {
          return t.indexOf(e) === n;
        });
      var n = Object.create(null);
      return t.filter(function (t) {
        var r = e(t);
        return !n[r] && ((n[r] = !0), !0);
      });
    }
    function h(t) {
      var e = new Set();
      return t.filter(function (t) {
        return !e.has(t) && (e.add(t), !0);
      });
    }
    function d(t, e) {
      for (var n = 0; n < t.length; n++) {
        if (e(t[n])) return n;
      }
      return -1;
    }
    function m(t, e, n) {
      void 0 === n && (n = void 0);
      var r = d(t, e);
      return r < 0 ? n : t[r];
    }
    function p(t, e) {
      var n = "number" == typeof e ? t : 0;
      "number" == typeof e ? (n = t) : ((n = 0), (e = t));
      var r = [];
      if (n <= e) for (var i = n; i < e; i++) r.push(i);
      else for (i = n; i > e; i--) r.push(i);
      return r;
    }
    function g(t, e, n) {
      var r = t.slice(0, e),
        i = t.slice(e);
      return r.concat(n, i);
    }
    function _(t) {
      return Array.isArray(t) ? t : [t];
    }
    n.d(e, "n", function () {
      return r;
    }),
      n.d(e, "o", function () {
        return i;
      }),
      n.d(e, "g", function () {
        return o;
      }),
      n.d(e, "c", function () {
        return u;
      }),
      n.d(e, "l", function () {
        return s;
      }),
      n.d(e, "d", function () {
        return a;
      }),
      n.d(e, "j", function () {
        return c;
      }),
      n.d(e, "k", function () {
        return l;
      }),
      n.d(e, "e", function () {
        return f;
      }),
      n.d(e, "f", function () {
        return h;
      }),
      n.d(e, "i", function () {
        return d;
      }),
      n.d(e, "h", function () {
        return m;
      }),
      n.d(e, "m", function () {
        return p;
      }),
      n.d(e, "a", function () {
        return g;
      }),
      n.d(e, "b", function () {
        return _;
      });
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return s;
    });
    var r,
      i = n(3),
      o = n(1),
      u =
        ((r = function (t, e) {
          return (r =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(t, e);
        }),
        function (t, e) {
          function n() {
            this.constructor = t;
          }
          r(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((n.prototype = e.prototype), new n()));
        }),
      s = (function (t) {
        function e(e, n, r, i) {
          var o = t.call(this, e, n, r, i) || this;
          return (
            (o.selectionStartLineNumber = e),
            (o.selectionStartColumn = n),
            (o.positionLineNumber = r),
            (o.positionColumn = i),
            o
          );
        }
        return (
          u(e, t),
          (e.prototype.clone = function () {
            return new e(
              this.selectionStartLineNumber,
              this.selectionStartColumn,
              this.positionLineNumber,
              this.positionColumn
            );
          }),
          (e.prototype.toString = function () {
            return (
              "[" +
              this.selectionStartLineNumber +
              "," +
              this.selectionStartColumn +
              " -> " +
              this.positionLineNumber +
              "," +
              this.positionColumn +
              "]"
            );
          }),
          (e.prototype.equalsSelection = function (t) {
            return e.selectionsEqual(this, t);
          }),
          (e.selectionsEqual = function (t, e) {
            return (
              t.selectionStartLineNumber === e.selectionStartLineNumber &&
              t.selectionStartColumn === e.selectionStartColumn &&
              t.positionLineNumber === e.positionLineNumber &&
              t.positionColumn === e.positionColumn
            );
          }),
          (e.prototype.getDirection = function () {
            return this.selectionStartLineNumber === this.startLineNumber &&
              this.selectionStartColumn === this.startColumn
              ? 0
              : 1;
          }),
          (e.prototype.setEndPosition = function (t, n) {
            return 0 === this.getDirection()
              ? new e(this.startLineNumber, this.startColumn, t, n)
              : new e(t, n, this.startLineNumber, this.startColumn);
          }),
          (e.prototype.getPosition = function () {
            return new i.a(this.positionLineNumber, this.positionColumn);
          }),
          (e.prototype.setStartPosition = function (t, n) {
            return 0 === this.getDirection()
              ? new e(t, n, this.endLineNumber, this.endColumn)
              : new e(this.endLineNumber, this.endColumn, t, n);
          }),
          (e.fromPositions = function (t, n) {
            return (
              void 0 === n && (n = t),
              new e(t.lineNumber, t.column, n.lineNumber, n.column)
            );
          }),
          (e.liftSelection = function (t) {
            return new e(
              t.selectionStartLineNumber,
              t.selectionStartColumn,
              t.positionLineNumber,
              t.positionColumn
            );
          }),
          (e.selectionsArrEqual = function (t, e) {
            if ((t && !e) || (!t && e)) return !1;
            if (!t && !e) return !0;
            if (t.length !== e.length) return !1;
            for (var n = 0, r = t.length; n < r; n++)
              if (!this.selectionsEqual(t[n], e[n])) return !1;
            return !0;
          }),
          (e.isISelection = function (t) {
            return (
              t &&
              "number" == typeof t.selectionStartLineNumber &&
              "number" == typeof t.selectionStartColumn &&
              "number" == typeof t.positionLineNumber &&
              "number" == typeof t.positionColumn
            );
          }),
          (e.createWithDirection = function (t, n, r, i, o) {
            return 0 === o ? new e(t, n, r, i) : new e(r, i, t, n);
          }),
          e
        );
      })(o.a);
  },
  function (t, e, n) {
    "use strict";
    var r,
      i,
      o,
      u,
      s,
      a,
      c,
      l,
      f,
      h,
      d,
      m,
      p,
      g,
      _,
      v,
      y,
      b,
      C,
      L,
      E,
      N,
      S,
      w,
      A,
      O,
      T;
    n.d(e, "m", function () {
      return r;
    }),
      n.d(e, "l", function () {
        return i;
      }),
      n.d(e, "k", function () {
        return o;
      }),
      n.d(e, "u", function () {
        return u;
      }),
      n.d(e, "t", function () {
        return s;
      }),
      n.d(e, "p", function () {
        return a;
      }),
      n.d(e, "h", function () {
        return c;
      }),
      n.d(e, "f", function () {
        return l;
      }),
      n.d(e, "i", function () {
        return f;
      }),
      n.d(e, "z", function () {
        return h;
      }),
      n.d(e, "s", function () {
        return d;
      }),
      n.d(e, "e", function () {
        return m;
      }),
      n.d(e, "r", function () {
        return p;
      }),
      n.d(e, "A", function () {
        return g;
      }),
      n.d(e, "x", function () {
        return _;
      }),
      n.d(e, "y", function () {
        return v;
      }),
      n.d(e, "q", function () {
        return y;
      }),
      n.d(e, "d", function () {
        return b;
      }),
      n.d(e, "o", function () {
        return C;
      }),
      n.d(e, "n", function () {
        return L;
      }),
      n.d(e, "j", function () {
        return E;
      }),
      n.d(e, "b", function () {
        return N;
      }),
      n.d(e, "a", function () {
        return S;
      }),
      n.d(e, "c", function () {
        return w;
      }),
      n.d(e, "v", function () {
        return A;
      }),
      n.d(e, "g", function () {
        return O;
      }),
      n.d(e, "w", function () {
        return T;
      }),
      (function (t) {
        t[(t.Unnecessary = 1)] = "Unnecessary";
      })(r || (r = {})),
      (function (t) {
        (t[(t.Hint = 1)] = "Hint"),
          (t[(t.Info = 2)] = "Info"),
          (t[(t.Warning = 4)] = "Warning"),
          (t[(t.Error = 8)] = "Error");
      })(i || (i = {})),
      (function (t) {
        (t[(t.Unknown = 0)] = "Unknown"),
          (t[(t.Backspace = 1)] = "Backspace"),
          (t[(t.Tab = 2)] = "Tab"),
          (t[(t.Enter = 3)] = "Enter"),
          (t[(t.Shift = 4)] = "Shift"),
          (t[(t.Ctrl = 5)] = "Ctrl"),
          (t[(t.Alt = 6)] = "Alt"),
          (t[(t.PauseBreak = 7)] = "PauseBreak"),
          (t[(t.CapsLock = 8)] = "CapsLock"),
          (t[(t.Escape = 9)] = "Escape"),
          (t[(t.Space = 10)] = "Space"),
          (t[(t.PageUp = 11)] = "PageUp"),
          (t[(t.PageDown = 12)] = "PageDown"),
          (t[(t.End = 13)] = "End"),
          (t[(t.Home = 14)] = "Home"),
          (t[(t.LeftArrow = 15)] = "LeftArrow"),
          (t[(t.UpArrow = 16)] = "UpArrow"),
          (t[(t.RightArrow = 17)] = "RightArrow"),
          (t[(t.DownArrow = 18)] = "DownArrow"),
          (t[(t.Insert = 19)] = "Insert"),
          (t[(t.Delete = 20)] = "Delete"),
          (t[(t.KEY_0 = 21)] = "KEY_0"),
          (t[(t.KEY_1 = 22)] = "KEY_1"),
          (t[(t.KEY_2 = 23)] = "KEY_2"),
          (t[(t.KEY_3 = 24)] = "KEY_3"),
          (t[(t.KEY_4 = 25)] = "KEY_4"),
          (t[(t.KEY_5 = 26)] = "KEY_5"),
          (t[(t.KEY_6 = 27)] = "KEY_6"),
          (t[(t.KEY_7 = 28)] = "KEY_7"),
          (t[(t.KEY_8 = 29)] = "KEY_8"),
          (t[(t.KEY_9 = 30)] = "KEY_9"),
          (t[(t.KEY_A = 31)] = "KEY_A"),
          (t[(t.KEY_B = 32)] = "KEY_B"),
          (t[(t.KEY_C = 33)] = "KEY_C"),
          (t[(t.KEY_D = 34)] = "KEY_D"),
          (t[(t.KEY_E = 35)] = "KEY_E"),
          (t[(t.KEY_F = 36)] = "KEY_F"),
          (t[(t.KEY_G = 37)] = "KEY_G"),
          (t[(t.KEY_H = 38)] = "KEY_H"),
          (t[(t.KEY_I = 39)] = "KEY_I"),
          (t[(t.KEY_J = 40)] = "KEY_J"),
          (t[(t.KEY_K = 41)] = "KEY_K"),
          (t[(t.KEY_L = 42)] = "KEY_L"),
          (t[(t.KEY_M = 43)] = "KEY_M"),
          (t[(t.KEY_N = 44)] = "KEY_N"),
          (t[(t.KEY_O = 45)] = "KEY_O"),
          (t[(t.KEY_P = 46)] = "KEY_P"),
          (t[(t.KEY_Q = 47)] = "KEY_Q"),
          (t[(t.KEY_R = 48)] = "KEY_R"),
          (t[(t.KEY_S = 49)] = "KEY_S"),
          (t[(t.KEY_T = 50)] = "KEY_T"),
          (t[(t.KEY_U = 51)] = "KEY_U"),
          (t[(t.KEY_V = 52)] = "KEY_V"),
          (t[(t.KEY_W = 53)] = "KEY_W"),
          (t[(t.KEY_X = 54)] = "KEY_X"),
          (t[(t.KEY_Y = 55)] = "KEY_Y"),
          (t[(t.KEY_Z = 56)] = "KEY_Z"),
          (t[(t.Meta = 57)] = "Meta"),
          (t[(t.ContextMenu = 58)] = "ContextMenu"),
          (t[(t.F1 = 59)] = "F1"),
          (t[(t.F2 = 60)] = "F2"),
          (t[(t.F3 = 61)] = "F3"),
          (t[(t.F4 = 62)] = "F4"),
          (t[(t.F5 = 63)] = "F5"),
          (t[(t.F6 = 64)] = "F6"),
          (t[(t.F7 = 65)] = "F7"),
          (t[(t.F8 = 66)] = "F8"),
          (t[(t.F9 = 67)] = "F9"),
          (t[(t.F10 = 68)] = "F10"),
          (t[(t.F11 = 69)] = "F11"),
          (t[(t.F12 = 70)] = "F12"),
          (t[(t.F13 = 71)] = "F13"),
          (t[(t.F14 = 72)] = "F14"),
          (t[(t.F15 = 73)] = "F15"),
          (t[(t.F16 = 74)] = "F16"),
          (t[(t.F17 = 75)] = "F17"),
          (t[(t.F18 = 76)] = "F18"),
          (t[(t.F19 = 77)] = "F19"),
          (t[(t.NumLock = 78)] = "NumLock"),
          (t[(t.ScrollLock = 79)] = "ScrollLock"),
          (t[(t.US_SEMICOLON = 80)] = "US_SEMICOLON"),
          (t[(t.US_EQUAL = 81)] = "US_EQUAL"),
          (t[(t.US_COMMA = 82)] = "US_COMMA"),
          (t[(t.US_MINUS = 83)] = "US_MINUS"),
          (t[(t.US_DOT = 84)] = "US_DOT"),
          (t[(t.US_SLASH = 85)] = "US_SLASH"),
          (t[(t.US_BACKTICK = 86)] = "US_BACKTICK"),
          (t[(t.US_OPEN_SQUARE_BRACKET = 87)] = "US_OPEN_SQUARE_BRACKET"),
          (t[(t.US_BACKSLASH = 88)] = "US_BACKSLASH"),
          (t[(t.US_CLOSE_SQUARE_BRACKET = 89)] = "US_CLOSE_SQUARE_BRACKET"),
          (t[(t.US_QUOTE = 90)] = "US_QUOTE"),
          (t[(t.OEM_8 = 91)] = "OEM_8"),
          (t[(t.OEM_102 = 92)] = "OEM_102"),
          (t[(t.NUMPAD_0 = 93)] = "NUMPAD_0"),
          (t[(t.NUMPAD_1 = 94)] = "NUMPAD_1"),
          (t[(t.NUMPAD_2 = 95)] = "NUMPAD_2"),
          (t[(t.NUMPAD_3 = 96)] = "NUMPAD_3"),
          (t[(t.NUMPAD_4 = 97)] = "NUMPAD_4"),
          (t[(t.NUMPAD_5 = 98)] = "NUMPAD_5"),
          (t[(t.NUMPAD_6 = 99)] = "NUMPAD_6"),
          (t[(t.NUMPAD_7 = 100)] = "NUMPAD_7"),
          (t[(t.NUMPAD_8 = 101)] = "NUMPAD_8"),
          (t[(t.NUMPAD_9 = 102)] = "NUMPAD_9"),
          (t[(t.NUMPAD_MULTIPLY = 103)] = "NUMPAD_MULTIPLY"),
          (t[(t.NUMPAD_ADD = 104)] = "NUMPAD_ADD"),
          (t[(t.NUMPAD_SEPARATOR = 105)] = "NUMPAD_SEPARATOR"),
          (t[(t.NUMPAD_SUBTRACT = 106)] = "NUMPAD_SUBTRACT"),
          (t[(t.NUMPAD_DECIMAL = 107)] = "NUMPAD_DECIMAL"),
          (t[(t.NUMPAD_DIVIDE = 108)] = "NUMPAD_DIVIDE"),
          (t[(t.KEY_IN_COMPOSITION = 109)] = "KEY_IN_COMPOSITION"),
          (t[(t.ABNT_C1 = 110)] = "ABNT_C1"),
          (t[(t.ABNT_C2 = 111)] = "ABNT_C2"),
          (t[(t.MAX_VALUE = 112)] = "MAX_VALUE");
      })(o || (o = {})),
      (function (t) {
        (t[(t.LTR = 0)] = "LTR"), (t[(t.RTL = 1)] = "RTL");
      })(u || (u = {})),
      (function (t) {
        (t[(t.Auto = 1)] = "Auto"),
          (t[(t.Hidden = 2)] = "Hidden"),
          (t[(t.Visible = 3)] = "Visible");
      })(s || (s = {})),
      (function (t) {
        (t[(t.Left = 1)] = "Left"),
          (t[(t.Center = 2)] = "Center"),
          (t[(t.Right = 4)] = "Right"),
          (t[(t.Full = 7)] = "Full");
      })(a || (a = {})),
      (function (t) {
        (t[(t.TextDefined = 0)] = "TextDefined"),
          (t[(t.LF = 1)] = "LF"),
          (t[(t.CRLF = 2)] = "CRLF");
      })(c || (c = {})),
      (function (t) {
        (t[(t.LF = 1)] = "LF"), (t[(t.CRLF = 2)] = "CRLF");
      })(l || (l = {})),
      (function (t) {
        (t[(t.LF = 0)] = "LF"), (t[(t.CRLF = 1)] = "CRLF");
      })(f || (f = {})),
      (function (t) {
        (t[(t.AlwaysGrowsWhenTypingAtEdges = 0)] =
          "AlwaysGrowsWhenTypingAtEdges"),
          (t[(t.NeverGrowsWhenTypingAtEdges = 1)] =
            "NeverGrowsWhenTypingAtEdges"),
          (t[(t.GrowsOnlyWhenTypingBefore = 2)] = "GrowsOnlyWhenTypingBefore"),
          (t[(t.GrowsOnlyWhenTypingAfter = 3)] = "GrowsOnlyWhenTypingAfter");
      })(h || (h = {})),
      (function (t) {
        (t[(t.Smooth = 0)] = "Smooth"), (t[(t.Immediate = 1)] = "Immediate");
      })(d || (d = {})),
      (function (t) {
        (t[(t.NotSet = 0)] = "NotSet"),
          (t[(t.ContentFlush = 1)] = "ContentFlush"),
          (t[(t.RecoverFromMarkers = 2)] = "RecoverFromMarkers"),
          (t[(t.Explicit = 3)] = "Explicit"),
          (t[(t.Paste = 4)] = "Paste"),
          (t[(t.Undo = 5)] = "Undo"),
          (t[(t.Redo = 6)] = "Redo");
      })(m || (m = {})),
      (function (t) {
        (t[(t.None = 0)] = "None"),
          (t[(t.Small = 1)] = "Small"),
          (t[(t.Large = 2)] = "Large"),
          (t[(t.SmallBlocks = 3)] = "SmallBlocks"),
          (t[(t.LargeBlocks = 4)] = "LargeBlocks");
      })(p || (p = {})),
      (function (t) {
        (t[(t.None = 0)] = "None"),
          (t[(t.Same = 1)] = "Same"),
          (t[(t.Indent = 2)] = "Indent"),
          (t[(t.DeepIndent = 3)] = "DeepIndent");
      })(g || (g = {})),
      (function (t) {
        (t[(t.Hidden = 0)] = "Hidden"),
          (t[(t.Blink = 1)] = "Blink"),
          (t[(t.Smooth = 2)] = "Smooth"),
          (t[(t.Phase = 3)] = "Phase"),
          (t[(t.Expand = 4)] = "Expand"),
          (t[(t.Solid = 5)] = "Solid");
      })(_ || (_ = {})),
      (function (t) {
        (t[(t.Line = 1)] = "Line"),
          (t[(t.Block = 2)] = "Block"),
          (t[(t.Underline = 3)] = "Underline"),
          (t[(t.LineThin = 4)] = "LineThin"),
          (t[(t.BlockOutline = 5)] = "BlockOutline"),
          (t[(t.UnderlineThin = 6)] = "UnderlineThin");
      })(v || (v = {})),
      (function (t) {
        (t[(t.Off = 0)] = "Off"),
          (t[(t.On = 1)] = "On"),
          (t[(t.Relative = 2)] = "Relative"),
          (t[(t.Interval = 3)] = "Interval"),
          (t[(t.Custom = 4)] = "Custom");
      })(y || (y = {})),
      (function (t) {
        (t[(t.EXACT = 0)] = "EXACT"),
          (t[(t.ABOVE = 1)] = "ABOVE"),
          (t[(t.BELOW = 2)] = "BELOW");
      })(b || (b = {})),
      (function (t) {
        (t[(t.TOP_RIGHT_CORNER = 0)] = "TOP_RIGHT_CORNER"),
          (t[(t.BOTTOM_RIGHT_CORNER = 1)] = "BOTTOM_RIGHT_CORNER"),
          (t[(t.TOP_CENTER = 2)] = "TOP_CENTER");
      })(C || (C = {})),
      (function (t) {
        (t[(t.UNKNOWN = 0)] = "UNKNOWN"),
          (t[(t.TEXTAREA = 1)] = "TEXTAREA"),
          (t[(t.GUTTER_GLYPH_MARGIN = 2)] = "GUTTER_GLYPH_MARGIN"),
          (t[(t.GUTTER_LINE_NUMBERS = 3)] = "GUTTER_LINE_NUMBERS"),
          (t[(t.GUTTER_LINE_DECORATIONS = 4)] = "GUTTER_LINE_DECORATIONS"),
          (t[(t.GUTTER_VIEW_ZONE = 5)] = "GUTTER_VIEW_ZONE"),
          (t[(t.CONTENT_TEXT = 6)] = "CONTENT_TEXT"),
          (t[(t.CONTENT_EMPTY = 7)] = "CONTENT_EMPTY"),
          (t[(t.CONTENT_VIEW_ZONE = 8)] = "CONTENT_VIEW_ZONE"),
          (t[(t.CONTENT_WIDGET = 9)] = "CONTENT_WIDGET"),
          (t[(t.OVERVIEW_RULER = 10)] = "OVERVIEW_RULER"),
          (t[(t.SCROLLBAR = 11)] = "SCROLLBAR"),
          (t[(t.OVERLAY_WIDGET = 12)] = "OVERLAY_WIDGET"),
          (t[(t.OUTSIDE_EDITOR = 13)] = "OUTSIDE_EDITOR");
      })(L || (L = {})),
      (function (t) {
        (t[(t.None = 0)] = "None"),
          (t[(t.Indent = 1)] = "Indent"),
          (t[(t.IndentOutdent = 2)] = "IndentOutdent"),
          (t[(t.Outdent = 3)] = "Outdent");
      })(E || (E = {})),
      (function (t) {
        (t[(t.Method = 0)] = "Method"),
          (t[(t.Function = 1)] = "Function"),
          (t[(t.Constructor = 2)] = "Constructor"),
          (t[(t.Field = 3)] = "Field"),
          (t[(t.Variable = 4)] = "Variable"),
          (t[(t.Class = 5)] = "Class"),
          (t[(t.Struct = 6)] = "Struct"),
          (t[(t.Interface = 7)] = "Interface"),
          (t[(t.Module = 8)] = "Module"),
          (t[(t.Property = 9)] = "Property"),
          (t[(t.Event = 10)] = "Event"),
          (t[(t.Operator = 11)] = "Operator"),
          (t[(t.Unit = 12)] = "Unit"),
          (t[(t.Value = 13)] = "Value"),
          (t[(t.Constant = 14)] = "Constant"),
          (t[(t.Enum = 15)] = "Enum"),
          (t[(t.EnumMember = 16)] = "EnumMember"),
          (t[(t.Keyword = 17)] = "Keyword"),
          (t[(t.Text = 18)] = "Text"),
          (t[(t.Color = 19)] = "Color"),
          (t[(t.File = 20)] = "File"),
          (t[(t.Reference = 21)] = "Reference"),
          (t[(t.Customcolor = 22)] = "Customcolor"),
          (t[(t.Folder = 23)] = "Folder"),
          (t[(t.TypeParameter = 24)] = "TypeParameter"),
          (t[(t.Snippet = 25)] = "Snippet");
      })(N || (N = {})),
      (function (t) {
        (t[(t.KeepWhitespace = 1)] = "KeepWhitespace"),
          (t[(t.InsertAsSnippet = 4)] = "InsertAsSnippet");
      })(S || (S = {})),
      (function (t) {
        (t[(t.Invoke = 0)] = "Invoke"),
          (t[(t.TriggerCharacter = 1)] = "TriggerCharacter"),
          (t[(t.TriggerForIncompleteCompletions = 2)] =
            "TriggerForIncompleteCompletions");
      })(w || (w = {})),
      (function (t) {
        (t[(t.Invoke = 1)] = "Invoke"),
          (t[(t.TriggerCharacter = 2)] = "TriggerCharacter"),
          (t[(t.ContentChange = 3)] = "ContentChange");
      })(A || (A = {})),
      (function (t) {
        (t[(t.Text = 0)] = "Text"),
          (t[(t.Read = 1)] = "Read"),
          (t[(t.Write = 2)] = "Write");
      })(O || (O = {})),
      (function (t) {
        (t[(t.File = 0)] = "File"),
          (t[(t.Module = 1)] = "Module"),
          (t[(t.Namespace = 2)] = "Namespace"),
          (t[(t.Package = 3)] = "Package"),
          (t[(t.Class = 4)] = "Class"),
          (t[(t.Method = 5)] = "Method"),
          (t[(t.Property = 6)] = "Property"),
          (t[(t.Field = 7)] = "Field"),
          (t[(t.Constructor = 8)] = "Constructor"),
          (t[(t.Enum = 9)] = "Enum"),
          (t[(t.Interface = 10)] = "Interface"),
          (t[(t.Function = 11)] = "Function"),
          (t[(t.Variable = 12)] = "Variable"),
          (t[(t.Constant = 13)] = "Constant"),
          (t[(t.String = 14)] = "String"),
          (t[(t.Number = 15)] = "Number"),
          (t[(t.Boolean = 16)] = "Boolean"),
          (t[(t.Array = 17)] = "Array"),
          (t[(t.Object = 18)] = "Object"),
          (t[(t.Key = 19)] = "Key"),
          (t[(t.Null = 20)] = "Null"),
          (t[(t.EnumMember = 21)] = "EnumMember"),
          (t[(t.Struct = 22)] = "Struct"),
          (t[(t.Event = 23)] = "Event"),
          (t[(t.Operator = 24)] = "Operator"),
          (t[(t.TypeParameter = 25)] = "TypeParameter");
      })(T || (T = {}));
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return r;
    }),
      n.d(e, "d", function () {
        return i;
      }),
      n.d(e, "b", function () {
        return o;
      }),
      n.d(e, "c", function () {
        return u;
      });
    var r = (function () {
      function t(t, e, n) {
        for (var r = new Uint8Array(t * e), i = 0, o = t * e; i < o; i++)
          r[i] = n;
        (this._data = r), (this.rows = t), (this.cols = e);
      }
      return (
        (t.prototype.get = function (t, e) {
          return this._data[t * this.cols + e];
        }),
        (t.prototype.set = function (t, e, n) {
          this._data[t * this.cols + e] = n;
        }),
        t
      );
    })();
    function i(t) {
      return t < 0 ? 0 : t > 255 ? 255 : 0 | t;
    }
    function o(t) {
      return t < 0 ? 0 : t > 4294967295 ? 4294967295 : 0 | t;
    }
    function u(t) {
      for (var e = t.length, n = new Uint32Array(e), r = 0; r < e; r++)
        n[r] = o(t[r]);
      return n;
    }
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return m;
    });
    var r,
      i,
      o = n(5),
      u =
        ((r = function (t, e) {
          return (r =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(t, e);
        }),
        function (t, e) {
          function n() {
            this.constructor = t;
          }
          r(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((n.prototype = e.prototype), new n()));
        }),
      s = /^\w[\w\d+.-]*$/,
      a = /^\//,
      c = /^\/\//,
      l = !0;
    var f = "",
      h = "/",
      d = /^(([^:\/?#]+?):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,
      m = (function () {
        function t(t, e, n, r, i, o) {
          void 0 === o && (o = !1),
            "object" == typeof t
              ? ((this.scheme = t.scheme || f),
                (this.authority = t.authority || f),
                (this.path = t.path || f),
                (this.query = t.query || f),
                (this.fragment = t.fragment || f))
              : ((this.scheme = (function (t, e) {
                  return e || l
                    ? t || f
                    : (t ||
                        (console.trace(
                          "BAD uri lacks scheme, falling back to file-scheme."
                        ),
                        (t = "file")),
                      t);
                })(t, o)),
                (this.authority = e || f),
                (this.path = (function (t, e) {
                  switch (t) {
                    case "https":
                    case "http":
                    case "file":
                      e ? e[0] !== h && (e = h + e) : (e = h);
                  }
                  return e;
                })(this.scheme, n || f)),
                (this.query = r || f),
                (this.fragment = i || f),
                (function (t, e) {
                  if (!t.scheme) {
                    if (e || l)
                      throw new Error(
                        '[UriError]: Scheme is missing: {scheme: "", authority: "' +
                          t.authority +
                          '", path: "' +
                          t.path +
                          '", query: "' +
                          t.query +
                          '", fragment: "' +
                          t.fragment +
                          '"}'
                      );
                    console.warn(
                      '[UriError]: Scheme is missing: {scheme: "", authority: "' +
                        t.authority +
                        '", path: "' +
                        t.path +
                        '", query: "' +
                        t.query +
                        '", fragment: "' +
                        t.fragment +
                        '"}'
                    );
                  }
                  if (t.scheme && !s.test(t.scheme))
                    throw new Error(
                      "[UriError]: Scheme contains illegal characters."
                    );
                  if (t.path)
                    if (t.authority) {
                      if (!a.test(t.path))
                        throw new Error(
                          '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character'
                        );
                    } else if (c.test(t.path))
                      throw new Error(
                        '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")'
                      );
                })(this, o));
        }
        return (
          (t.isUri = function (e) {
            return (
              e instanceof t ||
              (!!e &&
                "string" == typeof e.authority &&
                "string" == typeof e.fragment &&
                "string" == typeof e.path &&
                "string" == typeof e.query &&
                "string" == typeof e.scheme &&
                "function" == typeof e.fsPath &&
                "function" == typeof e.with &&
                "function" == typeof e.toString)
            );
          }),
          Object.defineProperty(t.prototype, "fsPath", {
            get: function () {
              return y(this);
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.with = function (t) {
            if (!t) return this;
            var e = t.scheme,
              n = t.authority,
              r = t.path,
              i = t.query,
              o = t.fragment;
            return (
              void 0 === e ? (e = this.scheme) : null === e && (e = f),
              void 0 === n ? (n = this.authority) : null === n && (n = f),
              void 0 === r ? (r = this.path) : null === r && (r = f),
              void 0 === i ? (i = this.query) : null === i && (i = f),
              void 0 === o ? (o = this.fragment) : null === o && (o = f),
              e === this.scheme &&
              n === this.authority &&
              r === this.path &&
              i === this.query &&
              o === this.fragment
                ? this
                : new p(e, n, r, i, o)
            );
          }),
          (t.parse = function (t, e) {
            void 0 === e && (e = !1);
            var n = d.exec(t);
            return n
              ? new p(
                  n[2] || f,
                  decodeURIComponent(n[4] || f),
                  decodeURIComponent(n[5] || f),
                  decodeURIComponent(n[7] || f),
                  decodeURIComponent(n[9] || f),
                  e
                )
              : new p(f, f, f, f, f);
          }),
          (t.file = function (t) {
            var e = f;
            if ((o.g && (t = t.replace(/\\/g, h)), t[0] === h && t[1] === h)) {
              var n = t.indexOf(h, 2);
              -1 === n
                ? ((e = t.substring(2)), (t = h))
                : ((e = t.substring(2, n)), (t = t.substring(n) || h));
            }
            return new p("file", e, t, f, f);
          }),
          (t.from = function (t) {
            return new p(t.scheme, t.authority, t.path, t.query, t.fragment);
          }),
          (t.prototype.toString = function (t) {
            return void 0 === t && (t = !1), b(this, t);
          }),
          (t.prototype.toJSON = function () {
            return this;
          }),
          (t.revive = function (e) {
            if (e) {
              if (e instanceof t) return e;
              var n = new p(e);
              return (n._fsPath = e.fsPath), (n._formatted = e.external), n;
            }
            return e;
          }),
          t
        );
      })(),
      p = (function (t) {
        function e() {
          var e = (null !== t && t.apply(this, arguments)) || this;
          return (e._formatted = null), (e._fsPath = null), e;
        }
        return (
          u(e, t),
          Object.defineProperty(e.prototype, "fsPath", {
            get: function () {
              return this._fsPath || (this._fsPath = y(this)), this._fsPath;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (e.prototype.toString = function (t) {
            return (
              void 0 === t && (t = !1),
              t
                ? b(this, !0)
                : (this._formatted || (this._formatted = b(this, !1)),
                  this._formatted)
            );
          }),
          (e.prototype.toJSON = function () {
            var t = { $mid: 1 };
            return (
              this._fsPath && (t.fsPath = this._fsPath),
              this._formatted && (t.external = this._formatted),
              this.path && (t.path = this.path),
              this.scheme && (t.scheme = this.scheme),
              this.authority && (t.authority = this.authority),
              this.query && (t.query = this.query),
              this.fragment && (t.fragment = this.fragment),
              t
            );
          }),
          e
        );
      })(m),
      g =
        (((i = {})[58] = "%3A"),
        (i[47] = "%2F"),
        (i[63] = "%3F"),
        (i[35] = "%23"),
        (i[91] = "%5B"),
        (i[93] = "%5D"),
        (i[64] = "%40"),
        (i[33] = "%21"),
        (i[36] = "%24"),
        (i[38] = "%26"),
        (i[39] = "%27"),
        (i[40] = "%28"),
        (i[41] = "%29"),
        (i[42] = "%2A"),
        (i[43] = "%2B"),
        (i[44] = "%2C"),
        (i[59] = "%3B"),
        (i[61] = "%3D"),
        (i[32] = "%20"),
        i);
    function _(t, e) {
      for (var n = void 0, r = -1, i = 0; i < t.length; i++) {
        var o = t.charCodeAt(i);
        if (
          (o >= 97 && o <= 122) ||
          (o >= 65 && o <= 90) ||
          (o >= 48 && o <= 57) ||
          45 === o ||
          46 === o ||
          95 === o ||
          126 === o ||
          (e && 47 === o)
        )
          -1 !== r && ((n += encodeURIComponent(t.substring(r, i))), (r = -1)),
            void 0 !== n && (n += t.charAt(i));
        else {
          void 0 === n && (n = t.substr(0, i));
          var u = g[o];
          void 0 !== u
            ? (-1 !== r &&
                ((n += encodeURIComponent(t.substring(r, i))), (r = -1)),
              (n += u))
            : -1 === r && (r = i);
        }
      }
      return (
        -1 !== r && (n += encodeURIComponent(t.substring(r))),
        void 0 !== n ? n : t
      );
    }
    function v(t) {
      for (var e = void 0, n = 0; n < t.length; n++) {
        var r = t.charCodeAt(n);
        35 === r || 63 === r
          ? (void 0 === e && (e = t.substr(0, n)), (e += g[r]))
          : void 0 !== e && (e += t[n]);
      }
      return void 0 !== e ? e : t;
    }
    function y(t) {
      var e;
      return (
        (e =
          t.authority && t.path.length > 1 && "file" === t.scheme
            ? "//" + t.authority + t.path
            : 47 === t.path.charCodeAt(0) &&
              ((t.path.charCodeAt(1) >= 65 && t.path.charCodeAt(1) <= 90) ||
                (t.path.charCodeAt(1) >= 97 && t.path.charCodeAt(1) <= 122)) &&
              58 === t.path.charCodeAt(2)
            ? t.path[1].toLowerCase() + t.path.substr(2)
            : t.path),
        o.g && (e = e.replace(/\//g, "\\")),
        e
      );
    }
    function b(t, e) {
      var n = e ? v : _,
        r = "",
        i = t.scheme,
        o = t.authority,
        u = t.path,
        s = t.query,
        a = t.fragment;
      if (
        (i && ((r += i), (r += ":")),
        (o || "file" === i) && ((r += h), (r += h)),
        o)
      ) {
        var c = o.indexOf("@");
        if (-1 !== c) {
          var l = o.substr(0, c);
          (o = o.substr(c + 1)),
            -1 === (c = l.indexOf(":"))
              ? (r += n(l, !1))
              : ((r += n(l.substr(0, c), !1)),
                (r += ":"),
                (r += n(l.substr(c + 1), !1))),
            (r += "@");
        }
        -1 === (c = (o = o.toLowerCase()).indexOf(":"))
          ? (r += n(o, !1))
          : ((r += n(o.substr(0, c), !1)), (r += o.substr(c)));
      }
      if (u) {
        if (u.length >= 3 && 47 === u.charCodeAt(0) && 58 === u.charCodeAt(2))
          (f = u.charCodeAt(1)) >= 65 &&
            f <= 90 &&
            (u = "/" + String.fromCharCode(f + 32) + ":" + u.substr(3));
        else if (u.length >= 2 && 58 === u.charCodeAt(1)) {
          var f;
          (f = u.charCodeAt(0)) >= 65 &&
            f <= 90 &&
            (u = String.fromCharCode(f + 32) + ":" + u.substr(2));
        }
        r += n(u, !0);
      }
      return (
        s && ((r += "?"), (r += n(s, !1))),
        a && ((r += "#"), (r += e ? a : _(a, !1))),
        r
      );
    }
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return u;
    }),
      n.d(e, "b", function () {
        return i;
      }),
      n.d(e, "c", function () {
        return s;
      });
    var r,
      i,
      o =
        ((r = function (t, e) {
          return (r =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(t, e);
        }),
        function (t, e) {
          function n() {
            this.constructor = t;
          }
          r(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((n.prototype = e.prototype), new n()));
        }),
      u = { done: !0, value: void 0 };
    function s(t) {
      return Array.isArray(t) ? i.fromArray(t) : t;
    }
    !(function (t) {
      var e = {
        next: function () {
          return u;
        },
      };
      function n(t, e) {
        for (var n = t.next(); !n.done; n = t.next()) e(n.value);
      }
      (t.empty = function () {
        return e;
      }),
        (t.fromArray = function (t, e, n) {
          return (
            void 0 === e && (e = 0),
            void 0 === n && (n = t.length),
            {
              next: function () {
                return e >= n ? u : { done: !1, value: t[e++] };
              },
            }
          );
        }),
        (t.from = function (e) {
          return e ? (Array.isArray(e) ? t.fromArray(e) : e) : t.empty();
        }),
        (t.map = function (t, e) {
          return {
            next: function () {
              var n = t.next();
              return n.done ? u : { done: !1, value: e(n.value) };
            },
          };
        }),
        (t.filter = function (t, e) {
          return {
            next: function () {
              for (;;) {
                var n = t.next();
                if (n.done) return u;
                if (e(n.value)) return { done: !1, value: n.value };
              }
            },
          };
        }),
        (t.forEach = n),
        (t.collect = function (t) {
          var e = [];
          return (
            n(t, function (t) {
              return e.push(t);
            }),
            e
          );
        });
    })(i || (i = {}));
    (function (t) {
      function e(e, n, r, i) {
        return (
          void 0 === n && (n = 0),
          void 0 === r && (r = e.length),
          void 0 === i && (i = n - 1),
          t.call(this, e, n, r, i) || this
        );
      }
      o(e, t),
        (e.prototype.current = function () {
          return t.prototype.current.call(this);
        }),
        (e.prototype.previous = function () {
          return (
            (this.index = Math.max(this.index - 1, this.start - 1)),
            this.current()
          );
        }),
        (e.prototype.first = function () {
          return (this.index = this.start), this.current();
        }),
        (e.prototype.last = function () {
          return (this.index = this.end - 1), this.current();
        }),
        (e.prototype.parent = function () {
          return null;
        });
    })(
      (function () {
        function t(t, e, n, r) {
          void 0 === e && (e = 0),
            void 0 === n && (n = t.length),
            void 0 === r && (r = e - 1),
            (this.items = t),
            (this.start = e),
            (this.end = n),
            (this.index = r);
        }
        return (
          (t.prototype.next = function () {
            return (
              (this.index = Math.min(this.index + 1, this.end)), this.current()
            );
          }),
          (t.prototype.current = function () {
            return this.index === this.start - 1 || this.index === this.end
              ? null
              : this.items[this.index];
          }),
          t
        );
      })()
    ),
      (function () {
        function t(t, e) {
          (this.iterator = t), (this.fn = e);
        }
        t.prototype.next = function () {
          return this.fn(this.iterator.next());
        };
      })();
  },
  ,
  ,
  function (t, e, n) {
    "use strict";
    n.d(e, "b", function () {
      return r;
    }),
      n.d(e, "a", function () {
        return c;
      }),
      n.d(e, "f", function () {
        return l;
      }),
      n.d(e, "e", function () {
        return h;
      }),
      n.d(e, "d", function () {
        return m;
      }),
      n.d(e, "c", function () {
        return p;
      });
    var r,
      i = n(7),
      o = (function () {
        function t() {
          (this._keyCodeToStr = []), (this._strToKeyCode = Object.create(null));
        }
        return (
          (t.prototype.define = function (t, e) {
            (this._keyCodeToStr[t] = e),
              (this._strToKeyCode[e.toLowerCase()] = t);
          }),
          (t.prototype.keyCodeToStr = function (t) {
            return this._keyCodeToStr[t];
          }),
          (t.prototype.strToKeyCode = function (t) {
            return this._strToKeyCode[t.toLowerCase()] || 0;
          }),
          t
        );
      })(),
      u = new o(),
      s = new o(),
      a = new o();
    function c(t, e) {
      return (t | (((65535 & e) << 16) >>> 0)) >>> 0;
    }
    function l(t, e) {
      if (0 === t) return null;
      var n = (65535 & t) >>> 0,
        r = (4294901760 & t) >>> 16;
      return new d(0 !== r ? [f(n, e), f(r, e)] : [f(n, e)]);
    }
    function f(t, e) {
      var n = !!(2048 & t),
        r = !!(256 & t);
      return new h(
        2 === e ? r : n,
        !!(1024 & t),
        !!(512 & t),
        2 === e ? n : r,
        255 & t
      );
    }
    !(function () {
      function t(t, e, n, r) {
        void 0 === n && (n = e),
          void 0 === r && (r = n),
          u.define(t, e),
          s.define(t, n),
          a.define(t, r);
      }
      t(0, "unknown"),
        t(1, "Backspace"),
        t(2, "Tab"),
        t(3, "Enter"),
        t(4, "Shift"),
        t(5, "Ctrl"),
        t(6, "Alt"),
        t(7, "PauseBreak"),
        t(8, "CapsLock"),
        t(9, "Escape"),
        t(10, "Space"),
        t(11, "PageUp"),
        t(12, "PageDown"),
        t(13, "End"),
        t(14, "Home"),
        t(15, "LeftArrow", "Left"),
        t(16, "UpArrow", "Up"),
        t(17, "RightArrow", "Right"),
        t(18, "DownArrow", "Down"),
        t(19, "Insert"),
        t(20, "Delete"),
        t(21, "0"),
        t(22, "1"),
        t(23, "2"),
        t(24, "3"),
        t(25, "4"),
        t(26, "5"),
        t(27, "6"),
        t(28, "7"),
        t(29, "8"),
        t(30, "9"),
        t(31, "A"),
        t(32, "B"),
        t(33, "C"),
        t(34, "D"),
        t(35, "E"),
        t(36, "F"),
        t(37, "G"),
        t(38, "H"),
        t(39, "I"),
        t(40, "J"),
        t(41, "K"),
        t(42, "L"),
        t(43, "M"),
        t(44, "N"),
        t(45, "O"),
        t(46, "P"),
        t(47, "Q"),
        t(48, "R"),
        t(49, "S"),
        t(50, "T"),
        t(51, "U"),
        t(52, "V"),
        t(53, "W"),
        t(54, "X"),
        t(55, "Y"),
        t(56, "Z"),
        t(57, "Meta"),
        t(58, "ContextMenu"),
        t(59, "F1"),
        t(60, "F2"),
        t(61, "F3"),
        t(62, "F4"),
        t(63, "F5"),
        t(64, "F6"),
        t(65, "F7"),
        t(66, "F8"),
        t(67, "F9"),
        t(68, "F10"),
        t(69, "F11"),
        t(70, "F12"),
        t(71, "F13"),
        t(72, "F14"),
        t(73, "F15"),
        t(74, "F16"),
        t(75, "F17"),
        t(76, "F18"),
        t(77, "F19"),
        t(78, "NumLock"),
        t(79, "ScrollLock"),
        t(80, ";", ";", "OEM_1"),
        t(81, "=", "=", "OEM_PLUS"),
        t(82, ",", ",", "OEM_COMMA"),
        t(83, "-", "-", "OEM_MINUS"),
        t(84, ".", ".", "OEM_PERIOD"),
        t(85, "/", "/", "OEM_2"),
        t(86, "`", "`", "OEM_3"),
        t(110, "ABNT_C1"),
        t(111, "ABNT_C2"),
        t(87, "[", "[", "OEM_4"),
        t(88, "\\", "\\", "OEM_5"),
        t(89, "]", "]", "OEM_6"),
        t(90, "'", "'", "OEM_7"),
        t(91, "OEM_8"),
        t(92, "OEM_102"),
        t(93, "NumPad0"),
        t(94, "NumPad1"),
        t(95, "NumPad2"),
        t(96, "NumPad3"),
        t(97, "NumPad4"),
        t(98, "NumPad5"),
        t(99, "NumPad6"),
        t(100, "NumPad7"),
        t(101, "NumPad8"),
        t(102, "NumPad9"),
        t(103, "NumPad_Multiply"),
        t(104, "NumPad_Add"),
        t(105, "NumPad_Separator"),
        t(106, "NumPad_Subtract"),
        t(107, "NumPad_Decimal"),
        t(108, "NumPad_Divide");
    })(),
      (function (t) {
        (t.toString = function (t) {
          return u.keyCodeToStr(t);
        }),
          (t.fromString = function (t) {
            return u.strToKeyCode(t);
          }),
          (t.toUserSettingsUS = function (t) {
            return s.keyCodeToStr(t);
          }),
          (t.toUserSettingsGeneral = function (t) {
            return a.keyCodeToStr(t);
          }),
          (t.fromUserSettings = function (t) {
            return s.strToKeyCode(t) || a.strToKeyCode(t);
          });
      })(r || (r = {}));
    var h = (function () {
        function t(t, e, n, r, i) {
          (this.ctrlKey = t),
            (this.shiftKey = e),
            (this.altKey = n),
            (this.metaKey = r),
            (this.keyCode = i);
        }
        return (
          (t.prototype.equals = function (t) {
            return (
              this.ctrlKey === t.ctrlKey &&
              this.shiftKey === t.shiftKey &&
              this.altKey === t.altKey &&
              this.metaKey === t.metaKey &&
              this.keyCode === t.keyCode
            );
          }),
          (t.prototype.isModifierKey = function () {
            return (
              0 === this.keyCode ||
              5 === this.keyCode ||
              57 === this.keyCode ||
              6 === this.keyCode ||
              4 === this.keyCode
            );
          }),
          (t.prototype.toChord = function () {
            return new d([this]);
          }),
          (t.prototype.isDuplicateModifierCase = function () {
            return (
              (this.ctrlKey && 5 === this.keyCode) ||
              (this.shiftKey && 4 === this.keyCode) ||
              (this.altKey && 6 === this.keyCode) ||
              (this.metaKey && 57 === this.keyCode)
            );
          }),
          t
        );
      })(),
      d = (function () {
        function t(t) {
          if (0 === t.length) throw Object(i.b)("parts");
          this.parts = t;
        }
        return (
          (t.prototype.equals = function (t) {
            if (null === t) return !1;
            if (this.parts.length !== t.parts.length) return !1;
            for (var e = 0; e < this.parts.length; e++)
              if (!this.parts[e].equals(t.parts[e])) return !1;
            return !0;
          }),
          t
        );
      })(),
      m = function (t, e, n, r, i, o) {
        (this.ctrlKey = t),
          (this.shiftKey = e),
          (this.altKey = n),
          (this.metaKey = r),
          (this.keyLabel = i),
          (this.keyAriaLabel = o);
      },
      p = function () {};
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return r;
    }),
      n.d(e, "b", function () {
        return i;
      }),
      n.d(e, "c", function () {
        return o;
      });
    var r = (function () {
        function t(t, e, n) {
          (this.offset = 0 | t), (this.type = e), (this.language = n);
        }
        return (
          (t.prototype.toString = function () {
            return "(" + this.offset + ", " + this.type + ")";
          }),
          t
        );
      })(),
      i = function (t, e) {
        (this.tokens = t), (this.endState = e);
      },
      o = function (t, e) {
        (this.tokens = t), (this.endState = e);
      };
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "b", function () {
      return r;
    }),
      n.d(e, "a", function () {
        return i;
      }),
      n.d(e, "c", function () {
        return o;
      }),
      n.d(e, "d", function () {
        return u;
      });
    var r = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
    var i = (function (t) {
      void 0 === t && (t = "");
      for (var e = "(-?\\d*\\.\\d\\w*)|([^", n = 0, i = r; n < i.length; n++) {
        var o = i[n];
        t.indexOf(o) >= 0 || (e += "\\" + o);
      }
      return (e += "\\s]+)"), new RegExp(e, "g");
    })();
    function o(t) {
      var e = i;
      if (t && t instanceof RegExp)
        if (t.global) e = t;
        else {
          var n = "g";
          t.ignoreCase && (n += "i"),
            t.multiline && (n += "m"),
            t.unicode && (n += "u"),
            (e = new RegExp(t.source, n));
        }
      return (e.lastIndex = 0), e;
    }
    function u(t, e, n, r) {
      e.lastIndex = 0;
      var i = e.exec(n);
      if (!i) return null;
      var o =
        i[0].indexOf(" ") >= 0
          ? (function (t, e, n, r) {
              var i,
                o = t - 1 - r;
              for (e.lastIndex = 0; (i = e.exec(n)); ) {
                var u = i.index || 0;
                if (u > o) return null;
                if (e.lastIndex >= o)
                  return {
                    word: i[0],
                    startColumn: r + 1 + u,
                    endColumn: r + 1 + e.lastIndex,
                  };
              }
              return null;
            })(t, e, n, r)
          : (function (t, e, n, r) {
              var i,
                o = t - 1 - r,
                u = n.lastIndexOf(" ", o - 1) + 1;
              for (e.lastIndex = u; (i = e.exec(n)); ) {
                var s = i.index || 0;
                if (s <= o && e.lastIndex >= o)
                  return {
                    word: i[0],
                    startColumn: r + 1 + s,
                    endColumn: r + 1 + e.lastIndex,
                  };
              }
              return null;
            })(t, e, n, r);
      return (e.lastIndex = 0), o;
    }
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return o;
    });
    var r = n(13),
      i = (function () {
        function t(e) {
          (this.element = e),
            (this.next = t.Undefined),
            (this.prev = t.Undefined);
        }
        return (t.Undefined = new t(void 0)), t;
      })(),
      o = (function () {
        function t() {
          (this._first = i.Undefined),
            (this._last = i.Undefined),
            (this._size = 0);
        }
        return (
          Object.defineProperty(t.prototype, "size", {
            get: function () {
              return this._size;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.isEmpty = function () {
            return this._first === i.Undefined;
          }),
          (t.prototype.clear = function () {
            (this._first = i.Undefined),
              (this._last = i.Undefined),
              (this._size = 0);
          }),
          (t.prototype.unshift = function (t) {
            return this._insert(t, !1);
          }),
          (t.prototype.push = function (t) {
            return this._insert(t, !0);
          }),
          (t.prototype._insert = function (t, e) {
            var n = this,
              r = new i(t);
            if (this._first === i.Undefined)
              (this._first = r), (this._last = r);
            else if (e) {
              var o = this._last;
              (this._last = r), (r.prev = o), (o.next = r);
            } else {
              var u = this._first;
              (this._first = r), (r.next = u), (u.prev = r);
            }
            this._size += 1;
            var s = !1;
            return function () {
              s || ((s = !0), n._remove(r));
            };
          }),
          (t.prototype.shift = function () {
            if (this._first !== i.Undefined) {
              var t = this._first.element;
              return this._remove(this._first), t;
            }
          }),
          (t.prototype._remove = function (t) {
            if (t.prev !== i.Undefined && t.next !== i.Undefined) {
              var e = t.prev;
              (e.next = t.next), (t.next.prev = e);
            } else
              t.prev === i.Undefined && t.next === i.Undefined
                ? ((this._first = i.Undefined), (this._last = i.Undefined))
                : t.next === i.Undefined
                ? ((this._last = this._last.prev),
                  (this._last.next = i.Undefined))
                : t.prev === i.Undefined &&
                  ((this._first = this._first.next),
                  (this._first.prev = i.Undefined));
            this._size -= 1;
          }),
          (t.prototype.iterator = function () {
            var t,
              e = this._first;
            return {
              next: function () {
                return e === i.Undefined
                  ? r.a
                  : (t
                      ? (t.value = e.element)
                      : (t = { done: !1, value: e.element }),
                    (e = e.next),
                    t);
              },
            };
          }),
          (t.prototype.toArray = function () {
            for (var t = [], e = this._first; e !== i.Undefined; e = e.next)
              t.push(e.element);
            return t;
          }),
          t
        );
      })();
  },
  ,
  function (t, e) {
    var n;
    n = (function () {
      return this;
    })();
    try {
      n = n || new Function("return this")();
    } catch (t) {
      "object" == typeof window && (n = window);
    }
    t.exports = n;
  },
  ,
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return s;
    });
    var r,
      i = n(0),
      o = Object.freeze(function (t, e) {
        var n = setTimeout(t.bind(e), 0);
        return {
          dispose: function () {
            clearTimeout(n);
          },
        };
      });
    !(function (t) {
      (t.isCancellationToken = function (e) {
        return (
          e === t.None ||
          e === t.Cancelled ||
          e instanceof u ||
          (!(!e || "object" != typeof e) &&
            "boolean" == typeof e.isCancellationRequested &&
            "function" == typeof e.onCancellationRequested)
        );
      }),
        (t.None = Object.freeze({
          isCancellationRequested: !1,
          onCancellationRequested: i.b.None,
        })),
        (t.Cancelled = Object.freeze({
          isCancellationRequested: !0,
          onCancellationRequested: o,
        }));
    })(r || (r = {}));
    var u = (function () {
        function t() {
          (this._isCancelled = !1), (this._emitter = null);
        }
        return (
          (t.prototype.cancel = function () {
            this._isCancelled ||
              ((this._isCancelled = !0),
              this._emitter && (this._emitter.fire(void 0), this.dispose()));
          }),
          Object.defineProperty(t.prototype, "isCancellationRequested", {
            get: function () {
              return this._isCancelled;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(t.prototype, "onCancellationRequested", {
            get: function () {
              return this._isCancelled
                ? o
                : (this._emitter || (this._emitter = new i.a()),
                  this._emitter.event);
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.dispose = function () {
            this._emitter && (this._emitter.dispose(), (this._emitter = null));
          }),
          t
        );
      })(),
      s = (function () {
        function t(t) {
          (this._token = void 0),
            (this._parentListener = void 0),
            (this._parentListener =
              t && t.onCancellationRequested(this.cancel, this));
        }
        return (
          Object.defineProperty(t.prototype, "token", {
            get: function () {
              return this._token || (this._token = new u()), this._token;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (t.prototype.cancel = function () {
            this._token
              ? this._token instanceof u && this._token.cancel()
              : (this._token = r.Cancelled);
          }),
          (t.prototype.dispose = function () {
            this._parentListener && this._parentListener.dispose(),
              this._token
                ? this._token instanceof u && this._token.dispose()
                : (this._token = r.None);
          }),
          t
        );
      })();
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return o;
    }),
      n.d(e, "b", function () {
        return u;
      });
    var r = n(11),
      i = function (t, e) {
        (this.index = t), (this.remainder = e);
      },
      o = (function () {
        function t(t) {
          (this.values = t),
            (this.prefixSum = new Uint32Array(t.length)),
            (this.prefixSumValidIndex = new Int32Array(1)),
            (this.prefixSumValidIndex[0] = -1);
        }
        return (
          (t.prototype.getCount = function () {
            return this.values.length;
          }),
          (t.prototype.insertValues = function (t, e) {
            t = Object(r.b)(t);
            var n = this.values,
              i = this.prefixSum,
              o = e.length;
            return (
              0 !== o &&
              ((this.values = new Uint32Array(n.length + o)),
              this.values.set(n.subarray(0, t), 0),
              this.values.set(n.subarray(t), t + o),
              this.values.set(e, t),
              t - 1 < this.prefixSumValidIndex[0] &&
                (this.prefixSumValidIndex[0] = t - 1),
              (this.prefixSum = new Uint32Array(this.values.length)),
              this.prefixSumValidIndex[0] >= 0 &&
                this.prefixSum.set(
                  i.subarray(0, this.prefixSumValidIndex[0] + 1)
                ),
              !0)
            );
          }),
          (t.prototype.changeValue = function (t, e) {
            return (
              (t = Object(r.b)(t)),
              (e = Object(r.b)(e)),
              this.values[t] !== e &&
                ((this.values[t] = e),
                t - 1 < this.prefixSumValidIndex[0] &&
                  (this.prefixSumValidIndex[0] = t - 1),
                !0)
            );
          }),
          (t.prototype.removeValues = function (t, e) {
            (t = Object(r.b)(t)), (e = Object(r.b)(e));
            var n = this.values,
              i = this.prefixSum;
            if (t >= n.length) return !1;
            var o = n.length - t;
            return (
              e >= o && (e = o),
              0 !== e &&
                ((this.values = new Uint32Array(n.length - e)),
                this.values.set(n.subarray(0, t), 0),
                this.values.set(n.subarray(t + e), t),
                (this.prefixSum = new Uint32Array(this.values.length)),
                t - 1 < this.prefixSumValidIndex[0] &&
                  (this.prefixSumValidIndex[0] = t - 1),
                this.prefixSumValidIndex[0] >= 0 &&
                  this.prefixSum.set(
                    i.subarray(0, this.prefixSumValidIndex[0] + 1)
                  ),
                !0)
            );
          }),
          (t.prototype.getTotalValue = function () {
            return 0 === this.values.length
              ? 0
              : this._getAccumulatedValue(this.values.length - 1);
          }),
          (t.prototype.getAccumulatedValue = function (t) {
            return t < 0
              ? 0
              : ((t = Object(r.b)(t)), this._getAccumulatedValue(t));
          }),
          (t.prototype._getAccumulatedValue = function (t) {
            if (t <= this.prefixSumValidIndex[0]) return this.prefixSum[t];
            var e = this.prefixSumValidIndex[0] + 1;
            0 === e && ((this.prefixSum[0] = this.values[0]), e++),
              t >= this.values.length && (t = this.values.length - 1);
            for (var n = e; n <= t; n++)
              this.prefixSum[n] = this.prefixSum[n - 1] + this.values[n];
            return (
              (this.prefixSumValidIndex[0] = Math.max(
                this.prefixSumValidIndex[0],
                t
              )),
              this.prefixSum[t]
            );
          }),
          (t.prototype.getIndexOf = function (t) {
            (t = Math.floor(t)), this.getTotalValue();
            for (
              var e = 0, n = this.values.length - 1, r = 0, o = 0, u = 0;
              e <= n;

            )
              if (
                ((r = (e + (n - e) / 2) | 0),
                t < (u = (o = this.prefixSum[r]) - this.values[r]))
              )
                n = r - 1;
              else {
                if (!(t >= o)) break;
                e = r + 1;
              }
            return new i(r, t - u);
          }),
          t
        );
      })(),
      u = (function () {
        function t(t) {
          (this._cacheAccumulatedValueStart = 0),
            (this._cache = null),
            (this._actual = new o(t)),
            this._bustCache();
        }
        return (
          (t.prototype._bustCache = function () {
            (this._cacheAccumulatedValueStart = 0), (this._cache = null);
          }),
          (t.prototype.insertValues = function (t, e) {
            this._actual.insertValues(t, e) && this._bustCache();
          }),
          (t.prototype.changeValue = function (t, e) {
            this._actual.changeValue(t, e) && this._bustCache();
          }),
          (t.prototype.removeValues = function (t, e) {
            this._actual.removeValues(t, e) && this._bustCache();
          }),
          (t.prototype.getTotalValue = function () {
            return this._actual.getTotalValue();
          }),
          (t.prototype.getAccumulatedValue = function (t) {
            return this._actual.getAccumulatedValue(t);
          }),
          (t.prototype.getIndexOf = function (t) {
            if (((t = Math.floor(t)), null !== this._cache)) {
              var e = t - this._cacheAccumulatedValueStart;
              if (e >= 0 && e < this._cache.length) return this._cache[e];
            }
            return this._actual.getIndexOf(t);
          }),
          (t.prototype.warmUpCache = function (t, e) {
            for (var n = [], r = t; r <= e; r++) n[r - t] = this.getIndexOf(r);
            (this._cache = n), (this._cacheAccumulatedValueStart = t);
          }),
          t
        );
      })();
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return i;
    });
    var r = n(11),
      i = (function () {
        function t(e) {
          var n = Object(r.d)(e);
          (this._defaultValue = n),
            (this._asciiMap = t._createAsciiMap(n)),
            (this._map = new Map());
        }
        return (
          (t._createAsciiMap = function (t) {
            for (var e = new Uint8Array(256), n = 0; n < 256; n++) e[n] = t;
            return e;
          }),
          (t.prototype.set = function (t, e) {
            var n = Object(r.d)(e);
            t >= 0 && t < 256 ? (this._asciiMap[t] = n) : this._map.set(t, n);
          }),
          (t.prototype.get = function (t) {
            return t >= 0 && t < 256
              ? this._asciiMap[t]
              : this._map.get(t) || this._defaultValue;
          }),
          t
        );
      })();
    !(function () {
      function t() {
        this._actual = new i(0);
      }
      (t.prototype.add = function (t) {
        this._actual.set(t, 1);
      }),
        (t.prototype.has = function (t) {
          return 1 === this._actual.get(t);
        });
    })();
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "c", function () {
      return f;
    }),
      n.d(e, "a", function () {
        return d;
      }),
      n.d(e, "b", function () {
        return m;
      });
    var r,
      i = n(7),
      o = n(2),
      u = n(5),
      s = n(6),
      a =
        ((r = function (t, e) {
          return (r =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(t, e);
        }),
        function (t, e) {
          function n() {
            this.constructor = t;
          }
          r(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((n.prototype = e.prototype), new n()));
        }),
      c = "$initialize",
      l = !1;
    function f(t) {
      u.f &&
        (l ||
          ((l = !0),
          console.warn(
            "Could not create web worker(s). Falling back to loading web worker code in main thread, which might cause UI freezes. Please see https://github.com/Microsoft/monaco-editor#faq"
          )),
        console.warn(t.message));
    }
    var h = (function () {
        function t(t) {
          (this._workerId = -1),
            (this._handler = t),
            (this._lastSentReq = 0),
            (this._pendingReplies = Object.create(null));
        }
        return (
          (t.prototype.setWorkerId = function (t) {
            this._workerId = t;
          }),
          (t.prototype.sendMessage = function (t, e) {
            var n = this,
              r = String(++this._lastSentReq);
            return new Promise(function (i, o) {
              (n._pendingReplies[r] = { resolve: i, reject: o }),
                n._send({ vsWorker: n._workerId, req: r, method: t, args: e });
            });
          }),
          (t.prototype.handleMessage = function (t) {
            var e;
            try {
              e = JSON.parse(t);
            } catch (t) {
              return;
            }
            e &&
              e.vsWorker &&
              ((-1 !== this._workerId && e.vsWorker !== this._workerId) ||
                this._handleMessage(e));
          }),
          (t.prototype._handleMessage = function (t) {
            var e = this;
            if (t.seq) {
              var n = t;
              if (!this._pendingReplies[n.seq])
                return void console.warn("Got reply to unknown seq");
              var r = this._pendingReplies[n.seq];
              if ((delete this._pendingReplies[n.seq], n.err)) {
                var o = n.err;
                return (
                  n.err.$isError &&
                    (((o = new Error()).name = n.err.name),
                    (o.message = n.err.message),
                    (o.stack = n.err.stack)),
                  void r.reject(o)
                );
              }
              r.resolve(n.res);
            } else {
              var u = t,
                s = u.req;
              this._handler.handleMessage(u.method, u.args).then(
                function (t) {
                  e._send({
                    vsWorker: e._workerId,
                    seq: s,
                    res: t,
                    err: void 0,
                  });
                },
                function (t) {
                  t.detail instanceof Error &&
                    (t.detail = Object(i.f)(t.detail)),
                    e._send({
                      vsWorker: e._workerId,
                      seq: s,
                      res: void 0,
                      err: Object(i.f)(t),
                    });
                }
              );
            }
          }),
          (t.prototype._send = function (t) {
            var e = JSON.stringify(t);
            this._handler.sendMessage(e);
          }),
          t
        );
      })(),
      d = (function (t) {
        function e(e, n) {
          var r = t.call(this) || this,
            i = null;
          (r._worker = r._register(
            e.create(
              "vs/base/common/worker/simpleWorker",
              function (t) {
                r._protocol.handleMessage(t);
              },
              function (t) {
                i && i(t);
              }
            )
          )),
            (r._protocol = new h({
              sendMessage: function (t) {
                r._worker.postMessage(t);
              },
              handleMessage: function (t, e) {
                return Promise.resolve(null);
              },
            })),
            r._protocol.setWorkerId(r._worker.getId());
          var o = null;
          void 0 !== self.require && "function" == typeof self.require.getConfig
            ? (o = self.require.getConfig())
            : void 0 !== self.requirejs &&
              (o = self.requirejs.s.contexts._.config),
            (r._onModuleLoaded = r._protocol.sendMessage(c, [
              r._worker.getId(),
              n,
              o,
            ])),
            (r._lazyProxy = new Promise(function (t, e) {
              (i = e),
                r._onModuleLoaded.then(
                  function (e) {
                    for (var n = {}, r = 0, i = e; r < i.length; r++) {
                      var o = i[r];
                      n[o] = s(o, u);
                    }
                    t(n);
                  },
                  function (t) {
                    e(t), r._onError("Worker failed to load " + n, t);
                  }
                );
            }));
          var u = function (t, e) {
              return r._request(t, e);
            },
            s = function (t, e) {
              return function () {
                var n = Array.prototype.slice.call(arguments, 0);
                return e(t, n);
              };
            };
          return r;
        }
        return (
          a(e, t),
          (e.prototype.getProxyObject = function () {
            return this._lazyProxy;
          }),
          (e.prototype._request = function (t, e) {
            var n = this;
            return new Promise(function (r, i) {
              n._onModuleLoaded.then(function () {
                n._protocol.sendMessage(t, e).then(r, i);
              }, i);
            });
          }),
          (e.prototype._onError = function (t, e) {
            console.error(t), console.info(e);
          }),
          e
        );
      })(o.a),
      m = (function () {
        function t(t, e) {
          var n = this;
          (this._requestHandler = e),
            (this._protocol = new h({
              sendMessage: function (e) {
                t(e);
              },
              handleMessage: function (t, e) {
                return n._handleMessage(t, e);
              },
            }));
        }
        return (
          (t.prototype.onmessage = function (t) {
            this._protocol.handleMessage(t);
          }),
          (t.prototype._handleMessage = function (t, e) {
            if (t === c) return this.initialize(e[0], e[1], e[2]);
            if (
              !this._requestHandler ||
              "function" != typeof this._requestHandler[t]
            )
              return Promise.reject(
                new Error("Missing requestHandler or method: " + t)
              );
            try {
              return Promise.resolve(
                this._requestHandler[t].apply(this._requestHandler, e)
              );
            } catch (t) {
              return Promise.reject(t);
            }
          }),
          (t.prototype.initialize = function (t, e, n) {
            var r = this;
            if ((this._protocol.setWorkerId(t), this._requestHandler)) {
              for (
                var i = [], o = 0, u = Object(s.a)(this._requestHandler);
                o < u.length;
                o++
              ) {
                var a = u[o];
                "function" == typeof this._requestHandler[a] && i.push(a);
              }
              return Promise.resolve(i);
            }
            return (
              n &&
                (void 0 !== n.baseUrl && delete n.baseUrl,
                void 0 !== n.paths &&
                  void 0 !== n.paths.vs &&
                  delete n.paths.vs,
                (n.catchError = !0),
                self.require.config(n)),
              new Promise(function (t, n) {
                self.require(
                  [e],
                  function () {
                    for (var e = [], i = 0; i < arguments.length; i++)
                      e[i] = arguments[i];
                    var o = e[0];
                    if (((r._requestHandler = o.create()), r._requestHandler)) {
                      for (
                        var u = [], a = 0, c = Object(s.a)(r._requestHandler);
                        a < c.length;
                        a++
                      ) {
                        var l = c[a];
                        "function" == typeof r._requestHandler[l] && u.push(l);
                      }
                      t(u);
                    } else n(new Error("No RequestHandler!"));
                  },
                  n
                );
              })
            );
          }),
          t
        );
      })();
  },
  ,
  function (t, e) {
    var n,
      r,
      i = (t.exports = {});
    function o() {
      throw new Error("setTimeout has not been defined");
    }
    function u() {
      throw new Error("clearTimeout has not been defined");
    }
    function s(t) {
      if (n === setTimeout) return setTimeout(t, 0);
      if ((n === o || !n) && setTimeout)
        return (n = setTimeout), setTimeout(t, 0);
      try {
        return n(t, 0);
      } catch (e) {
        try {
          return n.call(null, t, 0);
        } catch (e) {
          return n.call(this, t, 0);
        }
      }
    }
    !(function () {
      try {
        n = "function" == typeof setTimeout ? setTimeout : o;
      } catch (t) {
        n = o;
      }
      try {
        r = "function" == typeof clearTimeout ? clearTimeout : u;
      } catch (t) {
        r = u;
      }
    })();
    var a,
      c = [],
      l = !1,
      f = -1;
    function h() {
      l &&
        a &&
        ((l = !1), a.length ? (c = a.concat(c)) : (f = -1), c.length && d());
    }
    function d() {
      if (!l) {
        var t = s(h);
        l = !0;
        for (var e = c.length; e; ) {
          for (a = c, c = []; ++f < e; ) a && a[f].run();
          (f = -1), (e = c.length);
        }
        (a = null),
          (l = !1),
          (function (t) {
            if (r === clearTimeout) return clearTimeout(t);
            if ((r === u || !r) && clearTimeout)
              return (r = clearTimeout), clearTimeout(t);
            try {
              r(t);
            } catch (e) {
              try {
                return r.call(null, t);
              } catch (e) {
                return r.call(this, t);
              }
            }
          })(t);
      }
    }
    function m(t, e) {
      (this.fun = t), (this.array = e);
    }
    function p() {}
    (i.nextTick = function (t) {
      var e = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
      c.push(new m(t, e)), 1 !== c.length || l || s(d);
    }),
      (m.prototype.run = function () {
        this.fun.apply(null, this.array);
      }),
      (i.title = "browser"),
      (i.browser = !0),
      (i.env = {}),
      (i.argv = []),
      (i.version = ""),
      (i.versions = {}),
      (i.on = p),
      (i.addListener = p),
      (i.once = p),
      (i.off = p),
      (i.removeListener = p),
      (i.removeAllListeners = p),
      (i.emit = p),
      (i.prependListener = p),
      (i.prependOnceListener = p),
      (i.listeners = function (t) {
        return [];
      }),
      (i.binding = function (t) {
        throw new Error("process.binding is not supported");
      }),
      (i.cwd = function () {
        return "/";
      }),
      (i.chdir = function (t) {
        throw new Error("process.chdir is not supported");
      }),
      (i.umask = function () {
        return 0;
      });
  },
  function (t, e, n) {
    "use strict";
    n.d(e, "a", function () {
      return d;
    });
    n(46);
    var r = n(23),
      i = n(0),
      o = n(16),
      u = n(12),
      s = n(3),
      a = n(1),
      c = n(9),
      l = n(17),
      f = n(10),
      h = (function () {
        function t() {}
        return (
          (t.chord = function (t, e) {
            return Object(o.a)(t, e);
          }),
          (t.CtrlCmd = 2048),
          (t.Shift = 1024),
          (t.Alt = 512),
          (t.WinCtrl = 256),
          t
        );
      })();
    function d() {
      return {
        editor: void 0,
        languages: void 0,
        CancellationTokenSource: r.a,
        Emitter: i.a,
        KeyCode: f.k,
        KeyMod: h,
        Position: s.a,
        Range: a.a,
        Selection: c.a,
        SelectionDirection: f.u,
        MarkerSeverity: f.l,
        MarkerTag: f.m,
        Uri: u.a,
        Token: l.a,
      };
    }
  },
  function (t, e, n) {
    "use strict";
    var r = n(8),
      i = (function () {
        function t(t, e, n, r) {
          (this.originalStart = t),
            (this.originalLength = e),
            (this.modifiedStart = n),
            (this.modifiedLength = r);
        }
        return (
          (t.prototype.getOriginalEnd = function () {
            return this.originalStart + this.originalLength;
          }),
          (t.prototype.getModifiedEnd = function () {
            return this.modifiedStart + this.modifiedLength;
          }),
          t
        );
      })();
    function o(t) {
      return {
        getLength: function () {
          return t.length;
        },
        getElementAtIndex: function (e) {
          return t.charCodeAt(e);
        },
      };
    }
    function u(t, e, n) {
      return new l(o(t), o(e)).ComputeDiff(n);
    }
    var s = (function () {
        function t() {}
        return (
          (t.Assert = function (t, e) {
            if (!t) throw new Error(e);
          }),
          t
        );
      })(),
      a = (function () {
        function t() {}
        return (
          (t.Copy = function (t, e, n, r, i) {
            for (var o = 0; o < i; o++) n[r + o] = t[e + o];
          }),
          t
        );
      })(),
      c = (function () {
        function t() {
          (this.m_changes = []),
            (this.m_originalStart = Number.MAX_VALUE),
            (this.m_modifiedStart = Number.MAX_VALUE),
            (this.m_originalCount = 0),
            (this.m_modifiedCount = 0);
        }
        return (
          (t.prototype.MarkNextChange = function () {
            (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
              this.m_changes.push(
                new i(
                  this.m_originalStart,
                  this.m_originalCount,
                  this.m_modifiedStart,
                  this.m_modifiedCount
                )
              ),
              (this.m_originalCount = 0),
              (this.m_modifiedCount = 0),
              (this.m_originalStart = Number.MAX_VALUE),
              (this.m_modifiedStart = Number.MAX_VALUE);
          }),
          (t.prototype.AddOriginalElement = function (t, e) {
            (this.m_originalStart = Math.min(this.m_originalStart, t)),
              (this.m_modifiedStart = Math.min(this.m_modifiedStart, e)),
              this.m_originalCount++;
          }),
          (t.prototype.AddModifiedElement = function (t, e) {
            (this.m_originalStart = Math.min(this.m_originalStart, t)),
              (this.m_modifiedStart = Math.min(this.m_modifiedStart, e)),
              this.m_modifiedCount++;
          }),
          (t.prototype.getChanges = function () {
            return (
              (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
                this.MarkNextChange(),
              this.m_changes
            );
          }),
          (t.prototype.getReverseChanges = function () {
            return (
              (this.m_originalCount > 0 || this.m_modifiedCount > 0) &&
                this.MarkNextChange(),
              this.m_changes.reverse(),
              this.m_changes
            );
          }),
          t
        );
      })(),
      l = (function () {
        function t(t, e, n) {
          void 0 === n && (n = null),
            (this.OriginalSequence = t),
            (this.ModifiedSequence = e),
            (this.ContinueProcessingPredicate = n),
            (this.m_forwardHistory = []),
            (this.m_reverseHistory = []);
        }
        return (
          (t.prototype.ElementsAreEqual = function (t, e) {
            return (
              this.OriginalSequence.getElementAtIndex(t) ===
              this.ModifiedSequence.getElementAtIndex(e)
            );
          }),
          (t.prototype.OriginalElementsAreEqual = function (t, e) {
            return (
              this.OriginalSequence.getElementAtIndex(t) ===
              this.OriginalSequence.getElementAtIndex(e)
            );
          }),
          (t.prototype.ModifiedElementsAreEqual = function (t, e) {
            return (
              this.ModifiedSequence.getElementAtIndex(t) ===
              this.ModifiedSequence.getElementAtIndex(e)
            );
          }),
          (t.prototype.ComputeDiff = function (t) {
            return this._ComputeDiff(
              0,
              this.OriginalSequence.getLength() - 1,
              0,
              this.ModifiedSequence.getLength() - 1,
              t
            );
          }),
          (t.prototype._ComputeDiff = function (t, e, n, r, i) {
            var o = this.ComputeDiffRecursive(t, e, n, r, [!1]);
            return i ? this.PrettifyChanges(o) : o;
          }),
          (t.prototype.ComputeDiffRecursive = function (t, e, n, r, o) {
            for (o[0] = !1; t <= e && n <= r && this.ElementsAreEqual(t, n); )
              t++, n++;
            for (; e >= t && r >= n && this.ElementsAreEqual(e, r); ) e--, r--;
            if (t > e || n > r) {
              var u = void 0;
              return (
                n <= r
                  ? (s.Assert(
                      t === e + 1,
                      "originalStart should only be one more than originalEnd"
                    ),
                    (u = [new i(t, 0, n, r - n + 1)]))
                  : t <= e
                  ? (s.Assert(
                      n === r + 1,
                      "modifiedStart should only be one more than modifiedEnd"
                    ),
                    (u = [new i(t, e - t + 1, n, 0)]))
                  : (s.Assert(
                      t === e + 1,
                      "originalStart should only be one more than originalEnd"
                    ),
                    s.Assert(
                      n === r + 1,
                      "modifiedStart should only be one more than modifiedEnd"
                    ),
                    (u = [])),
                u
              );
            }
            var a = [0],
              c = [0],
              l = this.ComputeRecursionPoint(t, e, n, r, a, c, o),
              f = a[0],
              h = c[0];
            if (null !== l) return l;
            if (!o[0]) {
              var d = this.ComputeDiffRecursive(t, f, n, h, o),
                m = [];
              return (
                (m = o[0]
                  ? [new i(f + 1, e - (f + 1) + 1, h + 1, r - (h + 1) + 1)]
                  : this.ComputeDiffRecursive(f + 1, e, h + 1, r, o)),
                this.ConcatenateChanges(d, m)
              );
            }
            return [new i(t, e - t + 1, n, r - n + 1)];
          }),
          (t.prototype.WALKTRACE = function (
            t,
            e,
            n,
            r,
            o,
            u,
            s,
            a,
            l,
            f,
            h,
            d,
            m,
            p,
            g,
            _,
            v,
            y
          ) {
            var b,
              C,
              L = null,
              E = new c(),
              N = e,
              S = n,
              w = m[0] - _[0] - r,
              A = Number.MIN_VALUE,
              O = this.m_forwardHistory.length - 1;
            do {
              (C = w + t) === N || (C < S && l[C - 1] < l[C + 1])
                ? ((p = (h = l[C + 1]) - w - r),
                  h < A && E.MarkNextChange(),
                  (A = h),
                  E.AddModifiedElement(h + 1, p),
                  (w = C + 1 - t))
                : ((p = (h = l[C - 1] + 1) - w - r),
                  h < A && E.MarkNextChange(),
                  (A = h - 1),
                  E.AddOriginalElement(h, p + 1),
                  (w = C - 1 - t)),
                O >= 0 &&
                  ((t = (l = this.m_forwardHistory[O])[0]),
                  (N = 1),
                  (S = l.length - 1));
            } while (--O >= -1);
            if (((b = E.getReverseChanges()), y[0])) {
              var T = m[0] + 1,
                M = _[0] + 1;
              if (null !== b && b.length > 0) {
                var P = b[b.length - 1];
                (T = Math.max(T, P.getOriginalEnd())),
                  (M = Math.max(M, P.getModifiedEnd()));
              }
              L = [new i(T, d - T + 1, M, g - M + 1)];
            } else {
              (E = new c()),
                (N = u),
                (S = s),
                (w = m[0] - _[0] - a),
                (A = Number.MAX_VALUE),
                (O = v
                  ? this.m_reverseHistory.length - 1
                  : this.m_reverseHistory.length - 2);
              do {
                (C = w + o) === N || (C < S && f[C - 1] >= f[C + 1])
                  ? ((p = (h = f[C + 1] - 1) - w - a),
                    h > A && E.MarkNextChange(),
                    (A = h + 1),
                    E.AddOriginalElement(h + 1, p + 1),
                    (w = C + 1 - o))
                  : ((p = (h = f[C - 1]) - w - a),
                    h > A && E.MarkNextChange(),
                    (A = h),
                    E.AddModifiedElement(h + 1, p + 1),
                    (w = C - 1 - o)),
                  O >= 0 &&
                    ((o = (f = this.m_reverseHistory[O])[0]),
                    (N = 1),
                    (S = f.length - 1));
              } while (--O >= -1);
              L = E.getChanges();
            }
            return this.ConcatenateChanges(b, L);
          }),
          (t.prototype.ComputeRecursionPoint = function (t, e, n, r, o, u, s) {
            var c,
              l = 0,
              f = 0,
              h = 0,
              d = 0,
              m = 0,
              p = 0;
            t--,
              n--,
              (o[0] = 0),
              (u[0] = 0),
              (this.m_forwardHistory = []),
              (this.m_reverseHistory = []);
            var g,
              _,
              v = e - t + (r - n),
              y = v + 1,
              b = new Array(y),
              C = new Array(y),
              L = r - n,
              E = e - t,
              N = t - n,
              S = e - r,
              w = (E - L) % 2 == 0;
            for (b[L] = t, C[E] = e, s[0] = !1, c = 1; c <= v / 2 + 1; c++) {
              var A = 0,
                O = 0;
              for (
                h = this.ClipDiagonalBound(L - c, c, L, y),
                  d = this.ClipDiagonalBound(L + c, c, L, y),
                  g = h;
                g <= d;
                g += 2
              ) {
                for (
                  f =
                    (l =
                      g === h || (g < d && b[g - 1] < b[g + 1])
                        ? b[g + 1]
                        : b[g - 1] + 1) -
                    (g - L) -
                    N,
                    _ = l;
                  l < e && f < r && this.ElementsAreEqual(l + 1, f + 1);

                )
                  l++, f++;
                if (
                  ((b[g] = l),
                  l + f > A + O && ((A = l), (O = f)),
                  !w && Math.abs(g - E) <= c - 1 && l >= C[g])
                )
                  return (
                    (o[0] = l),
                    (u[0] = f),
                    _ <= C[g] && c <= 1448
                      ? this.WALKTRACE(
                          L,
                          h,
                          d,
                          N,
                          E,
                          m,
                          p,
                          S,
                          b,
                          C,
                          l,
                          e,
                          o,
                          f,
                          r,
                          u,
                          w,
                          s
                        )
                      : null
                  );
              }
              var T = (A - t + (O - n) - c) / 2;
              if (
                null !== this.ContinueProcessingPredicate &&
                !this.ContinueProcessingPredicate(A, this.OriginalSequence, T)
              )
                return (
                  (s[0] = !0),
                  (o[0] = A),
                  (u[0] = O),
                  T > 0 && c <= 1448
                    ? this.WALKTRACE(
                        L,
                        h,
                        d,
                        N,
                        E,
                        m,
                        p,
                        S,
                        b,
                        C,
                        l,
                        e,
                        o,
                        f,
                        r,
                        u,
                        w,
                        s
                      )
                    : [new i(++t, e - t + 1, ++n, r - n + 1)]
                );
              for (
                m = this.ClipDiagonalBound(E - c, c, E, y),
                  p = this.ClipDiagonalBound(E + c, c, E, y),
                  g = m;
                g <= p;
                g += 2
              ) {
                for (
                  f =
                    (l =
                      g === m || (g < p && C[g - 1] >= C[g + 1])
                        ? C[g + 1] - 1
                        : C[g - 1]) -
                    (g - E) -
                    S,
                    _ = l;
                  l > t && f > n && this.ElementsAreEqual(l, f);

                )
                  l--, f--;
                if (((C[g] = l), w && Math.abs(g - L) <= c && l <= b[g]))
                  return (
                    (o[0] = l),
                    (u[0] = f),
                    _ >= b[g] && c <= 1448
                      ? this.WALKTRACE(
                          L,
                          h,
                          d,
                          N,
                          E,
                          m,
                          p,
                          S,
                          b,
                          C,
                          l,
                          e,
                          o,
                          f,
                          r,
                          u,
                          w,
                          s
                        )
                      : null
                  );
              }
              if (c <= 1447) {
                var M = new Array(d - h + 2);
                (M[0] = L - h + 1),
                  a.Copy(b, h, M, 1, d - h + 1),
                  this.m_forwardHistory.push(M),
                  ((M = new Array(p - m + 2))[0] = E - m + 1),
                  a.Copy(C, m, M, 1, p - m + 1),
                  this.m_reverseHistory.push(M);
              }
            }
            return this.WALKTRACE(
              L,
              h,
              d,
              N,
              E,
              m,
              p,
              S,
              b,
              C,
              l,
              e,
              o,
              f,
              r,
              u,
              w,
              s
            );
          }),
          (t.prototype.PrettifyChanges = function (t) {
            for (var e = 0; e < t.length; e++) {
              for (
                var n = t[e],
                  r =
                    e < t.length - 1
                      ? t[e + 1].originalStart
                      : this.OriginalSequence.getLength(),
                  i =
                    e < t.length - 1
                      ? t[e + 1].modifiedStart
                      : this.ModifiedSequence.getLength(),
                  o = n.originalLength > 0,
                  u = n.modifiedLength > 0;
                n.originalStart + n.originalLength < r &&
                n.modifiedStart + n.modifiedLength < i &&
                (!o ||
                  this.OriginalElementsAreEqual(
                    n.originalStart,
                    n.originalStart + n.originalLength
                  )) &&
                (!u ||
                  this.ModifiedElementsAreEqual(
                    n.modifiedStart,
                    n.modifiedStart + n.modifiedLength
                  ));

              )
                n.originalStart++, n.modifiedStart++;
              var s = [null];
              e < t.length - 1 &&
                this.ChangesOverlap(t[e], t[e + 1], s) &&
                ((t[e] = s[0]), t.splice(e + 1, 1), e--);
            }
            for (e = t.length - 1; e >= 0; e--) {
              (n = t[e]), (r = 0), (i = 0);
              if (e > 0) {
                var a = t[e - 1];
                a.originalLength > 0 &&
                  (r = a.originalStart + a.originalLength),
                  a.modifiedLength > 0 &&
                    (i = a.modifiedStart + a.modifiedLength);
              }
              (o = n.originalLength > 0), (u = n.modifiedLength > 0);
              for (
                var c = 0,
                  l = this._boundaryScore(
                    n.originalStart,
                    n.originalLength,
                    n.modifiedStart,
                    n.modifiedLength
                  ),
                  f = 1;
                ;
                f++
              ) {
                var h = n.originalStart - f,
                  d = n.modifiedStart - f;
                if (h < r || d < i) break;
                if (
                  o &&
                  !this.OriginalElementsAreEqual(h, h + n.originalLength)
                )
                  break;
                if (
                  u &&
                  !this.ModifiedElementsAreEqual(d, d + n.modifiedLength)
                )
                  break;
                var m = this._boundaryScore(
                  h,
                  n.originalLength,
                  d,
                  n.modifiedLength
                );
                m > l && ((l = m), (c = f));
              }
              (n.originalStart -= c), (n.modifiedStart -= c);
            }
            return t;
          }),
          (t.prototype._OriginalIsBoundary = function (t) {
            if (t <= 0 || t >= this.OriginalSequence.getLength() - 1) return !0;
            var e = this.OriginalSequence.getElementAtIndex(t);
            return "string" == typeof e && /^\s*$/.test(e);
          }),
          (t.prototype._OriginalRegionIsBoundary = function (t, e) {
            if (this._OriginalIsBoundary(t) || this._OriginalIsBoundary(t - 1))
              return !0;
            if (e > 0) {
              var n = t + e;
              if (
                this._OriginalIsBoundary(n - 1) ||
                this._OriginalIsBoundary(n)
              )
                return !0;
            }
            return !1;
          }),
          (t.prototype._ModifiedIsBoundary = function (t) {
            if (t <= 0 || t >= this.ModifiedSequence.getLength() - 1) return !0;
            var e = this.ModifiedSequence.getElementAtIndex(t);
            return "string" == typeof e && /^\s*$/.test(e);
          }),
          (t.prototype._ModifiedRegionIsBoundary = function (t, e) {
            if (this._ModifiedIsBoundary(t) || this._ModifiedIsBoundary(t - 1))
              return !0;
            if (e > 0) {
              var n = t + e;
              if (
                this._ModifiedIsBoundary(n - 1) ||
                this._ModifiedIsBoundary(n)
              )
                return !0;
            }
            return !1;
          }),
          (t.prototype._boundaryScore = function (t, e, n, r) {
            return (
              (this._OriginalRegionIsBoundary(t, e) ? 1 : 0) +
              (this._ModifiedRegionIsBoundary(n, r) ? 1 : 0)
            );
          }),
          (t.prototype.ConcatenateChanges = function (t, e) {
            var n = [];
            if (0 === t.length || 0 === e.length) return e.length > 0 ? e : t;
            if (this.ChangesOverlap(t[t.length - 1], e[0], n)) {
              var r = new Array(t.length + e.length - 1);
              return (
                a.Copy(t, 0, r, 0, t.length - 1),
                (r[t.length - 1] = n[0]),
                a.Copy(e, 1, r, t.length, e.length - 1),
                r
              );
            }
            r = new Array(t.length + e.length);
            return (
              a.Copy(t, 0, r, 0, t.length),
              a.Copy(e, 0, r, t.length, e.length),
              r
            );
          }),
          (t.prototype.ChangesOverlap = function (t, e, n) {
            if (
              (s.Assert(
                t.originalStart <= e.originalStart,
                "Left change is not less than or equal to right change"
              ),
              s.Assert(
                t.modifiedStart <= e.modifiedStart,
                "Left change is not less than or equal to right change"
              ),
              t.originalStart + t.originalLength >= e.originalStart ||
                t.modifiedStart + t.modifiedLength >= e.modifiedStart)
            ) {
              var r = t.originalStart,
                o = t.originalLength,
                u = t.modifiedStart,
                a = t.modifiedLength;
              return (
                t.originalStart + t.originalLength >= e.originalStart &&
                  (o = e.originalStart + e.originalLength - t.originalStart),
                t.modifiedStart + t.modifiedLength >= e.modifiedStart &&
                  (a = e.modifiedStart + e.modifiedLength - t.modifiedStart),
                (n[0] = new i(r, o, u, a)),
                !0
              );
            }
            return (n[0] = null), !1;
          }),
          (t.prototype.ClipDiagonalBound = function (t, e, n, r) {
            if (t >= 0 && t < r) return t;
            var i = e % 2 == 0;
            return t < 0
              ? i === (n % 2 == 0)
                ? 0
                : 1
              : i === ((r - n - 1) % 2 == 0)
              ? r - 1
              : r - 2;
          }),
          t
        );
      })(),
      f = n(13),
      h = n(5),
      d = n(12),
      m = n(3),
      p = n(1),
      g = n(4),
      _ = 5e3,
      v = 3;
    function y(t, e, n, r) {
      return new l(t, e, n).ComputeDiff(r);
    }
    var b = (function () {
        function t(e) {
          for (var n = [], r = [], i = 0, o = e.length; i < o; i++)
            (n[i] = t._getFirstNonBlankColumn(e[i], 1)),
              (r[i] = t._getLastNonBlankColumn(e[i], 1));
          (this._lines = e), (this._startColumns = n), (this._endColumns = r);
        }
        return (
          (t.prototype.getLength = function () {
            return this._lines.length;
          }),
          (t.prototype.getElementAtIndex = function (t) {
            return this._lines[t].substring(
              this._startColumns[t] - 1,
              this._endColumns[t] - 1
            );
          }),
          (t.prototype.getStartLineNumber = function (t) {
            return t + 1;
          }),
          (t.prototype.getEndLineNumber = function (t) {
            return t + 1;
          }),
          (t._getFirstNonBlankColumn = function (t, e) {
            var n = g.n(t);
            return -1 === n ? e : n + 1;
          }),
          (t._getLastNonBlankColumn = function (t, e) {
            var n = g.x(t);
            return -1 === n ? e : n + 2;
          }),
          (t.prototype.getCharSequence = function (t, e, n) {
            for (var r = [], i = [], o = [], u = 0, s = e; s <= n; s++)
              for (
                var a = this._lines[s],
                  c = t ? this._startColumns[s] : 1,
                  l = t ? this._endColumns[s] : a.length + 1,
                  f = c;
                f < l;
                f++
              )
                (r[u] = a.charCodeAt(f - 1)), (i[u] = s + 1), (o[u] = f), u++;
            return new C(r, i, o);
          }),
          t
        );
      })(),
      C = (function () {
        function t(t, e, n) {
          (this._charCodes = t), (this._lineNumbers = e), (this._columns = n);
        }
        return (
          (t.prototype.getLength = function () {
            return this._charCodes.length;
          }),
          (t.prototype.getElementAtIndex = function (t) {
            return this._charCodes[t];
          }),
          (t.prototype.getStartLineNumber = function (t) {
            return this._lineNumbers[t];
          }),
          (t.prototype.getStartColumn = function (t) {
            return this._columns[t];
          }),
          (t.prototype.getEndLineNumber = function (t) {
            return this._lineNumbers[t];
          }),
          (t.prototype.getEndColumn = function (t) {
            return this._columns[t] + 1;
          }),
          t
        );
      })(),
      L = (function () {
        function t(t, e, n, r, i, o, u, s) {
          (this.originalStartLineNumber = t),
            (this.originalStartColumn = e),
            (this.originalEndLineNumber = n),
            (this.originalEndColumn = r),
            (this.modifiedStartLineNumber = i),
            (this.modifiedStartColumn = o),
            (this.modifiedEndLineNumber = u),
            (this.modifiedEndColumn = s);
        }
        return (
          (t.createFromDiffChange = function (e, n, r) {
            var i, o, u, s, a, c, l, f;
            return (
              0 === e.originalLength
                ? ((i = 0), (o = 0), (u = 0), (s = 0))
                : ((i = n.getStartLineNumber(e.originalStart)),
                  (o = n.getStartColumn(e.originalStart)),
                  (u = n.getEndLineNumber(
                    e.originalStart + e.originalLength - 1
                  )),
                  (s = n.getEndColumn(e.originalStart + e.originalLength - 1))),
              0 === e.modifiedLength
                ? ((a = 0), (c = 0), (l = 0), (f = 0))
                : ((a = r.getStartLineNumber(e.modifiedStart)),
                  (c = r.getStartColumn(e.modifiedStart)),
                  (l = r.getEndLineNumber(
                    e.modifiedStart + e.modifiedLength - 1
                  )),
                  (f = r.getEndColumn(e.modifiedStart + e.modifiedLength - 1))),
              new t(i, o, u, s, a, c, l, f)
            );
          }),
          t
        );
      })();
    var E = (function () {
        function t(t, e, n, r, i) {
          (this.originalStartLineNumber = t),
            (this.originalEndLineNumber = e),
            (this.modifiedStartLineNumber = n),
            (this.modifiedEndLineNumber = r),
            (this.charChanges = i);
        }
        return (
          (t.createFromDiffResult = function (e, n, r, i, o, u, s) {
            var a,
              c,
              l,
              f,
              h = void 0;
            if (
              (0 === n.originalLength
                ? ((a = r.getStartLineNumber(n.originalStart) - 1), (c = 0))
                : ((a = r.getStartLineNumber(n.originalStart)),
                  (c = r.getEndLineNumber(
                    n.originalStart + n.originalLength - 1
                  ))),
              0 === n.modifiedLength
                ? ((l = i.getStartLineNumber(n.modifiedStart) - 1), (f = 0))
                : ((l = i.getStartLineNumber(n.modifiedStart)),
                  (f = i.getEndLineNumber(
                    n.modifiedStart + n.modifiedLength - 1
                  ))),
              u && 0 !== n.originalLength && 0 !== n.modifiedLength && o())
            ) {
              var d = r.getCharSequence(
                  e,
                  n.originalStart,
                  n.originalStart + n.originalLength - 1
                ),
                m = i.getCharSequence(
                  e,
                  n.modifiedStart,
                  n.modifiedStart + n.modifiedLength - 1
                ),
                p = y(d, m, o, !0);
              s &&
                (p = (function (t) {
                  if (t.length <= 1) return t;
                  for (
                    var e = [t[0]], n = e[0], r = 1, i = t.length;
                    r < i;
                    r++
                  ) {
                    var o = t[r],
                      u =
                        o.originalStart - (n.originalStart + n.originalLength),
                      s =
                        o.modifiedStart - (n.modifiedStart + n.modifiedLength);
                    Math.min(u, s) < v
                      ? ((n.originalLength =
                          o.originalStart + o.originalLength - n.originalStart),
                        (n.modifiedLength =
                          o.modifiedStart + o.modifiedLength - n.modifiedStart))
                      : (e.push(o), (n = o));
                  }
                  return e;
                })(p)),
                (h = []);
              for (var g = 0, _ = p.length; g < _; g++)
                h.push(L.createFromDiffChange(p[g], d, m));
            }
            return new t(a, c, l, f, h);
          }),
          t
        );
      })(),
      N = (function () {
        function t(t, e, n) {
          (this.shouldComputeCharChanges = n.shouldComputeCharChanges),
            (this.shouldPostProcessCharChanges =
              n.shouldPostProcessCharChanges),
            (this.shouldIgnoreTrimWhitespace = n.shouldIgnoreTrimWhitespace),
            (this.shouldMakePrettyDiff = n.shouldMakePrettyDiff),
            (this.maximumRunTimeMs = _),
            (this.originalLines = t),
            (this.modifiedLines = e),
            (this.original = new b(t)),
            (this.modified = new b(e));
        }
        return (
          (t.prototype.computeDiff = function () {
            if (
              1 === this.original.getLength() &&
              0 === this.original.getElementAtIndex(0).length
            )
              return [
                {
                  originalStartLineNumber: 1,
                  originalEndLineNumber: 1,
                  modifiedStartLineNumber: 1,
                  modifiedEndLineNumber: this.modified.getLength(),
                  charChanges: [
                    {
                      modifiedEndColumn: 0,
                      modifiedEndLineNumber: 0,
                      modifiedStartColumn: 0,
                      modifiedStartLineNumber: 0,
                      originalEndColumn: 0,
                      originalEndLineNumber: 0,
                      originalStartColumn: 0,
                      originalStartLineNumber: 0,
                    },
                  ],
                },
              ];
            if (
              1 === this.modified.getLength() &&
              0 === this.modified.getElementAtIndex(0).length
            )
              return [
                {
                  originalStartLineNumber: 1,
                  originalEndLineNumber: this.original.getLength(),
                  modifiedStartLineNumber: 1,
                  modifiedEndLineNumber: 1,
                  charChanges: [
                    {
                      modifiedEndColumn: 0,
                      modifiedEndLineNumber: 0,
                      modifiedStartColumn: 0,
                      modifiedStartLineNumber: 0,
                      originalEndColumn: 0,
                      originalEndLineNumber: 0,
                      originalStartColumn: 0,
                      originalStartLineNumber: 0,
                    },
                  ],
                },
              ];
            this.computationStartTime = new Date().getTime();
            var t = y(
              this.original,
              this.modified,
              this._continueProcessingPredicate.bind(this),
              this.shouldMakePrettyDiff
            );
            if (this.shouldIgnoreTrimWhitespace) {
              for (var e = [], n = 0, r = t.length; n < r; n++)
                e.push(
                  E.createFromDiffResult(
                    this.shouldIgnoreTrimWhitespace,
                    t[n],
                    this.original,
                    this.modified,
                    this._continueProcessingPredicate.bind(this),
                    this.shouldComputeCharChanges,
                    this.shouldPostProcessCharChanges
                  )
                );
              return e;
            }
            for (
              var i = [], o = 0, u = 0, s = ((n = -1), t.length);
              n < s;
              n++
            ) {
              for (
                var a = n + 1 < s ? t[n + 1] : null,
                  c = a ? a.originalStart : this.originalLines.length,
                  l = a ? a.modifiedStart : this.modifiedLines.length;
                o < c && u < l;

              ) {
                var f = this.originalLines[o],
                  h = this.modifiedLines[u];
                if (f !== h) {
                  for (
                    var d = b._getFirstNonBlankColumn(f, 1),
                      m = b._getFirstNonBlankColumn(h, 1);
                    d > 1 && m > 1;

                  ) {
                    if (f.charCodeAt(d - 2) !== h.charCodeAt(m - 2)) break;
                    d--, m--;
                  }
                  (d > 1 || m > 1) &&
                    this._pushTrimWhitespaceCharChange(
                      i,
                      o + 1,
                      1,
                      d,
                      u + 1,
                      1,
                      m
                    );
                  for (
                    var p = b._getLastNonBlankColumn(f, 1),
                      g = b._getLastNonBlankColumn(h, 1),
                      _ = f.length + 1,
                      v = h.length + 1;
                    p < _ && g < v;

                  ) {
                    if (f.charCodeAt(p - 1) !== f.charCodeAt(g - 1)) break;
                    p++, g++;
                  }
                  (p < _ || g < v) &&
                    this._pushTrimWhitespaceCharChange(
                      i,
                      o + 1,
                      p,
                      _,
                      u + 1,
                      g,
                      v
                    );
                }
                o++, u++;
              }
              a &&
                (i.push(
                  E.createFromDiffResult(
                    this.shouldIgnoreTrimWhitespace,
                    a,
                    this.original,
                    this.modified,
                    this._continueProcessingPredicate.bind(this),
                    this.shouldComputeCharChanges,
                    this.shouldPostProcessCharChanges
                  )
                ),
                (o += a.originalLength),
                (u += a.modifiedLength));
            }
            return i;
          }),
          (t.prototype._pushTrimWhitespaceCharChange = function (
            t,
            e,
            n,
            r,
            i,
            o,
            u
          ) {
            if (!this._mergeTrimWhitespaceCharChange(t, e, n, r, i, o, u)) {
              var s = void 0;
              this.shouldComputeCharChanges &&
                (s = [new L(e, n, e, r, i, o, i, u)]),
                t.push(new E(e, e, i, i, s));
            }
          }),
          (t.prototype._mergeTrimWhitespaceCharChange = function (
            t,
            e,
            n,
            r,
            i,
            o,
            u
          ) {
            var s = t.length;
            if (0 === s) return !1;
            var a = t[s - 1];
            return (
              0 !== a.originalEndLineNumber &&
              0 !== a.modifiedEndLineNumber &&
              a.originalEndLineNumber + 1 === e &&
              a.modifiedEndLineNumber + 1 === i &&
              ((a.originalEndLineNumber = e),
              (a.modifiedEndLineNumber = i),
              this.shouldComputeCharChanges &&
                a.charChanges.push(new L(e, n, e, r, i, o, i, u)),
              !0)
            );
          }),
          (t.prototype._continueProcessingPredicate = function () {
            return (
              0 === this.maximumRunTimeMs ||
              new Date().getTime() - this.computationStartTime <
                this.maximumRunTimeMs
            );
          }),
          t
        );
      })(),
      S = n(24),
      w = (function () {
        function t(t, e, n, r) {
          (this._uri = t),
            (this._lines = e),
            (this._eol = n),
            (this._versionId = r),
            (this._lineStarts = null);
        }
        return (
          (t.prototype.dispose = function () {
            this._lines.length = 0;
          }),
          (t.prototype.getText = function () {
            return this._lines.join(this._eol);
          }),
          (t.prototype.onEvents = function (t) {
            t.eol &&
              t.eol !== this._eol &&
              ((this._eol = t.eol), (this._lineStarts = null));
            for (var e = 0, n = t.changes; e < n.length; e++) {
              var r = n[e];
              this._acceptDeleteRange(r.range),
                this._acceptInsertText(
                  new m.a(r.range.startLineNumber, r.range.startColumn),
                  r.text
                );
            }
            this._versionId = t.versionId;
          }),
          (t.prototype._ensureLineStarts = function () {
            if (!this._lineStarts) {
              for (
                var t = this._eol.length,
                  e = this._lines.length,
                  n = new Uint32Array(e),
                  r = 0;
                r < e;
                r++
              )
                n[r] = this._lines[r].length + t;
              this._lineStarts = new S.a(n);
            }
          }),
          (t.prototype._setLineText = function (t, e) {
            (this._lines[t] = e),
              this._lineStarts &&
                this._lineStarts.changeValue(
                  t,
                  this._lines[t].length + this._eol.length
                );
          }),
          (t.prototype._acceptDeleteRange = function (t) {
            if (t.startLineNumber !== t.endLineNumber)
              this._setLineText(
                t.startLineNumber - 1,
                this._lines[t.startLineNumber - 1].substring(
                  0,
                  t.startColumn - 1
                ) + this._lines[t.endLineNumber - 1].substring(t.endColumn - 1)
              ),
                this._lines.splice(
                  t.startLineNumber,
                  t.endLineNumber - t.startLineNumber
                ),
                this._lineStarts &&
                  this._lineStarts.removeValues(
                    t.startLineNumber,
                    t.endLineNumber - t.startLineNumber
                  );
            else {
              if (t.startColumn === t.endColumn) return;
              this._setLineText(
                t.startLineNumber - 1,
                this._lines[t.startLineNumber - 1].substring(
                  0,
                  t.startColumn - 1
                ) +
                  this._lines[t.startLineNumber - 1].substring(t.endColumn - 1)
              );
            }
          }),
          (t.prototype._acceptInsertText = function (t, e) {
            if (0 !== e.length) {
              var n = e.split(/\r\n|\r|\n/);
              if (1 !== n.length) {
                (n[n.length - 1] += this._lines[t.lineNumber - 1].substring(
                  t.column - 1
                )),
                  this._setLineText(
                    t.lineNumber - 1,
                    this._lines[t.lineNumber - 1].substring(0, t.column - 1) +
                      n[0]
                  );
                for (
                  var r = new Uint32Array(n.length - 1), i = 1;
                  i < n.length;
                  i++
                )
                  this._lines.splice(t.lineNumber + i - 1, 0, n[i]),
                    (r[i - 1] = n[i].length + this._eol.length);
                this._lineStarts &&
                  this._lineStarts.insertValues(t.lineNumber, r);
              } else
                this._setLineText(
                  t.lineNumber - 1,
                  this._lines[t.lineNumber - 1].substring(0, t.column - 1) +
                    n[0] +
                    this._lines[t.lineNumber - 1].substring(t.column - 1)
                );
            }
          }),
          t
        );
      })(),
      A = n(18),
      O = n(25),
      T = n(11),
      M = (function () {
        function t(t) {
          for (var e = 0, n = 0, r = 0, i = t.length; r < i; r++) {
            var o = t[r],
              u = o[0];
            (c = o[1]) > e && (e = c),
              u > n && (n = u),
              (l = o[2]) > n && (n = l);
          }
          e++, n++;
          var s = new T.a(n, e, 0);
          for (r = 0, i = t.length; r < i; r++) {
            var a = t[r],
              c = ((u = a[0]), a[1]),
              l = a[2];
            s.set(u, c, l);
          }
          (this._states = s), (this._maxCharCode = e);
        }
        return (
          (t.prototype.nextState = function (t, e) {
            return e < 0 || e >= this._maxCharCode ? 0 : this._states.get(t, e);
          }),
          t
        );
      })(),
      P = null;
    var x = null;
    var I = (function () {
      function t() {}
      return (
        (t._createLink = function (t, e, n, r, i) {
          var o = i - 1;
          do {
            var u = e.charCodeAt(o);
            if (2 !== t.get(u)) break;
            o--;
          } while (o > r);
          if (r > 0) {
            var s = e.charCodeAt(r - 1),
              a = e.charCodeAt(o);
            ((40 === s && 41 === a) ||
              (91 === s && 93 === a) ||
              (123 === s && 125 === a)) &&
              o--;
          }
          return {
            range: {
              startLineNumber: n,
              startColumn: r + 1,
              endLineNumber: n,
              endColumn: o + 2,
            },
            url: e.substring(r, o + 1),
          };
        }),
        (t.computeLinks = function (e, n) {
          void 0 === n &&
            (null === P &&
              (P = new M([
                [1, 104, 2],
                [1, 72, 2],
                [1, 102, 6],
                [1, 70, 6],
                [2, 116, 3],
                [2, 84, 3],
                [3, 116, 4],
                [3, 84, 4],
                [4, 112, 5],
                [4, 80, 5],
                [5, 115, 9],
                [5, 83, 9],
                [5, 58, 10],
                [6, 105, 7],
                [6, 73, 7],
                [7, 108, 8],
                [7, 76, 8],
                [8, 101, 9],
                [8, 69, 9],
                [9, 58, 10],
                [10, 47, 11],
                [11, 47, 12],
              ])),
            (n = P));
          for (
            var r = (function () {
                if (null === x) {
                  x = new O.a(0);
                  for (
                    var t = 0;
                    t <
                    " \t<>'\"、。｡､，．：；？！＠＃＄％＆＊‘“〈《「『【〔（［｛｢｣｝］）〕】』」》〉”’｀～…"
                      .length;
                    t++
                  )
                    x.set(
                      " \t<>'\"、。｡､，．：；？！＠＃＄％＆＊‘“〈《「『【〔（［｛｢｣｝］）〕】』」》〉”’｀～…".charCodeAt(
                        t
                      ),
                      1
                    );
                  for (t = 0; t < ".,;".length; t++)
                    x.set(".,;".charCodeAt(t), 2);
                }
                return x;
              })(),
              i = [],
              o = 1,
              u = e.getLineCount();
            o <= u;
            o++
          ) {
            for (
              var s = e.getLineContent(o),
                a = s.length,
                c = 0,
                l = 0,
                f = 0,
                h = 1,
                d = !1,
                m = !1,
                p = !1;
              c < a;

            ) {
              var g = !1,
                _ = s.charCodeAt(c);
              if (13 === h) {
                var v = void 0;
                switch (_) {
                  case 40:
                    (d = !0), (v = 0);
                    break;
                  case 41:
                    v = d ? 0 : 1;
                    break;
                  case 91:
                    (m = !0), (v = 0);
                    break;
                  case 93:
                    v = m ? 0 : 1;
                    break;
                  case 123:
                    (p = !0), (v = 0);
                    break;
                  case 125:
                    v = p ? 0 : 1;
                    break;
                  case 39:
                    v = 34 === f || 96 === f ? 0 : 1;
                    break;
                  case 34:
                    v = 39 === f || 96 === f ? 0 : 1;
                    break;
                  case 96:
                    v = 39 === f || 34 === f ? 0 : 1;
                    break;
                  default:
                    v = r.get(_);
                }
                1 === v && (i.push(t._createLink(r, s, o, l, c)), (g = !0));
              } else if (12 === h) {
                v = void 0;
                91 === _ ? ((m = !0), (v = 0)) : (v = r.get(_)),
                  1 === v ? (g = !0) : (h = 13);
              } else 0 === (h = n.nextState(h, _)) && (g = !0);
              g &&
                ((h = 1), (d = !1), (m = !1), (p = !1), (l = c + 1), (f = _)),
                c++;
            }
            13 === h && i.push(t._createLink(r, s, o, l, a));
          }
          return i;
        }),
        t
      );
    })();
    var R = (function () {
        function t() {
          this._defaultValueSet = [
            ["true", "false"],
            ["True", "False"],
            [
              "Private",
              "Public",
              "Friend",
              "ReadOnly",
              "Partial",
              "Protected",
              "WriteOnly",
            ],
            ["public", "protected", "private"],
          ];
        }
        return (
          (t.prototype.navigateValueSet = function (t, e, n, r, i) {
            var o;
            if (t && e && (o = this.doNavigateValueSet(e, i)))
              return { range: t, value: o };
            if (n && r && (o = this.doNavigateValueSet(r, i)))
              return { range: n, value: o };
            return null;
          }),
          (t.prototype.doNavigateValueSet = function (t, e) {
            var n = this.numberReplace(t, e);
            return null !== n ? n : this.textReplace(t, e);
          }),
          (t.prototype.numberReplace = function (t, e) {
            var n = Math.pow(10, t.length - (t.lastIndexOf(".") + 1)),
              r = Number(t),
              i = parseFloat(t);
            return isNaN(r) || isNaN(i) || r !== i
              ? null
              : 0 !== r || e
              ? ((r = Math.floor(r * n)), (r += e ? n : -n), String(r / n))
              : null;
          }),
          (t.prototype.textReplace = function (t, e) {
            return this.valueSetsReplace(this._defaultValueSet, t, e);
          }),
          (t.prototype.valueSetsReplace = function (t, e, n) {
            for (var r = null, i = 0, o = t.length; null === r && i < o; i++)
              r = this.valueSetReplace(t[i], e, n);
            return r;
          }),
          (t.prototype.valueSetReplace = function (t, e, n) {
            var r = t.indexOf(e);
            return r >= 0
              ? ((r += n ? 1 : -1) < 0 ? (r = t.length - 1) : (r %= t.length),
                t[r])
              : null;
          }),
          (t.INSTANCE = new t()),
          t
        );
      })(),
      k = n(29),
      D = n(6);
    n.d(e, "a", function () {
      return j;
    });
    var F,
      U =
        ((F = function (t, e) {
          return (F =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            })(t, e);
        }),
        function (t, e) {
          function n() {
            this.constructor = t;
          }
          F(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((n.prototype = e.prototype), new n()));
        }),
      K = (function (t) {
        function e() {
          return (null !== t && t.apply(this, arguments)) || this;
        }
        return (
          U(e, t),
          Object.defineProperty(e.prototype, "uri", {
            get: function () {
              return this._uri;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "version", {
            get: function () {
              return this._versionId;
            },
            enumerable: !0,
            configurable: !0,
          }),
          Object.defineProperty(e.prototype, "eol", {
            get: function () {
              return this._eol;
            },
            enumerable: !0,
            configurable: !0,
          }),
          (e.prototype.getValue = function () {
            return this.getText();
          }),
          (e.prototype.getLinesContent = function () {
            return this._lines.slice(0);
          }),
          (e.prototype.getLineCount = function () {
            return this._lines.length;
          }),
          (e.prototype.getLineContent = function (t) {
            return this._lines[t - 1];
          }),
          (e.prototype.getWordAtPosition = function (t, e) {
            var n = Object(A.d)(
              t.column,
              Object(A.c)(e),
              this._lines[t.lineNumber - 1],
              0
            );
            return n
              ? new p.a(t.lineNumber, n.startColumn, t.lineNumber, n.endColumn)
              : null;
          }),
          (e.prototype.getWordUntilPosition = function (t, e) {
            var n = this.getWordAtPosition(t, e);
            return n
              ? {
                  word: this._lines[t.lineNumber - 1].substring(
                    n.startColumn - 1,
                    t.column - 1
                  ),
                  startColumn: n.startColumn,
                  endColumn: t.column,
                }
              : { word: "", startColumn: t.column, endColumn: t.column };
          }),
          (e.prototype.createWordIterator = function (t) {
            var e,
              n,
              r = this,
              i = 0,
              o = 0,
              u = [],
              s = function () {
                if (o < u.length) {
                  var a = n.substring(u[o].start, u[o].end);
                  return (
                    (o += 1),
                    e ? (e.value = a) : (e = { done: !1, value: a }),
                    e
                  );
                }
                return i >= r._lines.length
                  ? f.a
                  : ((n = r._lines[i]),
                    (u = r._wordenize(n, t)),
                    (o = 0),
                    (i += 1),
                    s());
              };
            return { next: s };
          }),
          (e.prototype.getLineWords = function (t, e) {
            for (
              var n = this._lines[t - 1],
                r = [],
                i = 0,
                o = this._wordenize(n, e);
              i < o.length;
              i++
            ) {
              var u = o[i];
              r.push({
                word: n.substring(u.start, u.end),
                startColumn: u.start + 1,
                endColumn: u.end + 1,
              });
            }
            return r;
          }),
          (e.prototype._wordenize = function (t, e) {
            var n,
              r = [];
            for (e.lastIndex = 0; (n = e.exec(t)) && 0 !== n[0].length; )
              r.push({ start: n.index, end: n.index + n[0].length });
            return r;
          }),
          (e.prototype.getValueInRange = function (t) {
            if (
              (t = this._validateRange(t)).startLineNumber === t.endLineNumber
            )
              return this._lines[t.startLineNumber - 1].substring(
                t.startColumn - 1,
                t.endColumn - 1
              );
            var e = this._eol,
              n = t.startLineNumber - 1,
              r = t.endLineNumber - 1,
              i = [];
            i.push(this._lines[n].substring(t.startColumn - 1));
            for (var o = n + 1; o < r; o++) i.push(this._lines[o]);
            return (
              i.push(this._lines[r].substring(0, t.endColumn - 1)), i.join(e)
            );
          }),
          (e.prototype.offsetAt = function (t) {
            return (
              (t = this._validatePosition(t)),
              this._ensureLineStarts(),
              this._lineStarts.getAccumulatedValue(t.lineNumber - 2) +
                (t.column - 1)
            );
          }),
          (e.prototype.positionAt = function (t) {
            (t = Math.floor(t)), (t = Math.max(0, t)), this._ensureLineStarts();
            var e = this._lineStarts.getIndexOf(t),
              n = this._lines[e.index].length;
            return {
              lineNumber: 1 + e.index,
              column: 1 + Math.min(e.remainder, n),
            };
          }),
          (e.prototype._validateRange = function (t) {
            var e = this._validatePosition({
                lineNumber: t.startLineNumber,
                column: t.startColumn,
              }),
              n = this._validatePosition({
                lineNumber: t.endLineNumber,
                column: t.endColumn,
              });
            return e.lineNumber !== t.startLineNumber ||
              e.column !== t.startColumn ||
              n.lineNumber !== t.endLineNumber ||
              n.column !== t.endColumn
              ? {
                  startLineNumber: e.lineNumber,
                  startColumn: e.column,
                  endLineNumber: n.lineNumber,
                  endColumn: n.column,
                }
              : t;
          }),
          (e.prototype._validatePosition = function (t) {
            if (!m.a.isIPosition(t)) throw new Error("bad position");
            var e = t.lineNumber,
              n = t.column,
              r = !1;
            if (e < 1) (e = 1), (n = 1), (r = !0);
            else if (e > this._lines.length)
              (e = this._lines.length),
                (n = this._lines[e - 1].length + 1),
                (r = !0);
            else {
              var i = this._lines[e - 1].length + 1;
              n < 1 ? ((n = 1), (r = !0)) : n > i && ((n = i), (r = !0));
            }
            return r ? { lineNumber: e, column: n } : t;
          }),
          e
        );
      })(w),
      j = (function (t) {
        function e(e) {
          var n = t.call(this, e) || this;
          return (n._models = Object.create(null)), n;
        }
        return (
          U(e, t),
          (e.prototype.dispose = function () {
            this._models = Object.create(null);
          }),
          (e.prototype._getModel = function (t) {
            return this._models[t];
          }),
          (e.prototype._getModels = function () {
            var t = this,
              e = [];
            return (
              Object.keys(this._models).forEach(function (n) {
                return e.push(t._models[n]);
              }),
              e
            );
          }),
          (e.prototype.acceptNewModel = function (t) {
            this._models[t.url] = new K(
              d.a.parse(t.url),
              t.lines,
              t.EOL,
              t.versionId
            );
          }),
          (e.prototype.acceptModelChanged = function (t, e) {
            this._models[t] && this._models[t].onEvents(e);
          }),
          (e.prototype.acceptRemovedModel = function (t) {
            this._models[t] && delete this._models[t];
          }),
          e
        );
      })(
        (function () {
          function t(t) {
            (this._foreignModuleFactory = t), (this._foreignModule = null);
          }
          return (
            (t.prototype.computeDiff = function (t, e, n) {
              var r = this._getModel(t),
                i = this._getModel(e);
              if (!r || !i) return Promise.resolve(null);
              var o = r.getLinesContent(),
                u = i.getLinesContent(),
                s = new N(o, u, {
                  shouldComputeCharChanges: !0,
                  shouldPostProcessCharChanges: !0,
                  shouldIgnoreTrimWhitespace: n,
                  shouldMakePrettyDiff: !0,
                }).computeDiff(),
                a = !(s.length > 0) && this._modelsAreIdentical(r, i);
              return Promise.resolve({ identical: a, changes: s });
            }),
            (t.prototype._modelsAreIdentical = function (t, e) {
              var n = t.getLineCount();
              if (n !== e.getLineCount()) return !1;
              for (var r = 1; r <= n; r++) {
                if (t.getLineContent(r) !== e.getLineContent(r)) return !1;
              }
              return !0;
            }),
            (t.prototype.computeMoreMinimalEdits = function (e, n) {
              var i = this._getModel(e);
              if (!i) return Promise.resolve(n);
              for (
                var o = [],
                  s = void 0,
                  a = 0,
                  c = (n = Object(r.l)(n, function (t, e) {
                    return t.range && e.range
                      ? p.a.compareRangesUsingStarts(t.range, e.range)
                      : (t.range ? 0 : 1) - (e.range ? 0 : 1);
                  }));
                a < c.length;
                a++
              ) {
                var l = c[a],
                  f = l.range,
                  h = l.text,
                  d = l.eol;
                if (("number" == typeof d && (s = d), !p.a.isEmpty(f) || h)) {
                  var m = i.getValueInRange(f);
                  if (m !== (h = h.replace(/\r\n|\n|\r/g, i.eol)))
                    if (Math.max(h.length, m.length) > t._diffLimit)
                      o.push({ range: f, text: h });
                    else
                      for (
                        var g = u(m, h, !1),
                          _ = i.offsetAt(p.a.lift(f).getStartPosition()),
                          v = 0,
                          y = g;
                        v < y.length;
                        v++
                      ) {
                        var b = y[v],
                          C = i.positionAt(_ + b.originalStart),
                          L = i.positionAt(
                            _ + b.originalStart + b.originalLength
                          ),
                          E = {
                            text: h.substr(b.modifiedStart, b.modifiedLength),
                            range: {
                              startLineNumber: C.lineNumber,
                              startColumn: C.column,
                              endLineNumber: L.lineNumber,
                              endColumn: L.column,
                            },
                          };
                        i.getValueInRange(E.range) !== E.text && o.push(E);
                      }
                }
              }
              return (
                "number" == typeof s &&
                  o.push({
                    eol: s,
                    text: "",
                    range: {
                      startLineNumber: 0,
                      startColumn: 0,
                      endLineNumber: 0,
                      endColumn: 0,
                    },
                  }),
                Promise.resolve(o)
              );
            }),
            (t.prototype.computeLinks = function (t) {
              var e = this._getModel(t);
              return e
                ? Promise.resolve(
                    (function (t) {
                      return t &&
                        "function" == typeof t.getLineCount &&
                        "function" == typeof t.getLineContent
                        ? I.computeLinks(t)
                        : [];
                    })(e)
                  )
                : Promise.resolve(null);
            }),
            (t.prototype.textualSuggest = function (e, n, r, i) {
              var o = this._getModel(e);
              if (!o) return Promise.resolve(null);
              var u = Object.create(null),
                s = [],
                a = new RegExp(r, i),
                c = o.getWordUntilPosition(n, a),
                l = o.getWordAtPosition(n, a);
              l && (u[o.getValueInRange(l)] = !0);
              for (
                var f = o.createWordIterator(a), h = f.next();
                !h.done && s.length <= t._suggestionsLimit;
                h = f.next()
              ) {
                var d = h.value;
                u[d] ||
                  ((u[d] = !0),
                  isNaN(Number(d)) &&
                    s.push({
                      kind: 18,
                      label: d,
                      insertText: d,
                      range: {
                        startLineNumber: n.lineNumber,
                        startColumn: c.startColumn,
                        endLineNumber: n.lineNumber,
                        endColumn: c.endColumn,
                      },
                    }));
              }
              return Promise.resolve({ suggestions: s });
            }),
            (t.prototype.computeWordRanges = function (t, e, n, r) {
              var i = this._getModel(t);
              if (!i) return Promise.resolve(Object.create(null));
              for (
                var o = new RegExp(n, r),
                  u = Object.create(null),
                  s = e.startLineNumber;
                s < e.endLineNumber;
                s++
              )
                for (var a = 0, c = i.getLineWords(s, o); a < c.length; a++) {
                  var l = c[a];
                  if (isNaN(Number(l.word))) {
                    var f = u[l.word];
                    f || ((f = []), (u[l.word] = f)),
                      f.push({
                        startLineNumber: s,
                        startColumn: l.startColumn,
                        endLineNumber: s,
                        endColumn: l.endColumn,
                      });
                  }
                }
              return Promise.resolve(u);
            }),
            (t.prototype.navigateValueSet = function (t, e, n, r, i) {
              var o = this._getModel(t);
              if (!o) return Promise.resolve(null);
              var u = new RegExp(r, i);
              e.startColumn === e.endColumn &&
                (e = {
                  startLineNumber: e.startLineNumber,
                  startColumn: e.startColumn,
                  endLineNumber: e.endLineNumber,
                  endColumn: e.endColumn + 1,
                });
              var s = o.getValueInRange(e),
                a = o.getWordAtPosition(
                  { lineNumber: e.startLineNumber, column: e.startColumn },
                  u
                );
              if (!a) return Promise.resolve(null);
              var c = o.getValueInRange(a),
                l = R.INSTANCE.navigateValueSet(e, s, a, c, n);
              return Promise.resolve(l);
            }),
            (t.prototype.loadForeignModule = function (t, e) {
              var n = this,
                r = {
                  getMirrorModels: function () {
                    return n._getModels();
                  },
                };
              if (this._foreignModuleFactory) {
                this._foreignModule = this._foreignModuleFactory(r, e);
                for (
                  var i = [], o = 0, u = Object(D.a)(this._foreignModule);
                  o < u.length;
                  o++
                ) {
                  var s = u[o];
                  "function" == typeof this._foreignModule[s] && i.push(s);
                }
                return Promise.resolve(i);
              }
              return Promise.reject(new Error("Unexpected usage"));
            }),
            (t.prototype.fmr = function (t, e) {
              if (
                !this._foreignModule ||
                "function" != typeof this._foreignModule[t]
              )
                return Promise.reject(
                  new Error("Missing requestHandler or method: " + t)
                );
              try {
                return Promise.resolve(
                  this._foreignModule[t].apply(this._foreignModule, e)
                );
              } catch (t) {
                return Promise.reject(t);
              }
            }),
            (t._diffLimit = 1e5),
            (t._suggestionsLimit = 1e4),
            t
          );
        })()
      );
    "function" == typeof importScripts && (h.b.monaco = Object(k.a)());
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function (t, e, n) {
    (function (t, e) {
      (function () {
        "use strict";
        function n(t) {
          var e = this.constructor;
          return this.then(
            function (n) {
              return e.resolve(t()).then(function () {
                return n;
              });
            },
            function (n) {
              return e.resolve(t()).then(function () {
                return e.reject(n);
              });
            }
          );
        }
        var r = setTimeout;
        function i() {}
        function o(t) {
          if (!(this instanceof o))
            throw new TypeError("Promises must be constructed via new");
          if ("function" != typeof t) throw new TypeError("not a function");
          (this._state = 0),
            (this._handled = !1),
            (this._value = void 0),
            (this._deferreds = []),
            f(t, this);
        }
        function u(t, e) {
          for (; 3 === t._state; ) t = t._value;
          0 !== t._state
            ? ((t._handled = !0),
              o._immediateFn(function () {
                var n = 1 === t._state ? e.onFulfilled : e.onRejected;
                if (null !== n) {
                  var r;
                  try {
                    r = n(t._value);
                  } catch (t) {
                    return void a(e.promise, t);
                  }
                  s(e.promise, r);
                } else (1 === t._state ? s : a)(e.promise, t._value);
              }))
            : t._deferreds.push(e);
        }
        function s(t, e) {
          try {
            if (e === t)
              throw new TypeError("A promise cannot be resolved with itself.");
            if (e && ("object" == typeof e || "function" == typeof e)) {
              var n = e.then;
              if (e instanceof o)
                return (t._state = 3), (t._value = e), void c(t);
              if ("function" == typeof n)
                return void f(
                  ((r = n),
                  (i = e),
                  function () {
                    r.apply(i, arguments);
                  }),
                  t
                );
            }
            (t._state = 1), (t._value = e), c(t);
          } catch (e) {
            a(t, e);
          }
          var r, i;
        }
        function a(t, e) {
          (t._state = 2), (t._value = e), c(t);
        }
        function c(t) {
          2 === t._state &&
            0 === t._deferreds.length &&
            o._immediateFn(function () {
              t._handled || o._unhandledRejectionFn(t._value);
            });
          for (var e = 0, n = t._deferreds.length; e < n; e++)
            u(t, t._deferreds[e]);
          t._deferreds = null;
        }
        function l(t, e, n) {
          (this.onFulfilled = "function" == typeof t ? t : null),
            (this.onRejected = "function" == typeof e ? e : null),
            (this.promise = n);
        }
        function f(t, e) {
          var n = !1;
          try {
            t(
              function (t) {
                n || ((n = !0), s(e, t));
              },
              function (t) {
                n || ((n = !0), a(e, t));
              }
            );
          } catch (t) {
            if (n) return;
            (n = !0), a(e, t);
          }
        }
        (o.prototype.catch = function (t) {
          return this.then(null, t);
        }),
          (o.prototype.then = function (t, e) {
            var n = new this.constructor(i);
            return u(this, new l(t, e, n)), n;
          }),
          (o.prototype.finally = n),
          (o.all = function (t) {
            return new o(function (e, n) {
              if (!t || void 0 === t.length)
                throw new TypeError("Promise.all accepts an array");
              var r = Array.prototype.slice.call(t);
              if (0 === r.length) return e([]);
              var i = r.length;
              function o(t, u) {
                try {
                  if (u && ("object" == typeof u || "function" == typeof u)) {
                    var s = u.then;
                    if ("function" == typeof s)
                      return void s.call(
                        u,
                        function (e) {
                          o(t, e);
                        },
                        n
                      );
                  }
                  (r[t] = u), 0 == --i && e(r);
                } catch (t) {
                  n(t);
                }
              }
              for (var u = 0; u < r.length; u++) o(u, r[u]);
            });
          }),
          (o.resolve = function (t) {
            return t && "object" == typeof t && t.constructor === o
              ? t
              : new o(function (e) {
                  e(t);
                });
          }),
          (o.reject = function (t) {
            return new o(function (e, n) {
              n(t);
            });
          }),
          (o.race = function (t) {
            return new o(function (e, n) {
              for (var r = 0, i = t.length; r < i; r++) t[r].then(e, n);
            });
          }),
          (o._immediateFn =
            ("function" == typeof t &&
              function (e) {
                t(e);
              }) ||
            function (t) {
              r(t, 0);
            }),
          (o._unhandledRejectionFn = function (t) {
            "undefined" != typeof console &&
              console &&
              console.warn("Possible Unhandled Promise Rejection:", t);
          });
        var h = (function () {
          if ("undefined" != typeof self) return self;
          if ("undefined" != typeof window) return window;
          if (void 0 !== e) return e;
          throw new Error("unable to locate global object");
        })();
        "Promise" in h
          ? h.Promise.prototype.finally || (h.Promise.prototype.finally = n)
          : (h.Promise = o);
      })();
    }.call(this, n(47).setImmediate, n(21)));
  },
  function (t, e, n) {
    (function (t) {
      var r =
          (void 0 !== t && t) || ("undefined" != typeof self && self) || window,
        i = Function.prototype.apply;
      function o(t, e) {
        (this._id = t), (this._clearFn = e);
      }
      (e.setTimeout = function () {
        return new o(i.call(setTimeout, r, arguments), clearTimeout);
      }),
        (e.setInterval = function () {
          return new o(i.call(setInterval, r, arguments), clearInterval);
        }),
        (e.clearTimeout = e.clearInterval = function (t) {
          t && t.close();
        }),
        (o.prototype.unref = o.prototype.ref = function () {}),
        (o.prototype.close = function () {
          this._clearFn.call(r, this._id);
        }),
        (e.enroll = function (t, e) {
          clearTimeout(t._idleTimeoutId), (t._idleTimeout = e);
        }),
        (e.unenroll = function (t) {
          clearTimeout(t._idleTimeoutId), (t._idleTimeout = -1);
        }),
        (e._unrefActive = e.active = function (t) {
          clearTimeout(t._idleTimeoutId);
          var e = t._idleTimeout;
          e >= 0 &&
            (t._idleTimeoutId = setTimeout(function () {
              t._onTimeout && t._onTimeout();
            }, e));
        }),
        n(48),
        (e.setImmediate =
          ("undefined" != typeof self && self.setImmediate) ||
          (void 0 !== t && t.setImmediate) ||
          (this && this.setImmediate)),
        (e.clearImmediate =
          ("undefined" != typeof self && self.clearImmediate) ||
          (void 0 !== t && t.clearImmediate) ||
          (this && this.clearImmediate));
    }.call(this, n(21)));
  },
  function (t, e, n) {
    (function (t, e) {
      !(function (t, n) {
        "use strict";
        if (!t.setImmediate) {
          var r,
            i,
            o,
            u,
            s,
            a = 1,
            c = {},
            l = !1,
            f = t.document,
            h = Object.getPrototypeOf && Object.getPrototypeOf(t);
          (h = h && h.setTimeout ? h : t),
            "[object process]" === {}.toString.call(t.process)
              ? (r = function (t) {
                  e.nextTick(function () {
                    m(t);
                  });
                })
              : !(function () {
                  if (t.postMessage && !t.importScripts) {
                    var e = !0,
                      n = t.onmessage;
                    return (
                      (t.onmessage = function () {
                        e = !1;
                      }),
                      t.postMessage("", "*"),
                      (t.onmessage = n),
                      e
                    );
                  }
                })()
              ? t.MessageChannel
                ? (((o = new MessageChannel()).port1.onmessage = function (t) {
                    m(t.data);
                  }),
                  (r = function (t) {
                    o.port2.postMessage(t);
                  }))
                : f && "onreadystatechange" in f.createElement("script")
                ? ((i = f.documentElement),
                  (r = function (t) {
                    var e = f.createElement("script");
                    (e.onreadystatechange = function () {
                      m(t),
                        (e.onreadystatechange = null),
                        i.removeChild(e),
                        (e = null);
                    }),
                      i.appendChild(e);
                  }))
                : (r = function (t) {
                    setTimeout(m, 0, t);
                  })
              : ((u = "setImmediate$" + Math.random() + "$"),
                (s = function (e) {
                  e.source === t &&
                    "string" == typeof e.data &&
                    0 === e.data.indexOf(u) &&
                    m(+e.data.slice(u.length));
                }),
                t.addEventListener
                  ? t.addEventListener("message", s, !1)
                  : t.attachEvent("onmessage", s),
                (r = function (e) {
                  t.postMessage(u + e, "*");
                })),
            (h.setImmediate = function (t) {
              "function" != typeof t && (t = new Function("" + t));
              for (
                var e = new Array(arguments.length - 1), n = 0;
                n < e.length;
                n++
              )
                e[n] = arguments[n + 1];
              var i = { callback: t, args: e };
              return (c[a] = i), r(a), a++;
            }),
            (h.clearImmediate = d);
        }
        function d(t) {
          delete c[t];
        }
        function m(t) {
          if (l) setTimeout(m, 0, t);
          else {
            var e = c[t];
            if (e) {
              l = !0;
              try {
                !(function (t) {
                  var e = t.callback,
                    r = t.args;
                  switch (r.length) {
                    case 0:
                      e();
                      break;
                    case 1:
                      e(r[0]);
                      break;
                    case 2:
                      e(r[0], r[1]);
                      break;
                    case 3:
                      e(r[0], r[1], r[2]);
                      break;
                    default:
                      e.apply(n, r);
                  }
                })(e);
              } finally {
                d(t), (l = !1);
              }
            }
          }
        }
      })("undefined" == typeof self ? (void 0 === t ? this : t) : self);
    }.call(this, n(21), n(28)));
  },
  ,
  ,
  ,
  ,
  function (t, e, n) {
    "use strict";
    n.r(e),
      n.d(e, "initialize", function () {
        return u;
      });
    var r = n(26),
      i = n(30),
      o = !1;
    function u(t) {
      if (!o) {
        o = !0;
        var e = new i.a(t),
          n = new r.b(function (t) {
            self.postMessage(t);
          }, e);
        self.onmessage = function (t) {
          n.onmessage(t.data);
        };
      }
    }
    self.onmessage = function (t) {
      o || u(null);
    };
  },
]);
