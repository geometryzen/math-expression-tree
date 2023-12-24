/**
 * The handle for any expression in the system.
 */
export interface U {
    /**
     * Contains the name of the type.
     */
    readonly name: string;
    contains(needle: U): boolean;
    equals(other: U): boolean;
    isCons(): boolean;
    isNil(): boolean;
    readonly pos?: number;
    readonly end?: number;
}

/**
 * Determines whether a Cons expression contains a single item.
 * @param expr 
 * @returns 
 */
export function is_singleton(expr: Cons): boolean {
    if (nil === expr) {
        // Nope, it's the empty list.
        return false;
    }
    const cdr_expr = expr.cdr;
    if (nil === cdr_expr) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Symbolic expressions are built by connecting Cons structures.
 *
 * For example, (a * b + c) is built like this:
 * 
 * The car links go downwards, the cdr links go to the right.
 *
 *           _______      _______                                            _______      _______
 *          |CONS   |--->|CONS   |----------------------------------------->|CONS   |--->|NIL    |
 *          |       |    |       |                                          |       |    |       |
 *          |_______|    |_______|                                          |_______|    |_______|       
 *              |            |                                                  |
 *           ___v___      ___v___      _______      _______      _______     ___v___
 *          |SYM +  |    |CONS   |--->|CONS   |--->|CONS   |--->|NIL    |   |SYM c  |
 *          |       |    |       |    |       |    |       |    |       |   |       |
 *          |_______|    |_______|    |_______|    |_______|    |_______|   |_______|
 *                           |            |            |
 *                        ___v___      ___v___      ___v___
 *                       |SYM *  |    |SYM a  |    |SYM b  |
 *                       |       |    |       |    |       |
 *                       |_______|    |_______|    |_______|
 * 
 * A NIL is a special kind of Cons in which the isCons method returns false.
 * A SYM is never a cdr. There will be a CONS with a NIL cdr and a car containing the SYM.
 * 
 */
export class Cons implements U {
    #car: U | undefined;
    #cdr: U | undefined;
    constructor(car: U | undefined, cdr: U | undefined, readonly pos?: number, readonly end?: number) {
        this.#car = car;
        this.#cdr = cdr;
    }
    get name(): 'Cons' | 'Nil' {
        if (this.#car) {
            return 'Cons';
        }
        else {
            return 'Nil';
        }
    }
    /**
     * Returns the car property if it is defined, otherwise NIL.
     */
    get car(): U {
        if (this.#car) {
            return this.#car;
        }
        else {
            return nil;
        }
    }
    /**
     * Returns the cdr property if it is defined, otherwise NIL.
     */
    get cdr(): Cons {
        if (this.#cdr) {
            if (this.#cdr instanceof Cons) {
                return this.#cdr;
            }
            else {
                throw new Error();
            }
        }
        else {
            return nil;
        }
    }
    /**
     * Exactly the same as the cdr property. Used for code-as-documentation.
     */
    get argList(): Cons {
        return this.cdr;
    }
    /**
     * An convenience for cdr.car for use with (power base expo) expressions.
     */
    get base(): U {
        return this.argList.head;
    }
    /**
     * An convenience for cdr.cdr.car for use with (power base expo) expressions.
     */
    get expo(): U {
        return this.cdr.cdr.car;
    }
    contains(needle: U): boolean {
        if (this === needle || this.equals(needle)) {
            return true;
        }
        if (this.#car && this.#cdr) {
            return this.#car.contains(needle) || this.#cdr.contains(needle);
        }
        return false;
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (is_cons(other)) {
            return equal_cons_cons(this, other);
        }
        else {
            return false;
        }
    }
    isCons(): boolean {
        if (this.#car) {
            return true;
        }
        else {
            return false;
        }
    }
    isNil(): boolean {
        if (this.#car) {
            return false;
        }
        else {
            return true;
        }
    }
    public toString(): string {
        // If you call car or cdr you get an infinite loop because NIL is a Cons.
        const head = this.#car;
        const tail = this.#cdr;
        if (head) {
            return `(${head} ${tail})`;
        }
        else {
            return '()';
        }
    }
    /**
     * Provides an iterator over the Cons, returning the items is the list.
     * The first element returned will be car(cons).
     * The subsequent elements are obtained from walking the cdr's.
     * Hint: Using the ... operator inside [] returns all the items in the list.
     */
    public *[Symbol.iterator]() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let u: U = this;
        while (is_cons(u)) {
            yield u.car;
            u = u.cdr;
        }
    }
    /**
     * Exactly the same as the car property. Used for code-as-documentation.
     */
    get head(): U {
        return this.car;
    }
    /**
     * Return everything except the first item in the list.
     */
    tail(): U[] {
        if (this !== nil) {
            const cdr = this.#cdr;
            if (cdr && is_cons(cdr)) {
                return [...cdr];
            }
            else {
                return [];
            }
        }
        throw new Error("tail property is not allowed for the empty list.");
    }
    /**
     * Maps the elements of the list using a mapping function.
     */
    map(f: (a: U) => U): Cons {
        if (this !== nil) {
            const a = this.car;
            const b = this.cdr;
            return new Cons(f(a), is_cons(b) ? b.map(f) : b);
        }
        else {
            return nil;
        }
    }
    /**
     * Returns the length of the list.
     */
    get length(): number {
        // console.lg("Cons.length", "is_cons", is_cons(this), "is_nil", is_nil(this));
        if (this !== nil) {
            const argList = this.argList;
            if (is_cons(argList)) {
                return argList.length + 1;
            }
            else {
                return 1;
            }
        }
        else {
            return 0;
        }
    }
    /**
     * A convenience property for the method item(0).
     * A useful shortcut when working with operators.
     */
    get opr(): U {
        // TODO: this.car woul be more optimal.
        return this.item(0);
    }
    /**
     * A convenience property for the method item(1).
     * A useful shortcut when working with unary operators.
     */
    get arg(): U {
        return this.item(1);
    }
    /**
     * A convenience property for the method item(1).
     * A useful shortcut when working with binary operators.
     */
    get lhs(): U {
        return this.item(1);
    }
    /**
     * A convenience property for the method item(2).
     * A useful shortcut when working with binary operators.
     */
    get rhs(): U {
        return this.item(2);
    }
    /**
     * Returns the item at the specified (zero-based) index.
     * 
     * (item0 item1 item2 ...)
     */
    item(index: number): U {
        if (index >= 0 && this !== nil) {
            if (index === 0) {
                return this.car;
            }
            else {
                const argList = this.argList;
                if (is_cons(argList)) {
                    return argList.item(index - 1);
                }
            }
        }
        throw new Error("index out of bounds.");
    }
}

export function cons(car: U, cdr: U): Cons {
    if (cdr instanceof Cons) {
        return new Cons(car, cdr);
    }
    else {
        throw new Error();
    }
}

export function items_to_cons(...items: U[]): Cons {
    let node: Cons = nil;
    // Iterate in reverse order so that we build up a NIL-terminated list from the right (NIL).
    for (let i = items.length - 1; i >= 0; i--) {
        node = new Cons(items[i], node);
    }
    return node;
}

/**
 * The empty list.
 */
export const nil = new Cons(void 0, void 0);

export function is_atom(expr: U) {
    if (is_cons(expr)) {
        return false;
    }
    else if (is_nil(expr)) {
        return false;
    }
    else {
        return true;
    }
}

/**
 * Returns true if arg is a Cons and is not NIL.
 * For NIL testing, test for identical equality to NIL.
 */
export function is_cons(expr: U): expr is Cons {
    if (typeof expr === 'undefined') {
        return false;
    }
    else {
        if (expr instanceof Cons) {
            return !is_nil(expr);
        }
        else {
            return false;
        }
    }
}

export function is_nil(expr: U): boolean {
    if (expr instanceof Cons) {
        return expr.equals(nil);
    }
    else {
        return expr.equals(nil);
    }
}

/**
 * Returns the car property of the tree node if it is a Cons.
 * Otherwise, returns NIL.
 */
export function car(node: U): U {
    if (is_cons(node)) {
        return node.car;
    }
    else {
        return nil;
    }
}

/**
 * Returns the cdr property of the tree node if it is a Cons.
 * Otherwise, returns NIL.
 */
export function cdr(node: U): Cons {
    if (is_cons(node)) {
        return node.cdr;
    }
    else {
        return nil;
    }
}

export function equal_cons_cons(lhs: Cons, rhs: Cons): boolean {
    let p1: U = lhs;
    let p2: U = rhs;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (is_cons(p1) && is_cons(p2)) {
            if (p1.car.equals(p2.car)) {
                p1 = p1.cdr;
                p2 = p2.cdr;
                continue;
            }
            else {
                return false;
            }
        }
        if (is_cons(p1)) {
            return false;
        }
        if (is_cons(p2)) {
            return false;
        }
        if (p1.equals(p2)) {
            // They are equal if there is nowhere else to go.
            return true;
        }
        else {
            return false;
        }
    }
}
