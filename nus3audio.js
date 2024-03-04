class Entry {
    constructor(){
        this.magic = [];
        this.size = size;
    }
    Read(f) {
        this.magic = f.ReadChars(4);
        this.size = f.ReadUInt32();
    }
}

class FileStorage {
    constructor(fileOffset, fileSize){
        this.fileOffset = fileOffset;
        this.fileSize = fileSize;
    }    
}
class HEADER extends Entry { }

class AUDIINDX extends Entry {
    constructor(){
        this.count = 0;
    }
    Read(f) {
        this.magic = f.ReadChars(8);
        this.size = f.ReadUInt32();
        this.count = f.ReadUInt32();
    }
}

class TNID extends Entry {
    constructor(){
        this.trackNumbers = [];
        this.data = [];
    }
    get TrackNumbers(){
        return this.trackNumbers;
    }
    Read(f, AudiindxCount) {
        super(Read(f));
        if (this.size >= AudiindxCount * 4)
        {
            for (var i=0; i < AudiindxCount; i++){
                this.trackNumbers[i] = f.ReadUInt32();
            }
        }
        else
        {
            for (var i=0; i < this.size; i++) {
                this.data[i] = f.ReadByte();
            }
        }
    }
}
class NMOF extends Entry {
    constructor(){
        this.names = [];
        this.data = [];
    }
    Read(f, AudiindxCount){
        super(Read(f));
        if (this.size > AudiindxCount * 4)
        {
            for (var i = 0; i < AudiindxCount; i++)
            {
                this.names[i] = f.ReadUInt32();
            }
        }
        else
        {
            for (var i = 0; i < this.size; i++)
            {
                this.data[i] = f.ReadByte();
            }
        }
    }
}
class ADOF extends Entry {
    constructor(){
        this.fileEntries = [];
        this.data = []
    }
    Read(f, AudiindxCount){
        super(Read(f));
        if (this.size >= AudiindxCount * 4)
        {
            for (var i = 0; i < AudiindxCount; i++)
            {
                var fileOffset = f.ReadUInt32();
                var fileSize = f.ReadUInt32();
                this.fileEntries[i] = new FileStorage(fileOffset, fileSize);
            }
        }
        else
        {
            data = new byte[size];
            for (var i = 0; i < size; i++)
            {
                data[i] = f.ReadByte();
            }
        }
    }
}
class TNNM extends Entry {
    constructor(){
        this.string_section = [];
    }
    Read(f){
        super(Read(f));
        var temp_hold = [];
        var tone_name = "";
        for (var i=0; i < this.size; i++){
            var res = f.ReadByte();
            if (res != 0x00){
                tone_name += String.fromCharCode(Number(res));
            }
            else {
                temp_hold.push(tone_name);
                tone_name = "";
            }
        }
        this.string_section = temp_hold;
    }
}
class JUNK extends Entry {
    constructor(){
        this.padding = [];
    }
    Read(f) {
        super(Read(f));
        for (var i=0; i < this.size; i++){
            this.padding[i] f.ReadByte();
        }
    }
}
class PACK extends Entry { }

class FileEntry {
    constructor(){
        this.toneName = "";
        this.fileData = [];
    }
}


class nus3audio {
    constructor(bytes){
        var file = new BinaryReader(bytes);

        this.head = new HEADER();
        this.head.Read(file);

        this.audi = new AUDIINDX();
        this.audi.Read(file);

        this.tnid = new TNID();
        this.tnid.Read(file, this.audi.count);

        this.nmof = new NMOF();
        this.nmof.Read(file, this.audi.count);

        this.adof = new ADOF();
        this.adof.Read(file, this.audi.count);

        this.tnnm = new TNNM();
        this.tnnm.Read(file);

        this.junk = new JUNK();
        this.junk.Read(file);

        this.pack = new PACK();
        this.pack.Read(file);

        this.files = [];


        for (var i=0; i < this.adof.fileEntries.length; i++){
            file.Seek(this.adof.fileEntries[i].fileOffset, SeekOrigin.Begin)
            var entry = new FileEntry();
            
            entry.toneName = this.tnnm.string_section[i];
            entry.fileData = file.ReadBytes(this.adof.fileEntries[i].fileSize);

            this.files.push(entry);

        }

        //file.Close();
    }
}