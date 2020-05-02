(function(){
    "use strict";
    var ρσ_iterator_symbol = (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") ? Symbol.iterator : "iterator-Symbol-5d0927e5554349048cf0e3762a228256";
    var ρσ_kwargs_symbol = (typeof Symbol === "function") ? Symbol("kwargs-object") : "kwargs-object-Symbol-5d0927e5554349048cf0e3762a228256";
    var ρσ_cond_temp, ρσ_expr_temp, ρσ_last_exception;
    var ρσ_object_counter = 0;
var ρσ_len;
function ρσ_bool(val) {
    return !!val;
};
if (!ρσ_bool.__argnames__) Object.defineProperties(ρσ_bool, {
    __argnames__ : {value: ["val"]}
});

function ρσ_print() {
    var parts;
    if (typeof console === "object") {
        parts = [];
        for (var i = 0; i < arguments.length; i++) {
            parts.push(ρσ_str(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]));
        }
        console.log(parts.join(" "));
    }
};

function ρσ_int(val, base) {
    var ans;
    if (typeof val === "number") {
        ans = val | 0;
    } else {
        ans = parseInt(val, base || 10);
    }
    if (isNaN(ans)) {
        throw new ValueError("Invalid literal for int with base " + (base || 10) + ": " + val);
    }
    return ans;
};
if (!ρσ_int.__argnames__) Object.defineProperties(ρσ_int, {
    __argnames__ : {value: ["val", "base"]}
});

function ρσ_float(val) {
    var ans;
    if (typeof val === "number") {
        ans = val;
    } else {
        ans = parseFloat(val);
    }
    if (isNaN(ans)) {
        throw new ValueError("Could not convert string to float: " + arguments[0]);
    }
    return ans;
};
if (!ρσ_float.__argnames__) Object.defineProperties(ρσ_float, {
    __argnames__ : {value: ["val"]}
});

function ρσ_arraylike_creator() {
    var names;
    names = "Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" ");
    if (typeof HTMLCollection === "function") {
        names = names.concat("HTMLCollection NodeList NamedNodeMap TouchList".split(" "));
    }
    return (function() {
        var ρσ_anonfunc = function (x) {
            if (Array.isArray(x) || typeof x === "string" || names.indexOf(Object.prototype.toString.call(x).slice(8, -1)) > -1) {
                return true;
            }
            return false;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["x"]}
        });
        return ρσ_anonfunc;
    })();
};

function options_object(f) {
    return function () {
        if (typeof arguments[arguments.length - 1] === "object") {
            arguments[ρσ_bound_index(arguments.length - 1, arguments)][ρσ_kwargs_symbol] = true;
        }
        return f.apply(this, arguments);
    };
};
if (!options_object.__argnames__) Object.defineProperties(options_object, {
    __argnames__ : {value: ["f"]}
});

function ρσ_id(x) {
    return x.ρσ_object_id;
};
if (!ρσ_id.__argnames__) Object.defineProperties(ρσ_id, {
    __argnames__ : {value: ["x"]}
});

function ρσ_dir(item) {
    var arr;
    arr = ρσ_list_decorate([]);
    for (var i in item) {
        arr.push(i);
    }
    return arr;
};
if (!ρσ_dir.__argnames__) Object.defineProperties(ρσ_dir, {
    __argnames__ : {value: ["item"]}
});

function ρσ_ord(x) {
    var ans, second;
    ans = x.charCodeAt(0);
    if (55296 <= ans && ans <= 56319) {
        second = x.charCodeAt(1);
        if (56320 <= second && second <= 57343) {
            return (ans - 55296) * 1024 + second - 56320 + 65536;
        }
        throw new TypeError("string is missing the low surrogate char");
    }
    return ans;
};
if (!ρσ_ord.__argnames__) Object.defineProperties(ρσ_ord, {
    __argnames__ : {value: ["x"]}
});

function ρσ_chr(code) {
    if (code <= 65535) {
        return String.fromCharCode(code);
    }
    code -= 65536;
    return String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
};
if (!ρσ_chr.__argnames__) Object.defineProperties(ρσ_chr, {
    __argnames__ : {value: ["code"]}
});

function ρσ_callable(x) {
    return typeof x === "function";
};
if (!ρσ_callable.__argnames__) Object.defineProperties(ρσ_callable, {
    __argnames__ : {value: ["x"]}
});

function ρσ_bin(x) {
    var ans;
    if (typeof x !== "number" || x % 1 !== 0) {
        throw new TypeError("integer required");
    }
    ans = x.toString(2);
    if (ans[0] === "-") {
        ans = "-" + "0b" + ans.slice(1);
    } else {
        ans = "0b" + ans;
    }
    return ans;
};
if (!ρσ_bin.__argnames__) Object.defineProperties(ρσ_bin, {
    __argnames__ : {value: ["x"]}
});

function ρσ_hex(x) {
    var ans;
    if (typeof x !== "number" || x % 1 !== 0) {
        throw new TypeError("integer required");
    }
    ans = x.toString(16);
    if (ans[0] === "-") {
        ans = "-" + "0x" + ans.slice(1);
    } else {
        ans = "0x" + ans;
    }
    return ans;
};
if (!ρσ_hex.__argnames__) Object.defineProperties(ρσ_hex, {
    __argnames__ : {value: ["x"]}
});

function ρσ_enumerate(iterable) {
    var ans, iterator;
    ans = {"_i":-1};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    if (ρσ_arraylike(iterable)) {
        ans["next"] = function () {
            this._i += 1;
            if (this._i < iterable.length) {
                return {'done':false, 'value':[this._i, iterable[this._i]]};
            }
            return {'done':true};
        };
        return ans;
    }
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        ans["_iterator"] = iterator;
        ans["next"] = function () {
            var r;
            r = this._iterator.next();
            if (r.done) {
                return {'done':true};
            }
            this._i += 1;
            return {'done':false, 'value':[this._i, r.value]};
        };
        return ans;
    }
    return ρσ_enumerate(Object.keys(iterable));
};
if (!ρσ_enumerate.__argnames__) Object.defineProperties(ρσ_enumerate, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_reversed(iterable) {
    var ans;
    if (ρσ_arraylike(iterable)) {
        ans = {"_i": iterable.length};
        ans["next"] = function () {
            this._i -= 1;
            if (this._i > -1) {
                return {'done':false, 'value':iterable[this._i]};
            }
            return {'done':true};
        };
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        return ans;
    }
    throw new TypeError("reversed() can only be called on arrays or strings");
};
if (!ρσ_reversed.__argnames__) Object.defineProperties(ρσ_reversed, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_iter(iterable) {
    var ans;
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        return (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
    }
    if (ρσ_arraylike(iterable)) {
        ans = {"_i":-1};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i < iterable.length) {
                return {'done':false, 'value':iterable[this._i]};
            }
            return {'done':true};
        };
        return ans;
    }
    return ρσ_iter(Object.keys(iterable));
};
if (!ρσ_iter.__argnames__) Object.defineProperties(ρσ_iter, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_range_next(step, length) {
    var ρσ_unpack;
    this._i += step;
    this._idx += 1;
    if (this._idx >= length) {
        ρσ_unpack = [this.__i, -1];
        this._i = ρσ_unpack[0];
        this._idx = ρσ_unpack[1];
        return {'done':true};
    }
    return {'done':false, 'value':this._i};
};
if (!ρσ_range_next.__argnames__) Object.defineProperties(ρσ_range_next, {
    __argnames__ : {value: ["step", "length"]}
});

function ρσ_range(start, stop, step) {
    var length, ans;
    if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
    }
    step = arguments[2] || 1;
    length = Math.max(Math.ceil((stop - start) / step), 0);
    ans = {start:start, step:step, stop:stop};
    ans[ρσ_iterator_symbol] = function () {
        var it;
        it = {"_i": start - step, "_idx": -1};
        it.next = ρσ_range_next.bind(it, step, length);
        it[ρσ_iterator_symbol] = function () {
            return this;
        };
        return it;
    };
    ans.count = (function() {
        var ρσ_anonfunc = function (val) {
            if (!this._cached) {
                this._cached = list(this);
            }
            return this._cached.count(val);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["val"]}
        });
        return ρσ_anonfunc;
    })();
    ans.index = (function() {
        var ρσ_anonfunc = function (val) {
            if (!this._cached) {
                this._cached = list(this);
            }
            return this._cached.index(val);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["val"]}
        });
        return ρσ_anonfunc;
    })();
    if (typeof Proxy === "function") {
        ans = new Proxy(ans, (function(){
            var ρσ_d = {};
            ρσ_d["get"] = (function() {
                var ρσ_anonfunc = function (obj, prop) {
                    var iprop;
                    if (typeof prop === "string") {
                        iprop = parseInt(prop);
                        if (!isNaN(iprop)) {
                            prop = iprop;
                        }
                    }
                    if (typeof prop === "number") {
                        if (!obj._cached) {
                            obj._cached = list(obj);
                        }
                        return (ρσ_expr_temp = obj._cached)[(typeof prop === "number" && prop < 0) ? ρσ_expr_temp.length + prop : prop];
                    }
                    return obj[(typeof prop === "number" && prop < 0) ? obj.length + prop : prop];
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["obj", "prop"]}
                });
                return ρσ_anonfunc;
            })();
            return ρσ_d;
        }).call(this));
    }
    return ans;
};
if (!ρσ_range.__argnames__) Object.defineProperties(ρσ_range, {
    __argnames__ : {value: ["start", "stop", "step"]}
});

function ρσ_getattr(obj, name, defval) {
    var ret;
    try {
        ret = obj[(typeof name === "number" && name < 0) ? obj.length + name : name];
    } catch (ρσ_Exception) {
        ρσ_last_exception = ρσ_Exception;
        if (ρσ_Exception instanceof TypeError) {
            if (defval === undefined) {
                throw new AttributeError("The attribute " + name + " is not present");
            }
            return defval;
        } else {
            throw ρσ_Exception;
        }
    }
    if (ret === undefined && !(name in obj)) {
        if (defval === undefined) {
            throw new AttributeError("The attribute " + name + " is not present");
        }
        ret = defval;
    }
    return ret;
};
if (!ρσ_getattr.__argnames__) Object.defineProperties(ρσ_getattr, {
    __argnames__ : {value: ["obj", "name", "defval"]}
});

function ρσ_setattr(obj, name, value) {
    obj[(typeof name === "number" && name < 0) ? obj.length + name : name] = value;
};
if (!ρσ_setattr.__argnames__) Object.defineProperties(ρσ_setattr, {
    __argnames__ : {value: ["obj", "name", "value"]}
});

function ρσ_hasattr(obj, name) {
    return name in obj;
};
if (!ρσ_hasattr.__argnames__) Object.defineProperties(ρσ_hasattr, {
    __argnames__ : {value: ["obj", "name"]}
});

ρσ_len = function () {
    function len(obj) {
        if (ρσ_arraylike(obj)) {
            return obj.length;
        }
        if (typeof obj.__len__ === "function") {
            return obj.__len__();
        }
        if (obj instanceof Set || obj instanceof Map) {
            return obj.size;
        }
        return Object.keys(obj).length;
    };
    if (!len.__argnames__) Object.defineProperties(len, {
        __argnames__ : {value: ["obj"]}
    });

    function len5(obj) {
        if (ρσ_arraylike(obj)) {
            return obj.length;
        }
        if (typeof obj.__len__ === "function") {
            return obj.__len__();
        }
        return Object.keys(obj).length;
    };
    if (!len5.__argnames__) Object.defineProperties(len5, {
        __argnames__ : {value: ["obj"]}
    });

    return (typeof Set === "function" && typeof Map === "function") ? len : len5;
}();
function ρσ_get_module(name) {
    return ρσ_modules[(typeof name === "number" && name < 0) ? ρσ_modules.length + name : name];
};
if (!ρσ_get_module.__argnames__) Object.defineProperties(ρσ_get_module, {
    __argnames__ : {value: ["name"]}
});

function ρσ_pow(x, y, z) {
    var ans;
    ans = Math.pow(x, y);
    if (z !== undefined) {
        ans %= z;
    }
    return ans;
};
if (!ρσ_pow.__argnames__) Object.defineProperties(ρσ_pow, {
    __argnames__ : {value: ["x", "y", "z"]}
});

function ρσ_type(x) {
    return x.constructor;
};
if (!ρσ_type.__argnames__) Object.defineProperties(ρσ_type, {
    __argnames__ : {value: ["x"]}
});

function ρσ_divmod(x, y) {
    var d;
    if (y === 0) {
        throw new ZeroDivisionError("integer division or modulo by zero");
    }
    d = Math.floor(x / y);
    return [d, x - d * y];
};
if (!ρσ_divmod.__argnames__) Object.defineProperties(ρσ_divmod, {
    __argnames__ : {value: ["x", "y"]}
});

function ρσ_max() {
    var kwargs = arguments[arguments.length-1];
    if (kwargs === null || typeof kwargs !== "object" || kwargs [ρσ_kwargs_symbol] !== true) kwargs = {};
    var args = Array.prototype.slice.call(arguments, 0);
    if (kwargs !== null && typeof kwargs === "object" && kwargs [ρσ_kwargs_symbol] === true) args.pop();
    var args, x;
    if (args.length === 0) {
        if (kwargs.defval !== undefined) {
            return kwargs.defval;
        }
        throw new TypeError("expected at least one argument");
    }
    if (args.length === 1) {
        args = args[0];
    }
    if (kwargs.key) {
        args = (function() {
            var ρσ_Iter = ρσ_Iterable(args), ρσ_Result = [], x;
            for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                x = ρσ_Iter[ρσ_Index];
                ρσ_Result.push(kwargs.key(x));
            }
            ρσ_Result = ρσ_list_constructor(ρσ_Result);
            return ρσ_Result;
        })();
    }
    if (!Array.isArray(args)) {
        args = list(args);
    }
    if (args.length) {
        return this.apply(null, args);
    }
    if (kwargs.defval !== undefined) {
        return kwargs.defval;
    }
    throw new TypeError("expected at least one argument");
};
if (!ρσ_max.__handles_kwarg_interpolation__) Object.defineProperties(ρσ_max, {
    __handles_kwarg_interpolation__ : {value: true}
});

var abs = Math.abs, max = ρσ_max.bind(Math.max), min = ρσ_max.bind(Math.min), bool = ρσ_bool, type = ρσ_type;
var float = ρσ_float, int = ρσ_int, arraylike = ρσ_arraylike_creator(), ρσ_arraylike = arraylike;
var print = ρσ_print, id = ρσ_id, get_module = ρσ_get_module, pow = ρσ_pow, divmod = ρσ_divmod;
var dir = ρσ_dir, ord = ρσ_ord, chr = ρσ_chr, bin = ρσ_bin, hex = ρσ_hex, callable = ρσ_callable;
var enumerate = ρσ_enumerate, iter = ρσ_iter, reversed = ρσ_reversed, len = ρσ_len;
var range = ρσ_range, getattr = ρσ_getattr, setattr = ρσ_setattr, hasattr = ρσ_hasattr;function ρσ_equals(a, b) {
    var ρσ_unpack, akeys, bkeys, key;
    if (a === b) {
        return true;
    }
    if (a && typeof a.__eq__ === "function") {
        return a.__eq__(b);
    }
    if (b && typeof b.__eq__ === "function") {
        return b.__eq__(a);
    }
    if (ρσ_arraylike(a) && ρσ_arraylike(b)) {
        if ((a.length !== b.length && (typeof a.length !== "object" || ρσ_not_equals(a.length, b.length)))) {
            return false;
        }
        for (var i=0; i < a.length; i++) {
            if (!((a[(typeof i === "number" && i < 0) ? a.length + i : i] === b[(typeof i === "number" && i < 0) ? b.length + i : i] || typeof a[(typeof i === "number" && i < 0) ? a.length + i : i] === "object" && ρσ_equals(a[(typeof i === "number" && i < 0) ? a.length + i : i], b[(typeof i === "number" && i < 0) ? b.length + i : i])))) {
                return false;
            }
        }
        return true;
    }
    if (typeof a === "object" && typeof b === "object" && a !== null && b !== null && (a.constructor === Object && b.constructor === Object || Object.getPrototypeOf(a) === null && Object.getPrototypeOf(b) === null)) {
        ρσ_unpack = [Object.keys(a), Object.keys(b)];
        akeys = ρσ_unpack[0];
        bkeys = ρσ_unpack[1];
        if (akeys.length !== bkeys.length) {
            return false;
        }
        for (var j=0; j < akeys.length; j++) {
            key = akeys[(typeof j === "number" && j < 0) ? akeys.length + j : j];
            if (!((a[(typeof key === "number" && key < 0) ? a.length + key : key] === b[(typeof key === "number" && key < 0) ? b.length + key : key] || typeof a[(typeof key === "number" && key < 0) ? a.length + key : key] === "object" && ρσ_equals(a[(typeof key === "number" && key < 0) ? a.length + key : key], b[(typeof key === "number" && key < 0) ? b.length + key : key])))) {
                return false;
            }
        }
        return true;
    }
    return false;
};
if (!ρσ_equals.__argnames__) Object.defineProperties(ρσ_equals, {
    __argnames__ : {value: ["a", "b"]}
});

function ρσ_not_equals(a, b) {
    if (a === b) {
        return false;
    }
    if (a && typeof a.__ne__ === "function") {
        return a.__ne__(b);
    }
    if (b && typeof b.__ne__ === "function") {
        return b.__ne__(a);
    }
    return !ρσ_equals(a, b);
};
if (!ρσ_not_equals.__argnames__) Object.defineProperties(ρσ_not_equals, {
    __argnames__ : {value: ["a", "b"]}
});

var equals = ρσ_equals;
function ρσ_list_extend(iterable) {
    var start, iterator, result;
    if (Array.isArray(iterable) || typeof iterable === "string") {
        start = this.length;
        this.length += iterable.length;
        for (var i = 0; i < iterable.length; i++) {
            (ρσ_expr_temp = this)[ρσ_bound_index(start + i, ρσ_expr_temp)] = iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i];
        }
    } else {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        result = iterator.next();
        while (!result.done) {
            this.push(result.value);
            result = iterator.next();
        }
    }
};
if (!ρσ_list_extend.__argnames__) Object.defineProperties(ρσ_list_extend, {
    __argnames__ : {value: ["iterable"]}
});

function ρσ_list_index(val, start, stop) {
    var idx;
    start = start || 0;
    if (start < 0) {
        start = this.length + start;
    }
    if (start < 0) {
        throw new ValueError(val + " is not in list");
    }
    if (stop === undefined) {
        idx = this.indexOf(val, start);
        if (idx === -1) {
            throw new ValueError(val + " is not in list");
        }
        return idx;
    }
    if (stop < 0) {
        stop = this.length + stop;
    }
    for (var i = start; i < stop; i++) {
        if (((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === val || typeof (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === "object" && ρσ_equals((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i], val))) {
            return i;
        }
    }
    throw new ValueError(val + " is not in list");
};
if (!ρσ_list_index.__argnames__) Object.defineProperties(ρσ_list_index, {
    __argnames__ : {value: ["val", "start", "stop"]}
});

function ρσ_list_pop(index) {
    var ans;
    if (this.length === 0) {
        throw new IndexError("list is empty");
    }
    if (index === undefined) {
        index = -1;
    }
    ans = this.splice(index, 1);
    if (!ans.length) {
        throw new IndexError("pop index out of range");
    }
    return ans[0];
};
if (!ρσ_list_pop.__argnames__) Object.defineProperties(ρσ_list_pop, {
    __argnames__ : {value: ["index"]}
});

function ρσ_list_remove(value) {
    var idx;
    idx = this.indexOf(value);
    if (idx === -1) {
        throw new ValueError(value + " not in list");
    }
    this.splice(idx, 1);
};
if (!ρσ_list_remove.__argnames__) Object.defineProperties(ρσ_list_remove, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_to_string() {
    return "[" + this.join(", ") + "]";
};

function ρσ_list_insert(index, val) {
    if (index < 0) {
        index += this.length;
    }
    index = min(this.length, max(index, 0));
    if (index === 0) {
        this.unshift(val);
        return;
    }
    for (var i = this.length; i > index; i--) {
        (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = (ρσ_expr_temp = this)[ρσ_bound_index(i - 1, ρσ_expr_temp)];
    }
    (ρσ_expr_temp = this)[(typeof index === "number" && index < 0) ? ρσ_expr_temp.length + index : index] = val;
};
if (!ρσ_list_insert.__argnames__) Object.defineProperties(ρσ_list_insert, {
    __argnames__ : {value: ["index", "val"]}
});

function ρσ_list_copy() {
    return ρσ_list_constructor(this);
};

function ρσ_list_clear() {
    this.length = 0;
};

function ρσ_list_as_array() {
    return Array.prototype.slice.call(this);
};

function ρσ_list_count(value) {
    return this.reduce((function() {
        var ρσ_anonfunc = function (n, val) {
            return n + (val === value);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["n", "val"]}
        });
        return ρσ_anonfunc;
    })(), 0);
};
if (!ρσ_list_count.__argnames__) Object.defineProperties(ρσ_list_count, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_sort_key(value) {
    var t;
    t = typeof value;
    if (t === "string" || t === "number") {
        return value;
    }
    return value.toString();
};
if (!ρσ_list_sort_key.__argnames__) Object.defineProperties(ρσ_list_sort_key, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_sort_cmp(a, b, ap, bp) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return ap - bp;
};
if (!ρσ_list_sort_cmp.__argnames__) Object.defineProperties(ρσ_list_sort_cmp, {
    __argnames__ : {value: ["a", "b", "ap", "bp"]}
});

function ρσ_list_sort() {
    var key = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? ρσ_list_sort.__defaults__.key : arguments[0];
    var reverse = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? ρσ_list_sort.__defaults__.reverse : arguments[1];
    var ρσ_kwargs_obj = arguments[arguments.length-1];
    if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
        key = ρσ_kwargs_obj.key;
    }
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "reverse")){
        reverse = ρσ_kwargs_obj.reverse;
    }
    var mult, keymap, posmap, k;
    key = key || ρσ_list_sort_key;
    mult = (reverse) ? -1 : 1;
    keymap = dict();
    posmap = dict();
    for (var i=0; i < this.length; i++) {
        k = (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
        keymap.set(k, key(k));
        posmap.set(k, i);
    }
    this.sort((function() {
        var ρσ_anonfunc = function (a, b) {
            return mult * ρσ_list_sort_cmp(keymap.get(a), keymap.get(b), posmap.get(a), posmap.get(b));
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["a", "b"]}
        });
        return ρσ_anonfunc;
    })());
};
if (!ρσ_list_sort.__defaults__) Object.defineProperties(ρσ_list_sort, {
    __defaults__ : {value: {key:null, reverse:false}},
    __handles_kwarg_interpolation__ : {value: true},
    __argnames__ : {value: ["key", "reverse"]}
});

function ρσ_list_concat() {
    var ans;
    ans = Array.prototype.concat.apply(this, arguments);
    ρσ_list_decorate(ans);
    return ans;
};

function ρσ_list_slice() {
    var ans;
    ans = Array.prototype.slice.apply(this, arguments);
    ρσ_list_decorate(ans);
    return ans;
};

function ρσ_list_iterator(value) {
    var self;
    self = this;
    return (function(){
        var ρσ_d = {};
        ρσ_d["_i"] = -1;
        ρσ_d["_list"] = self;
        ρσ_d["next"] = function () {
            this._i += 1;
            if (this._i >= this._list.length) {
                return (function(){
                    var ρσ_d = {};
                    ρσ_d["done"] = true;
                    return ρσ_d;
                }).call(this);
            }
            return (function(){
                var ρσ_d = {};
                ρσ_d["done"] = false;
                ρσ_d["value"] = (ρσ_expr_temp = this._list)[ρσ_bound_index(this._i, ρσ_expr_temp)];
                return ρσ_d;
            }).call(this);
        };
        return ρσ_d;
    }).call(this);
};
if (!ρσ_list_iterator.__argnames__) Object.defineProperties(ρσ_list_iterator, {
    __argnames__ : {value: ["value"]}
});

function ρσ_list_len() {
    return this.length;
};

function ρσ_list_contains(val) {
    for (var i = 0; i < this.length; i++) {
        if (((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === val || typeof (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === "object" && ρσ_equals((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i], val))) {
            return true;
        }
    }
    return false;
};
if (!ρσ_list_contains.__argnames__) Object.defineProperties(ρσ_list_contains, {
    __argnames__ : {value: ["val"]}
});

function ρσ_list_eq(other) {
    if (!ρσ_arraylike(other)) {
        return false;
    }
    if ((this.length !== other.length && (typeof this.length !== "object" || ρσ_not_equals(this.length, other.length)))) {
        return false;
    }
    for (var i = 0; i < this.length; i++) {
        if (!(((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === other[(typeof i === "number" && i < 0) ? other.length + i : i] || typeof (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] === "object" && ρσ_equals((ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i], other[(typeof i === "number" && i < 0) ? other.length + i : i])))) {
            return false;
        }
    }
    return true;
};
if (!ρσ_list_eq.__argnames__) Object.defineProperties(ρσ_list_eq, {
    __argnames__ : {value: ["other"]}
});

function ρσ_list_decorate(ans) {
    ans.append = Array.prototype.push;
    ans.toString = ρσ_list_to_string;
    ans.inspect = ρσ_list_to_string;
    ans.extend = ρσ_list_extend;
    ans.index = ρσ_list_index;
    ans.pypop = ρσ_list_pop;
    ans.remove = ρσ_list_remove;
    ans.insert = ρσ_list_insert;
    ans.copy = ρσ_list_copy;
    ans.clear = ρσ_list_clear;
    ans.count = ρσ_list_count;
    ans.concat = ρσ_list_concat;
    ans.pysort = ρσ_list_sort;
    ans.slice = ρσ_list_slice;
    ans.as_array = ρσ_list_as_array;
    ans.__len__ = ρσ_list_len;
    ans.__contains__ = ρσ_list_contains;
    ans.__eq__ = ρσ_list_eq;
    ans.constructor = ρσ_list_constructor;
    if (typeof ans[ρσ_iterator_symbol] !== "function") {
        ans[ρσ_iterator_symbol] = ρσ_list_iterator;
    }
    return ans;
};
if (!ρσ_list_decorate.__argnames__) Object.defineProperties(ρσ_list_decorate, {
    __argnames__ : {value: ["ans"]}
});

function ρσ_list_constructor(iterable) {
    var ans, iterator, result;
    if (iterable === undefined) {
        ans = [];
    } else if (ρσ_arraylike(iterable)) {
        ans = new Array(iterable.length);
        for (var i = 0; i < iterable.length; i++) {
            ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i];
        }
    } else if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        ans = ρσ_list_decorate([]);
        result = iterator.next();
        while (!result.done) {
            ans.push(result.value);
            result = iterator.next();
        }
    } else if (typeof iterable === "number") {
        ans = new Array(iterable);
    } else {
        ans = Object.keys(iterable);
    }
    return ρσ_list_decorate(ans);
};
if (!ρσ_list_constructor.__argnames__) Object.defineProperties(ρσ_list_constructor, {
    __argnames__ : {value: ["iterable"]}
});

ρσ_list_constructor.__name__ = "list";
var list = ρσ_list_constructor, list_wrap = ρσ_list_decorate;
function sorted() {
    var iterable = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
    var key = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sorted.__defaults__.key : arguments[1];
    var reverse = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sorted.__defaults__.reverse : arguments[2];
    var ρσ_kwargs_obj = arguments[arguments.length-1];
    if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
        key = ρσ_kwargs_obj.key;
    }
    if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "reverse")){
        reverse = ρσ_kwargs_obj.reverse;
    }
    var ans;
    ans = ρσ_list_constructor(iterable);
    ans.pysort(key, reverse);
    return ans;
};
if (!sorted.__defaults__) Object.defineProperties(sorted, {
    __defaults__ : {value: {key:null, reverse:false}},
    __handles_kwarg_interpolation__ : {value: true},
    __argnames__ : {value: ["iterable", "key", "reverse"]}
});

var ρσ_global_object_id = 0, ρσ_set_implementation;
function ρσ_set_keyfor(x) {
    var t, ans;
    t = typeof x;
    if (t === "string" || t === "number" || t === "boolean") {
        return "_" + t[0] + x;
    }
    if (x === null) {
        return "__!@#$0";
    }
    ans = x.ρσ_hash_key_prop;
    if (ans === undefined) {
        ans = "_!@#$" + (++ρσ_global_object_id);
        Object.defineProperty(x, "ρσ_hash_key_prop", (function(){
            var ρσ_d = {};
            ρσ_d["value"] = ans;
            return ρσ_d;
        }).call(this));
    }
    return ans;
};
if (!ρσ_set_keyfor.__argnames__) Object.defineProperties(ρσ_set_keyfor, {
    __argnames__ : {value: ["x"]}
});

function ρσ_set_polyfill() {
    this._store = {};
    this.size = 0;
};

ρσ_set_polyfill.prototype.add = (function() {
    var ρσ_anonfunc = function (x) {
        var key;
        key = ρσ_set_keyfor(x);
        if (!Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size += 1;
            (ρσ_expr_temp = this._store)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = x;
        }
        return this;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.clear = (function() {
    var ρσ_anonfunc = function (x) {
        this._store = {};
        this.size = 0;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.delete = (function() {
    var ρσ_anonfunc = function (x) {
        var key;
        key = ρσ_set_keyfor(x);
        if (Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size -= 1;
            delete this._store[key];
            return true;
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.has = (function() {
    var ρσ_anonfunc = function (x) {
        return Object.prototype.hasOwnProperty.call(this._store, ρσ_set_keyfor(x));
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set_polyfill.prototype.values = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
if (typeof Set !== "function" || typeof Set.prototype.delete !== "function") {
    ρσ_set_implementation = ρσ_set_polyfill;
} else {
    ρσ_set_implementation = Set;
}
function ρσ_set(iterable) {
    var ans, s, iterator, result, keys;
    if (this instanceof ρσ_set) {
        this.jsset = new ρσ_set_implementation;
        ans = this;
        if (iterable === undefined) {
            return ans;
        }
        s = ans.jsset;
        if (ρσ_arraylike(iterable)) {
            for (var i = 0; i < iterable.length; i++) {
                s.add(iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i]);
            }
        } else if (typeof iterable[ρσ_iterator_symbol] === "function") {
            iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
            result = iterator.next();
            while (!result.done) {
                s.add(result.value);
                result = iterator.next();
            }
        } else {
            keys = Object.keys(iterable);
            for (var j=0; j < keys.length; j++) {
                s.add(keys[(typeof j === "number" && j < 0) ? keys.length + j : j]);
            }
        }
        return ans;
    } else {
        return new ρσ_set(iterable);
    }
};
if (!ρσ_set.__argnames__) Object.defineProperties(ρσ_set, {
    __argnames__ : {value: ["iterable"]}
});

ρσ_set.prototype.__name__ = "set";
Object.defineProperties(ρσ_set.prototype, (function(){
    var ρσ_d = {};
    ρσ_d["length"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsset.size;
        };
        return ρσ_d;
    }).call(this);
    ρσ_d["size"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsset.size;
        };
        return ρσ_d;
    }).call(this);
    return ρσ_d;
}).call(this));
ρσ_set.prototype.__len__ = function () {
    return this.jsset.size;
};
ρσ_set.prototype.has = ρσ_set.prototype.__contains__ = (function() {
    var ρσ_anonfunc = function (x) {
        return this.jsset.has(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.add = (function() {
    var ρσ_anonfunc = function (x) {
        this.jsset.add(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.clear = function () {
    this.jsset.clear();
};
ρσ_set.prototype.copy = function () {
    return ρσ_set(this);
};
ρσ_set.prototype.discard = (function() {
    var ρσ_anonfunc = function (x) {
        this.jsset.delete(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype[ρσ_iterator_symbol] = function () {
    return this.jsset.values();
};
ρσ_set.prototype.difference = function () {
    var ans, s, iterator, r, x, has;
    ans = new ρσ_set;
    s = ans.jsset;
    iterator = this.jsset.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        has = false;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                has = true;
                break;
            }
        }
        if (!has) {
            s.add(x);
        }
        r = iterator.next();
    }
    return ans;
};
ρσ_set.prototype.difference_update = function () {
    var s, remove, iterator, r, x;
    s = this.jsset;
    remove = [];
    iterator = s.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                remove.push(x);
                break;
            }
        }
        r = iterator.next();
    }
    for (var j = 0; j < remove.length; j++) {
        s.delete(remove[(typeof j === "number" && j < 0) ? remove.length + j : j]);
    }
};
ρσ_set.prototype.intersection = function () {
    var ans, s, iterator, r, x, has;
    ans = new ρσ_set;
    s = ans.jsset;
    iterator = this.jsset.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        has = true;
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                has = false;
                break;
            }
        }
        if (has) {
            s.add(x);
        }
        r = iterator.next();
    }
    return ans;
};
ρσ_set.prototype.intersection_update = function () {
    var s, remove, iterator, r, x;
    s = this.jsset;
    remove = [];
    iterator = s.values();
    r = iterator.next();
    while (!r.done) {
        x = r.value;
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i].has(x)) {
                remove.push(x);
                break;
            }
        }
        r = iterator.next();
    }
    for (var j = 0; j < remove.length; j++) {
        s.delete(remove[(typeof j === "number" && j < 0) ? remove.length + j : j]);
    }
};
ρσ_set.prototype.isdisjoint = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r, x;
        iterator = this.jsset.values();
        r = iterator.next();
        while (!r.done) {
            x = r.value;
            if (other.has(x)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.issubset = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r, x;
        iterator = this.jsset.values();
        r = iterator.next();
        while (!r.done) {
            x = r.value;
            if (!other.has(x)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.issuperset = (function() {
    var ρσ_anonfunc = function (other) {
        var s, iterator, r, x;
        s = this.jsset;
        iterator = other.jsset.values();
        r = iterator.next();
        while (!r.done) {
            x = r.value;
            if (!s.has(x)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.pop = function () {
    var iterator, r;
    iterator = this.jsset.values();
    r = iterator.next();
    if (r.done) {
        throw new KeyError("pop from an empty set");
    }
    this.jsset.delete(r.value);
    return r.value;
};
ρσ_set.prototype.remove = (function() {
    var ρσ_anonfunc = function (x) {
        if (!this.jsset.delete(x)) {
            throw new KeyError(x.toString());
        }
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.symmetric_difference = (function() {
    var ρσ_anonfunc = function (other) {
        return this.union(other).difference(this.intersection(other));
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.symmetric_difference_update = (function() {
    var ρσ_anonfunc = function (other) {
        var common;
        common = this.intersection(other);
        this.update(other);
        this.difference_update(common);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_set.prototype.union = function () {
    var ans;
    ans = ρσ_set(this);
    ans.update.apply(ans, arguments);
    return ans;
};
ρσ_set.prototype.update = function () {
    var s, iterator, r;
    s = this.jsset;
    for (var i=0; i < arguments.length; i++) {
        iterator = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i][ρσ_iterator_symbol]();
        r = iterator.next();
        while (!r.done) {
            s.add(r.value);
            r = iterator.next();
        }
    }
};
ρσ_set.prototype.toString = ρσ_set.prototype.__repr__ = ρσ_set.prototype.__str__ = ρσ_set.prototype.inspect = function () {
    return "{" + list(this).join(", ") + "}";
};
ρσ_set.prototype.__eq__ = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r;
        if (!other instanceof this.constructor) {
            return false;
        }
        if (other.size !== this.size) {
            return false;
        }
        if (other.size === 0) {
            return true;
        }
        iterator = other[ρσ_iterator_symbol]();
        r = iterator.next();
        while (!r.done) {
            if (!this.has(r.value)) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
function ρσ_set_wrap(x) {
    var ans;
    ans = new ρσ_set;
    ans.jsset = x;
    return ans;
};
if (!ρσ_set_wrap.__argnames__) Object.defineProperties(ρσ_set_wrap, {
    __argnames__ : {value: ["x"]}
});

var set = ρσ_set, set_wrap = ρσ_set_wrap;
var ρσ_dict_implementation;
function ρσ_dict_polyfill() {
    this._store = {};
    this.size = 0;
};

ρσ_dict_polyfill.prototype.set = (function() {
    var ρσ_anonfunc = function (x, value) {
        var key;
        key = ρσ_set_keyfor(x);
        if (!Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size += 1;
        }
        (ρσ_expr_temp = this._store)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key] = [x, value];
        return this;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x", "value"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.clear = (function() {
    var ρσ_anonfunc = function (x) {
        this._store = {};
        this.size = 0;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.delete = (function() {
    var ρσ_anonfunc = function (x) {
        var key;
        key = ρσ_set_keyfor(x);
        if (Object.prototype.hasOwnProperty.call(this._store, key)) {
            this.size -= 1;
            delete this._store[key];
            return true;
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.has = (function() {
    var ρσ_anonfunc = function (x) {
        return Object.prototype.hasOwnProperty.call(this._store, ρσ_set_keyfor(x));
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.get = (function() {
    var ρσ_anonfunc = function (x) {
        try {
            return (ρσ_expr_temp = this._store)[ρσ_bound_index(ρσ_set_keyfor(x), ρσ_expr_temp)][1];
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            if (ρσ_Exception instanceof TypeError) {
                return undefined;
            } else {
                throw ρσ_Exception;
            }
        }
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.values = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]][1]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.keys = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]][0]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict_polyfill.prototype.entries = (function() {
    var ρσ_anonfunc = function (x) {
        var ans;
        ans = {'_keys': Object.keys(this._store), '_i':-1, '_s':this._store};
        ans[ρσ_iterator_symbol] = function () {
            return this;
        };
        ans["next"] = function () {
            this._i += 1;
            if (this._i >= this._keys.length) {
                return {'done': true};
            }
            return {'done':false, 'value':this._s[this._keys[this._i]]};
        };
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
if (typeof Map !== "function" || typeof Map.prototype.delete !== "function") {
    ρσ_dict_implementation = ρσ_dict_polyfill;
} else {
    ρσ_dict_implementation = Map;
}
function ρσ_dict() {
    var iterable = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
    var kw = arguments[arguments.length-1];
    if (kw === null || typeof kw !== "object" || kw [ρσ_kwargs_symbol] !== true) kw = {};
    if (this instanceof ρσ_dict) {
        this.jsmap = new ρσ_dict_implementation;
        if (iterable !== undefined) {
            this.update(iterable);
        }
        this.update(kw);
        return this;
    } else {
        return ρσ_interpolate_kwargs_constructor.call(Object.create(ρσ_dict.prototype), false, ρσ_dict, [iterable].concat([ρσ_desugar_kwargs(kw)]));
    }
};
if (!ρσ_dict.__handles_kwarg_interpolation__) Object.defineProperties(ρσ_dict, {
    __handles_kwarg_interpolation__ : {value: true},
    __argnames__ : {value: ["iterable"]}
});

ρσ_dict.prototype.__name__ = "dict";
Object.defineProperties(ρσ_dict.prototype, (function(){
    var ρσ_d = {};
    ρσ_d["length"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsmap.size;
        };
        return ρσ_d;
    }).call(this);
    ρσ_d["size"] = (function(){
        var ρσ_d = {};
        ρσ_d["get"] = function () {
            return this.jsmap.size;
        };
        return ρσ_d;
    }).call(this);
    return ρσ_d;
}).call(this));
ρσ_dict.prototype.__len__ = function () {
    return this.jsmap.size;
};
ρσ_dict.prototype.has = ρσ_dict.prototype.__contains__ = (function() {
    var ρσ_anonfunc = function (x) {
        return this.jsmap.has(x);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["x"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.set = ρσ_dict.prototype.__setitem__ = (function() {
    var ρσ_anonfunc = function (key, value) {
        this.jsmap.set(key, value);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "value"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.__delitem__ = (function() {
    var ρσ_anonfunc = function (key) {
        this.jsmap.delete(key);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.clear = function () {
    this.jsmap.clear();
};
ρσ_dict.prototype.copy = function () {
    return ρσ_dict(this);
};
ρσ_dict.prototype.keys = function () {
    return this.jsmap.keys();
};
ρσ_dict.prototype.values = function () {
    return this.jsmap.values();
};
ρσ_dict.prototype.items = ρσ_dict.prototype.entries = function () {
    return this.jsmap.entries();
};
ρσ_dict.prototype[ρσ_iterator_symbol] = function () {
    return this.jsmap.keys();
};
ρσ_dict.prototype.__getitem__ = (function() {
    var ρσ_anonfunc = function (key) {
        var ans;
        ans = this.jsmap.get(key);
        if (ans === undefined && !this.jsmap.has(key)) {
            throw new KeyError(key + "");
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.get = (function() {
    var ρσ_anonfunc = function (key, defval) {
        var ans;
        ans = this.jsmap.get(key);
        if (ans === undefined && !this.jsmap.has(key)) {
            return (defval === undefined) ? null : defval;
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "defval"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.set_default = (function() {
    var ρσ_anonfunc = function (key, defval) {
        var j;
        j = this.jsmap;
        if (!j.has(key)) {
            j.set(key, defval);
            return defval;
        }
        return j.get(key);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "defval"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.fromkeys = ρσ_dict.prototype.fromkeys = (function() {
    var ρσ_anonfunc = function () {
        var iterable = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
        var value = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? ρσ_anonfunc.__defaults__.value : arguments[1];
        var ρσ_kwargs_obj = arguments[arguments.length-1];
        if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
        if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "value")){
            value = ρσ_kwargs_obj.value;
        }
        var ans, iterator, r;
        ans = ρσ_dict();
        iterator = iter(iterable);
        r = iterator.next();
        while (!r.done) {
            ans.set(r.value, value);
            r = iterator.next();
        }
        return ans;
    };
    if (!ρσ_anonfunc.__defaults__) Object.defineProperties(ρσ_anonfunc, {
        __defaults__ : {value: {value:null}},
        __handles_kwarg_interpolation__ : {value: true},
        __argnames__ : {value: ["iterable", "value"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.pop = (function() {
    var ρσ_anonfunc = function (key, defval) {
        var ans;
        ans = this.jsmap.get(key);
        if (ans === undefined && !this.jsmap.has(key)) {
            if (defval === undefined) {
                throw new KeyError(key);
            }
            return defval;
        }
        this.jsmap.delete(key);
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["key", "defval"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.popitem = function () {
    var r;
    r = this.jsmap.entries().next();
    if (r.done) {
        throw new KeyError("dict is empty");
    }
    this.jsmap.delete(r.value[0]);
    return r.value;
};
ρσ_dict.prototype.update = function () {
    var m, iterable, iterator, result, keys;
    if (arguments.length === 0) {
        return;
    }
    m = this.jsmap;
    iterable = arguments[0];
    if (Array.isArray(iterable)) {
        for (var i = 0; i < iterable.length; i++) {
            m.set(iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i][0], iterable[(typeof i === "number" && i < 0) ? iterable.length + i : i][1]);
        }
    } else if (iterable instanceof ρσ_dict) {
        iterator = iterable.items();
        result = iterator.next();
        while (!result.done) {
            m.set(result.value[0], result.value[1]);
            result = iterator.next();
        }
    } else if (typeof Map === "function" && iterable instanceof Map) {
        iterator = iterable.entries();
        result = iterator.next();
        while (!result.done) {
            m.set(result.value[0], result.value[1]);
            result = iterator.next();
        }
    } else if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = iterable[ρσ_iterator_symbol]();
        result = iterator.next();
        while (!result.done) {
            m.set(result.value[0], result.value[1]);
            result = iterator.next();
        }
    } else {
        keys = Object.keys(iterable);
        for (var j=0; j < keys.length; j++) {
            if (keys[(typeof j === "number" && j < 0) ? keys.length + j : j] !== ρσ_iterator_symbol) {
                m.set(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], iterable[ρσ_bound_index(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], iterable)]);
            }
        }
    }
    if (arguments.length > 1) {
        ρσ_dict.prototype.update.call(this, arguments[1]);
    }
};
ρσ_dict.prototype.toString = ρσ_dict.prototype.inspect = ρσ_dict.prototype.__str__ = ρσ_dict.prototype.__repr__ = function () {
    var entries, iterator, r;
    entries = [];
    iterator = this.jsmap.entries();
    r = iterator.next();
    while (!r.done) {
        entries.push(ρσ_repr(r.value[0]) + ": " + ρσ_repr(r.value[1]));
        r = iterator.next();
    }
    return "{" + entries.join(", ") + "}";
};
ρσ_dict.prototype.__eq__ = (function() {
    var ρσ_anonfunc = function (other) {
        var iterator, r, x;
        if (!(other instanceof this.constructor)) {
            return false;
        }
        if (other.size !== this.size) {
            return false;
        }
        if (other.size === 0) {
            return true;
        }
        iterator = other.items();
        r = iterator.next();
        while (!r.done) {
            x = this.jsmap.get(r.value[0]);
            if (x === undefined && !this.jsmap.has(r.value[0]) || x !== r.value[1]) {
                return false;
            }
            r = iterator.next();
        }
        return true;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
ρσ_dict.prototype.as_object = (function() {
    var ρσ_anonfunc = function (other) {
        var ans, iterator, r;
        ans = {};
        iterator = this.jsmap.entries();
        r = iterator.next();
        while (!r.done) {
            ans[ρσ_bound_index(r.value[0], ans)] = r.value[1];
            r = iterator.next();
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["other"]}
    });
    return ρσ_anonfunc;
})();
function ρσ_dict_wrap(x) {
    var ans;
    ans = new ρσ_dict;
    ans.jsmap = x;
    return ans;
};
if (!ρσ_dict_wrap.__argnames__) Object.defineProperties(ρσ_dict_wrap, {
    __argnames__ : {value: ["x"]}
});

var dict = ρσ_dict, dict_wrap = ρσ_dict_wrap;// }}}
var NameError;
NameError = ReferenceError;
function Exception() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    Exception.prototype.__init__.apply(this, arguments);
}
ρσ_extends(Exception, Error);
Exception.prototype.__init__ = function __init__(message) {
    var self = this;
    self.message = message;
    self.stack = (new Error).stack;
    self.name = self.constructor.name;
};
if (!Exception.prototype.__init__.__argnames__) Object.defineProperties(Exception.prototype.__init__, {
    __argnames__ : {value: ["message"]}
});
Exception.__argnames__ = Exception.prototype.__init__.__argnames__;
Exception.__handles_kwarg_interpolation__ = Exception.prototype.__init__.__handles_kwarg_interpolation__;
Exception.prototype.__repr__ = function __repr__() {
    var self = this;
    return self.name + ": " + self.message;
};
Exception.prototype.__str__ = function __str__ () {
    if(Error.prototype.__str__) return Error.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(Exception.prototype, "__bases__", {value: [Error]});

function AttributeError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    AttributeError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(AttributeError, Exception);
AttributeError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
AttributeError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
AttributeError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(AttributeError.prototype, "__bases__", {value: [Exception]});


function IndexError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    IndexError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(IndexError, Exception);
IndexError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
IndexError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
IndexError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(IndexError.prototype, "__bases__", {value: [Exception]});


function KeyError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    KeyError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(KeyError, Exception);
KeyError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
KeyError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
KeyError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(KeyError.prototype, "__bases__", {value: [Exception]});


function ValueError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    ValueError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(ValueError, Exception);
ValueError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
ValueError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
ValueError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(ValueError.prototype, "__bases__", {value: [Exception]});


function UnicodeDecodeError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    UnicodeDecodeError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(UnicodeDecodeError, Exception);
UnicodeDecodeError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
UnicodeDecodeError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
UnicodeDecodeError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(UnicodeDecodeError.prototype, "__bases__", {value: [Exception]});


function AssertionError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    AssertionError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(AssertionError, Exception);
AssertionError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
AssertionError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
AssertionError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(AssertionError.prototype, "__bases__", {value: [Exception]});


function ZeroDivisionError() {
    if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
    ZeroDivisionError.prototype.__init__.apply(this, arguments);
}
ρσ_extends(ZeroDivisionError, Exception);
ZeroDivisionError.prototype.__init__ = function __init__ () {
    Exception.prototype.__init__ && Exception.prototype.__init__.apply(this, arguments);
};
ZeroDivisionError.prototype.__repr__ = function __repr__ () {
    if(Exception.prototype.__repr__) return Exception.prototype.__repr__.call(this);
    return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
};
ZeroDivisionError.prototype.__str__ = function __str__ () {
    if(Exception.prototype.__str__) return Exception.prototype.__str__.call(this);
return this.__repr__();
};
Object.defineProperty(ZeroDivisionError.prototype, "__bases__", {value: [Exception]});

var ρσ_in, ρσ_desugar_kwargs, ρσ_exists;
function ρσ_eslice(arr, step, start, end) {
    var is_string;
    if (typeof arr === "string" || arr instanceof String) {
        is_string = true;
        arr = arr.split("");
    }
    if (step < 0) {
        step = -step;
        arr = arr.slice().reverse();
        if (typeof start !== "undefined") {
            start = arr.length - start - 1;
        }
        if (typeof end !== "undefined") {
            end = arr.length - end - 1;
        }
    }
    if (typeof start === "undefined") {
        start = 0;
    }
    if (typeof end === "undefined") {
        end = arr.length;
    }
    arr = arr.slice(start, end).filter((function() {
        var ρσ_anonfunc = function (e, i) {
            return i % step === 0;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["e", "i"]}
        });
        return ρσ_anonfunc;
    })());
    if (is_string) {
        arr = arr.join("");
    }
    return arr;
};
if (!ρσ_eslice.__argnames__) Object.defineProperties(ρσ_eslice, {
    __argnames__ : {value: ["arr", "step", "start", "end"]}
});

function ρσ_delslice(arr, step, start, end) {
    var is_string, ρσ_unpack, indices;
    if (typeof arr === "string" || arr instanceof String) {
        is_string = true;
        arr = arr.split("");
    }
    if (step < 0) {
        if (typeof start === "undefined") {
            start = arr.length;
        }
        if (typeof end === "undefined") {
            end = 0;
        }
        ρσ_unpack = [end, start, -step];
        start = ρσ_unpack[0];
        end = ρσ_unpack[1];
        step = ρσ_unpack[2];
    }
    if (typeof start === "undefined") {
        start = 0;
    }
    if (typeof end === "undefined") {
        end = arr.length;
    }
    if (step === 1) {
        arr.splice(start, end - start);
    } else {
        if (end > start) {
            indices = [];
            for (var i = start; i < end; i += step) {
                indices.push(i);
            }
            for (var i = indices.length - 1; i >= 0; i--) {
                arr.splice(indices[(typeof i === "number" && i < 0) ? indices.length + i : i], 1);
            }
        }
    }
    if (is_string) {
        arr = arr.join("");
    }
    return arr;
};
if (!ρσ_delslice.__argnames__) Object.defineProperties(ρσ_delslice, {
    __argnames__ : {value: ["arr", "step", "start", "end"]}
});

function ρσ_flatten(arr) {
    var ans, value;
    ans = ρσ_list_decorate([]);
    for (var i=0; i < arr.length; i++) {
        value = arr[(typeof i === "number" && i < 0) ? arr.length + i : i];
        if (Array.isArray(value)) {
            ans = ans.concat(ρσ_flatten(value));
        } else {
            ans.push(value);
        }
    }
    return ans;
};
if (!ρσ_flatten.__argnames__) Object.defineProperties(ρσ_flatten, {
    __argnames__ : {value: ["arr"]}
});

function ρσ_unpack_asarray(num, iterable) {
    var ans, iterator, result;
    if (ρσ_arraylike(iterable)) {
        return iterable;
    }
    ans = [];
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        result = iterator.next();
        while (!result.done && ans.length < num) {
            ans.push(result.value);
            result = iterator.next();
        }
    }
    return ans;
};
if (!ρσ_unpack_asarray.__argnames__) Object.defineProperties(ρσ_unpack_asarray, {
    __argnames__ : {value: ["num", "iterable"]}
});

function ρσ_extends(child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};
if (!ρσ_extends.__argnames__) Object.defineProperties(ρσ_extends, {
    __argnames__ : {value: ["child", "parent"]}
});

ρσ_in = function () {
    if (typeof Map === "function" && typeof Set === "function") {
        return (function() {
            var ρσ_anonfunc = function (val, arr) {
                if (typeof arr === "string") {
                    return arr.indexOf(val) !== -1;
                }
                if (typeof arr.__contains__ === "function") {
                    return arr.__contains__(val);
                }
                if (arr instanceof Map || arr instanceof Set) {
                    return arr.has(val);
                }
                if (ρσ_arraylike(arr)) {
                    return ρσ_list_contains.call(arr, val);
                }
                return Object.prototype.hasOwnProperty.call(arr, val);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["val", "arr"]}
            });
            return ρσ_anonfunc;
        })();
    }
    return (function() {
        var ρσ_anonfunc = function (val, arr) {
            if (typeof arr === "string") {
                return arr.indexOf(val) !== -1;
            }
            if (typeof arr.__contains__ === "function") {
                return arr.__contains__(val);
            }
            if (ρσ_arraylike(arr)) {
                return ρσ_list_contains.call(arr, val);
            }
            return Object.prototype.hasOwnProperty.call(arr, val);
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["val", "arr"]}
        });
        return ρσ_anonfunc;
    })();
}();
function ρσ_Iterable(iterable) {
    var iterator, ans, result;
    if (ρσ_arraylike(iterable)) {
        return iterable;
    }
    if (typeof iterable[ρσ_iterator_symbol] === "function") {
        iterator = (typeof Map === "function" && iterable instanceof Map) ? iterable.keys() : iterable[ρσ_iterator_symbol]();
        ans = ρσ_list_decorate([]);
        result = iterator.next();
        while (!result.done) {
            ans.push(result.value);
            result = iterator.next();
        }
        return ans;
    }
    return Object.keys(iterable);
};
if (!ρσ_Iterable.__argnames__) Object.defineProperties(ρσ_Iterable, {
    __argnames__ : {value: ["iterable"]}
});

ρσ_desugar_kwargs = function () {
    if (typeof Object.assign === "function") {
        return function () {
            var ans;
            ans = Object.create(null);
            ans[ρσ_kwargs_symbol] = true;
            for (var i = 0; i < arguments.length; i++) {
                Object.assign(ans, arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
            }
            return ans;
        };
    }
    return function () {
        var ans, keys;
        ans = Object.create(null);
        ans[ρσ_kwargs_symbol] = true;
        for (var i = 0; i < arguments.length; i++) {
            keys = Object.keys(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
            for (var j = 0; j < keys.length; j++) {
                ans[ρσ_bound_index(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], ans)] = (ρσ_expr_temp = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i])[ρσ_bound_index(keys[(typeof j === "number" && j < 0) ? keys.length + j : j], ρσ_expr_temp)];
            }
        }
        return ans;
    };
}();
function ρσ_interpolate_kwargs(f, supplied_args) {
    var has_prop, kwobj, args, prop;
    if (!f.__argnames__) {
        return f.apply(this, supplied_args);
    }
    has_prop = Object.prototype.hasOwnProperty;
    kwobj = supplied_args.pop();
    if (f.__handles_kwarg_interpolation__) {
        args = new Array(Math.max(supplied_args.length, f.__argnames__.length) + 1);
        args[args.length-1] = kwobj;
        for (var i = 0; i < args.length - 1; i++) {
            if (i < f.__argnames__.length) {
                prop = (ρσ_expr_temp = f.__argnames__)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
                if (has_prop.call(kwobj, prop)) {
                    args[(typeof i === "number" && i < 0) ? args.length + i : i] = kwobj[(typeof prop === "number" && prop < 0) ? kwobj.length + prop : prop];
                    delete kwobj[prop];
                } else if (i < supplied_args.length) {
                    args[(typeof i === "number" && i < 0) ? args.length + i : i] = supplied_args[(typeof i === "number" && i < 0) ? supplied_args.length + i : i];
                }
            } else {
                args[(typeof i === "number" && i < 0) ? args.length + i : i] = supplied_args[(typeof i === "number" && i < 0) ? supplied_args.length + i : i];
            }
        }
        return f.apply(this, args);
    }
    for (var i = 0; i < f.__argnames__.length; i++) {
        prop = (ρσ_expr_temp = f.__argnames__)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
        if (has_prop.call(kwobj, prop)) {
            supplied_args[(typeof i === "number" && i < 0) ? supplied_args.length + i : i] = kwobj[(typeof prop === "number" && prop < 0) ? kwobj.length + prop : prop];
        }
    }
    return f.apply(this, supplied_args);
};
if (!ρσ_interpolate_kwargs.__argnames__) Object.defineProperties(ρσ_interpolate_kwargs, {
    __argnames__ : {value: ["f", "supplied_args"]}
});

function ρσ_interpolate_kwargs_constructor(apply, f, supplied_args) {
    if (apply) {
        f.apply(this, supplied_args);
    } else {
        ρσ_interpolate_kwargs.call(this, f, supplied_args);
    }
    return this;
};
if (!ρσ_interpolate_kwargs_constructor.__argnames__) Object.defineProperties(ρσ_interpolate_kwargs_constructor, {
    __argnames__ : {value: ["apply", "f", "supplied_args"]}
});

function ρσ_getitem(obj, key) {
    if (obj.__getitem__) {
        return obj.__getitem__(key);
    }
    if (typeof key === "number" && key < 0) {
        key += obj.length;
    }
    return obj[(typeof key === "number" && key < 0) ? obj.length + key : key];
};
if (!ρσ_getitem.__argnames__) Object.defineProperties(ρσ_getitem, {
    __argnames__ : {value: ["obj", "key"]}
});

function ρσ_setitem(obj, key, val) {
    if (obj.__setitem__) {
        obj.__setitem__(key, val);
    } else {
        if (typeof key === "number" && key < 0) {
            key += obj.length;
        }
        obj[(typeof key === "number" && key < 0) ? obj.length + key : key] = val;
    }
};
if (!ρσ_setitem.__argnames__) Object.defineProperties(ρσ_setitem, {
    __argnames__ : {value: ["obj", "key", "val"]}
});

function ρσ_delitem(obj, key) {
    if (obj.__delitem__) {
        obj.__delitem__(key);
    } else if (typeof obj.splice === "function") {
        obj.splice(key, 1);
    } else {
        if (typeof key === "number" && key < 0) {
            key += obj.length;
        }
        delete obj[key];
    }
};
if (!ρσ_delitem.__argnames__) Object.defineProperties(ρσ_delitem, {
    __argnames__ : {value: ["obj", "key"]}
});

function ρσ_bound_index(idx, arr) {
    if (typeof idx === "number" && idx < 0) {
        idx += arr.length;
    }
    return idx;
};
if (!ρσ_bound_index.__argnames__) Object.defineProperties(ρσ_bound_index, {
    __argnames__ : {value: ["idx", "arr"]}
});

function ρσ_splice(arr, val, start, end) {
    start = start || 0;
    if (start < 0) {
        start += arr.length;
    }
    if (end === undefined) {
        end = arr.length;
    }
    if (end < 0) {
        end += arr.length;
    }
    Array.prototype.splice.apply(arr, [start, end - start].concat(val));
};
if (!ρσ_splice.__argnames__) Object.defineProperties(ρσ_splice, {
    __argnames__ : {value: ["arr", "val", "start", "end"]}
});

ρσ_exists = (function(){
    var ρσ_d = {};
    ρσ_d["n"] = (function() {
        var ρσ_anonfunc = function (expr) {
            return expr !== undefined && expr !== null;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["d"] = (function() {
        var ρσ_anonfunc = function (expr) {
            if (expr === undefined || expr === null) {
                return Object.create(null);
            }
            return expr;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["c"] = (function() {
        var ρσ_anonfunc = function (expr) {
            if (typeof expr === "function") {
                return expr;
            }
            return function () {
                return undefined;
            };
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["g"] = (function() {
        var ρσ_anonfunc = function (expr) {
            if (expr === undefined || expr === null || typeof expr.__getitem__ !== "function") {
                return (function(){
                    var ρσ_d = {};
                    ρσ_d["__getitem__"] = function () {
                        return undefined;
                    };
                    return ρσ_d;
                }).call(this);
            }
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr"]}
        });
        return ρσ_anonfunc;
    })();
    ρσ_d["e"] = (function() {
        var ρσ_anonfunc = function (expr, alt) {
            return (expr === undefined || expr === null) ? alt : expr;
        };
        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
            __argnames__ : {value: ["expr", "alt"]}
        });
        return ρσ_anonfunc;
    })();
    return ρσ_d;
}).call(this);
function ρσ_mixin() {
    var seen, resolved_props, p, target, props, name;
    seen = Object.create(null);
    seen.__argnames__ = seen.__handles_kwarg_interpolation__ = seen.__init__ = seen.__annotations__ = seen.__doc__ = seen.__bind_methods__ = seen.__bases__ = seen.constructor = seen.__class__ = true;
    resolved_props = {};
    p = target = arguments[0].prototype;
    while (p && p !== Object.prototype) {
        props = Object.getOwnPropertyNames(p);
        for (var i = 0; i < props.length; i++) {
            seen[ρσ_bound_index(props[(typeof i === "number" && i < 0) ? props.length + i : i], seen)] = true;
        }
        p = Object.getPrototypeOf(p);
    }
    for (var c = 1; c < arguments.length; c++) {
        p = arguments[(typeof c === "number" && c < 0) ? arguments.length + c : c].prototype;
        while (p && p !== Object.prototype) {
            props = Object.getOwnPropertyNames(p);
            for (var i = 0; i < props.length; i++) {
                name = props[(typeof i === "number" && i < 0) ? props.length + i : i];
                if (seen[(typeof name === "number" && name < 0) ? seen.length + name : name]) {
                    continue;
                }
                seen[(typeof name === "number" && name < 0) ? seen.length + name : name] = true;
                resolved_props[(typeof name === "number" && name < 0) ? resolved_props.length + name : name] = Object.getOwnPropertyDescriptor(p, name);
            }
            p = Object.getPrototypeOf(p);
        }
    }
    Object.defineProperties(target, resolved_props);
};

function ρσ_instanceof() {
    var obj, bases, q, cls, p;
    obj = arguments[0];
    bases = "";
    if (obj && obj.constructor && obj.constructor.prototype) {
        bases = obj.constructor.prototype.__bases__ || "";
    }
    for (var i = 1; i < arguments.length; i++) {
        q = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i];
        if (obj instanceof q) {
            return true;
        }
        if ((q === Array || q === ρσ_list_constructor) && Array.isArray(obj)) {
            return true;
        }
        if (q === ρσ_str && (typeof obj === "string" || obj instanceof String)) {
            return true;
        }
        if (bases.length > 1) {
            for (var c = 1; c < bases.length; c++) {
                cls = bases[(typeof c === "number" && c < 0) ? bases.length + c : c];
                while (cls) {
                    if (q === cls) {
                        return true;
                    }
                    p = Object.getPrototypeOf(cls.prototype);
                    if (!p) {
                        break;
                    }
                    cls = p.constructor;
                }
            }
        }
    }
    return false;
};
function sum(iterable, start) {
    var ans, iterator, r;
    if (Array.isArray(iterable)) {
        return iterable.reduce((function() {
            var ρσ_anonfunc = function (prev, cur) {
                return prev + cur;
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["prev", "cur"]}
            });
            return ρσ_anonfunc;
        })(), start || 0);
    }
    ans = start || 0;
    iterator = iter(iterable);
    r = iterator.next();
    while (!r.done) {
        ans += r.value;
        r = iterator.next();
    }
    return ans;
};
if (!sum.__argnames__) Object.defineProperties(sum, {
    __argnames__ : {value: ["iterable", "start"]}
});

function map() {
    var iterators, func, args, ans;
    iterators = new Array(arguments.length - 1);
    func = arguments[0];
    args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
        iterators[ρσ_bound_index(i - 1, iterators)] = iter(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
    }
    ans = {'_func':func, '_iterators':iterators, '_args':args};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    ans["next"] = function () {
        var r;
        for (var i = 0; i < this._iterators.length; i++) {
            r = (ρσ_expr_temp = this._iterators)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i].next();
            if (r.done) {
                return {'done':true};
            }
            (ρσ_expr_temp = this._args)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = r.value;
        }
        return {'done':false, 'value':this._func.apply(undefined, this._args)};
    };
    return ans;
};

function filter(func_or_none, iterable) {
    var func, ans;
    func = (func_or_none === null) ? ρσ_bool : func_or_none;
    ans = {'_func':func, '_iterator':ρσ_iter(iterable)};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    ans["next"] = function () {
        var r;
        r = this._iterator.next();
        while (!r.done) {
            if (this._func(r.value)) {
                return r;
            }
            r = this._iterator.next();
        }
        return {'done':true};
    };
    return ans;
};
if (!filter.__argnames__) Object.defineProperties(filter, {
    __argnames__ : {value: ["func_or_none", "iterable"]}
});

function zip() {
    var iterators, ans;
    iterators = new Array(arguments.length);
    for (var i = 0; i < arguments.length; i++) {
        iterators[(typeof i === "number" && i < 0) ? iterators.length + i : i] = iter(arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i]);
    }
    ans = {'_iterators':iterators};
    ans[ρσ_iterator_symbol] = function () {
        return this;
    };
    ans["next"] = function () {
        var args, r;
        args = new Array(this._iterators.length);
        for (var i = 0; i < this._iterators.length; i++) {
            r = (ρσ_expr_temp = this._iterators)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i].next();
            if (r.done) {
                return {'done':true};
            }
            args[(typeof i === "number" && i < 0) ? args.length + i : i] = r.value;
        }
        return {'done':false, 'value':args};
    };
    return ans;
};

function any(iterable) {
    var i;
    var ρσ_Iter0 = ρσ_Iterable(iterable);
    for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
        i = ρσ_Iter0[ρσ_Index0];
        if (i) {
            return true;
        }
    }
    return false;
};
if (!any.__argnames__) Object.defineProperties(any, {
    __argnames__ : {value: ["iterable"]}
});

function all(iterable) {
    var i;
    var ρσ_Iter1 = ρσ_Iterable(iterable);
    for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
        i = ρσ_Iter1[ρσ_Index1];
        if (!i) {
            return false;
        }
    }
    return true;
};
if (!all.__argnames__) Object.defineProperties(all, {
    __argnames__ : {value: ["iterable"]}
});
var decimal_sep, define_str_func, ρσ_unpack, ρσ_orig_split, ρσ_orig_replace;
decimal_sep = 1.1.toLocaleString()[1];
function ρσ_repr_js_builtin(x, as_array) {
    var ans, b, keys, key;
    ans = [];
    b = "{}";
    if (as_array) {
        b = "[]";
        for (var i = 0; i < x.length; i++) {
            ans.push(ρσ_repr(x[(typeof i === "number" && i < 0) ? x.length + i : i]));
        }
    } else {
        keys = Object.keys(x);
        for (var k = 0; k < keys.length; k++) {
            key = keys[(typeof k === "number" && k < 0) ? keys.length + k : k];
            ans.push(JSON.stringify(key) + ":" + ρσ_repr(x[(typeof key === "number" && key < 0) ? x.length + key : key]));
        }
    }
    return b[0] + ans.join(", ") + b[1];
};
if (!ρσ_repr_js_builtin.__argnames__) Object.defineProperties(ρσ_repr_js_builtin, {
    __argnames__ : {value: ["x", "as_array"]}
});

function ρσ_html_element_to_string(elem) {
    var attrs, val, attr, ans;
    attrs = [];
    var ρσ_Iter0 = ρσ_Iterable(elem.attributes);
    for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
        attr = ρσ_Iter0[ρσ_Index0];
        if (attr.specified) {
            val = attr.value;
            if (val.length > 10) {
                val = val.slice(0, 15) + "...";
            }
            val = JSON.stringify(val);
            attrs.push("" + ρσ_str.format("{}", attr.name) + "=" + ρσ_str.format("{}", val) + "");
        }
    }
    attrs = (attrs.length) ? " " + attrs.join(" ") : "";
    ans = "<" + ρσ_str.format("{}", elem.tagName) + "" + ρσ_str.format("{}", attrs) + ">";
    return ans;
};
if (!ρσ_html_element_to_string.__argnames__) Object.defineProperties(ρσ_html_element_to_string, {
    __argnames__ : {value: ["elem"]}
});

function ρσ_repr(x) {
    var ans, name;
    if (x === null) {
        return "None";
    }
    if (x === undefined) {
        return "undefined";
    }
    ans = x;
    if (typeof x.__repr__ === "function") {
        ans = x.__repr__();
    } else if (x === true || x === false) {
        ans = (x) ? "True" : "False";
    } else if (Array.isArray(x)) {
        ans = ρσ_repr_js_builtin(x, true);
    } else if (typeof x === "function") {
        ans = x.toString();
    } else if (typeof x === "object" && !x.toString) {
        ans = ρσ_repr_js_builtin(x);
    } else {
        name = Object.prototype.toString.call(x).slice(8, -1);
        if (ρσ_not_equals("Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".indexOf(name), -1)) {
            return name + "([" + x.map((function() {
                var ρσ_anonfunc = function (i) {
                    return str.format("0x{:02x}", i);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["i"]}
                });
                return ρσ_anonfunc;
            })()).join(", ") + "])";
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
            ans = ρσ_html_element_to_string(x);
        } else {
            ans = (typeof x.toString === "function") ? x.toString() : x;
        }
        if (ans === "[object Object]") {
            return ρσ_repr_js_builtin(x);
        }
        try {
            ans = JSON.stringify(x);
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            {
            } 
        }
    }
    return ans + "";
};
if (!ρσ_repr.__argnames__) Object.defineProperties(ρσ_repr, {
    __argnames__ : {value: ["x"]}
});

function ρσ_str(x) {
    var ans, name;
    if (x === null) {
        return "None";
    }
    if (x === undefined) {
        return "undefined";
    }
    ans = x;
    if (typeof x.__str__ === "function") {
        ans = x.__str__();
    } else if (typeof x.__repr__ === "function") {
        ans = x.__repr__();
    } else if (x === true || x === false) {
        ans = (x) ? "True" : "False";
    } else if (Array.isArray(x)) {
        ans = ρσ_repr_js_builtin(x, true);
    } else if (typeof x.toString === "function") {
        name = Object.prototype.toString.call(x).slice(8, -1);
        if (ρσ_not_equals("Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".indexOf(name), -1)) {
            return name + "([" + x.map((function() {
                var ρσ_anonfunc = function (i) {
                    return str.format("0x{:02x}", i);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["i"]}
                });
                return ρσ_anonfunc;
            })()).join(", ") + "])";
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
            ans = ρσ_html_element_to_string(x);
        } else {
            ans = x.toString();
        }
        if (ans === "[object Object]") {
            ans = ρσ_repr_js_builtin(x);
        }
    } else if (typeof x === "object" && !x.toString) {
        ans = ρσ_repr_js_builtin(x);
    }
    return ans + "";
};
if (!ρσ_str.__argnames__) Object.defineProperties(ρσ_str, {
    __argnames__ : {value: ["x"]}
});

define_str_func = (function() {
    var ρσ_anonfunc = function (name, func) {
        var f;
        (ρσ_expr_temp = ρσ_str.prototype)[(typeof name === "number" && name < 0) ? ρσ_expr_temp.length + name : name] = func;
        ρσ_str[(typeof name === "number" && name < 0) ? ρσ_str.length + name : name] = f = func.call.bind(func);
        if (func.__argnames__) {
            Object.defineProperty(f, "__argnames__", (function(){
                var ρσ_d = {};
                ρσ_d["value"] = ['string'].concat(func.__argnames__);
                return ρσ_d;
            }).call(this));
        }
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["name", "func"]}
    });
    return ρσ_anonfunc;
})();
ρσ_unpack = [String.prototype.split.call.bind(String.prototype.split), String.prototype.replace.call.bind(String.prototype.replace)];
ρσ_orig_split = ρσ_unpack[0];
ρσ_orig_replace = ρσ_unpack[1];
define_str_func("format", function () {
    var template, args, kwargs, explicit, implicit, idx, split, ans, pos, in_brace, markup, ch;
    template = this;
    if (template === undefined) {
        throw new TypeError("Template is required");
    }
    args = Array.prototype.slice.call(arguments);
    kwargs = {};
    if (args[args.length-1] && args[args.length-1][ρσ_kwargs_symbol] !== undefined) {
        kwargs = args[args.length-1];
        args = args.slice(0, -1);
    }
    explicit = implicit = false;
    idx = 0;
    split = ρσ_orig_split;
    if (ρσ_str.format._template_resolve_pat === undefined) {
        ρσ_str.format._template_resolve_pat = /[.\[]/;
    }
    function resolve(arg, object) {
        var ρσ_unpack, first, key, rest, ans;
        if (!arg) {
            return object;
        }
        ρσ_unpack = [arg[0], arg.slice(1)];
        first = ρσ_unpack[0];
        arg = ρσ_unpack[1];
        key = split(arg, ρσ_str.format._template_resolve_pat, 1)[0];
        rest = arg.slice(key.length);
        ans = (first === "[") ? object[ρσ_bound_index(key.slice(0, -1), object)] : getattr(object, key);
        if (ans === undefined) {
            throw new KeyError((first === "[") ? key.slice(0, -1) : key);
        }
        return resolve(rest, ans);
    };
    if (!resolve.__argnames__) Object.defineProperties(resolve, {
        __argnames__ : {value: ["arg", "object"]}
    });

    function resolve_format_spec(format_spec) {
        if (ρσ_str.format._template_resolve_fs_pat === undefined) {
            ρσ_str.format._template_resolve_fs_pat = /[{]([a-zA-Z0-9_]+)[}]/g;
        }
        return format_spec.replace(ρσ_str.format._template_resolve_fs_pat, (function() {
            var ρσ_anonfunc = function (match, key) {
                if (!Object.prototype.hasOwnProperty.call(kwargs, key)) {
                    return "";
                }
                return "" + kwargs[(typeof key === "number" && key < 0) ? kwargs.length + key : key];
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["match", "key"]}
            });
            return ρσ_anonfunc;
        })());
    };
    if (!resolve_format_spec.__argnames__) Object.defineProperties(resolve_format_spec, {
        __argnames__ : {value: ["format_spec"]}
    });

    function set_comma(ans, comma) {
        var sep;
        if (comma !== ",") {
            sep = 1234;
            sep = sep.toLocaleString(undefined, {useGrouping: true})[1];
            ans = str.replace(ans, sep, comma);
        }
        return ans;
    };
    if (!set_comma.__argnames__) Object.defineProperties(set_comma, {
        __argnames__ : {value: ["ans", "comma"]}
    });

    function safe_comma(value, comma) {
        try {
            return set_comma(value.toLocaleString(undefined, {useGrouping: true}), comma);
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            {
                return value.toString(10);
            } 
        }
    };
    if (!safe_comma.__argnames__) Object.defineProperties(safe_comma, {
        __argnames__ : {value: ["value", "comma"]}
    });

    function safe_fixed(value, precision, comma) {
        if (!comma) {
            return value.toFixed(precision);
        }
        try {
            return set_comma(value.toLocaleString(undefined, {useGrouping: true, minimumFractionDigits: precision, maximumFractionDigits: precision}), comma);
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            {
                return value.toFixed(precision);
            } 
        }
    };
    if (!safe_fixed.__argnames__) Object.defineProperties(safe_fixed, {
        __argnames__ : {value: ["value", "precision", "comma"]}
    });

    function apply_formatting(value, format_spec) {
        var ρσ_unpack, fill, align, sign, fhash, zeropad, width, comma, precision, ftype, is_numeric, is_int, lftype, code, prec, exp, nval, is_positive, left, right;
        if (format_spec.indexOf("{") !== -1) {
            format_spec = resolve_format_spec(format_spec);
        }
        if (ρσ_str.format._template_format_pat === undefined) {
            ρσ_str.format._template_format_pat = /([^{}](?=[<>=^]))?([<>=^])?([-+\x20])?(\#)?(0)?(\d+)?([,_])?(?:\.(\d+))?([bcdeEfFgGnosxX%])?/;
        }
        try {
            ρσ_unpack = format_spec.match(ρσ_str.format._template_format_pat).slice(1);
ρσ_unpack = ρσ_unpack_asarray(9, ρσ_unpack);
            fill = ρσ_unpack[0];
            align = ρσ_unpack[1];
            sign = ρσ_unpack[2];
            fhash = ρσ_unpack[3];
            zeropad = ρσ_unpack[4];
            width = ρσ_unpack[5];
            comma = ρσ_unpack[6];
            precision = ρσ_unpack[7];
            ftype = ρσ_unpack[8];
        } catch (ρσ_Exception) {
            ρσ_last_exception = ρσ_Exception;
            if (ρσ_Exception instanceof TypeError) {
                return value;
            } else {
                throw ρσ_Exception;
            }
        }
        if (zeropad) {
            fill = fill || "0";
            align = align || "=";
        } else {
            fill = fill || " ";
            align = align || ">";
        }
        is_numeric = Number(value) === value;
        is_int = is_numeric && value % 1 === 0;
        precision = parseInt(precision, 10);
        lftype = (ftype || "").toLowerCase();
        if (ftype === "n") {
            is_numeric = true;
            if (is_int) {
                if (comma) {
                    throw new ValueError("Cannot specify ',' with 'n'");
                }
                value = parseInt(value, 10).toLocaleString();
            } else {
                value = parseFloat(value).toLocaleString();
            }
        } else if (['b', 'c', 'd', 'o', 'x'].indexOf(lftype) !== -1) {
            value = parseInt(value, 10);
            is_numeric = true;
            if (!isNaN(value)) {
                if (ftype === "b") {
                    value = (value >>> 0).toString(2);
                    if (fhash) {
                        value = "0b" + value;
                    }
                } else if (ftype === "c") {
                    if (value > 65535) {
                        code = value - 65536;
                        value = String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
                    } else {
                        value = String.fromCharCode(value);
                    }
                } else if (ftype === "d") {
                    if (comma) {
                        value = safe_comma(value, comma);
                    } else {
                        value = value.toString(10);
                    }
                } else if (ftype === "o") {
                    value = value.toString(8);
                    if (fhash) {
                        value = "0o" + value;
                    }
                } else if (lftype === "x") {
                    value = value.toString(16);
                    value = (ftype === "x") ? value.toLowerCase() : value.toUpperCase();
                    if (fhash) {
                        value = "0x" + value;
                    }
                }
            }
        } else if (['e','f','g','%'].indexOf(lftype) !== -1) {
            is_numeric = true;
            value = parseFloat(value);
            prec = (isNaN(precision)) ? 6 : precision;
            if (lftype === "e") {
                value = value.toExponential(prec);
                value = (ftype === "E") ? value.toUpperCase() : value.toLowerCase();
            } else if (lftype === "f") {
                value = safe_fixed(value, prec, comma);
                value = (ftype === "F") ? value.toUpperCase() : value.toLowerCase();
            } else if (lftype === "%") {
                value *= 100;
                value = safe_fixed(value, prec, comma) + "%";
            } else if (lftype === "g") {
                prec = max(1, prec);
                exp = parseInt(split(value.toExponential(prec - 1).toLowerCase(), "e")[1], 10);
                if (-4 <= exp && exp < prec) {
                    value = safe_fixed(value, prec - 1 - exp, comma);
                } else {
                    value = value.toExponential(prec - 1);
                }
                value = value.replace(/0+$/g, "");
                if (value[value.length-1] === decimal_sep) {
                    value = value.slice(0, -1);
                }
                if (ftype === "G") {
                    value = value.toUpperCase();
                }
            }
        } else {
            if (comma) {
                value = parseInt(value, 10);
                if (isNaN(value)) {
                    throw new ValueError("Must use numbers with , or _");
                }
                value = safe_comma(value, comma);
            }
            value += "";
            if (!isNaN(precision)) {
                value = value.slice(0, precision);
            }
        }
        value += "";
        if (is_numeric && sign) {
            nval = Number(value);
            is_positive = !isNaN(nval) && nval >= 0;
            if (is_positive && (sign === " " || sign === "+")) {
                value = sign + value;
            }
        }
        function repeat(char, num) {
            return (new Array(num+1)).join(char);
        };
        if (!repeat.__argnames__) Object.defineProperties(repeat, {
            __argnames__ : {value: ["char", "num"]}
        });

        if (is_numeric && width && width[0] === "0") {
            width = width.slice(1);
            ρσ_unpack = ["0", "="];
            fill = ρσ_unpack[0];
            align = ρσ_unpack[1];
        }
        width = parseInt(width || "-1", 10);
        if (isNaN(width)) {
            throw new ValueError("Invalid width specification: " + width);
        }
        if (fill && value.length < width) {
            if (align === "<") {
                value = value + repeat(fill, width - value.length);
            } else if (align === ">") {
                value = repeat(fill, width - value.length) + value;
            } else if (align === "^") {
                left = Math.floor((width - value.length) / 2);
                right = width - left - value.length;
                value = repeat(fill, left) + value + repeat(fill, right);
            } else if (align === "=") {
                if (ρσ_in(value[0], "+- ")) {
                    value = value[0] + repeat(fill, width - value.length) + value.slice(1);
                } else {
                    value = repeat(fill, width - value.length) + value;
                }
            } else {
                throw new ValueError("Unrecognized alignment: " + align);
            }
        }
        return value;
    };
    if (!apply_formatting.__argnames__) Object.defineProperties(apply_formatting, {
        __argnames__ : {value: ["value", "format_spec"]}
    });

    function parse_markup(markup) {
        var key, transformer, format_spec, pos, state, ch;
        key = transformer = format_spec = "";
        pos = 0;
        state = 0;
        while (pos < markup.length) {
            ch = markup[(typeof pos === "number" && pos < 0) ? markup.length + pos : pos];
            if (state === 0) {
                if (ch === "!") {
                    state = 1;
                } else if (ch === ":") {
                    state = 2;
                } else {
                    key += ch;
                }
            } else if (state === 1) {
                if (ch === ":") {
                    state = 2;
                } else {
                    transformer += ch;
                }
            } else {
                format_spec += ch;
            }
            pos += 1;
        }
        return [key, transformer, format_spec];
    };
    if (!parse_markup.__argnames__) Object.defineProperties(parse_markup, {
        __argnames__ : {value: ["markup"]}
    });

    function render_markup(markup) {
        var ρσ_unpack, key, transformer, format_spec, lkey, nvalue, object, ans;
        ρσ_unpack = parse_markup(markup);
ρσ_unpack = ρσ_unpack_asarray(3, ρσ_unpack);
        key = ρσ_unpack[0];
        transformer = ρσ_unpack[1];
        format_spec = ρσ_unpack[2];
        if (transformer && ['a', 'r', 's'].indexOf(transformer) === -1) {
            throw new ValueError("Unknown conversion specifier: " + transformer);
        }
        lkey = key.length && split(key, /[.\[]/, 1)[0];
        if (lkey) {
            explicit = true;
            if (implicit) {
                throw new ValueError("cannot switch from automatic field numbering to manual field specification");
            }
            nvalue = parseInt(lkey);
            object = (isNaN(nvalue)) ? kwargs[(typeof lkey === "number" && lkey < 0) ? kwargs.length + lkey : lkey] : args[(typeof nvalue === "number" && nvalue < 0) ? args.length + nvalue : nvalue];
            if (object === undefined) {
                if (isNaN(nvalue)) {
                    throw new KeyError(lkey);
                }
                throw new IndexError(lkey);
            }
            object = resolve(key.slice(lkey.length), object);
        } else {
            implicit = true;
            if (explicit) {
                throw new ValueError("cannot switch from manual field specification to automatic field numbering");
            }
            if (idx >= args.length) {
                throw new IndexError("Not enough arguments to match template: " + template);
            }
            object = args[(typeof idx === "number" && idx < 0) ? args.length + idx : idx];
            idx += 1;
        }
        if (typeof object === "function") {
            object = object();
        }
        ans = "" + object;
        if (format_spec) {
            ans = apply_formatting(ans, format_spec);
        }
        return ans;
    };
    if (!render_markup.__argnames__) Object.defineProperties(render_markup, {
        __argnames__ : {value: ["markup"]}
    });

    ans = "";
    pos = 0;
    in_brace = 0;
    markup = "";
    while (pos < template.length) {
        ch = template[(typeof pos === "number" && pos < 0) ? template.length + pos : pos];
        if (in_brace) {
            if (ch === "{") {
                in_brace += 1;
                markup += "{";
            } else if (ch === "}") {
                in_brace -= 1;
                if (in_brace > 0) {
                    markup += "}";
                } else {
                    ans += render_markup(markup);
                }
            } else {
                markup += ch;
            }
        } else {
            if (ch === "{") {
                if (template[ρσ_bound_index(pos + 1, template)] === "{") {
                    pos += 1;
                    ans += "{";
                } else {
                    in_brace = 1;
                    markup = "";
                }
            } else {
                ans += ch;
                if (ch === "}" && template[ρσ_bound_index(pos + 1, template)] === "}") {
                    pos += 1;
                }
            }
        }
        pos += 1;
    }
    if (in_brace) {
        throw new ValueError("expected '}' before end of string");
    }
    return ans;
});
define_str_func("capitalize", function () {
    var string;
    string = this;
    if (string) {
        string = string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
    return string;
});
define_str_func("center", (function() {
    var ρσ_anonfunc = function (width, fill) {
        var left, right;
        left = Math.floor((width - this.length) / 2);
        right = width - left - this.length;
        fill = fill || " ";
        return new Array(left+1).join(fill) + this + new Array(right+1).join(fill);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width", "fill"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("count", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var string, ρσ_unpack, pos, step, ans;
        string = this;
        start = start || 0;
        end = end || string.length;
        if (start < 0 || end < 0) {
            string = string.slice(start, end);
            ρσ_unpack = [0, string.length];
            start = ρσ_unpack[0];
            end = ρσ_unpack[1];
        }
        pos = start;
        step = needle.length;
        if (!step) {
            return 0;
        }
        ans = 0;
        while (pos !== -1) {
            pos = string.indexOf(needle, pos);
            if (pos !== -1) {
                ans += 1;
                pos += step;
            }
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("endswith", (function() {
    var ρσ_anonfunc = function (suffixes, start, end) {
        var string, q;
        string = this;
        start = start || 0;
        if (typeof suffixes === "string") {
            suffixes = [suffixes];
        }
        if (end !== undefined) {
            string = string.slice(0, end);
        }
        for (var i = 0; i < suffixes.length; i++) {
            q = suffixes[(typeof i === "number" && i < 0) ? suffixes.length + i : i];
            if (string.indexOf(q, Math.max(start, string.length - q.length)) !== -1) {
                return true;
            }
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["suffixes", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("startswith", (function() {
    var ρσ_anonfunc = function (prefixes, start, end) {
        var prefix;
        start = start || 0;
        if (typeof prefixes === "string") {
            prefixes = [prefixes];
        }
        for (var i = 0; i < prefixes.length; i++) {
            prefix = prefixes[(typeof i === "number" && i < 0) ? prefixes.length + i : i];
            end = (end === undefined) ? this.length : end;
            if (end - start >= prefix.length && prefix === this.slice(start, start + prefix.length)) {
                return true;
            }
        }
        return false;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["prefixes", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("find", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        while (start < 0) {
            start += this.length;
        }
        ans = this.indexOf(needle, start);
        if (end !== undefined && ans !== -1) {
            while (end < 0) {
                end += this.length;
            }
            if (ans >= end - needle.length) {
                return -1;
            }
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rfind", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        while (end < 0) {
            end += this.length;
        }
        ans = this.lastIndexOf(needle, end - 1);
        if (start !== undefined && ans !== -1) {
            while (start < 0) {
                start += this.length;
            }
            if (ans < start) {
                return -1;
            }
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("index", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        ans = ρσ_str.prototype.find.apply(this, arguments);
        if (ans === -1) {
            throw new ValueError("substring not found");
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rindex", (function() {
    var ρσ_anonfunc = function (needle, start, end) {
        var ans;
        ans = ρσ_str.prototype.rfind.apply(this, arguments);
        if (ans === -1) {
            throw new ValueError("substring not found");
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["needle", "start", "end"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("islower", function () {
    return this.length > 0 && this.toLowerCase() === this.toString();
});
define_str_func("isupper", function () {
    return this.length > 0 && this.toUpperCase() === this.toString();
});
define_str_func("isspace", function () {
    return this.length > 0 && /^\s+$/.test(this);
});
define_str_func("join", (function() {
    var ρσ_anonfunc = function (iterable) {
        var ans, r;
        if (Array.isArray(iterable)) {
            return iterable.join(this);
        }
        ans = "";
        r = iterable.next();
        while (!r.done) {
            if (ans) {
                ans += this;
            }
            ans += r.value;
            r = iterable.next();
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["iterable"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("ljust", (function() {
    var ρσ_anonfunc = function (width, fill) {
        var string;
        string = this;
        if (width > string.length) {
            fill = fill || " ";
            string += new Array(width - string.length + 1).join(fill);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width", "fill"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rjust", (function() {
    var ρσ_anonfunc = function (width, fill) {
        var string;
        string = this;
        if (width > string.length) {
            fill = fill || " ";
            string = new Array(width - string.length + 1).join(fill) + string;
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width", "fill"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("lower", function () {
    return this.toLowerCase();
});
define_str_func("upper", function () {
    return this.toUpperCase();
});
define_str_func("lstrip", (function() {
    var ρσ_anonfunc = function (chars) {
        var string, pos;
        string = this;
        pos = 0;
        chars = chars || ρσ_str.whitespace;
        while (chars.indexOf(string[(typeof pos === "number" && pos < 0) ? string.length + pos : pos]) !== -1) {
            pos += 1;
        }
        if (pos) {
            string = string.slice(pos);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["chars"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rstrip", (function() {
    var ρσ_anonfunc = function (chars) {
        var string, pos;
        string = this;
        pos = string.length - 1;
        chars = chars || ρσ_str.whitespace;
        while (chars.indexOf(string[(typeof pos === "number" && pos < 0) ? string.length + pos : pos]) !== -1) {
            pos -= 1;
        }
        if (pos < string.length - 1) {
            string = string.slice(0, pos + 1);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["chars"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("strip", (function() {
    var ρσ_anonfunc = function (chars) {
        return ρσ_str.prototype.lstrip.call(ρσ_str.prototype.rstrip.call(this, chars), chars);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["chars"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("partition", (function() {
    var ρσ_anonfunc = function (sep) {
        var idx;
        idx = this.indexOf(sep);
        if (idx === -1) {
            return [this, "", ""];
        }
        return [this.slice(0, idx), sep, this.slice(idx + sep.length)];
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rpartition", (function() {
    var ρσ_anonfunc = function (sep) {
        var idx;
        idx = this.lastIndexOf(sep);
        if (idx === -1) {
            return ["", "", this];
        }
        return [this.slice(0, idx), sep, this.slice(idx + sep.length)];
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("replace", (function() {
    var ρσ_anonfunc = function (old, repl, count) {
        var string, pos, idx;
        string = this;
        if (count === 1) {
            return ρσ_orig_replace(string, old, repl);
        }
        if (count < 1) {
            return string;
        }
        count = count || Number.MAX_VALUE;
        pos = 0;
        while (count > 0) {
            count -= 1;
            idx = string.indexOf(old, pos);
            if (idx === -1) {
                break;
            }
            pos = idx + repl.length;
            string = string.slice(0, idx) + repl + string.slice(idx + old.length);
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["old", "repl", "count"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("split", (function() {
    var ρσ_anonfunc = function (sep, maxsplit) {
        var split, ans, extra, parts;
        if (maxsplit === 0) {
            return ρσ_list_decorate([ this ]);
        }
        split = ρσ_orig_split;
        if (sep === undefined || sep === null) {
            if (maxsplit > 0) {
                ans = split(this, /(\s+)/);
                extra = "";
                parts = [];
                for (var i = 0; i < ans.length; i++) {
                    if (parts.length >= maxsplit + 1) {
                        extra += ans[(typeof i === "number" && i < 0) ? ans.length + i : i];
                    } else if (i % 2 === 0) {
                        parts.push(ans[(typeof i === "number" && i < 0) ? ans.length + i : i]);
                    }
                }
                parts[parts.length-1] += extra;
                ans = parts;
            } else {
                ans = split(this, /\s+/);
            }
        } else {
            if (sep === "") {
                throw new ValueError("empty separator");
            }
            ans = split(this, sep);
            if (maxsplit > 0 && ans.length > maxsplit) {
                extra = ans.slice(maxsplit).join(sep);
                ans = ans.slice(0, maxsplit);
                ans.push(extra);
            }
        }
        return ρσ_list_decorate(ans);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep", "maxsplit"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("rsplit", (function() {
    var ρσ_anonfunc = function (sep, maxsplit) {
        var split, ans, is_space, pos, current, spc, ch, end, idx;
        if (!maxsplit) {
            return ρσ_str.prototype.split.call(this, sep);
        }
        split = ρσ_orig_split;
        if (sep === undefined || sep === null) {
            if (maxsplit > 0) {
                ans = [];
                is_space = /\s/;
                pos = this.length - 1;
                current = "";
                while (pos > -1 && maxsplit > 0) {
                    spc = false;
                    ch = (ρσ_expr_temp = this)[(typeof pos === "number" && pos < 0) ? ρσ_expr_temp.length + pos : pos];
                    while (pos > -1 && is_space.test(ch)) {
                        spc = true;
                        ch = this[--pos];
                    }
                    if (spc) {
                        if (current) {
                            ans.push(current);
                            maxsplit -= 1;
                        }
                        current = ch;
                    } else {
                        current += ch;
                    }
                    pos -= 1;
                }
                ans.push(this.slice(0, pos + 1) + current);
                ans.reverse();
            } else {
                ans = split(this, /\s+/);
            }
        } else {
            if (sep === "") {
                throw new ValueError("empty separator");
            }
            ans = [];
            pos = end = this.length;
            while (pos > -1 && maxsplit > 0) {
                maxsplit -= 1;
                idx = this.lastIndexOf(sep, pos);
                if (idx === -1) {
                    break;
                }
                ans.push(this.slice(idx + sep.length, end));
                pos = idx - 1;
                end = idx;
            }
            ans.push(this.slice(0, end));
            ans.reverse();
        }
        return ρσ_list_decorate(ans);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["sep", "maxsplit"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("splitlines", (function() {
    var ρσ_anonfunc = function (keepends) {
        var split, parts, ans;
        split = ρσ_orig_split;
        if (keepends) {
            parts = split(this, /((?:\r?\n)|\r)/);
            ans = [];
            for (var i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    ans.push(parts[(typeof i === "number" && i < 0) ? parts.length + i : i]);
                } else {
                    ans[ans.length-1] += parts[(typeof i === "number" && i < 0) ? parts.length + i : i];
                }
            }
        } else {
            ans = split(this, /(?:\r?\n)|\r/);
        }
        return ρσ_list_decorate(ans);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["keepends"]}
    });
    return ρσ_anonfunc;
})());
define_str_func("swapcase", function () {
    var ans, a, b;
    ans = new Array(this.length);
    for (var i = 0; i < ans.length; i++) {
        a = (ρσ_expr_temp = this)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
        b = a.toLowerCase();
        if (a === b) {
            b = a.toUpperCase();
        }
        ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = b;
    }
    return ans.join("");
});
define_str_func("zfill", (function() {
    var ρσ_anonfunc = function (width) {
        var string;
        string = this;
        if (width > string.length) {
            string = new Array(width - string.length + 1).join("0") + string;
        }
        return string;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["width"]}
    });
    return ρσ_anonfunc;
})());
ρσ_str.uchrs = (function() {
    var ρσ_anonfunc = function (string, with_positions) {
        return (function(){
            var ρσ_d = {};
            ρσ_d["_string"] = string;
            ρσ_d["_pos"] = 0;
            ρσ_d[ρσ_iterator_symbol] = function () {
                return this;
            };
            ρσ_d["next"] = function () {
                var length, pos, value, ans, extra;
                length = this._string.length;
                if (this._pos >= length) {
                    return (function(){
                        var ρσ_d = {};
                        ρσ_d["done"] = true;
                        return ρσ_d;
                    }).call(this);
                }
                pos = this._pos;
                value = this._string.charCodeAt(this._pos++);
                ans = "\ufffd";
                if (55296 <= value && value <= 56319) {
                    if (this._pos < length) {
                        extra = this._string.charCodeAt(this._pos++);
                        if ((extra & 56320) === 56320) {
                            ans = String.fromCharCode(value, extra);
                        }
                    }
                } else if ((value & 56320) !== 56320) {
                    ans = String.fromCharCode(value);
                }
                if (with_positions) {
                    return (function(){
                        var ρσ_d = {};
                        ρσ_d["done"] = false;
                        ρσ_d["value"] = ρσ_list_decorate([ pos, ans ]);
                        return ρσ_d;
                    }).call(this);
                } else {
                    return (function(){
                        var ρσ_d = {};
                        ρσ_d["done"] = false;
                        ρσ_d["value"] = ans;
                        return ρσ_d;
                    }).call(this);
                }
            };
            return ρσ_d;
        }).call(this);
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["string", "with_positions"]}
    });
    return ρσ_anonfunc;
})();
ρσ_str.uslice = (function() {
    var ρσ_anonfunc = function (string, start, end) {
        var items, iterator, r;
        items = [];
        iterator = ρσ_str.uchrs(string);
        r = iterator.next();
        while (!r.done) {
            items.push(r.value);
            r = iterator.next();
        }
        return items.slice(start || 0, (end === undefined) ? items.length : end).join("");
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["string", "start", "end"]}
    });
    return ρσ_anonfunc;
})();
ρσ_str.ulen = (function() {
    var ρσ_anonfunc = function (string) {
        var iterator, r, ans;
        iterator = ρσ_str.uchrs(string);
        r = iterator.next();
        ans = 0;
        while (!r.done) {
            r = iterator.next();
            ans += 1;
        }
        return ans;
    };
    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
        __argnames__ : {value: ["string"]}
    });
    return ρσ_anonfunc;
})();
ρσ_str.ascii_lowercase = "abcdefghijklmnopqrstuvwxyz";
ρσ_str.ascii_uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
ρσ_str.ascii_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
ρσ_str.digits = "0123456789";
ρσ_str.punctuation = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
ρσ_str.printable = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ \t\n\r\u000b\f";
ρσ_str.whitespace = " \t\n\r\u000b\f";
define_str_func = undefined;
var str = ρσ_str, repr = ρσ_repr;;
    var ρσ_modules = {};
    ρσ_modules.elementmaker = {};
    ρσ_modules.re = {};
    ρσ_modules.utils = {};
    ρσ_modules.settings = {};
    ρσ_modules.constants = {};
    ρσ_modules.dndbeyond_discord = {};
    ρσ_modules.math = {};
    ρσ_modules.roll_renderer = {};
    ρσ_modules.dndbeyond_dice = {};
    ρσ_modules.encodings = {};
    ρσ_modules.uuid = {};
    ρσ_modules.dndbeyond = {};

    (function(){
        var __name__ = "elementmaker";
        var html_elements, mathml_elements, svg_elements, html5_tags, E;
        html_elements = (function(){
            var s = ρσ_set();
            s.jsset.add("a");
            s.jsset.add("abbr");
            s.jsset.add("acronym");
            s.jsset.add("address");
            s.jsset.add("area");
            s.jsset.add("article");
            s.jsset.add("aside");
            s.jsset.add("audio");
            s.jsset.add("b");
            s.jsset.add("base");
            s.jsset.add("big");
            s.jsset.add("body");
            s.jsset.add("blockquote");
            s.jsset.add("br");
            s.jsset.add("button");
            s.jsset.add("canvas");
            s.jsset.add("caption");
            s.jsset.add("center");
            s.jsset.add("cite");
            s.jsset.add("code");
            s.jsset.add("col");
            s.jsset.add("colgroup");
            s.jsset.add("command");
            s.jsset.add("datagrid");
            s.jsset.add("datalist");
            s.jsset.add("dd");
            s.jsset.add("del");
            s.jsset.add("details");
            s.jsset.add("dfn");
            s.jsset.add("dialog");
            s.jsset.add("dir");
            s.jsset.add("div");
            s.jsset.add("dl");
            s.jsset.add("dt");
            s.jsset.add("em");
            s.jsset.add("event-source");
            s.jsset.add("fieldset");
            s.jsset.add("figcaption");
            s.jsset.add("figure");
            s.jsset.add("footer");
            s.jsset.add("font");
            s.jsset.add("form");
            s.jsset.add("header");
            s.jsset.add("h1");
            s.jsset.add("h2");
            s.jsset.add("h3");
            s.jsset.add("h4");
            s.jsset.add("h5");
            s.jsset.add("h6");
            s.jsset.add("hr");
            s.jsset.add("head");
            s.jsset.add("i");
            s.jsset.add("iframe");
            s.jsset.add("img");
            s.jsset.add("input");
            s.jsset.add("ins");
            s.jsset.add("keygen");
            s.jsset.add("kbd");
            s.jsset.add("label");
            s.jsset.add("legend");
            s.jsset.add("li");
            s.jsset.add("m");
            s.jsset.add("map");
            s.jsset.add("menu");
            s.jsset.add("meter");
            s.jsset.add("multicol");
            s.jsset.add("nav");
            s.jsset.add("nextid");
            s.jsset.add("ol");
            s.jsset.add("output");
            s.jsset.add("optgroup");
            s.jsset.add("option");
            s.jsset.add("p");
            s.jsset.add("pre");
            s.jsset.add("progress");
            s.jsset.add("q");
            s.jsset.add("s");
            s.jsset.add("samp");
            s.jsset.add("script");
            s.jsset.add("section");
            s.jsset.add("select");
            s.jsset.add("small");
            s.jsset.add("sound");
            s.jsset.add("source");
            s.jsset.add("spacer");
            s.jsset.add("span");
            s.jsset.add("strike");
            s.jsset.add("strong");
            s.jsset.add("style");
            s.jsset.add("sub");
            s.jsset.add("sup");
            s.jsset.add("table");
            s.jsset.add("tbody");
            s.jsset.add("td");
            s.jsset.add("textarea");
            s.jsset.add("time");
            s.jsset.add("tfoot");
            s.jsset.add("th");
            s.jsset.add("thead");
            s.jsset.add("tr");
            s.jsset.add("tt");
            s.jsset.add("u");
            s.jsset.add("ul");
            s.jsset.add("var");
            s.jsset.add("video");
            return s;
        })();
        mathml_elements = (function(){
            var s = ρσ_set();
            s.jsset.add("maction");
            s.jsset.add("math");
            s.jsset.add("merror");
            s.jsset.add("mfrac");
            s.jsset.add("mi");
            s.jsset.add("mmultiscripts");
            s.jsset.add("mn");
            s.jsset.add("mo");
            s.jsset.add("mover");
            s.jsset.add("mpadded");
            s.jsset.add("mphantom");
            s.jsset.add("mprescripts");
            s.jsset.add("mroot");
            s.jsset.add("mrow");
            s.jsset.add("mspace");
            s.jsset.add("msqrt");
            s.jsset.add("mstyle");
            s.jsset.add("msub");
            s.jsset.add("msubsup");
            s.jsset.add("msup");
            s.jsset.add("mtable");
            s.jsset.add("mtd");
            s.jsset.add("mtext");
            s.jsset.add("mtr");
            s.jsset.add("munder");
            s.jsset.add("munderover");
            s.jsset.add("none");
            return s;
        })();
        svg_elements = (function(){
            var s = ρσ_set();
            s.jsset.add("a");
            s.jsset.add("animate");
            s.jsset.add("animateColor");
            s.jsset.add("animateMotion");
            s.jsset.add("animateTransform");
            s.jsset.add("clipPath");
            s.jsset.add("circle");
            s.jsset.add("defs");
            s.jsset.add("desc");
            s.jsset.add("ellipse");
            s.jsset.add("font-face");
            s.jsset.add("font-face-name");
            s.jsset.add("font-face-src");
            s.jsset.add("g");
            s.jsset.add("glyph");
            s.jsset.add("hkern");
            s.jsset.add("linearGradient");
            s.jsset.add("line");
            s.jsset.add("marker");
            s.jsset.add("metadata");
            s.jsset.add("missing-glyph");
            s.jsset.add("mpath");
            s.jsset.add("path");
            s.jsset.add("polygon");
            s.jsset.add("polyline");
            s.jsset.add("radialGradient");
            s.jsset.add("rect");
            s.jsset.add("set");
            s.jsset.add("stop");
            s.jsset.add("svg");
            s.jsset.add("switch");
            s.jsset.add("text");
            s.jsset.add("title");
            s.jsset.add("tspan");
            s.jsset.add("use");
            return s;
        })();
        html5_tags = html_elements.union(mathml_elements).union(svg_elements);
        function _makeelement() {
            var tag = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var kwargs = arguments[arguments.length-1];
            if (kwargs === null || typeof kwargs !== "object" || kwargs [ρσ_kwargs_symbol] !== true) kwargs = {};
            var args = Array.prototype.slice.call(arguments, 1);
            if (kwargs !== null && typeof kwargs === "object" && kwargs [ρσ_kwargs_symbol] === true) args.pop();
            var ans, vattr, val, attr, arg;
            ans = this.createElement(tag);
            var ρσ_Iter0 = ρσ_Iterable(kwargs);
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                attr = ρσ_Iter0[ρσ_Index0];
                vattr = str.replace(str.rstrip(attr, "_"), "_", "-");
                val = kwargs[(typeof attr === "number" && attr < 0) ? kwargs.length + attr : attr];
                if (callable(val)) {
                    if (str.startswith(attr, "on")) {
                        attr = attr.slice(2);
                    }
                    ans.addEventListener(attr, val);
                } else if (val === true) {
                    ans.setAttribute(vattr, vattr);
                } else if (typeof val === "string") {
                    ans.setAttribute(vattr, val);
                }
            }
            var ρσ_Iter1 = ρσ_Iterable(args);
            for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                arg = ρσ_Iter1[ρσ_Index1];
                if (typeof arg === "string") {
                    arg = this.createTextNode(arg);
                }
                ans.appendChild(arg);
            }
            return ans;
        };
        if (!_makeelement.__handles_kwarg_interpolation__) Object.defineProperties(_makeelement, {
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["tag"]}
        });

        function maker_for_document(document) {
            var E;
            E = _makeelement.bind(document);
            Object.defineProperties(E, (function() {
                var ρσ_Iter = ρσ_Iterable(html5_tags), ρσ_Result = {}, tag;
                for (var ρσ_Index = 0; ρσ_Index < ρσ_Iter.length; ρσ_Index++) {
                    tag = ρσ_Iter[ρσ_Index];
                    ρσ_Result[tag] = ((function(){
                        var ρσ_d = {};
                        ρσ_d["value"] = _makeelement.bind(document, tag);
                        return ρσ_d;
                    }).call(this));
                }
                return ρσ_Result;
            })());
            return E;
        };
        if (!maker_for_document.__argnames__) Object.defineProperties(maker_for_document, {
            __argnames__ : {value: ["document"]}
        });

        if (typeof document === "undefined") {
            E = maker_for_document((function(){
                var ρσ_d = {};
                ρσ_d["createTextNode"] = (function() {
                    var ρσ_anonfunc = function (value) {
                        return value;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["value"]}
                    });
                    return ρσ_anonfunc;
                })();
                ρσ_d["createElement"] = (function() {
                    var ρσ_anonfunc = function (name) {
                        return (function(){
                            var ρσ_d = {};
                            ρσ_d["name"] = name;
                            ρσ_d["children"] = ρσ_list_decorate([]);
                            ρσ_d["attributes"] = {};
                            ρσ_d["setAttribute"] = (function() {
                                var ρσ_anonfunc = function (name, val) {
                                    (ρσ_expr_temp = this.attributes)[(typeof name === "number" && name < 0) ? ρσ_expr_temp.length + name : name] = val;
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["name", "val"]}
                                });
                                return ρσ_anonfunc;
                            })();
                            ρσ_d["appendChild"] = (function() {
                                var ρσ_anonfunc = function (child) {
                                    this.children.push(child);
                                };
                                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                    __argnames__ : {value: ["child"]}
                                });
                                return ρσ_anonfunc;
                            })();
                            return ρσ_d;
                        }).call(this);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["name"]}
                    });
                    return ρσ_anonfunc;
                })();
                return ρσ_d;
            }).call(this));
        } else {
            E = maker_for_document(document);
        }
        ρσ_modules.elementmaker.html_elements = html_elements;
        ρσ_modules.elementmaker.mathml_elements = mathml_elements;
        ρσ_modules.elementmaker.svg_elements = svg_elements;
        ρσ_modules.elementmaker.html5_tags = html5_tags;
        ρσ_modules.elementmaker.E = E;
        ρσ_modules.elementmaker._makeelement = _makeelement;
        ρσ_modules.elementmaker.maker_for_document = maker_for_document;
    })();

    (function(){
        var __name__ = "re";
        var _ALIAS_MAP, _ASCII_CONTROL_CHARS, _HEX_PAT, _NUM_PAT, _GROUP_PAT, _NAME_PAT, I, IGNORECASE, L, LOCALE, M, MULTILINE, D, DOTALL, U, UNICODE, X, VERBOSE, DEBUG, A, ASCII, supports_unicode, _RE_ESCAPE, _re_cache_map, _re_cache_items, error, has_prop;
        _ALIAS_MAP = (function(){
            var ρσ_d = {};
            ρσ_d["null"] = 0;
            ρσ_d["nul"] = 0;
            ρσ_d["start of heading"] = 1;
            ρσ_d["soh"] = 1;
            ρσ_d["start of text"] = 2;
            ρσ_d["stx"] = 2;
            ρσ_d["end of text"] = 3;
            ρσ_d["etx"] = 3;
            ρσ_d["end of transmission"] = 4;
            ρσ_d["eot"] = 4;
            ρσ_d["enquiry"] = 5;
            ρσ_d["enq"] = 5;
            ρσ_d["acknowledge"] = 6;
            ρσ_d["ack"] = 6;
            ρσ_d["alert"] = 7;
            ρσ_d["bel"] = 7;
            ρσ_d["backspace"] = 8;
            ρσ_d["bs"] = 8;
            ρσ_d["character tabulation"] = 9;
            ρσ_d["horizontal tabulation"] = 9;
            ρσ_d["ht"] = 9;
            ρσ_d["tab"] = 9;
            ρσ_d["line feed"] = 10;
            ρσ_d["new line"] = 10;
            ρσ_d["end of line"] = 10;
            ρσ_d["lf"] = 10;
            ρσ_d["nl"] = 10;
            ρσ_d["eol"] = 10;
            ρσ_d["line tabulation"] = 11;
            ρσ_d["vertical tabulation"] = 11;
            ρσ_d["vt"] = 11;
            ρσ_d["form feed"] = 12;
            ρσ_d["ff"] = 12;
            ρσ_d["carriage return"] = 13;
            ρσ_d["cr"] = 13;
            ρσ_d["shift out"] = 14;
            ρσ_d["locking-shift one"] = 14;
            ρσ_d["so"] = 14;
            ρσ_d["shift in"] = 15;
            ρσ_d["locking-shift zero"] = 15;
            ρσ_d["si"] = 15;
            ρσ_d["data link escape"] = 16;
            ρσ_d["dle"] = 16;
            ρσ_d["device control one"] = 17;
            ρσ_d["dc1"] = 17;
            ρσ_d["device control two"] = 18;
            ρσ_d["dc2"] = 18;
            ρσ_d["device control three"] = 19;
            ρσ_d["dc3"] = 19;
            ρσ_d["device control four"] = 20;
            ρσ_d["dc4"] = 20;
            ρσ_d["negative acknowledge"] = 21;
            ρσ_d["nak"] = 21;
            ρσ_d["synchronous idle"] = 22;
            ρσ_d["syn"] = 22;
            ρσ_d["end of transmission block"] = 23;
            ρσ_d["etb"] = 23;
            ρσ_d["cancel"] = 24;
            ρσ_d["can"] = 24;
            ρσ_d["end of medium"] = 25;
            ρσ_d["eom"] = 25;
            ρσ_d["substitute"] = 26;
            ρσ_d["sub"] = 26;
            ρσ_d["escape"] = 27;
            ρσ_d["esc"] = 27;
            ρσ_d["information separator four"] = 28;
            ρσ_d["file separator"] = 28;
            ρσ_d["fs"] = 28;
            ρσ_d["information separator three"] = 29;
            ρσ_d["group separator"] = 29;
            ρσ_d["gs"] = 29;
            ρσ_d["information separator two"] = 30;
            ρσ_d["record separator"] = 30;
            ρσ_d["rs"] = 30;
            ρσ_d["information separator one"] = 31;
            ρσ_d["unit separator"] = 31;
            ρσ_d["us"] = 31;
            ρσ_d["sp"] = 32;
            ρσ_d["delete"] = 127;
            ρσ_d["del"] = 127;
            ρσ_d["padding character"] = 128;
            ρσ_d["pad"] = 128;
            ρσ_d["high octet preset"] = 129;
            ρσ_d["hop"] = 129;
            ρσ_d["break permitted here"] = 130;
            ρσ_d["bph"] = 130;
            ρσ_d["no break here"] = 131;
            ρσ_d["nbh"] = 131;
            ρσ_d["index"] = 132;
            ρσ_d["ind"] = 132;
            ρσ_d["next line"] = 133;
            ρσ_d["nel"] = 133;
            ρσ_d["start of selected area"] = 134;
            ρσ_d["ssa"] = 134;
            ρσ_d["end of selected area"] = 135;
            ρσ_d["esa"] = 135;
            ρσ_d["character tabulation set"] = 136;
            ρσ_d["horizontal tabulation set"] = 136;
            ρσ_d["hts"] = 136;
            ρσ_d["character tabulation with justification"] = 137;
            ρσ_d["horizontal tabulation with justification"] = 137;
            ρσ_d["htj"] = 137;
            ρσ_d["line tabulation set"] = 138;
            ρσ_d["vertical tabulation set"] = 138;
            ρσ_d["vts"] = 138;
            ρσ_d["partial line forward"] = 139;
            ρσ_d["partial line down"] = 139;
            ρσ_d["pld"] = 139;
            ρσ_d["partial line backward"] = 140;
            ρσ_d["partial line up"] = 140;
            ρσ_d["plu"] = 140;
            ρσ_d["reverse line feed"] = 141;
            ρσ_d["reverse index"] = 141;
            ρσ_d["ri"] = 141;
            ρσ_d["single shift two"] = 142;
            ρσ_d["single-shift-2"] = 142;
            ρσ_d["ss2"] = 142;
            ρσ_d["single shift three"] = 143;
            ρσ_d["single-shift-3"] = 143;
            ρσ_d["ss3"] = 143;
            ρσ_d["device control string"] = 144;
            ρσ_d["dcs"] = 144;
            ρσ_d["private use one"] = 145;
            ρσ_d["private use-1"] = 145;
            ρσ_d["pu1"] = 145;
            ρσ_d["private use two"] = 146;
            ρσ_d["private use-2"] = 146;
            ρσ_d["pu2"] = 146;
            ρσ_d["set transmit state"] = 147;
            ρσ_d["sts"] = 147;
            ρσ_d["cancel character"] = 148;
            ρσ_d["cch"] = 148;
            ρσ_d["message waiting"] = 149;
            ρσ_d["mw"] = 149;
            ρσ_d["start of guarded area"] = 150;
            ρσ_d["start of protected area"] = 150;
            ρσ_d["spa"] = 150;
            ρσ_d["end of guarded area"] = 151;
            ρσ_d["end of protected area"] = 151;
            ρσ_d["epa"] = 151;
            ρσ_d["start of string"] = 152;
            ρσ_d["sos"] = 152;
            ρσ_d["single graphic character introducer"] = 153;
            ρσ_d["sgc"] = 153;
            ρσ_d["single character introducer"] = 154;
            ρσ_d["sci"] = 154;
            ρσ_d["control sequence introducer"] = 155;
            ρσ_d["csi"] = 155;
            ρσ_d["string terminator"] = 156;
            ρσ_d["st"] = 156;
            ρσ_d["operating system command"] = 157;
            ρσ_d["osc"] = 157;
            ρσ_d["privacy message"] = 158;
            ρσ_d["pm"] = 158;
            ρσ_d["application program command"] = 159;
            ρσ_d["apc"] = 159;
            ρσ_d["nbsp"] = 160;
            ρσ_d["shy"] = 173;
            ρσ_d["latin capital letter gha"] = 418;
            ρσ_d["latin small letter gha"] = 419;
            ρσ_d["cgj"] = 847;
            ρσ_d["alm"] = 1564;
            ρσ_d["syriac sublinear colon skewed left"] = 1801;
            ρσ_d["kannada letter llla"] = 3294;
            ρσ_d["lao letter fo fon"] = 3741;
            ρσ_d["lao letter fo fay"] = 3743;
            ρσ_d["lao letter ro"] = 3747;
            ρσ_d["lao letter lo"] = 3749;
            ρσ_d["tibetan mark bka- shog gi mgo rgyan"] = 4048;
            ρσ_d["fvs1"] = 6155;
            ρσ_d["fvs2"] = 6156;
            ρσ_d["fvs3"] = 6157;
            ρσ_d["mvs"] = 6158;
            ρσ_d["zwsp"] = 8203;
            ρσ_d["zwnj"] = 8204;
            ρσ_d["zwj"] = 8205;
            ρσ_d["lrm"] = 8206;
            ρσ_d["rlm"] = 8207;
            ρσ_d["lre"] = 8234;
            ρσ_d["rle"] = 8235;
            ρσ_d["pdf"] = 8236;
            ρσ_d["lro"] = 8237;
            ρσ_d["rlo"] = 8238;
            ρσ_d["nnbsp"] = 8239;
            ρσ_d["mmsp"] = 8287;
            ρσ_d["wj"] = 8288;
            ρσ_d["lri"] = 8294;
            ρσ_d["rli"] = 8295;
            ρσ_d["fsi"] = 8296;
            ρσ_d["pdi"] = 8297;
            ρσ_d["weierstrass elliptic function"] = 8472;
            ρσ_d["micr on us symbol"] = 9288;
            ρσ_d["micr dash symbol"] = 9289;
            ρσ_d["leftwards triangle-headed arrow with double vertical stroke"] = 11130;
            ρσ_d["rightwards triangle-headed arrow with double vertical stroke"] = 11132;
            ρσ_d["yi syllable iteration mark"] = 40981;
            ρσ_d["presentation form for vertical right white lenticular bracket"] = 65048;
            ρσ_d["vs1"] = 65024;
            ρσ_d["vs2"] = 65025;
            ρσ_d["vs3"] = 65026;
            ρσ_d["vs4"] = 65027;
            ρσ_d["vs5"] = 65028;
            ρσ_d["vs6"] = 65029;
            ρσ_d["vs7"] = 65030;
            ρσ_d["vs8"] = 65031;
            ρσ_d["vs9"] = 65032;
            ρσ_d["vs10"] = 65033;
            ρσ_d["vs11"] = 65034;
            ρσ_d["vs12"] = 65035;
            ρσ_d["vs13"] = 65036;
            ρσ_d["vs14"] = 65037;
            ρσ_d["vs15"] = 65038;
            ρσ_d["vs16"] = 65039;
            ρσ_d["byte order mark"] = 65279;
            ρσ_d["bom"] = 65279;
            ρσ_d["zwnbsp"] = 65279;
            ρσ_d["cuneiform sign nu11 tenu"] = 74452;
            ρσ_d["cuneiform sign nu11 over nu11 bur over bur"] = 74453;
            ρσ_d["byzantine musical symbol fthora skliron chroma vasis"] = 118981;
            ρσ_d["vs17"] = 917760;
            ρσ_d["vs18"] = 917761;
            ρσ_d["vs19"] = 917762;
            ρσ_d["vs20"] = 917763;
            ρσ_d["vs21"] = 917764;
            ρσ_d["vs22"] = 917765;
            ρσ_d["vs23"] = 917766;
            ρσ_d["vs24"] = 917767;
            ρσ_d["vs25"] = 917768;
            ρσ_d["vs26"] = 917769;
            ρσ_d["vs27"] = 917770;
            ρσ_d["vs28"] = 917771;
            ρσ_d["vs29"] = 917772;
            ρσ_d["vs30"] = 917773;
            ρσ_d["vs31"] = 917774;
            ρσ_d["vs32"] = 917775;
            ρσ_d["vs33"] = 917776;
            ρσ_d["vs34"] = 917777;
            ρσ_d["vs35"] = 917778;
            ρσ_d["vs36"] = 917779;
            ρσ_d["vs37"] = 917780;
            ρσ_d["vs38"] = 917781;
            ρσ_d["vs39"] = 917782;
            ρσ_d["vs40"] = 917783;
            ρσ_d["vs41"] = 917784;
            ρσ_d["vs42"] = 917785;
            ρσ_d["vs43"] = 917786;
            ρσ_d["vs44"] = 917787;
            ρσ_d["vs45"] = 917788;
            ρσ_d["vs46"] = 917789;
            ρσ_d["vs47"] = 917790;
            ρσ_d["vs48"] = 917791;
            ρσ_d["vs49"] = 917792;
            ρσ_d["vs50"] = 917793;
            ρσ_d["vs51"] = 917794;
            ρσ_d["vs52"] = 917795;
            ρσ_d["vs53"] = 917796;
            ρσ_d["vs54"] = 917797;
            ρσ_d["vs55"] = 917798;
            ρσ_d["vs56"] = 917799;
            ρσ_d["vs57"] = 917800;
            ρσ_d["vs58"] = 917801;
            ρσ_d["vs59"] = 917802;
            ρσ_d["vs60"] = 917803;
            ρσ_d["vs61"] = 917804;
            ρσ_d["vs62"] = 917805;
            ρσ_d["vs63"] = 917806;
            ρσ_d["vs64"] = 917807;
            ρσ_d["vs65"] = 917808;
            ρσ_d["vs66"] = 917809;
            ρσ_d["vs67"] = 917810;
            ρσ_d["vs68"] = 917811;
            ρσ_d["vs69"] = 917812;
            ρσ_d["vs70"] = 917813;
            ρσ_d["vs71"] = 917814;
            ρσ_d["vs72"] = 917815;
            ρσ_d["vs73"] = 917816;
            ρσ_d["vs74"] = 917817;
            ρσ_d["vs75"] = 917818;
            ρσ_d["vs76"] = 917819;
            ρσ_d["vs77"] = 917820;
            ρσ_d["vs78"] = 917821;
            ρσ_d["vs79"] = 917822;
            ρσ_d["vs80"] = 917823;
            ρσ_d["vs81"] = 917824;
            ρσ_d["vs82"] = 917825;
            ρσ_d["vs83"] = 917826;
            ρσ_d["vs84"] = 917827;
            ρσ_d["vs85"] = 917828;
            ρσ_d["vs86"] = 917829;
            ρσ_d["vs87"] = 917830;
            ρσ_d["vs88"] = 917831;
            ρσ_d["vs89"] = 917832;
            ρσ_d["vs90"] = 917833;
            ρσ_d["vs91"] = 917834;
            ρσ_d["vs92"] = 917835;
            ρσ_d["vs93"] = 917836;
            ρσ_d["vs94"] = 917837;
            ρσ_d["vs95"] = 917838;
            ρσ_d["vs96"] = 917839;
            ρσ_d["vs97"] = 917840;
            ρσ_d["vs98"] = 917841;
            ρσ_d["vs99"] = 917842;
            ρσ_d["vs100"] = 917843;
            ρσ_d["vs101"] = 917844;
            ρσ_d["vs102"] = 917845;
            ρσ_d["vs103"] = 917846;
            ρσ_d["vs104"] = 917847;
            ρσ_d["vs105"] = 917848;
            ρσ_d["vs106"] = 917849;
            ρσ_d["vs107"] = 917850;
            ρσ_d["vs108"] = 917851;
            ρσ_d["vs109"] = 917852;
            ρσ_d["vs110"] = 917853;
            ρσ_d["vs111"] = 917854;
            ρσ_d["vs112"] = 917855;
            ρσ_d["vs113"] = 917856;
            ρσ_d["vs114"] = 917857;
            ρσ_d["vs115"] = 917858;
            ρσ_d["vs116"] = 917859;
            ρσ_d["vs117"] = 917860;
            ρσ_d["vs118"] = 917861;
            ρσ_d["vs119"] = 917862;
            ρσ_d["vs120"] = 917863;
            ρσ_d["vs121"] = 917864;
            ρσ_d["vs122"] = 917865;
            ρσ_d["vs123"] = 917866;
            ρσ_d["vs124"] = 917867;
            ρσ_d["vs125"] = 917868;
            ρσ_d["vs126"] = 917869;
            ρσ_d["vs127"] = 917870;
            ρσ_d["vs128"] = 917871;
            ρσ_d["vs129"] = 917872;
            ρσ_d["vs130"] = 917873;
            ρσ_d["vs131"] = 917874;
            ρσ_d["vs132"] = 917875;
            ρσ_d["vs133"] = 917876;
            ρσ_d["vs134"] = 917877;
            ρσ_d["vs135"] = 917878;
            ρσ_d["vs136"] = 917879;
            ρσ_d["vs137"] = 917880;
            ρσ_d["vs138"] = 917881;
            ρσ_d["vs139"] = 917882;
            ρσ_d["vs140"] = 917883;
            ρσ_d["vs141"] = 917884;
            ρσ_d["vs142"] = 917885;
            ρσ_d["vs143"] = 917886;
            ρσ_d["vs144"] = 917887;
            ρσ_d["vs145"] = 917888;
            ρσ_d["vs146"] = 917889;
            ρσ_d["vs147"] = 917890;
            ρσ_d["vs148"] = 917891;
            ρσ_d["vs149"] = 917892;
            ρσ_d["vs150"] = 917893;
            ρσ_d["vs151"] = 917894;
            ρσ_d["vs152"] = 917895;
            ρσ_d["vs153"] = 917896;
            ρσ_d["vs154"] = 917897;
            ρσ_d["vs155"] = 917898;
            ρσ_d["vs156"] = 917899;
            ρσ_d["vs157"] = 917900;
            ρσ_d["vs158"] = 917901;
            ρσ_d["vs159"] = 917902;
            ρσ_d["vs160"] = 917903;
            ρσ_d["vs161"] = 917904;
            ρσ_d["vs162"] = 917905;
            ρσ_d["vs163"] = 917906;
            ρσ_d["vs164"] = 917907;
            ρσ_d["vs165"] = 917908;
            ρσ_d["vs166"] = 917909;
            ρσ_d["vs167"] = 917910;
            ρσ_d["vs168"] = 917911;
            ρσ_d["vs169"] = 917912;
            ρσ_d["vs170"] = 917913;
            ρσ_d["vs171"] = 917914;
            ρσ_d["vs172"] = 917915;
            ρσ_d["vs173"] = 917916;
            ρσ_d["vs174"] = 917917;
            ρσ_d["vs175"] = 917918;
            ρσ_d["vs176"] = 917919;
            ρσ_d["vs177"] = 917920;
            ρσ_d["vs178"] = 917921;
            ρσ_d["vs179"] = 917922;
            ρσ_d["vs180"] = 917923;
            ρσ_d["vs181"] = 917924;
            ρσ_d["vs182"] = 917925;
            ρσ_d["vs183"] = 917926;
            ρσ_d["vs184"] = 917927;
            ρσ_d["vs185"] = 917928;
            ρσ_d["vs186"] = 917929;
            ρσ_d["vs187"] = 917930;
            ρσ_d["vs188"] = 917931;
            ρσ_d["vs189"] = 917932;
            ρσ_d["vs190"] = 917933;
            ρσ_d["vs191"] = 917934;
            ρσ_d["vs192"] = 917935;
            ρσ_d["vs193"] = 917936;
            ρσ_d["vs194"] = 917937;
            ρσ_d["vs195"] = 917938;
            ρσ_d["vs196"] = 917939;
            ρσ_d["vs197"] = 917940;
            ρσ_d["vs198"] = 917941;
            ρσ_d["vs199"] = 917942;
            ρσ_d["vs200"] = 917943;
            ρσ_d["vs201"] = 917944;
            ρσ_d["vs202"] = 917945;
            ρσ_d["vs203"] = 917946;
            ρσ_d["vs204"] = 917947;
            ρσ_d["vs205"] = 917948;
            ρσ_d["vs206"] = 917949;
            ρσ_d["vs207"] = 917950;
            ρσ_d["vs208"] = 917951;
            ρσ_d["vs209"] = 917952;
            ρσ_d["vs210"] = 917953;
            ρσ_d["vs211"] = 917954;
            ρσ_d["vs212"] = 917955;
            ρσ_d["vs213"] = 917956;
            ρσ_d["vs214"] = 917957;
            ρσ_d["vs215"] = 917958;
            ρσ_d["vs216"] = 917959;
            ρσ_d["vs217"] = 917960;
            ρσ_d["vs218"] = 917961;
            ρσ_d["vs219"] = 917962;
            ρσ_d["vs220"] = 917963;
            ρσ_d["vs221"] = 917964;
            ρσ_d["vs222"] = 917965;
            ρσ_d["vs223"] = 917966;
            ρσ_d["vs224"] = 917967;
            ρσ_d["vs225"] = 917968;
            ρσ_d["vs226"] = 917969;
            ρσ_d["vs227"] = 917970;
            ρσ_d["vs228"] = 917971;
            ρσ_d["vs229"] = 917972;
            ρσ_d["vs230"] = 917973;
            ρσ_d["vs231"] = 917974;
            ρσ_d["vs232"] = 917975;
            ρσ_d["vs233"] = 917976;
            ρσ_d["vs234"] = 917977;
            ρσ_d["vs235"] = 917978;
            ρσ_d["vs236"] = 917979;
            ρσ_d["vs237"] = 917980;
            ρσ_d["vs238"] = 917981;
            ρσ_d["vs239"] = 917982;
            ρσ_d["vs240"] = 917983;
            ρσ_d["vs241"] = 917984;
            ρσ_d["vs242"] = 917985;
            ρσ_d["vs243"] = 917986;
            ρσ_d["vs244"] = 917987;
            ρσ_d["vs245"] = 917988;
            ρσ_d["vs246"] = 917989;
            ρσ_d["vs247"] = 917990;
            ρσ_d["vs248"] = 917991;
            ρσ_d["vs249"] = 917992;
            ρσ_d["vs250"] = 917993;
            ρσ_d["vs251"] = 917994;
            ρσ_d["vs252"] = 917995;
            ρσ_d["vs253"] = 917996;
            ρσ_d["vs254"] = 917997;
            ρσ_d["vs255"] = 917998;
            ρσ_d["vs256"] = 917999;
            return ρσ_d;
        }).call(this);
        _ASCII_CONTROL_CHARS = (function(){
            var ρσ_d = {};
            ρσ_d["a"] = 7;
            ρσ_d["b"] = 8;
            ρσ_d["f"] = 12;
            ρσ_d["n"] = 10;
            ρσ_d["r"] = 13;
            ρσ_d["t"] = 9;
            ρσ_d["v"] = 11;
            return ρσ_d;
        }).call(this);
        _HEX_PAT = /^[a-fA-F0-9]/;
        _NUM_PAT = /^[0-9]/;
        _GROUP_PAT = /<([^>]+)>/;
        _NAME_PAT = /^[a-zA-Z ]/;
        I = IGNORECASE = 2;
        L = LOCALE = 4;
        M = MULTILINE = 8;
        D = DOTALL = 16;
        U = UNICODE = 32;
        X = VERBOSE = 64;
        DEBUG = 128;
        A = ASCII = 256;
        supports_unicode = RegExp.prototype.unicode !== undefined;
        _RE_ESCAPE = /[-\/\\^$*+?.()|[\]{}]/g;
        _re_cache_map = {};
        _re_cache_items = [];
        error = SyntaxError;
        has_prop = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);
        function _expand(groups, repl, group_name_map) {
            var i, ans, ch;
            i = 0;
            function next() {
                return repl[i++];
            };

            function peek() {
                return repl[(typeof i === "number" && i < 0) ? repl.length + i : i];
            };

            function read_digits(count, pat, base, maxval, prefix) {
                var ans, greedy, nval;
                ans = prefix || "";
                greedy = count === Number.MAX_VALUE;
                while (count > 0) {
                    count -= 1;
                    if (!pat.test(peek())) {
                        if (greedy) {
                            break;
                        }
                        return ans;
                    }
                    ans += next();
                }
                nval = parseInt(ans, base);
                if (nval > maxval) {
                    return ans;
                }
                return nval;
            };
            if (!read_digits.__argnames__) Object.defineProperties(read_digits, {
                __argnames__ : {value: ["count", "pat", "base", "maxval", "prefix"]}
            });

            function read_escape_sequence() {
                var q, ans, m, gn, code, name, key;
                q = next();
                if (!q || q === "\\") {
                    return "\\";
                }
                if ("\"'".indexOf(q) !== -1) {
                    return q;
                }
                if (_ASCII_CONTROL_CHARS[(typeof q === "number" && q < 0) ? _ASCII_CONTROL_CHARS.length + q : q]) {
                    return String.fromCharCode(_ASCII_CONTROL_CHARS[(typeof q === "number" && q < 0) ? _ASCII_CONTROL_CHARS.length + q : q]);
                }
                if ("0" <= q && q <= "9") {
                    ans = read_digits(Number.MAX_VALUE, _NUM_PAT, 10, Number.MAX_VALUE, q);
                    if (typeof ans === "number") {
                        return groups[(typeof ans === "number" && ans < 0) ? groups.length + ans : ans] || "";
                    }
                    return "\\" + ans;
                }
                if (q === "g") {
                    m = _GROUP_PAT.exec(repl.slice(i));
                    if (m !== null) {
                        i += m[0].length;
                        gn = m[1];
                        if (isNaN(parseInt(gn, 10))) {
                            if (!has_prop(group_name_map, gn)) {
                                return "";
                            }
                            gn = (ρσ_expr_temp = group_name_map[(typeof gn === "number" && gn < 0) ? group_name_map.length + gn : gn])[ρσ_expr_temp.length-1];
                        }
                        return groups[(typeof gn === "number" && gn < 0) ? groups.length + gn : gn] || "";
                    }
                }
                if (q === "x") {
                    code = read_digits(2, _HEX_PAT, 16, 1114111);
                    if (typeof code === "number") {
                        return String.fromCharCode(code);
                    }
                    return "\\x" + code;
                }
                if (q === "u") {
                    code = read_digits(4, _HEX_PAT, 16, 1114111);
                    if (typeof code === "number") {
                        return String.fromCharCode(code);
                    }
                    return "\\u" + code;
                }
                if (q === "U") {
                    code = read_digits(8, _HEX_PAT, 16, 1114111);
                    if (typeof code === "number") {
                        if (code <= 65535) {
                            return String.fromCharCode(code);
                        }
                        code -= 65536;
                        return String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
                    }
                    return "\\U" + code;
                }
                if (q === "N" && peek() === "{") {
                    next();
                    name = "";
                    while (_NAME_PAT.test(peek())) {
                        name += next();
                    }
                    if (peek() !== "}") {
                        return "\\N{" + name;
                    }
                    next();
                    key = (name || "").toLowerCase();
                    if (!name || !has_prop(_ALIAS_MAP, key)) {
                        return "\\N{" + name + "}";
                    }
                    code = _ALIAS_MAP[(typeof key === "number" && key < 0) ? _ALIAS_MAP.length + key : key];
                    if (code <= 65535) {
                        return String.fromCharCode(code);
                    }
                    code -= 65536;
                    return String.fromCharCode(55296 + (code >> 10), 56320 + (code & 1023));
                }
                return "\\" + q;
            };

            ans = ch = "";
            while (true) {
                ch = next();
                if (ch === "\\") {
                    ans += read_escape_sequence();
                } else if (!ch) {
                    break;
                } else {
                    ans += ch;
                }
            }
            return ans;
        };
        if (!_expand.__argnames__) Object.defineProperties(_expand, {
            __argnames__ : {value: ["groups", "repl", "group_name_map"]}
        });

        function transform_regex(source, flags) {
            var pos, previous_backslash, in_class, ans, group_map, group_count, ch, extension, close, flag_map, flgs, q, name;
            pos = 0;
            previous_backslash = in_class = false;
            ans = "";
            group_map = {};
            flags = flags || 0;
            group_count = 0;
            while (pos < source.length) {
                ch = source[pos++];
                if (previous_backslash) {
                    ans += "\\" + ch;
                    previous_backslash = false;
                    continue;
                }
                if (in_class) {
                    if (ch === "]") {
                        in_class = false;
                    }
                    ans += ch;
                    continue;
                }
                if (ch === "\\") {
                    previous_backslash = true;
                    continue;
                }
                if (ch === "[") {
                    in_class = true;
                    if (source[(typeof pos === "number" && pos < 0) ? source.length + pos : pos] === "]") {
                        pos += 1;
                        ch = "[\\]";
                    }
                } else if (ch === "(") {
                    if (source[(typeof pos === "number" && pos < 0) ? source.length + pos : pos] === "?") {
                        extension = source[ρσ_bound_index(pos + 1, source)];
                        if (extension === "#") {
                            close = source.indexOf(")", pos + 1);
                            if (close === -1) {
                                throw new ValueError("Expecting a closing )");
                            }
                            pos = close + 1;
                            continue;
                        }
                        if ("aiLmsux".indexOf(extension) !== -1) {
                            flag_map = (function(){
                                var ρσ_d = {};
                                ρσ_d["a"] = ASCII;
                                ρσ_d["i"] = IGNORECASE;
                                ρσ_d["L"] = LOCALE;
                                ρσ_d["m"] = MULTILINE;
                                ρσ_d["s"] = DOTALL;
                                ρσ_d["u"] = UNICODE;
                                ρσ_d["x"] = VERBOSE;
                                return ρσ_d;
                            }).call(this);
                            close = source.indexOf(")", pos + 1);
                            if (close === -1) {
                                throw new SyntaxError("Expecting a closing )");
                            }
                            flgs = source.slice(pos + 1, close);
                            for (var i = 0; i < flgs.length; i++) {
                                q = flgs[(typeof i === "number" && i < 0) ? flgs.length + i : i];
                                if (!has_prop(flag_map, q)) {
                                    throw new SyntaxError("Invalid flag: " + q);
                                }
                                flags |= flag_map[(typeof q === "number" && q < 0) ? flag_map.length + q : q];
                            }
                            pos = close + 1;
                            continue;
                        }
                        if (extension === "(") {
                            throw new SyntaxError("Group existence assertions are not supported in JavaScript");
                        }
                        if (extension === "P") {
                            pos += 2;
                            q = source[(typeof pos === "number" && pos < 0) ? source.length + pos : pos];
                            if (q === "<") {
                                close = source.indexOf(">", pos);
                                if (close === -1) {
                                    throw new SyntaxError("Named group not closed, expecting >");
                                }
                                name = source.slice(pos + 1, close);
                                if (!has_prop(group_map, name)) {
                                    group_map[(typeof name === "number" && name < 0) ? group_map.length + name : name] = [];
                                }
                                group_map[(typeof name === "number" && name < 0) ? group_map.length + name : name].push(++group_count);
                                pos = close + 1;
                            } else if (q === "=") {
                                close = source.indexOf(")", pos);
                                if (close === -1) {
                                    throw new SyntaxError("Named group back-reference not closed, expecting a )");
                                }
                                name = source.slice(pos + 1, close);
                                if (!isNaN(parseInt(name, 10))) {
                                    ans += "\\" + name;
                                } else {
                                    if (!has_prop(group_map, name)) {
                                        throw new SyntaxError("Invalid back-reference. The named group: " + name + " has not yet been defined.");
                                    }
                                    ans += "\\" + (ρσ_expr_temp = group_map[(typeof name === "number" && name < 0) ? group_map.length + name : name])[ρσ_expr_temp.length-1];
                                }
                                pos = close + 1;
                                continue;
                            } else {
                                throw new SyntaxError("Expecting < or = after (?P");
                            }
                        }
                    } else {
                        group_count += 1;
                    }
                } else if (ch === "." && flags & DOTALL) {
                    ans += "[\\s\\S]";
                    continue;
                }
                ans += ch;
            }
            return [ans, flags, group_map];
        };
        if (!transform_regex.__argnames__) Object.defineProperties(transform_regex, {
            __argnames__ : {value: ["source", "flags"]}
        });

        function MatchObject() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            MatchObject.prototype.__bind_methods__.call(this);
            MatchObject.prototype.__init__.apply(this, arguments);
        }
        Object.defineProperty(MatchObject.prototype, "__bind_methods__", {value: function () {
            this._compute_extents = MatchObject.prototype._compute_extents.bind(this);
            this.groups = MatchObject.prototype.groups.bind(this);
            this._group_number = MatchObject.prototype._group_number.bind(this);
            this._group_val = MatchObject.prototype._group_val.bind(this);
            this.group = MatchObject.prototype.group.bind(this);
            this.start = MatchObject.prototype.start.bind(this);
            this.end = MatchObject.prototype.end.bind(this);
            this.span = MatchObject.prototype.span.bind(this);
            this.expand = MatchObject.prototype.expand.bind(this);
            this.groupdict = MatchObject.prototype.groupdict.bind(this);
            this.captures = MatchObject.prototype.captures.bind(this);
            this.capturesdict = MatchObject.prototype.capturesdict.bind(this);
        }});
        MatchObject.prototype.__init__ = function __init__(regex, match, pos, endpos) {
            var self = this;
            var ρσ_unpack;
            self.re = regex;
            self.string = match.input;
            self._start_pos = match.index;
            self._groups = match;
            ρσ_unpack = [pos, endpos];
            self.pos = ρσ_unpack[0];
            self.endpos = ρσ_unpack[1];
        };
        if (!MatchObject.prototype.__init__.__argnames__) Object.defineProperties(MatchObject.prototype.__init__, {
            __argnames__ : {value: ["regex", "match", "pos", "endpos"]}
        });
        MatchObject.__argnames__ = MatchObject.prototype.__init__.__argnames__;
        MatchObject.__handles_kwarg_interpolation__ = MatchObject.prototype.__init__.__handles_kwarg_interpolation__;
        MatchObject.prototype._compute_extents = function _compute_extents() {
            var self = this;
            var match, offset, extent, loc, g;
            match = self._groups;
            self._start = Array(match.length);
            self._end = Array(match.length);
            self._start[0] = self._start_pos;
            self._end[0] = self._start_pos + match[0].length;
            offset = self._start_pos;
            extent = match[0];
            loc = 0;
            for (var i = 1; i < match.length; i++) {
                g = match[(typeof i === "number" && i < 0) ? match.length + i : i];
                loc = extent.indexOf(g, loc);
                if (loc === -1) {
                    (ρσ_expr_temp = self._start)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = (ρσ_expr_temp = self._start)[ρσ_bound_index(i - 1, ρσ_expr_temp)];
                    (ρσ_expr_temp = self._end)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = (ρσ_expr_temp = self._end)[ρσ_bound_index(i - 1, ρσ_expr_temp)];
                } else {
                    (ρσ_expr_temp = self._start)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = offset + loc;
                    loc += g.length;
                    (ρσ_expr_temp = self._end)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i] = offset + loc;
                }
            }
        };
        MatchObject.prototype.groups = function groups() {
            var self = this;
            var defval = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? groups.__defaults__.defval : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "defval")){
                defval = ρσ_kwargs_obj.defval;
            }
            var ans, val;
            ans = [];
            for (var i = 1; i < self._groups.length; i++) {
                val = (ρσ_expr_temp = self._groups)[(typeof i === "number" && i < 0) ? ρσ_expr_temp.length + i : i];
                if (val === undefined) {
                    val = defval;
                }
                ans.push(val);
            }
            return ans;
        };
        if (!MatchObject.prototype.groups.__defaults__) Object.defineProperties(MatchObject.prototype.groups, {
            __defaults__ : {value: {defval:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["defval"]}
        });
        MatchObject.prototype._group_number = function _group_number(g) {
            var self = this;
            if (typeof g === "number") {
                return g;
            }
            if (has_prop(self.re.group_name_map, g)) {
                return (ρσ_expr_temp = (ρσ_expr_temp = self.re.group_name_map)[(typeof g === "number" && g < 0) ? ρσ_expr_temp.length + g : g])[ρσ_expr_temp.length-1];
            }
            return g;
        };
        if (!MatchObject.prototype._group_number.__argnames__) Object.defineProperties(MatchObject.prototype._group_number, {
            __argnames__ : {value: ["g"]}
        });
        MatchObject.prototype._group_val = function _group_val(q, defval) {
            var self = this;
            var val;
            val = undefined;
            if (typeof q === "number" && -1 < q && q < self._groups.length) {
                val = (ρσ_expr_temp = self._groups)[(typeof q === "number" && q < 0) ? ρσ_expr_temp.length + q : q];
            } else {
                if (has_prop(self.re.group_name_map, q)) {
                    val = (ρσ_expr_temp = self._groups)[ρσ_bound_index((ρσ_expr_temp = (ρσ_expr_temp = self.re.group_name_map)[(typeof q === "number" && q < 0) ? ρσ_expr_temp.length + q : q])[ρσ_expr_temp.length-1], ρσ_expr_temp)];
                }
            }
            if (val === undefined) {
                val = defval;
            }
            return val;
        };
        if (!MatchObject.prototype._group_val.__argnames__) Object.defineProperties(MatchObject.prototype._group_val, {
            __argnames__ : {value: ["q", "defval"]}
        });
        MatchObject.prototype.group = function group() {
            var self = this;
            var ans, q;
            if (arguments.length === 0) {
                return self._groups[0];
            }
            ans = [];
            for (var i = 0; i < arguments.length; i++) {
                q = arguments[(typeof i === "number" && i < 0) ? arguments.length + i : i];
                ans.push(self._group_val(q, null));
            }
            return (ans.length === 1) ? ans[0] : ans;
        };
        MatchObject.prototype.start = function start(g) {
            var self = this;
            var val;
            if (self._start === undefined) {
                self._compute_extents();
            }
            val = (ρσ_expr_temp = self._start)[ρσ_bound_index(self._group_number(g || 0), ρσ_expr_temp)];
            if (val === undefined) {
                val = -1;
            }
            return val;
        };
        if (!MatchObject.prototype.start.__argnames__) Object.defineProperties(MatchObject.prototype.start, {
            __argnames__ : {value: ["g"]}
        });
        MatchObject.prototype.end = function end(g) {
            var self = this;
            var val;
            if (self._end === undefined) {
                self._compute_extents();
            }
            val = (ρσ_expr_temp = self._end)[ρσ_bound_index(self._group_number(g || 0), ρσ_expr_temp)];
            if (val === undefined) {
                val = -1;
            }
            return val;
        };
        if (!MatchObject.prototype.end.__argnames__) Object.defineProperties(MatchObject.prototype.end, {
            __argnames__ : {value: ["g"]}
        });
        MatchObject.prototype.span = function span(g) {
            var self = this;
            return ρσ_list_decorate([ self.start(g), self.end(g) ]);
        };
        if (!MatchObject.prototype.span.__argnames__) Object.defineProperties(MatchObject.prototype.span, {
            __argnames__ : {value: ["g"]}
        });
        MatchObject.prototype.expand = function expand(repl) {
            var self = this;
            return _expand(repl, this._groups, this.re.group_name_map);
        };
        if (!MatchObject.prototype.expand.__argnames__) Object.defineProperties(MatchObject.prototype.expand, {
            __argnames__ : {value: ["repl"]}
        });
        MatchObject.prototype.groupdict = function groupdict() {
            var self = this;
            var defval = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? groupdict.__defaults__.defval : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "defval")){
                defval = ρσ_kwargs_obj.defval;
            }
            var gnm, names, ans, name, val;
            gnm = self.re.group_name_map;
            names = Object.keys(gnm);
            ans = {};
            for (var i = 0; i < names.length; i++) {
                name = names[(typeof i === "number" && i < 0) ? names.length + i : i];
                if (has_prop(gnm, name)) {
                    val = (ρσ_expr_temp = self._groups)[ρσ_bound_index((ρσ_expr_temp = gnm[(typeof name === "number" && name < 0) ? gnm.length + name : name])[ρσ_expr_temp.length-1], ρσ_expr_temp)];
                    if (val === undefined) {
                        val = defval;
                    }
                    ans[(typeof name === "number" && name < 0) ? ans.length + name : name] = val;
                }
            }
            return ans;
        };
        if (!MatchObject.prototype.groupdict.__defaults__) Object.defineProperties(MatchObject.prototype.groupdict, {
            __defaults__ : {value: {defval:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["defval"]}
        });
        MatchObject.prototype.captures = function captures(group_name) {
            var self = this;
            var ans, groups, val;
            ans = ρσ_list_decorate([]);
            if (!has_prop(self.re.group_name_map, group_name)) {
                return ans;
            }
            groups = (ρσ_expr_temp = self.re.group_name_map)[(typeof group_name === "number" && group_name < 0) ? ρσ_expr_temp.length + group_name : group_name];
            for (var i = 0; i < groups.length; i++) {
                val = (ρσ_expr_temp = self._groups)[ρσ_bound_index(groups[(typeof i === "number" && i < 0) ? groups.length + i : i], ρσ_expr_temp)];
                if (val !== undefined) {
                    ans.push(val);
                }
            }
            return ans;
        };
        if (!MatchObject.prototype.captures.__argnames__) Object.defineProperties(MatchObject.prototype.captures, {
            __argnames__ : {value: ["group_name"]}
        });
        MatchObject.prototype.capturesdict = function capturesdict() {
            var self = this;
            var gnm, names, ans, name;
            gnm = self.re.group_name_map;
            names = Object.keys(gnm);
            ans = {};
            for (var i = 0; i < names.length; i++) {
                name = names[(typeof i === "number" && i < 0) ? names.length + i : i];
                ans[(typeof name === "number" && name < 0) ? ans.length + name : name] = self.captures(name);
            }
            return ans;
        };
        MatchObject.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        MatchObject.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(MatchObject.prototype, "__bases__", {value: []});

        function RegexObject() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            RegexObject.prototype.__bind_methods__.call(this);
            RegexObject.prototype.__init__.apply(this, arguments);
        }
        Object.defineProperty(RegexObject.prototype, "__bind_methods__", {value: function () {
            this._do_search = RegexObject.prototype._do_search.bind(this);
            this.search = RegexObject.prototype.search.bind(this);
            this.match = RegexObject.prototype.match.bind(this);
            this.split = RegexObject.prototype.split.bind(this);
            this.findall = RegexObject.prototype.findall.bind(this);
            this.finditer = RegexObject.prototype.finditer.bind(this);
            this.subn = RegexObject.prototype.subn.bind(this);
            this.sub = RegexObject.prototype.sub.bind(this);
        }});
        RegexObject.prototype.__init__ = function __init__(pattern, flags) {
            var self = this;
            var ρσ_unpack, modifiers;
            self.pattern = (ρσ_instanceof(pattern, RegExp)) ? pattern.source : pattern;
            ρσ_unpack = transform_regex(self.pattern, flags);
ρσ_unpack = ρσ_unpack_asarray(3, ρσ_unpack);
            self.js_pattern = ρσ_unpack[0];
            self.flags = ρσ_unpack[1];
            self.group_name_map = ρσ_unpack[2];
            modifiers = "";
            if (self.flags & IGNORECASE) {
                modifiers += "i";
            }
            if (self.flags & MULTILINE) {
                modifiers += "m";
            }
            if (!(self.flags & ASCII) && supports_unicode) {
                modifiers += "u";
            }
            self._modifiers = modifiers + "g";
            self._pattern = new RegExp(self.js_pattern, self._modifiers);
        };
        if (!RegexObject.prototype.__init__.__argnames__) Object.defineProperties(RegexObject.prototype.__init__, {
            __argnames__ : {value: ["pattern", "flags"]}
        });
        RegexObject.__argnames__ = RegexObject.prototype.__init__.__argnames__;
        RegexObject.__handles_kwarg_interpolation__ = RegexObject.prototype.__init__.__handles_kwarg_interpolation__;
        RegexObject.prototype._do_search = function _do_search(pat, string, pos, endpos) {
            var self = this;
            var n;
            pat.lastIndex = 0;
            if (endpos !== null) {
                string = string.slice(0, endpos);
            }
            while (true) {
                n = pat.exec(string);
                if (n === null) {
                    return null;
                }
                if (n.index >= pos) {
                    return new MatchObject(self, n, pos, endpos);
                }
            }
        };
        if (!RegexObject.prototype._do_search.__argnames__) Object.defineProperties(RegexObject.prototype._do_search, {
            __argnames__ : {value: ["pat", "string", "pos", "endpos"]}
        });
        RegexObject.prototype.search = function search() {
            var self = this;
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var pos = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? search.__defaults__.pos : arguments[1];
            var endpos = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? search.__defaults__.endpos : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "pos")){
                pos = ρσ_kwargs_obj.pos;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "endpos")){
                endpos = ρσ_kwargs_obj.endpos;
            }
            return self._do_search(self._pattern, string, pos, endpos);
        };
        if (!RegexObject.prototype.search.__defaults__) Object.defineProperties(RegexObject.prototype.search, {
            __defaults__ : {value: {pos:0, endpos:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string", "pos", "endpos"]}
        });
        RegexObject.prototype.match = function match() {
            var self = this;
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var pos = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? match.__defaults__.pos : arguments[1];
            var endpos = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? match.__defaults__.endpos : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "pos")){
                pos = ρσ_kwargs_obj.pos;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "endpos")){
                endpos = ρσ_kwargs_obj.endpos;
            }
            return self._do_search(new RegExp("^" + self.js_pattern, self._modifiers), string, pos, endpos);
        };
        if (!RegexObject.prototype.match.__defaults__) Object.defineProperties(RegexObject.prototype.match, {
            __defaults__ : {value: {pos:0, endpos:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string", "pos", "endpos"]}
        });
        RegexObject.prototype.split = function split() {
            var self = this;
            var string = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var maxsplit = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? split.__defaults__.maxsplit : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "maxsplit")){
                maxsplit = ρσ_kwargs_obj.maxsplit;
            }
            self._pattern.lastIndex = 0;
            return string.split(self._pattern, maxsplit || undefined);
        };
        if (!RegexObject.prototype.split.__defaults__) Object.defineProperties(RegexObject.prototype.split, {
            __defaults__ : {value: {maxsplit:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["string", "maxsplit"]}
        });
        RegexObject.prototype.findall = function findall(string) {
            var self = this;
            self._pattern.lastIndex = 0;
            return ρσ_list_decorate(string.match(self._pattern) || []);
        };
        if (!RegexObject.prototype.findall.__argnames__) Object.defineProperties(RegexObject.prototype.findall, {
            __argnames__ : {value: ["string"]}
        });
        RegexObject.prototype.finditer = function finditer(string) {
            var self = this;
            var pat, ans;
            pat = new RegExp(this._pattern.source, this._modifiers);
            ans = {'_string':string, '_r':pat, '_self':self};
            ans[ρσ_iterator_symbol] = function () {
                return this;
            };
            ans["next"] = function () {
                var m;
                m = this._r.exec(this._string);
                if (m === null) {
                    return {'done':true};
                }
                return {'done':false, 'value':new MatchObject(this._self, m, 0, null)};
            };
            return ans;
        };
        if (!RegexObject.prototype.finditer.__argnames__) Object.defineProperties(RegexObject.prototype.finditer, {
            __argnames__ : {value: ["string"]}
        });
        RegexObject.prototype.subn = function subn() {
            var self = this;
            var repl = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var count = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? subn.__defaults__.count : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "count")){
                count = ρσ_kwargs_obj.count;
            }
            var expand, num, matches, m, start, end;
            expand = _expand;
            if (typeof repl === "function") {
                expand = (function() {
                    var ρσ_anonfunc = function (m, repl, gnm) {
                        return "" + repl(new MatchObject(self, m, 0, null));
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["m", "repl", "gnm"]}
                    });
                    return ρσ_anonfunc;
                })();
            }
            this._pattern.lastIndex = 0;
            num = 0;
            matches = [];
            while (count < 1 || num < count) {
                m = this._pattern.exec(string);
                if (m === null) {
                    break;
                }
                matches.push(m);
                num += 1;
            }
            for (var i = matches.length - 1; i > -1; i--) {
                m = matches[(typeof i === "number" && i < 0) ? matches.length + i : i];
                start = m.index;
                end = start + m[0].length;
                string = string.slice(0, start) + expand(m, repl, self.group_name_map) + string.slice(end);
            }
            return [string, matches.length];
        };
        if (!RegexObject.prototype.subn.__defaults__) Object.defineProperties(RegexObject.prototype.subn, {
            __defaults__ : {value: {count:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["repl", "string", "count"]}
        });
        RegexObject.prototype.sub = function sub() {
            var self = this;
            var repl = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var count = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sub.__defaults__.count : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "count")){
                count = ρσ_kwargs_obj.count;
            }
            return self.subn(repl, string, count)[0];
        };
        if (!RegexObject.prototype.sub.__defaults__) Object.defineProperties(RegexObject.prototype.sub, {
            __defaults__ : {value: {count:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["repl", "string", "count"]}
        });
        RegexObject.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        RegexObject.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(RegexObject.prototype, "__bases__", {value: []});

        function _get_from_cache(pattern, flags) {
            var key, ans;
            if (ρσ_instanceof(pattern, RegExp)) {
                pattern = pattern.source;
            }
            key = JSON.stringify([pattern, flags]);
            if (has_prop(_re_cache_map, key)) {
                return _re_cache_map[(typeof key === "number" && key < 0) ? _re_cache_map.length + key : key];
            }
            if (_re_cache_items.length >= 100) {
                delete _re_cache_map[_re_cache_items.shift()];
            }
            ans = new RegexObject(pattern, flags);
            _re_cache_map[(typeof key === "number" && key < 0) ? _re_cache_map.length + key : key] = ans;
            _re_cache_items.push(key);
            return ans;
        };
        if (!_get_from_cache.__argnames__) Object.defineProperties(_get_from_cache, {
            __argnames__ : {value: ["pattern", "flags"]}
        });

        function compile() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var flags = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? compile.__defaults__.flags : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags);
        };
        if (!compile.__defaults__) Object.defineProperties(compile, {
            __defaults__ : {value: {flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "flags"]}
        });

        function search() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var flags = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? search.__defaults__.flags : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).search(string);
        };
        if (!search.__defaults__) Object.defineProperties(search, {
            __defaults__ : {value: {flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "string", "flags"]}
        });

        function match() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var flags = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? match.__defaults__.flags : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).match(string);
        };
        if (!match.__defaults__) Object.defineProperties(match, {
            __defaults__ : {value: {flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "string", "flags"]}
        });

        function split() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var maxsplit = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? split.__defaults__.maxsplit : arguments[2];
            var flags = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? split.__defaults__.flags : arguments[3];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "maxsplit")){
                maxsplit = ρσ_kwargs_obj.maxsplit;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).split(string);
        };
        if (!split.__defaults__) Object.defineProperties(split, {
            __defaults__ : {value: {maxsplit:0, flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "string", "maxsplit", "flags"]}
        });

        function findall() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var flags = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? findall.__defaults__.flags : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).findall(string);
        };
        if (!findall.__defaults__) Object.defineProperties(findall, {
            __defaults__ : {value: {flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "string", "flags"]}
        });

        function finditer() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var string = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var flags = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? finditer.__defaults__.flags : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).finditer(string);
        };
        if (!finditer.__defaults__) Object.defineProperties(finditer, {
            __defaults__ : {value: {flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "string", "flags"]}
        });

        function sub() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var repl = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var string = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var count = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sub.__defaults__.count : arguments[3];
            var flags = (arguments[4] === undefined || ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? sub.__defaults__.flags : arguments[4];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "count")){
                count = ρσ_kwargs_obj.count;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).sub(repl, string, count);
        };
        if (!sub.__defaults__) Object.defineProperties(sub, {
            __defaults__ : {value: {count:0, flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "repl", "string", "count", "flags"]}
        });

        function subn() {
            var pattern = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var repl = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var string = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var count = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? subn.__defaults__.count : arguments[3];
            var flags = (arguments[4] === undefined || ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? subn.__defaults__.flags : arguments[4];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "count")){
                count = ρσ_kwargs_obj.count;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "flags")){
                flags = ρσ_kwargs_obj.flags;
            }
            return _get_from_cache(pattern, flags).subn(repl, string, count);
        };
        if (!subn.__defaults__) Object.defineProperties(subn, {
            __defaults__ : {value: {count:0, flags:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["pattern", "repl", "string", "count", "flags"]}
        });

        function escape(string) {
            return string.replace(_RE_ESCAPE, "\\$&");
        };
        if (!escape.__argnames__) Object.defineProperties(escape, {
            __argnames__ : {value: ["string"]}
        });

        function purge() {
            _re_cache_map = {};
            _re_cache_items = [];
        };

        ρσ_modules.re._ALIAS_MAP = _ALIAS_MAP;
        ρσ_modules.re._ASCII_CONTROL_CHARS = _ASCII_CONTROL_CHARS;
        ρσ_modules.re._HEX_PAT = _HEX_PAT;
        ρσ_modules.re._NUM_PAT = _NUM_PAT;
        ρσ_modules.re._GROUP_PAT = _GROUP_PAT;
        ρσ_modules.re._NAME_PAT = _NAME_PAT;
        ρσ_modules.re.I = I;
        ρσ_modules.re.IGNORECASE = IGNORECASE;
        ρσ_modules.re.L = L;
        ρσ_modules.re.LOCALE = LOCALE;
        ρσ_modules.re.M = M;
        ρσ_modules.re.MULTILINE = MULTILINE;
        ρσ_modules.re.D = D;
        ρσ_modules.re.DOTALL = DOTALL;
        ρσ_modules.re.U = U;
        ρσ_modules.re.UNICODE = UNICODE;
        ρσ_modules.re.X = X;
        ρσ_modules.re.VERBOSE = VERBOSE;
        ρσ_modules.re.DEBUG = DEBUG;
        ρσ_modules.re.A = A;
        ρσ_modules.re.ASCII = ASCII;
        ρσ_modules.re.supports_unicode = supports_unicode;
        ρσ_modules.re._RE_ESCAPE = _RE_ESCAPE;
        ρσ_modules.re._re_cache_map = _re_cache_map;
        ρσ_modules.re._re_cache_items = _re_cache_items;
        ρσ_modules.re.error = error;
        ρσ_modules.re.has_prop = has_prop;
        ρσ_modules.re._expand = _expand;
        ρσ_modules.re.transform_regex = transform_regex;
        ρσ_modules.re.MatchObject = MatchObject;
        ρσ_modules.re.RegexObject = RegexObject;
        ρσ_modules.re._get_from_cache = _get_from_cache;
        ρσ_modules.re.compile = compile;
        ρσ_modules.re.search = search;
        ρσ_modules.re.match = match;
        ρσ_modules.re.split = split;
        ρσ_modules.re.findall = findall;
        ρσ_modules.re.finditer = finditer;
        ρσ_modules.re.sub = sub;
        ρσ_modules.re.subn = subn;
        ρσ_modules.re.escape = escape;
        ρσ_modules.re.purge = purge;
    })();

    (function(){
        var __name__ = "utils";
        var re = ρσ_modules.re;

        var E = ρσ_modules.elementmaker.E;

        function replaceRollsCallback(match, replaceCB) {
            var dice, modifiers, result;
            dice = match.group(2);
            modifiers = match.group(3);
            if (!(typeof dice !== "undefined" && dice !== null)) {
                dice = "";
                modifiers = match.group(4);
            }
            result = match.group(1);
            result += replaceCB(dice, modifiers);
            result += match.group(5);
            return result;
        };
        if (!replaceRollsCallback.__argnames__) Object.defineProperties(replaceRollsCallback, {
            __argnames__ : {value: ["match", "replaceCB"]}
        });

        function replaceRolls(text, replaceCB) {
            var dice_regexp;
            dice_regexp = "(^|[^\\w])(?:(?:(?:(\\d*d\\d+(?:ro<2)?)((?:\\s*[-+]\\s*\\d+)*))|((?:[-+]\\s*\\d+)+)))($|[^\\w])";
            return re.sub(dice_regexp, (function() {
                var ρσ_anonfunc = function (m) {
                    return replaceRollsCallback(m, replaceCB);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["m"]}
                });
                return ρσ_anonfunc;
            })(), text);
        };
        if (!replaceRolls.__argnames__) Object.defineProperties(replaceRolls, {
            __argnames__ : {value: ["text", "replaceCB"]}
        });

        function cleanRoll(rollText) {
            rollText = rollText.replace(/\+ \+/g, "+").replace(/\+ \-/g, "-");
            return rollText;
        };
        if (!cleanRoll.__argnames__) Object.defineProperties(cleanRoll, {
            __argnames__ : {value: ["rollText"]}
        });

        function getBrowser() {
            if ((typeof chrome !== "undefined" && (typeof typeof chrome !== "object" || ρσ_not_equals(typeof chrome, "undefined")))) {
                if ((typeof browser !== "undefined" && (typeof typeof browser !== "object" || ρσ_not_equals(typeof browser, "undefined")))) {
                    return "Firefox";
                } else {
                    return "Chrome";
                }
            } else {
                return "Edge";
            }
        };

        function isExtensionDisconnected() {
            try {
                chrome.extension.getURL("");
                return false;
            } catch (ρσ_Exception) {
                ρσ_last_exception = ρσ_Exception;
                {
                    return true;
                } 
            }
        };

        function injectPageScript(url) {
            var s;
            s = document.createElement("script");
            s.src = url;
            s.charset = "UTF-8";
            s.onload = function () {
                this.remove();
            };
            (document.head || document.documentElement).appendChild(s);
        };
        if (!injectPageScript.__argnames__) Object.defineProperties(injectPageScript, {
            __argnames__ : {value: ["url"]}
        });

        function injectCSS(css) {
            var s;
            s = document.createElement("style");
            s.textContent = css;
            (document.head || document.documentElement).appendChild(s);
        };
        if (!injectCSS.__argnames__) Object.defineProperties(injectCSS, {
            __argnames__ : {value: ["css"]}
        });

        function sendCustomEvent(name, data) {
            var event;
            if (ρσ_equals(getBrowser(), "Firefox")) {
                data = cloneInto(data, window);
            }
            event = new CustomEvent("Beyond20_" + name, (function(){
                var ρσ_d = {};
                ρσ_d["detail"] = data;
                return ρσ_d;
            }).call(this));
            document.dispatchEvent(event);
        };
        if (!sendCustomEvent.__argnames__) Object.defineProperties(sendCustomEvent, {
            __argnames__ : {value: ["name", "data"]}
        });

        function addCustomEventListener(name, callback) {
            var cb, event;
            cb = (function() {
                var ρσ_anonfunc = function (evt) {
                    callback.apply(this, evt.detail);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["evt"]}
                });
                return ρσ_anonfunc;
            })();
            event = ρσ_list_decorate([ "Beyond20_" + name, cb, false ]);
            document.addEventListener.apply(document, event);
            return event;
        };
        if (!addCustomEventListener.__argnames__) Object.defineProperties(addCustomEventListener, {
            __argnames__ : {value: ["name", "callback"]}
        });

        function roll20Title(title) {
            return title.replace(" | Roll20", "");
        };
        if (!roll20Title.__argnames__) Object.defineProperties(roll20Title, {
            __argnames__ : {value: ["title"]}
        });

        function isFVTT(title) {
            return ρσ_in("Foundry Virtual Tabletop", title);
        };
        if (!isFVTT.__argnames__) Object.defineProperties(isFVTT, {
            __argnames__ : {value: ["title"]}
        });

        function fvttTitle(title) {
            return title.replace(" • Foundry Virtual Tabletop", "");
        };
        if (!fvttTitle.__argnames__) Object.defineProperties(fvttTitle, {
            __argnames__ : {value: ["title"]}
        });

        function urlMatches(url, matching) {
            return ρσ_not_equals(url.match(matching.replace(/\*/g, "[^]*")), null);
        };
        if (!urlMatches.__argnames__) Object.defineProperties(urlMatches, {
            __argnames__ : {value: ["url", "matching"]}
        });

        function alertSettings(url, title) {
            var popup, img, dialog;
            popup = chrome.extension.getURL(url);
            img = ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({src: chrome.extension.getURL("images/icons/icon32.png"), style: "margin-right: 3px;"})]);
            if (!ρσ_exists.n(alertify.Beyond20Settings)) {
                alertify.dialog("Beyond20Settings", function () {
                    return {};
                }, false, "alert");
            }
            dialog = alertify.Beyond20Settings(img.outerHTML + title, ρσ_interpolate_kwargs.call(E, E.iframe, [ρσ_desugar_kwargs({src: popup, style: "width: 100%; height: 100%;", frameborder: "0", scrolling: "yes"})]));
            dialog.set("padding", false).set("resizable", true).set("overflow", false).resizeTo("80%", "80%");
        };
        if (!alertSettings.__argnames__) Object.defineProperties(alertSettings, {
            __argnames__ : {value: ["url", "title"]}
        });

        function alertQuickSettings() {
            alertSettings("popup.html", "Beyond 20 Quick Settings");
        };

        function alertFullSettings() {
            alertSettings("options.html", "Beyond 20 Settings");
        };

        function isListEqual(list1, list2) {
            var list1_str, list2_str;
            list1_str = list1.join(",");
            list2_str = list2.join(",");
            return (list1_str === list2_str || typeof list1_str === "object" && ρσ_equals(list1_str, list2_str));
        };
        if (!isListEqual.__argnames__) Object.defineProperties(isListEqual, {
            __argnames__ : {value: ["list1", "list2"]}
        });

        function isObjectEqual(obj1, obj2) {
            var obj1_str, obj2_str;
            obj1_str = Object.entries(obj1).join(",");
            obj2_str = Object.entries(obj2).join(",");
            return (obj1_str === obj2_str || typeof obj1_str === "object" && ρσ_equals(obj1_str, obj2_str));
        };
        if (!isObjectEqual.__argnames__) Object.defineProperties(isObjectEqual, {
            __argnames__ : {value: ["obj1", "obj2"]}
        });

        ρσ_modules.utils.replaceRollsCallback = replaceRollsCallback;
        ρσ_modules.utils.replaceRolls = replaceRolls;
        ρσ_modules.utils.cleanRoll = cleanRoll;
        ρσ_modules.utils.getBrowser = getBrowser;
        ρσ_modules.utils.isExtensionDisconnected = isExtensionDisconnected;
        ρσ_modules.utils.injectPageScript = injectPageScript;
        ρσ_modules.utils.injectCSS = injectCSS;
        ρσ_modules.utils.sendCustomEvent = sendCustomEvent;
        ρσ_modules.utils.addCustomEventListener = addCustomEventListener;
        ρσ_modules.utils.roll20Title = roll20Title;
        ρσ_modules.utils.isFVTT = isFVTT;
        ρσ_modules.utils.fvttTitle = fvttTitle;
        ρσ_modules.utils.urlMatches = urlMatches;
        ρσ_modules.utils.alertSettings = alertSettings;
        ρσ_modules.utils.alertQuickSettings = alertQuickSettings;
        ρσ_modules.utils.alertFullSettings = alertFullSettings;
        ρσ_modules.utils.isListEqual = isListEqual;
        ρσ_modules.utils.isObjectEqual = isObjectEqual;
    })();

    (function(){
        var __name__ = "settings";
        var options_list, character_settings, current_tab;
        var E = ρσ_modules.elementmaker.E;

        var roll20Title = ρσ_modules.utils.roll20Title;
        var fvttTitle = ρσ_modules.utils.fvttTitle;
        var isFVTT = ρσ_modules.utils.isFVTT;

        function WhisperType() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            WhisperType.prototype.__init__.apply(this, arguments);
        }
        WhisperType.prototype.__init__ = function __init__ () {
                    };
        WhisperType.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        WhisperType.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(WhisperType.prototype, "__bases__", {value: []});
        WhisperType.prototype.NO = 0;
        WhisperType.prototype.YES = 1;
        WhisperType.prototype.QUERY = 2;
        WhisperType.prototype.HIDE_NAMES = 3;

        function RollType() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            RollType.prototype.__init__.apply(this, arguments);
        }
        RollType.prototype.__init__ = function __init__ () {
                    };
        RollType.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        RollType.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(RollType.prototype, "__bases__", {value: []});
        RollType.prototype.NORMAL = 0;
        RollType.prototype.DOUBLE = 1;
        RollType.prototype.QUERY = 2;
        RollType.prototype.ADVANTAGE = 3;
        RollType.prototype.DISADVANTAGE = 4;
        RollType.prototype.THRICE = 5;
        RollType.prototype.SUPER_ADVANTAGE = 6;
        RollType.prototype.SUPER_DISADVANTAGE = 7;
        RollType.prototype.OVERRIDE_ADVANTAGE = 8;

        function CriticalRules() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            CriticalRules.prototype.__init__.apply(this, arguments);
        }
        CriticalRules.prototype.__init__ = function __init__ () {
                    };
        CriticalRules.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        CriticalRules.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(CriticalRules.prototype, "__bases__", {value: []});
        CriticalRules.prototype.PHB = 0;
        CriticalRules.prototype.HOMEBREW_MAX = 1;
        CriticalRules.prototype.HOMEBREW_DOUBLE = 2;
        CriticalRules.prototype.HOMEBREW_MOD = 3;
        CriticalRules.prototype.HOMEBREW_REROLL = 4;

        options_list = (function(){
            var ρσ_d = {};
            ρσ_d["whisper-type"] = (function(){
                var ρσ_d = {};
                ρσ_d["short"] = "Whisper rolls";
                ρσ_d["title"] = "Whisper rolls to the DM";
                ρσ_d["description"] = "Determines if the rolls will be whispered to the DM.\nIn the case of Foundry VTT, the 'ask every time' option will use the setting in the chat box.";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = WhisperType.prototype.NO;
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d[str(WhisperType.prototype.NO)] = "Never whisper";
                    ρσ_d[str(WhisperType.prototype.YES)] = "Always whisper";
                    ρσ_d[str(WhisperType.prototype.QUERY)] = "Ask every time";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["whisper-type-monsters"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Whisper monster rolls to the DM";
                ρσ_d["description"] = "Overrides the global whisper setting from monster stat blocks";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = WhisperType.prototype.YES;
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d[str(WhisperType.prototype.NO)] = "Use general whisper setting";
                    ρσ_d[str(WhisperType.prototype.HIDE_NAMES)] = "Hide monster and attack name";
                    ρσ_d[str(WhisperType.prototype.YES)] = "Always whisper monster rolls";
                    ρσ_d[str(WhisperType.prototype.QUERY)] = "Ask every time";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["roll-type"] = (function(){
                var ρσ_d = {};
                ρσ_d["short"] = "Type of Roll";
                ρσ_d["title"] = "Type of Roll (Advantange/Disadvantage)";
                ρσ_d["description"] = "Determines if rolls should be with advantage, disadvantage, double rolls or user queries";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = RollType.prototype.NORMAL;
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d[str(RollType.prototype.NORMAL)] = "Normal Roll";
                    ρσ_d[str(RollType.prototype.DOUBLE)] = "Always roll twice";
                    ρσ_d[str(RollType.prototype.QUERY)] = "Ask every time";
                    ρσ_d[str(RollType.prototype.ADVANTAGE)] = "Roll with Advantage";
                    ρσ_d[str(RollType.prototype.DISADVANTAGE)] = "Roll with Disadvantage";
                    ρσ_d[str(RollType.prototype.THRICE)] = "Always roll thrice (limited support on Roll20)";
                    ρσ_d[str(RollType.prototype.SUPER_ADVANTAGE)] = "Roll with Super Advantage";
                    ρσ_d[str(RollType.prototype.SUPER_DISADVANTAGE)] = "Roll with Super Disadvantage";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["quick-rolls"] = (function(){
                var ρσ_d = {};
                ρσ_d["short"] = "Add Quick Roll areas";
                ρσ_d["title"] = "Add Quick Rolls areas to main page";
                ρσ_d["description"] = "Listen to clicks in specific areas of the abilities, skills, actions and spells to quickly roll them.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["auto-roll-damage"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Auto roll Damage and Crit";
                ρσ_d["description"] = "Always roll damage and critical hit dice when doing an attack";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["initiative-tracker"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Add initiative roll to the Turn Tracker";
                ρσ_d["description"] = "Adds the result of the initiative roll to the turn tracker.\nThis requires you to have a token selected in the VTT\nIf using Roll20, it will also change the way the output of 'Advantage on initiative' rolls appear.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["initiative-tiebreaker"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Add tiebreaker to initiative rolls";
                ρσ_d["description"] = "Adds the dexterity score as a decimal to initiative rolls to break any initiative ties.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["critical-homebrew"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Critical hit rule";
                ρσ_d["description"] = "Determines how the additional critical hit damages are determined";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = CriticalRules.prototype.PHB;
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d[str(CriticalRules.prototype.PHB)] = "Standard PHB Rules (reroll dice)";
                    ρσ_d[str(CriticalRules.prototype.HOMEBREW_MAX)] = "Homebrew: Perfect rolls";
                    ρσ_d[str(CriticalRules.prototype.HOMEBREW_REROLL)] = "Homebrew: Reroll all damages";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["weapon-force-critical"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Force all attacks as Critical Hits";
                ρσ_d["description"] = "Forces all attacks to be considered as critical hits. Useful for melee attacks against paralyzed enemies or using adamantine weapons against objects";
                ρσ_d["short"] = "Force Critical Hits";
                ρσ_d["short_description"] = "Useful for melee attacks against paralyzed enemies or using adamantine weapons against objects";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["update-hp"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Update VTT Token HP";
                ρσ_d["description"] = "When changing HP in D&D Beyond, update it in the VTT tokens and sheets";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["display-conditions"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Display Condition updates to VTT";
                ρσ_d["description"] = "When updating character conditions in D&D Beyond, display a message in the VTT chat.\nIf using Foundry VTT with the Beyond20 module, it will also update the token's status icons appropriately.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["template"] = (function(){
                var ρσ_d = {};
                ρσ_d["type"] = "migrate";
                ρσ_d["default"] = "roll20-template";
                return ρσ_d;
            }).call(this);
            ρσ_d["roll20-template"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Roll20 Character Sheet Setting";
                ρσ_d["description"] = "Select the Character Sheet Template that you use in Roll20\nIf the templates do not match, you will not see anything printed in the Roll20 chat.";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = "roll20";
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d["roll20"] = "D&D 5E By Roll20";
                    ρσ_d["default"] = "Other templates";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["subst-roll20"] = (function(){
                var ρσ_d = {};
                ρσ_d["type"] = "migrate";
                ρσ_d["default"] = "subst-vtt";
                return ρσ_d;
            }).call(this);
            ρσ_d["subst-vtt"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Replace Dices formulas in the VTT";
                ρσ_d["description"] = "In Roll20 or Foundry VTT, if a spell card or an item or a feat has a dice formula in its description,\nenabling this will make the formula clickable to generate the roll in chat.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["subst-dndbeyond"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Replace Dices formulas in D&D Beyond (Spells & Character Sheet)";
                ρσ_d["description"] = "In the D&D Beyond Spell page or Character sheet side panel, if a spell, item, feat or action has a dice formula in its description,\nenabling this will add a dice icon next to the formula to allow you to roll it.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["subst-dndbeyond-stat-blocks"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Replace Dices formulas in D&D Beyond (Stat blocks)";
                ρσ_d["description"] = "In D&D Beyond, if a dice formula is found in the stat block of a creature, monster, vehicle,\nenabling this will add a dice icon next to the formula to allow you to roll it.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["handle-stat-blocks"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Add roll buttons to stat blocks";
                ρσ_d["description"] = "In D&D Beyond, adds roll buttons for abilities/saving throws/skills/actions to the stat block of a creature, monster or vehicle.";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["crit-prefix"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Critical Hit Prefix";
                ρσ_d["description"] = "Prefix to add to the Critical Hit dice result.\nIt might be less confusing to explicitely show the crit damage";
                ρσ_d["type"] = "string";
                ρσ_d["default"] = "Crit: ";
                return ρσ_d;
            }).call(this);
            ρσ_d["components-display"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Components to display in spell attacks";
                ρσ_d["description"] = "When doing a spell attack, what components to show alongside the spell roll.";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = "all";
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d["all"] = "All components";
                    ρσ_d["material"] = "Only material components";
                    ρσ_d["none"] = "Do not display anything";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["component-prefix"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Component Prefix";
                ρσ_d["description"] = "Prefix to the components display of a spell attack.\nIf displaying material components only, you may want to set it to 'Materials used :' for example";
                ρσ_d["type"] = "string";
                ρσ_d["default"] = "Components: ";
                return ρσ_d;
            }).call(this);
            ρσ_d["roll20-tab"] = (function(){
                var ρσ_d = {};
                ρσ_d["type"] = "migrate";
                ρσ_d["default"] = "vtt-tab";
                return ρσ_d;
            }).call(this);
            ρσ_d["vtt-tab"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Select the VTT tab or Game to send rolls to";
                ρσ_d["description"] = "Select the tab to send rolls to or the specific Game.\nYou can select the Game or tab from the extension's popup menu in the VTT tab itself.\nAfter a specific tab is selected and that tab is closed, it will revert to sending rolls to the same Game.";
                ρσ_d["type"] = "special";
                ρσ_d["default"] = null;
                return ρσ_d;
            }).call(this);
            ρσ_d["discord-integration"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Discord Integration";
                ρσ_d["description"] = "You can get rolls sent to Discord by enabling Discord Integration!\nClick the link, follow the instructions and enter your secret key below.";
                ρσ_d["type"] = "link";
                ρσ_d["default"] = "https://beyond20.here-for-more.info/discord";
                ρσ_d["icon"] = "https://discordapp.com/assets/fc0b01fe10a0b8c602fb0106d8189d9b.png";
                ρσ_d["icon-height"] = "80";
                return ρσ_d;
            }).call(this);
            ρσ_d["discord-secret"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Discord Bot Secret Key";
                ρσ_d["description"] = "Enter the secret key the Bot gave you, or Discord server owner. Clear it to disable Discord integration.\nNote that sending to Discord only works with the D&D Beyond Dice Roller, and Foundry VTT.";
                ρσ_d["type"] = "string";
                ρσ_d["default"] = "";
                return ρσ_d;
            }).call(this);
            ρσ_d["show-changelog"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Show Changelog when installing a new version";
                ρσ_d["description"] = "When a new version is released and the extension has been updated,\nopen the changelog in a new window";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["last-version"] = (function(){
                var ρσ_d = {};
                ρσ_d["description"] = "Last version that was installed. Used to check if an update just happened";
                ρσ_d["type"] = "string";
                ρσ_d["hidden"] = true;
                ρσ_d["default"] = "";
                return ρσ_d;
            }).call(this);
            ρσ_d["donate"] = (function(){
                var ρσ_d = {};
                ρσ_d["short"] = "Buy rations (1 day) to feed my familiar";
                ρσ_d["title"] = "Become a patron of the art of software development!";
                ρσ_d["description"] = "If you wish to support my work on Beyond 20 or my other D&D related project, subscribe to my patreon or donate via paypal!\nI am grateful for your generosity!";
                ρσ_d["type"] = "link";
                ρσ_d["default"] = "https://beyond20.here-for-more.info/rations";
                ρσ_d["icon"] = "/images/donate.png";
                ρσ_d["icon-width"] = "64";
                ρσ_d["icon-height"] = "64";
                return ρσ_d;
            }).call(this);
            return ρσ_d;
        }).call(this);
        character_settings = (function(){
            var ρσ_d = {};
            ρσ_d["versatile-choice"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Versatile weapon choice";
                ρσ_d["description"] = "How to roll damage for Versatile weapons";
                ρσ_d["type"] = "combobox";
                ρσ_d["default"] = "both";
                ρσ_d["choices"] = (function(){
                    var ρσ_d = {};
                    ρσ_d["both"] = "Roll both damages separately";
                    ρσ_d["one"] = "Use weapon One-handed";
                    ρσ_d["two"] = "Use weapon Two-handed";
                    return ρσ_d;
                }).call(this);
                return ρσ_d;
            }).call(this);
            ρσ_d["custom-roll-dice"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Custom Roll dice formula bonus";
                ρσ_d["description"] = "Add custom formula to d20 rolls (Bless, Guidance, Bane, Magic Weapon, etc..)";
                ρσ_d["type"] = "string";
                ρσ_d["default"] = "";
                return ρσ_d;
            }).call(this);
            ρσ_d["custom-damage-dice"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Custom Damage dice formula bonus";
                ρσ_d["description"] = "Add custom dice to damage rolls (Magic Weapon, Elemental Weapon, Green-flame Blade, etc..). Use a comma to separate multiple independent rolls.";
                ρσ_d["type"] = "string";
                ρσ_d["default"] = "";
                return ρσ_d;
            }).call(this);
            ρσ_d["rogue-sneak-attack"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Rogue: Sneak Attack";
                ρσ_d["description"] = "Send Sneak Attack damage with each attack roll";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["cleric-disciple-life"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Cleric: Disciple of Life";
                ρσ_d["description"] = "Send Disciple of Life healing bonus";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["bard-joat"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Bard: Jack of All Trades";
                ρσ_d["description"] = "Add JoaT bonus to raw ability checks";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["sharpshooter"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Fighter: Sharpshooter (Apply to next roll only)";
                ρσ_d["description"] = "Apply Sharpshooter -5 penalty to roll and +10 to damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["great-weapon-master"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Great Weapon Master Feat (Apply to next roll only)";
                ρσ_d["description"] = "Apply Great Weapon Master -5 penalty to roll and +10 to damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["brutal-critical"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Brutal Critical/Savage Attacks: Roll extra die";
                ρσ_d["description"] = "Roll extra damage die on crit for Brutal Critical and Savage Attacks features";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["barbarian-rage"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Rage: You are raging, ARRGGHHHHHH";
                ρσ_d["description"] = "Add Rage damage to melee attacks and add advantage to Strength checks and saving throws";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["bloodhunter-crimson-rite"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Bloodhunter: Crimson Rite";
                ρσ_d["description"] = "Add Crimson Rite damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["ranger-dread-ambusher"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Ranger: Dread Ambusher";
                ρσ_d["description"] = "Add Dread Ambusher attack 1d8 extra damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["paladin-legendary-strike"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Paladin: Legendary Strike";
                ρσ_d["description"] = "Channel Divinity and score critical hits on rolls of 19 and 20";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["paladin-improved-divine-smite"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Paladin: Improved Divine Smite";
                ρσ_d["description"] = "Roll an extra 1d8 radiant damage whenever you hit with a melee weapon";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["warlock-hexblade-curse"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Warlock: Hexblade's Curse";
                ρσ_d["description"] = "Apply the Hexblade's Curse extra damage on attack rolls and score critical hits on rolls of 19 and 20";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["rogue-assassinate"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Rogue: Assassinate surprise attack (Apply to next roll only)";
                ρσ_d["description"] = "Roll with advantage and roll critical damage dice";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["fighter-giant-might"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Fighter: Giant Might";
                ρσ_d["description"] = "Activate Giant Might to get advantage on Strength checks and saving throws and deal 1d6 extra damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["artificer-arcane-firearm"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Artificer: Use Arcane Firearm";
                ρσ_d["description"] = "Use an Arcane Firearm for your Artificer spells. Deals extra 1d8 damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["cleric-divine-strike"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Cleric: Divine Strike";
                ρσ_d["description"] = "Deal an extra 1d8 (2d8 at level 14) damage to melee weapon attacks";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = true;
                return ρσ_d;
            }).call(this);
            ρσ_d["bard-psychic-blades"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Bard: Psychic Blades";
                ρσ_d["description"] = "Use your Bardic Inspiration to deal extra psychic damage (Apply to next roll only)";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["ranger-planar-warrior"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Ranger: Planar Warrior";
                ρσ_d["description"] = "Use your Planar Warrior ability to deal extra Force damage";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["ranger-slayers-prey"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Ranger: Slayer's Prey";
                ρσ_d["description"] = "Use your Slayer's Prey ability and add 1d6 damage to your target";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            ρσ_d["ranger-gathered-swarm"] = (function(){
                var ρσ_d = {};
                ρσ_d["title"] = "Ranger: Gathered Swarm";
                ρσ_d["description"] = "Use your Gathered Swarm ability to add extra Force damage to your weapon attacks";
                ρσ_d["type"] = "bool";
                ρσ_d["default"] = false;
                return ρσ_d;
            }).call(this);
            return ρσ_d;
        }).call(this);
        function getStorage() {
            return chrome.storage.sync;
        };

        function storageGet(name, default_value, cb) {
            getStorage().get((function(){
                var ρσ_d = {};
                ρσ_d[name] = default_value;
                return ρσ_d;
            }).call(this), (function() {
                var ρσ_anonfunc = function (items) {
                    cb(items[(typeof name === "number" && name < 0) ? items.length + name : name]);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["items"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!storageGet.__argnames__) Object.defineProperties(storageGet, {
            __argnames__ : {value: ["name", "default_value", "cb"]}
        });

        function storageSet() {
            var name = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var value = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var cb = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? storageSet.__defaults__.cb : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            getStorage().set((function(){
                var ρσ_d = {};
                ρσ_d[name] = value;
                return ρσ_d;
            }).call(this), function () {
                if (chrome.runtime.lastError) {
                    console.log("Chrome Runtime Error", chrome.runtime.lastError.message);
                } else if (cb) {
                    cb(value);
                }
            });
        };
        if (!storageSet.__defaults__) Object.defineProperties(storageSet, {
            __defaults__ : {value: {cb:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["name", "value", "cb"]}
        });

        function storageRemove() {
            var names = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var cb = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? storageRemove.__defaults__.cb : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            getStorage().remove(names, function () {
                if (cb) {
                    cb(names);
                }
            });
        };
        if (!storageRemove.__defaults__) Object.defineProperties(storageRemove, {
            __defaults__ : {value: {cb:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["names", "cb"]}
        });

        function getDefaultSettings() {
            var _list = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getDefaultSettings.__defaults__._list : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            var settings, option;
            settings = {};
            var ρσ_Iter0 = ρσ_Iterable(_list);
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                option = ρσ_Iter0[ρσ_Index0];
                settings[(typeof option === "number" && option < 0) ? settings.length + option : option] = _list[(typeof option === "number" && option < 0) ? _list.length + option : option].default;
            }
            return settings;
        };
        if (!getDefaultSettings.__defaults__) Object.defineProperties(getDefaultSettings, {
            __defaults__ : {value: {_list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["_list"]}
        });

        function getStoredSettings() {
            var cb = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var key = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getStoredSettings.__defaults__.key : arguments[1];
            var _list = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getStoredSettings.__defaults__._list : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
                key = ρσ_kwargs_obj.key;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            var settings, gotSettings;
            settings = getDefaultSettings(_list);
            gotSettings = (function() {
                var ρσ_anonfunc = function (stored_settings) {
                    var migrated_keys, opt;
                    migrated_keys = ρσ_list_decorate([]);
                    var ρσ_Iter1 = ρσ_Iterable(settings);
                    for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                        opt = ρσ_Iter1[ρσ_Index1];
                        if ((_list[(typeof opt === "number" && opt < 0) ? _list.length + opt : opt].type === "migrate" || typeof _list[(typeof opt === "number" && opt < 0) ? _list.length + opt : opt].type === "object" && ρσ_equals(_list[(typeof opt === "number" && opt < 0) ? _list.length + opt : opt].type, "migrate"))) {
                            if (ρσ_in(opt, stored_settings)) {
                                if ((stored_settings[(typeof opt === "number" && opt < 0) ? stored_settings.length + opt : opt] !== _list[(typeof opt === "number" && opt < 0) ? _list.length + opt : opt].default && (typeof stored_settings[(typeof opt === "number" && opt < 0) ? stored_settings.length + opt : opt] !== "object" || ρσ_not_equals(stored_settings[(typeof opt === "number" && opt < 0) ? stored_settings.length + opt : opt], _list[(typeof opt === "number" && opt < 0) ? _list.length + opt : opt].default)))) {
                                    stored_settings[ρσ_bound_index(_list[(typeof opt === "number" && opt < 0) ? _list.length + opt : opt].default, stored_settings)] = stored_settings[(typeof opt === "number" && opt < 0) ? stored_settings.length + opt : opt];
                                    migrated_keys.append(opt);
                                }
                                ρσ_delitem(stored_settings, opt);
                            }
                        } else if (!ρσ_in(opt, stored_settings)) {
                            stored_settings[(typeof opt === "number" && opt < 0) ? stored_settings.length + opt : opt] = settings[(typeof opt === "number" && opt < 0) ? settings.length + opt : opt];
                        }
                    }
                    if (migrated_keys.length > 0) {
                        print("Beyond20: Migrated some keys:", stored_settings);
                        storageSet(key, stored_settings);
                    }
                    cb(stored_settings);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["stored_settings"]}
                });
                return ρσ_anonfunc;
            })();
            storageGet(key, settings, gotSettings);
        };
        if (!getStoredSettings.__defaults__) Object.defineProperties(getStoredSettings, {
            __defaults__ : {value: {key:"settings", _list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["cb", "key", "_list"]}
        });

        function setSettings() {
            var settings = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var cb = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? setSettings.__defaults__.cb : arguments[1];
            var key = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? setSettings.__defaults__.key : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
                key = ρσ_kwargs_obj.key;
            }
            storageSet(key, settings, (function() {
                var ρσ_anonfunc = function (settings) {
                    console.log("Beyond20: Saved settings (" + key + "): ", settings);
                    if (cb) {
                        cb(settings);
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["settings"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!setSettings.__defaults__) Object.defineProperties(setSettings, {
            __defaults__ : {value: {cb:null, key:"settings"}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["settings", "cb", "key"]}
        });

        function mergeSettings() {
            var settings = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var cb = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? mergeSettings.__defaults__.cb : arguments[1];
            var key = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? mergeSettings.__defaults__.key : arguments[2];
            var _list = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? mergeSettings.__defaults__._list : arguments[3];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
                key = ρσ_kwargs_obj.key;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            console.log("Saving new settings (" + key + "): ", settings);
            function setNewSettings(stored_settings) {
                var k;
                var ρσ_Iter2 = ρσ_Iterable(settings);
                for (var ρσ_Index2 = 0; ρσ_Index2 < ρσ_Iter2.length; ρσ_Index2++) {
                    k = ρσ_Iter2[ρσ_Index2];
                    stored_settings[(typeof k === "number" && k < 0) ? stored_settings.length + k : k] = settings[(typeof k === "number" && k < 0) ? settings.length + k : k];
                }
                setSettings(stored_settings, cb, key);
            };
            if (!setNewSettings.__argnames__) Object.defineProperties(setNewSettings, {
                __argnames__ : {value: ["stored_settings"]}
            });

            getStoredSettings(setNewSettings, key, _list);
        };
        if (!mergeSettings.__defaults__) Object.defineProperties(mergeSettings, {
            __defaults__ : {value: {cb:null, key:"settings", _list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["settings", "cb", "key", "_list"]}
        });

        function resetSettings() {
            var cb = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? resetSettings.__defaults__.cb : arguments[0];
            var _list = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? resetSettings.__defaults__._list : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            setSettings(getDefaultSettings(_list), cb);
        };
        if (!resetSettings.__defaults__) Object.defineProperties(resetSettings, {
            __defaults__ : {value: {cb:null, _list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["cb", "_list"]}
        });

        function createHTMLOptionEx() {
            var name = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var option = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var short = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? createHTMLOptionEx.__defaults__.short : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "short")){
                short = ρσ_kwargs_obj.short;
            }
            var description, description_p, title, e, make_li, dropdown_options, p;
            if ((option.hidden === true || typeof option.hidden === "object" && ρσ_equals(option.hidden, true)) || short && !ρσ_exists.n(option.short) || !ρσ_exists.n(option.title)) {
                return null;
            }
            description = (short) ? option.short_description : option.description;
            description_p = (description) ? list(map(E.p, description.split("\n"))) : ρσ_list_decorate([]);
            title = (short) ? option.short : option.title;
            if ((option.type === "bool" || typeof option.type === "object" && ρσ_equals(option.type, "bool"))) {
                e = ρσ_interpolate_kwargs.call(E, E.li, [ρσ_interpolate_kwargs.call(E, E.label, [E.h4(title)].concat(description_p).concat([ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.input, [ρσ_desugar_kwargs({id: name, class_: "beyond20-option-input", name: name, type_: "checkbox"})]), ρσ_interpolate_kwargs.call(E, E.label, [ρσ_desugar_kwargs({for_: name, class_: "label-default"})])].concat([ρσ_desugar_kwargs({class_: "material-switch pull-right"})]))]).concat([ρσ_desugar_kwargs({class_: "list-content", for_: name})]))].concat([ρσ_desugar_kwargs({class_: "list-group-item beyond20-option beyond20-option-bool"})]));
            } else if ((option.type === "string" || typeof option.type === "object" && ρσ_equals(option.type, "string"))) {
                e = ρσ_interpolate_kwargs.call(E, E.li, [ρσ_interpolate_kwargs.call(E, E.label, [E.h4(title)].concat(description_p).concat([ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.input, [ρσ_desugar_kwargs({id: name, class_: "beyond20-option-input", name: name, type_: "text"})])].concat([ρσ_desugar_kwargs({class_: "right-entry"})]))]).concat([ρσ_desugar_kwargs({class_: "list-content", for_: name})]))].concat([ρσ_desugar_kwargs({class_: "list-group-item beyond20-option beyond20-option-string"})]));
            } else if ((option.type === "combobox" || typeof option.type === "object" && ρσ_equals(option.type, "combobox"))) {
                make_li = (function() {
                    var ρσ_anonfunc = function (o) {
                        return E.li(ρσ_interpolate_kwargs.call(E, E.a, [o].concat([ρσ_desugar_kwargs({href: "#"})])));
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["o"]}
                    });
                    return ρσ_anonfunc;
                })();
                dropdown_options = list(map(make_li, Object.values(option.choices)));
                var ρσ_Iter3 = ρσ_Iterable(description_p);
                for (var ρσ_Index3 = 0; ρσ_Index3 < ρσ_Iter3.length; ρσ_Index3++) {
                    p = ρσ_Iter3[ρσ_Index3];
                    p.classList.add("select");
                }
                e = ρσ_interpolate_kwargs.call(E, E.li, [ρσ_interpolate_kwargs.call(E, E.label, [ρσ_interpolate_kwargs.call(E, E.h4, [title].concat([ρσ_desugar_kwargs({class_: "select"})]))].concat(description_p).concat([ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.a, [(ρσ_expr_temp = option.choices)[ρσ_bound_index(option.default, ρσ_expr_temp)]].concat([ρσ_desugar_kwargs({id: name, class_: "input select beyond20-option-input", href: ""})])), ρσ_interpolate_kwargs.call(E, E.ul, dropdown_options.concat([ρσ_desugar_kwargs({class_: "dropdown-menu"})])), ρσ_interpolate_kwargs.call(E, E.i, [ρσ_desugar_kwargs({id: name + "--icon", class_: "icon select"})])].concat([ρσ_desugar_kwargs({class_: "button-group"})]))]).concat([ρσ_desugar_kwargs({class_: "list-content", for_: name})]))].concat([ρσ_desugar_kwargs({class_: "list-group-item beyond20-option beyond20-option-combobox"})]));
            } else if ((option.type === "link" || typeof option.type === "object" && ρσ_equals(option.type, "link"))) {
                e = ρσ_interpolate_kwargs.call(E, E.li, [ρσ_interpolate_kwargs.call(E, E.label, [ρσ_interpolate_kwargs.call(E, E.a, [E.h4(title)].concat([ρσ_desugar_kwargs({href: option.default})]))].concat(description_p).concat([ρσ_interpolate_kwargs.call(E, E.a, [ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({class_: "link-image", width: option["icon-width"], height: option["icon-height"], src: (option.icon.startsWith("/")) ? chrome.extension.getURL(option.icon) : option.icon})])].concat([ρσ_desugar_kwargs({class_: "image-link"})]))].concat([ρσ_desugar_kwargs({href: option.default})]))]).concat([ρσ_desugar_kwargs({class_: "list-content", id: name})]))].concat([ρσ_desugar_kwargs({class_: "list-group-item beyond20-option beyond20-option-link"})]));
            } else if ((option.type === "special" || typeof option.type === "object" && ρσ_equals(option.type, "special"))) {
                e = option.createHTMLElement(name, short);
            }
            return e;
        };
        if (!createHTMLOptionEx.__defaults__) Object.defineProperties(createHTMLOptionEx, {
            __defaults__ : {value: {short:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["name", "option", "short"]}
        });

        function createHTMLOption() {
            var name = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var short = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? createHTMLOption.__defaults__.short : arguments[1];
            var _list = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? createHTMLOption.__defaults__._list : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "short")){
                short = ρσ_kwargs_obj.short;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            return createHTMLOptionEx(name, _list[(typeof name === "number" && name < 0) ? _list.length + name : name], short);
        };
        if (!createHTMLOption.__defaults__) Object.defineProperties(createHTMLOption, {
            __defaults__ : {value: {short:false, _list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["name", "short", "_list"]}
        });

        function initializeMarkaGroup(group) {
            var triggerOpen, triggerClose, dropdown_menu, button_group, marka, input, m, makeOpenCB, makeCloseCB;
            triggerOpen = $(group).find(".select");
            triggerClose = $(group).find(".dropdown-menu li");
            dropdown_menu = $(group).find(".dropdown-menu");
            button_group = $(group).find(".button-group");
            marka = $(group).find(".icon");
            input = $(group).find(".input");
            m = new Marka("#" + marka.attr("id"));
            m.set("triangle").size(10);
            m.rotate("down");
            $(group).find(".button-group").append(marka);
            makeOpenCB = (function() {
                var ρσ_anonfunc = function (dropdown_menu, icon, m) {
                    return (function() {
                        var ρσ_anonfunc = function (event) {
                            event.preventDefault();
                            dropdown_menu.toggleClass("open");
                            button_group.toggleClass("open");
                            if (icon.hasClass("marka-icon-times")) {
                                m.set("triangle").size(10);
                            } else {
                                m.set("times").size(15);
                            }
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["event"]}
                        });
                        return ρσ_anonfunc;
                    })();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["dropdown_menu", "icon", "m"]}
                });
                return ρσ_anonfunc;
            })();
            makeCloseCB = (function() {
                var ρσ_anonfunc = function (dropdown_menu, input, m) {
                    return (function() {
                        var ρσ_anonfunc = function (event) {
                            event.preventDefault();
                            input.text(this.innerText);
                            input.trigger("markaChanged");
                            dropdown_menu.removeClass("open");
                            button_group.removeClass("open");
                            m.set("triangle").size(10);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["event"]}
                        });
                        return ρσ_anonfunc;
                    })();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["dropdown_menu", "input", "m"]}
                });
                return ρσ_anonfunc;
            })();
            triggerOpen.bind("click", makeOpenCB(dropdown_menu, marka, m));
            triggerClose.bind("click", makeCloseCB(dropdown_menu, input, m));
        };
        if (!initializeMarkaGroup.__argnames__) Object.defineProperties(initializeMarkaGroup, {
            __argnames__ : {value: ["group"]}
        });

        function initializeMarka() {
            var groups, group;
            groups = $(".beyond20-option-combobox");
            var ρσ_Iter4 = ρσ_Iterable(groups);
            for (var ρσ_Index4 = 0; ρσ_Index4 < ρσ_Iter4.length; ρσ_Index4++) {
                group = ρσ_Iter4[ρσ_Index4];
                initializeMarkaGroup(group);
            }
        };

        function extractSettingsData() {
            var _list = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? extractSettingsData.__defaults__._list : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            var settings, e, o_type, val, choices, key, option;
            settings = {};
            var ρσ_Iter5 = ρσ_Iterable(_list);
            for (var ρσ_Index5 = 0; ρσ_Index5 < ρσ_Iter5.length; ρσ_Index5++) {
                option = ρσ_Iter5[ρσ_Index5];
                e = $("#" + option);
                if (e.length > 0) {
                    o_type = _list[(typeof option === "number" && option < 0) ? _list.length + option : option].type;
                    if ((o_type === "bool" || typeof o_type === "object" && ρσ_equals(o_type, "bool"))) {
                        settings[(typeof option === "number" && option < 0) ? settings.length + option : option] = e.prop("checked");
                    } else if ((o_type === "combobox" || typeof o_type === "object" && ρσ_equals(o_type, "combobox"))) {
                        val = e.text();
                        choices = _list[(typeof option === "number" && option < 0) ? _list.length + option : option].choices;
                        var ρσ_Iter6 = ρσ_Iterable(choices);
                        for (var ρσ_Index6 = 0; ρσ_Index6 < ρσ_Iter6.length; ρσ_Index6++) {
                            key = ρσ_Iter6[ρσ_Index6];
                            if ((choices[(typeof key === "number" && key < 0) ? choices.length + key : key] === val || typeof choices[(typeof key === "number" && key < 0) ? choices.length + key : key] === "object" && ρσ_equals(choices[(typeof key === "number" && key < 0) ? choices.length + key : key], val))) {
                                settings[(typeof option === "number" && option < 0) ? settings.length + option : option] = key;
                                break;
                            }
                        }
                    } else if ((o_type === "string" || typeof o_type === "object" && ρσ_equals(o_type, "string"))) {
                        settings[(typeof option === "number" && option < 0) ? settings.length + option : option] = e.val();
                    } else if ((o_type === "special" || typeof o_type === "object" && ρσ_equals(o_type, "special"))) {
                        settings[(typeof option === "number" && option < 0) ? settings.length + option : option] = _list[(typeof option === "number" && option < 0) ? _list.length + option : option].get(option);
                    }
                }
            }
            return settings;
        };
        if (!extractSettingsData.__defaults__) Object.defineProperties(extractSettingsData, {
            __defaults__ : {value: {_list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["_list"]}
        });

        function loadSettings() {
            var settings = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var _list = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? loadSettings.__defaults__._list : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            var o_type, val, choices, option;
            var ρσ_Iter7 = ρσ_Iterable(settings);
            for (var ρσ_Index7 = 0; ρσ_Index7 < ρσ_Iter7.length; ρσ_Index7++) {
                option = ρσ_Iter7[ρσ_Index7];
                if (!_list[(typeof option === "number" && option < 0) ? _list.length + option : option]) {
                    continue;
                }
                o_type = _list[(typeof option === "number" && option < 0) ? _list.length + option : option].type;
                if ((o_type === "bool" || typeof o_type === "object" && ρσ_equals(o_type, "bool"))) {
                    $("#" + option).prop("checked", settings[(typeof option === "number" && option < 0) ? settings.length + option : option]);
                } else if ((o_type === "combobox" || typeof o_type === "object" && ρσ_equals(o_type, "combobox"))) {
                    val = settings[(typeof option === "number" && option < 0) ? settings.length + option : option];
                    choices = _list[(typeof option === "number" && option < 0) ? _list.length + option : option].choices;
                    $("#" + option).text(choices[(typeof val === "number" && val < 0) ? choices.length + val : val]);
                } else if ((o_type === "string" || typeof o_type === "object" && ρσ_equals(o_type, "string"))) {
                    $("#" + option).val(settings[(typeof option === "number" && option < 0) ? settings.length + option : option]);
                } else if ((o_type === "special" || typeof o_type === "object" && ρσ_equals(o_type, "special"))) {
                    _list[(typeof option === "number" && option < 0) ? _list.length + option : option].set(option, settings);
                }
            }
        };
        if (!loadSettings.__defaults__) Object.defineProperties(loadSettings, {
            __defaults__ : {value: {_list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["settings", "_list"]}
        });

        function restoreSavedSettings() {
            var cb = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? restoreSavedSettings.__defaults__.cb : arguments[0];
            var key = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? restoreSavedSettings.__defaults__.key : arguments[1];
            var _list = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? restoreSavedSettings.__defaults__._list : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
                key = ρσ_kwargs_obj.key;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            var load;
            load = (function() {
                var ρσ_anonfunc = function (stored_settings) {
                    loadSettings(stored_settings, _list);
                    if (cb) {
                        cb(stored_settings);
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["stored_settings"]}
                });
                return ρσ_anonfunc;
            })();
            getStoredSettings(load, key, _list);
        };
        if (!restoreSavedSettings.__defaults__) Object.defineProperties(restoreSavedSettings, {
            __defaults__ : {value: {cb:null, key:"settings", _list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["cb", "key", "_list"]}
        });

        function saveSettings() {
            var cb = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var key = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? saveSettings.__defaults__.key : arguments[1];
            var _list = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? saveSettings.__defaults__._list : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "key")){
                key = ρσ_kwargs_obj.key;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "_list")){
                _list = ρσ_kwargs_obj._list;
            }
            mergeSettings(extractSettingsData(_list), cb, key, _list);
        };
        if (!saveSettings.__defaults__) Object.defineProperties(saveSettings, {
            __defaults__ : {value: {key:"settings", _list:options_list}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["cb", "key", "_list"]}
        });

        function initializeSettings() {
            var cb = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? initializeSettings.__defaults__.cb : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cb")){
                cb = ρσ_kwargs_obj.cb;
            }
            initializeMarka();
            restoreSavedSettings(cb);
        };
        if (!initializeSettings.__defaults__) Object.defineProperties(initializeSettings, {
            __defaults__ : {value: {cb:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["cb"]}
        });

        function createRoll20TabCombobox(name, short, dropdown_options) {
            var opt, description, title, description_p, options, option, p;
            opt = options_list[(typeof name === "number" && name < 0) ? options_list.length + name : name];
            description = (short) ? "Restrict where rolls are sent.\nUseful if you have multiple VTT windows open" : opt.description;
            title = (short) ? "Send Beyond 20 rolls to" : opt.title;
            description_p = list(map(E.p, description.split("\n")));
            options = ρσ_list_decorate([]);
            var ρσ_Iter8 = ρσ_Iterable(dropdown_options);
            for (var ρσ_Index8 = 0; ρσ_Index8 < ρσ_Iter8.length; ρσ_Index8++) {
                option = ρσ_Iter8[ρσ_Index8];
                options.append(E.li(ρσ_interpolate_kwargs.call(E, E.a, [option].concat([ρσ_desugar_kwargs({href: "#"})]))));
            }
            var ρσ_Iter9 = ρσ_Iterable(description_p);
            for (var ρσ_Index9 = 0; ρσ_Index9 < ρσ_Iter9.length; ρσ_Index9++) {
                p = ρσ_Iter9[ρσ_Index9];
                p.classList.add("select");
            }
            return ρσ_interpolate_kwargs.call(E, E.li, [ρσ_interpolate_kwargs.call(E, E.label, [ρσ_interpolate_kwargs.call(E, E.h4, [title].concat([ρσ_desugar_kwargs({class_: "select"})]))].concat(description_p).concat([ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.a, ["All VTT Tabs"].concat([ρσ_desugar_kwargs({id: name, class_: "input select beyond20-option-input", href: ""})])), ρσ_interpolate_kwargs.call(E, E.ul, options.concat([ρσ_desugar_kwargs({class_: "dropdown-menu"})])), ρσ_interpolate_kwargs.call(E, E.i, [ρσ_desugar_kwargs({id: name + "--icon", class_: "icon select"})])].concat([ρσ_desugar_kwargs({class_: "button-group"})]))]).concat([ρσ_desugar_kwargs({class_: "list-content", for_: name})]))].concat([ρσ_desugar_kwargs({id: "beyond20-option-vtt-tab", class_: "list-group-item beyond20-option beyond20-option-combobox" + ((short) ? " vtt-tab-short" : "")})]));
        };
        if (!createRoll20TabCombobox.__argnames__) Object.defineProperties(createRoll20TabCombobox, {
            __argnames__ : {value: ["name", "short", "dropdown_options"]}
        });

        function createVTTTabSetting(name, short) {
            var dropdown_options, vtt, campaign;
            dropdown_options = ρσ_list_decorate([ "All VTT Tabs", "Only Roll20 Tabs", "Only Foundry VTT Tabs", "D&D Beyond Dice Roller & Discord" ]);
            if (short) {
                vtt = (isFVTT(current_tab.title)) ? "Foundry VTT" : "Roll20";
                campaign = ((vtt === "Foundry VTT" || typeof vtt === "object" && ρσ_equals(vtt, "Foundry VTT"))) ? "World" : "Campaign";
                dropdown_options.append("This " + campaign);
                dropdown_options.append("This Specific Tab");
            }
            return createRoll20TabCombobox(name, short, dropdown_options);
        };
        if (!createVTTTabSetting.__argnames__) Object.defineProperties(createVTTTabSetting, {
            __argnames__ : {value: ["name", "short"]}
        });

        function setVTTTabSetting(name, settings) {
            var val, combobox, vtt, choice, vtt_name, ρσ_unpack, id, title, campaign, short, current_vtt, current_campaign, current_title, current_id, new_options, dropdown_options, option;
            val = settings[(typeof name === "number" && name < 0) ? settings.length + name : name];
            combobox = $("#beyond20-option-vtt-tab");
            if ((combobox.length === 0 || typeof combobox.length === "object" && ρσ_equals(combobox.length, 0))) {
                return;
            }
            if (val === null) {
                $("#" + name).text("All VTT Tabs");
            } else if (val.title === null) {
                vtt = ρσ_exists.e(val.vtt, "roll20");
                if ((vtt === "dndbeyond" || typeof vtt === "object" && ρσ_equals(vtt, "dndbeyond"))) {
                    choice = "D&D Beyond Dice Roller & Discord";
                } else {
                    vtt_name = ((vtt === "roll20" || typeof vtt === "object" && ρσ_equals(vtt, "roll20"))) ? "Roll20" : "Foundry VTT";
                    choice = "Only " + vtt_name + " Tabs";
                }
                $("#" + name).text(choice);
            } else {
                ρσ_unpack = [val.id, val.title, ρσ_exists.e(val.vtt, "roll20")];
                id = ρσ_unpack[0];
                title = ρσ_unpack[1];
                vtt = ρσ_unpack[2];
                vtt_name = ((vtt === "roll20" || typeof vtt === "object" && ρσ_equals(vtt, "roll20"))) ? "Roll20" : "Foundry VTT";
                campaign = ((vtt === "roll20" || typeof vtt === "object" && ρσ_equals(vtt, "roll20"))) ? "Campaign" : "World";
                short = combobox.hasClass("vtt-tab-short");
                if (short) {
                    console.log("Set roll20 tab, is SHORT ", val);
                    current_vtt = (isFVTT(current_tab.title)) ? "fvtt" : "roll20";
                    current_campaign = ((current_vtt === "roll20" || typeof current_vtt === "object" && ρσ_equals(current_vtt, "roll20"))) ? "Campaign" : "World";
                    current_title = ((current_vtt === "roll20" || typeof current_vtt === "object" && ρσ_equals(current_vtt, "roll20"))) ? roll20Title(current_tab.title) : fvttTitle(current_tab.title);
                    current_id = current_tab.id;
                    console.log("vtt-tab settings are : ", id, title, vtt, current_id, current_title, current_vtt);
                    if ((id === 0 || typeof id === "object" && ρσ_equals(id, 0)) && (title === current_title || typeof title === "object" && ρσ_equals(title, current_title)) && (current_vtt === vtt || typeof current_vtt === "object" && ρσ_equals(current_vtt, vtt))) {
                        $("#" + name).text("This " + campaign);
                    } else if ((id === current_id || typeof id === "object" && ρσ_equals(id, current_id)) && (title === current_title || typeof title === "object" && ρσ_equals(title, current_title)) && (current_vtt === vtt || typeof current_vtt === "object" && ρσ_equals(current_vtt, vtt))) {
                        $("#" + name).text("This Specific Tab");
                    } else {
                        new_options = ρσ_list_decorate([ "All VTT Tabs", "Only Roll20 Tabs", "Only Foundry VTT Tabs", "D&D Beyond Dice Roller & Discord", "This " + current_campaign, "This Specific Tab" ]);
                        if ((current_vtt === vtt || typeof current_vtt === "object" && ρσ_equals(current_vtt, vtt))) {
                            new_options.append("Another tab or " + campaign.toLowerCase() + "(No change)");
                        } else {
                            new_options.append("A " + vtt_name + " " + campaign.toLowerCase() + "(No change)");
                        }
                    }
                } else {
                    console.log("Set vtt tab, is LONG ", val);
                    console.log("vtt-tab settings are : ", id, title, vtt);
                    new_options = ρσ_list_decorate([ "All VTT Tabs", "Only Roll20 Tabs", "Only Foundry VTT Tabs", "D&D Beyond Dice Roller & Discord", campaign + ": " + title ]);
                    if ((id !== 0 && (typeof id !== "object" || ρσ_not_equals(id, 0)))) {
                        new_options.append("Tab #" + id + " (" + title + ")");
                    }
                }
                if ((typeof new_options !== "undefined" && new_options !== null)) {
                    dropdown_options = ρσ_list_decorate([]);
                    var ρσ_Iter10 = ρσ_Iterable(new_options);
                    for (var ρσ_Index10 = 0; ρσ_Index10 < ρσ_Iter10.length; ρσ_Index10++) {
                        option = ρσ_Iter10[ρσ_Index10];
                        dropdown_options.append(E.li(ρσ_interpolate_kwargs.call(E, E.a, [option].concat([ρσ_desugar_kwargs({href: "#"})]))));
                    }
                    combobox.replaceWith(createRoll20TabCombobox("vtt-tab", short, dropdown_options));
                    initializeMarkaGroup($("#beyond20-option-vtt-tab"));
                    console.log("Added new options", dropdown_options);
                    $("#" + name).text(new_options[new_options.length-1].replace("(No change)", ""));
                    $("#" + name).attr("x-beyond20-id", id);
                    $("#" + name).attr("x-beyond20-title", title);
                    $("#" + name).attr("x-beyond20-vtt", vtt);
                }
            }
        };
        if (!setVTTTabSetting.__argnames__) Object.defineProperties(setVTTTabSetting, {
            __argnames__ : {value: ["name", "settings"]}
        });

        function getVTTTabSetting(name) {
            var opt, value, saved_id, saved_title, saved_vtt, ret, vtt, title;
            opt = $("#" + name);
            value = opt.text();
            saved_id = opt.attr("x-beyond20-id");
            saved_title = opt.attr("x-beyond20-title");
            saved_vtt = opt.attr("x-beyond20-vtt");
            if ((value === "All VTT Tabs" || typeof value === "object" && ρσ_equals(value, "All VTT Tabs"))) {
                ret = null;
            } else if (ρσ_in(value, ρσ_list_decorate([ "This Campaign", "This World", "This Specific Tab" ]))) {
                vtt = (isFVTT(current_tab.title)) ? "fvtt" : "roll20";
                title = ((vtt === "fvtt" || typeof vtt === "object" && ρσ_equals(vtt, "fvtt"))) ? fvttTitle(current_tab.title) : roll20Title(current_tab.title);
                ret = (function(){
                    var ρσ_d = {};
                    ρσ_d["id"] = (ρσ_in(value, ρσ_list_decorate([ "This Campaign", "This World" ]))) ? 0 : current_tab.id;
                    ρσ_d["title"] = title;
                    ρσ_d["vtt"] = vtt;
                    return ρσ_d;
                }).call(this);
            } else if ((value === "Only Roll20 Tabs" || typeof value === "object" && ρσ_equals(value, "Only Roll20 Tabs"))) {
                ret = (function(){
                    var ρσ_d = {};
                    ρσ_d["id"] = 0;
                    ρσ_d["title"] = null;
                    ρσ_d["vtt"] = "roll20";
                    return ρσ_d;
                }).call(this);
            } else if ((value === "Only Foundry VTT Tabs" || typeof value === "object" && ρσ_equals(value, "Only Foundry VTT Tabs"))) {
                ret = (function(){
                    var ρσ_d = {};
                    ρσ_d["id"] = 0;
                    ρσ_d["title"] = null;
                    ρσ_d["vtt"] = "fvtt";
                    return ρσ_d;
                }).call(this);
            } else if ((value === "D&D Beyond Dice Roller & Discord" || typeof value === "object" && ρσ_equals(value, "D&D Beyond Dice Roller & Discord"))) {
                ret = (function(){
                    var ρσ_d = {};
                    ρσ_d["id"] = 0;
                    ρσ_d["title"] = null;
                    ρσ_d["vtt"] = "dndbeyond";
                    return ρσ_d;
                }).call(this);
            } else if (value.startsWith("Campaign: ") || value.startsWith("World: ")) {
                ret = (function(){
                    var ρσ_d = {};
                    ρσ_d["id"] = 0;
                    ρσ_d["title"] = saved_title;
                    ρσ_d["vtt"] = saved_vtt;
                    return ρσ_d;
                }).call(this);
            } else {
                ret = (function(){
                    var ρσ_d = {};
                    ρσ_d["id"] = saved_id;
                    ρσ_d["title"] = saved_title;
                    ρσ_d["vtt"] = saved_vtt;
                    return ρσ_d;
                }).call(this);
            }
            console.log("Get " + vtt + " tab: ", ret);
            return ret;
        };
        if (!getVTTTabSetting.__argnames__) Object.defineProperties(getVTTTabSetting, {
            __argnames__ : {value: ["name"]}
        });

        function setCurrentTab(tab) {
            current_tab = tab;
        };
        if (!setCurrentTab.__argnames__) Object.defineProperties(setCurrentTab, {
            __argnames__ : {value: ["tab"]}
        });

        current_tab = null;
        options_list["vtt-tab"]["createHTMLElement"] = createVTTTabSetting;
        options_list["vtt-tab"]["set"] = setVTTTabSetting;
        options_list["vtt-tab"]["get"] = getVTTTabSetting;
        ρσ_modules.settings.options_list = options_list;
        ρσ_modules.settings.character_settings = character_settings;
        ρσ_modules.settings.current_tab = current_tab;
        ρσ_modules.settings.WhisperType = WhisperType;
        ρσ_modules.settings.RollType = RollType;
        ρσ_modules.settings.CriticalRules = CriticalRules;
        ρσ_modules.settings.getStorage = getStorage;
        ρσ_modules.settings.storageGet = storageGet;
        ρσ_modules.settings.storageSet = storageSet;
        ρσ_modules.settings.storageRemove = storageRemove;
        ρσ_modules.settings.getDefaultSettings = getDefaultSettings;
        ρσ_modules.settings.getStoredSettings = getStoredSettings;
        ρσ_modules.settings.setSettings = setSettings;
        ρσ_modules.settings.mergeSettings = mergeSettings;
        ρσ_modules.settings.resetSettings = resetSettings;
        ρσ_modules.settings.createHTMLOptionEx = createHTMLOptionEx;
        ρσ_modules.settings.createHTMLOption = createHTMLOption;
        ρσ_modules.settings.initializeMarkaGroup = initializeMarkaGroup;
        ρσ_modules.settings.initializeMarka = initializeMarka;
        ρσ_modules.settings.extractSettingsData = extractSettingsData;
        ρσ_modules.settings.loadSettings = loadSettings;
        ρσ_modules.settings.restoreSavedSettings = restoreSavedSettings;
        ρσ_modules.settings.saveSettings = saveSettings;
        ρσ_modules.settings.initializeSettings = initializeSettings;
        ρσ_modules.settings.createRoll20TabCombobox = createRoll20TabCombobox;
        ρσ_modules.settings.createVTTTabSetting = createVTTTabSetting;
        ρσ_modules.settings.setVTTTabSetting = setVTTTabSetting;
        ρσ_modules.settings.getVTTTabSetting = getVTTTabSetting;
        ρσ_modules.settings.setCurrentTab = setCurrentTab;
    })();

    (function(){
        var __name__ = "constants";
        var ROLL20_URL, FVTT_URL, DNDBEYOND_CHARACTER_URL, DNDBEYOND_MONSTER_URL, DNDBEYOND_ENCOUNTERS_URL, DNDBEYOND_ENCOUNTER_URL, DNDBEYOND_COMBAT_URL, DNDBEYOND_SPELL_URL, DNDBEYOND_VEHICLE_URL, CHANGELOG_URL, DISCORD_BOT_INVITE_URL, DISCORD_BOT_API_URL, BUTTON_STYLE_CSS, ROLLTYPE_STYLE_CSS;
        ROLL20_URL = "*://app.roll20.net/editor/";
        FVTT_URL = "*://*/game";
        DNDBEYOND_CHARACTER_URL = "*://*.dndbeyond.com/*characters/*";
        DNDBEYOND_MONSTER_URL = "*://*.dndbeyond.com/monsters/*";
        DNDBEYOND_ENCOUNTERS_URL = "*://*.dndbeyond.com/my-encounters";
        DNDBEYOND_ENCOUNTER_URL = "*://*.dndbeyond.com/encounters/*";
        DNDBEYOND_COMBAT_URL = "*://*.dndbeyond.com/combat-tracker/*";
        DNDBEYOND_SPELL_URL = "*://*.dndbeyond.com/spells/*";
        DNDBEYOND_VEHICLE_URL = "*://*.dndbeyond.com/vehicles/*";
        CHANGELOG_URL = "https://beyond20.here-for-more.info/update";
        DISCORD_BOT_INVITE_URL = "https://beyond20.kicks-ass.org/invite";
        DISCORD_BOT_API_URL = "https://beyond20.kicks-ass.org/roll";
        BUTTON_STYLE_CSS = "\n.character-button, .character-button-small {\n    display: inline-block;\n    border-radius: 3px;\n    background-color: #96bf6b;\n    color: #fff;\n    font-family: Roboto Condensed,Roboto,Helvetica,sans-serif;\n    font-size: 10px;\n    border: 1px solid transparent;\n    text-transform: uppercase;\n    padding: 9px 15px;\n    transition: all 50ms;\n}\n.character-button-small {\n    font-size: 8px;\n    padding: 5px;\n    border-color: transparent;\n    min-height: 22px;\n}\n.ct-button.ct-theme-button {\n    cursor: default;\n}\n.ct-button.ct-theme-button--interactive {\n    cursor: pointer;\n}\n.ct-button.ct-theme-button--filled {\n    background-color: #c53131;\n    color: #fff;\n}\n";
        ROLLTYPE_STYLE_CSS = "\n\n.ct-beyond20-roll .ct-beyond20-roll-button {\n    position: relative;\n    margin-top: 7px;\n}\n\n.ct-beyond20-roll .ct-beyond20-roll-button:after {\n    position: absolute;\n    padding: 2px;\n    top: -10px;\n    right: -5px;\n    font-size: 10px;\n    border-radius: 5px;\n    color: white;\n    opacity: 65%;\n}\n\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-double:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-double:after {\n    content: \"2\";\n    background-color: blue;\n}\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-query:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-query:after {\n    content: \"?\";\n    background-color: grey;\n}\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-thrice:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-thrice:after {\n    content: \"3\";\n    background-color: blue;\n}\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-advantage:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-advantage:after {\n    content: \"+\";\n    background-color: green;\n}\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-disadvantage:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-disadvantage:after {\n    content: \"-\";\n    background-color: red;\n}\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-super-advantage:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-super-advantage:after {\n    content: \"+ +\";\n    background-color: green;\n}\n.ct-beyond20-roll .ct-beyond20-roll-button.beyond20-roll-type-super-disadvantage:after,\n.beyond20-quick-roll-tooltip.beyond20-roll-type-super-disadvantage:after {\n    content: \"- -\";\n    background-color: red;\n}\n";
        ρσ_modules.constants.ROLL20_URL = ROLL20_URL;
        ρσ_modules.constants.FVTT_URL = FVTT_URL;
        ρσ_modules.constants.DNDBEYOND_CHARACTER_URL = DNDBEYOND_CHARACTER_URL;
        ρσ_modules.constants.DNDBEYOND_MONSTER_URL = DNDBEYOND_MONSTER_URL;
        ρσ_modules.constants.DNDBEYOND_ENCOUNTERS_URL = DNDBEYOND_ENCOUNTERS_URL;
        ρσ_modules.constants.DNDBEYOND_ENCOUNTER_URL = DNDBEYOND_ENCOUNTER_URL;
        ρσ_modules.constants.DNDBEYOND_COMBAT_URL = DNDBEYOND_COMBAT_URL;
        ρσ_modules.constants.DNDBEYOND_SPELL_URL = DNDBEYOND_SPELL_URL;
        ρσ_modules.constants.DNDBEYOND_VEHICLE_URL = DNDBEYOND_VEHICLE_URL;
        ρσ_modules.constants.CHANGELOG_URL = CHANGELOG_URL;
        ρσ_modules.constants.DISCORD_BOT_INVITE_URL = DISCORD_BOT_INVITE_URL;
        ρσ_modules.constants.DISCORD_BOT_API_URL = DISCORD_BOT_API_URL;
        ρσ_modules.constants.BUTTON_STYLE_CSS = BUTTON_STYLE_CSS;
        ρσ_modules.constants.ROLLTYPE_STYLE_CSS = ROLLTYPE_STYLE_CSS;
    })();

    (function(){
        var __name__ = "dndbeyond_discord";
        var DISCORD_BOT_API_URL = ρσ_modules.constants.DISCORD_BOT_API_URL;

        async        function postToDiscord(secret, request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open) {
            var body, json;
            secret = (secret || "").trim();
            if (!secret) {
                return;
            }
            if (ρσ_exists.n(request["original-whisper"])) {
                request.whisper = request["original-whisper"];
            }
            body = (function(){
                var ρσ_d = {};
                ρσ_d["secret"] = secret;
                ρσ_d["request"] = request;
                ρσ_d["title"] = title;
                ρσ_d["source"] = source;
                ρσ_d["attributes"] = attributes;
                ρσ_d["description"] = description;
                ρσ_d["attack_rolls"] = attack_rolls;
                ρσ_d["roll_info"] = roll_info;
                ρσ_d["damage_rolls"] = damage_rolls;
                ρσ_d["total_damages"] = total_damages;
                ρσ_d["open"] = open;
                return ρσ_d;
            }).call(this);
            request = window.fetch(DISCORD_BOT_API_URL, (function(){
                var ρσ_d = {};
                ρσ_d["method"] = "POST";
                ρσ_d["headers"] = (function(){
                    var ρσ_d = {};
                    ρσ_d["Content-Type"] = "application/json; charset=utf-8";
                    return ρσ_d;
                }).call(this);
                ρσ_d["body"] = JSON.stringify(body);
                return ρσ_d;
            }).call(this));
            json = {};
            try {
                let response = await request;
                json = await response.json();
            } catch (ρσ_Exception) {
                ρσ_last_exception = ρσ_Exception;
                if (ρσ_Exception instanceof Error) {
                    var e = ρσ_Exception;
                    console.error(e);
                    return e.message;
                } else {
                    throw ρσ_Exception;
                }
            }
            if (json.error) {
                console.error("Error from server : ", json.error);
            }
            return json.error;
        };
        if (!postToDiscord.__argnames__) Object.defineProperties(postToDiscord, {
            __argnames__ : {value: ["secret", "request", "title", "source", "attributes", "description", "attack_rolls", "roll_info", "damage_rolls", "total_damages", "open"]}
        });

        ρσ_modules.dndbeyond_discord.postToDiscord = postToDiscord;
    })();

    (function(){
        var __name__ = "math";
        var pi, e;
        pi = Math.PI;
        e = Math.E;
        function ceil(x) {
            return Math.ceil(x);
        };
        if (!ceil.__argnames__) Object.defineProperties(ceil, {
            __argnames__ : {value: ["x"]}
        });

        function copysign(x, y) {
            x = Math.abs(x);
            if (y < 0) {
                return -x;
            } else {
                return x;
            }
        };
        if (!copysign.__argnames__) Object.defineProperties(copysign, {
            __argnames__ : {value: ["x", "y"]}
        });

        function fabs(x) {
            return Math.abs(x);
        };
        if (!fabs.__argnames__) Object.defineProperties(fabs, {
            __argnames__ : {value: ["x"]}
        });

        function factorial(x) {
            var r;
            if (Math.abs(int(x)) !== x) {
                throw new ValueError("factorial() only accepts integral values");
            }
            factorial.cache = ρσ_list_decorate([]);
            r = (function() {
                var ρσ_anonfunc = function (n) {
                    if (n === 0 || n === 1) {
                        return 1;
                    }
                    if (!(ρσ_expr_temp = factorial.cache)[(typeof n === "number" && n < 0) ? ρσ_expr_temp.length + n : n]) {
                        (ρσ_expr_temp = factorial.cache)[(typeof n === "number" && n < 0) ? ρσ_expr_temp.length + n : n] = r(n - 1) * n;
                    }
                    return (ρσ_expr_temp = factorial.cache)[(typeof n === "number" && n < 0) ? ρσ_expr_temp.length + n : n];
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["n"]}
                });
                return ρσ_anonfunc;
            })();
            return r(x);
        };
        if (!factorial.__argnames__) Object.defineProperties(factorial, {
            __argnames__ : {value: ["x"]}
        });

        function floor(x) {
            return Math.floor(x);
        };
        if (!floor.__argnames__) Object.defineProperties(floor, {
            __argnames__ : {value: ["x"]}
        });

        function fmod(x, y) {
            while (y <= x) {
                x -= y;
            }
            return x;
        };
        if (!fmod.__argnames__) Object.defineProperties(fmod, {
            __argnames__ : {value: ["x", "y"]}
        });

        function fsum(iterable) {
            var partials, i, ρσ_unpack, x, y, hi, lo;
            partials = ρσ_list_decorate([]);
            var ρσ_Iter0 = ρσ_Iterable(iterable);
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                x = ρσ_Iter0[ρσ_Index0];
                i = 0;
                var ρσ_Iter1 = ρσ_Iterable(partials);
                for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                    y = ρσ_Iter1[ρσ_Index1];
                    if (Math.abs(x) < Math.abs(y)) {
                        ρσ_unpack = [y, x];
                        x = ρσ_unpack[0];
                        y = ρσ_unpack[1];
                    }
                    hi = x + y;
                    lo = y - (hi - x);
                    if (lo) {
                        partials[(typeof i === "number" && i < 0) ? partials.length + i : i] = lo;
                        i += 1;
                    }
                    x = hi;
                }
                partials.splice(i, partials.length - i, x);
            }
            return sum(partials);
        };
        if (!fsum.__argnames__) Object.defineProperties(fsum, {
            __argnames__ : {value: ["iterable"]}
        });

        function isinf(x) {
            return !isFinite(x);
        };
        if (!isinf.__argnames__) Object.defineProperties(isinf, {
            __argnames__ : {value: ["x"]}
        });

        function isnan(x) {
            return isNaN(x);
        };
        if (!isnan.__argnames__) Object.defineProperties(isnan, {
            __argnames__ : {value: ["x"]}
        });

        function modf(x) {
            var m;
            m = fmod(x, 1);
            return [m, x - m];
        };
        if (!modf.__argnames__) Object.defineProperties(modf, {
            __argnames__ : {value: ["x"]}
        });

        function trunc(x) {
            return x | 0;
        };
        if (!trunc.__argnames__) Object.defineProperties(trunc, {
            __argnames__ : {value: ["x"]}
        });

        function exp(x) {
            return Math.exp(x);
        };
        if (!exp.__argnames__) Object.defineProperties(exp, {
            __argnames__ : {value: ["x"]}
        });

        function expm1(x) {
            if (Math.abs(x) < 1e-5) {
                return x + .5 * x * x;
            } else {
                return Math.exp(x) - 1;
            }
        };
        if (!expm1.__argnames__) Object.defineProperties(expm1, {
            __argnames__ : {value: ["x"]}
        });

        function log() {
            var x = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var base = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? log.__defaults__.base : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "base")){
                base = ρσ_kwargs_obj.base;
            }
            return Math.log(x) / Math.log(base);
        };
        if (!log.__defaults__) Object.defineProperties(log, {
            __defaults__ : {value: {base:e}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["x", "base"]}
        });

        function log1p(x) {
            var ret, n, i;
            ret = 0;
            n = 50;
            if (x <= -1) {
                return Number.NEGATIVE_INFINITY;
            }
            if (x < 0 || x > 1) {
                return Math.log(1 + x);
            }
            for (var ρσ_Index2 = 1; ρσ_Index2 < n; ρσ_Index2++) {
                i = ρσ_Index2;
                if (i % 2 === 0) {
                    ret -= Math.pow(x, i) / i;
                } else {
                    ret += Math.pow(x, i) / i;
                }
            }
            return ret;
        };
        if (!log1p.__argnames__) Object.defineProperties(log1p, {
            __argnames__ : {value: ["x"]}
        });

        function log10(x) {
            return Math.log(x) / Math.LN10;
        };
        if (!log10.__argnames__) Object.defineProperties(log10, {
            __argnames__ : {value: ["x"]}
        });

        function pow(x, y) {
            if (x < 0 && int(y) !== y) {
                throw new ValueError("math domain error");
            }
            if (isnan(y) && x === 1) {
                return 1;
            }
            return Math.pow(x, y);
        };
        if (!pow.__argnames__) Object.defineProperties(pow, {
            __argnames__ : {value: ["x", "y"]}
        });

        function sqrt(x) {
            return Math.sqrt(x);
        };
        if (!sqrt.__argnames__) Object.defineProperties(sqrt, {
            __argnames__ : {value: ["x"]}
        });

        function acos(x) {
            return Math.acos(x);
        };
        if (!acos.__argnames__) Object.defineProperties(acos, {
            __argnames__ : {value: ["x"]}
        });

        function asin(x) {
            return Math.asin(x);
        };
        if (!asin.__argnames__) Object.defineProperties(asin, {
            __argnames__ : {value: ["x"]}
        });

        function atan(x) {
            return Math.atan(x);
        };
        if (!atan.__argnames__) Object.defineProperties(atan, {
            __argnames__ : {value: ["x"]}
        });

        function atan2(y, x) {
            return Math.atan2(y, x);
        };
        if (!atan2.__argnames__) Object.defineProperties(atan2, {
            __argnames__ : {value: ["y", "x"]}
        });

        function cos(x) {
            return Math.cos(x);
        };
        if (!cos.__argnames__) Object.defineProperties(cos, {
            __argnames__ : {value: ["x"]}
        });

        function sin(x) {
            return Math.sin(x);
        };
        if (!sin.__argnames__) Object.defineProperties(sin, {
            __argnames__ : {value: ["x"]}
        });

        function hypot(x, y) {
            return Math.sqrt(x * x + y * y);
        };
        if (!hypot.__argnames__) Object.defineProperties(hypot, {
            __argnames__ : {value: ["x", "y"]}
        });

        function tan(x) {
            return Math.tan(x);
        };
        if (!tan.__argnames__) Object.defineProperties(tan, {
            __argnames__ : {value: ["x"]}
        });

        function degrees(x) {
            return x * 180 / pi;
        };
        if (!degrees.__argnames__) Object.defineProperties(degrees, {
            __argnames__ : {value: ["x"]}
        });

        function radians(x) {
            return x * pi / 180;
        };
        if (!radians.__argnames__) Object.defineProperties(radians, {
            __argnames__ : {value: ["x"]}
        });

        function acosh(x) {
            return Math.log(x + Math.sqrt(x * x - 1));
        };
        if (!acosh.__argnames__) Object.defineProperties(acosh, {
            __argnames__ : {value: ["x"]}
        });

        function asinh(x) {
            return Math.log(x + Math.sqrt(x * x + 1));
        };
        if (!asinh.__argnames__) Object.defineProperties(asinh, {
            __argnames__ : {value: ["x"]}
        });

        function atanh(x) {
            return .5 * Math.log((1 + x) / (1 - x));
        };
        if (!atanh.__argnames__) Object.defineProperties(atanh, {
            __argnames__ : {value: ["x"]}
        });

        function cosh(x) {
            return (Math.exp(x) + Math.exp(-x)) / 2;
        };
        if (!cosh.__argnames__) Object.defineProperties(cosh, {
            __argnames__ : {value: ["x"]}
        });

        function sinh(x) {
            return (Math.exp(x) - Math.exp(-x)) / 2;
        };
        if (!sinh.__argnames__) Object.defineProperties(sinh, {
            __argnames__ : {value: ["x"]}
        });

        function tanh(x) {
            return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
        };
        if (!tanh.__argnames__) Object.defineProperties(tanh, {
            __argnames__ : {value: ["x"]}
        });

        ρσ_modules.math.pi = pi;
        ρσ_modules.math.e = e;
        ρσ_modules.math.ceil = ceil;
        ρσ_modules.math.copysign = copysign;
        ρσ_modules.math.fabs = fabs;
        ρσ_modules.math.factorial = factorial;
        ρσ_modules.math.floor = floor;
        ρσ_modules.math.fmod = fmod;
        ρσ_modules.math.fsum = fsum;
        ρσ_modules.math.isinf = isinf;
        ρσ_modules.math.isnan = isnan;
        ρσ_modules.math.modf = modf;
        ρσ_modules.math.trunc = trunc;
        ρσ_modules.math.exp = exp;
        ρσ_modules.math.expm1 = expm1;
        ρσ_modules.math.log = log;
        ρσ_modules.math.log1p = log1p;
        ρσ_modules.math.log10 = log10;
        ρσ_modules.math.pow = pow;
        ρσ_modules.math.sqrt = sqrt;
        ρσ_modules.math.acos = acos;
        ρσ_modules.math.asin = asin;
        ρσ_modules.math.atan = atan;
        ρσ_modules.math.atan2 = atan2;
        ρσ_modules.math.cos = cos;
        ρσ_modules.math.sin = sin;
        ρσ_modules.math.hypot = hypot;
        ρσ_modules.math.tan = tan;
        ρσ_modules.math.degrees = degrees;
        ρσ_modules.math.radians = radians;
        ρσ_modules.math.acosh = acosh;
        ρσ_modules.math.asinh = asinh;
        ρσ_modules.math.atanh = atanh;
        ρσ_modules.math.cosh = cosh;
        ρσ_modules.math.sinh = sinh;
        ρσ_modules.math.tanh = tanh;
    })();

    (function(){
        var __name__ = "roll_renderer";
        var replaceRolls = ρσ_modules.utils.replaceRolls;

        var RollType = ρσ_modules.settings.RollType;
        var WhisperType = ρσ_modules.settings.WhisperType;

        var postToDiscord = ρσ_modules.dndbeyond_discord.postToDiscord;

        var math = ρσ_modules.math;

        function DAMAGE_FLAGS() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            DAMAGE_FLAGS.prototype.__init__.apply(this, arguments);
        }
        DAMAGE_FLAGS.prototype.__init__ = function __init__ () {
                    };
        DAMAGE_FLAGS.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        DAMAGE_FLAGS.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(DAMAGE_FLAGS.prototype, "__bases__", {value: []});
        DAMAGE_FLAGS.prototype.MESSAGE = 0;
        DAMAGE_FLAGS.prototype.REGULAR = 1;
        DAMAGE_FLAGS.prototype.VERSATILE = 2;
        DAMAGE_FLAGS.prototype.ADDITIONAL = 4;
        DAMAGE_FLAGS.prototype.HEALING = 8;
        DAMAGE_FLAGS.prototype.CRITICAL = 16;

        function Beyond20RollRenderer() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Beyond20RollRenderer.prototype.__init__.apply(this, arguments);
        }
        Beyond20RollRenderer.prototype.__init__ = function __init__(roller, prompter, displayer) {
            var self = this;
            self._roller = roller;
            self._prompter = prompter;
            self._displayer = displayer;
            self._extension_url = "";
            self._settings = {};
        };
        if (!Beyond20RollRenderer.prototype.__init__.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.__init__, {
            __argnames__ : {value: ["roller", "prompter", "displayer"]}
        });
        Beyond20RollRenderer.__argnames__ = Beyond20RollRenderer.prototype.__init__.__argnames__;
        Beyond20RollRenderer.__handles_kwarg_interpolation__ = Beyond20RollRenderer.prototype.__init__.__handles_kwarg_interpolation__;
        Beyond20RollRenderer.prototype.setBaseURL = function setBaseURL(base_url) {
            var self = this;
            self._extension_url = base_url;
        };
        if (!Beyond20RollRenderer.prototype.setBaseURL.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.setBaseURL, {
            __argnames__ : {value: ["base_url"]}
        });
        Beyond20RollRenderer.prototype.setSettings = function setSettings(settings) {
            var self = this;
            self._settings = settings;
        };
        if (!Beyond20RollRenderer.prototype.setSettings.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.setSettings, {
            __argnames__ : {value: ["settings"]}
        });
        Beyond20RollRenderer.prototype.queryGeneric = function queryGeneric() {
            var self = this;
            var title = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var question = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var choices = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var select_id = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? queryGeneric.__defaults__.select_id : arguments[3];
            var order = (arguments[4] === undefined || ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? queryGeneric.__defaults__.order : arguments[4];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "select_id")){
                select_id = ρσ_kwargs_obj.select_id;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "order")){
                order = ρσ_kwargs_obj.order;
            }
            var html, selected, value, ρσ_unpack, i, option;
            html = "<form>" + "<div class=\"beyond20-form-row\">" + "<label>" + question + "</label>" + "<select id=\"" + select_id + "\" name=\"" + select_id + "\">";
            if (order === null) {
                order = choices;
            }
            var ρσ_Iter0 = ρσ_Iterable(enumerate(order));
            for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                ρσ_unpack = ρσ_Iter0[ρσ_Index0];
                i = ρσ_unpack[0];
                option = ρσ_unpack[1];
                selected = ((i === 0 || typeof i === "object" && ρσ_equals(i, 0))) ? " selected" : "";
                value = choices[(typeof option === "number" && option < 0) ? choices.length + option : option];
                if (value) {
                    html += "<option value=\"" + option + "\"" + selected + ">" + value + "</option>";
                } else {
                    html += "<option value=\"" + option + "\"" + selected + ">" + option + "</option>";
                }
            }
            html += "\n                </select>\n            </div>\n        </div>\n        ";
            return new Promise((function() {
                var ρσ_anonfunc = function (resolve, reject) {
                    self._prompter.prompt(title, html, "Roll").then((function() {
                        var ρσ_anonfunc = function (html) {
                            if (html) {
                                resolve(html.find("#" + select_id).val());
                            }
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["html"]}
                        });
                        return ρσ_anonfunc;
                    })());
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["resolve", "reject"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!Beyond20RollRenderer.prototype.queryGeneric.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.queryGeneric, {
            __defaults__ : {value: {select_id:"generic-query", order:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["title", "question", "choices", "select_id", "order"]}
        });
        Beyond20RollRenderer.prototype.queryAdvantage = function queryAdvantage(title) {
            var self = this;
            var choices, order;
            choices = (function(){
                var ρσ_d = {};
                ρσ_d[RollType.prototype.NORMAL] = "Normal Roll";
                ρσ_d[RollType.prototype.DOUBLE] = "Roll Twice";
                ρσ_d[RollType.prototype.ADVANTAGE] = "Advantage";
                ρσ_d[RollType.prototype.DISADVANTAGE] = "Disadvantage";
                ρσ_d[RollType.prototype.THRICE] = "Roll Thrice";
                ρσ_d[RollType.prototype.SUPER_ADVANTAGE] = "Super Advantage";
                ρσ_d[RollType.prototype.SUPER_DISADVANTAGE] = "Super Disadvantage";
                return ρσ_d;
            }).call(this);
            order = ρσ_list_decorate([ RollType.prototype.DOUBLE, RollType.prototype.NORMAL, RollType.prototype.ADVANTAGE, RollType.prototype.DISADVANTAGE, RollType.prototype.THRICE, RollType.prototype.SUPER_ADVANTAGE, RollType.prototype.SUPER_DISADVANTAGE ]);
            return self.queryGeneric(title, "Select roll mode : ", choices, "roll-mode", order).then((function() {
                var ρσ_anonfunc = function (val) {
                    return int(val);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["val"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!Beyond20RollRenderer.prototype.queryAdvantage.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.queryAdvantage, {
            __argnames__ : {value: ["title"]}
        });
        Beyond20RollRenderer.prototype.getToHit = function getToHit() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var title = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var modifier = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getToHit.__defaults__.modifier : arguments[2];
            var data = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getToHit.__defaults__.data : arguments[3];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "modifier")){
                modifier = ρσ_kwargs_obj.modifier;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "data")){
                data = ρσ_kwargs_obj.data;
            }
            var async_function;
            async_function = async            function () {
                var advantage, roll_1, roll_2, roll_3;
                advantage = request.advantage;
                if ((advantage === RollType.prototype.QUERY || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.QUERY))) {
                    advantage = await self.queryAdvantage(title);
                }
                if ((advantage === RollType.prototype.NORMAL || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.NORMAL))) {
                    return ρσ_list_decorate([ self.createRoll("1d20" + modifier, data) ]);
                } else if (ρσ_list_decorate([ RollType.prototype.DOUBLE, RollType.prototype.ADVANTAGE, RollType.prototype.DISADVANTAGE ]).includes(advantage)) {
                    roll_1 = self.createRoll("1d20" + modifier, data);
                    roll_2 = self.createRoll("1d20" + modifier, data);
                    if ((advantage === RollType.prototype.ADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.ADVANTAGE))) {
                        if (roll_1.total >= roll_2.total) {
                            roll_2.setDiscarded(true);
                        } else {
                            roll_1.setDiscarded(true);
                        }
                    } else if ((advantage === RollType.prototype.DISADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.DISADVANTAGE))) {
                        if (roll_1.total <= roll_2.total) {
                            roll_2.setDiscarded(true);
                        } else {
                            roll_1.setDiscarded(true);
                        }
                    }
                    return ρσ_list_decorate([ roll_1, roll_2 ]);
                } else if (ρσ_list_decorate([ RollType.prototype.THRICE, RollType.prototype.SUPER_ADVANTAGE, RollType.prototype.SUPER_DISADVANTAGE ]).includes(advantage)) {
                    roll_1 = self.createRoll("1d20" + modifier, data);
                    roll_2 = self.createRoll("1d20" + modifier, data);
                    roll_3 = self.createRoll("1d20" + modifier, data);
                    if ((advantage === RollType.prototype.SUPER_ADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.SUPER_ADVANTAGE))) {
                        if (roll_1.total >= roll_2.total && roll_1.total >= roll_3.total) {
                            roll_2.setDiscarded(true);
                            roll_3.setDiscarded(true);
                        } else if (roll_2.total >= roll_3.total) {
                            roll_1.setDiscarded(true);
                            roll_3.setDiscarded(true);
                        } else {
                            roll_1.setDiscarded(true);
                            roll_2.setDiscarded(true);
                        }
                    } else if ((advantage === RollType.prototype.SUPER_DISADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.SUPER_DISADVANTAGE))) {
                        if (roll_1.total <= roll_2.total && roll_1.total <= roll_3.total) {
                            roll_2.setDiscarded(true);
                            roll_3.setDiscarded(true);
                        } else if (roll_2.total <= roll_3.total) {
                            roll_1.setDiscarded(true);
                            roll_3.setDiscarded(true);
                        } else {
                            roll_1.setDiscarded(true);
                            roll_2.setDiscarded(true);
                        }
                    }
                    return ρσ_list_decorate([ roll_1, roll_2, roll_3 ]);
                }
            }
            return async_function();
        };
        if (!Beyond20RollRenderer.prototype.getToHit.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.getToHit, {
            __defaults__ : {value: {modifier:"", data:{}}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "title", "modifier", "data"]}
        });
        Beyond20RollRenderer.prototype.isCriticalHitD20 = function isCriticalHitD20() {
            var self = this;
            var rolls = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var limit = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? isCriticalHitD20.__defaults__.limit : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "limit")){
                limit = ρσ_kwargs_obj.limit;
            }
            var roll;
            var ρσ_Iter1 = ρσ_Iterable(rolls);
            for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                roll = ρσ_Iter1[ρσ_Index1];
                roll.setCriticalLimit(limit);
                if (!roll.isDiscarded() && roll.isCriticalHit()) {
                    return true;
                }
            }
            return false;
        };
        if (!Beyond20RollRenderer.prototype.isCriticalHitD20.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.isCriticalHitD20, {
            __defaults__ : {value: {limit:20}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["rolls", "limit"]}
        });
        Beyond20RollRenderer.prototype.injectRollsInDescription = function injectRollsInDescription(description) {
            var self = this;
            var icon16, replaceCB;
            icon16 = "/modules/beyond20/images/icons/icon16.png";
            replaceCB = (function() {
                var ρσ_anonfunc = function (dice, modifier) {
                    var dice_formula;
                    dice_formula = (((dice === "" || typeof dice === "object" && ρσ_equals(dice, ""))) ? "1d20" : dice) + modifier;
                    return "<span class=\"ct-beyond20-custom-roll\"><strong>" + dice + modifier + "</strong>" + "<img class=\"ct-beyond20-custom-icon\" src=\"" + icon16 + "\" style=\"margin-right: 3px; margin-left: 3px; border: 0px;\"></img>" + "<span class=\"beyond20-roll-formula\" style=\"display: none;\">" + dice_formula + "</span></span>";
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["dice", "modifier"]}
                });
                return ρσ_anonfunc;
            })();
            return replaceRolls(description, replaceCB);
        };
        if (!Beyond20RollRenderer.prototype.injectRollsInDescription.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.injectRollsInDescription, {
            __argnames__ : {value: ["description"]}
        });
        Beyond20RollRenderer.prototype.rollToDetails = function rollToDetails() {
            var self = this;
            var roll = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var is_total = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollToDetails.__defaults__.is_total : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "is_total")){
                is_total = ρσ_kwargs_obj.is_total;
            }
            var async_function;
            async_function = async            function () {
                var hit, fail, roll_type_class, total, tooltip;
                hit = roll.isCriticalHit();
                fail = roll.isCriticalFail();
                roll_type_class = "beyond20-roll-detail-";
                roll_type_class += (hit && fail) ? "crit-fail" : (hit) ? "crit" : (fail) ? "fail" : "normal";
                if (roll.isDiscarded()) {
                    roll_type_class += " beyond20-roll-detail-discarded";
                }
                if (is_total) {
                    roll_type_class += " beyond20-roll-total dice-total";
                }
                total = "<span class='" + roll_type_class + "'>" + roll.total + "</span>";
                tooltip = await roll.getTooltip();
                return "<span class='beyond20-tooltip'>" + total + "<span class='dice-roll beyond20-tooltip-content'>" + "<div class='dice-formula beyond20-roll-formula'>" + roll.formula + "</div>" + tooltip + "</span></span>";
            }
            return async_function();
        };
        if (!Beyond20RollRenderer.prototype.rollToDetails.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollToDetails, {
            __defaults__ : {value: {is_total:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["roll", "is_total"]}
        });
        Beyond20RollRenderer.prototype.rollsToCells = function rollsToCells(html) {
            var self = this;
            var result, roll;
            result = "";
            var ρσ_Iter2 = ρσ_Iterable(html.split(" | "));
            for (var ρσ_Index2 = 0; ρσ_Index2 < ρσ_Iter2.length; ρσ_Index2++) {
                roll = ρσ_Iter2[ρσ_Index2];
                result += "<div class=\"beyond20-roll-cell\">" + roll + "</div>";
            }
            return result;
        };
        if (!Beyond20RollRenderer.prototype.rollsToCells.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rollsToCells, {
            __argnames__ : {value: ["html"]}
        });
        Beyond20RollRenderer.prototype.postDescription = function postDescription() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var title = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var source = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var attributes = ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[3];
            var description = ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[4];
            var attack_rolls = (arguments[5] === undefined || ( 5 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? postDescription.__defaults__.attack_rolls : arguments[5];
            var roll_info = (arguments[6] === undefined || ( 6 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? postDescription.__defaults__.roll_info : arguments[6];
            var damage_rolls = (arguments[7] === undefined || ( 7 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? postDescription.__defaults__.damage_rolls : arguments[7];
            var open = (arguments[8] === undefined || ( 8 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? postDescription.__defaults__.open : arguments[8];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "attack_rolls")){
                attack_rolls = ρσ_kwargs_obj.attack_rolls;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "roll_info")){
                roll_info = ρσ_kwargs_obj.roll_info;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "damage_rolls")){
                damage_rolls = ρσ_kwargs_obj.damage_rolls;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "open")){
                open = ρσ_kwargs_obj.open;
            }
            var async_function;
            async_function = async            function () {
                var play_sound, buttons, makeCB, html, attr, html_description, ρσ_unpack, name, value, roll_html, i, roll, add_totals, total_damages, is_total, roll_name, kind_of_damage, regular, versatile, flags, key, button, character;
                play_sound = false;
                buttons = {};
                if ((request.whisper === WhisperType.prototype.HIDE_NAMES || typeof request.whisper === "object" && ρσ_equals(request.whisper, WhisperType.prototype.HIDE_NAMES))) {
                    description = null;
                    title = "???";
                }
                if (len(damage_rolls) > 0 && len(attack_rolls) > 0 && !self._settings["auto-roll-damage"]) {
                    makeCB = (function() {
                        var ρσ_anonfunc = function (request, title, source, attributes, description, damage_rolls) {
                            var roll_damages_args;
                            roll_damages_args = (function(){
                                var ρσ_d = {};
                                ρσ_d["damages"] = damage_rolls;
                                ρσ_d["num_rolls"] = 0;
                                return ρσ_d;
                            }).call(this);
                            return function () {
                                var damages;
                                damages = roll_damages_args.damages;
                                if (roll_damages_args.num_rolls > 0) {
                                    damages = self.rerollDamages(damages);
                                }
                                roll_damages_args.num_rolls += 1;
                                ρσ_interpolate_kwargs.call(self, self.postDescription, [request, title, source, attributes, description].concat([ρσ_desugar_kwargs({damage_rolls: damages})]));
                            };
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["request", "title", "source", "attributes", "description", "damage_rolls"]}
                        });
                        return ρσ_anonfunc;
                    })();
                    buttons = (function(){
                        var ρσ_d = {};
                        ρσ_d["Roll Damages"] = makeCB(request, title, source, attributes, description, damage_rolls);
                        return ρσ_d;
                    }).call(this);
                    damage_rolls = ρσ_list_decorate([]);
                }
                html = "<div class=\"beyond20-message\">";
                if (description) {
                    html += "<details" + ((open) ? " open" : "") + "><summary><a>" + title + "</a></summary>";
                    if (source || attributes.length > 0) {
                        html += "<table>";
                        if (source) {
                            html += "<tr><td colspan'2'><i>" + source + "</i></td></tr>";
                        }
                        var ρσ_Iter3 = ρσ_Iterable(attributes);
                        for (var ρσ_Index3 = 0; ρσ_Index3 < ρσ_Iter3.length; ρσ_Index3++) {
                            attr = ρσ_Iter3[ρσ_Index3];
                            html += "<tr><td><b>" + attr + "</b></td><td>" + attributes[(typeof attr === "number" && attr < 0) ? attributes.length + attr : attr] + "</td></tr>";
                        }
                        html += "</table>";
                    }
                    html_description = self.injectRollsInDescription(description).replace(/\n/g, "</br>");
                    html += "<div class='beyond20-description'>" + html_description + "</div></details>";
                } else {
                    html = "<div class='beyond20-title'>" + title + "</div>";
                }
                var ρσ_Iter4 = ρσ_Iterable(roll_info);
                for (var ρσ_Index4 = 0; ρσ_Index4 < ρσ_Iter4.length; ρσ_Index4++) {
                    ρσ_unpack = ρσ_Iter4[ρσ_Index4];
                    name = ρσ_unpack[0];
                    value = ρσ_unpack[1];
                    html += "<div class='beyond20-roll-result'><b>" + name + ": </b><span>" + value + "</span></div>";
                }
                if (len(attack_rolls) > 0) {
                    roll_html = "";
                    var ρσ_Iter5 = ρσ_Iterable(enumerate(attack_rolls));
                    for (var ρσ_Index5 = 0; ρσ_Index5 < ρσ_Iter5.length; ρσ_Index5++) {
                        ρσ_unpack = ρσ_Iter5[ρσ_Index5];
                        i = ρσ_unpack[0];
                        roll = ρσ_unpack[1];
                        if (i > 0) {
                            roll_html += " | ";
                        }
                        roll_html += await self.rollToDetails(roll);
                        play_sound = true;
                    }
                    html += "<div class='beyond20-roll-result beyond20-roll-cells'>" + self.rollsToCells(roll_html) + "</div>";
                }
                add_totals = damage_rolls.filter((function() {
                    var ρσ_anonfunc = function (r) {
                        return ρσ_equals((r[2] & DAMAGE_FLAGS.prototype.CRITICAL), 0);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["r"]}
                    });
                    return ρσ_anonfunc;
                })()).length > 1;
                total_damages = {};
                var ρσ_Iter6 = ρσ_Iterable(damage_rolls);
                for (var ρσ_Index6 = 0; ρσ_Index6 < ρσ_Iter6.length; ρσ_Index6++) {
                    ρσ_unpack = ρσ_flatten(ρσ_Iter6[ρσ_Index6]);
                    roll_name = ρσ_unpack[0];
                    roll = ρσ_unpack[1];
                    flags = ρσ_unpack[2];
                    is_total = !add_totals && ρσ_equals((flags & DAMAGE_FLAGS.prototype.CRITICAL), 0);
                    if (ρσ_instanceof(roll, str)) {
                        roll_html = "<span>" + roll + "</span>";
                    } else {
                        roll_html = await self.rollToDetails(roll, is_total);
                    }
                    play_sound = true;
                    roll_name = roll_name[0].toUpperCase() + roll_name.slice(1) + ": ";
                    html += "<div class='beyond20-roll-result'><b>" + roll_name + "</b>" + roll_html + "</div>";
                    if (add_totals) {
                        kind_of_damage = "";
                        if (flags & DAMAGE_FLAGS.prototype.REGULAR) {
                            kind_of_damage = (flags & DAMAGE_FLAGS.prototype.CRITICAL) ? "Critical Damage" : "Damage";
                        } else if (flags & DAMAGE_FLAGS.prototype.VERSATILE) {
                            kind_of_damage = (flags & DAMAGE_FLAGS.prototype.CRITICAL) ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                        } else if (flags & DAMAGE_FLAGS.prototype.HEALING) {
                            kind_of_damage = "Healing";
                        } else if (flags & DAMAGE_FLAGS.prototype.ADDITIONAL) {
                            regular = (flags & DAMAGE_FLAGS.prototype.CRITICAL) ? "Critical Damage" : "Damage";
                            versatile = (flags & DAMAGE_FLAGS.prototype.CRITICAL) ? "Critical Two-Handed Damage" : "Two-Handed Damage";
                            if (ρσ_in(regular, total_damages)) {
                                total_damages[(typeof regular === "number" && regular < 0) ? total_damages.length + regular : regular] += " + " + str(roll.total);
                            }
                            if (ρσ_in(versatile, total_damages)) {
                                total_damages[(typeof versatile === "number" && versatile < 0) ? total_damages.length + versatile : versatile] += " + " + str(roll.total);
                            }
                            continue;
                        } else {
                            continue;
                        }
                        if (ρσ_in(kind_of_damage, total_damages)) {
                            total_damages[(typeof kind_of_damage === "number" && kind_of_damage < 0) ? total_damages.length + kind_of_damage : kind_of_damage] += " + " + str(roll.total);
                        } else {
                            total_damages[(typeof kind_of_damage === "number" && kind_of_damage < 0) ? total_damages.length + kind_of_damage : kind_of_damage] = str(roll.total);
                        }
                    }
                }
                if (len(total_damages) > 0) {
                    html += "<div class='beyond20-roll-result'><b><hr/></b></div>";
                }
                roll = null;
                var ρσ_Iter7 = ρσ_Iterable(total_damages);
                for (var ρσ_Index7 = 0; ρσ_Index7 < ρσ_Iter7.length; ρσ_Index7++) {
                    key = ρσ_Iter7[ρσ_Index7];
                    is_total = roll === null;
                    is_total;
                    roll = self._roller.roll(total_damages[(typeof key === "number" && key < 0) ? total_damages.length + key : key]);
                    total_damages[(typeof key === "number" && key < 0) ? total_damages.length + key : key] = roll;
                    roll_html = await self.rollToDetails(roll, is_total);
                    html += "<div class='beyond20-roll-result'><b>Total " + key + ": </b>" + roll_html + "</div>";
                }
                var ρσ_Iter8 = ρσ_Iterable(buttons);
                for (var ρσ_Index8 = 0; ρσ_Index8 < ρσ_Iter8.length; ρσ_Index8++) {
                    button = ρσ_Iter8[ρσ_Index8];
                    html += "<button class=\"beyond20-chat-button\">" + button + "</button>";
                }
                html += "</div>";
                character = request.character.name;
                if ((request.whisper === WhisperType.prototype.HIDE_NAMES || typeof request.whisper === "object" && ρσ_equals(request.whisper, WhisperType.prototype.HIDE_NAMES))) {
                    character = "???";
                }
                postToDiscord(self._settings["discord-secret"], request, title, source, attributes, description, attack_rolls, roll_info, damage_rolls, total_damages, open).then((function() {
                    var ρσ_anonfunc = function (error) {
                        if ((typeof error !== "undefined" && error !== null)) {
                            self._displayer.displayError("Beyond20 Discord Integration: " + error);
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["error"]}
                    });
                    return ρσ_anonfunc;
                })());
                self._displayer.postHTML(request, title, html, buttons, character, request.whisper, play_sound);
                if (attack_rolls.length > 0) {
                    return attack_rolls.find((function() {
                        var ρσ_anonfunc = function (r) {
                            return !r.isDiscarded();
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["r"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else if (total_damages.length > 0) {
                    return total_damages[0];
                } else if (damage_rolls.length > 0) {
                    return damage_rolls[0];
                } else {
                    return null;
                }
            }
            return async_function();
        };
        if (!Beyond20RollRenderer.prototype.postDescription.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.postDescription, {
            __defaults__ : {value: {attack_rolls:ρσ_list_decorate([]), roll_info:ρσ_list_decorate([]), damage_rolls:ρσ_list_decorate([]), open:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "title", "source", "attributes", "description", "attack_rolls", "roll_info", "damage_rolls", "open"]}
        });
        Beyond20RollRenderer.prototype.createRoll = function createRoll(dice, data) {
            var self = this;
            var new_data, parts, new_key, key;
            new_data = {};
            parts = ρσ_list_decorate([ dice ]);
            var ρσ_Iter9 = ρσ_Iterable(data);
            for (var ρσ_Index9 = 0; ρσ_Index9 < ρσ_Iter9.length; ρσ_Index9++) {
                key = ρσ_Iter9[ρσ_Index9];
                if ((data[(typeof key === "number" && key < 0) ? data.length + key : key] !== "" && (typeof data[(typeof key === "number" && key < 0) ? data.length + key : key] !== "object" || ρσ_not_equals(data[(typeof key === "number" && key < 0) ? data.length + key : key], "")))) {
                    new_key = key.replace("_", "").toLowerCase();
                    new_data[(typeof new_key === "number" && new_key < 0) ? new_data.length + new_key : new_key] = data[(typeof key === "number" && key < 0) ? data.length + key : key];
                    parts.append(new_key);
                }
            }
            return self._roller.roll(parts.join(" + @"), new_data);
        };
        if (!Beyond20RollRenderer.prototype.createRoll.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.createRoll, {
            __argnames__ : {value: ["dice", "data"]}
        });
        Beyond20RollRenderer.prototype.rollDice = function rollDice() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var title = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var dice = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var data = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollDice.__defaults__.data : arguments[3];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "data")){
                data = ρσ_kwargs_obj.data;
            }
            var roll;
            roll = self.createRoll(dice, data);
            return ρσ_interpolate_kwargs.call(self, self.postDescription, [request, title, null, {}, null].concat([ρσ_desugar_kwargs({attack_rolls: ρσ_list_decorate([ roll ])})]));
        };
        if (!Beyond20RollRenderer.prototype.rollDice.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollDice, {
            __defaults__ : {value: {data:{}}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "title", "dice", "data"]}
        });
        Beyond20RollRenderer.prototype.rollD20 = function rollD20(request, title, data) {
            var self = this;
            return self.getToHit(request, title, "", data).then((function() {
                var ρσ_anonfunc = function (attack_rolls) {
                    return ρσ_interpolate_kwargs.call(self, self.postDescription, [request, title, null, {}, null].concat([ρσ_desugar_kwargs({attack_rolls: attack_rolls})]));
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["attack_rolls"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!Beyond20RollRenderer.prototype.rollD20.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rollD20, {
            __argnames__ : {value: ["request", "title", "data"]}
        });
        Beyond20RollRenderer.prototype.rollSkill = function rollSkill() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var custom_roll_dice = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollSkill.__defaults__.custom_roll_dice : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            var data, prof, prof_val, formula, html, modifiers, ability;
            data = (function(){
                var ρσ_d = {};
                ρσ_d[request.ability] = request.modifier;
                ρσ_d["custom_dice"] = custom_roll_dice;
                return ρσ_d;
            }).call(this);
            if ((request.ability === "--" || typeof request.ability === "object" && ρσ_equals(request.ability, "--")) && request.character.abilities.length > 0) {
                prof = "";
                prof_val = "";
                if ((request.proficiency === "Proficiency" || typeof request.proficiency === "object" && ρσ_equals(request.proficiency, "Proficiency"))) {
                    prof = "proficiency";
                    prof_val = request.character.proficiency;
                } else if ((request.proficiency === "Half Proficiency" || typeof request.proficiency === "object" && ρσ_equals(request.proficiency, "Half Proficiency"))) {
                    prof = "half_proficiency";
                    prof_val += math.floor(request.character.proficiency / 2);
                } else if ((request.proficiency === "Expertise" || typeof request.proficiency === "object" && ρσ_equals(request.proficiency, "Expertise"))) {
                    prof = "expertise";
                    prof_val += request.character.proficiency * 2;
                }
                formula = "1d20 + @ability " + (((prof !== "" && (typeof prof !== "object" || ρσ_not_equals(prof, "")))) ? " + @" + prof : prof) + " + @custom_dice";
                html = "<form>";
                html += "<div class=\"beyond20-form-row\"><label>Roll Formula</label><input type=\"text\" value=\"" + formula + "\" disabled></div>";
                html += "<div class=\"beyond20-form-row\"><label>Select Ability</label><select name=\"ability\">";
                modifiers = {};
                var ρσ_Iter10 = ρσ_Iterable(request.character.abilities);
                for (var ρσ_Index10 = 0; ρσ_Index10 < ρσ_Iter10.length; ρσ_Index10++) {
                    ability = ρσ_Iter10[ρσ_Index10];
                    html += "<option value=\"" + ability[0] + "\">" + ability[0] + "</option>";
                    modifiers[ρσ_bound_index(ability[0], modifiers)] = ability[3];
                }
                html += "</select></div>";
                html += "</form>";
                self._prompter.prompt("Custom Skill", html, request.skill).then((function() {
                    var ρσ_anonfunc = function (html) {
                        var ability, mod, data;
                        if (html) {
                            ability = html.find("[name=\"ability\"]").val();
                            mod = modifiers[(typeof ability === "number" && ability < 0) ? modifiers.length + ability : ability];
                            if ((request.modifier !== "--" && (typeof request.modifier !== "object" || ρσ_not_equals(request.modifier, "--"))) && (request.modifier !== "+0" && (typeof request.modifier !== "object" || ρσ_not_equals(request.modifier, "+0")))) {
                                mod += request.modifier;
                            }
                            data = (function(){
                                var ρσ_d = {};
                                ρσ_d["ability"] = mod;
                                ρσ_d["prof"] = prof_val;
                                ρσ_d["custom_dice"] = custom_roll_dice;
                                return ρσ_d;
                            }).call(this);
                            self.rollD20(request, request.skill + "(" + ability + ")", data);
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["html"]}
                    });
                    return ρσ_anonfunc;
                })());
            } else {
                return self.rollD20(request, request.skill + "(" + request.modifier + ")", data);
            }
        };
        if (!Beyond20RollRenderer.prototype.rollSkill.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollSkill, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rollAbility = function rollAbility() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var custom_roll_dice = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollAbility.__defaults__.custom_roll_dice : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            var data;
            data = (function(){
                var ρσ_d = {};
                ρσ_d[request.ability] = request.modifier;
                ρσ_d["custom_dice"] = custom_roll_dice;
                return ρσ_d;
            }).call(this);
            return self.rollD20(request, request.name + "(" + request.modifier + ")", data);
        };
        if (!Beyond20RollRenderer.prototype.rollAbility.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollAbility, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rollSavingThrow = function rollSavingThrow() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var custom_roll_dice = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollSavingThrow.__defaults__.custom_roll_dice : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            var data;
            data = (function(){
                var ρσ_d = {};
                ρσ_d[request.ability] = request.modifier;
                ρσ_d["custom_dice"] = custom_roll_dice;
                return ρσ_d;
            }).call(this);
            return self.rollD20(request, request.name + " Save" + "(" + request.modifier + ")", data);
        };
        if (!Beyond20RollRenderer.prototype.rollSavingThrow.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollSavingThrow, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rollInitiative = function rollInitiative() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var callback = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var custom_roll_dice = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollInitiative.__defaults__.custom_roll_dice : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            var data;
            data = (function(){
                var ρσ_d = {};
                ρσ_d["initiative"] = request.initiative;
                ρσ_d["custom_dice"] = custom_roll_dice;
                return ρσ_d;
            }).call(this);
            return self.rollD20(request, "Initiative" + "(" + request.initiative + ")", data);
        };
        if (!Beyond20RollRenderer.prototype.rollInitiative.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollInitiative, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "callback", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rollHitDice = function rollHitDice(request) {
            var self = this;
            var rname;
            rname = "Hit Dice" + ((request.multiclass) ? "(" + request.class + ")" : "");
            return self.rollDice(request, rname, request["hit-dice"], {});
        };
        if (!Beyond20RollRenderer.prototype.rollHitDice.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rollHitDice, {
            __argnames__ : {value: ["request"]}
        });
        Beyond20RollRenderer.prototype.rollDeathSave = function rollDeathSave() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var custom_roll_dice = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollDeathSave.__defaults__.custom_roll_dice : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            return self.rollD20(request, "Death Saving Throw", (function(){
                var ρσ_d = {};
                ρσ_d["custom_dice"] = custom_roll_dice;
                return ρσ_d;
            }).call(this));
        };
        if (!Beyond20RollRenderer.prototype.rollDeathSave.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollDeathSave, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rollItem = function rollItem() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var custom_roll_dice = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollItem.__defaults__.custom_roll_dice : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            var source, proficiencies, formula, html, modifiers, ability, prof;
            source = request["item-type"].trim().toLowerCase();
            if ((source === "tool, common" || typeof source === "object" && ρσ_equals(source, "tool, common")) && request.character.abilities.length > 0) {
                proficiencies = {};
                proficiencies["None"] = 0;
                proficiencies["Half Proficient"] = math.floor(request.character.proficiency / 2);
                proficiencies["Proficient"] = request.character.proficiency;
                proficiencies["Expert"] = request.character.proficiency * 2;
                formula = "1d20 + @ability + @proficiency + @custom_dice";
                html = "<form>";
                html += "<div class=\"beyond20-form-row\"><label>Roll Formula</label><input type=\"text\" value=\"" + formula + "\" disabled></div>";
                html += "<div class=\"beyond20-form-row\"><label>Select Ability</label><select name=\"ability\">";
                modifiers = {};
                var ρσ_Iter11 = ρσ_Iterable(request.character.abilities);
                for (var ρσ_Index11 = 0; ρσ_Index11 < ρσ_Iter11.length; ρσ_Index11++) {
                    ability = ρσ_Iter11[ρσ_Index11];
                    html += "<option value=\"" + ability[0] + "\">" + ability[0] + "</option>";
                    modifiers[ρσ_bound_index(ability[0], modifiers)] = ability[3];
                }
                html += "</select></div>";
                html += "<div class=\"beyond20-form-row\"><label>Select Proficiency</label><select name=\"proficiency\">";
                var ρσ_Iter12 = ρσ_Iterable(proficiencies);
                for (var ρσ_Index12 = 0; ρσ_Index12 < ρσ_Iter12.length; ρσ_Index12++) {
                    prof = ρσ_Iter12[ρσ_Index12];
                    html += "<option value=\"" + prof + "\">" + prof + "</option>";
                }
                html += "</select></div>";
                html += "</form>";
                self._prompter.prompt("Using a tool", html, request.name).then((function() {
                    var ρσ_anonfunc = function (html) {
                        var ability, mod, proficiency, prof_value, data;
                        if (html) {
                            ability = html.find("[name=\"ability\"]").val();
                            mod = modifiers[(typeof ability === "number" && ability < 0) ? modifiers.length + ability : ability];
                            proficiency = html.find("[name=\"proficiency\"]").val();
                            prof_value = proficiencies[(typeof proficiency === "number" && proficiency < 0) ? proficiencies.length + proficiency : proficiency];
                            data = (function(){
                                var ρσ_d = {};
                                ρσ_d["ability"] = mod;
                                ρσ_d["proficiency"] = prof_value;
                                ρσ_d["custom_dice"] = custom_roll_dice;
                                return ρσ_d;
                            }).call(this);
                            self.rollD20(request, request.name + "(" + ability + ")", data);
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["html"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            return self.rollTrait(request);
        };
        if (!Beyond20RollRenderer.prototype.rollItem.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollItem, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rollTrait = function rollTrait(request) {
            var self = this;
            var source;
            if (ρσ_exists.n(request["source-type"])) {
                source = request["source-type"];
                if (request.source.length > 0) {
                    source += ": " + request.source;
                }
            } else if (ρσ_exists.n(request["item-type"])) {
                source = request["item-type"];
            } else {
                source = request.type;
            }
            return ρσ_interpolate_kwargs.call(self, self.postDescription, [request, request.name, source, {}, request.description].concat([ρσ_desugar_kwargs({open: true})]));
        };
        if (!Beyond20RollRenderer.prototype.rollTrait.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rollTrait, {
            __argnames__ : {value: ["request"]}
        });
        Beyond20RollRenderer.prototype.queryDamageType = function queryDamageType(title, damage_types) {
            var self = this;
            var choices, value, option;
            choices = {};
            var ρσ_Iter13 = ρσ_Iterable(damage_types);
            for (var ρσ_Index13 = 0; ρσ_Index13 < ρσ_Iter13.length; ρσ_Index13++) {
                option = ρσ_Iter13[ρσ_Index13];
                value = damage_types[(typeof option === "number" && option < 0) ? damage_types.length + option : option];
                if (value) {
                    choices[(typeof option === "number" && option < 0) ? choices.length + option : option] = option + " (" + value + ")";
                } else {
                    choices[(typeof option === "number" && option < 0) ? choices.length + option : option] = option;
                }
            }
            return self.queryGeneric(title, "Choose Damage Type :", choices, "damage-type");
        };
        if (!Beyond20RollRenderer.prototype.queryDamageType.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.queryDamageType, {
            __argnames__ : {value: ["title", "damage_types"]}
        });
        Beyond20RollRenderer.prototype.buildAttackRolls = function buildAttackRolls(request, custom_roll_dice) {
            var self = this;
            var async_function;
            async_function = async            function () {
                var to_hit, damage_rolls, is_critical, critical_limit, custom, to_hit_mod, damages, damage_types, critical_damages, critical_damage_types, damage_choices, critical_damage_choices, idx, dmgtype, chromatic_type, crit_damage, base_damage, ttd_dice, dmg, dmg_dice, ρσ_unpack, dmgIndex, dmgType, has_versatile, roll, dmg_type, damage_flags, suffix, i, flags, chaos_bolt_damages, r, chaotic_type, dmg_roll;
                to_hit = ρσ_list_decorate([]);
                damage_rolls = ρσ_list_decorate([]);
                is_critical = false;
                if (ρσ_exists.n(request["to-hit"])) {
                    critical_limit = ρσ_exists.e(request["critical-limit"], 20);
                    custom = ((custom_roll_dice === "" || typeof custom_roll_dice === "object" && ρσ_equals(custom_roll_dice, ""))) ? "" : " + " + custom_roll_dice;
                    to_hit_mod = " + " + request["to-hit"] + custom;
                    to_hit_mod;
                    to_hit = await self.getToHit(request, request.name, to_hit_mod);
                    is_critical = self.isCriticalHitD20(to_hit, critical_limit);
                }
                if (ρσ_exists.n(request.damages)) {
                    damages = list(request.damages);
                    damage_types = list(request["damage-types"]);
                    critical_damages = list(request["critical-damages"]);
                    critical_damage_types = list(request["critical-damage-types"]);
                    if ((request.name === "Chromatic Orb" || typeof request.name === "object" && ρσ_equals(request.name, "Chromatic Orb"))) {
                        damage_choices = {};
                        critical_damage_choices = {};
                        var ρσ_Iter14 = ρσ_Iterable(ρσ_list_decorate([ "Acid", "Cold", "Fire", "Lightning", "Poison", "Thunder" ]));
                        for (var ρσ_Index14 = 0; ρσ_Index14 < ρσ_Iter14.length; ρσ_Index14++) {
                            dmgtype = ρσ_Iter14[ρσ_Index14];
                            idx = damage_types.index(dmgtype);
                            damage_choices[ρσ_bound_index(damage_types.pypop(idx), damage_choices)] = damages.pypop(idx);
                            idx = critical_damage_types.index(dmgtype);
                            if (idx >= 0) {
                                critical_damage_choices[ρσ_bound_index(critical_damage_types.pypop(idx), critical_damage_choices)] = critical_damages.pypop(idx);
                            }
                        }
                        chromatic_type = await self.queryDamageType(request.name, damage_choices);
                        damages.insert(0, damage_choices[(typeof chromatic_type === "number" && chromatic_type < 0) ? damage_choices.length + chromatic_type : chromatic_type]);
                        damage_types.insert(0, chromatic_type);
                        if (ρσ_in(chromatic_type, critical_damage_choices)) {
                            crit_damage = critical_damage_choices[(typeof chromatic_type === "number" && chromatic_type < 0) ? critical_damage_choices.length + chromatic_type : chromatic_type];
                            critical_damages.insert(0, crit_damage);
                            critical_damage_types.insert(0, chromatic_type);
                        }
                    } else if ((request.name === "Chaos Bolt" || typeof request.name === "object" && ρσ_equals(request.name, "Chaos Bolt"))) {
                        var ρσ_Iter15 = ρσ_Iterable(ρσ_list_decorate([ "Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder" ]));
                        for (var ρσ_Index15 = 0; ρσ_Index15 < ρσ_Iter15.length; ρσ_Index15++) {
                            dmgtype = ρσ_Iter15[ρσ_Index15];
                            idx = damage_types.index(dmgtype);
                            base_damage = damages.pypop(idx);
                            damage_types.pypop(idx);
                            idx = critical_damage_types.index(dmgtype);
                            crit_damage = critical_damages.pypop(idx);
                            critical_damage_types.pypop(idx);
                        }
                        damages.insert(0, base_damage);
                        damage_types.insert(0, "Chaotic energy");
                        critical_damages.insert(0, crit_damage);
                        critical_damage_types.insert(0, "Chaotic energy");
                    } else if ((request.name === "Toll the Dead" || typeof request.name === "object" && ρσ_equals(request.name, "Toll the Dead"))) {
                        ttd_dice = await self.queryGeneric(request.name, "Is the target missing any of its hit points?", {"d12": "Yes", "d8": "No"}, "ttd_dice", ["d12", "d8"]);
                        damages[0] = damages[0].replace("d8", ttd_dice);
                    }
                    var ρσ_Iter16 = ρσ_Iterable(enumerate(damage_types));
                    for (var ρσ_Index16 = 0; ρσ_Index16 < ρσ_Iter16.length; ρσ_Index16++) {
                        ρσ_unpack = ρσ_Iter16[ρσ_Index16];
                        dmgIndex = ρσ_unpack[0];
                        dmgType = ρσ_unpack[1];
                        if ((damage_types[(typeof dmgIndex === "number" && dmgIndex < 0) ? damage_types.length + dmgIndex : dmgIndex] === "Colossus Slayer" || typeof damage_types[(typeof dmgIndex === "number" && dmgIndex < 0) ? damage_types.length + dmgIndex : dmgIndex] === "object" && ρσ_equals(damage_types[(typeof dmgIndex === "number" && dmgIndex < 0) ? damage_types.length + dmgIndex : dmgIndex], "Colossus Slayer"))) {
                            dmg = damages[(typeof dmgIndex === "number" && dmgIndex < 0) ? damages.length + dmgIndex : dmgIndex].toString();
                            if (dmg) {
                                dmg_dice = await self.queryGeneric(request.name, `Add ${dmgType} damage?`, {"0": "No", [dmg]: "Yes"}, "dmg_dice", ["0", dmg]);
                                if ((dmg_dice === "0" || typeof dmg_dice === "object" && ρσ_equals(dmg_dice, "0"))) {
                                    damages.splice(dmgIndex, 1);
                                    damage_types.splice(dmgIndex, 1);
                                }
                            }
                        }
                    }
                    has_versatile = len(damage_types) > 1 && (damage_types[1] === "Two-Handed" || typeof damage_types[1] === "object" && ρσ_equals(damage_types[1], "Two-Handed"));
                    for (var ρσ_Index17 = 0; ρσ_Index17 < damages.length; ρσ_Index17++) {
                        i = ρσ_Index17;
                        roll = self._roller.roll(damages[(typeof i === "number" && i < 0) ? damages.length + i : i]);
                        dmg_type = damage_types[(typeof i === "number" && i < 0) ? damage_types.length + i : i];
                        if (ρσ_in(dmg_type, ρσ_list_decorate([ "Healing", "Disciple of Life", "Temp HP" ]))) {
                            damage_flags = DAMAGE_FLAGS.prototype.HEALING;
                        } else if ((i === 0 || typeof i === "object" && ρσ_equals(i, 0))) {
                            damage_flags = DAMAGE_FLAGS.prototype.REGULAR;
                        } else if ((i === 1 || typeof i === "object" && ρσ_equals(i, 1)) && has_versatile) {
                            damage_flags = DAMAGE_FLAGS.prototype.VERSATILE;
                        } else {
                            damage_flags = DAMAGE_FLAGS.prototype.ADDITIONAL;
                        }
                        suffix = (!(damage_flags & DAMAGE_FLAGS.prototype.HEALING)) ? " Damage" : "";
                        damage_rolls.append([dmg_type + suffix, roll, damage_flags]);
                        if ((request.name === "Life Transference" || typeof request.name === "object" && ρσ_equals(request.name, "Life Transference")) && (dmg_type === "Necrotic" || typeof dmg_type === "object" && ρσ_equals(dmg_type, "Necrotic"))) {
                            damage_rolls.append(["Healing", roll, DAMAGE_FLAGS.prototype.HEALING]);
                        }
                    }
                    if ((request.name === "Chaos Bolt" || typeof request.name === "object" && ρσ_equals(request.name, "Chaos Bolt"))) {
                        var ρσ_Iter18 = ρσ_Iterable(enumerate(damage_rolls));
                        for (var ρσ_Index18 = 0; ρσ_Index18 < ρσ_Iter18.length; ρσ_Index18++) {
                            ρσ_unpack = ρσ_Iter18[ρσ_Index18];
                            i = ρσ_unpack[0];
                            dmg_roll = ρσ_unpack[1];
                            ρσ_unpack = dmg_roll;
ρσ_unpack = ρσ_unpack_asarray(3, ρσ_unpack);
                            dmg_type = ρσ_unpack[0];
                            roll = ρσ_unpack[1];
                            flags = ρσ_unpack[2];
                            if ((dmg_type === "Chaotic energy Damage" || typeof dmg_type === "object" && ρσ_equals(dmg_type, "Chaotic energy Damage")) && (roll.dice[0].faces === 8 || typeof roll.dice[0].faces === "object" && ρσ_equals(roll.dice[0].faces, 8))) {
                                chaos_bolt_damages = ρσ_list_decorate([ "Acid", "Cold", "Fire", "Force", "Lightning", "Poison", "Psychic", "Thunder" ]);
                                damage_choices = {};
                                var ρσ_Iter19 = ρσ_Iterable(roll.dice[0].rolls);
                                for (var ρσ_Index19 = 0; ρσ_Index19 < ρσ_Iter19.length; ρσ_Index19++) {
                                    r = ρσ_Iter19[ρσ_Index19];
                                    damage_choices[ρσ_bound_index(chaos_bolt_damages[ρσ_bound_index(r.roll - 1, chaos_bolt_damages)], damage_choices)] = null;
                                }
                                console.log("Damage choices : ", damage_choices, damage_choices.length);
                                if ((Object.keys(damage_choices).length === 1 || typeof Object.keys(damage_choices).length === "object" && ρσ_equals(Object.keys(damage_choices).length, 1))) {
                                    damage_rolls.append(["Chaotic energy leaps from the target to a different creature of your choice within 30 feet of it", 
                                    "", DAMAGE_FLAGS.prototype.MESSAGE]);
                                    chaotic_type = Object.keys(damage_choices)[0];
                                } else {
                                    chaotic_type = await self.queryDamageType(request.name, damage_choices);
                                }
                                damage_rolls[(typeof i === "number" && i < 0) ? damage_rolls.length + i : i] = [chaotic_type + " Damage", 
                                roll, flags];
                                critical_damage_types[0] = chaotic_type;
                                break;
                            }
                        }
                    }
                    if (is_critical) {
                        for (var ρσ_Index20 = 0; ρσ_Index20 < critical_damages.length; ρσ_Index20++) {
                            i = ρσ_Index20;
                            roll = self._roller.roll(critical_damages[(typeof i === "number" && i < 0) ? critical_damages.length + i : i]);
                            dmg_type = critical_damage_types[(typeof i === "number" && i < 0) ? critical_damage_types.length + i : i];
                            if (ρσ_in(dmg_type, ρσ_list_decorate([ "Healing", "Disciple of Life", "Temp HP" ]))) {
                                damage_flags = DAMAGE_FLAGS.prototype.HEALING;
                            } else if ((i === 0 || typeof i === "object" && ρσ_equals(i, 0))) {
                                damage_flags = DAMAGE_FLAGS.prototype.REGULAR;
                            } else if ((i === 1 || typeof i === "object" && ρσ_equals(i, 1)) && has_versatile) {
                                damage_flags = DAMAGE_FLAGS.prototype.VERSATILE;
                            } else {
                                damage_flags = DAMAGE_FLAGS.prototype.ADDITIONAL;
                            }
                            suffix = (!(damage_flags & DAMAGE_FLAGS.prototype.HEALING)) ? " Critical Damage" : "";
                            damage_rolls.append([dmg_type + suffix, roll, damage_flags | DAMAGE_FLAGS.prototype.CRITICAL]);
                        }
                    }
                }
                return ρσ_list_decorate([ to_hit, damage_rolls ]);
            }
            return async_function();
        };
        if (!Beyond20RollRenderer.prototype.buildAttackRolls.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.buildAttackRolls, {
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.rerollDamages = function rerollDamages(rolls) {
            var self = this;
            var new_rolls, ρσ_unpack, roll_name, roll, flags;
            new_rolls = ρσ_list_decorate([]);
            var ρσ_Iter21 = ρσ_Iterable(rolls);
            for (var ρσ_Index21 = 0; ρσ_Index21 < ρσ_Iter21.length; ρσ_Index21++) {
                ρσ_unpack = ρσ_flatten(ρσ_Iter21[ρσ_Index21]);
                roll_name = ρσ_unpack[0];
                roll = ρσ_unpack[1];
                flags = ρσ_unpack[2];
                if (ρσ_instanceof(roll, str) || ρσ_instanceof(roll, list)) {
                    new_rolls.append([roll_name, roll, flags]);
                } else {
                    new_rolls.append([roll_name, roll.reroll(), flags]);
                }
            }
            return new_rolls;
        };
        if (!Beyond20RollRenderer.prototype.rerollDamages.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rerollDamages, {
            __argnames__ : {value: ["rolls"]}
        });
        Beyond20RollRenderer.prototype.rollAttack = function rollAttack() {
            var self = this;
            var request = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var custom_roll_dice = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? rollAttack.__defaults__.custom_roll_dice : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "custom_roll_dice")){
                custom_roll_dice = ρσ_kwargs_obj.custom_roll_dice;
            }
            var async_function;
            async_function = async            function () {
                var ρσ_unpack, to_hit, damage_rolls, data, roll_info;
                ρσ_unpack = await self.buildAttackRolls(request, custom_roll_dice);
ρσ_unpack = ρσ_unpack_asarray(2, ρσ_unpack);
                to_hit = ρσ_unpack[0];
                damage_rolls = ρσ_unpack[1];
                data = {};
                if (ρσ_exists.n(request.range)) {
                    data["Range"] = request.range;
                }
                roll_info = ρσ_list_decorate([]);
                if (ρσ_exists.n(request["save-dc"])) {
                    roll_info.append(["Save", request["save-ability"] + " DC " + request["save-dc"]]);
                }
                return self.postDescription(request, request.name, null, data, ρσ_exists.e(request.description, ""), to_hit, roll_info, damage_rolls);
            }
            return async_function();
        };
        if (!Beyond20RollRenderer.prototype.rollAttack.__defaults__) Object.defineProperties(Beyond20RollRenderer.prototype.rollAttack, {
            __defaults__ : {value: {custom_roll_dice:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.buildSpellCard = function buildSpellCard(request) {
            var self = this;
            var data, source, description;
            data = (function(){
                var ρσ_d = {};
                ρσ_d["Casting Time"] = request["casting-time"];
                ρσ_d["Range"] = request.range;
                ρσ_d["Duration"] = request.duration;
                ρσ_d["Components"] = request.components;
                return ρσ_d;
            }).call(this);
            if (ρσ_exists.n(request["cast-at"])) {
                source = request["level-school"] + "(Cast at " + request["cast-at"] + " Level)";
            } else {
                source = request["level-school"];
            }
            if (request.ritual) {
                data["Ritual"] = "Can be cast as a ritual";
            }
            if (request.concentration) {
                data["Concentration"] = "Requires Concentration";
            }
            description = request.description.replace("At Higher Levels.", "</br><b>At Higher levels.</b>");
            return [source, data, description];
        };
        if (!Beyond20RollRenderer.prototype.buildSpellCard.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.buildSpellCard, {
            __argnames__ : {value: ["request"]}
        });
        Beyond20RollRenderer.prototype.rollSpellCard = function rollSpellCard(request) {
            var self = this;
            var spell_card;
            spell_card = self.buildSpellCard(request);
            return ρσ_interpolate_kwargs.call(self, self.postDescription, [request, request.name, spell_card[0], spell_card[1], spell_card[2]].concat([ρσ_desugar_kwargs({open: true})]));
        };
        if (!Beyond20RollRenderer.prototype.rollSpellCard.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rollSpellCard, {
            __argnames__ : {value: ["request"]}
        });
        Beyond20RollRenderer.prototype.rollSpellAttack = function rollSpellAttack(request, custom_roll_dice) {
            var self = this;
            var async_function;
            async_function = async            function () {
                var spell_card, roll_info, components, prefix, ρσ_unpack, attack_rolls, damage_rolls;
                spell_card = self.buildSpellCard(request);
                roll_info = ρσ_list_decorate([]);
                if (ρσ_exists.n(request.range)) {
                    roll_info.append(["Range", request.range]);
                }
                if (ρσ_exists.n(request["cast-at"])) {
                    roll_info.append(["Cast at", request["cast-at"] + " Level"]);
                }
                components = request.components;
                prefix = ((self._settings["component-prefix"] !== "" && (typeof self._settings["component-prefix"] !== "object" || ρσ_not_equals(self._settings["component-prefix"], "")))) ? self._settings["component-prefix"] : null;
                if ((self._settings["components-display"] === "all" || typeof self._settings["components-display"] === "object" && ρσ_equals(self._settings["components-display"], "all"))) {
                    if ((components !== "" && (typeof components !== "object" || ρσ_not_equals(components, "")))) {
                        roll_info.append([prefix || "Components", components]);
                    }
                } else if ((self._settings["components-display"] === "material" || typeof self._settings["components-display"] === "object" && ρσ_equals(self._settings["components-display"], "material"))) {
                    while ((components !== "" && (typeof components !== "object" || ρσ_not_equals(components, "")))) {
                        if (ρσ_in(components[0], ρσ_list_decorate([ "V", "S" ]))) {
                            components = components.slice(1);
                            if (components.startsWith(", ")) {
                                components = components.slice(2);
                            }
                        }
                        if ((components[0] === "M" || typeof components[0] === "object" && ρσ_equals(components[0], "M"))) {
                            roll_info.append([prefix || "Materials", self._settings["component-prefix"] + components.slice(2, -1)]);
                            components = "";
                        }
                    }
                }
                if (ρσ_exists.n(request["save-dc"])) {
                    roll_info.append(["Save", request["save-ability"] + " DC " + request["save-dc"]]);
                }
                ρσ_unpack = await self.buildAttackRolls(request, custom_roll_dice);
ρσ_unpack = ρσ_unpack_asarray(2, ρσ_unpack);
                attack_rolls = ρσ_unpack[0];
                damage_rolls = ρσ_unpack[1];
                return self.postDescription(request, request.name, spell_card[0], spell_card[1], spell_card[2], attack_rolls, roll_info, damage_rolls);
            }
            return async_function();
        };
        if (!Beyond20RollRenderer.prototype.rollSpellAttack.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.rollSpellAttack, {
            __argnames__ : {value: ["request", "custom_roll_dice"]}
        });
        Beyond20RollRenderer.prototype.displayAvatar = function displayAvatar(request) {
            var self = this;
            var character;
            character = request.character.name;
            if ((request.whisper === WhisperType.prototype.HIDE_NAMES || typeof request.whisper === "object" && ρσ_equals(request.whisper, WhisperType.prototype.HIDE_NAMES))) {
                character = "???";
            }
            postToDiscord(self._settings["discord-secret"], request, request.name, "", {}, "", ρσ_list_decorate([]), ρσ_list_decorate([]), ρσ_list_decorate([]), ρσ_list_decorate([]), false).then((function() {
                var ρσ_anonfunc = function (error) {
                    if ((typeof error !== "undefined" && error !== null)) {
                        self._displayer.displayError("Beyond20 Discord Integration: " + error);
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["error"]}
                });
                return ρσ_anonfunc;
            })());
            self._displayer.postHTML(request, request.name, "<img src='" + request.character.avatar + "' width='100%'>", {}, character, false, false);
        };
        if (!Beyond20RollRenderer.prototype.displayAvatar.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.displayAvatar, {
            __argnames__ : {value: ["request"]}
        });
        Beyond20RollRenderer.prototype.handleRollRequest = function handleRollRequest(request) {
            var self = this;
            var custom_roll_dice, mod, rname;
            custom_roll_dice = "";
            if ((request.character.type === "Character" || typeof request.character.type === "object" && ρσ_equals(request.character.type, "Character"))) {
                custom_roll_dice = ρσ_exists.e(request.character.settings["custom-roll-dice"], "");
            }
            if ((request.type === "avatar" || typeof request.type === "object" && ρσ_equals(request.type, "avatar"))) {
                return self.displayAvatar(request);
            } else if ((request.type === "skill" || typeof request.type === "object" && ρσ_equals(request.type, "skill"))) {
                return self.rollSkill(request, custom_roll_dice);
            } else if ((request.type === "ability" || typeof request.type === "object" && ρσ_equals(request.type, "ability"))) {
                return self.rollAbility(request, custom_roll_dice);
            } else if ((request.type === "saving-throw" || typeof request.type === "object" && ρσ_equals(request.type, "saving-throw"))) {
                return self.rollSavingThrow(request, custom_roll_dice);
            } else if ((request.type === "initiative" || typeof request.type === "object" && ρσ_equals(request.type, "initiative"))) {
                return self.rollInitiative(request, custom_roll_dice);
            } else if ((request.type === "hit-dice" || typeof request.type === "object" && ρσ_equals(request.type, "hit-dice"))) {
                return self.rollHitDice(request);
            } else if ((request.type === "item" || typeof request.type === "object" && ρσ_equals(request.type, "item"))) {
                return self.rollItem(request, custom_roll_dice);
            } else if (ρσ_in(request.type, ρσ_list_decorate([ "feature", "trait", "action" ]))) {
                return self.rollTrait(request);
            } else if ((request.type === "death-save" || typeof request.type === "object" && ρσ_equals(request.type, "death-save"))) {
                return self.rollDeathSave(request, custom_roll_dice);
            } else if ((request.type === "attack" || typeof request.type === "object" && ρσ_equals(request.type, "attack"))) {
                return self.rollAttack(request, custom_roll_dice);
            } else if ((request.type === "spell-card" || typeof request.type === "object" && ρσ_equals(request.type, "spell-card"))) {
                return self.rollSpellCard(request);
            } else if ((request.type === "spell-attack" || typeof request.type === "object" && ρσ_equals(request.type, "spell-attack"))) {
                return self.rollSpellAttack(request, custom_roll_dice);
            } else {
                mod = (ρσ_exists.n(request.modifier)) ? request.modifier : request.roll;
                rname = (ρσ_exists.n(request.name)) ? request.name : request.type;
                return self.rollDice(request, rname + "(" + mod + ")", mod, {});
            }
        };
        if (!Beyond20RollRenderer.prototype.handleRollRequest.__argnames__) Object.defineProperties(Beyond20RollRenderer.prototype.handleRollRequest, {
            __argnames__ : {value: ["request"]}
        });
        Beyond20RollRenderer.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Beyond20RollRenderer.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(Beyond20RollRenderer.prototype, "__bases__", {value: []});

        function Beyond20BaseRoll() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Beyond20BaseRoll.prototype.__init__.apply(this, arguments);
        }
        Object.defineProperties(Beyond20BaseRoll.prototype,  {
            "formula": {
                "enumerable": true, 
                "get": function formula() {
                    var self = this;
                    return self._formula;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "total": {
                "enumerable": true, 
                "get": function total() {
                    var self = this;
                    throw new Error("NotImplemented");
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "dice": {
                "enumerable": true, 
                "get": function dice() {
                    var self = this;
                    throw new Error("NotImplemented");
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "parts": {
                "enumerable": true, 
                "get": function parts() {
                    var self = this;
                    throw new Error("NotImplemented");
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
        });
        Beyond20BaseRoll.prototype.__init__ = function __init__() {
            var self = this;
            var formula = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var data = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? __init__.__defaults__.data : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "data")){
                data = ρσ_kwargs_obj.data;
            }
            self._formula = formula;
            self._data = data;
            self._fail_limit = null;
            self._critical_limit = null;
            self._discarded = false;
            self._total = 0;
        };
        if (!Beyond20BaseRoll.prototype.__init__.__defaults__) Object.defineProperties(Beyond20BaseRoll.prototype.__init__, {
            __defaults__ : {value: {data:{}}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["formula", "data"]}
        });
        Beyond20BaseRoll.__argnames__ = Beyond20BaseRoll.prototype.__init__.__argnames__;
        Beyond20BaseRoll.__handles_kwarg_interpolation__ = Beyond20BaseRoll.prototype.__init__.__handles_kwarg_interpolation__;
        Beyond20BaseRoll.prototype.getTooltip = function getTooltip() {
            var self = this;
            throw new Error("NotImplemented");
        };
        Beyond20BaseRoll.prototype.reroll = function reroll() {
            var self = this;
            throw new Error("NotImplemented");
        };
        Beyond20BaseRoll.prototype.setDiscarded = function setDiscarded(discarded) {
            var self = this;
            self._discarded = discarded;
        };
        if (!Beyond20BaseRoll.prototype.setDiscarded.__argnames__) Object.defineProperties(Beyond20BaseRoll.prototype.setDiscarded, {
            __argnames__ : {value: ["discarded"]}
        });
        Beyond20BaseRoll.prototype.isDiscarded = function isDiscarded() {
            var self = this;
            return self._discarded;
        };
        Beyond20BaseRoll.prototype.setCriticalLimit = function setCriticalLimit(limit) {
            var self = this;
            self._critical_limit = limit;
        };
        if (!Beyond20BaseRoll.prototype.setCriticalLimit.__argnames__) Object.defineProperties(Beyond20BaseRoll.prototype.setCriticalLimit, {
            __argnames__ : {value: ["limit"]}
        });
        Beyond20BaseRoll.prototype.setFailLimit = function setFailLimit(limit) {
            var self = this;
            self._fail_limit = limit;
        };
        if (!Beyond20BaseRoll.prototype.setFailLimit.__argnames__) Object.defineProperties(Beyond20BaseRoll.prototype.setFailLimit, {
            __argnames__ : {value: ["limit"]}
        });
        Beyond20BaseRoll.prototype.checkRollForCrits = function checkRollForCrits(cb) {
            var self = this;
            var r, die;
            var ρσ_Iter22 = ρσ_Iterable(self.dice);
            for (var ρσ_Index22 = 0; ρσ_Index22 < ρσ_Iter22.length; ρσ_Index22++) {
                die = ρσ_Iter22[ρσ_Index22];
                var ρσ_Iter23 = ρσ_Iterable(die.rolls);
                for (var ρσ_Index23 = 0; ρσ_Index23 < ρσ_Iter23.length; ρσ_Index23++) {
                    r = ρσ_Iter23[ρσ_Index23];
                    if (!ρσ_exists.e(r.discarded, false)) {
                        if (cb(die.faces, r.roll)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        if (!Beyond20BaseRoll.prototype.checkRollForCrits.__argnames__) Object.defineProperties(Beyond20BaseRoll.prototype.checkRollForCrits, {
            __argnames__ : {value: ["cb"]}
        });
        Beyond20BaseRoll.prototype.isCriticalHit = function isCriticalHit() {
            var self = this;
            return self.checkRollForCrits((function() {
                var ρσ_anonfunc = function (faces, value) {
                    var limit;
                    limit = (self._critical_limit === null) ? faces : self._critical_limit;
                    return value >= limit;
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["faces", "value"]}
                });
                return ρσ_anonfunc;
            })());
        };
        Beyond20BaseRoll.prototype.isCriticalFail = function isCriticalFail() {
            var self = this;
            return self.checkRollForCrits((function() {
                var ρσ_anonfunc = function (faces, value) {
                    var limit;
                    limit = (self._fail_limit === null) ? 1 : self._fail_limit;
                    return value <= limit;
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["faces", "value"]}
                });
                return ρσ_anonfunc;
            })());
        };
        Beyond20BaseRoll.prototype.toJSON = function toJSON() {
            var self = this;
            return (function(){
                var ρσ_d = {};
                ρσ_d["formula"] = self.formula;
                ρσ_d["parts"] = self.parts;
                ρσ_d["fail-limit"] = self._fail_limit;
                ρσ_d["critical-limit"] = self._critical_limit;
                ρσ_d["critical-failure"] = self.isCriticalFail();
                ρσ_d["critical-success"] = self.isCriticalHit();
                ρσ_d["discarded"] = self.isDiscarded();
                ρσ_d["total"] = self.total;
                return ρσ_d;
            }).call(this);
        };
        Beyond20BaseRoll.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Beyond20BaseRoll.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(Beyond20BaseRoll.prototype, "__bases__", {value: []});
        
        
        
        

        ρσ_modules.roll_renderer.DAMAGE_FLAGS = DAMAGE_FLAGS;
        ρσ_modules.roll_renderer.Beyond20RollRenderer = Beyond20RollRenderer;
        ρσ_modules.roll_renderer.Beyond20BaseRoll = Beyond20BaseRoll;
    })();

    (function(){
        var __name__ = "dndbeyond_dice";
        var factory, dndbeyondDiceRoller;
        var Beyond20RollRenderer = ρσ_modules.roll_renderer.Beyond20RollRenderer;
        var Beyond20BaseRoll = ρσ_modules.roll_renderer.Beyond20BaseRoll;

        var getDefaultSettings = ρσ_modules.settings.getDefaultSettings;
        var WhisperType = ρσ_modules.settings.WhisperType;

        var re = ρσ_modules.re;

        function DNDBDisplayer() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            DNDBDisplayer.prototype.__init__.apply(this, arguments);
        }
        DNDBDisplayer.prototype.__init__ = function __init__() {
            var self = this;
            self._error = null;
        };
        DNDBDisplayer.__argnames__ = DNDBDisplayer.prototype.__init__.__argnames__;
        DNDBDisplayer.__handles_kwarg_interpolation__ = DNDBDisplayer.prototype.__init__.__handles_kwarg_interpolation__;
        DNDBDisplayer.prototype.postHTML = function postHTML(request, title, html, buttons, character, whisper, play_sound) {
            var self = this;
            var content, dlg, element, icon16;
            content = "<div class='beyond20-dice-roller'>";
            if (self._error) {
                content += "<div class='beyond20-roller-error'>" + "<span class='beyond20-tooltip'>Virtual Table Top Not Found" + "<span class='beyond20-tooltip-content'>" + self._error + "</span>" + "</span>" + "</div>";
            }
            content += "<div class='beyond20-dice-roller-content'>" + html + "</div>" + "</div>";
            dlg = alertify.Beyond20Roll(title, content);
            dlg.set("onclose", function () {
                dlg.set("onclose", null);
                dlg.destroy();
            });
            element = $(dlg.elements.content.firstElementChild);
            icon16 = chrome.runtime.getURL("images/icons/icon16.png");
            element.find(".ct-beyond20-custom-icon").attr("src", icon16);
            element.find(".ct-beyond20-custom-roll").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    var roll;
                    roll = $(event.currentTarget).find(".beyond20-roll-formula").text();
                    dndbeyondDiceRoller.rollDice(request, title, roll);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
            element.find(".beyond20-chat-button").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    var button;
                    button = $(event.currentTarget).text();
                    buttons[(typeof button === "number" && button < 0) ? buttons.length + button : button]();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!DNDBDisplayer.prototype.postHTML.__argnames__) Object.defineProperties(DNDBDisplayer.prototype.postHTML, {
            __argnames__ : {value: ["request", "title", "html", "buttons", "character", "whisper", "play_sound"]}
        });
        DNDBDisplayer.prototype.displayError = function displayError(message) {
            var self = this;
            alertify.error(message);
        };
        if (!DNDBDisplayer.prototype.displayError.__argnames__) Object.defineProperties(DNDBDisplayer.prototype.displayError, {
            __argnames__ : {value: ["message"]}
        });
        DNDBDisplayer.prototype.setError = function setError(error) {
            var self = this;
            self._error = error;
        };
        if (!DNDBDisplayer.prototype.setError.__argnames__) Object.defineProperties(DNDBDisplayer.prototype.setError, {
            __argnames__ : {value: ["error"]}
        });
        DNDBDisplayer.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        DNDBDisplayer.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(DNDBDisplayer.prototype, "__bases__", {value: []});

        function DNDBDice() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            DNDBDice.prototype.__init__.apply(this, arguments);
        }
        Object.defineProperties(DNDBDice.prototype,  {
            "total": {
                "enumerable": true, 
                "get": function total() {
                    var self = this;
                    return self._total;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "formula": {
                "enumerable": true, 
                "get": function formula() {
                    var self = this;
                    return self.amount + "d" + self.faces + self._modifiers;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "rolls": {
                "enumerable": true, 
                "get": function rolls() {
                    var self = this;
                    return self._rolls || ρσ_list_decorate([]);
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
        });
        DNDBDice.prototype.__init__ = function __init__() {
            var self = this;
            var amount = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var faces = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var modifiers = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? __init__.__defaults__.modifiers : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "modifiers")){
                modifiers = ρσ_kwargs_obj.modifiers;
            }
            var match_ro, match_dk, dk;
            self.amount = int(amount);
            self.faces = int(faces);
            self._modifiers = modifiers || "";
            self._reroll = (function(){
                var ρσ_d = {};
                ρσ_d["active"] = false;
                ρσ_d["value"] = 0;
                ρσ_d["operator"] = "=";
                return ρσ_d;
            }).call(this);
            self._dk = (function(){
                var ρσ_d = {};
                ρσ_d["drop"] = false;
                ρσ_d["keep"] = false;
                ρσ_d["high"] = false;
                ρσ_d["amount"] = 0;
                return ρσ_d;
            }).call(this);
            if ((modifiers !== "" && (typeof modifiers !== "object" || ρσ_not_equals(modifiers, "")))) {
                match_ro = re.search("r(=|<|<=|>|>=)([0-9]+)", modifiers);
                if ((typeof match_ro !== "undefined" && match_ro !== null)) {
                    self._reroll.active = true;
                    self._reroll.operator = match_ro.group(1);
                    self._reroll.value = int(match_ro.group(2));
                }
                match_dk = re.search("(dl|dh|kl|kh)([0-9]*)", modifiers);
                if ((typeof match_dk !== "undefined" && match_dk !== null)) {
                    dk = match_dk.group(1);
                    self._dk.amount = int(match_dk.group(2) || 1);
                    if ((dk === "dl" || typeof dk === "object" && ρσ_equals(dk, "dl"))) {
                        self._dk.drop = true;
                        self._dk.high = false;
                    } else if ((dk === "dh" || typeof dk === "object" && ρσ_equals(dk, "dh"))) {
                        self._dk.drop = true;
                        self._dk.high = true;
                    } else if ((dk === "kl" || typeof dk === "object" && ρσ_equals(dk, "kl"))) {
                        self._dk.keep = true;
                        self._dk.high = false;
                    } else if ((dk === "kh" || typeof dk === "object" && ρσ_equals(dk, "kh"))) {
                        self._dk.keep = true;
                        self._dk.high = true;
                    }
                }
            }
            self._rolls = ρσ_list_decorate([]);
        };
        if (!DNDBDice.prototype.__init__.__defaults__) Object.defineProperties(DNDBDice.prototype.__init__, {
            __defaults__ : {value: {modifiers:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["amount", "faces", "modifiers"]}
        });
        DNDBDice.__argnames__ = DNDBDice.prototype.__init__.__argnames__;
        DNDBDice.__handles_kwarg_interpolation__ = DNDBDice.prototype.__init__.__handles_kwarg_interpolation__;
        DNDBDice.prototype.roll = function roll() {
            var self = this;
            var die, i, dk_amount, non_discarded, to_dk;
            self._rolls = ρσ_list_decorate([]);
            for (var ρσ_Index0 = 0; ρσ_Index0 < self.amount; ρσ_Index0++) {
                i = ρσ_Index0;
                die = Math.floor(Math.random() * self.faces) + 1;
                if (self._reroll.active && ((self._reroll.operator === "=" || typeof self._reroll.operator === "object" && ρσ_equals(self._reroll.operator, "=")) && (die === self._reroll.value || typeof die === "object" && ρσ_equals(die, self._reroll.value)) || (self._reroll.operator === "<=" || typeof self._reroll.operator === "object" && ρσ_equals(self._reroll.operator, "<=")) && die <= self._reroll.value || (self._reroll.operator === "<" || typeof self._reroll.operator === "object" && ρσ_equals(self._reroll.operator, "<")) && die < self._reroll.value || (self._reroll.operator === ">=" || typeof self._reroll.operator === "object" && ρσ_equals(self._reroll.operator, ">=")) && die >= self._reroll.value || (self._reroll.operator === ">" || typeof self._reroll.operator === "object" && ρσ_equals(self._reroll.operator, ">")) && die > self._reroll.value)) {
                    self._rolls.append((function(){
                        var ρσ_d = {};
                        ρσ_d["roll"] = die;
                        ρσ_d["discarded"] = true;
                        return ρσ_d;
                    }).call(this));
                    die = Math.floor(Math.random() * self.faces) + 1;
                }
                self._rolls.append((function(){
                    var ρσ_d = {};
                    ρσ_d["roll"] = die;
                    return ρσ_d;
                }).call(this));
            }
            dk_amount = self._dk.amount;
            while ((self._dk.drop || self._dk.keep) && self._dk.amount > 0) {
                non_discarded = self._rolls.filter((function() {
                    var ρσ_anonfunc = function (r) {
                        return !ρσ_exists.e(r.discarded, false) && !ρσ_exists.e(r.keep, false);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["r"]}
                    });
                    return ρσ_anonfunc;
                })());
                if ((non_discarded.length === 0 || typeof non_discarded.length === "object" && ρσ_equals(non_discarded.length, 0))) {
                    break;
                }
                if (self._dk.high) {
                    to_dk = Math.max.apply(Math, non_discarded.map((function() {
                        var ρσ_anonfunc = function (r) {
                            return r.roll;
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["r"]}
                        });
                        return ρσ_anonfunc;
                    })()));
                } else {
                    to_dk = Math.min.apply(Math, non_discarded.map((function() {
                        var ρσ_anonfunc = function (r) {
                            return r.roll;
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["r"]}
                        });
                        return ρσ_anonfunc;
                    })()));
                }
                if (self._dk.drop) {
                    self._rolls = self._rolls.map((function() {
                        var ρσ_anonfunc = function (r) {
                            if (to_dk > 0 && !ρσ_exists.e(r.discarded, false) && (r.roll === to_dk || typeof r.roll === "object" && ρσ_equals(r.roll, to_dk))) {
                                r.discard = true;
                                to_dk = 0;
                            }
                            return r;
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["r"]}
                        });
                        return ρσ_anonfunc;
                    })());
                } else if (self._dk.keep) {
                    self._rolls = self._rolls.map((function() {
                        var ρσ_anonfunc = function (r) {
                            if (to_dk > 0 && !ρσ_exists.e(r.discarded, false) && !ρσ_exists.e(r.keep, false) && (r.roll === to_dk || typeof r.roll === "object" && ρσ_equals(r.roll, to_dk))) {
                                r.keep = true;
                                to_dk = 0;
                            }
                            return r;
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["r"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
                self._dk.amount -= 1;
            }
            if (self._dk.keep) {
                self._rolls = self._rolls.map((function() {
                    var ρσ_anonfunc = function (r) {
                        if (!ρσ_exists.e(r.keep, false)) {
                            r.discarded = true;
                        }
                        delete r.keep;
                        return r;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["r"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            self._dk.amount = dk_amount;
            self._total = self._rolls.reduce((function() {
                var ρσ_anonfunc = function (acc, roll) {
                    return acc + ((ρσ_exists.n(roll.discarded)) ? 0 : roll.roll);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["acc", "roll"]}
                });
                return ρσ_anonfunc;
            })(), 0);
            return self._total;
        };
        DNDBDice.prototype.toJSON = function toJSON() {
            var self = this;
            return (function(){
                var ρσ_d = {};
                ρσ_d["total"] = self.total;
                ρσ_d["formula"] = self.formula;
                ρσ_d["rolls"] = self.rolls;
                return ρσ_d;
            }).call(this);
        };
        DNDBDice.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        DNDBDice.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(DNDBDice.prototype, "__bases__", {value: []});
        
        
        

        function DNDBRoll() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            DNDBRoll.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(DNDBRoll, Beyond20BaseRoll);
        Object.defineProperties(DNDBRoll.prototype,  {
            "total": {
                "enumerable": true, 
                "get": function total() {
                    var self = this;
                    return self._total;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "formula": {
                "enumerable": true, 
                "get": function formula() {
                    var self = this;
                    var formula, first, part;
                    formula = "";
                    first = true;
                    var ρσ_Iter1 = ρσ_Iterable(self._parts);
                    for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                        part = ρσ_Iter1[ρσ_Index1];
                        if (!first) {
                            formula += " + ";
                        }
                        first = false;
                        if (ρσ_instanceof(part, DNDBDice)) {
                            formula += part.formula;
                        } else {
                            formula += part;
                        }
                    }
                    return formula;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "dice": {
                "enumerable": true, 
                "get": function dice() {
                    var self = this;
                    var dice, part;
                    dice = ρσ_list_decorate([]);
                    var ρσ_Iter2 = ρσ_Iterable(self._parts);
                    for (var ρσ_Index2 = 0; ρσ_Index2 < ρσ_Iter2.length; ρσ_Index2++) {
                        part = ρσ_Iter2[ρσ_Index2];
                        if (ρσ_instanceof(part, DNDBDice)) {
                            dice.append(part);
                        }
                    }
                    return dice;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
            "parts": {
                "enumerable": true, 
                "get": function parts() {
                    var self = this;
                    return self._parts;
                }, 
                "set": function () { throw new AttributeError("can't set attribute") }
            }, 
        });
        DNDBRoll.prototype.__init__ = function __init__() {
            var self = this;
            var formula = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var data = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? __init__.__defaults__.data : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "data")){
                data = ρσ_kwargs_obj.data;
            }
            var key, parts, part, match, sign;
            formula = formula.replace("ro<2", "r<=2");
            Beyond20BaseRoll.prototype.__init__.call(self, formula, data);
            self._parts = ρσ_list_decorate([]);
            var ρσ_Iter3 = ρσ_Iterable(data);
            for (var ρσ_Index3 = 0; ρσ_Index3 < ρσ_Iter3.length; ρσ_Index3++) {
                key = ρσ_Iter3[ρσ_Index3];
                formula = formula.replace("@" + key, data[(typeof key === "number" && key < 0) ? data.length + key : key]);
            }
            parts = formula.split(/(?=[+-])/);
            var ρσ_Iter4 = ρσ_Iterable(parts);
            for (var ρσ_Index4 = 0; ρσ_Index4 < ρσ_Iter4.length; ρσ_Index4++) {
                part = ρσ_Iter4[ρσ_Index4];
                part = part.trim();
                match = re.search("([0-9]*)d([0-9]+)(.*)", part);
                if ((typeof match !== "undefined" && match !== null)) {
                    part = new DNDBDice(match.group(1), match.group(2), match.group(3));
                    self._parts.append(part);
                } else {
                    match = re.search("([+-])?\\s*([0-9\\.]+)", part);
                    if ((typeof match !== "undefined" && match !== null)) {
                        try {
                            sign = match.group(1) || "";
                            part = float(sign + match.group(2));
                            self._parts.append(part);
                        } catch (ρσ_Exception) {
                            ρσ_last_exception = ρσ_Exception;
                            {
                            } 
                        }
                    }
                }
            }
            self.roll();
        };
        if (!DNDBRoll.prototype.__init__.__defaults__) Object.defineProperties(DNDBRoll.prototype.__init__, {
            __defaults__ : {value: {data:{}}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["formula", "data"]}
        });
        DNDBRoll.__argnames__ = DNDBRoll.prototype.__init__.__argnames__;
        DNDBRoll.__handles_kwarg_interpolation__ = DNDBRoll.prototype.__init__.__handles_kwarg_interpolation__;
        DNDBRoll.prototype.roll = function roll() {
            var self = this;
            var part;
            self._total = 0;
            var ρσ_Iter5 = ρσ_Iterable(self._parts);
            for (var ρσ_Index5 = 0; ρσ_Index5 < ρσ_Iter5.length; ρσ_Index5++) {
                part = ρσ_Iter5[ρσ_Index5];
                if (ρσ_instanceof(part, DNDBDice)) {
                    self._total += part.roll();
                } else {
                    self._total += part;
                }
            }
            self._total = Math.round(self._total * 100) / 100;
        };
        DNDBRoll.prototype.getTooltip = function getTooltip() {
            var self = this;
            var tooltip, result_class, die, part;
            tooltip = "<div class='beyond20-roll-tooltip'>";
            var ρσ_Iter6 = ρσ_Iterable(self._parts);
            for (var ρσ_Index6 = 0; ρσ_Index6 < ρσ_Iter6.length; ρσ_Index6++) {
                part = ρσ_Iter6[ρσ_Index6];
                if (ρσ_instanceof(part, DNDBDice)) {
                    tooltip += "<div class='beyond20-roll-dice'>";
                    tooltip += "<div class='beyond20-roll-dice-formula'>" + part.formula + "</div>";
                    tooltip += "<div class='beyond20-roll-dice-rolls'>";
                    var ρσ_Iter7 = ρσ_Iterable(part.rolls);
                    for (var ρσ_Index7 = 0; ρσ_Index7 < ρσ_Iter7.length; ρσ_Index7++) {
                        die = ρσ_Iter7[ρσ_Index7];
                        result_class = "beyond20-roll-detail-";
                        result_class += ((die.roll === part.faces || typeof die.roll === "object" && ρσ_equals(die.roll, part.faces))) ? "crit" : ((die.roll === 1 || typeof die.roll === "object" && ρσ_equals(die.roll, 1))) ? "fail" : "normal";
                        if (ρσ_exists.e(die.discarded, false)) {
                            result_class += " beyond20-roll-detail-discarded";
                        }
                        tooltip += "<span class='beyond20-roll-die-result " + result_class + "'>" + die.roll + "</span>";
                    }
                    tooltip += "</div></div>";
                }
            }
            tooltip += "</div>";
            return tooltip;
        };
        DNDBRoll.prototype.reroll = function reroll() {
            var self = this;
            self.roll();
            return self;
        };
        DNDBRoll.prototype.__repr__ = function __repr__ () {
            if(Beyond20BaseRoll.prototype.__repr__) return Beyond20BaseRoll.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        DNDBRoll.prototype.__str__ = function __str__ () {
            if(Beyond20BaseRoll.prototype.__str__) return Beyond20BaseRoll.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(DNDBRoll.prototype, "__bases__", {value: [Beyond20BaseRoll]});
        
        
        
        

        function DNDBRoller() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            DNDBRoller.prototype.__init__.apply(this, arguments);
        }
        DNDBRoller.prototype.__init__ = function __init__ () {
                    };
        DNDBRoller.prototype.roll = function roll(formula, data) {
            var self = this;
            return new DNDBRoll(formula, data);
        };
        if (!DNDBRoller.prototype.roll.__argnames__) Object.defineProperties(DNDBRoller.prototype.roll, {
            __argnames__ : {value: ["formula", "data"]}
        });
        DNDBRoller.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        DNDBRoller.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(DNDBRoller.prototype, "__bases__", {value: []});

        function DNDBPrompter() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            DNDBPrompter.prototype.__init__.apply(this, arguments);
        }
        DNDBPrompter.prototype.__init__ = function __init__ () {
                    };
        DNDBPrompter.prototype.prompt = function prompt() {
            var self = this;
            var title = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var html = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var ok_label = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? prompt.__defaults__.ok_label : arguments[2];
            var cancel_label = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? prompt.__defaults__.cancel_label : arguments[3];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "ok_label")){
                ok_label = ρσ_kwargs_obj.ok_label;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "cancel_label")){
                cancel_label = ρσ_kwargs_obj.cancel_label;
            }
            return new Promise((function() {
                var ρσ_anonfunc = function (resolve, reject) {
                    alertify.Beyond20Prompt(title, html, ok_label, cancel_label, resolve);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["resolve", "reject"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!DNDBPrompter.prototype.prompt.__defaults__) Object.defineProperties(DNDBPrompter.prototype.prompt, {
            __defaults__ : {value: {ok_label:"OK", cancel_label:"Cancel"}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["title", "html", "ok_label", "cancel_label"]}
        });
        DNDBPrompter.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        DNDBPrompter.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(DNDBPrompter.prototype, "__bases__", {value: []});

        alertify.defaults.transition = "zoom";
        if (!ρσ_exists.n(alertify.Beyond20Prompt)) {
            factory = function () {
                return (function(){
                    var ρσ_d = {};
                    ρσ_d["settings"] = (function(){
                        var ρσ_d = {};
                        ρσ_d["content"] = undefined;
                        ρσ_d["ok_label"] = undefined;
                        ρσ_d["cancel_label"] = undefined;
                        ρσ_d["resolver"] = undefined;
                        return ρσ_d;
                    }).call(this);
                    ρσ_d["main"] = (function() {
                        var ρσ_anonfunc = function (title, content, ok_label, cancel_label, resolver) {
                            this.set("title", title);
                            this.set("content", content);
                            this.set("resolver", resolver);
                            this.set("ok_label", ok_label);
                            this.set("cancel_label", cancel_label);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["title", "content", "ok_label", "cancel_label", "resolver"]}
                        });
                        return ρσ_anonfunc;
                    })();
                    ρσ_d["setup"] = function () {
                        return (function(){
                            var ρσ_d = {};
                            ρσ_d["buttons"] = ρσ_list_decorate([ (function(){
                                var ρσ_d = {};
                                ρσ_d["text"] = alertify.defaults.glossary.ok;
                                ρσ_d["key"] = 13;
                                ρσ_d["className"] = alertify.defaults.theme.ok;
                                return ρσ_d;
                            }).call(this), (function(){
                                var ρσ_d = {};
                                ρσ_d["text"] = alertify.defaults.glossary.cancel;
                                ρσ_d["key"] = 27;
                                ρσ_d["invokeOnClose"] = true;
                                ρσ_d["className"] = alertify.defaults.theme.cancel;
                                return ρσ_d;
                            }).call(this) ]);
                            ρσ_d["focus"] = (function(){
                                var ρσ_d = {};
                                ρσ_d["element"] = 0;
                                ρσ_d["select"] = true;
                                return ρσ_d;
                            }).call(this);
                            ρσ_d["options"] = (function(){
                                var ρσ_d = {};
                                ρσ_d["maximizable"] = false;
                                ρσ_d["resizable"] = false;
                                return ρσ_d;
                            }).call(this);
                            return ρσ_d;
                        }).call(this);
                    };
                    ρσ_d["build"] = function () {
                    };
                    ρσ_d["prepare"] = function () {
                        this.elements.content.innerHTML = this.get("content");
                        this.__internal.buttons[0].element.innerHTML = this.get("ok_label");
                        this.__internal.buttons[1].element.innerHTML = this.get("cancel_label");
                    };
                    ρσ_d["callback"] = (function() {
                        var ρσ_anonfunc = function (closeEvent) {
                            if ((closeEvent.index === 0 || typeof closeEvent.index === "object" && ρσ_equals(closeEvent.index, 0))) {
                                this.get("resolver").call(this, $(this.elements.content.firstElementChild));
                            } else {
                                this.get("resolver").call(this, null);
                            }
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["closeEvent"]}
                        });
                        return ρσ_anonfunc;
                    })();
                    return ρσ_d;
                }).call(this);
            };
            alertify.dialog("Beyond20Prompt", factory, false, "prompt");
        }
        if (!ρσ_exists.n(alertify.Beyond20Roll)) {
            alertify.dialog("Beyond20Roll", function () {
                return {};
            }, false, "alert");
        }
        dndbeyondDiceRoller = new Beyond20RollRenderer(new DNDBRoller, new DNDBPrompter, new DNDBDisplayer);
        dndbeyondDiceRoller.setBaseURL(chrome.runtime.getURL(""));
        dndbeyondDiceRoller.setSettings(getDefaultSettings());
        dndbeyondDiceRoller.handleRollError = (function() {
            var ρσ_anonfunc = function (request, error) {
                dndbeyondDiceRoller._displayer.setError(error);
                request["original-whisper"] = request.whisper;
                request.whisper = WhisperType.prototype.NO;
                return dndbeyondDiceRoller.handleRollRequest(request);
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["request", "error"]}
            });
            return ρσ_anonfunc;
        })();
        ρσ_modules.dndbeyond_dice.factory = factory;
        ρσ_modules.dndbeyond_dice.dndbeyondDiceRoller = dndbeyondDiceRoller;
        ρσ_modules.dndbeyond_dice.DNDBDisplayer = DNDBDisplayer;
        ρσ_modules.dndbeyond_dice.DNDBDice = DNDBDice;
        ρσ_modules.dndbeyond_dice.DNDBRoll = DNDBRoll;
        ρσ_modules.dndbeyond_dice.DNDBRoller = DNDBRoller;
        ρσ_modules.dndbeyond_dice.DNDBPrompter = DNDBPrompter;
    })();

    (function(){
        var __name__ = "encodings";
        var utf8_decoder_table, _u8enc, utf8_encode;
        function base64encode(bytes, altchars, pad_char) {
            var l, remainder, main_length, encodings, ans, chunk;
            l = bytes.length;
            remainder = l % 3;
            main_length = l - remainder;
            encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" + (altchars || "+/");
            pad_char = (pad_char === undefined) ? "=" : pad_char;
            ans = [];
            for (var i = 0; i < main_length; i += 3) {
                chunk = bytes[(typeof i === "number" && i < 0) ? bytes.length + i : i] << 16 | bytes[ρσ_bound_index(i + 1, bytes)] << 8 | bytes[ρσ_bound_index(i + 2, bytes)];
                ans.push(encodings[ρσ_bound_index((chunk & 16515072) >> 18, encodings)], encodings[ρσ_bound_index((chunk & 258048) >> 12, encodings)], encodings[ρσ_bound_index((chunk & 4032) >> 6, encodings)], encodings[ρσ_bound_index(chunk & 63, encodings)]);
            }
            if (remainder === 1) {
                chunk = bytes[(typeof main_length === "number" && main_length < 0) ? bytes.length + main_length : main_length];
                ans.push(encodings[ρσ_bound_index((chunk & 252) >> 2, encodings)], encodings[ρσ_bound_index((chunk & 3) << 4, encodings)], pad_char, pad_char);
            } else if (remainder === 2) {
                chunk = bytes[(typeof main_length === "number" && main_length < 0) ? bytes.length + main_length : main_length] << 8 | bytes[ρσ_bound_index(main_length + 1, bytes)];
                ans.push(encodings[ρσ_bound_index((chunk & 64512) >> 10, encodings)], encodings[ρσ_bound_index((chunk & 1008) >> 4, encodings)], encodings[ρσ_bound_index((chunk & 15) << 2, encodings)], pad_char);
            }
            return ans.join("");
        };
        if (!base64encode.__argnames__) Object.defineProperties(base64encode, {
            __argnames__ : {value: ["bytes", "altchars", "pad_char"]}
        });

        function base64decode(string) {
            var chars, ans, i;
            if (typeof window !== "undefined") {
                chars = window.atob(string);
            } else {
                chars = new Buffer(string, "base64").toString("binary");
            }
            ans = new Uint8Array(chars.length);
            for (var ρσ_Index0 = 0; ρσ_Index0 < ans.length; ρσ_Index0++) {
                i = ρσ_Index0;
                ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = chars.charCodeAt(i);
            }
            return ans;
        };
        if (!base64decode.__argnames__) Object.defineProperties(base64decode, {
            __argnames__ : {value: ["string"]}
        });

        function urlsafe_b64encode(bytes, pad_char) {
            return base64encode(bytes, "-_", pad_char);
        };
        if (!urlsafe_b64encode.__argnames__) Object.defineProperties(urlsafe_b64encode, {
            __argnames__ : {value: ["bytes", "pad_char"]}
        });

        function urlsafe_b64decode(string) {
            string = String.prototype.replace.call(string, /[_-]/g, (function() {
                var ρσ_anonfunc = function (m) {
                    return (m === "-") ? "+" : "/";
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["m"]}
                });
                return ρσ_anonfunc;
            })());
            return base64decode(string);
        };
        if (!urlsafe_b64decode.__argnames__) Object.defineProperties(urlsafe_b64decode, {
            __argnames__ : {value: ["string"]}
        });

        function hexlify(bytes) {
            var ans, x;
            ans = [];
            for (var i = 0; i < bytes.length; i++) {
                x = bytes[(typeof i === "number" && i < 0) ? bytes.length + i : i].toString(16);
                if (x.length === 1) {
                    x = "0" + x;
                }
                ans.push(x);
            }
            return ans.join("");
        };
        if (!hexlify.__argnames__) Object.defineProperties(hexlify, {
            __argnames__ : {value: ["bytes"]}
        });

        function unhexlify(string) {
            var num, ans, x;
            num = Math.floor(string.length / 2);
            if (num * 2 !== string.length) {
                throw new ValueError("string length is not a multiple of two");
            }
            ans = new Uint8Array(num);
            for (var i = 0; i < num; i++) {
                x = parseInt(string.slice(i * 2, i * 2 + 2), 16);
                if (isNaN(x)) {
                    throw new ValueError("string is not hex-encoded");
                }
                ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = x;
            }
            return ans;
        };
        if (!unhexlify.__argnames__) Object.defineProperties(unhexlify, {
            __argnames__ : {value: ["string"]}
        });

        utf8_decoder_table = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 00..1f
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 20..3f
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 40..5f
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, // 60..7f
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9, // 80..9f
  7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7, // a0..bf
  8,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, // c0..df
  0xa,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x3,0x4,0x3,0x3, // e0..ef
  0xb,0x6,0x6,0x6,0x5,0x8,0x8,0x8,0x8,0x8,0x8,0x8,0x8,0x8,0x8,0x8, // f0..ff
  0x0,0x1,0x2,0x3,0x5,0x8,0x7,0x1,0x1,0x1,0x4,0x6,0x1,0x1,0x1,0x1, // s0..s0
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1, // s1..s2
  1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1, // s3..s4
  1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,3,1,1,1,1,1,1, // s5..s6
  1,3,1,1,1,1,1,3,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1, // s7..s8
];
        function _from_code_point(x) {
            if (x <= 65535) {
                return String.fromCharCode(x);
            }
            x -= 65536;
            return String.fromCharCode((x >> 10) + 55296, x % 1024 + 56320);
        };
        if (!_from_code_point.__argnames__) Object.defineProperties(_from_code_point, {
            __argnames__ : {value: ["x"]}
        });

        function utf8_decode(bytes, errors, replacement) {
            var state, ans, byte, typ, codep;
            state = 0;
            ans = [];
            for (var i = 0, l = bytes.length; i < l; i++) {
                byte = bytes[(typeof i === "number" && i < 0) ? bytes.length + i : i];
                typ = utf8_decoder_table[(typeof byte === "number" && byte < 0) ? utf8_decoder_table.length + byte : byte];
                codep = (state !== 0) ? byte & 63 | codep << 6 : 255 >> typ & byte;
                state = utf8_decoder_table[ρσ_bound_index(256 + state * 16 + typ, utf8_decoder_table)];
                if (state === 0) {
                    ans.push(_from_code_point(codep));
                } else if (state === 1) {
                    if (!errors || errors === "strict") {
                        throw new UnicodeDecodeError(str.format("The byte 0x{:02x} at position {} is not valid UTF-8", byte, i));
                    } else if (errors === "replace") {
                        ans.push(replacement || "?");
                    }
                }
            }
            return ans.join("");
        };
        if (!utf8_decode.__argnames__) Object.defineProperties(utf8_decode, {
            __argnames__ : {value: ["bytes", "errors", "replacement"]}
        });

        function utf8_encode_js(string) {
            var escstr, ans, ch, i;
            escstr = encodeURIComponent(string);
            ans = [];
            for (var i = 0; i < escstr.length; i++) {
                ch = escstr[(typeof i === "number" && i < 0) ? escstr.length + i : i];
                if (ch === "%") {
                    ans.push(parseInt(escstr.slice(i + 1, i + 3), 16));
                    i += 2;
                } else {
                    ans.push(ch.charCodeAt(0));
                }
            }
            return new Uint8Array(ans);
        };
        if (!utf8_encode_js.__argnames__) Object.defineProperties(utf8_encode_js, {
            __argnames__ : {value: ["string"]}
        });

        if (typeof TextEncoder === "function") {
            _u8enc = new TextEncoder("utf-8");
            utf8_encode = _u8enc.encode.bind(_u8enc);
            _u8enc = undefined;
        } else {
            utf8_encode = utf8_encode_js;
        }
        function utf8_encode_native(string) {
            return _u8enc.encode(string);
        };
        if (!utf8_encode_native.__argnames__) Object.defineProperties(utf8_encode_native, {
            __argnames__ : {value: ["string"]}
        });

        ρσ_modules.encodings.utf8_decoder_table = utf8_decoder_table;
        ρσ_modules.encodings._u8enc = _u8enc;
        ρσ_modules.encodings.utf8_encode = utf8_encode;
        ρσ_modules.encodings.base64encode = base64encode;
        ρσ_modules.encodings.base64decode = base64decode;
        ρσ_modules.encodings.urlsafe_b64encode = urlsafe_b64encode;
        ρσ_modules.encodings.urlsafe_b64decode = urlsafe_b64decode;
        ρσ_modules.encodings.hexlify = hexlify;
        ρσ_modules.encodings.unhexlify = unhexlify;
        ρσ_modules.encodings._from_code_point = _from_code_point;
        ρσ_modules.encodings.utf8_decode = utf8_decode;
        ρσ_modules.encodings.utf8_encode_js = utf8_encode_js;
        ρσ_modules.encodings.utf8_encode_native = utf8_encode_native;
    })();

    (function(){
        var __name__ = "uuid";
        var RFC_4122, random_bytes;
        var hexlify = ρσ_modules.encodings.hexlify;
        var urlsafe_b64decode = ρσ_modules.encodings.urlsafe_b64decode;
        var urlsafe_b64encode = ρσ_modules.encodings.urlsafe_b64encode;

        RFC_4122 = 1;
        if (typeof crypto === "object" && crypto.getRandomValues) {
            random_bytes = (function() {
                var ρσ_anonfunc = function (num) {
                    var ans;
                    ans = new Uint8Array(num || 16);
                    crypto.getRandomValues(ans);
                    return ans;
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["num"]}
                });
                return ρσ_anonfunc;
            })();
        } else {
            random_bytes = (function() {
                var ρσ_anonfunc = function (num) {
                    var ans, i;
                    ans = new Uint8Array(num || 16);
                    for (var ρσ_Index0 = 0; ρσ_Index0 < ans.length; ρσ_Index0++) {
                        i = ρσ_Index0;
                        ans[(typeof i === "number" && i < 0) ? ans.length + i : i] = Math.floor(Math.random() * 256);
                    }
                    return ans;
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["num"]}
                });
                return ρσ_anonfunc;
            })();
        }
        function uuid4_bytes() {
            var data;
            data = random_bytes();
            data[6] = 64 | data[6] & 15;
            data[8] = (data[8] >> 4 & 3 | 8) << 4 | data[8] & 15;
            return data;
        };

        function as_str() {
            var h;
            h = this.hex;
            return h.slice(0, 8) + "-" + h.slice(8, 12) + "-" + h.slice(12, 16) + "-" + h.slice(16, 20) + "-" + h.slice(20);
        };

        function uuid4() {
            var b;
            b = uuid4_bytes();
            return (function(){
                var ρσ_d = Object.create(null);
                ρσ_d["hex"] = hexlify(b);
                ρσ_d["bytes"] = b;
                ρσ_d["variant"] = RFC_4122;
                ρσ_d["version"] = 4;
                ρσ_d["__str__"] = as_str;
                ρσ_d["toString"] = as_str;
                return ρσ_d;
            }).call(this);
        };

        function num_to_string(numbers, alphabet, pad_to_length) {
            var ans, alphabet_len, x, number;
            ans = [];
            alphabet_len = alphabet.length;
            numbers = Array.prototype.slice.call(numbers);
            for (var i = 0; i < numbers.length - 1; i++) {
                x = divmod(numbers[(typeof i === "number" && i < 0) ? numbers.length + i : i], alphabet_len);
                numbers[(typeof i === "number" && i < 0) ? numbers.length + i : i] = x[0];
                numbers[ρσ_bound_index(i + 1, numbers)] += x[1];
            }
            for (var i = 0; i < numbers.length; i++) {
                number = numbers[(typeof i === "number" && i < 0) ? numbers.length + i : i];
                while (number) {
                    x = divmod(number, alphabet_len);
                    number = x[0];
                    ans.push(alphabet[ρσ_bound_index(x[1], alphabet)]);
                }
            }
            if (pad_to_length && pad_to_length > ans.length) {
                ans.push(alphabet[0].repeat(pad_to_length - ans.length));
            }
            return ans.join("");
        };
        if (!num_to_string.__argnames__) Object.defineProperties(num_to_string, {
            __argnames__ : {value: ["numbers", "alphabet", "pad_to_length"]}
        });

        function short_uuid() {
            return urlsafe_b64encode(random_bytes(), "");
        };

        function short_uuid4() {
            return urlsafe_b64encode(uuid4_bytes(), "");
        };

        function decode_short_uuid(val) {
            return urlsafe_b64decode(val + "==");
        };
        if (!decode_short_uuid.__argnames__) Object.defineProperties(decode_short_uuid, {
            __argnames__ : {value: ["val"]}
        });

        ρσ_modules.uuid.RFC_4122 = RFC_4122;
        ρσ_modules.uuid.random_bytes = random_bytes;
        ρσ_modules.uuid.uuid4_bytes = uuid4_bytes;
        ρσ_modules.uuid.as_str = as_str;
        ρσ_modules.uuid.uuid4 = uuid4;
        ρσ_modules.uuid.num_to_string = num_to_string;
        ρσ_modules.uuid.short_uuid = short_uuid;
        ρσ_modules.uuid.short_uuid4 = short_uuid4;
        ρσ_modules.uuid.decode_short_uuid = decode_short_uuid;
    })();

    (function(){
        var __name__ = "dndbeyond";
        var ability_abbreviations, skill_abilities, last_character_used, button_class, button_class_small, key_modifiers, checkKeyModifiers, resetKeyModifiers;
        var replaceRolls = ρσ_modules.utils.replaceRolls;
        var cleanRoll = ρσ_modules.utils.cleanRoll;
        var alertQuickSettings = ρσ_modules.utils.alertQuickSettings;
        var isListEqual = ρσ_modules.utils.isListEqual;
        var isObjectEqual = ρσ_modules.utils.isObjectEqual;

        var getStoredSettings = ρσ_modules.settings.getStoredSettings;
        var mergeSettings = ρσ_modules.settings.mergeSettings;
        var character_settings = ρσ_modules.settings.character_settings;
        var WhisperType = ρσ_modules.settings.WhisperType;
        var RollType = ρσ_modules.settings.RollType;
        var CriticalRules = ρσ_modules.settings.CriticalRules;

        var dndbeyondDiceRoller = ρσ_modules.dndbeyond_dice.dndbeyondDiceRoller;

        var E = ρσ_modules.elementmaker.E;

        var uuid = ρσ_modules.uuid;

        var re = ρσ_modules.re;

        ability_abbreviations = (function(){
            var ρσ_d = {};
            ρσ_d["Strength"] = "STR";
            ρσ_d["Dexterity"] = "DEX";
            ρσ_d["Constitution"] = "CON";
            ρσ_d["Intelligence"] = "INT";
            ρσ_d["Wisdom"] = "WIS";
            ρσ_d["Charisma"] = "CHA";
            return ρσ_d;
        }).call(this);
        skill_abilities = (function(){
            var ρσ_d = {};
            ρσ_d["Acrobatics"] = "DEX";
            ρσ_d["Animal Handling"] = "WIS";
            ρσ_d["Arcana"] = "INT";
            ρσ_d["Athletics"] = "STR";
            ρσ_d["Deception"] = "CHA";
            ρσ_d["History"] = "INT";
            ρσ_d["Insight"] = "WIS";
            ρσ_d["Intimidation"] = "CHA";
            ρσ_d["Investigation"] = "INT";
            ρσ_d["Medicine"] = "WIS";
            ρσ_d["Nature"] = "INT";
            ρσ_d["Perception"] = "WIS";
            ρσ_d["Performance"] = "CHA";
            ρσ_d["Persuasion"] = "CHA";
            ρσ_d["Religion"] = "INT";
            ρσ_d["Sleight of Hand"] = "DEX";
            ρσ_d["Stealth"] = "DEX";
            ρσ_d["Survival"] = "WIS";
            return ρσ_d;
        }).call(this);
        function Spell() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Spell.prototype.__init__.apply(this, arguments);
        }
        Spell.prototype.__init__ = function __init__() {
            var self = this;
            var body = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var character = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var type = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? __init__.__defaults__.type : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "type")){
                type = ρσ_kwargs_obj.type;
            }
            var title_selector, statblock_selector, description_selector, casting_time_label, range_area_label, level, school, materials, material_len, aoe, aoe_len;
            self._character = character;
            if ((type === "page" || typeof type === "object" && ρσ_equals(type, "page"))) {
                title_selector = ".page-title";
                statblock_selector = ".ddb-statblock";
                description_selector = ".spell-details .more-info-content";
                casting_time_label = "casting-time";
                range_area_label = "range-area";
            } else if ((type === "tooltip" || typeof type === "object" && ρσ_equals(type, "tooltip"))) {
                title_selector = ".tooltip-header-text";
                statblock_selector = ".tooltip-body-statblock";
                description_selector = ".tooltip-body-description-text";
                casting_time_label = "castingtime";
                range_area_label = "range";
            }
            function get_statblock(label) {
                return body.find(statblock_selector + "-item-" + label + " " + statblock_selector + "-item-value").text().trim();
            };
            if (!get_statblock.__argnames__) Object.defineProperties(get_statblock, {
                __argnames__ : {value: ["label"]}
            });

            self.spell_name = body.find(title_selector).text().trim();
            level = get_statblock("level");
            school = get_statblock("school");
            self.casting_time = get_statblock(casting_time_label);
            self.range_area = get_statblock(range_area_label);
            self.components = get_statblock("components");
            self.duration = get_statblock("duration");
            self.description = body.find(description_selector).text().trim();
            self.preview = "https://www.dndbeyond.com/content/1-0-851-0/skins/waterdeep/images/spell-schools/35/" + school.toLowerCase() + ".png";
            if ((level === "Cantrip" || typeof level === "object" && ρσ_equals(level, "Cantrip"))) {
                self.level_school = school + " " + level;
            } else {
                self.level_school = level + " Level " + school;
            }
            if (self.duration.startsWith("Concentration")) {
                self.concentration = true;
                self.duration = self.duration.replace("Concentration", "").trim();
            } else {
                self.concentration = false;
            }
            self.ritual = body.find(statblock_selector + "-item-casting-time .i-ritual").length > 0;
            if (((ρσ_expr_temp = self.components)[ρσ_expr_temp.length-1] === "*" || typeof (ρσ_expr_temp = self.components)[ρσ_expr_temp.length-1] === "object" && ρσ_equals((ρσ_expr_temp = self.components)[ρσ_expr_temp.length-1], "*"))) {
                materials = body.find(description_selector + " .components-blurb").text().trim();
                material_len = len(materials);
                self.description = self.description.slice(0, -material_len).trim();
                self.components = self.components.slice(0, -2) + materials.slice(4);
            }
            aoe = body.find(statblock_selector + "-item-range-area .aoe-size").text().trim();
            if ((aoe !== "" && (typeof aoe !== "object" || ρσ_not_equals(aoe, "")))) {
                aoe_len = len(aoe);
                self.range_area = self.range_area.slice(0, -aoe_len).trim() + " " + aoe.trim();
            }
        };
        if (!Spell.prototype.__init__.__defaults__) Object.defineProperties(Spell.prototype.__init__, {
            __defaults__ : {value: {type:"page"}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["body", "character", "type"]}
        });
        Spell.__argnames__ = Spell.prototype.__init__.__argnames__;
        Spell.__handles_kwarg_interpolation__ = Spell.prototype.__init__.__handles_kwarg_interpolation__;
        Spell.prototype.display = function display() {
            var self = this;
            sendRoll(self._character, "spell-card", 0, (function(){
                var ρσ_d = {};
                ρσ_d["name"] = self.spell_name;
                ρσ_d["preview"] = self.preview;
                ρσ_d["level-school"] = self.level_school;
                ρσ_d["range"] = self.range_area;
                ρσ_d["concentration"] = self.concentration;
                ρσ_d["duration"] = self.duration;
                ρσ_d["casting-time"] = self.casting_time;
                ρσ_d["components"] = self.components;
                ρσ_d["ritual"] = self.ritual;
                ρσ_d["description"] = self.description;
                return ρσ_d;
            }).call(this));
        };
        Spell.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Spell.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(Spell.prototype, "__bases__", {value: []});

        function CharacterBase() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            CharacterBase.prototype.__init__.apply(this, arguments);
        }
        CharacterBase.prototype.__init__ = function __init__(_type, global_settings) {
            var self = this;
            self._name = null;
            self._type = _type;
            self._settings = null;
            self._url = window.location.href;
            self.setGlobalSettings(global_settings);
        };
        if (!CharacterBase.prototype.__init__.__argnames__) Object.defineProperties(CharacterBase.prototype.__init__, {
            __argnames__ : {value: ["_type", "global_settings"]}
        });
        CharacterBase.__argnames__ = CharacterBase.prototype.__init__.__argnames__;
        CharacterBase.__handles_kwarg_interpolation__ = CharacterBase.prototype.__init__.__handles_kwarg_interpolation__;
        CharacterBase.prototype.type = function type() {
            var self = this;
            return self._type;
        };
        CharacterBase.prototype.getSetting = function getSetting() {
            var self = this;
            var key = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var default_value = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getSetting.__defaults__.default_value : arguments[1];
            var settings = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getSetting.__defaults__.settings : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "default_value")){
                default_value = ρσ_kwargs_obj.default_value;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "settings")){
                settings = ρσ_kwargs_obj.settings;
            }
            if (settings === null) {
                settings = self._settings;
            }
            if ((typeof settings !== "undefined" && settings !== null) && ρσ_exists.n(settings[(typeof key === "number" && key < 0) ? settings.length + key : key])) {
                return settings[(typeof key === "number" && key < 0) ? settings.length + key : key];
            }
            return default_value;
        };
        if (!CharacterBase.prototype.getSetting.__defaults__) Object.defineProperties(CharacterBase.prototype.getSetting, {
            __defaults__ : {value: {default_value:"", settings:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["key", "default_value", "settings"]}
        });
        CharacterBase.prototype.getGlobalSetting = function getGlobalSetting() {
            var self = this;
            var key = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var default_value = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? getGlobalSetting.__defaults__.default_value : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "default_value")){
                default_value = ρσ_kwargs_obj.default_value;
            }
            return self.getSetting(key, default_value, self._global_settings);
        };
        if (!CharacterBase.prototype.getGlobalSetting.__defaults__) Object.defineProperties(CharacterBase.prototype.getGlobalSetting, {
            __defaults__ : {value: {default_value:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["key", "default_value"]}
        });
        CharacterBase.prototype.setGlobalSettings = function setGlobalSettings(new_settings) {
            var self = this;
            self._global_settings = new_settings;
            dndbeyondDiceRoller.setSettings(new_settings);
            updateRollTypeButtonClasses(self);
        };
        if (!CharacterBase.prototype.setGlobalSettings.__argnames__) Object.defineProperties(CharacterBase.prototype.setGlobalSettings, {
            __argnames__ : {value: ["new_settings"]}
        });
        CharacterBase.prototype.getDict = function getDict() {
            var self = this;
            return (function(){
                var ρσ_d = {};
                ρσ_d["name"] = self._name;
                ρσ_d["type"] = self._type;
                ρσ_d["url"] = self._url;
                return ρσ_d;
            }).call(this);
        };
        CharacterBase.prototype.__repr__ = function __repr__ () {
                        return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        CharacterBase.prototype.__str__ = function __str__ () {
            return this.__repr__();
        };
        Object.defineProperty(CharacterBase.prototype, "__bases__", {value: []});

        function Character() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Character.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(Character, CharacterBase);
        Character.prototype.__init__ = function __init__(global_settings) {
            var self = this;
            CharacterBase.prototype.__init__.call(self, "Character", global_settings);
            self._abilities = ρσ_list_decorate([]);
            self._name = null;
            self._avatar = null;
            self._id = null;
            self._race = null;
            self._level = null;
            self._classes = null;
            self._ac = null;
            self._speed = null;
            self._proficiency = null;
            self._hp = 0;
            self._max_hp = 0;
            self._temp_hp = 0;
            self._class_features = ρσ_list_decorate([]);
            self._racial_traits = ρσ_list_decorate([]);
            self._feats = ρσ_list_decorate([]);
            self._actions = ρσ_list_decorate([]);
            self._spell_modifiers = {};
            self._spell_attacks = {};
            self._spell_saves = {};
            self._to_hit_cache = {};
            self._conditions = ρσ_list_decorate([]);
            self._exhaustion = 0;
        };
        if (!Character.prototype.__init__.__argnames__) Object.defineProperties(Character.prototype.__init__, {
            __argnames__ : {value: ["global_settings"]}
        });
        Character.__argnames__ = Character.prototype.__init__.__argnames__;
        Character.__handles_kwarg_interpolation__ = Character.prototype.__init__.__handles_kwarg_interpolation__;
        Character.prototype.updateInfo = function updateInfo() {
            var self = this;
            var avatar, classes, parts, name, level, class_, xp, items, item_name, to_hit, item, ac, speed, abilities, abbr, modifier, value, ability;
            self._id = $("#character-sheet-target,#character-tools-target").attr("data-character-id");
            self._url = window.location.href;
            if (self._settings === null) {
                self.updateSettings();
            }
            if (self._name === null) {
                self._name = $(".ct-character-tidbits__name,.ddbc-character-tidbits__name").text();
                if ((self._name === "" || typeof self._name === "object" && ρσ_equals(self._name, ""))) {
                    self._name = null;
                }
            }
            if (self._avatar === null) {
                avatar = $(".ct-character-tidbits__avatar,.ddbc-character-tidbits__avatar").css("background-image");
                if (avatar && avatar.startsWith("url(")) {
                    self._avatar = avatar.slice(5, -2);
                }
            }
            if (self._race === null) {
                self._race = $(".ct-character-tidbits__race,.ddbc-character-tidbits__race").text();
                if ((self._race === "" || typeof self._race === "object" && ρσ_equals(self._race, ""))) {
                    self._race = null;
                }
            }
            if (self._classes === null) {
                classes = $(".ct-character-tidbits__classes,.ddbc-character-tidbits__classes");
                if (classes.length > 0) {
                    classes = classes.text().split(" / ");
                    self._classes = {};
                    var ρσ_Iter0 = ρσ_Iterable(classes);
                    for (var ρσ_Index0 = 0; ρσ_Index0 < ρσ_Iter0.length; ρσ_Index0++) {
                        class_ = ρσ_Iter0[ρσ_Index0];
                        parts = class_.split(" ");
                        name = str.join(" ", parts.slice(0, -1));
                        level = parts[parts.length-1];
                        (ρσ_expr_temp = self._classes)[(typeof name === "number" && name < 0) ? ρσ_expr_temp.length + name : name] = level;
                    }
                }
            }
            if (self._level === null) {
                level = $(".ct-character-tidbits__xp-level,.ddbc-character-tidbits__xp-level");
                xp = $(".ct-character-tidbits__xp-bar .ct-xp-bar__item--cur .ct-xp-bar__label,.ddbc-character-tidbits__xp-bar .ddbc-xp-bar__item--cur .ddbc-xp-bar__label");
                if (level.length > 0) {
                    self._level = level.text().replace("Level ", "");
                } else if (xp.length > 0) {
                    self._level = xp.text().replace("LVL ", "");
                }
            }
            if (self._proficiency === null) {
                self._proficiency = $(".ct-proficiency-bonus-box__value,.ddbc-proficiency-bonus-box__value").text();
                if ((self._proficiency === "" || typeof self._proficiency === "object" && ρσ_equals(self._proficiency, ""))) {
                    self._proficiency = $(".ct-combat-mobile__extra--proficiency .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--proficiency .ddbc-combat-mobile__extra-value").text();
                    if ((self._proficiency === "" || typeof self._proficiency === "object" && ρσ_equals(self._proficiency, ""))) {
                        self._proficiency = null;
                    }
                }
            }
            if ((Object.keys(self._to_hit_cache).length === 0 || typeof Object.keys(self._to_hit_cache).length === "object" && ρσ_equals(Object.keys(self._to_hit_cache).length, 0))) {
                items = $(".ct-combat-attack--item .ct-item-name,.ddbc-combat-attack--item .ddbc-item-name");
                var ρσ_Iter1 = ρσ_Iterable(items);
                for (var ρσ_Index1 = 0; ρσ_Index1 < ρσ_Iter1.length; ρσ_Index1++) {
                    item = ρσ_Iter1[ρσ_Index1];
                    item_name = item.textContent;
                    to_hit = findToHit(item_name, ".ct-combat-attack--item,.ddbc-combat-attack--item", ".ct-item-name,.ddbc-item-name", ".ct-combat-attack__tohit,.ddbc-combat-attack__tohit");
                    (ρσ_expr_temp = self._to_hit_cache)[(typeof item_name === "number" && item_name < 0) ? ρσ_expr_temp.length + item_name : item_name] = to_hit;
                }
            }
            ac = $(".ct-armor-class-box__value,.ddbc-armor-class-box__value").text();
            if ((ac === "" || typeof ac === "object" && ρσ_equals(ac, ""))) {
                ac = $(".ct-combat-mobile__extra--ac .ct-combat-mobile__extra-value,.ddbc-combat-mobile__extra--ac .ddbc-combat-mobile__extra-value").text();
            }
            if ((ac !== "" && (typeof ac !== "object" || ρσ_not_equals(ac, "")))) {
                self._ac = ac;
            }
            speed = $(".ct-speed-box__box-value .ct-distance-number__number,.ddbc-speed-box__box-value .ddbc-distance-number__number").text();
            if ((speed === "" || typeof speed === "object" && ρσ_equals(speed, ""))) {
                speed = $(".ct-combat-mobile__extra--speed .ct-combat-mobile__extra-value .ct-distance-number__number,.ddbc-combat-mobile__extra--speed .ddbc-combat-mobile__extra-value .ddbc-distance-number__number").text();
            }
            if ((speed !== "" && (typeof speed !== "object" || ρσ_not_equals(speed, "")))) {
                self._speed = speed;
            }
            abilities = $(".ct-quick-info__ability,.ddbc-quick-info__ability");
            if ((abilities.length === 0 || typeof abilities.length === "object" && ρσ_equals(abilities.length, 0))) {
                abilities = $(".ct-main-mobile__ability,.ddbc-main-mobile__ability");
            }
            if ((abilities.length === 0 || typeof abilities.length === "object" && ρσ_equals(abilities.length, 0))) {
                abilities = $(".ct-main-tablet__ability,.ddbc-main-tablet__ability");
            }
            if (abilities.length > 0) {
                self._abilities = ρσ_list_decorate([]);
            }
            var ρσ_Iter2 = ρσ_Iterable(abilities);
            for (var ρσ_Index2 = 0; ρσ_Index2 < ρσ_Iter2.length; ρσ_Index2++) {
                ability = ρσ_Iter2[ρσ_Index2];
                name = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__label,.ddbc-ability-summary__heading .ddbc-ability-summary__label").text();
                abbr = $(ability).find(".ct-ability-summary__heading .ct-ability-summary__abbr,.ddbc-ability-summary__heading .ddbc-ability-summary__abbr").text().toUpperCase();
                modifier = $(ability).find(".ct-ability-summary__primary .ct-signed-number,.ddbc-ability-summary__primary .ddbc-signed-number").text();
                value = $(ability).find(".ct-ability-summary__secondary,.ddbc-ability-summary__secondary").text();
                if ((modifier === "" || typeof modifier === "object" && ρσ_equals(modifier, ""))) {
                    modifier = $(ability).find(".ct-ability-summary__secondary .ct-signed-number,.ddbc-ability-summary__secondary .ddbc-signed-number").text();
                    value = $(ability).find(".ct-ability-summary__primary,.ddbc-ability-summary__primary").text();
                }
                self._abilities.append(ρσ_list_decorate([ name, abbr, value, modifier ]).as_array());
            }
            if (ρσ_exists.n(self._settings)) {
                self.updateHP();
            }
            self.updateFeatures();
        };
        Character.prototype.updateHP = function updateHP() {
            var self = this;
            var health_pane, hp, max_hp, temp_hp, hp_items, label, number, item, temp_item, mobile_hp, has_temp, req;
            health_pane = $(".ct-health-manager");
            if (health_pane.length > 0) {
                hp = int(health_pane.find(".ct-health-manager__health-item--cur .ct-health-manager__health-item-value").text());
                max_hp = int(health_pane.find(".ct-health-manager__health-item--max .ct-health-manager__health-item-value .ct-health-manager__health-max-current").text());
                temp_hp = int(health_pane.find(".ct-health-manager__health-item--temp .ct-health-manager__health-item-value input").val());
            } else {
                hp = max_hp = temp_hp = null;
                hp_items = $(".ct-health-summary__hp-group--primary .ct-health-summary__hp-item");
                var ρσ_Iter3 = ρσ_Iterable(hp_items);
                for (var ρσ_Index3 = 0; ρσ_Index3 < ρσ_Iter3.length; ρσ_Index3++) {
                    item = ρσ_Iter3[ρσ_Index3];
                    label = $(item).find(".ct-health-summary__hp-item-label").text();
                    if ((label === "Current" || typeof label === "object" && ρσ_equals(label, "Current"))) {
                        number = $(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number");
                        if (number.length > 0) {
                            hp = int(number.text());
                        }
                    } else if ((label === "Max" || typeof label === "object" && ρσ_equals(label, "Max"))) {
                        max_hp = int($(item).find(".ct-health-summary__hp-item-content .ct-health-summary__hp-number").text());
                    }
                }
                temp_item = $(".ct-health-summary__hp-group--temp .ct-health-summary__hp-item--temp .ct-health-summary__hp-item-content");
                if (temp_item.length > 0) {
                    number = temp_item.find(".ct-health-summary__hp-number").text();
                    temp_hp = ((number !== "" && (typeof number !== "object" || ρσ_not_equals(number, "")))) ? int(number) : 0;
                } else {
                    temp_hp = self._temp_hp;
                }
                mobile_hp = $(".ct-status-summary-mobile__hp-current");
                if (mobile_hp.length > 0) {
                    hp = int(mobile_hp.text());
                    max_hp = int($(".ct-status-summary-mobile__hp-max").text());
                    has_temp = $(".ct-status-summary-mobile__hp.ct-status-summary-mobile__hp--has-temp");
                    if (has_temp.length > 0) {
                        temp_hp = self._temp_hp;
                    } else {
                        temp_hp = 0;
                    }
                    hp = hp - temp_hp;
                }
                if ($(".ct-status-summary-mobile__deathsaves-group").length > 0 || $(".ct-health-summary__deathsaves").length > 0) {
                    hp = 0;
                    temp_hp = 0;
                    max_hp = self._max_hp;
                }
            }
            if (hp !== null && max_hp !== null && ((self._hp !== hp && (typeof self._hp !== "object" || ρσ_not_equals(self._hp, hp))) || (self._max_hp !== max_hp && (typeof self._max_hp !== "object" || ρσ_not_equals(self._max_hp, max_hp))) || (self._temp_hp !== temp_hp && (typeof self._temp_hp !== "object" || ρσ_not_equals(self._temp_hp, temp_hp))))) {
                self._hp = hp;
                self._max_hp = max_hp;
                self._temp_hp = temp_hp;
                print("HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);
                if (self.getGlobalSetting("update-hp", true)) {
                    req = (function(){
                        var ρσ_d = {};
                        ρσ_d["action"] = "hp-update";
                        ρσ_d["character"] = self.getDict();
                        return ρσ_d;
                    }).call(this);
                    console.log("Sending message: ", req);
                    chrome.runtime.sendMessage(req, (function() {
                        var ρσ_anonfunc = function (resp) {
                            beyond20SendMessageFailure(self, resp);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resp"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
            }
        };
        Character.prototype.updateConditions = function updateConditions() {
            var self = this;
            var conditions = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? updateConditions.__defaults__.conditions : arguments[0];
            var exhaustion_level = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? updateConditions.__defaults__.exhaustion_level : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "conditions")){
                conditions = ρσ_kwargs_obj.conditions;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "exhaustion_level")){
                exhaustion_level = ρσ_kwargs_obj.exhaustion_level;
            }
            var sendUpdate;
            if (conditions === null) {
                conditions = list(self.getSetting("conditions", ρσ_list_decorate([])));
            }
            if (exhaustion_level === null) {
                exhaustion_level = self.getSetting("exhaustion-level", 0);
            }
            self._conditions = conditions;
            self._exhaustion = exhaustion_level;
            if (ρσ_exists.n(self._settings) && (!isListEqual(self._conditions, self.getSetting("conditions", ρσ_list_decorate([]))) || ρσ_not_equals(self._exhaustion, self.getSetting("exhaustion-level", 0)))) {
                sendUpdate = function () {
                    var req;
                    req = (function(){
                        var ρσ_d = {};
                        ρσ_d["action"] = "conditions-update";
                        ρσ_d["character"] = self.getDict();
                        return ρσ_d;
                    }).call(this);
                    console.log("Sending message: ", req);
                    chrome.runtime.sendMessage(req, (function() {
                        var ρσ_anonfunc = function (resp) {
                            beyond20SendMessageFailure(self, resp);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resp"]}
                        });
                        return ρσ_anonfunc;
                    })());
                };
                self.mergeCharacterSettings((function(){
                    var ρσ_d = {};
                    ρσ_d["conditions"] = self._conditions;
                    ρσ_d["exhaustion-level"] = self._exhaustion;
                    return ρσ_d;
                }).call(this), sendUpdate);
            }
        };
        if (!Character.prototype.updateConditions.__defaults__) Object.defineProperties(Character.prototype.updateConditions, {
            __defaults__ : {value: {conditions:null, exhaustion_level:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["conditions", "exhaustion_level"]}
        });
        Character.prototype.featureDetailsToList = function featureDetailsToList(selector, name) {
            var self = this;
            var features, feature_list, feat_name, options, option_name, option, feat;
            features = $(selector).find(".ct-feature-snippet > .ct-feature-snippet__heading");
            feature_list = ρσ_list_decorate([]);
            var ρσ_Iter4 = ρσ_Iterable(features);
            for (var ρσ_Index4 = 0; ρσ_Index4 < ρσ_Iter4.length; ρσ_Index4++) {
                feat = ρσ_Iter4[ρσ_Index4];
                feat_name = feat.childNodes[0].textContent.trim();
                feature_list.append(feat_name);
                options = $(feat).parent().find(".ct-feature-snippet__option > .ct-feature-snippet__heading");
                var ρσ_Iter5 = ρσ_Iterable(options);
                for (var ρσ_Index5 = 0; ρσ_Index5 < ρσ_Iter5.length; ρσ_Index5++) {
                    option = ρσ_Iter5[ρσ_Index5];
                    option_name = option.childNodes[0].textContent.trim();
                    feature_list.append(feat_name + ": " + option_name);
                }
            }
            return feature_list;
        };
        if (!Character.prototype.featureDetailsToList.__argnames__) Object.defineProperties(Character.prototype.featureDetailsToList, {
            __argnames__ : {value: ["selector", "name"]}
        });
        Character.prototype.updateFeatures = function updateFeatures() {
            var self = this;
            var update, class_detail, race_detail, feats_detail, actions_detail, spell_info_groups, label, items, obj, modifier, char_classes, char_class, item, group;
            update = false;
            class_detail = $(".ct-features .ct-classes-detail");
            if (class_detail.length > 0) {
                self._class_features = self.featureDetailsToList(class_detail, "Class Features");
                if (!isListEqual(self._class_features, self.getSetting("class-features", ρσ_list_decorate([])))) {
                    console.log("New class feature");
                    update = true;
                }
            } else {
                self._class_features = list(self.getSetting("class-features", ρσ_list_decorate([])));
            }
            race_detail = $(".ct-features .ct-race-detail");
            if (race_detail.length > 0) {
                self._racial_traits = self.featureDetailsToList(race_detail, "Racial Traits");
                if (!isListEqual(self._racial_traits, self.getSetting("racial-traits", ρσ_list_decorate([])))) {
                    console.log("New race feature");
                    update = true;
                }
            } else {
                self._racial_traits = list(self.getSetting("racial-traits", ρσ_list_decorate([])));
            }
            feats_detail = $(".ct-features .ct-feats-detail");
            if (feats_detail.length > 0) {
                self._feats = self.featureDetailsToList(feats_detail, "Feats");
                if (!isListEqual(self._feats, self.getSetting("feats", ρσ_list_decorate([])))) {
                    console.log("New Feats");
                    update = true;
                }
            } else {
                self._feats = list(self.getSetting("feats", ρσ_list_decorate([])));
            }
            actions_detail = $(".ct-actions-list .ct-actions-list__activatable");
            if (actions_detail.length > 0) {
                self._actions = self.featureDetailsToList(actions_detail, "Actions");
                if (!isListEqual(self._actions, self.getSetting("actions", ρσ_list_decorate([])))) {
                    console.log("New Actions");
                    update = true;
                }
            } else if (self.getSetting("actions", null)) {
                self._actions = list(self.getSetting("actions", ρσ_list_decorate([])));
            }
            spell_info_groups = $(".ct-spells-level-casting__info-group,.ddbc-spells-level-casting__info-group");
            if (spell_info_groups.length > 0) {
                self._spell_modifiers = {};
                self._spell_attacks = {};
                self._spell_saves = {};
                var ρσ_Iter6 = ρσ_Iterable(spell_info_groups);
                for (var ρσ_Index6 = 0; ρσ_Index6 < ρσ_Iter6.length; ρσ_Index6++) {
                    group = ρσ_Iter6[ρσ_Index6];
                    label = $(group).find(".ct-spells-level-casting__info-label,.ddbc-spells-level-casting__info-label");
                    items = $(group).find(".ct-spells-level-casting__info-item,.ddbc-spells-level-casting__info-item");
                    obj = null;
                    if (ρσ_equals(label.text(), "Modifier")) {
                        obj = self._spell_modifiers;
                    } else if (ρσ_equals(label.text(), "Spell Attack")) {
                        obj = self._spell_attacks;
                    } else if (ρσ_equals(label.text(), "Save DC")) {
                        obj = self._spell_saves;
                    }
                    if (obj === null) {
                        continue;
                    }
                    var ρσ_Iter7 = ρσ_Iterable(items);
                    for (var ρσ_Index7 = 0; ρσ_Index7 < ρσ_Iter7.length; ρσ_Index7++) {
                        item = ρσ_Iter7[ρσ_Index7];
                        modifier = item.textContent;
                        char_classes = item.getAttribute("data-original-title").split(",");
                        var ρσ_Iter8 = ρσ_Iterable(char_classes);
                        for (var ρσ_Index8 = 0; ρσ_Index8 < ρσ_Iter8.length; ρσ_Index8++) {
                            char_class = ρσ_Iter8[ρσ_Index8];
                            obj[ρσ_bound_index(char_class.trim(), obj)] = modifier;
                        }
                    }
                }
                if (!isObjectEqual(self._spell_modifiers, self.getSetting("spell_modifiers", {})) || !isObjectEqual(self._spell_attacks, self.getSetting("spell_attacks", {})) || !isObjectEqual(self._spell_saves, self.getSetting("spell_saves", {}))) {
                    console.log("New Spell information");
                    update = true;
                }
            } else {
                self._spell_modifiers = self.getSetting("spell_modifiers", {});
                self._spell_saves = self.getSetting("spell_saves", {});
                self._spell_attacks = self.getSetting("spell_attacks", {});
            }
            if (ρσ_exists.n(self._settings) && update) {
                self.mergeCharacterSettings((function(){
                    var ρσ_d = {};
                    ρσ_d["class-features"] = self._class_features;
                    ρσ_d["racial-traits"] = self._racial_traits;
                    ρσ_d["feats"] = self._feats;
                    ρσ_d["actions"] = self._actions;
                    ρσ_d["spell_modifiers"] = self._spell_modifiers;
                    ρσ_d["spell_saves"] = self._spell_saves;
                    ρσ_d["spell_attacks"] = self._spell_attacks;
                    return ρσ_d;
                }).call(this));
            }
        };
        Character.prototype.hasClassFeature = function hasClassFeature(name) {
            var self = this;
            return ρσ_in(name, self._class_features);
        };
        if (!Character.prototype.hasClassFeature.__argnames__) Object.defineProperties(Character.prototype.hasClassFeature, {
            __argnames__ : {value: ["name"]}
        });
        Character.prototype.hasRacialTrait = function hasRacialTrait(name) {
            var self = this;
            return ρσ_in(name, self._racial_traits);
        };
        if (!Character.prototype.hasRacialTrait.__argnames__) Object.defineProperties(Character.prototype.hasRacialTrait, {
            __argnames__ : {value: ["name"]}
        });
        Character.prototype.hasFeat = function hasFeat(name) {
            var self = this;
            return ρσ_in(name, self._feats);
        };
        if (!Character.prototype.hasFeat.__argnames__) Object.defineProperties(Character.prototype.hasFeat, {
            __argnames__ : {value: ["name"]}
        });
        Character.prototype.hasAction = function hasAction(name) {
            var self = this;
            return ρσ_in(name, self._actions);
        };
        if (!Character.prototype.hasAction.__argnames__) Object.defineProperties(Character.prototype.hasAction, {
            __argnames__ : {value: ["name"]}
        });
        Character.prototype.getClassLevel = function getClassLevel(name) {
            var self = this;
            if (ρσ_in(name, self._classes)) {
                return (ρσ_expr_temp = self._classes)[(typeof name === "number" && name < 0) ? ρσ_expr_temp.length + name : name];
            } else {
                return 0;
            }
        };
        if (!Character.prototype.getClassLevel.__argnames__) Object.defineProperties(Character.prototype.getClassLevel, {
            __argnames__ : {value: ["name"]}
        });
        Character.prototype._cacheToHit = function _cacheToHit(item_name, to_hit) {
            var self = this;
            (ρσ_expr_temp = self._to_hit_cache)[(typeof item_name === "number" && item_name < 0) ? ρσ_expr_temp.length + item_name : item_name] = to_hit;
        };
        if (!Character.prototype._cacheToHit.__argnames__) Object.defineProperties(Character.prototype._cacheToHit, {
            __argnames__ : {value: ["item_name", "to_hit"]}
        });
        Character.prototype._getToHitCache = function _getToHitCache(item_name) {
            var self = this;
            if (ρσ_exists.n((ρσ_expr_temp = self._to_hit_cache)[(typeof item_name === "number" && item_name < 0) ? ρσ_expr_temp.length + item_name : item_name])) {
                return (ρσ_expr_temp = self._to_hit_cache)[(typeof item_name === "number" && item_name < 0) ? ρσ_expr_temp.length + item_name : item_name];
            }
            return null;
        };
        if (!Character.prototype._getToHitCache.__argnames__) Object.defineProperties(Character.prototype._getToHitCache, {
            __argnames__ : {value: ["item_name"]}
        });
        Character.prototype.mergeCharacterSettings = function mergeCharacterSettings() {
            var self = this;
            var data = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var callback = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? mergeCharacterSettings.__defaults__.callback : arguments[1];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "callback")){
                callback = ρσ_kwargs_obj.callback;
            }
            var cb;
            cb = (function() {
                var ρσ_anonfunc = function (settings) {
                    self.updateSettings(settings);
                    chrome.runtime.sendMessage((function(){
                        var ρσ_d = {};
                        ρσ_d["action"] = "settings";
                        ρσ_d["type"] = "character";
                        ρσ_d["id"] = self._id;
                        ρσ_d["settings"] = settings;
                        return ρσ_d;
                    }).call(this));
                    if (callback) {
                        callback(settings);
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["settings"]}
                });
                return ρσ_anonfunc;
            })();
            mergeSettings(data, cb, "character-" + self._id, character_settings);
        };
        if (!Character.prototype.mergeCharacterSettings.__defaults__) Object.defineProperties(Character.prototype.mergeCharacterSettings, {
            __defaults__ : {value: {callback:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["data", "callback"]}
        });
        Character.prototype.updateSettings = function updateSettings() {
            var self = this;
            var new_settings = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? updateSettings.__defaults__.new_settings : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "new_settings")){
                new_settings = ρσ_kwargs_obj.new_settings;
            }
            if (new_settings) {
                self._settings = new_settings;
            } else {
                getStoredSettings((function() {
                    var ρσ_anonfunc = function (saved_settings) {
                        self.updateSettings(saved_settings);
                        self.updateHP();
                        self.updateFeatures();
                        self.updateConditions();
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["saved_settings"]}
                    });
                    return ρσ_anonfunc;
                })(), "character-" + self._id, character_settings);
            }
        };
        if (!Character.prototype.updateSettings.__defaults__) Object.defineProperties(Character.prototype.updateSettings, {
            __defaults__ : {value: {new_settings:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["new_settings"]}
        });
        Character.prototype.getDict = function getDict() {
            var self = this;
            var settings, key;
            settings = {};
            var ρσ_Iter9 = ρσ_Iterable(self._settings);
            for (var ρσ_Index9 = 0; ρσ_Index9 < ρσ_Iter9.length; ρσ_Index9++) {
                key = ρσ_Iter9[ρσ_Index9];
                if (!ρσ_in(key, ρσ_list_decorate([ "class-features", "racial-traits", "feats", "actions", "spell_modifiers", "spell_saves", "spell_attacks", "conditions", "exhaustion-level" ]))) {
                    settings[(typeof key === "number" && key < 0) ? settings.length + key : key] = (ρσ_expr_temp = self._settings)[(typeof key === "number" && key < 0) ? ρσ_expr_temp.length + key : key];
                }
            }
            return (function(){
                var ρσ_d = {};
                ρσ_d["name"] = self._name;
                ρσ_d["avatar"] = self._avatar;
                ρσ_d["id"] = self._id;
                ρσ_d["type"] = self.type();
                ρσ_d["abilities"] = self._abilities.as_array();
                ρσ_d["classes"] = self._classes;
                ρσ_d["level"] = self._level;
                ρσ_d["race"] = self._race;
                ρσ_d["ac"] = self._ac;
                ρσ_d["proficiency"] = self._proficiency;
                ρσ_d["speed"] = self._speed;
                ρσ_d["hp"] = self._hp;
                ρσ_d["max-hp"] = self._max_hp;
                ρσ_d["temp-hp"] = self._temp_hp;
                ρσ_d["exhaustion"] = self._exhaustion;
                ρσ_d["conditions"] = self._conditions.as_array();
                ρσ_d["settings"] = settings;
                ρσ_d["class-features"] = self._class_features.as_array();
                ρσ_d["racial-traits"] = self._racial_traits.as_array();
                ρσ_d["feats"] = self._feats.as_array();
                ρσ_d["actions"] = self._actions.as_array();
                ρσ_d["spell_modifiers"] = self._spell_modifiers;
                ρσ_d["spell_saves"] = self._spell_saves;
                ρσ_d["spell_attacks"] = self._spell_attacks;
                ρσ_d["url"] = self._url;
                return ρσ_d;
            }).call(this);
        };
        Character.prototype.__repr__ = function __repr__ () {
            if(CharacterBase.prototype.__repr__) return CharacterBase.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Character.prototype.__str__ = function __str__ () {
            if(CharacterBase.prototype.__str__) return CharacterBase.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(Character.prototype, "__bases__", {value: [CharacterBase]});

        function Monster() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            Monster.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(Monster, CharacterBase);
        Monster.prototype.__init__ = function __init__() {
            var self = this;
            var _type = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var base = (arguments[1] === undefined || ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? __init__.__defaults__.base : arguments[1];
            var global_settings = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? __init__.__defaults__.global_settings : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "base")){
                base = ρσ_kwargs_obj.base;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "global_settings")){
                global_settings = ρσ_kwargs_obj.global_settings;
            }
            CharacterBase.prototype.__init__.call(self, _type, global_settings);
            if (ρσ_equals(self.type(), "Monster")) {
                self._base = ".mon-stat-block";
            } else if (ρσ_equals(self.type(), "Creature")) {
                self._base = ".ct-creature-block";
            } else if (ρσ_equals(self.type(), "Vehicle") || ρσ_equals(self.type(), "Extra-Vehicle")) {
                self._base = ".vehicle-stat-block";
            } else {
                self._base = ".mon-stat-block";
            }
            if (base) {
                self._base = base;
            }
            self._stat_block = $(self._base);
            self._id = null;
            self._name = null;
            self._avatar = null;
            self._meta = null;
            self._attributes = {};
            self._ac = null;
            self._hp = null;
            self._hp_formula = null;
            self._max_hp = 0;
            self._temp_hp = 0;
            self._speed = null;
            self._abilities = ρσ_list_decorate([]);
            self._tidbits = {};
            self._saves = {};
            self._skills = {};
            self._spells = {};
            self._cr = null;
        };
        if (!Monster.prototype.__init__.__defaults__) Object.defineProperties(Monster.prototype.__init__, {
            __defaults__ : {value: {base:null, global_settings:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["_type", "base", "global_settings"]}
        });
        Monster.__argnames__ = Monster.prototype.__init__.__argnames__;
        Monster.__handles_kwarg_interpolation__ = Monster.prototype.__init__.__handles_kwarg_interpolation__;
        Monster.prototype.parseStatBlock = function parseStatBlock() {
            var self = this;
            var stat_block = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? parseStatBlock.__defaults__.stat_block : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "stat_block")){
                stat_block = ρσ_kwargs_obj.stat_block;
            }
            var add_dice, inject_descriptions, base, quick_settings, link, avatar, avatarImg, attributes, label, value, cb, attr, abilities, prefix, makeCB, abbr, score, modifier, roll_initiative, initiative, ability, tidbits, data, saves, parts, mod, save, skills, name, skill, mon_skill, text, last, a, first, tidbit;
            add_dice = self.getGlobalSetting("handle-stat-blocks", true);
            inject_descriptions = self.getGlobalSetting("subst-dndbeyond-stat-blocks", true);
            base = self._base;
            if (stat_block === null) {
                stat_block = $(base);
            }
            self._stat_block = stat_block;
            if (ρσ_not_equals(self.type(), "Creature") && ρσ_not_equals(self.type(), "Extra-Vehicle")) {
                $(".ct-beyond20-settings-button").remove();
                quick_settings = ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({class_: "ct-beyond20-settings", src: chrome.extension.getURL("images/icons/icon32.png"), style: "vertical-align: top;"})]), ρσ_interpolate_kwargs.call(E, E.span, ["Beyond 20"].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-settings-button-label mon-stat-block__tidbit mon-stat-block__tidbit-label", style: "font-size: 28px; margin: 5px;"})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-settings-button", style: "background-color: rgba(0, 0, 0, 0.1)"})]));
                stat_block.find(base + "__header").prepend(quick_settings);
                $(quick_settings).on("click", (function() {
                    var ρσ_anonfunc = function (event) {
                        alertQuickSettings();
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["event"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
            self._name = stat_block.find(base + "__name").text().trim();
            link = stat_block.find(base + "__name-link");
            if (link.length > 0) {
                self._url = link.attr("href");
                self._id = link.attr("href").replace("/monsters/", "").replace("/vehicles/", "");
            } else {
                self._url = window.location.href;
                self._id = self._name;
            }
            self._meta = stat_block.find(base + "__meta").text().trim();
            avatar = $(".details-aside .image a");
            if (avatar.length > 0) {
                self._avatar = avatar[0].href;
                avatarImg = $(".details-aside .image");
                if (avatarImg) {
                    ρσ_interpolate_kwargs.call(this, addRollButton, [self, function () {
                        self.displayAvatar();
                    }, avatarImg].concat([ρσ_desugar_kwargs({small: true, image: true, text: "Display in VTT"})]));
                }
            }
            attributes = stat_block.find(base + "__attributes " + base + "__attribute");
            var ρσ_Iter10 = ρσ_Iterable(attributes);
            for (var ρσ_Index10 = 0; ρσ_Index10 < ρσ_Iter10.length; ρσ_Index10++) {
                attr = ρσ_Iter10[ρσ_Index10];
                label = $(attr).find(base + "__attribute-label").text().trim();
                value = $(attr).find(base + "__attribute-value").text().trim();
                if ((value === "" || typeof value === "object" && ρσ_equals(value, ""))) {
                    value = $(attr).find(base + "__attribute-data").text().trim();
                }
                if ((label === "Armor Class" || typeof label === "object" && ρσ_equals(label, "Armor Class"))) {
                    self._ac = $(attr).find(base + "__attribute-data-value").text().trim();
                } else if ((label === "Hit Points" || typeof label === "object" && ρσ_equals(label, "Hit Points"))) {
                    self._hp = $(attr).find(base + "__attribute-data-value").text().trim();
                    self._hp_formula = $(attr).find(base + "__attribute-data-extra").text().trim().slice(1, -1);
                    cb = function () {
                        self.rollHitPoints();
                    };
                    if (add_dice) {
                        addIconButton(cb, $(attr).find(base + "__attribute-data-extra"));
                    }
                } else if ((label === "Speed" || typeof label === "object" && ρσ_equals(label, "Speed"))) {
                    self._speed = value;
                }
                (ρσ_expr_temp = self._attributes)[(typeof label === "number" && label < 0) ? ρσ_expr_temp.length + label : label] = value;
            }
            abilities = stat_block.find(base + "__abilities");
            if (abilities.length > 0) {
                prefix = base + "__ability-";
                abilities = abilities.find("> div");
            } else {
                abilities = stat_block.find(".ability-block > div");
                prefix = ".ability-block__";
            }
            makeCB = (function() {
                var ρσ_anonfunc = function (a) {
                    return function () {
                        self.rollAbilityCheck(a);
                    };
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["a"]}
                });
                return ρσ_anonfunc;
            })();
            var ρσ_Iter11 = ρσ_Iterable(abilities);
            for (var ρσ_Index11 = 0; ρσ_Index11 < ρσ_Iter11.length; ρσ_Index11++) {
                ability = ρσ_Iter11[ρσ_Index11];
                abbr = $(ability).find(prefix + "heading").text().toUpperCase();
                score = $(ability).find(prefix + "score").text();
                modifier = $(ability).find(prefix + "modifier").text().slice(1, -1);
                self._abilities.append(ρσ_list_decorate([ abbreviationToAbility(abbr), abbr, score, modifier ]).as_array());
                if (add_dice) {
                    ρσ_interpolate_kwargs.call(this, addIconButton, [makeCB(abbr), ability].concat([ρσ_desugar_kwargs({prepend: true})]));
                    if ((abbr === "DEX" || typeof abbr === "object" && ρσ_equals(abbr, "DEX"))) {
                        roll_initiative = stat_block.find(base + "__beyond20-roll-initiative");
                        attributes = stat_block.find(base + "__attributes");
                        if (attributes.length > 0) {
                            attributes = attributes.eq(0);
                            if ((roll_initiative.length === 0 || typeof roll_initiative.length === "object" && ρσ_equals(roll_initiative.length, 0))) {
                                initiative = $(ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.span, ["Roll Initiative!"].concat([ρσ_desugar_kwargs({class_: base.slice(1) + "__attribute-label"})])), ρσ_interpolate_kwargs.call(E, E.span, [ρσ_interpolate_kwargs.call(E, E.span, ["  " + modifier].concat([ρσ_desugar_kwargs({class_: base.slice(1) + "__attribute-data-value"})]))].concat([ρσ_desugar_kwargs({class_: base.slice(1) + "__attribute-data"})]))].concat([ρσ_desugar_kwargs({class_: base.slice(1) + "__attribute " + base.slice(1) + "__beyond20-roll-initiative"})])));
                            } else {
                                initiative = roll_initiative.eq(0);
                            }
                            attributes.append(initiative);
                            cb = function () {
                                self.rollInitiative();
                            };
                            addIconButton(cb, initiative.find(base + "__attribute-data"));
                        }
                    }
                }
            }
            tidbits = stat_block.find(base + "__tidbits " + base + "__tidbit");
            var ρσ_Iter12 = ρσ_Iterable(tidbits);
            for (var ρσ_Index12 = 0; ρσ_Index12 < ρσ_Iter12.length; ρσ_Index12++) {
                tidbit = ρσ_Iter12[ρσ_Index12];
                label = $(tidbit).find(base + "__tidbit-label").text();
                data = $(tidbit).find(base + "__tidbit-data");
                value = data.text().trim();
                if ((label === "Saving Throws" || typeof label === "object" && ρσ_equals(label, "Saving Throws"))) {
                    saves = value.split(", ");
                    if (add_dice) {
                        data.html("");
                    }
                    makeCB = (function() {
                        var ρσ_anonfunc = function (a) {
                            return function () {
                                self.rollSavingThrow(a);
                            };
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["a"]}
                        });
                        return ρσ_anonfunc;
                    })();
                    var ρσ_Iter13 = ρσ_Iterable(saves);
                    for (var ρσ_Index13 = 0; ρσ_Index13 < ρσ_Iter13.length; ρσ_Index13++) {
                        save = ρσ_Iter13[ρσ_Index13];
                        parts = save.split(" ");
                        abbr = parts[0];
                        mod = parts.slice(1).join(" ");
                        (ρσ_expr_temp = self._saves)[(typeof abbr === "number" && abbr < 0) ? ρσ_expr_temp.length + abbr : abbr] = mod;
                        if (add_dice) {
                            data.append(abbr + " " + mod);
                            ρσ_interpolate_kwargs.call(this, addIconButton, [makeCB(abbr), data].concat([ρσ_desugar_kwargs({append: true})]));
                            if (len(saves) > len(self._saves)) {
                                data.append(", ");
                            }
                        }
                    }
                } else if ((label === "Skills" || typeof label === "object" && ρσ_equals(label, "Skills"))) {
                    skills = value.split(", ");
                    var ρσ_Iter14 = ρσ_Iterable(skills);
                    for (var ρσ_Index14 = 0; ρσ_Index14 < ρσ_Iter14.length; ρσ_Index14++) {
                        skill = ρσ_Iter14[ρσ_Index14];
                        parts = skill.split(" ");
                        name = parts[0];
                        mod = parts.slice(1).join(" ");
                        (ρσ_expr_temp = self._skills)[(typeof name === "number" && name < 0) ? ρσ_expr_temp.length + name : name] = mod;
                    }
                    if (!add_dice) {
                        continue;
                    }
                    makeCB = (function() {
                        var ρσ_anonfunc = function (a) {
                            return function () {
                                self.rollSkillCheck(a);
                            };
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["a"]}
                        });
                        return ρσ_anonfunc;
                    })();
                    if (ρσ_equals(self.type(), "Monster")) {
                        skills = data.find("> a");
                        var ρσ_Iter15 = ρσ_Iterable(skills);
                        for (var ρσ_Index15 = 0; ρσ_Index15 < ρσ_Iter15.length; ρσ_Index15++) {
                            a = ρσ_Iter15[ρσ_Index15];
                            mon_skill = a.textContent;
                            text = a.nextSibling;
                            last = true;
                            if (text.textContent.endsWith(", ")) {
                                text.textContent = text.textContent.slice(0, -2);
                                last = false;
                            }
                            addIconButton(makeCB(mon_skill), a.nextSibling);
                            if (!last) {
                                $(a.nextElementSibling).after(", ");
                            }
                        }
                    } else {
                        data.html("");
                        first = true;
                        var ρσ_Iter16 = ρσ_Iterable(self._skills);
                        for (var ρσ_Index16 = 0; ρσ_Index16 < ρσ_Iter16.length; ρσ_Index16++) {
                            skill = ρσ_Iter16[ρσ_Index16];
                            if (!first) {
                                data.append(", ");
                            }
                            first = false;
                            data.append(skill + " " + (ρσ_expr_temp = self._skills)[(typeof skill === "number" && skill < 0) ? ρσ_expr_temp.length + skill : skill]);
                            if (add_dice) {
                                ρσ_interpolate_kwargs.call(this, addIconButton, [makeCB(skill), data].concat([ρσ_desugar_kwargs({append: true})]));
                            }
                        }
                    }
                } else if ((label === "Challenge" || typeof label === "object" && ρσ_equals(label, "Challenge"))) {
                    self._cr = value.split(" ")[0];
                }
                (ρσ_expr_temp = self._tidbits)[(typeof label === "number" && label < 0) ? ρσ_expr_temp.length + label : label] = value;
            }
            self.lookForActions(stat_block, add_dice, inject_descriptions);
            if (add_dice) {
                self.lookForSpells(stat_block);
            }
        };
        if (!Monster.prototype.parseStatBlock.__defaults__) Object.defineProperties(Monster.prototype.parseStatBlock, {
            __defaults__ : {value: {stat_block:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["stat_block"]}
        });
        Monster.prototype.displayAvatar = function displayAvatar() {
            var self = this;
            sendRoll(self, "avatar", self.avatar, (function(){
                var ρσ_d = {};
                ρσ_d["name"] = "Avatar";
                return ρσ_d;
            }).call(this));
        };
        Monster.prototype.rollHitPoints = function rollHitPoints() {
            var self = this;
            sendRoll(self, "custom", self._hp_formula, (function(){
                var ρσ_d = {};
                ρσ_d["name"] = "Hit Points";
                ρσ_d["modifier"] = self._hp_formula;
                return ρσ_d;
            }).call(this));
        };
        Monster.prototype.rollAbilityCheck = function rollAbilityCheck(abbr) {
            var self = this;
            var ρσ_unpack, name, score, modifier, ability;
            var ρσ_Iter17 = ρσ_Iterable(self._abilities);
            for (var ρσ_Index17 = 0; ρσ_Index17 < ρσ_Iter17.length; ρσ_Index17++) {
                ability = ρσ_Iter17[ρσ_Index17];
                if ((ability[1] === abbr || typeof ability[1] === "object" && ρσ_equals(ability[1], abbr))) {
                    ρσ_unpack = ability;
ρσ_unpack = ρσ_unpack_asarray(4, ρσ_unpack);
                    name = ρσ_unpack[0];
                    abbr = ρσ_unpack[1];
                    score = ρσ_unpack[2];
                    modifier = ρσ_unpack[3];
                    sendRoll(self, "ability", "1d20" + modifier, (function(){
                        var ρσ_d = {};
                        ρσ_d["name"] = name;
                        ρσ_d["ability"] = abbr;
                        ρσ_d["modifier"] = modifier;
                        ρσ_d["ability-score"] = score;
                        return ρσ_d;
                    }).call(this));
                    break;
                }
            }
        };
        if (!Monster.prototype.rollAbilityCheck.__argnames__) Object.defineProperties(Monster.prototype.rollAbilityCheck, {
            __argnames__ : {value: ["abbr"]}
        });
        Monster.prototype.rollInitiative = function rollInitiative() {
            var self = this;
            var modifier, initiative, tiebreaker, ability;
            var ρσ_Iter18 = ρσ_Iterable(self._abilities);
            for (var ρσ_Index18 = 0; ρσ_Index18 < ρσ_Iter18.length; ρσ_Index18++) {
                ability = ρσ_Iter18[ρσ_Index18];
                if ((ability[1] === "DEX" || typeof ability[1] === "object" && ρσ_equals(ability[1], "DEX"))) {
                    modifier = ability[3];
                    initiative = modifier;
                    if (self.getGlobalSetting("initiative-tiebreaker", false)) {
                        tiebreaker = ability[2];
                        initiative = float(initiative) + float(tiebreaker) / 100;
                        initiative = (initiative >= 0) ? "+" + str(initiative) : str(initiative);
                    }
                    sendRoll(self, "initiative", "1d20" + initiative, (function(){
                        var ρσ_d = {};
                        ρσ_d["initiative"] = initiative;
                        return ρσ_d;
                    }).call(this));
                    break;
                }
            }
        };
        Monster.prototype.rollSavingThrow = function rollSavingThrow(abbr) {
            var self = this;
            var mod, name;
            mod = (ρσ_expr_temp = self._saves)[(typeof abbr === "number" && abbr < 0) ? ρσ_expr_temp.length + abbr : abbr];
            name = abbreviationToAbility(abbr);
            sendRoll(self, "saving-throw", "1d20" + mod, (function(){
                var ρσ_d = {};
                ρσ_d["name"] = name;
                ρσ_d["ability"] = abbr;
                ρσ_d["modifier"] = mod;
                return ρσ_d;
            }).call(this));
        };
        if (!Monster.prototype.rollSavingThrow.__argnames__) Object.defineProperties(Monster.prototype.rollSavingThrow, {
            __argnames__ : {value: ["abbr"]}
        });
        Monster.prototype.rollSkillCheck = function rollSkillCheck(skill) {
            var self = this;
            var modifier, ability;
            modifier = (ρσ_expr_temp = self._skills)[(typeof skill === "number" && skill < 0) ? ρσ_expr_temp.length + skill : skill];
            ability = skillToAbility(skill);
            sendRoll(self, "skill", "1d20" + modifier, (function(){
                var ρσ_d = {};
                ρσ_d["skill"] = skill;
                ρσ_d["ability"] = ability;
                ρσ_d["modifier"] = modifier;
                return ρσ_d;
            }).call(this));
        };
        if (!Monster.prototype.rollSkillCheck.__argnames__) Object.defineProperties(Monster.prototype.rollSkillCheck, {
            __argnames__ : {value: ["skill"]}
        });
        Monster.prototype.parseAttackInfo = function parseAttackInfo(description) {
            var self = this;
            var m;
            m = re.search("(Melee|Ranged)(?: Weapon| Spell)? Attack:.*?(\\+[0-9]+) to hit.*?, (?:reach|ranged?) (.*?)(?:,.*?)?\\.", description);
            if (m) {
                return [m.group(1), m.group(2), m.group(3)];
            } else {
                return null;
            }
        };
        if (!Monster.prototype.parseAttackInfo.__argnames__) Object.defineProperties(Monster.prototype.parseAttackInfo, {
            __argnames__ : {value: ["description"]}
        });
        Monster.prototype.parseHitInfo = function parseHitInfo(description) {
            var self = this;
            var damages, save, hit_idx, hit, damage_regexp, damage_matches, damage_types, dmg, m;
            damages = null;
            save = null;
            hit_idx = description.indexOf("Hit:");
            hit = description;
            if (hit_idx > 0) {
                hit = description.slice(hit_idx);
            }
            damage_regexp = "([\\w]* )(?:([0-9]+))?(?: *\\(?([0-9]*d[0-9]+(?:\\s*[-+]\\s*[0-9]+)?)\\)?)? ([\\w ]+?) damage";
            damage_matches = re.finditer(damage_regexp, hit);
            damages = ρσ_list_decorate([]);
            damage_types = ρσ_list_decorate([]);
            var ρσ_Iter19 = ρσ_Iterable(damage_matches);
            for (var ρσ_Index19 = 0; ρσ_Index19 < ρσ_Iter19.length; ρσ_Index19++) {
                dmg = ρσ_Iter19[ρσ_Index19];
                if (ρσ_equals(dmg.group(1), "DC ") || ρσ_equals(dmg.group(4), "hit points by this")) {
                    continue;
                }
                if (ρσ_exists.n(dmg.group(3))) {
                    damages.append(dmg.group(3));
                } else {
                    damages.append(dmg.group(2));
                }
                damage_types.append(dmg.group(4));
            }
            m = re.search("DC ([0-9]+) (.*?) saving throw", hit);
            if (m) {
                save = [m.group(2), m.group(1)];
            } else {
                m = re.search("escape DC ([0-9]+)", hit);
                if (m) {
                    save = ["Escape", m.group(1)];
                }
            }
            if ((damages.length === 0 || typeof damages.length === "object" && ρσ_equals(damages.length, 0)) && save === null) {
                return null;
            }
            return [damages, damage_types, save];
        };
        if (!Monster.prototype.parseHitInfo.__argnames__) Object.defineProperties(Monster.prototype.parseHitInfo, {
            __argnames__ : {value: ["description"]}
        });
        Monster.prototype.buildAttackRoll = function buildAttackRoll(name, description) {
            var self = this;
            var roll_properties, attackInfo, ρσ_unpack, attack_type, to_hit, reach_range, hitInfo, damages, damage_types, save, crits, crit_damages, crit_damage_types, i, dmg;
            roll_properties = (function(){
                var ρσ_d = {};
                ρσ_d["name"] = name;
                ρσ_d["preview"] = self._avatar;
                ρσ_d["attack-source"] = "monster-action";
                ρσ_d["description"] = description;
                return ρσ_d;
            }).call(this);
            attackInfo = self.parseAttackInfo(description);
            if (attackInfo) {
                ρσ_unpack = attackInfo;
ρσ_unpack = ρσ_unpack_asarray(3, ρσ_unpack);
                attack_type = ρσ_unpack[0];
                to_hit = ρσ_unpack[1];
                reach_range = ρσ_unpack[2];
                roll_properties["to-hit"] = to_hit;
                roll_properties["attack-type"] = attack_type;
                roll_properties[ρσ_bound_index(((attack_type === "Melee" || typeof attack_type === "object" && ρσ_equals(attack_type, "Melee"))) ? "reach" : "range", roll_properties)] = reach_range;
            }
            hitInfo = self.parseHitInfo(description);
            if (hitInfo) {
                damages = hitInfo[0];
                damage_types = hitInfo[1];
                save = hitInfo[2];
                if (len(damages) > 0) {
                    roll_properties["damages"] = damages.as_array();
                    roll_properties["damage-types"] = damage_types.as_array();
                    crits = damagesToCrits(self, damages, damage_types);
                    crit_damages = ρσ_list_decorate([]);
                    crit_damage_types = ρσ_list_decorate([]);
                    var ρσ_Iter20 = ρσ_Iterable(enumerate(crits));
                    for (var ρσ_Index20 = 0; ρσ_Index20 < ρσ_Iter20.length; ρσ_Index20++) {
                        ρσ_unpack = ρσ_Iter20[ρσ_Index20];
                        i = ρσ_unpack[0];
                        dmg = ρσ_unpack[1];
                        if ((dmg !== "" && (typeof dmg !== "object" || ρσ_not_equals(dmg, "")))) {
                            crit_damages.append(dmg);
                            crit_damage_types.append(damage_types[(typeof i === "number" && i < 0) ? damage_types.length + i : i]);
                        }
                    }
                    roll_properties["critical-damages"] = crit_damages.as_array();
                    roll_properties["critical-damage-types"] = crit_damage_types.as_array();
                }
                if (save) {
                    roll_properties["save-ability"] = save[0];
                    roll_properties["save-dc"] = save[1];
                }
            }
            if (attackInfo || hitInfo) {
                return roll_properties;
            } else {
                return null;
            }
        };
        if (!Monster.prototype.buildAttackRoll.__argnames__) Object.defineProperties(Monster.prototype.buildAttackRoll, {
            __argnames__ : {value: ["name", "description"]}
        });
        Monster.prototype.lookForActions = function lookForActions(stat_block, add_dice, inject_descriptions) {
            var self = this;
            var blocks, makeCB, actions, firstChild, action_name, description, roll_properties, id, action, block, handleAction, attributes;
            blocks = stat_block.find(self._base + "__description-blocks " + self._base + "__description-block");
            makeCB = (function() {
                var ρσ_anonfunc = function (props) {
                    return function () {
                        sendRoll(self, "attack", "1d20" + props["to-hit"], props);
                    };
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["props"]}
                });
                return ρσ_anonfunc;
            })();
            var ρσ_Iter21 = ρσ_Iterable(blocks);
            for (var ρσ_Index21 = 0; ρσ_Index21 < ρσ_Iter21.length; ρσ_Index21++) {
                block = ρσ_Iter21[ρσ_Index21];
                actions = $(block).find(self._base + "__description-block-content p");
                var ρσ_Iter22 = ρσ_Iterable(actions);
                for (var ρσ_Index22 = 0; ρσ_Index22 < ρσ_Iter22.length; ρσ_Index22++) {
                    action = ρσ_Iter22[ρσ_Index22];
                    firstChild = action.firstElementChild;
                    if (firstChild) {
                        action_name = $(firstChild).find("> :first-child").text().trim();
                    } else {
                        if (inject_descriptions) {
                            injectDiceToRolls(action, self, self._name);
                        }
                        continue;
                    }
                    if ((action_name[action_name.length-1] === "." || typeof action_name[action_name.length-1] === "object" && ρσ_equals(action_name[action_name.length-1], "."))) {
                        action_name = action_name.slice(0, -1);
                    }
                    if (add_dice) {
                        description = descriptionToString(action);
                        roll_properties = self.buildAttackRoll(action_name, description);
                        if (roll_properties) {
                            id = ρσ_interpolate_kwargs.call(this, addRollButton, [self, makeCB(roll_properties), action].concat([ρσ_desugar_kwargs({small: true, prepend: true, image: true, text: action_name})]));
                            $("#" + id).css((function(){
                                var ρσ_d = {};
                                ρσ_d["float"] = "";
                                ρσ_d["text-align"] = "";
                                return ρσ_d;
                            }).call(this));
                        }
                    }
                    if (inject_descriptions) {
                        injectDiceToRolls(action, self, action_name);
                    }
                }
            }
            handleAction = (function() {
                var ρσ_anonfunc = function (action_name, block, action) {
                    var description, roll_properties, id;
                    description = $(action).text();
                    if ((action_name[action_name.length-1] === "." || typeof action_name[action_name.length-1] === "object" && ρσ_equals(action_name[action_name.length-1], "."))) {
                        action_name = action_name.slice(0, -1);
                    }
                    if (add_dice) {
                        roll_properties = self.buildAttackRoll(action_name, description);
                        if (roll_properties) {
                            id = ρσ_interpolate_kwargs.call(this, addRollButton, [self, makeCB(roll_properties), block].concat([ρσ_desugar_kwargs({small: true, before: true, image: true, text: action_name})]));
                            $("#" + id).css((function(){
                                var ρσ_d = {};
                                ρσ_d["float"] = "";
                                ρσ_d["text-align"] = "";
                                ρσ_d["margin-top"] = "15px";
                                return ρσ_d;
                            }).call(this));
                        }
                    }
                    if (inject_descriptions) {
                        injectDiceToRolls(action, self, action_name);
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["action_name", "block", "action"]}
                });
                return ρσ_anonfunc;
            })();
            blocks = stat_block.find(self._base + "__component-block");
            var ρσ_Iter23 = ρσ_Iterable(blocks);
            for (var ρσ_Index23 = 0; ρσ_Index23 < ρσ_Iter23.length; ρσ_Index23++) {
                block = ρσ_Iter23[ρσ_Index23];
                action_name = $(block).find(self._base + "__component-block-heading").text();
                attributes = $(block).find(self._base + "__component-block-content " + self._base + "__attribute-value");
                var ρσ_Iter24 = ρσ_Iterable(attributes);
                for (var ρσ_Index24 = 0; ρσ_Index24 < ρσ_Iter24.length; ρσ_Index24++) {
                    action = ρσ_Iter24[ρσ_Index24];
                    description = $(action).text();
                    if (re.search("-\\d+ ft. speed", description) !== null) {
                        continue;
                    }
                    handleAction(action_name, block, action);
                }
            }
            blocks = stat_block.find(self._base + "-component");
            var ρσ_Iter25 = ρσ_Iterable(blocks);
            for (var ρσ_Index25 = 0; ρσ_Index25 < ρσ_Iter25.length; ρσ_Index25++) {
                block = ρσ_Iter25[ρσ_Index25];
                action_name = $(block).find(self._base + "__section-header").text();
                actions = $(block).find(self._base + "-component__actions");
                handleAction(action_name, block, actions);
            }
            blocks = stat_block.find(self._base + "__feature," + self._base + "__features-feature");
            var ρσ_Iter26 = ρσ_Iterable(blocks);
            for (var ρσ_Index26 = 0; ρσ_Index26 < ρσ_Iter26.length; ρσ_Index26++) {
                block = ρσ_Iter26[ρσ_Index26];
                action_name = $(block).find(self._base + "__feature-label").text();
                action = $(block).find(self._base + "__feature-value");
                if ((action_name === "" || typeof action_name === "object" && ρσ_equals(action_name, "")) && (action.length === 0 || typeof action.length === "object" && ρσ_equals(action.length, 0))) {
                    action_name = $(block).find(self._base + "__features-feature-name").text();
                    action = $(block).find(self._base + "__features-feature-description");
                }
                handleAction(action_name, block, action);
            }
            blocks = stat_block.find(self._base + "__action-station-block," + self._base + "-action-station");
            var ρσ_Iter27 = ρσ_Iterable(blocks);
            for (var ρσ_Index27 = 0; ρσ_Index27 < ρσ_Iter27.length; ρσ_Index27++) {
                block = ρσ_Iter27[ρσ_Index27];
                action_name = $(block).find(self._base + "__action-station-block-heading").text();
                action = $(block).find(self._base + "__action-station-block-content " + self._base + "__attribute-value");
                if ((action_name === "" || typeof action_name === "object" && ρσ_equals(action_name, "")) && (action.length === 0 || typeof action.length === "object" && ρσ_equals(action.length, 0))) {
                    action_name = $(block).find(self._base + "-action-station__heading").text();
                    action = $(block).find(self._base + "-action-station__action");
                }
                handleAction(action_name, block, action);
            }
        };
        if (!Monster.prototype.lookForActions.__argnames__) Object.defineProperties(Monster.prototype.lookForActions, {
            __argnames__ : {value: ["stat_block", "add_dice", "inject_descriptions"]}
        });
        Monster.prototype.injectSpellRolls = function injectSpellRolls(element, url) {
            var self = this;
            var icon16, roll_icon;
            icon16 = chrome.extension.getURL("images/icons/icon16.png");
            roll_icon = $("<img class=\"ct-beyond20-spell-icon\" x-beyond20-spell-url=\"" + url + "\"></img>");
            $(element).after(roll_icon);
            $(".ct-beyond20-spell-icon").css("margin-right", "3px");
            $(".ct-beyond20-spell-icon").css("margin-left", "3px");
            $(".ct-beyond20-spell-icon").attr("src", icon16);
            $(".ct-beyond20-spell-icon").off("click");
            $(".ct-beyond20-spell-icon").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    var spell_url;
                    spell_url = $(event.currentTarget).attr("x-beyond20-spell-url");
                    if (ρσ_in(spell_url, self._spells)) {
                        (ρσ_expr_temp = self._spells)[(typeof spell_url === "number" && spell_url < 0) ? ρσ_expr_temp.length + spell_url : spell_url].display();
                    } else {
                        $.get(spell_url, (function() {
                            var ρσ_anonfunc = function (text) {
                                var spell_json, spell;
                                spell_json = JSON.parse(text.slice(1, -1));
                                spell = new Spell($(spell_json.Tooltip), self, "tooltip");
                                spell.display();
                                (ρσ_expr_temp = self._spells)[(typeof spell_url === "number" && spell_url < 0) ? ρσ_expr_temp.length + spell_url : spell_url] = spell;
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["text"]}
                            });
                            return ρσ_anonfunc;
                        })());
                    }
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!Monster.prototype.injectSpellRolls.__argnames__) Object.defineProperties(Monster.prototype.injectSpellRolls, {
            __argnames__ : {value: ["element", "url"]}
        });
        Monster.prototype.lookForSpells = function lookForSpells(stat_block) {
            var self = this;
            var spells, tooltip_href, tooltip_url, spell;
            spells = stat_block.find(self._base + "__description-blocks a.spell-tooltip");
            var ρσ_Iter28 = ρσ_Iterable(spells);
            for (var ρσ_Index28 = 0; ρσ_Index28 < ρσ_Iter28.length; ρσ_Index28++) {
                spell = ρσ_Iter28[ρσ_Index28];
                tooltip_href = $(spell).attr("data-tooltip-href");
                tooltip_url = re.sub("-tooltip.*$", "/tooltip", tooltip_href);
                self.injectSpellRolls(spell, tooltip_url);
            }
        };
        if (!Monster.prototype.lookForSpells.__argnames__) Object.defineProperties(Monster.prototype.lookForSpells, {
            __argnames__ : {value: ["stat_block"]}
        });
        Monster.prototype.updateInfo = function updateInfo() {
            var self = this;
            var hp, max_hp, temp_hp, groups, label, item, req;
            self._name = self._stat_block.find(self._base + "__name").text().trim();
            hp = max_hp = temp_hp = null;
            groups = $(".ct-creature-pane .ct-collapsible__content .ct-creature-pane__adjuster-group,.ct-creature-pane .ddbc-collapsible__content .ct-creature-pane__adjuster-group");
            var ρσ_Iter29 = ρσ_Iterable(groups);
            for (var ρσ_Index29 = 0; ρσ_Index29 < ρσ_Iter29.length; ρσ_Index29++) {
                item = ρσ_Iter29[ρσ_Index29];
                label = $(item).find(".ct-creature-pane__adjuster-group-label").text();
                if ((label === "Current HP" || typeof label === "object" && ρσ_equals(label, "Current HP"))) {
                    hp = int($(item).find(".ct-creature-pane__adjuster-group-value").text());
                } else if ((label === "Max HP" || typeof label === "object" && ρσ_equals(label, "Max HP"))) {
                    max_hp = int($(item).find(".ct-creature-pane__adjuster-group-value").text());
                } else if ((label === "Temp HP" || typeof label === "object" && ρσ_equals(label, "Temp HP"))) {
                    temp_hp = int($(item).find(".ct-creature-pane__adjuster-group-value input").val());
                }
            }
            if (hp !== null && max_hp !== null && ((self._hp !== hp && (typeof self._hp !== "object" || ρσ_not_equals(self._hp, hp))) || (self._max_hp !== max_hp && (typeof self._max_hp !== "object" || ρσ_not_equals(self._max_hp, max_hp))) || (self._temp_hp !== temp_hp && (typeof self._temp_hp !== "object" || ρσ_not_equals(self._temp_hp, temp_hp))))) {
                self._hp = hp;
                self._max_hp = max_hp;
                self._temp_hp = temp_hp;
                print("Monster HP updated to : (" + hp + "+" + temp_hp + ")/" + max_hp);
                if (self.getGlobalSetting("update-hp", true)) {
                    req = (function(){
                        var ρσ_d = {};
                        ρσ_d["action"] = "hp-update";
                        ρσ_d["character"] = self.getDict();
                        return ρσ_d;
                    }).call(this);
                    console.log("Sending message: ", req);
                    chrome.runtime.sendMessage(req, (function() {
                        var ρσ_anonfunc = function (resp) {
                            beyond20SendMessageFailure(self, resp);
                        };
                        if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                            __argnames__ : {value: ["resp"]}
                        });
                        return ρσ_anonfunc;
                    })());
                }
            }
        };
        Monster.prototype.getDict = function getDict() {
            var self = this;
            return (function(){
                var ρσ_d = {};
                ρσ_d["name"] = self._name;
                ρσ_d["avatar"] = self._avatar;
                ρσ_d["type"] = self.type();
                ρσ_d["id"] = self._id;
                ρσ_d["ac"] = self._ac;
                ρσ_d["hp"] = self._hp;
                ρσ_d["hp-formula"] = self._hp_formula;
                ρσ_d["max-hp"] = self._max_hp;
                ρσ_d["temp-hp"] = self._temp_hp;
                ρσ_d["speed"] = self._speed;
                ρσ_d["abilities"] = self._abilities.as_array();
                ρσ_d["saves"] = self._saves;
                ρσ_d["skills"] = self._skills;
                ρσ_d["cr"] = self._cr;
                ρσ_d["url"] = self._url;
                return ρσ_d;
            }).call(this);
        };
        Monster.prototype.__repr__ = function __repr__ () {
            if(CharacterBase.prototype.__repr__) return CharacterBase.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        Monster.prototype.__str__ = function __str__ () {
            if(CharacterBase.prototype.__str__) return CharacterBase.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(Monster.prototype, "__bases__", {value: [CharacterBase]});

        function skillToAbility(skill) {
            if (ρσ_exists.n(skill_abilities[(typeof skill === "number" && skill < 0) ? skill_abilities.length + skill : skill])) {
                return skill_abilities[(typeof skill === "number" && skill < 0) ? skill_abilities.length + skill : skill];
            }
            return "";
        };
        if (!skillToAbility.__argnames__) Object.defineProperties(skillToAbility, {
            __argnames__ : {value: ["skill"]}
        });

        function abbreviationToAbility(abbr) {
            var ability;
            var ρσ_Iter30 = ρσ_Iterable(ability_abbreviations);
            for (var ρσ_Index30 = 0; ρσ_Index30 < ρσ_Iter30.length; ρσ_Index30++) {
                ability = ρσ_Iter30[ρσ_Index30];
                if ((ability_abbreviations[(typeof ability === "number" && ability < 0) ? ability_abbreviations.length + ability : ability] === abbr || typeof ability_abbreviations[(typeof ability === "number" && ability < 0) ? ability_abbreviations.length + ability : ability] === "object" && ρσ_equals(ability_abbreviations[(typeof ability === "number" && ability < 0) ? ability_abbreviations.length + ability : ability], abbr))) {
                    return ability;
                }
            }
            return abbr;
        };
        if (!abbreviationToAbility.__argnames__) Object.defineProperties(abbreviationToAbility, {
            __argnames__ : {value: ["abbr"]}
        });

        function propertyListToDict(propList) {
            var properties, label, value, i;
            properties = {};
            for (var ρσ_Index31 = 0; ρσ_Index31 < propList.length; ρσ_Index31++) {
                i = ρσ_Index31;
                label = propList.eq(i).find(".ct-property-list__property-label,.ddbc-property-list__property-label").text().slice(0, -1);
                value = propList.eq(i).find(".ct-property-list__property-content,.ddbc-property-list__property-content").text();
                properties[(typeof label === "number" && label < 0) ? properties.length + label : label] = value;
            }
            return properties;
        };
        if (!propertyListToDict.__argnames__) Object.defineProperties(propertyListToDict, {
            __argnames__ : {value: ["propList"]}
        });

        function descriptionToString(selector) {
            return ($(selector).html() || "").replace(/<\/?[^>]+>/gi, "");
        };
        if (!descriptionToString.__argnames__) Object.defineProperties(descriptionToString, {
            __argnames__ : {value: ["selector"]}
        });

        function findToHit(name_to_match, items_selector, name_selector, tohit_selector) {
            var items, to_hit, i;
            items = $(items_selector);
            for (var ρσ_Index32 = 0; ρσ_Index32 < items.length; ρσ_Index32++) {
                i = ρσ_Index32;
                if (ρσ_equals(items.eq(i).find(name_selector).text(), name_to_match)) {
                    to_hit = items.eq(i).find(tohit_selector);
                    if (to_hit.length > 0) {
                        to_hit = to_hit.text();
                        return to_hit;
                    }
                    break;
                }
            }
            return null;
        };
        if (!findToHit.__argnames__) Object.defineProperties(findToHit, {
            __argnames__ : {value: ["name_to_match", "items_selector", "name_selector", "tohit_selector"]}
        });

        function damagesToCrits(character, damages) {
            var crits, rule, damage_parts, damage;
            crits = ρσ_list_decorate([]);
            rule = int(character.getGlobalSetting("critical-homebrew", CriticalRules.prototype.PHB));
            if ((rule === CriticalRules.prototype.HOMEBREW_REROLL || typeof rule === "object" && ρσ_equals(rule, CriticalRules.prototype.HOMEBREW_REROLL)) || (rule === CriticalRules.prototype.HOMEBREW_MOD || typeof rule === "object" && ρσ_equals(rule, CriticalRules.prototype.HOMEBREW_MOD))) {
                return damages.slice(0);
            }
            var ρσ_Iter33 = ρσ_Iterable(damages);
            for (var ρσ_Index33 = 0; ρσ_Index33 < ρσ_Iter33.length; ρσ_Index33++) {
                damage = ρσ_Iter33[ρσ_Index33];
                damage_parts = re.findall("([0-9]*)d([0-9]+)(ro<2)?", damage).map((function() {
                    var ρσ_anonfunc = function (formula) {
                        var match, dice, faces;
                        match = re.search("([0-9]*)d([0-9]+)(ro<2)?", formula);
                        if ((rule === CriticalRules.prototype.HOMEBREW_MAX || typeof rule === "object" && ρσ_equals(rule, CriticalRules.prototype.HOMEBREW_MAX))) {
                            dice = int(match.group(1) || 1);
                            faces = int(match.group(2));
                            return str(dice * faces);
                        } else {
                            return match.group(0);
                        }
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["formula"]}
                    });
                    return ρσ_anonfunc;
                })());
                console.log("Damage to crits : ", damage, damage_parts);
                crits.append(damage_parts.join(" + "));
            }
            return crits;
        };
        if (!damagesToCrits.__argnames__) Object.defineProperties(damagesToCrits, {
            __argnames__ : {value: ["character", "damages"]}
        });

        function buildAttackRoll() {
            var character = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var attack_source = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var name = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var description = ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[3];
            var properties = ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[4];
            var damages = (arguments[5] === undefined || ( 5 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? buildAttackRoll.__defaults__.damages : arguments[5];
            var damage_types = (arguments[6] === undefined || ( 6 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? buildAttackRoll.__defaults__.damage_types : arguments[6];
            var to_hit = (arguments[7] === undefined || ( 7 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? buildAttackRoll.__defaults__.to_hit : arguments[7];
            var brutal = (arguments[8] === undefined || ( 8 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? buildAttackRoll.__defaults__.brutal : arguments[8];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "damages")){
                damages = ρσ_kwargs_obj.damages;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "damage_types")){
                damage_types = ρσ_kwargs_obj.damage_types;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "to_hit")){
                to_hit = ρσ_kwargs_obj.to_hit;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "brutal")){
                brutal = ρσ_kwargs_obj.brutal;
            }
            var roll_properties, range_area, ρσ_unpack, save_ability, save_dc, crits, crit_damages, crit_damage_types, i, dmg, highest_dice, match, sides;
            roll_properties = (function(){
                var ρσ_d = {};
                ρσ_d["name"] = name;
                ρσ_d["attack-source"] = attack_source;
                ρσ_d["description"] = description;
                return ρσ_d;
            }).call(this);
            if (to_hit) {
                roll_properties["to-hit"] = to_hit;
            }
            if (ρσ_exists.n(properties["Reach"])) {
                roll_properties["reach"] = properties["Reach"];
                roll_properties["attack-type"] = "Melee";
            } else if (ρσ_exists.n(properties["Range"])) {
                roll_properties["range"] = properties["Range"];
                roll_properties["attack-type"] = "Ranged";
            } else {
                range_area = ρσ_exists.e(properties["Range/Area"], "");
                if (ρσ_in("Reach", range_area)) {
                    roll_properties["attack-type"] = "Melee";
                    roll_properties["reach"] = range_area.replace(" Reach", "");
                } else {
                    roll_properties["attack-type"] = "Ranged";
                    roll_properties["range"] = range_area;
                }
            }
            if (ρσ_exists.n(properties["Attack Type"])) {
                roll_properties["attack-type"] = properties["Attack Type"];
            }
            if (ρσ_exists.n(properties["Attack/Save"])) {
                ρσ_unpack = properties["Attack/Save"].split(" ");
ρσ_unpack = ρσ_unpack_asarray(2, ρσ_unpack);
                save_ability = ρσ_unpack[0];
                save_dc = ρσ_unpack[1];
                roll_properties["save-ability"] = abbreviationToAbility(save_ability);
                roll_properties["save-dc"] = save_dc;
            }
            if (ρσ_exists.n(properties["Properties"])) {
                roll_properties["properties"] = properties["Properties"].split(", ");
            }
            if (len(damages) > 0) {
                roll_properties["damages"] = damages.as_array();
                roll_properties["damage-types"] = damage_types.as_array();
                if (to_hit) {
                    crits = damagesToCrits(character, damages, damage_types);
                    crit_damages = ρσ_list_decorate([]);
                    crit_damage_types = ρσ_list_decorate([]);
                    var ρσ_Iter34 = ρσ_Iterable(enumerate(crits));
                    for (var ρσ_Index34 = 0; ρσ_Index34 < ρσ_Iter34.length; ρσ_Index34++) {
                        ρσ_unpack = ρσ_Iter34[ρσ_Index34];
                        i = ρσ_unpack[0];
                        dmg = ρσ_unpack[1];
                        if ((dmg !== "" && (typeof dmg !== "object" || ρσ_not_equals(dmg, "")))) {
                            crit_damages.append(dmg);
                            crit_damage_types.append(damage_types[(typeof i === "number" && i < 0) ? damage_types.length + i : i]);
                        }
                    }
                    if (brutal > 0) {
                        highest_dice = 0;
                        var ρσ_Iter35 = ρσ_Iterable(crit_damages);
                        for (var ρσ_Index35 = 0; ρσ_Index35 < ρσ_Iter35.length; ρσ_Index35++) {
                            dmg = ρσ_Iter35[ρσ_Index35];
                            match = re.search("[0-9]*d([0-9]+)", dmg);
                            if ((typeof match !== "undefined" && match !== null)) {
                                sides = int(match.group(1));
                                if (sides > highest_dice) {
                                    highest_dice = sides;
                                }
                            }
                        }
                        if ((highest_dice !== 0 && (typeof highest_dice !== "object" || ρσ_not_equals(highest_dice, 0)))) {
                            crit_damages.append(str(brutal) + "d" + str(highest_dice));
                            crit_damage_types.append("Brutal");
                        }
                    }
                    roll_properties["critical-damages"] = crit_damages.as_array();
                    roll_properties["critical-damage-types"] = crit_damage_types.as_array();
                }
            }
            return roll_properties;
        };
        if (!buildAttackRoll.__defaults__) Object.defineProperties(buildAttackRoll, {
            __defaults__ : {value: {damages:ρσ_list_decorate([]), damage_types:ρσ_list_decorate([]), to_hit:null, brutal:0}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["character", "attack_source", "name", "description", "properties", "damages", "damage_types", "to_hit", "brutal"]}
        });

        function sendRoll(character, rollType, fallback, args) {
            var whisper, whisper_monster, advantage, req, key;
            whisper = int(character.getGlobalSetting("whisper-type", WhisperType.prototype.NO));
            whisper_monster = int(character.getGlobalSetting("whisper-type-monsters", WhisperType.prototype.YES));
            if ((ρσ_equals(character.type(), "Monster") || ρσ_equals(character.type(), "Vehicle")) && (whisper_monster !== WhisperType.prototype.NO && (typeof whisper_monster !== "object" || ρσ_not_equals(whisper_monster, WhisperType.prototype.NO)))) {
                whisper = whisper_monster;
            }
            advantage = int(character.getGlobalSetting("roll-type", RollType.prototype.NORMAL));
            if ((args["advantage"] === RollType.prototype.OVERRIDE_ADVANTAGE || typeof args["advantage"] === "object" && ρσ_equals(args["advantage"], RollType.prototype.OVERRIDE_ADVANTAGE))) {
                args["advantage"] = ((advantage === RollType.prototype.SUPER_ADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.SUPER_ADVANTAGE))) ? RollType.prototype.SUPER_ADVANTAGE : RollType.prototype.ADVANTAGE;
            }
            req = (function(){
                var ρσ_d = {};
                ρσ_d["action"] = "roll";
                ρσ_d["character"] = character.getDict();
                ρσ_d["type"] = rollType;
                ρσ_d["roll"] = cleanRoll(fallback);
                ρσ_d["advantage"] = advantage;
                ρσ_d["whisper"] = whisper;
                return ρσ_d;
            }).call(this);
            if (character.getGlobalSetting("weapon-force-critical", false)) {
                req["critical-limit"] = 1;
            }
            var ρσ_Iter36 = ρσ_Iterable(args);
            for (var ρσ_Index36 = 0; ρσ_Index36 < ρσ_Iter36.length; ρσ_Index36++) {
                key = ρσ_Iter36[ρσ_Index36];
                req[(typeof key === "number" && key < 0) ? req.length + key : key] = args[(typeof key === "number" && key < 0) ? args.length + key : key];
            }
            if (key_modifiers.shift) {
                req["advantage"] = RollType.prototype.ADVANTAGE;
            } else if (key_modifiers.ctrl) {
                req["advantage"] = RollType.prototype.DISADVANTAGE;
            } else if (key_modifiers.alt) {
                req["advantage"] = RollType.prototype.NORMAL;
            }
            console.log("Sending message: ", req);
            chrome.runtime.sendMessage(req, (function() {
                var ρσ_anonfunc = function (resp) {
                    beyond20SendMessageFailure(character, resp);
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["resp"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!sendRoll.__argnames__) Object.defineProperties(sendRoll, {
            __argnames__ : {value: ["character", "rollType", "fallback", "args"]}
        });

        function isRollButtonAdded() {
            return $(".ct-beyond20-roll,.ct-beyond20-roll-display").length > 0;
        };

        function isCustomRollIconsAdded() {
            return $(".ct-beyond20-custom-roll").length > 0;
        };

        function isHitDieButtonAdded() {
            return $(".ct-beyond20-roll-hitdie").length > 0;
        };

        function getRollTypeButtonClass(character) {
            var advantage;
            if ((typeof character !== "undefined" && character !== null)) {
                advantage = int(character.getGlobalSetting("roll-type", RollType.prototype.NORMAL));
            }
            if (key_modifiers.shift) {
                advantage = RollType.prototype.ADVANTAGE;
            } else if (key_modifiers.ctrl) {
                advantage = RollType.prototype.DISADVANTAGE;
            } else if (key_modifiers.alt) {
                advantage = RollType.prototype.NORMAL;
            }
            if ((advantage === RollType.prototype.DOUBLE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.DOUBLE))) {
                return "beyond20-roll-type-double";
            }
            if ((advantage === RollType.prototype.QUERY || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.QUERY))) {
                return "beyond20-roll-type-query";
            }
            if ((advantage === RollType.prototype.THRICE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.THRICE))) {
                return "beyond20-roll-type-thrice";
            }
            if ((advantage === RollType.prototype.ADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.ADVANTAGE))) {
                return "beyond20-roll-type-advantage";
            }
            if ((advantage === RollType.prototype.DISADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.DISADVANTAGE))) {
                return "beyond20-roll-type-disadvantage";
            }
            if ((advantage === RollType.prototype.SUPER_ADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.SUPER_ADVANTAGE))) {
                return "beyond20-roll-type-super-advantage";
            }
            if ((advantage === RollType.prototype.SUPER_DISADVANTAGE || typeof advantage === "object" && ρσ_equals(advantage, RollType.prototype.SUPER_DISADVANTAGE))) {
                return "beyond20-roll-type-super-disadvantage";
            }
            return "";
        };
        if (!getRollTypeButtonClass.__argnames__) Object.defineProperties(getRollTypeButtonClass, {
            __argnames__ : {value: ["character"]}
        });

        last_character_used = null;
        function updateRollTypeButtonClasses(character) {
            var button_roll_type_classes, rolltype_class;
            button_roll_type_classes = "beyond20-roll-type-double beyond20-roll-type-query beyond20-roll-type-thrice beyond20-roll-type-advantage beyond20-roll-type-disadvantage beyond20-roll-type-super-advantage beyond20-roll-type-super-disadvantage";
            rolltype_class = getRollTypeButtonClass(character || last_character_used);
            $(".ct-beyond20-roll .ct-beyond20-roll-button,.beyond20-quick-roll-tooltip").removeClass(button_roll_type_classes).addClass(rolltype_class);
        };
        if (!updateRollTypeButtonClasses.__argnames__) Object.defineProperties(updateRollTypeButtonClasses, {
            __argnames__ : {value: ["character"]}
        });

        button_class = "ct-theme-button ct-theme-button--filled ct-theme-button--interactive ct-button character-button";
        button_class_small = button_class + " character-button-small";
        function addRollButton() {
            var character = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var callback = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var where = ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[2];
            var small = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addRollButton.__defaults__.small : arguments[3];
            var append = (arguments[4] === undefined || ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addRollButton.__defaults__.append : arguments[4];
            var prepend = (arguments[5] === undefined || ( 5 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addRollButton.__defaults__.prepend : arguments[5];
            var before = (arguments[6] === undefined || ( 6 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addRollButton.__defaults__.before : arguments[6];
            var image = (arguments[7] === undefined || ( 7 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addRollButton.__defaults__.image : arguments[7];
            var text = (arguments[8] === undefined || ( 8 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addRollButton.__defaults__.text : arguments[8];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "small")){
                small = ρσ_kwargs_obj.small;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "append")){
                append = ρσ_kwargs_obj.append;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "prepend")){
                prepend = ρσ_kwargs_obj.prepend;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "before")){
                before = ρσ_kwargs_obj.before;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "image")){
                image = ρσ_kwargs_obj.image;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "text")){
                text = ρσ_kwargs_obj.text;
            }
            var icon32, icon16, id, rolltype_class, button;
            last_character_used = character;
            icon32 = chrome.extension.getURL("images/dice24.png");
            icon16 = chrome.extension.getURL("images/dice16.png");
            id = uuid.uuid4();
            rolltype_class = " " + getRollTypeButtonClass(character);
            button = ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.button, [ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({class_: "ct-beyond20-icon", src: (image) ? (small) ? icon16 : icon32 : "", style: (image) ? "margin-right: 6px;" : ""})]), ρσ_interpolate_kwargs.call(E, E.span, [text].concat([ρσ_desugar_kwargs({class_: "ct-button__content"})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll-button " + ((small) ? button_class_small : button_class) + rolltype_class})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll", id: str(id)})]));
            if (append) {
                $(where).append(button);
            } else if (prepend) {
                $(where).prepend(button);
            } else if (before) {
                $(where).before(button);
            } else {
                $(where).after(button);
            }
            $("#" + str(id)).css((function(){
                var ρσ_d = {};
                ρσ_d["float"] = "right";
                ρσ_d["display"] = "block";
                ρσ_d["text-align"] = "center";
                return ρσ_d;
            }).call(this));
            $("#" + str(id) + " button").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    callback();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
            return id;
        };
        if (!addRollButton.__defaults__) Object.defineProperties(addRollButton, {
            __defaults__ : {value: {small:false, append:false, prepend:false, before:false, image:true, text:"Beyond 20"}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["character", "callback", "where", "small", "append", "prepend", "before", "image", "text"]}
        });

        function addDisplayButton() {
            var callback = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var where = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var text = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addDisplayButton.__defaults__.text : arguments[2];
            var append = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addDisplayButton.__defaults__.append : arguments[3];
            var small = (arguments[4] === undefined || ( 4 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addDisplayButton.__defaults__.small : arguments[4];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "text")){
                text = ρσ_kwargs_obj.text;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "append")){
                append = ρσ_kwargs_obj.append;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "small")){
                small = ρσ_kwargs_obj.small;
            }
            var button;
            button = ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.button, [ρσ_interpolate_kwargs.call(E, E.span, [text].concat([ρσ_desugar_kwargs({class_: "ct-button__content"})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-display-button " + ((small) ? button_class_small : button_class).replace("filled", "outline")})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll-display"})]));
            if (append) {
                $(where).append(button);
            } else {
                $(where).after(button);
            }
            $(".ct-beyond20-roll-button").css((function(){
                var ρσ_d = {};
                ρσ_d["margin-left"] = "auto";
                ρσ_d["margin-right"] = "auto";
                return ρσ_d;
            }).call(this));
            $(".ct-beyond20-roll-display").css("margin-top", "2px");
            $(".ct-beyond20-roll-display").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    callback();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!addDisplayButton.__defaults__) Object.defineProperties(addDisplayButton, {
            __defaults__ : {value: {text:"Display in VTT", append:true, small:true}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["callback", "where", "text", "append", "small"]}
        });

        function addHitDieButtons(rollCallback) {
            var icon16, button, hitdice, multiclass, cb, i;
            icon16 = chrome.extension.getURL("images/icons/icon16.png");
            button = ρσ_interpolate_kwargs.call(E, E.div, [ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({class_: "ct-beyond20-icon", src: icon16, style: "margin-right: 6px;"})]), ρσ_interpolate_kwargs.call(E, E.button, [ρσ_interpolate_kwargs.call(E, E.span, ["Roll Hit Die"].concat([ρσ_desugar_kwargs({class_: "ct-button__content"})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll-button " + button_class_small})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll-hitdie", style: "float: right;"})]));
            print("Adding Hit Dice buttons");
            $(".ct-reset-pane__hitdie-heading").append(button);
            hitdice = $(".ct-reset-pane__hitdie");
            multiclass = hitdice.length > 1;
            for (var ρσ_Index37 = 0; ρσ_Index37 < hitdice.length; ρσ_Index37++) {
                i = ρσ_Index37;
                cb = (function() {
                    var ρσ_anonfunc = function (rollCallback, index) {
                        return (function() {
                            var ρσ_anonfunc = function (event) {
                                rollCallback(multiclass, index);
                            };
                            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                                __argnames__ : {value: ["event"]}
                            });
                            return ρσ_anonfunc;
                        })();
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["rollCallback", "index"]}
                    });
                    return ρσ_anonfunc;
                })();
                $(".ct-beyond20-roll-hitdie").eq(i).on("click", cb(rollCallback, i));
            }
        };
        if (!addHitDieButtons.__argnames__) Object.defineProperties(addHitDieButtons, {
            __argnames__ : {value: ["rollCallback"]}
        });

        function addIconButton() {
            var callback = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var where = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var append = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addIconButton.__defaults__.append : arguments[2];
            var prepend = (arguments[3] === undefined || ( 3 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? addIconButton.__defaults__.prepend : arguments[3];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "append")){
                append = ρσ_kwargs_obj.append;
            }
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "prepend")){
                prepend = ρσ_kwargs_obj.prepend;
            }
            var icon16, id, button;
            icon16 = chrome.extension.getURL("images/icons/icon16.png");
            id = uuid.uuid4();
            button = ρσ_interpolate_kwargs.call(E, E.span, [ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({class_: "ct-beyond20-icon", src: icon16})])].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll", id: str(id), style: "margin-right:3px; margin-left: 3px;"})]));
            if (append) {
                $(where).append(button);
            } else if (prepend) {
                $(where).prepend(button);
            } else {
                $(where).after(button);
            }
            $("#" + str(id)).on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    callback();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!addIconButton.__defaults__) Object.defineProperties(addIconButton, {
            __defaults__ : {value: {append:false, prepend:false}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["callback", "where", "append", "prepend"]}
        });

        function removeRollButtons() {
            var custom_rolls, i;
            $(".ct-beyond20-roll").remove();
            $(".ct-beyond20-roll-hitdie").remove();
            $(".ct-beyond20-roll-display").remove();
            $(".ct-beyond20-custom-icon").remove();
            custom_rolls = $("u.ct-beyond20-custom-roll");
            for (var ρσ_Index38 = 0; ρσ_Index38 < custom_rolls.length; ρσ_Index38++) {
                i = ρσ_Index38;
                custom_rolls.eq(i).replaceWith(custom_rolls.eq(i).text());
            }
        };

        function recursiveDiceReplace(node, cb) {
            var children, child, text;
            if (node.hasChildNodes()) {
                children = list(node.childNodes);
                var ρσ_Iter39 = ρσ_Iterable(children);
                for (var ρσ_Index39 = 0; ρσ_Index39 < ρσ_Iter39.length; ρσ_Index39++) {
                    child = ρσ_Iter39[ρσ_Index39];
                    if ($(child).hasClass("ct-beyond20-roll")) {
                        continue;
                    }
                    recursiveDiceReplace(child, cb);
                }
            } else if ((node.nodeName === "#text" || typeof node.nodeName === "object" && ρσ_equals(node.nodeName, "#text"))) {
                text = replaceRolls(node.textContent, cb);
                if ((text !== node.textContent && (typeof text !== "object" || ρσ_not_equals(text, node.textContent)))) {
                    $(node).replaceWith($.parseHTML(text));
                }
            }
        };
        if (!recursiveDiceReplace.__argnames__) Object.defineProperties(recursiveDiceReplace, {
            __argnames__ : {value: ["node", "cb"]}
        });

        function injectDiceToRolls() {
            var selector = ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[0];
            var character = ( 1 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true) ? undefined : arguments[1];
            var name = (arguments[2] === undefined || ( 2 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? injectDiceToRolls.__defaults__.name : arguments[2];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "name")){
                name = ρσ_kwargs_obj.name;
            }
            var icon16, replaceCB, items, item;
            icon16 = chrome.extension.getURL("images/icons/icon16.png");
            replaceCB = (function() {
                var ρσ_anonfunc = function (dice, modifier) {
                    var dice_formula;
                    dice_formula = (((dice === "" || typeof dice === "object" && ρσ_equals(dice, ""))) ? "1d20" : dice) + modifier;
                    return "<u class=\"ct-beyond20-custom-roll\"><strong>" + dice + modifier + "</strong>" + "<img class=\"ct-beyond20-custom-icon\" x-beyond20-name=\"" + name + "\" x-beyond20-roll=\"" + dice_formula + "\"></img></u>";
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["dice", "modifier"]}
                });
                return ρσ_anonfunc;
            })();
            items = $(selector);
            var ρσ_Iter40 = ρσ_Iterable(items);
            for (var ρσ_Index40 = 0; ρσ_Index40 < ρσ_Iter40.length; ρσ_Index40++) {
                item = ρσ_Iter40[ρσ_Index40];
                recursiveDiceReplace(item, replaceCB);
            }
            $(".ct-beyond20-custom-icon").css("margin-right", "3px");
            $(".ct-beyond20-custom-icon").css("margin-left", "3px");
            $(".ct-beyond20-custom-icon").attr("src", icon16);
            $(".ct-beyond20-custom-roll").off("click");
            $(".ct-beyond20-custom-roll").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    var name, roll;
                    name = $(event.currentTarget).find("img").attr("x-beyond20-name");
                    roll = $(event.currentTarget).find("img").attr("x-beyond20-roll");
                    sendRoll(character, "custom", roll, (function(){
                        var ρσ_d = {};
                        ρσ_d["name"] = name;
                        return ρσ_d;
                    }).call(this));
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
        };
        if (!injectDiceToRolls.__defaults__) Object.defineProperties(injectDiceToRolls, {
            __defaults__ : {value: {name:""}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["selector", "character", "name"]}
        });

        function beyond20SendMessageFailure(character, response) {
            if (!(typeof response !== "undefined" && response !== null)) {
                return;
            }
            console.log("Received response : ", response);
            if ((response.request.action === "roll" || typeof response.request.action === "object" && ρσ_equals(response.request.action, "roll")) && ((response.vtt === "dndbeyond" || typeof response.vtt === "object" && ρσ_equals(response.vtt, "dndbeyond")) || ρσ_exists.n(response.error))) {
                dndbeyondDiceRoller.handleRollError(response.request, response.error);
            } else if (ρσ_exists.n(response.error)) {
                alertify.error("<strong>Beyond 20 : </strong>" + response.error);
            }
        };
        if (!beyond20SendMessageFailure.__argnames__) Object.defineProperties(beyond20SendMessageFailure, {
            __argnames__ : {value: ["character", "response"]}
        });

        alertify.set("alert", "title", "Beyond 20");
        alertify.set("notifier", "position", "top-center");
        key_modifiers = (function(){
            var ρσ_d = {};
            ρσ_d["alt"] = false;
            ρσ_d["ctrl"] = false;
            ρσ_d["shift"] = false;
            return ρσ_d;
        }).call(this);
        checkKeyModifiers = (function() {
            var ρσ_anonfunc = function (event) {
                var needsUpdate;
                if (event.originalEvent.repeat) {
                    return;
                }
                needsUpdate = Object.values(key_modifiers).some((function() {
                    var ρσ_anonfunc = function (v) {
                        return v;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["v"]}
                    });
                    return ρσ_anonfunc;
                })());
                key_modifiers.ctrl = event.ctrlKey || event.metaKey;
                key_modifiers.shift = event.shiftKey;
                key_modifiers.alt = event.altKey;
                needsUpdate = needsUpdate || Object.values(key_modifiers).some((function() {
                    var ρσ_anonfunc = function (v) {
                        return v;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["v"]}
                    });
                    return ρσ_anonfunc;
                })());
                if (needsUpdate) {
                    updateRollTypeButtonClasses();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["event"]}
            });
            return ρσ_anonfunc;
        })();
        resetKeyModifiers = (function() {
            var ρσ_anonfunc = function (event) {
                var needsUpdate;
                needsUpdate = Object.values(key_modifiers).some((function() {
                    var ρσ_anonfunc = function (v) {
                        return v;
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["v"]}
                    });
                    return ρσ_anonfunc;
                })());
                key_modifiers.ctrl = false;
                key_modifiers.shift = false;
                key_modifiers.alt = false;
                if (needsUpdate) {
                    updateRollTypeButtonClasses();
                }
            };
            if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                __argnames__ : {value: ["event"]}
            });
            return ρσ_anonfunc;
        })();
        $(window).keydown(checkKeyModifiers).keyup(checkKeyModifiers).blur(resetKeyModifiers);
        ρσ_modules.dndbeyond.ability_abbreviations = ability_abbreviations;
        ρσ_modules.dndbeyond.skill_abilities = skill_abilities;
        ρσ_modules.dndbeyond.last_character_used = last_character_used;
        ρσ_modules.dndbeyond.button_class = button_class;
        ρσ_modules.dndbeyond.button_class_small = button_class_small;
        ρσ_modules.dndbeyond.key_modifiers = key_modifiers;
        ρσ_modules.dndbeyond.checkKeyModifiers = checkKeyModifiers;
        ρσ_modules.dndbeyond.resetKeyModifiers = resetKeyModifiers;
        ρσ_modules.dndbeyond.Spell = Spell;
        ρσ_modules.dndbeyond.CharacterBase = CharacterBase;
        ρσ_modules.dndbeyond.Character = Character;
        ρσ_modules.dndbeyond.Monster = Monster;
        ρσ_modules.dndbeyond.skillToAbility = skillToAbility;
        ρσ_modules.dndbeyond.abbreviationToAbility = abbreviationToAbility;
        ρσ_modules.dndbeyond.propertyListToDict = propertyListToDict;
        ρσ_modules.dndbeyond.descriptionToString = descriptionToString;
        ρσ_modules.dndbeyond.findToHit = findToHit;
        ρσ_modules.dndbeyond.damagesToCrits = damagesToCrits;
        ρσ_modules.dndbeyond.buildAttackRoll = buildAttackRoll;
        ρσ_modules.dndbeyond.sendRoll = sendRoll;
        ρσ_modules.dndbeyond.isRollButtonAdded = isRollButtonAdded;
        ρσ_modules.dndbeyond.isCustomRollIconsAdded = isCustomRollIconsAdded;
        ρσ_modules.dndbeyond.isHitDieButtonAdded = isHitDieButtonAdded;
        ρσ_modules.dndbeyond.getRollTypeButtonClass = getRollTypeButtonClass;
        ρσ_modules.dndbeyond.updateRollTypeButtonClasses = updateRollTypeButtonClasses;
        ρσ_modules.dndbeyond.addRollButton = addRollButton;
        ρσ_modules.dndbeyond.addDisplayButton = addDisplayButton;
        ρσ_modules.dndbeyond.addHitDieButtons = addHitDieButtons;
        ρσ_modules.dndbeyond.addIconButton = addIconButton;
        ρσ_modules.dndbeyond.removeRollButtons = removeRollButtons;
        ρσ_modules.dndbeyond.recursiveDiceReplace = recursiveDiceReplace;
        ρσ_modules.dndbeyond.injectDiceToRolls = injectDiceToRolls;
        ρσ_modules.dndbeyond.beyond20SendMessageFailure = beyond20SendMessageFailure;
    })();

    (function(){

        var __name__ = "__main__";


        var character;
        var getStoredSettings = ρσ_modules.settings.getStoredSettings;

        var injectDiceToRolls = ρσ_modules.dndbeyond.injectDiceToRolls;
        var isRollButtonAdded = ρσ_modules.dndbeyond.isRollButtonAdded;
        var CharacterBase = ρσ_modules.dndbeyond.CharacterBase;
        var Spell = ρσ_modules.dndbeyond.Spell;

        var E = ρσ_modules.elementmaker.E;

        var alertFullSettings = ρσ_modules.utils.alertFullSettings;

        print("Beyond20: D&D Beyond Spell module loaded.");
        function FakeCharacter() {
            if (this.ρσ_object_id === undefined) Object.defineProperty(this, "ρσ_object_id", {"value":++ρσ_object_counter});
            FakeCharacter.prototype.__init__.apply(this, arguments);
        }
        ρσ_extends(FakeCharacter, CharacterBase);
        FakeCharacter.prototype.__init__ = function __init__ () {
            CharacterBase.prototype.__init__ && CharacterBase.prototype.__init__.apply(this, arguments);
        };
        FakeCharacter.prototype.__repr__ = function __repr__ () {
            if(CharacterBase.prototype.__repr__) return CharacterBase.prototype.__repr__.call(this);
            return "<" + __name__ + "." + this.constructor.name + " #" + this.ρσ_object_id + ">";
        };
        FakeCharacter.prototype.__str__ = function __str__ () {
            if(CharacterBase.prototype.__str__) return CharacterBase.prototype.__str__.call(this);
return this.__repr__();
        };
        Object.defineProperty(FakeCharacter.prototype, "__bases__", {value: [CharacterBase]});
        

        character = null;
        function addDisplayButton() {
            var icon32, button, spell;
            icon32 = chrome.extension.getURL("images/icons/icon32.png");
            button = ρσ_interpolate_kwargs.call(E, E.a, [ρσ_interpolate_kwargs.call(E, E.span, [ρσ_interpolate_kwargs.call(E, E.img, [ρσ_desugar_kwargs({class_: "ct-beyond20-icon", src: icon32, style: "margin-right: 10px;"})]), "Display Spell Card on VTT"].concat([ρσ_desugar_kwargs({class_: "label"})]))].concat([ρσ_desugar_kwargs({class_: "ct-beyond20-roll button-alt", href: "#"})]));
            spell = new Spell($("body"), character);
            $(".page-heading__content").after(button);
            $(".ct-beyond20-roll").css((function(){
                var ρσ_d = {};
                ρσ_d["float"] = "right";
                ρσ_d["display"] = "inline-block";
                return ρσ_d;
            }).call(this));
            $(".ct-beyond20-roll").on("click", (function() {
                var ρσ_anonfunc = function (event) {
                    spell.display();
                };
                if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                    __argnames__ : {value: ["event"]}
                });
                return ρσ_anonfunc;
            })());
        };

        function documentLoaded(settings) {
            var spell_name;
            character = ρσ_interpolate_kwargs_constructor.call(Object.create(FakeCharacter.prototype), false, FakeCharacter, ["spell"].concat([ρσ_desugar_kwargs({global_settings: settings})]));
            if (isRollButtonAdded()) {
                chrome.runtime.sendMessage((function(){
                    var ρσ_d = {};
                    ρσ_d["action"] = "reload-me";
                    return ρσ_d;
                }).call(this));
            } else {
                addDisplayButton();
                spell_name = $(".page-title").text().trim();
                if (settings["subst-dndbeyond"]) {
                    injectDiceToRolls(".spell-details .more-info-content", character, spell_name);
                }
            }
        };
        if (!documentLoaded.__argnames__) Object.defineProperties(documentLoaded, {
            __argnames__ : {value: ["settings"]}
        });

        function updateSettings() {
            var new_settings = (arguments[0] === undefined || ( 0 === arguments.length-1 && arguments[arguments.length-1] !== null && typeof arguments[arguments.length-1] === "object" && arguments[arguments.length-1] [ρσ_kwargs_symbol] === true)) ? updateSettings.__defaults__.new_settings : arguments[0];
            var ρσ_kwargs_obj = arguments[arguments.length-1];
            if (ρσ_kwargs_obj === null || typeof ρσ_kwargs_obj !== "object" || ρσ_kwargs_obj [ρσ_kwargs_symbol] !== true) ρσ_kwargs_obj = {};
            if (Object.prototype.hasOwnProperty.call(ρσ_kwargs_obj, "new_settings")){
                new_settings = ρσ_kwargs_obj.new_settings;
            }
            if (new_settings) {
                if (character !== null) {
                    character.setGlobalSettings(new_settings);
                }
            } else {
                getStoredSettings((function() {
                    var ρσ_anonfunc = function (saved_settings) {
                        documentLoaded(saved_settings);
                        updateSettings(saved_settings);
                    };
                    if (!ρσ_anonfunc.__argnames__) Object.defineProperties(ρσ_anonfunc, {
                        __argnames__ : {value: ["saved_settings"]}
                    });
                    return ρσ_anonfunc;
                })());
            }
        };
        if (!updateSettings.__defaults__) Object.defineProperties(updateSettings, {
            __defaults__ : {value: {new_settings:null}},
            __handles_kwarg_interpolation__ : {value: true},
            __argnames__ : {value: ["new_settings"]}
        });

        function handleMessage(request, sender, sendResponse) {
            if ((request.action === "settings" || typeof request.action === "object" && ρσ_equals(request.action, "settings"))) {
                if ((request.type === "general" || typeof request.type === "object" && ρσ_equals(request.type, "general"))) {
                    updateSettings(request.settings);
                }
            } else if ((request.action === "open-options" || typeof request.action === "object" && ρσ_equals(request.action, "open-options"))) {
                alertFullSettings();
            }
        };
        if (!handleMessage.__argnames__) Object.defineProperties(handleMessage, {
            __argnames__ : {value: ["request", "sender", "sendResponse"]}
        });

        chrome.runtime.onMessage.addListener(handleMessage);
        chrome.runtime.sendMessage((function(){
            var ρσ_d = {};
            ρσ_d["action"] = "activate-icon";
            return ρσ_d;
        }).call(this));
        updateSettings();
    })();
})();