export class SlidingWindow<T> {
  array: T[];
  size: number;

  constructor(size: number) {
    this.array = [];
    this.size = size;
  }

  add(value: T) {
    if (this.array.length === this.size) {
      this.array.shift();
    }
    this.array.push(value);
  }

  get(index: number) {
    return this.array[index];
  }

  clear() {
    this.array = [];
  }

  get length() {
    return this.array.length;
  }

  getTrueRatio() {
    let total = 0;
    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i]) {
        total++;
      }
    }
    return total / this.size;
  }

  isFull() {
    return this.array.length >= this.size;
  }
}
