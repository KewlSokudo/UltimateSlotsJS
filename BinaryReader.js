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
    Seek(offset, origin = null) {
        if (origin != null){
            this.position = origin + offset;
        } else {
            this.position += offset;
        }
    }
    ReadChar() {
        this.position++;
        return String.fromCharCode(Number(this.stream[this.position-1]));
    }
    ReadChars(count) {
        var chars = [];
        for (var i=0; i<count; i++){
            chars.push(this.ReadChar());
        }
        return chars;
    }
    ReadByte(){
        this.position++;
        return this.stream[this.position-1];
    }
    ReadUInt32(){
        var hex0 = this.ReadByte();
        var hex1 = this.ReadByte();
        var hex2 = this.ReadByte();
        var hex3 = this.ReadByte();
        return new Number((hex0 | (hex1 << 8) | (hex2 << 16) | (hex3 << 24)))
    }
}