//console.log("test");
const MutedWords = [ "mute", "muted", "silent", "silence", "nosound", "no sound", "empty", "blank" ];
var fullReplace = false;

var SelectedCharacter;
var CustomName;
var BoxingDescription;
var AnnCallHash;
var NewSeriesID;
var ChosenSlots = [ "04", "05", "06", "07" ];

var charList = document.getElementById("chars");
Promise.all([ fetch('characterIDs.txt').then(x => x.text()) ]).then(([sampleResp]) => {
    var entry = "";
    for (var i=0; i < sampleResp.length; i++){
        if (sampleResp[i] != "\n"){
            entry += sampleResp[i];
        }
        else {
            var newOption = document.createElement("option");
            newOption.text = entry;
            charList.appendChild(newOption);
            entry = "";
        }

    }
  });

function changeChar() {
    SelectedCharacter = charList.options[charList.selectedIndex].text;
    console.log(SelectedCharacter);
}



function GenerateBtn() {
    let res = prompt("Output Filename:");

    xmsbtFile = CreateMSBT(["07"], "sonic", "Shadow", "The Ultimate\nLife Form");
    prcxmlFile = CreatePRCXML(["07"], 44);

    document.getElementById("allPage").innerHTML += res + "\n";
    document.getElementById("allPage").innerHTML += xmsbtFile + prcxmlFile;
    console.log(xmsbtFile);
    console.log(prcxmlFile);
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
            xmsbt.appendChild(createEntry(`nam_stage_name_${Slot}_sonic`, BoxingRingText));
        }
    }


   // Serialize and format
   var s = new XMLSerializer();
   finalXMSBT = s.serializeToString(xmlDoc);
   finalXMSBT = formatXml(finalXMSBT);
   //console.log(finalXMSBT);
   return finalXMSBT;
}
function CreatePRCXML(Slots, CharID, Series = "", AnnouncerHash = "0x1cc34a6c85") {
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
                if (!fullReplace) {
                    // nXX_index
                    slot = Slots[sl];
                    slotid = Number(slot).toString();
                    nslot = xmlDoc.createElement("byte")
                    nslot.setAttribute("hash", `n${slot}_index`)
                    nslot.appendChild(xmlDoc.createTextNode(slotid));
                    entry.appendChild(nslot);
                }

                if (AnnouncerHash != "" && AnnouncerHash != null){
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
            if (Series != "" && Series != null && fullReplace) {
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