# UltimateSlotsJS
UltimateSlotsJS is a web-based/JavaScript port of the original C# version of [UltSlots](https://gamebanana.com/tools/12465), a tool for automating **custom nameplates** and **adding announcer calls** for individual costume slots.

Being written in JavaScript, UltimateSlotsJS can be used on any device that can access the web and browse files.
Try it out here: [https://kewlsokudo.github.io/UltimateSlotsJS](https://kewlsokudo.github.io/UltimateSlotsJS)

> **Note:** This tool is still a work-in-progress and may not work as expected. Support for both custom announcer calls and auto-zipping of the XML files is on the way.

## Usage:
1. Choose a mod-type
   - Single Costume Slot(s)
   - Full Character Replacement
2. Choose the character to replace by selecting their **Character ID** from the dropdown.
3. Input info you'd like to change for the slot/character _(i.e. **New Name**, **Boxing Ring Description**, **Series ID**)_.

   3.5. If using `Single Costume Slot(s)`, use the `+` and `-` buttons to set the amount of slots you'd like to change, then input the **Slot ID** you want to affect. _(i.e. `c06`, `c07`)_
4. Click `Generate UI Files` and save the `msg_name.xmsbt` + `ui_chara_db.prcml` files to their respective folders inside your mod.

   Ex:
     `\ui\message\msg_name.xmsbt`
     `\ui\param\database\ui_chara_db.prcxml`
> **Ensure that you click _"Allow"_ if asked to save multiple files.**
