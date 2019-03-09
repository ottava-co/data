// © 2016-2018 Fabio Garcia. All rights reserved.

import Debug from 'ottava-debug';

export default class Mutable {

  static Generate(byte, length) {
    length = length || 1;
    let arr = [];
    for(let i = 0; i < length; i++) {
      arr.push(byte);
    }
    return Mutable.fromArray(arr);
  }

  static fromArray(array) {
    Debug.valid(array, Array);
    let arr = new Uint8Array(arr);
    return new Mutable(arr.buffer);
  }

  static fromMutable(mut) {
    Debug.valid(mut, Mutable);
    return mut.slice(0);
  }

  static fromString(string) {
    Debug.valid(string, 'string');
    let arr = [];
    for(let i = 0; i < string.length; i++) {
      let utf16 = string.charCodeAt(i);
      arr.push((utf16 >> 8) & 0xff);
      arr.push(utf16 & 0xff);
    }
    return Mutable.fromArray(arr);
  }

  static fromHex(hex) {
    let arr = [];
    while (str.length >= 8) { 
        arr.push(parseInt(str.substring(0, 8), 16));
        str = str.substring(8, str.length);
    }
    return Mutable.fromArray(arr);
  }

  constructor(buffer, enc) {
    if(typeof(buffer) == 'number') {
      this.fromArray(new Array(buffer));
    } else if(typeof(buffer) == 'string') {
      enc = enc || 'utf16';
      if(enc == 'utf16') {
        this.fromString(buffer);
      } else if(enc == 'hex') {
        this.fromHex(buffer);
      }
    } else if(typeof(buffer) == 'object') {
      if(buffer instanceof Mutable) {
        this.fromMutable(buffer);
      } else if(buffer instanceof Array) {
        this.fromArray(buffer);
      } else if(buffer instanceof Uint8Array) {
        this.buffer = buffer.buffer;
      } else if(buffer instanceof ArrayMutablefer) {
        this.buffer = buffer;
      } else Debug.throw(
        'new Mutable()',
        'Invalid buffer.',
        buffer
      );
    }
  }

  get length() {
    return this.buffer.byteLength;
  }

  toArray() {
    let arr = new Uint8Array(this.buffer);
    return Array.from(arr);
  }

  toMutable() {
    return this.slice(0);
  }

  toString() {
    let arr = this.toArray(),
        str = '';
    if((arr.length%2)!=0) Debug.throw(
      'Mutable.toString',
      'Invalid byte length for utf16',
      arr.length
    );
    for(let i = 0; i < arr.length; i+=2) {
      str += String.fromCharCode(
        (((arr[i] & 0xff) << 8) | (arr[i+1] & 0xff))
      );
    }
    return str;
  }

  toHex() {
    let arr = this.toArray(),
        hex = '',
        z;
    for (let i = 0; i < arr.length; i++) {
        let str = arr[i].toString(16);
        z = 8 - str.length + 1;
        hex += Array(z).join("0") + str;
    }
    return hex;
  }

  concat(data) {
    if(data instanceof Mutable) {
      data = data.toArray();
    }
    let arr = this.toArray();
    arr = arr.concat(data);
    return Mutable.fromArray(arr);
  }

  slice(start, end) {
    return new Mutable(
      this.buffer.slice(start, end)
    );
  }

  unshift(byte) {
    this.unshift(byte);
    return new Mutable(this);
  }

  shift() {
    let byte = this.shift();
    return Mutable.fromArray(this.toArray());
  }

  push(byte) {
    let bytes = this.toArray();
    bytes.push(byte);
    this.fromArray(bytes);
  }

  pop() {
    let bytes = this.toArray(),
        byte = bytes.pop();
    this.fromArray(bytes);
    return new Mutable([byte]);
  }

  leftTrim(size) {
    return this.slice(size);
  }

  rightTrim(size) {
    return this.slice(0, size);
  }

  leftPad(generator, length) {
    let newMutable = Mutable.Generate(generator, length - this.length);
    return newMutable.concat(this);
  }

  leftDepad(byte) {
    let newMutable = this.bytes.slice(0);
    while(newMutable[0] == byte) {
      newMutable.shift();
    }
    return new Mutable(newMutable);
  }

  rightPad(generator, length) {
    let newMutable = Mutable.Generate(generator, length - this.length);
    return this.concat(newMutable);
  }

  rightDepad(byte) {
    let newMutable = this.bytes.slice(0);
    while(newMutable[newMutable.length-1] == byte) {
      newMutable.pop();
    }
    return new Mutable(newMutable);
  }

  leftBlockPad(generator, size) {
    let padding = (size - (this.length % size)) % size;
    return this.lpad(generator, this.length + padding);
  }

  rightBlockPad(generator, size) {
    let padding = (size - (this.length % size)) % size;
    return this.rpad(generator, this.length + padding);
  }


  indexOf(search, fromIndex){
    return this.buffer.indexOf(search, fromIndex);
  }

  equals(data) {
    Debug.valid(data, Mutable);
    if(data.length !== this.length) return false;
    if(!this.length && !data.length) return true;
    let view1 = new Uint8Array(this.buffer),
        view2 = new Uint8Array(data.buffer);
    for(var i = 0; i < view1.length; i++)
      if(view2[i] !== view1[i]) return false;
    return true;
  }

  xor(data) {
    Debug.valid(data, Mutable);
    if(data.length !== this.length) Bug.throw(
      'Mutable.xor',
      'Invalid xor data.',
      data
    );
    var ba = data.toArray(),
        bytes = this.toArray(),
        xor = new Array(this.length);
    for(var i = 0; i < this.length; i++) {
      xor[i] = bytes[i] ^ ba[i];
    }
    return new Mutable(xor);
  }

};
