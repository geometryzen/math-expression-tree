import { car, cdr, cons, equal_cons_cons, is_atom, is_cons, is_nil, is_singleton, items_to_cons, nil, U } from "../src/tree";

class Atom implements U {
    readonly name = "Atom";
    constructor(readonly value: string) {

    }
    contains(needle: U): boolean {
        return this.equals(needle);
    }
    equals(other: U): boolean {
        if (other === this) {
            return true;
        }
        else {
            if (other instanceof Atom) {
                return this.value === other.value;
            }
            else {
                return false;
            }
        }
    }
    isCons(): boolean {
        return false;
    }
    isNil(): boolean {
        return false;
    }
    toString(): string {
        return `Atom('${this.value}')`;
    }
    pos?: number;
    end?: number;
}

test("is_nil(nil)", function () {
    expect(is_nil(nil)).toBe(true);
});
test("is_singleton", function () {
    expect(is_singleton(nil)).toBe(false);
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    expect(is_singleton(X)).toBe(true);
    expect(is_singleton(Y)).toBe(false);
});
test("name", function () {
    expect(nil.name).toBe("Nil");
    const foo = new Atom("foo");
    expect(foo.name).toBe("Atom");
    const X = items_to_cons(foo);
    expect(X.name).toBe("Cons");
});
test("is_atom", function () {
    const foo = new Atom("foo");
    expect(is_atom(foo)).toBe(true);
    expect(is_atom(nil)).toBe(false);
    const X = items_to_cons(foo);
    expect(is_atom(X)).toBe(false);
});
test("is_cons", function () {
    const foo = new Atom("foo");
    expect(is_cons(foo)).toBe(false);
    expect(is_cons(nil)).toBe(false);
    const X = items_to_cons(foo);
    expect(is_cons(X)).toBe(true);
    expect(is_cons(void 0)).toBe(false);
});
test("car", function () {
    expect(nil.car).toBe(nil);
    const foo = new Atom("foo");
    const X = items_to_cons(foo);
    expect(X.car).toBe(foo);
});
test("cdr", function () {
    expect(nil.cdr).toBe(nil);
    const foo = new Atom("foo");
    const X = items_to_cons(foo);
    expect(X.cdr).toBe(nil);
});
test("length", function () {
    expect(nil.length).toBe(0);
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    expect(X.length).toBe(1);
    expect(Y.length).toBe(2);
});
test("equal_cons_cons", function () {
    expect(nil.length).toBe(0);
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    expect(equal_cons_cons(nil, nil)).toBe(true);
    expect(equal_cons_cons(nil, X)).toBe(false);
    expect(equal_cons_cons(nil, Y)).toBe(false);
    expect(equal_cons_cons(X, nil)).toBe(false);
    expect(equal_cons_cons(X, X)).toBe(true);
    expect(equal_cons_cons(X, Y)).toBe(false);
    expect(equal_cons_cons(Y, nil)).toBe(false);
    expect(equal_cons_cons(Y, X)).toBe(false);
    expect(equal_cons_cons(Y, Y)).toBe(true);
});
test("isCons()", function () {
    expect(nil.isCons()).toBe(false);
    const foo = new Atom("foo");
    const X = items_to_cons(foo);
    expect(X.isCons()).toBe(true);
});
test("Cons.isNil()", function () {
    expect(nil.isNil()).toBe(true);
    const foo = new Atom("foo");
    const X = items_to_cons(foo);
    expect(X.isNil()).toBe(false);
});
test("Cons.contains(needle: U): boolean", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    expect(nil.contains(foo)).toBe(false);
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    const Z = items_to_cons(X, bar);
    expect(X.contains(foo)).toBe(true);
    expect(X.contains(bar)).toBe(false);
    expect(X.contains(X)).toBe(true);
    expect(Y.contains(foo)).toBe(true);
    expect(Y.contains(bar)).toBe(true);
    expect(Z.contains(foo)).toBe(true);
    expect(Z.contains(bar)).toBe(true);
});
test("Cons.equals(other: U): boolean", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    expect(nil.contains(foo)).toBe(false);
    const X = items_to_cons(foo);
    const Y = items_to_cons(foo, bar);
    const Z = items_to_cons(X, bar);
    expect(X.equals(foo)).toBe(false);
    expect(X.equals(bar)).toBe(false);
    expect(X.equals(X)).toBe(true);
    expect(X.equals(Y)).toBe(false);
    expect(Y.equals(foo)).toBe(false);
    expect(Y.equals(bar)).toBe(false);
    expect(Z.equals(foo)).toBe(false);
    expect(Z.equals(bar)).toBe(false);
});
test("Cons.base", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.base).toBe(bar);
});
test("Cons.expo", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.expo).toBe(baz);
});
test("Cons.toString()", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.toString()).toBe("(Atom('foo') (Atom('bar') (Atom('baz') ())))");
    expect(nil.toString()).toBe("()");
});
test("Cons.head", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.head).toBe(foo);
});
test("Cons.tail", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    const tail = X.tail();
    expect(tail.length).toBe(2);
    expect(tail[0]).toBe(bar);
    expect(tail[1]).toBe(baz);
});
test("Cons.opr", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.opr).toBe(foo);
});
test("Cons.arg", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.arg).toBe(bar);
});
test("Cons.lhs", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.lhs).toBe(bar);
});
test("Cons.rhs", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.rhs).toBe(baz);
});
test("Cons.item(index: number): U", function () {
    const foo = new Atom("foo");
    const bar = new Atom("bar");
    const baz = new Atom("baz");
    const X = items_to_cons(foo, bar, baz);
    expect(X.item(0)).toBe(foo);
    expect(X.item(1)).toBe(bar);
    expect(X.item(2)).toBe(baz);
});
test("cons(car: U, cdr: U): Cons", function () {
    expect(nil.car).toBe(nil);
    const foo = new Atom("foo");
    const X = cons(foo, nil);
    expect(X.car).toBe(foo);
});
test("car(node:U): U", function () {
    expect(car(nil)).toBe(nil);
    const foo = new Atom("foo");
    const X = cons(foo, nil);
    expect(car(X)).toBe(foo);
});
test("cdr(node:U): U", function () {
    expect(cdr(nil)).toBe(nil);
    const foo = new Atom("foo");
    const X = cons(foo, nil);
    expect(cdr(X)).toBe(nil);
});
