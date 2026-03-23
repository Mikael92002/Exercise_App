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

  get(index: number){
    return this.array[index];
  }

  clear(){
    this.array = [];
  }
}
