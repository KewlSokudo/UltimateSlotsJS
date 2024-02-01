//console.log("test");
var Nus3Audio; // *
var Nus3Bank; // *
var SoundLabelInfo; // *
var NewAudioFile; // *
var NewSoundID;
var NewSoundLabel; // *

const MutedWords = [ "mute", "muted", "silent", "silence", "nosound", "no sound", "empty", "blank" ];
var fullReplace = false;
document.getElementById("series_id").style.display = "none";
document.getElementById("slots").style.display = "block";
function openSingle(){
    document.getElementById("series_id").style.display = "none";
    document.getElementById("slots").style.display = "block";
    document.getElementById("outside").style.width="500px";
    fullReplace = false;
}
function openFull(){
    document.getElementById("series_id").style.display = "block";
    document.getElementById("slots").style.display = "none";
    document.getElementById("outside").style.width="300px";
    fullReplace = true;
}

// Basic file input reading ...for Adding New Announcer Calls
function addAnnouncer(){
    var input = document.createElement('input');
    input.type = 'file';
    var input2 = document.createElement('input');
    input2.type = 'file';
    var input3 = document.createElement('input');
    input3.type = 'file';
    var input4 = document.createElement('input');
    input4.type = 'file';

    input.onchange = e => { 

        // getting a hold of the file reference
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            content = new Uint8Array(content);

            console.log( content );
            console.log (typeof content);

            //console.log ( content[0] );

            var content = new Blob([content], {type:"text/plain;charset=utf8"});
            //console.log ( content );
            //console.log ( typeof content );
            //saveAs(content, "returned_"+file.name);
        }
        
        input2.click();
        input2.onchange = e => {
            input3.click();
        }

    }

    input.click();
}


var CharacterName;
var CharacterID
var CustomName;
var BoxingDescription;
var AnnCallHash;
var NewSeriesID;
var ChosenSlots = [""];
var SlotCount = 1;

var charList = document.getElementById("chars");
var seriesList = document.getElementById("series");
Promise.all([ fetch('characterIDs.txt').then(x => x.text()), fetch('seriesIDs.txt').then(x => x.text()) ]).then(([characterIDs, seriesIDs]) => {
    var entry = "";
    for (var i=0; i < characterIDs.length; i++){
        if (characterIDs[i] != "\n"){
            entry += characterIDs[i];
        }
        else {
            var newOption = document.createElement("option");
            newOption.text = entry;
            charList.appendChild(newOption);
            entry = "";
        }

    }
    entry = "";
    for (var i=0; i < seriesIDs.length; i++){
        if (seriesIDs[i] != "\n"){
            entry += seriesIDs[i];
        }
        else {
            var newOption = document.createElement("option");
            newOption.text = entry;
            seriesList.appendChild(newOption);
            entry = "";
        }

    }
  });
function addSlot(){
    var newID = SlotCount;

    var div = document.createElement("div");
    div.setAttribute("id", "slot"+newID)

    var p = document.createElement("p");
    p.appendChild(document.createTextNode("C "))

    var textarea = document.createElement("textarea");
    textarea.setAttribute("name", "slottext"+newID);
    textarea.setAttribute("id", "slottext"+newID);
    textarea.setAttribute("cols", "5");
    textarea.setAttribute("rows", "1");
    textarea.setAttribute("onchange", "changeSlot(id)");
    var placeholder = ""+newID;
    if (newID < 10) {
        placeholder = "0"+newID;
    }
    textarea.setAttribute("placeholder", placeholder);
    p.appendChild(textarea);

    div.appendChild(p);
    //div.appendChild(document.createElement("br"));

    document.getElementById("slots").appendChild(div);

    ChosenSlots[newID] = textarea.value;
    SlotCount++;
    if (SlotCount > 18) {
        document.getElementById("outside").style.height = (780 + (43*(SlotCount-18))) + "px";
    } else { document.getElementById("outside").style.height = 780 }
}
function rmvSlot(){
    if (SlotCount > 1) {
        var currentID = SlotCount-1;

        var div = document.getElementById("slot"+currentID);
        div.remove();

        ChosenSlots.pop();
        SlotCount--;
        if (SlotCount > 18) {
            document.getElementById("outside").style.height = (780 + (43*(SlotCount-18))) + "px";
        } else { document.getElementById("outside").style.height = 780 }
    }
}
function changeSlot(id){
    var ob = document.getElementById(id);
    var invalidChars = /[^0-9]/gi
    if(invalidChars.test(ob.value)) {
            ob.value = ob.value.replace(invalidChars,"");
        }
    var idVal = Number(id.slice(8));
    var idText = "";
    var slotValue = Number(ob.value)
    if (slotValue < 10) { idText += 0 }
    idText += slotValue;
    if (ob.value != "" && ob.value != null) {
        ChosenSlots[idVal] = idText;
        console.log(ChosenSlots);
    }
}
// Text inputs changed events
function changeChar(self) {
    self.nextElementSibling.value=self.value;
    var txt;
    txt = charList.options[charList.selectedIndex].text;
    CharacterName = txt.slice(0, txt.indexOf(" "));
    CharacterID = txt.slice(txt.indexOf(" ")+1);
    console.log(CharacterID + CharacterName);
}
function changeName() {
    CustomName = document.getElementById("fname").value;
    console.log(CustomName);
}
function changeBoxing() {
    BoxingDescription = document.getElementById("boxingring").value;
    console.log(BoxingDescription);
}
function changeSeries() {
    NewSeriesID = document.getElementById("series").value;
    console.log(NewSeriesID);
}
function changeHash() {
    AnnCallHash = document.getElementById("announcerHash").value;
    console.log(AnnCallHash);
}



function GenerateBtn() {
    //let res = prompt("Output Filename:");
    var empty = false;

    // Check if missing requirements
    if (CharacterName == "" || CharacterName == null ||
        CharacterID == "" || CharacterID == null ||
        ((ChosenSlots.length <= 0 || ChosenSlots == null) && !fullReplace)){
        empty = true;
    }
    for (var i=0; i<ChosenSlots.length; i++){
        if ((ChosenSlots[i] == "" || ChosenSlots[i] == null) && !fullReplace) {
            empty = true;
        }
    }
    // Create XML files if requirements are met
    if (!empty){
        var slotArr = ["00"];
        if (!fullReplace) {slotArr = [...new Set(ChosenSlots)];} // Remove duplicates

        var annCall = AnnCallHash;
        if (annCall == "" || annCall == null) {
            annCall = "0x1cc34a6c85"; // (FIX/REWORK: make this grab the associated character's announcer call hash)
        }
        xmsbtFile = CreateMSBT(slotArr, CharacterName, CustomName, BoxingDescription);
        prcxmlFile = CreatePRCXML(slotArr, CharacterID, NewSeriesID, annCall);

        //document.getElementById("allPage").innerHTML += res + "\n";
        //document.getElementById("allPage").innerHTML += xmsbtFile + prcxmlFile;
        console.log(xmsbtFile);
        console.log(prcxmlFile);
        
        //

        // Make mod name depending on settings
        var ModName = CustomName + " [";
        if (fullReplace) {
            ModName += "All Slots]";
        } else {
            if (ChosenSlots.length == 1) {
                ModName += `c${ChosenSlots[0]}]`;
            } else {
                var _least = Infinity;
                var _max = 0;
                ChosenSlots.forEach(element => {
                    _least = Math.min(_least, Number(element));
                    _max = Math.max(_max, Number(element));
                });
                ModName += `c${String(_least).padStart(2, '0')} - c${String(_max).padStart(2, '0')}]`;
            }
        }

        var zip = new JSZip();

        // Zip ui_chara_db.prcxml
        if (!(fullReplace && AnnCallHash == "" && NewSeriesID == "")) { // Only output if needed
            var ui_chara_db = zip.folder(ModName + "/ui/param/database");
            ui_chara_db.file("ui_chara_db.prcxml", prcxmlFile.replaceAll("\t", "  "));
        }

        // Zip msg_name.xmsbt
        var msg_name = zip.folder(ModName + "/ui/message");
        var xmsbtData = [0xff, 0xfe]; // UTF-16 header
            for (var i = 0; i < xmsbtFile.length; ++i) {
                var code = xmsbtFile.charCodeAt(i);
                xmsbtData = xmsbtData.concat([code & 0xff, code / 256 >>> 0]);
            }
        msg_name.file("msg_name.xmsbt", xmsbtData, {base64: true});

        // Save file
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, ModName + ".zip");
        });
        

        //
    } 
    else {
        alert("ERROR: One or more required entries are empty.");
    }
}

function DownloadXML(filename, xmltext){
    var pom = document.createElement('a');

    var bb;
    switch (filename){
        case "ui_chara_db.prcxml":
            bb = new Blob([xmltext.replaceAll("\t", "  ")], {type: 'text/plain'});
            break;
        case "msg_name.xmsbt":
            {
                var bytes = [0xff, 0xfe]; // UTF-16 header

                for (var i = 0; i < xmltext.length; ++i) {
                    var code = xmltext.charCodeAt(i);
                    bytes = bytes.concat([code & 0xff, code / 256 >>> 0]);
                }
                bb = new Blob([new Uint8Array(bytes)], {type: 'text/csv;charset=UTF-16LE'});
                break;
            }
    }

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    pom.setAttribute('download', filename);

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true; 
    pom.classList.add('dragout');

    pom.click();
}

function CreateMSBT(Slots, CharName, NewName, BoxingRingText) {
    var Slot;
   CharName = CharName.toLowerCase();


   // Create XML file
   var parser = new DOMParser();
   var xmlDoc = parser.parseFromString("<?xml version=\"1.0\" encoding=\"utf-16\"?>\n<xmsbt></xmsbt>", "text/xml");
   var xmsbt = xmlDoc.getElementsByTagName("xmsbt")[0]

    for (var i=0; i<Slots.length; i++){
        Slot = Slots[i];
        // chr_1
        xmsbt.appendChild(createEntry(`nam_chr1_${Slot}_${CharName}`, NewName))

        // chr_2
        xmsbt.appendChild(createEntry(`nam_chr2_${Slot}_${CharName}`, NewName.toUpperCase()))

        // chr_3
        if (fullReplace) {
            xmsbt.appendChild(createEntry(`nam_chr3_00_${CharName}`, NewName.toUpperCase()))
        }
        
        // stage_name
        if (BoxingRingText != "" && BoxingRingText != null) {
            xmsbt.appendChild(createEntry(`nam_stage_name_${Slot}_${CharName}`, BoxingRingText.replace("\n", "\r\n")));
        }
    }


   // Serialize and format
   var s = new XMLSerializer();
   finalXMSBT = s.serializeToString(xmlDoc);
   finalXMSBT = formatXml(finalXMSBT);
   //console.log(finalXMSBT);
   return finalXMSBT;
}
function CreatePRCXML(Slots, CharID, Series = "", AnnouncerHash = "") {
   // Create XML file
   var parser = new DOMParser();
   var xmlDoc = parser.parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<struct></struct>", "text/xml");

   var struct = xmlDoc.getElementsByTagName("struct")[0]

   var list = xmlDoc.createElement("list");
   list.setAttribute("hash", "db_root");

   var entry;

   // Empty entry
    for (var i=0; i<=120; i++){
        entry = xmlDoc.createElement("hash40")
        entry.setAttribute("index", i.toString());
        entry.appendChild(xmlDoc.createTextNode("dummy"))

        // Custom entry
        if (i == CharID) {
            entry = xmlDoc.createElement("struct");
            entry.setAttribute("index", i.toString());

            for (var sl=0; sl<Slots.length; sl++) {
                var slot = Slots[sl];
                var slotid = Number(slot).toString();
                if (!fullReplace) {
                    // nXX_index
                    
                    nslot = xmlDoc.createElement("byte")
                    nslot.setAttribute("hash", `n${slot}_index`)
                    nslot.appendChild(xmlDoc.createTextNode(slotid));
                    entry.appendChild(nslot);
                }
                // Mute announcer
                var muteAnnouncer = false;
                MutedWords.forEach(element => {
                    if (AnnouncerHash.toLowerCase() == element){
                        muteAnnouncer = true;
                    }
                });
                if (!muteAnnouncer){
                    // characall_label
                    hash = xmlDoc.createElement("hash40")
                    hash.setAttribute("hash", `characall_label_c${slot}`);
                    hash.appendChild(xmlDoc.createTextNode(AnnouncerHash))
                    entry.appendChild(hash);

                    // characall_label_article
                    hash = xmlDoc.createElement("hash40")
                    hash.setAttribute("hash", `characall_label_article_c${slot}`);
                    hash.appendChild(xmlDoc.createTextNode(AnnouncerHash))
                    entry.appendChild(hash);
                }
            }

            // ui_series_id
            if ((Series != "" && Series != null) && fullReplace) {
                hash = xmlDoc.createElement("hash40")
                hash.setAttribute("hash", "ui_series_id");
                hash.appendChild(xmlDoc.createTextNode(Series))
                entry.appendChild(hash);
            }
        }

        list.appendChild(entry);
    }

   struct.appendChild(list);

   // Serialize and format
   var s = new XMLSerializer();
   finalPRCXML = s.serializeToString(xmlDoc);
   finalPRCXML = formatXml(finalPRCXML);
   //console.log(finalPRCXML);
   return finalPRCXML;
}

function createEntry(label, string){ // Creates xmsbt entry
    var xml = new Document();
    ent = xml.createElement("entry");
    ent.setAttribute("label", label);
    txtN = xml.createElement("text");
    entTxt = xml.createTextNode(string);
    txtN.appendChild(entTxt);
    ent.appendChild(txtN);
    return ent;
}

function formatXml(xml, tab) { // tab = optional indent value, default is tab (\t)
    // https://stackoverflow.com/a/49458964
    var formatted = '', indent= '';
    tab = tab || '\t';
    xml.split(/>\s*</).forEach(function(node) {
        if (node.match( /^\/\w/ )) indent = indent.substring(tab.length); // decrease indent by one 'tab'
        formatted += indent + '<' + node + '>\r\n';
        if (node.match( /^<?\w[^>]*[^\/]$/ )) indent += tab;              // increase indent
    });
    return formatted.substring(1, formatted.length-3);
}