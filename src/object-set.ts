type Comparable<T> = {
    equals(b: T): boolean
};


class ObjectSet<T> {

    private _set: Set<T & Comparable<T>>;

    constructor(values: (T & Comparable<T>)[]) {
        this._set = new Set(values);
    }

    add(value: T & Comparable<T>) {
        this._set.forEach(obj => {
            if (obj.equals(value)) {
                return this;
            }
        });

        this._set.add(value);
        return this;
    }

    delete(value: T & Comparable<T>) {

        this._set.forEach(obj => {
            if (obj.equals(value)) {
                this._set.delete(obj);
                return true;
            }
        })
        
        return false;
    }
    
    has(value: T & Comparable<T>) {
        this._set.forEach(obj => {
            if (obj.equals(value)) {
                return true;
            }
        });

        return false;
    }

    size() {
        return this._set.size;
    }

    forEach(callback: (value1: T & Comparable<T>, value2: T & Comparable<T>, set: Set<T & Comparable<T>>) => void) {
        this._set.forEach(callback);
    }

    clear() {
        this._set.clear();
    }

}

export {
    Comparable,
    ObjectSet
};