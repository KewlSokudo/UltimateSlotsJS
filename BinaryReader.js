/*
    Reconstruction of C# BinaryReader class.
*/
const SeekOrigin = {
    Begin: 0,
    Current: 1,
    End: 2
}
class BinaryReader {
    constructor(stream) {
        this.position = 0;
        this.stream = stream;
    }
    Seek(offset, origin = null) { // Increments current offset position by value, otherwise moves to offset starting from point of origin
        if (origin != null){
            this.position = origin + offset;
        } else {
            this.position += offset;
        }
    }
    Tell() { // Returns current offset position
        return this.position;
    }
    Peek(pos, length = 1) { // Returns array of bytes from specified offset position, if length omitted returns single byte from offset.
        if (length > 1){
            var bytes = []
            for (var i=0; i<length; i++){
                bytes.push(this.stream.slice(pos,pos+i+1))
            }
            return bytes;
        }
        return this.stream[pos];
        
    }
    ReadChar() { // Returns a single char from byte
        return String.fromCharCode(Number(ReadByte()));
    }
    ReadChars(count) { // Returns char array from bytes the size of length
        var chars = [];
        for (var i=0; i<count; i++){
            chars.push(this.ReadChar());
        }
        return chars;
    }
    ReadString(length) { // Returns string from bytes the size of length
        return this.ReadChars(length).join("");
    }
    ReadByte(){ // Returns a single byte and increments position in stream
        this.position++;
        return this.stream[this.position-1];
    }
    ReadBytes(length){ // Returns array of bytes the size of length
        var bytes = []
        for (var i=0; i<length; i++){
            bytes.push(this.ReadByte());
        }
        return bytes;
    }
    ReadUInt32(){ // Returns a single UInt32 from current 4 bytes
        var hex0 = this.ReadByte();
        var hex1 = this.ReadByte();
        var hex2 = this.ReadByte();
        var hex3 = this.ReadByte();
        return new Number((hex0 | (hex1 << 8) | (hex2 << 16) | (hex3 << 24)))
    }
}